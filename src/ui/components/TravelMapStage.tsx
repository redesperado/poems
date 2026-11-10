import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationData } from '../../types/location';
import { PoetData } from '../../types/poet';
import { PoemData } from '../../types/poem';
import { MAJOR_CITIES, CityCulturalData } from '../../data/cities';
import { soundEngine } from '../../engine/audio/soundEngine';
import { CityDetailModal } from './CityDetailModal';
import { WorldChronicleDrawer } from './WorldChronicleDrawer';
import {
  TANG_EMPIRE_BORDER,
  SONG_EMPIRE_BORDER,
  TANG_CIRCUITS_DIVISIONS,
  SONG_ROUTES_DIVISIONS,
} from '../../data/geoHeritage';
import {
  getPoetLocationsAtYear,
  WorldPoet,
} from '../../engine/world/poetsWorld';
import {
  getChroniclesUpToYear,
  getCurrentYearHighlight,
} from '../../engine/world/chronicle';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  BookOpen,
  Layers,
  Shield,
} from 'lucide-react';

interface TravelMapStageProps {
  currentLocation: LocationData;
  dynasty: 'tang' | 'song';
  onTravel: (locationId: string) => void;
  unlockedPoemIds: string[];
  currentYear?: number;
  currentPoet?: PoetData;
  activePoems?: PoemData[];
  onSelectPoemForPlay?: (poem: PoemData) => void;
  unlockedArtifactIds?: string[];
  onCollectArtifact?: (artifactId: string) => void;
}

// 长江与大运河核心水路节点 (水路·扁舟判定)
const WATERWAY_LOCATIONS = new Set([
  'kuizhou', 'baidicheng',
  'jiangxia', 'huanghelou',
  'xunyang', 'lu_shan',
  'jinling',
  'guangling', 'yangzhou',
  'gusu',
  'linan',
  'xiangjiang', 'changsha',
]);

function getTravelMode(fromId: string, toId: string): 'water' | 'land' {
  if (WATERWAY_LOCATIONS.has(fromId) && WATERWAY_LOCATIONS.has(toId)) {
    return 'water';
  }
  if (['baidicheng', 'huanghelou', 'lu_shan', 'xunyang'].includes(toId) && WATERWAY_LOCATIONS.has(fromId)) {
    return 'water';
  }
  return 'land';
}

// 历史真实古代官道线网 (连接十六大名城，角色行历通道)
const ANCIENT_ROADS: Array<[string, string]> = [
  ['chang_an', 'jiangyou'], // 剑阁蜀道 (连通关中与巴蜀)
  ['jiangyou', 'chengdu'], // 锦官城官道
  ['chengdu', 'kuizhou'], // 巴峡道
  ['chang_an', 'luoyang'], // 两京官道 (经潼关)
  ['luoyang', 'bianjing'], // 中原通衢
  ['luoyang', 'taiyuan'], // 晋阳官道
  ['bianjing', 'youzhou'], // 幽燕北道
  ['bianjing', 'guangling'], // 汴河运道
  ['kuizhou', 'jiangxia'], // 荆楚江道
  ['jiangxia', 'xunyang'], // 浔阳江路
  ['xunyang', 'jinling'], // 江南江道
  ['xunyang', 'guangzhou'], // 大庾岭南岭官道
  ['jinling', 'guangling'], // 渡江路
  ['jinling', 'jingxian'], // 宣城桃花潭路
  ['guangling', 'gusu'], // 江南水驿
  ['gusu', 'linan'], // 钱塘官道
];

export const TravelMapStage: React.FC<TravelMapStageProps> = ({
  currentLocation,
  dynasty,
  onTravel,
  unlockedPoemIds,
  currentYear: currentYearProp,
  currentPoet,
  activePoems,
  onSelectPoemForPlay,
  unlockedArtifactIds,
  onCollectArtifact,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // 游历状态播报与动态巡游 (TODO-POL-01)
  const [travelNotice, setTravelNotice] = useState<{
    isTraveling: boolean;
    mode: 'water' | 'land';
    text: string;
  } | null>(null);

  const prevLocationIdRef = useRef<string>(currentLocation.id);
  const travelPolylineRef = useRef<L.Polyline | null>(null);

  // 地图底图样式模式:
  // 'relief' (真实华夏山川地貌切片) | 'satellite' (真实遥感影像切片) | 'silk' (青绿绢本金字塔切片) | 'carto' (水墨工笔舆图切片)
  const [basemapStyle, setBasemapStyle] = useState<'relief' | 'satellite' | 'silk' | 'carto'>('relief');

  // 当前实时缩放级别
  const [zoomLevel, setZoomLevel] = useState<number>(5.5);

  // 行政区域虚线图层显示状态
  const [showAdministrativeLines, setShowAdministrativeLines] = useState<boolean>(true);

  // 选中的城市人文详情弹窗
  const [activeCityDetail, setActiveCityDetail] = useState<CityCulturalData | null>(null);

  // 选中的同行诗人详情浮窗
  const [selectedPoetDossier, setSelectedPoetDossier] = useState<{
    poet: WorldPoet;
    cityId: string;
    cityName: string;
    status: string;
    recentWork?: string;
    age: number;
  } | null>(null);

  // 玩家角色 Leaflet Marker 与图层分组引用
  const playerMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.Layer | null>(null);
  const administrativeLinesGroupRef = useRef<L.LayerGroup | null>(null);
  const roadsGroupRef = useRef<L.LayerGroup | null>(null);
  const citiesGroupRef = useRef<L.LayerGroup | null>(null);
  const poetsGroupRef = useRef<L.LayerGroup | null>(null);

  // 当前年份 (优先采用全局游戏年份，若无则使用代表性高光年份)
  const currentYear = useMemo(() => {
    if (currentYearProp) return currentYearProp;
    return dynasty === 'tang' ? 744 : 1082;
  }, [currentYearProp, dynasty]);

  // 获取世界纪事播报
  const chronicles = useMemo(() => getChroniclesUpToYear(dynasty, currentYear), [dynasty, currentYear]);
  const activeHighlight = useMemo(() => getCurrentYearHighlight(dynasty, currentYear), [dynasty, currentYear]);

  // 获取同时代其他文人历史坐标
  const otherPoets = useMemo(() => {
    return getPoetLocationsAtYear(dynasty, currentYear, dynasty === 'tang' ? 'li_bai' : 'su_shi');
  }, [dynasty, currentYear]);

  // 城市与地点坐标映射 (经度纬度反转为 [lat, lng])
  const getCityLatLng = useCallback((cityId: string): [number, number] => {
    const city = MAJOR_CITIES[cityId];
    if (city) {
      return [city.coordinates[1], city.coordinates[0]];
    }
    // 兼容别名
    if (cityId === 'sichuan') return [31.78, 104.75];
    if (cityId === 'huanghelou') return [30.54, 114.3];
    if (cityId === 'lu_shan') return [29.56, 115.98];
    if (cityId === 'baidicheng') return [31.04, 109.57];
    if (cityId === 'yangzhou') return [32.39, 119.41];
    return [34.34, 108.94]; // 默认长安
  }, []);

  // 聚焦定位某个城市 (点击世界纪事或名城标签时平滑飞跃定位)
  const handleFocusCity = useCallback((cityId: string) => {
    const latLng = getCityLatLng(cityId);
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.flyTo(latLng, 7.5, {
      duration: 1.2,
      easeLinearity: 0.25,
    });

    const cityObj = MAJOR_CITIES[cityId];
    if (cityObj) {
      setActiveCityDetail(cityObj);
    }
  }, [getCityLatLng]);

  // 生成主角棋子 DivIcon (支持四大文人自适应头像与水路扁舟/陆路策马状态)
  const createPlayerIcon = useCallback(
    (
      poet?: PoetData,
      d?: 'tang' | 'song',
      travelStatus?: { isTraveling: boolean; mode: 'water' | 'land' }
    ) => {
      let poetShortName = '文宗';
      if (poet?.id === 'li_bai') poetShortName = '太白';
      else if (poet?.id === 'du_fu') poetShortName = '少陵';
      else if (poet?.id === 'su_shi') poetShortName = '东坡';
      else if (poet?.id === 'li_qingzhao') poetShortName = '易安';
      else if (poet?.name_cn) poetShortName = poet.name_cn.slice(-2);
      else if (d === 'tang') poetShortName = '太白';
      else poetShortName = '东坡';

      const isTraveling = travelStatus?.isTraveling;
      const mode = travelStatus?.mode || 'land';

      let badgeText = '当前驻足';
      let badgeClass = 'bg-amber-600 text-white border-amber-300';
      let iconEmoji = '';

      if (isTraveling) {
        if (mode === 'water') {
          badgeText = '顺江扁舟';
          badgeClass = 'bg-teal-700 text-teal-50 border-teal-300 animate-pulse';
          iconEmoji = '🛶';
        } else {
          badgeText = '策马驿道';
          badgeClass = 'bg-amber-700 text-amber-50 border-amber-300 animate-pulse';
          iconEmoji = '🐎';
        }
      }

      return L.divIcon({
        className: 'custom-div-icon pointer-events-none z-30',
        html: `
          <div class="relative flex flex-col items-center select-none transition-all">
            ${
              isTraveling
                ? `
              <div class="absolute -inset-4 rounded-full ${
                mode === 'water' ? 'bg-teal-400/40' : 'bg-amber-500/40'
              } animate-ping"></div>
            `
                : `
              <div class="absolute -inset-3.5 rounded-full bg-amber-500/35 animate-ping"></div>
            `
            }
            
            <div class="w-10 h-10 rounded-full bg-gradient-to-br ${
              isTraveling
                ? mode === 'water'
                  ? 'from-teal-600 via-teal-700 to-teal-950 ring-2 ring-teal-300'
                  : 'from-amber-600 via-orange-700 to-amber-950 ring-2 ring-amber-300'
                : 'from-amber-600 via-amber-700 to-amber-900 ring-2 ring-amber-600/50'
            } text-white flex items-center justify-center font-poetry font-bold text-xs shadow-2xl border-2 border-amber-200">
              ${poetShortName}
            </div>

            <div class="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-poetry whitespace-nowrap shadow-md flex items-center space-x-1 border ${badgeClass}">
              ${iconEmoji ? `<span class="text-[11px]">${iconEmoji}</span>` : ''}
              <span>${badgeText}</span>
            </div>
          </div>
        `,
        iconSize: [90, 60],
        iconAnchor: [45, 22],
      });
    },
    []
  );

  // =========================================================================
  // 1. Leaflet 核心地图容器与图层组初始化 (仅执行一次，视口不重置)
  // =========================================================================
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const initialCenter: [number, number] = [33.2, 112.5];
    const map = L.map(container, {
      center: initialCenter,
      zoom: 5.5,
      minZoom: 4.5,
      maxZoom: 9.5,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      zoomControl: false,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // 创建独立图层组
    const administrativeLinesGroup = L.layerGroup().addTo(map);
    const roadsGroup = L.layerGroup().addTo(map);
    const citiesGroup = L.layerGroup().addTo(map);
    const poetsGroup = L.layerGroup().addTo(map);

    administrativeLinesGroupRef.current = administrativeLinesGroup;
    roadsGroupRef.current = roadsGroup;
    citiesGroupRef.current = citiesGroup;
    poetsGroupRef.current = poetsGroup;

    // 初始化主角标记
    const initialPlayerLatLng = getCityLatLng(currentLocation.id);
    const playerMarker = L.marker(initialPlayerLatLng, {
      icon: createPlayerIcon(currentPoet, dynasty),
      zIndexOffset: 1000,
    }).addTo(map);
    playerMarkerRef.current = playerMarker;

    // 监听实时缩放变化
    map.on('zoomend', () => {
      setZoomLevel(map.getZoom());
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      administrativeLinesGroupRef.current = null;
      roadsGroupRef.current = null;
      citiesGroupRef.current = null;
      poetsGroupRef.current = null;
      playerMarkerRef.current = null;
      tileLayerRef.current = null;
    };
  }, []); // 仅在 Mount 时执行一次

  // =========================================================================
  // 2. 真实地域金字塔瓦片切片动态切换 (无需重置地图视口)
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let newTileLayer: L.Layer;

    if (basemapStyle === 'relief') {
      // 真实华夏山川地貌切片 (Esri Shaded Relief - 呈现真实山川起伏，不遮挡自然水体)
      newTileLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
        {
          className: 'warm-green-relief-tile',
          opacity: 0.96,
          minZoom: 4,
          maxZoom: 10,
        }
      );
    } else if (basemapStyle === 'satellite') {
      // 真实高精卫星遥感影像切片 (Esri World Imagery - 真实航拍山水大地)
      newTileLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          className: 'warm-green-satellite-tile',
          opacity: 0.88,
          minZoom: 4,
          maxZoom: 10,
        }
      );
    } else if (basemapStyle === 'silk') {
      // 青绿绢本金字塔切片 (Custom 256x256 L.GridLayer - 宣纸纤维与工笔格纹，离线秒开)
      const WarmGreenSilkTileLayer = L.GridLayer.extend({
        createTile: function (coords: { x: number; y: number; z: number }) {
          const tile = document.createElement('canvas');
          tile.width = 256;
          tile.height = 256;
          const ctx = tile.getContext('2d');
          if (!ctx) return tile;

          const seed = (coords.x * 37 + coords.y * 17 + coords.z * 13) % 100;
          const lightness = 91 + (seed % 4);
          ctx.fillStyle = `hsl(110, 22%, ${lightness}%)`;
          ctx.fillRect(0, 0, 256, 256);

          ctx.strokeStyle = 'rgba(13, 148, 136, 0.05)';
          ctx.lineWidth = 0.5;
          for (let i = 32; i < 256; i += 64) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(256, i);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 256);
            ctx.stroke();
          }

          const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 130);
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.04)');
          grad.addColorStop(1, 'rgba(5, 150, 105, 0.0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);

          return tile;
        },
      });
      // @ts-expect-error GridLayer constructor instantiation
      newTileLayer = new WarmGreenSilkTileLayer({ minZoom: 4, maxZoom: 10 });
    } else {
      // 实景工笔水墨舆图切片 (CartoDB Voyager)
      newTileLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
        {
          subdomains: 'abcd',
          className: 'warm-green-carto-tile',
          opacity: 0.92,
          minZoom: 4,
          maxZoom: 10,
        }
      );
    }

    newTileLayer.addTo(map);
    if ('bringToBack' in newTileLayer && typeof (newTileLayer as L.TileLayer).bringToBack === 'function') {
      (newTileLayer as L.TileLayer).bringToBack();
    }
    tileLayerRef.current = newTileLayer;
  }, [basemapStyle]);

  // =========================================================================
  // 3. 渲染行政区域虚线与重点城市标注 (无需画江河湖泊，自然水体纯粹通透)
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    const administrativeLinesGroup = administrativeLinesGroupRef.current;
    const roadsGroup = roadsGroupRef.current;
    const citiesGroup = citiesGroupRef.current;
    const poetsGroup = poetsGroupRef.current;

    if (!map || !administrativeLinesGroup || !roadsGroup || !citiesGroup || !poetsGroup) {
      return;
    }

    // 清空图层内容
    administrativeLinesGroup.clearLayers();
    roadsGroup.clearLayers();
    citiesGroup.clearLayers();
    poetsGroup.clearLayers();

    // -----------------------------------------------------------------------
    // A. 行政区域虚线：王朝疆域大轮廓虚线 + 十道/路制行政管辖分界虚线
    // -----------------------------------------------------------------------
    if (showAdministrativeLines) {
      // 1. 王朝帝国大疆域边界虚线
      const imperialBorder = dynasty === 'tang' ? TANG_EMPIRE_BORDER : SONG_EMPIRE_BORDER;
      const dynastyTitle = dynasty === 'tang' ? '盛唐天朝疆域界' : '大宋正朔疆域界';
      const dynastyDesc =
        dynasty === 'tang'
          ? '【盛唐大一统疆界】九天阊阖开宫殿，万国衣冠拜冕旒。东临沧海，西控安西。'
          : '【两宋华夏正朔疆界】华夏民族之文化，历数千载之演进，造极于赵宋之世。';

      const territoryLine = L.polyline(imperialBorder, {
        color: '#9A3412', // 历代朱砂暗金
        weight: 2.2,
        dashArray: '8, 6',
        opacity: 0.85,
      });

      territoryLine.bindTooltip(
        `<div class="space-y-0.5"><div class="font-bold text-amber-900 font-poetry">🏛️ ${dynastyTitle}</div><div class="text-xs text-slate-800">${dynastyDesc}</div></div>`,
        {
          sticky: true,
          className: 'font-poetry text-xs text-amber-950 bg-amber-50/98 border border-amber-400/80 shadow-md p-2',
        }
      );
      administrativeLinesGroup.addLayer(territoryLine);

      // 2. 唐代十道 / 两宋路制行政区域分界虚线
      const divisions = dynasty === 'tang' ? TANG_CIRCUITS_DIVISIONS : SONG_ROUTES_DIVISIONS;
      divisions.forEach((div) => {
        const divLine = L.polyline(div.path, {
          color: '#854D0E',
          weight: 1.8,
          dashArray: '6, 5',
          opacity: 0.8,
        });

        divLine.bindTooltip(`【行政管辖界】${div.name}`, {
          sticky: true,
          className: 'font-poetry text-[11px] text-amber-950 bg-amber-50/95 border border-amber-400 shadow-sm px-2 py-1',
        });
        administrativeLinesGroup.addLayer(divLine);

        // 在中高缩放级别（Zoom >= 5.5），在分界线中点渲染典雅行政界铭牌微标
        if (zoomLevel >= 5.5 && div.path.length >= 2) {
          const midIdx = Math.floor(div.path.length / 2);
          const midPt = div.path[midIdx];

          const boundaryLabelIcon = L.divIcon({
            className: 'custom-div-icon pointer-events-none',
            html: `
              <div class="px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-100 font-poetry text-[9px] whitespace-nowrap shadow-sm border border-amber-400/30 backdrop-blur-sm">
                ${div.name.split(' ')[0]}
              </div>
            `,
            iconSize: [60, 16],
            iconAnchor: [30, 8],
          });

          administrativeLinesGroup.addLayer(
            L.marker(midPt, { icon: boundaryLabelIcon, interactive: false })
          );
        }
      });
    }

    // -----------------------------------------------------------------------
    // B. 古代官道驿路线网 (连接十六大名城，古人行路脉络)
    // -----------------------------------------------------------------------
    ANCIENT_ROADS.forEach(([c1, c2]) => {
      const p1 = getCityLatLng(c1);
      const p2 = getCityLatLng(c2);
      const roadLine = L.polyline([p1, p2], {
        color: '#A16207',
        weight: 1.5,
        dashArray: '5, 5',
        opacity: 0.45,
      });
      roadsGroup.addLayer(roadLine);
    });

    // -----------------------------------------------------------------------
    // C. 重点城市标注地点 (十六大主要历史名城全部清晰标注图钉与官方地名)
    // -----------------------------------------------------------------------
    Object.values(MAJOR_CITIES).forEach((city) => {
      const latLng: [number, number] = [city.coordinates[1], city.coordinates[0]];
      const isCurrent =
        city.id === currentLocation.id ||
        (currentLocation.name_cn && city.name_cn.includes(currentLocation.name_cn));
      const dynastyData = dynasty === 'tang' ? city.tang : city.song;
      const dynastyName = dynastyData.name || city.name_cn;

      // 统计当期在此城池的同行文人
      const poetsHere = otherPoets.filter((p) => p.currentCityId === city.id);

      const cityIconHtml = `
        <div class="group relative flex flex-col items-center select-none cursor-pointer ${
          isCurrent ? 'scale-115 z-40' : 'hover:scale-110 z-20 transition-transform'
        }">
          ${
            isCurrent
              ? `
              <div class="absolute -top-3 w-10 h-10 rounded-full bg-amber-400/40 animate-ping pointer-events-none"></div>
              <div class="absolute -top-1 w-6 h-6 rounded-full bg-amber-300/60 animate-pulse pointer-events-none"></div>
            `
              : ''
          }
          
          <!-- 地理位置图钉 (Location Pin) -->
          <div class="relative flex items-center justify-center ${
            isCurrent
              ? 'text-amber-500 drop-shadow-[0_4px_8px_rgba(217,119,6,0.6)]'
              : 'text-emerald-800 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] group-hover:text-emerald-600'
          }">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span class="absolute top-1.5 w-2 h-2 rounded-full ${
              isCurrent ? 'bg-amber-100 ring-2 ring-amber-600' : 'bg-white ring-1 ring-emerald-900'
            }"></span>
          </div>

          <!-- 城市地名铭牌 (清晰高对比度) -->
          <div class="mt-0.5 px-2.5 py-0.5 rounded-full font-poetry text-xs whitespace-nowrap shadow-lg border flex items-center space-x-1 ${
            isCurrent
              ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white border-amber-300 font-bold ring-2 ring-amber-400/50 shadow-amber-900/40'
              : 'bg-white/98 text-[#09131C] border-slate-300/90 font-bold group-hover:border-emerald-600 group-hover:text-emerald-950 group-hover:bg-emerald-50/95'
          }">
            ${isCurrent ? '<span class="text-amber-200 text-[10px]">★</span>' : ''}
            <span>${dynastyName}</span>
          </div>

          <!-- 同城文人数量角标 -->
          ${
            poetsHere.length > 0
              ? `
            <div class="absolute -top-1 -right-3 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white shadow-sm flex items-center space-x-0.5">
              <span>👥</span>
              <span>${poetsHere.length}</span>
            </div>
          `
              : ''
          }
        </div>
      `;

      const cityIcon = L.divIcon({
        className: 'custom-div-icon cursor-pointer',
        html: cityIconHtml,
        iconSize: [110, 65],
        iconAnchor: [55, 24],
      });

      const marker = L.marker(latLng, { icon: cityIcon });
      marker.on('click', () => {
        setActiveCityDetail(city);
      });
      citiesGroup.addLayer(marker);
    });

    // -----------------------------------------------------------------------
    // D. 同时代文人自主行历棋子
    // -----------------------------------------------------------------------
    otherPoets.forEach(({ poet, currentCityId, status, recentWork, age, isAlive }) => {
      if (!isAlive) return;
      const cityLatLng = getCityLatLng(currentCityId);

      const offsetSeed = poet.id.charCodeAt(0) % 5;
      const offsetLat = offsetSeed % 2 === 0 ? 0.22 : -0.22;
      const offsetLng = (offsetSeed - 2) * 0.24 + 0.16;
      const poetPos: [number, number] = [cityLatLng[0] + offsetLat, cityLatLng[1] + offsetLng];

      const poetIcon = L.divIcon({
        className: 'custom-div-icon cursor-pointer',
        html: `
          <div class="group relative flex flex-col items-center select-none transition-transform hover:scale-125 z-25">
            <div style="background-color: ${poet.color};" class="w-7 h-7 rounded-full text-white font-bold text-[10px] font-poetry flex items-center justify-center shadow-lg border-2 border-white ring-1 ring-slate-300">
              ${poet.avatarText}
            </div>
            <span class="mt-0.5 px-1.5 py-0.2 rounded bg-slate-900/90 text-white text-[9px] font-poetry whitespace-nowrap shadow opacity-90 group-hover:opacity-100">
              ${poet.name}
            </span>
          </div>
        `,
        iconSize: [60, 45],
        iconAnchor: [30, 15],
      });

      const poetMarker = L.marker(poetPos, { icon: poetIcon });
      poetMarker.on('click', () => {
        setSelectedPoetDossier({
          poet,
          cityId: currentCityId,
          cityName: MAJOR_CITIES[currentCityId]?.name_cn || currentCityId,
          status,
          recentWork,
          age,
        });
      });
      poetsGroup.addLayer(poetMarker);
    });
  }, [
    dynasty,
    zoomLevel,
    showAdministrativeLines,
    otherPoets,
    currentLocation.id,
    getCityLatLng,
  ]);

  // =========================================================================
  // 4. 朝代或文人切换时更新主角标记样式
  // =========================================================================
  useEffect(() => {
    if (playerMarkerRef.current) {
      playerMarkerRef.current.setIcon(createPlayerIcon(currentPoet, dynasty));
    }
  }, [dynasty, currentPoet, createPlayerIcon]);

  // =========================================================================
  // 5. 游历地点变化时：主角平滑巡游动画 (水路顺江扁舟 vs 陆路策马疾驰，带音效与动态虚线)
  // =========================================================================
  useEffect(() => {
    if (!playerMarkerRef.current || !mapInstanceRef.current) return;
    const destLatLng = getCityLatLng(currentLocation.id);
    const startLatLng = playerMarkerRef.current.getLatLng();

    // 若经纬度基本相同，则无需播放移动动画
    if (
      Math.abs(startLatLng.lat - destLatLng[0]) < 0.001 &&
      Math.abs(startLatLng.lng - destLatLng[1]) < 0.001
    ) {
      prevLocationIdRef.current = currentLocation.id;
      return;
    }

    const prevLocId = prevLocationIdRef.current;
    const travelMode = getTravelMode(prevLocId, currentLocation.id);
    const poetName = currentPoet?.name_cn || (dynasty === 'tang' ? '李白' : '苏轼');
    const cityName = currentLocation.name_cn || '胜境';

    // 1. 设置巡游状态与浮窗播报
    setTravelNotice({
      isTraveling: true,
      mode: travelMode,
      text:
        travelMode === 'water'
          ? `🛶 顺江扁舟 · 【${poetName}】扁舟泛波，顺江东下，轻舟将过万重山，前往【${cityName}】...`
          : `🐎 策马疾驰 · 【${poetName}】快马加鞭，踏遍青山驿道，前往【${cityName}】...`,
    });

    // 2. 播放国风行路拟真音效
    if (travelMode === 'water') {
      soundEngine.playWaterWave();
    } else {
      soundEngine.playHorseGallop();
    }

    // 3. 动态绘制行路虚线金芒
    if (travelPolylineRef.current) {
      travelPolylineRef.current.remove();
    }
    const trailLine = L.polyline([startLatLng, destLatLng], {
      color: travelMode === 'water' ? '#0D9488' : '#D97706',
      weight: 3.5,
      dashArray: '8, 8',
      opacity: 0.85,
    }).addTo(mapInstanceRef.current);
    travelPolylineRef.current = trailLine;

    // 4. 切换为行历中动态棋子 (显示扁舟或战马)
    playerMarkerRef.current.setIcon(
      createPlayerIcon(currentPoet, dynasty, { isTraveling: true, mode: travelMode })
    );

    const startTime = performance.now();
    const duration = 1600; // 1.6 秒沉浸巡游

    const animateStep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      // easeInOutCubic 缓动曲线
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentLat = startLatLng.lat + (destLatLng[0] - startLatLng.lat) * ease;
      const currentLng = startLatLng.lng + (destLatLng[1] - startLatLng.lng) * ease;

      playerMarkerRef.current?.setLatLng([currentLat, currentLng]);

      if (progress < 1.0) {
        requestAnimationFrame(animateStep);
      } else {
        // 到达！奏玉磬清响
        soundEngine.playJadeChime(659.25);
        if (travelPolylineRef.current) {
          travelPolylineRef.current.remove();
          travelPolylineRef.current = null;
        }

        // 切换回驻足静态棋子
        playerMarkerRef.current?.setIcon(
          createPlayerIcon(currentPoet, dynasty, { isTraveling: false, mode: travelMode })
        );

        // 到达后平滑居中聚焦
        mapInstanceRef.current?.panTo(destLatLng, { animate: true, duration: 0.6 });

        // 播报到达
        setTravelNotice({
          isTraveling: false,
          mode: travelMode,
          text: `✨ 已抵【${cityName}】· 履痕踏遍，诗心自适`,
        });

        setTimeout(() => {
          setTravelNotice(null);
        }, 3200);

        prevLocationIdRef.current = currentLocation.id;
      }
    };

    requestAnimationFrame(animateStep);
  }, [currentLocation.id, currentLocation.name_cn, currentPoet, dynasty, getCityLatLng, createPlayerIcon]);

  // 地图缩放与复位控制
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([33.2, 112.5], 5.5, { duration: 1.0 });
  };

  // 轮换底图切片样式
  const cycleBasemapStyle = () => {
    setBasemapStyle((prev) => {
      if (prev === 'relief') return 'satellite';
      if (prev === 'satellite') return 'silk';
      if (prev === 'silk') return 'carto';
      return 'relief';
    });
  };

  const getBasemapLabel = () => {
    switch (basemapStyle) {
      case 'relief':
        return '⛰️ 华夏山川切片 (真实地形)';
      case 'satellite':
        return '🛰️ 真实遥感影像 (卫星切片)';
      case 'silk':
        return '📜 青绿绢本切片 (工笔宣纸)';
      case 'carto':
        return '🗺️ 水墨工笔舆图 (古典图籍)';
    }
  };

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden select-none bg-[#EAF2E8]">
      {/* 1. 顶部悬浮：世界播报风云台 */}
      <WorldChronicleDrawer
        currentYear={currentYear}
        chronicles={chronicles}
        activeHighlight={activeHighlight}
        onFocusCity={handleFocusCity}
      />

      {/* 2. Leaflet 瓦片切图容器 (基于真实地域图片金字塔切片架构) */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* 3. 悬浮地图交互控件 (右下角) */}
      <div className="absolute right-4 bottom-24 z-[1000] flex flex-col items-center bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl p-1.5 shadow-xl space-y-1.5">
        {/* 底图样式切换 (真实山川 / 卫星影像 / 宣纸绢本 / 水墨舆图) */}
        <button
          onClick={cycleBasemapStyle}
          title={`当前底图切片: ${getBasemapLabel()} (点击切换)`}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 hover:text-emerald-800 active:scale-95 transition-all relative group"
        >
          <Layers className="w-4 h-4 text-emerald-800" />
        </button>

        {/* 行政区域虚线开关 */}
        <button
          onClick={() => setShowAdministrativeLines(!showAdministrativeLines)}
          title={showAdministrativeLines ? '隐藏行政管辖界虚线' : '显示当朝行政区划虚线'}
          className={`w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
            showAdministrativeLines
              ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
        </button>

        <div className="w-5 h-[1px] bg-slate-300 my-0.5" />

        <button
          onClick={handleZoomIn}
          title="放大地图"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 hover:text-emerald-800 active:scale-95 transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="缩小地图"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 hover:text-emerald-800 active:scale-95 transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-5 h-[1px] bg-slate-300 my-0.5" />

        <button
          onClick={handleResetView}
          title="复位全览"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 hover:text-emerald-800 active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>



      {/* 5. 同行诗人档案弹窗 (点击地图上其他文人时弹出) */}
      {selectedPoetDossier && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white/98 backdrop-blur-xl border border-slate-300 rounded-3xl p-5 shadow-2xl text-slate-900 space-y-3.5">
            {/* 顶栏 */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center space-x-2.5">
                <div
                  style={{ backgroundColor: selectedPoetDossier.poet.color }}
                  className="w-9 h-9 rounded-full text-white font-bold text-sm font-poetry flex items-center justify-center shadow"
                >
                  {selectedPoetDossier.poet.avatarText}
                </div>
                <div>
                  <h3 className="font-bold text-base font-poetry text-slate-900">
                    {selectedPoetDossier.poet.name}
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    字{selectedPoetDossier.poet.courtesyName} · {selectedPoetDossier.poet.title}
                  </p>
                </div>
              </div>

              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold border border-emerald-300">
                公元 {currentYear} 年 ({selectedPoetDossier.age}岁)
              </span>
            </div>

            {/* 当期所在地点与行迹活动 */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>当期驻足：{selectedPoetDossier.cityName}</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-sans">
                {selectedPoetDossier.status}
              </p>
            </div>

            {/* 当期代表诗作 */}
            {selectedPoetDossier.recentWork && (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
                <span className="font-bold flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>同期传世名篇：</span>
                </span>
                <span className="font-poetry font-bold text-amber-900">
                  {selectedPoetDossier.recentWork}
                </span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPoetDossier(null)}
                className="w-full py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition-all"
              >
                掩卷已知
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 游历巡游播报浮条 (TODO-POL-01) */}
      {travelNotice && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in slide-in-from-top-4 pointer-events-none max-w-[90vw]">
          <div
            className={`px-4 py-2.5 rounded-full shadow-2xl border backdrop-blur-md flex items-center space-x-2 text-xs font-poetry font-bold ${
              travelNotice.isTraveling
                ? travelNotice.mode === 'water'
                  ? 'bg-teal-950/90 text-teal-100 border-teal-400/60 shadow-teal-950/50'
                  : 'bg-amber-950/90 text-amber-100 border-amber-400/60 shadow-amber-950/50'
                : 'bg-stone-900/95 text-amber-200 border-amber-400/70 shadow-jade-glow animate-bounce'
            }`}
          >
            <span>{travelNotice.text}</span>
          </div>
        </div>
      )}

      {/* 6. 城市人文详情弹窗 (严格限定当朝信息，绝无跨朝代信息混杂) */}
      {activeCityDetail && (
        <div className="relative z-[2000]">
          <CityDetailModal
            city={activeCityDetail}
            dynasty={dynasty}
            isCurrentLocation={Boolean(
              activeCityDetail.id === currentLocation.id ||
              (currentLocation.name_cn && activeCityDetail.name_cn.includes(currentLocation.name_cn))
            )}
            onTravelHere={(cityId) => {
              onTravel(cityId);
            }}
            onClose={() => setActiveCityDetail(null)}
            activePoems={activePoems}
            unlockedPoemIds={unlockedPoemIds}
            onSelectPoemForPlay={onSelectPoemForPlay}
            unlockedArtifactIds={unlockedArtifactIds}
            onCollectArtifact={onCollectArtifact}
          />
        </div>
      )}
    </div>
  );
};
