import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationData } from '../../types/location';
import { MAJOR_CITIES, CityCulturalData } from '../../data/cities';
import { CityDetailModal } from './CityDetailModal';
import { WorldChronicleDrawer } from './WorldChronicleDrawer';
import {
  MAJOR_LAKES,
  OCEAN_WATER_POLYGON,
  RIVER_NETWORKS,
  TANG_EMPIRE_BORDER,
  SONG_EMPIRE_BORDER,
  REGIONAL_DIVISIONS,
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
  Compass,
  MapPin,
  BookOpen,
  Layers,
  Waves,
  Shield,
} from 'lucide-react';

interface TravelMapStageProps {
  currentLocation: LocationData;
  dynasty: 'tang' | 'song';
  onTravel: (locationId: string) => void;
  unlockedPoemIds: string[];
  currentYear?: number;
}

// =========================================================================
// 真实地理水系与古代陆路经纬度坐标集 (转换为 Leaflet [lat, lng])
// =========================================================================

// 黄河全干流经纬度 (几字形九曲黄河)
const YELLOW_RIVER_LAT_LNG: [number, number][] = [
  [35.8, 98.2],
  [35.8, 101.5],
  [36.05, 103.8],
  [37.5, 105.8],
  [39.0, 106.8],
  [40.8, 107.4],
  [40.8, 109.8],
  [40.3, 111.2],
  [39.5, 111.5],
  [37.8, 110.5],
  [36.1, 110.4],
  [34.6, 110.2], // 潼关大拐弯
  [34.8, 111.2], // 三门峡
  [34.9, 112.45], // 洛阳北
  [35.0, 114.34], // 开封北
  [36.5, 116.8],
  [37.6, 118.8],
  [37.8, 119.4], // 入渤海
];

// 长江全干流经纬度 (万里长江浩荡东去)
const YANGTZE_RIVER_LAT_LNG: [number, number][] = [
  [27.2, 100.2],
  [27.8, 102.5],
  [28.8, 104.6], // 宜宾
  [28.9, 105.4], // 泸州
  [29.5, 106.5], // 重庆
  [29.8, 107.5], // 涪陵
  [31.04, 109.57], // 夔州夔门白帝城
  [31.1, 110.0], // 巫峡
  [30.7, 111.3], // 宜昌
  [30.3, 112.2], // 荆州
  [29.4, 113.1], // 岳阳洞庭湖
  [30.54, 114.3], // 武汉江夏黄鹤楼
  [29.72, 115.98], // 九江浔阳/鄱阳湖
  [30.5, 117.0], // 安庆
  [31.3, 118.4], // 芜湖
  [32.06, 118.79], // 金陵南京
  [32.39, 119.41], // 广陵扬州
  [31.8, 120.8],
  [31.23, 121.8], // 入东海
];

// 隋唐两宋大运河 (洛阳/汴京 - 淮安 - 广陵扬州 - 苏州 - 杭州)
const GRAND_CANAL_LAT_LNG: [number, number][] = [
  [34.62, 112.45], // 洛阳
  [34.79, 114.34], // 开封
  [33.8, 117.0],
  [33.5, 119.1], // 淮安
  [32.39, 119.41], // 扬州
  [32.2, 119.5], // 镇江
  [31.8, 120.0], // 常州
  [31.3, 120.58], // 苏州
  [30.27, 120.15], // 杭州
];

// 历史真实古代官道线网 (连接十六大名城，角色行历走廊)
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

// 历史名山胜迹坐标
const MOUNTAIN_LANDMARKS: Array<{ name: string; pos: [number, number]; desc: string }> = [
  { name: '秦岭天险', pos: [33.95, 107.8], desc: '云横秦岭家何在' },
  { name: '太行山脉', pos: [37.2, 113.6], desc: '太行雪满山川寒' },
  { name: '剑阁蜀道', pos: [32.2, 105.5], desc: '一夫当关万夫莫开' },
  { name: '巫山三峡', pos: [31.05, 109.9], desc: '巴东三峡巫峡长' },
  { name: '匡庐秀峰', pos: [29.56, 115.98], desc: '飞流直下三千尺' },
  { name: '泰山极顶', pos: [36.25, 117.1], desc: '会当凌绝顶' },
  { name: '终南神山', pos: [34.05, 108.95], desc: '太乙近天都' },
];

export const TravelMapStage: React.FC<TravelMapStageProps> = ({
  currentLocation,
  dynasty,
  onTravel,
  currentYear: currentYearProp,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // 地图底图样式模式: 'warm-silk' (青绿暖绢金字塔瓦片) | 'warm-carto' (实景舆图暖玉瓦片)
  const [basemapStyle, setBasemapStyle] = useState<'warm-silk' | 'warm-carto'>('warm-silk');

  // 疆域与水系图层显示状态
  const [showTerritory, setShowTerritory] = useState<boolean>(true);
  const [showWaterbodies, setShowWaterbodies] = useState<boolean>(true);

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

  // 玩家角色 Leaflet Marker 与图层引用
  const playerMarkerRef = useRef<L.Marker | null>(null);
  const poetMarkersMapRef = useRef<Record<string, L.Marker>>({});
  const baseTileLayerRef = useRef<L.Layer | null>(null);

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

  // =========================================================================
  // Leaflet 核心地图生命周期与江河湖泊、疆域版图全面渲染
  // =========================================================================
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // 1. 初始化 Leaflet Map 实例 (中心位于中原荆楚核心，适度微仰角缩放)
    const initialCenter: [number, number] = [32.8, 112.5];
    const map = L.map(container, {
      center: initialCenter,
      zoom: 5.5,
      minZoom: 4.5,
      maxZoom: 9.5,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      zoomControl: false, // 使用自定义美化控件
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // 2. 自定义【青绿暖绢金字塔瓦片切图层】(Warm-Green Silk Tile Layer - 偏绿色暖色)
    // 采用 L.GridLayer 动态切片渲染 256x256 高精度画布，零网络依赖、离线秒开、无白屏
    const WarmGreenSilkTileLayer = L.GridLayer.extend({
      createTile: function (coords: { x: number; y: number; z: number }) {
        const tile = document.createElement('canvas');
        tile.width = 256;
        tile.height = 256;
        const ctx = tile.getContext('2d');
        if (!ctx) return tile;

        // 根据瓦片坐标计算大致经纬度 (用于局部山海微调)
        const n = Math.pow(2, coords.z);
        const lon = (coords.x / n) * 360 - 180;
        const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * coords.y) / n)));
        const lat = (latRad * 180) / Math.PI;

        // A. 绘制青绿暖色丝绢渐变底色 (晨露新绿 + 暖玉宣纸金)
        const grad = ctx.createLinearGradient(0, 0, 256, 256);
        grad.addColorStop(0, '#EEF6ED'); // 晨露微冷翠
        grad.addColorStop(0.5, '#E5F1E2'); // 柔润青瓷玉
        grad.addColorStop(1, '#DBEBD9'); // 暖润青绿草木
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);

        // B. 绘制古代绢本横竖微经纬织纹
        ctx.strokeStyle = 'rgba(4, 120, 87, 0.04)';
        ctx.lineWidth = 1;
        for (let i = 32; i < 256; i += 32) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(256, i);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 256);
          ctx.stroke();
        }

        // C. 海域与沿海滩涂意象 (经度 > 121 或东南沿海)
        if (lon > 120.5 || (lat < 30.5 && lon > 119.0)) {
          // 沧海柔波深青
          ctx.fillStyle = 'rgba(15, 118, 110, 0.07)';
          ctx.fillRect(0, 0, 256, 256);

          // 细腻水波细纹
          ctx.strokeStyle = 'rgba(13, 148, 136, 0.16)';
          ctx.lineWidth = 1;
          for (let y = 25; y < 256; y += 45) {
            ctx.beginPath();
            ctx.moveTo(15, y);
            ctx.bezierCurveTo(75, y - 5, 135, y + 5, 195, y);
            ctx.stroke();
          }
        }

        // D. 西部高原与山峦青黛微晕 (经度 < 106)
        if (lon < 106.0 && lat > 26.0) {
          ctx.fillStyle = 'rgba(5, 150, 105, 0.05)';
          ctx.fillRect(0, 0, 256, 256);
        }

        return tile;
      },
    });

    // 默认加载青绿暖绢切片层
    const silkTileLayer = new (WarmGreenSilkTileLayer as any)({
      tileSize: 256,
      minZoom: 4,
      maxZoom: 10,
    });

    // 备用：带暖绿滤镜的高清实景舆图切片 (CartoDB Voyager 瓦片 + CSS暖绿滤镜)
    const cartoTileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        className: 'warm-green-carto-tile',
        opacity: 0.88,
        minZoom: 4,
        maxZoom: 10,
      }
    );

    if (basemapStyle === 'warm-silk') {
      silkTileLayer.addTo(map);
      baseTileLayerRef.current = silkTileLayer;
    } else {
      cartoTileLayer.addTo(map);
      baseTileLayerRef.current = cartoTileLayer;
    }

    // =======================================================================
    // 3. 【重点填充】东海沧海海域水面填充 (Ocean Water Polygon)
    // =======================================================================
    if (showWaterbodies) {
      const oceanPoly = L.polygon(OCEAN_WATER_POLYGON, {
        fillColor: '#80C2B4',
        fillOpacity: 0.35,
        color: '#0D9488',
        weight: 1.5,
        dashArray: '6, 6',
        stroke: true,
      }).addTo(map);
      oceanPoly.bindTooltip('【沧海万里】东海浩瀚 · 碧波万顷接天流', {
        sticky: true,
        className: 'font-poetry text-xs text-emerald-950 bg-white/95 border border-emerald-600/40 shadow-sm',
      });
    }

    // =======================================================================
    // 4. 【重点填充】王朝帝国大一统疆域轮廓 (Imperial Territory Boundary)
    // =======================================================================
    if (showTerritory) {
      const imperialBorder = dynasty === 'tang' ? TANG_EMPIRE_BORDER : SONG_EMPIRE_BORDER;
      const dynastyTitle = dynasty === 'tang' ? '大唐天朝版图' : '大宋正朔版图';
      const dynastyDesc =
        dynasty === 'tang'
          ? '【盛唐大一统疆域】九天阊阖开宫殿，万国衣冠拜冕旒。东临沧海，西控安西，四海宾服。'
          : '【两宋华夏正朔疆域】华夏民族之文化，历数千载之演进，造极于赵宋之世。';

      const territoryLayer = L.polygon(imperialBorder, {
        fillColor: '#DCF0DE',
        fillOpacity: 0.18,
        color: '#9A3412', // 古代朱砂暗红疆界线
        weight: 2.8,
        dashArray: '8, 6',
        opacity: 0.85,
      }).addTo(map);

      territoryLayer.bindTooltip(
        `<div class="space-y-0.5"><div class="font-bold text-amber-900 font-poetry">🏛️ ${dynastyTitle}</div><div class="text-xs text-slate-800">${dynastyDesc}</div></div>`,
        {
          sticky: true,
          className: 'font-poetry text-xs text-amber-950 bg-amber-50/98 border border-amber-400/80 shadow-md p-2',
        }
      );

      // 唐代十道 / 两宋路制宏观行政大区分界线 (古金细虚线)
      REGIONAL_DIVISIONS.forEach((div) => {
        const divLine = L.polyline(div.path, {
          color: '#854D0E',
          weight: 1.6,
          dashArray: '5, 5',
          opacity: 0.45,
        }).addTo(map);
        divLine.bindTooltip(`【${div.name}】历史行政区划要冲`, {
          sticky: true,
          className: 'font-poetry text-[10px] text-amber-900 bg-white/90 border border-amber-300',
        });
      });
    }

    // =======================================================================
    // 5. 【重点填充】全国各大名湖水体填充 (Major Lakes Surface Polygons)
    // =======================================================================
    if (showWaterbodies) {
      MAJOR_LAKES.forEach((lake) => {
        const lakePoly = L.polygon(lake.polygon, {
          fillColor: '#38A89D',
          fillOpacity: 0.65,
          color: '#0F766E',
          weight: 1.8,
          opacity: 0.95,
        }).addTo(map);

        lakePoly.bindTooltip(
          `<div class="space-y-0.5"><div class="font-bold text-emerald-900 font-poetry">🌊 ${lake.name} (${lake.ancientName})</div><div class="text-[11px] text-slate-700 font-poetry">${lake.desc}</div></div>`,
          {
            sticky: true,
            className: 'font-poetry text-xs text-emerald-950 bg-emerald-50/98 border border-emerald-600/60 shadow-md p-2',
          }
        );

        // 计算湖泊多边形几何中心放置典雅发光水体铭牌
        const latSum = lake.polygon.reduce((acc, p) => acc + p[0], 0);
        const lngSum = lake.polygon.reduce((acc, p) => acc + p[1], 0);
        const centerLat = latSum / lake.polygon.length;
        const centerLng = lngSum / lake.polygon.length;

        const lakeLabelIcon = L.divIcon({
          className: 'custom-div-icon pointer-events-none',
          html: `
            <div class="px-2 py-0.5 rounded-full bg-white/95 text-emerald-950 font-poetry font-bold text-[10px] whitespace-nowrap shadow-sm border border-emerald-600/40 backdrop-blur-sm flex items-center space-x-1">
              <span class="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
              <span>${lake.name}</span>
            </div>
          `,
          iconSize: [60, 20],
          iconAnchor: [30, 10],
        });
        L.marker([centerLat, centerLng], { icon: lakeLabelIcon, interactive: false }).addTo(map);
      });
    }

    // =======================================================================
    // 6. 真实大江大河全水系网 (干流 + 十大关键支流)
    // =======================================================================
    // A. 黄河之水天上来 (双层暖金泥金色波光)
    L.polyline(YELLOW_RIVER_LAT_LNG, {
      color: '#F59E0B',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    const yellowRiverLine = L.polyline(YELLOW_RIVER_LAT_LNG, {
      color: '#B45309',
      weight: 5.0,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    yellowRiverLine.bindTooltip('【九曲黄河】万里沙 · 黄河之水天上来，奔流到海不复回', {
      sticky: true,
      className: 'font-poetry text-xs text-amber-950 bg-amber-50/95 border border-amber-500/50',
    });

    // B. 万里长江浩荡东去 (双层翡翠碧玉流光)
    L.polyline(YANGTZE_RIVER_LAT_LNG, {
      color: '#10B981',
      weight: 9,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    const yangtzeRiverLine = L.polyline(YANGTZE_RIVER_LAT_LNG, {
      color: '#0D9488',
      weight: 6.0,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    yangtzeRiverLine.bindTooltip('【万里长江】孤帆远影碧空尽，唯见长江天际流 · 华夏黄金水道', {
      sticky: true,
      className: 'font-poetry text-xs text-emerald-950 bg-emerald-50/95 border border-emerald-600/50',
    });

    // C. 隋唐宋京杭大运河 (青翠虚线水驿)
    const canalLine = L.polyline(GRAND_CANAL_LAT_LNG, {
      color: '#059669',
      weight: 3.5,
      dashArray: '6, 6',
      opacity: 0.9,
      lineCap: 'round',
    }).addTo(map);
    canalLine.bindTooltip('【京杭大运河】尽道隋亡为此河，至今千里赖通波 · 汴河通济渠与江南水驿', {
      sticky: true,
      className: 'font-poetry text-xs text-emerald-950 bg-white/95 border border-emerald-500/40',
    });

    // D. 长江黄河十大支流水网 (渭河、汉水、嘉陵江、岷江、汾河、淮水、湘江、赣江、珠江、钱塘江)
    if (showWaterbodies) {
      RIVER_NETWORKS.forEach((river) => {
        // 支流柔光底层
        L.polyline(river.path, {
          color: '#10B981',
          weight: river.weight + 2.5,
          opacity: 0.28,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        // 支流水脉主体
        const riverLine = L.polyline(river.path, {
          color: river.id.includes('wei') ? '#B45309' : '#0D9488',
          weight: river.weight,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        riverLine.bindTooltip(`【${river.name}】${river.desc}`, {
          sticky: true,
          className: 'font-poetry text-xs text-slate-900 bg-white/95 border border-emerald-600/40',
        });
      });
    }

    // =======================================================================
    // 7. 绘制古代官道陆路驿路线网 (连接十六大名城，角色行历通道)
    // =======================================================================
    ANCIENT_ROADS.forEach(([c1, c2]) => {
      const p1 = getCityLatLng(c1);
      const p2 = getCityLatLng(c2);
      L.polyline([p1, p2], {
        color: '#B45309',
        weight: 1.8,
        dashArray: '6, 6',
        opacity: 0.45,
      }).addTo(map);
    });

    // 8. 标注名山胜迹 (工笔山岳图腾印记)
    MOUNTAIN_LANDMARKS.forEach((mtn) => {
      const mtnIcon = L.divIcon({
        className: 'custom-div-icon pointer-events-none',
        html: `
          <div class="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-900/10 text-emerald-950 font-poetry font-bold text-[10px] whitespace-nowrap shadow-sm border border-emerald-800/20 backdrop-blur-sm">
            <span class="text-emerald-800">▲</span>
            <span>${mtn.name}</span>
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });
      L.marker(mtn.pos, { icon: mtnIcon, interactive: false }).addTo(map);
    });

    // 9. 渲染全域十六大名城印鉴与楼阁徽标
    Object.values(MAJOR_CITIES).forEach((city) => {
      const latLng: [number, number] = [city.coordinates[1], city.coordinates[0]];
      const isCurrent =
        city.id === currentLocation.id ||
        (currentLocation.name_cn && city.name_cn.includes(currentLocation.name_cn));
      const dynastyData = dynasty === 'tang' ? city.tang : city.song;
      const dynastyName = dynastyData.name || city.name_cn;

      // 统计当期在此城池的同行文人
      const poetsHere = otherPoets.filter((p) => p.currentCityId === city.id);

      const cityIcon = L.divIcon({
        className: 'custom-div-icon cursor-pointer',
        html: `
          <div class="group relative flex flex-col items-center select-none ${
            isCurrent ? 'scale-110 z-30' : 'hover:scale-105 z-20'
          }">
            ${
              isCurrent
                ? `<div class="absolute -inset-3 rounded-full bg-emerald-500/30 animate-ping pointer-events-none"></div>`
                : ''
            }
            <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border transition-all ${
              isCurrent
                ? 'bg-gradient-to-br from-emerald-800 to-teal-900 text-white border-emerald-300 ring-2 ring-white/90 shadow-emerald-900/40'
                : 'bg-white text-emerald-900 border-slate-300 hover:border-emerald-600 hover:bg-emerald-50'
            }">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10zm0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
              </svg>
            </div>
            <div class="mt-1 text-xs px-2.5 py-0.5 rounded-full font-poetry whitespace-nowrap shadow-md border font-semibold ${
              isCurrent
                ? 'bg-emerald-900 text-white border-emerald-600 font-bold shadow-emerald-900/20'
                : 'bg-white/98 text-[#09131C] border-slate-300/90 hover:text-emerald-900 hover:border-emerald-600'
            }">
              ${dynastyName}
            </div>
            ${
              poetsHere.length > 0
                ? `<div class="absolute -top-1 -right-2 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white shadow-sm">
                    ${poetsHere.length}人
                  </div>`
                : ''
            }
          </div>
        `,
        iconSize: [90, 60],
        iconAnchor: [45, 20],
      });

      const marker = L.marker(latLng, { icon: cityIcon }).addTo(map);
      marker.on('click', () => {
        setActiveCityDetail(city);
      });
    });

    // 10. 渲染同时代其他文人自主行历棋子
    otherPoets.forEach(({ poet, currentCityId, status, recentWork, age, isAlive }) => {
      if (!isAlive) return;
      const cityLatLng = getCityLatLng(currentCityId);

      // 为避免同城重叠，施加微小的经纬度微扰 (约 0.18 度)
      const offsetSeed = poet.id.charCodeAt(0) % 5;
      const offsetLat = (offsetSeed % 2 === 0 ? 0.16 : -0.16);
      const offsetLng = (offsetSeed - 2) * 0.18 + 0.12;
      const poetPos: [number, number] = [cityLatLng[0] + offsetLat, cityLatLng[1] + offsetLng];

      const poetIcon = L.divIcon({
        className: 'custom-div-icon cursor-pointer',
        html: `
          <div class="group relative flex flex-col items-center select-none transition-transform hover:scale-125 z-25">
            <div style="background-color: ${poet.color};" class="w-7 h-7 rounded-full text-white font-bold text-[10px] font-poetry flex items-center justify-center shadow-lg border-2 border-white ring-1 ring-slate-300">
              ${poet.avatarText}
            </div>
            <span class="mt-0.5 px-1.5 py-0.2 rounded bg-slate-900/90 text-white text-[9px] font-poetry whitespace-nowrap shadow opacity-85 group-hover:opacity-100">
              ${poet.name}
            </span>
          </div>
        `,
        iconSize: [60, 45],
        iconAnchor: [30, 15],
      });

      const poetMarker = L.marker(poetPos, { icon: poetIcon }).addTo(map);
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
      poetMarkersMapRef.current[poet.id] = poetMarker;
    });

    // 11. 渲染主角 (李白/苏轼) 当前所处行历棋子
    const initialPlayerLatLng = getCityLatLng(currentLocation.id);
    const playerIcon = L.divIcon({
      className: 'custom-div-icon pointer-events-none z-30',
      html: `
        <div class="relative flex flex-col items-center select-none">
          <div class="absolute -inset-3.5 rounded-full bg-amber-500/35 animate-ping"></div>
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white flex items-center justify-center font-poetry font-bold text-xs shadow-2xl border-2 border-amber-200 ring-2 ring-amber-600/50">
            ${dynasty === 'tang' ? '太白' : '东坡'}
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold font-poetry whitespace-nowrap shadow-md flex items-center space-x-1 border border-amber-300">
            <span>当前驻足</span>
          </div>
        </div>
      `,
      iconSize: [80, 55],
      iconAnchor: [40, 20],
    });

    const playerMarker = L.marker(initialPlayerLatLng, { icon: playerIcon }).addTo(map);
    playerMarkerRef.current = playerMarker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [
    basemapStyle,
    dynasty,
    currentLocation.id,
    getCityLatLng,
    otherPoets,
    showTerritory,
    showWaterbodies,
  ]);

  // 当当前所处地点变化时，执行平滑行历移动动画
  useEffect(() => {
    if (!playerMarkerRef.current || !mapInstanceRef.current) return;
    const destLatLng = getCityLatLng(currentLocation.id);
    const startLatLng = playerMarkerRef.current.getLatLng();

    const startTime = performance.now();
    const duration = 1200; // 1.2 秒策马行路

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
        // 到达后平滑居中
        mapInstanceRef.current?.panTo(destLatLng, { animate: true, duration: 0.6 });
      }
    };

    requestAnimationFrame(animateStep);
  }, [currentLocation.id, getCityLatLng]);

  // 地图缩放与复位控制
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([32.8, 112.5], 5.5, { duration: 1.0 });
  };

  // 切换底图样式
  const toggleBasemapStyle = () => {
    setBasemapStyle((prev) => (prev === 'warm-silk' ? 'warm-carto' : 'warm-silk'));
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

      {/* 2. Leaflet 瓦片切图容器 (基于 256x256 金字塔瓦片架构) */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* 3. 悬浮地图交互控件 (右下角) */}
      <div className="absolute right-4 bottom-24 z-[1000] flex flex-col items-center bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl p-1.5 shadow-xl space-y-1.5">
        {/* 底图样式切换 */}
        <button
          onClick={toggleBasemapStyle}
          title={basemapStyle === 'warm-silk' ? '切换为：实景舆图瓦片' : '切换为：青绿暖绢切片'}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 hover:text-emerald-800 active:scale-95 transition-all"
        >
          <Layers className="w-4 h-4 text-emerald-800" />
        </button>

        {/* 疆域轮廓开关 */}
        <button
          onClick={() => setShowTerritory(!showTerritory)}
          title={showTerritory ? '隐藏疆域版图轮廓' : '显示王朝疆域版图'}
          className={`w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
            showTerritory
              ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
        </button>

        {/* 江河湖泊填充开关 */}
        <button
          onClick={() => setShowWaterbodies(!showWaterbodies)}
          title={showWaterbodies ? '隐藏湖泊海域填充' : '开启江河湖海全填充'}
          className={`w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
            showWaterbodies
              ? 'bg-teal-100 text-teal-900 border border-teal-300 shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Waves className="w-4 h-4" />
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

      {/* 4. 探索指南与图例微标 (左下角) */}
      <div className="absolute left-4 bottom-24 z-[1000] hidden sm:flex items-center space-x-3 bg-white/95 backdrop-blur-md border border-slate-300 px-4 py-2 rounded-full text-xs text-slate-800 shadow-md">
        <Compass className="w-4 h-4 text-emerald-800 shrink-0" />
        <span className="font-medium">
          点击各大名湖/黄河长江/疆界可查阅典故 · 滚轮缩放 · 点击名城开启风土 · 点击文人探查同期行迹
        </span>
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
          />
        </div>
      )}
    </div>
  );
};
