import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { LocationData } from '../../types/location';
import { MAJOR_CITIES, CityCulturalData } from '../../data/cities';
import { CityDetailModal } from './CityDetailModal';
import { WorldChronicleDrawer } from './WorldChronicleDrawer';
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
  Footprints,
  Users,
} from 'lucide-react';

interface TravelMapStageProps {
  currentLocation: LocationData;
  dynasty: 'tang' | 'song';
  onTravel: (locationId: string) => void;
  unlockedPoemIds: string[];
  currentYear?: number;
}

// =========================================================================
// 真实地理投影函数 (中央经纬度投影至 1400 x 950 矢量画布)
// 经度 98°E ~ 124°E，纬度 20°N ~ 42°N
// =========================================================================
const MIN_LNG = 98.0;
const MAX_LNG = 124.0;
const MIN_LAT = 20.0;
const MAX_LAT = 42.0;

export function projectGeo(lng: number, lat: number): { x: number; y: number } {
  const normX = (lng - MIN_LNG) / (MAX_LNG - MIN_LNG);
  const normY = (MAX_LAT - lat) / (MAX_LAT - MIN_LAT);

  const x = normX * 1220 + 90;
  const y = normY * 790 + 80;
  return { x, y };
}

// 辅助：生成平滑 SVG 曲线路径
function coordsToPath(coords: [number, number][]): string {
  if (coords.length === 0) return '';
  const pts = coords.map(([lng, lat]) => projectGeo(lng, lat));
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cx = (prev.x + curr.x) / 2;
    const cy = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return d;
}

// 真实中国海岸线关键采样点 (渤海、辽东、山东半岛、海州湾、长江口、杭州湾、浙闽粤海岸)
const COASTLINE_COORDS: [number, number][] = [
  [121.5, 41.2],
  [120.0, 40.5],
  [118.0, 39.2],
  [117.8, 38.6],
  [118.8, 37.8],
  [120.6, 37.8],
  [122.4, 37.4],
  [121.5, 36.1],
  [119.6, 34.8],
  [120.8, 33.3],
  [121.8, 31.8],
  [121.5, 31.2],
  [121.2, 30.5],
  [121.8, 29.8],
  [120.8, 28.0],
  [119.8, 26.5],
  [118.6, 24.8],
  [116.8, 23.5],
  [114.2, 22.3],
  [111.0, 21.5],
  [109.8, 20.8],
];

// 黄河全干流经纬度 (九曲黄河万里沙)
const YELLOW_RIVER_COORDS: [number, number][] = [
  [98.2, 35.8],
  [101.5, 35.8],
  [103.8, 36.05],
  [105.8, 37.5],
  [106.8, 39.0],
  [107.4, 40.8],
  [109.8, 40.8],
  [111.2, 40.3],
  [111.5, 39.5],
  [110.5, 37.8],
  [110.4, 36.1],
  [110.2, 34.6], // 潼关大转折
  [111.2, 34.8], // 三门峡
  [112.45, 34.9], // 洛阳北
  [114.34, 35.0], // 开封北
  [116.8, 36.5],
  [118.8, 37.6],
  [119.4, 37.8], // 入渤海
];

// 长江全干流经纬度 (万里长江横贯东西)
const YANGTZE_RIVER_COORDS: [number, number][] = [
  [100.2, 27.2],
  [102.5, 27.8],
  [104.6, 28.8], // 宜宾
  [105.4, 28.9], // 泸州
  [106.5, 29.5], // 重庆
  [107.5, 29.8], // 涪陵
  [109.57, 31.04], // 夔州夔门白帝城
  [110.0, 31.1], // 巫峡
  [111.3, 30.7], // 宜昌
  [112.2, 30.3], // 荆州
  [113.1, 29.4], // 岳阳洞庭湖
  [114.3, 30.54], // 武汉江夏黄鹤楼
  [115.98, 29.72], // 九江浔阳/鄱阳湖
  [117.0, 30.5], // 安庆
  [118.4, 31.3], // 芜湖
  [118.79, 32.06], // 金陵南京
  [119.41, 32.39], // 广陵扬州
  [120.8, 31.8],
  [121.8, 31.23], // 入东海
];

// 隋唐两宋大运河 (洛阳/汴京 - 淮安 - 广陵扬州 - 苏州 - 杭州)
const GRAND_CANAL_COORDS: [number, number][] = [
  [112.45, 34.62], // 洛阳
  [114.34, 34.79], // 开封
  [117.0, 33.8],
  [119.1, 33.5], // 淮安
  [119.41, 32.39], // 扬州
  [119.5, 32.2], // 镇江
  [120.0, 31.8], // 常州
  [120.58, 31.3], // 苏州
  [120.15, 30.27], // 杭州
];

// 历史真实官道陆路路网 (连接十六大名城，角色移动路径依托)
const ANCIENT_ROADS: Array<[string, string]> = [
  ['chang_an', 'jiangyou'], // 剑阁蜀道 (连通关中与巴蜀)
  ['jiangyou', 'chengdu'], // 锦官城官道
  ['chengdu', 'kuizhou'], // 巴峡道
  ['chang_an', 'luoyang'], // 两京官道 (经潼关)
  ['luoyang', 'bianjing'], // 中原官道
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
  currentYear: currentYearProp,
}) => {
  // 地图缩放与平移变换
  const [transform, setTransform] = useState({ x: -150, y: -80, scale: 1.0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  // 玩家角色平滑移动位置 (李白)
  const [playerPixelPos, setPlayerPixelPos] = useState<{ x: number; y: number }>({ x: 406, y: 442 });
  const [isTraveling, setIsTraveling] = useState(false);

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

  // 城市坐标映射表
  const cityPixelMap = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    Object.values(MAJOR_CITIES).forEach((c) => {
      map[c.id] = projectGeo(c.coordinates[0], c.coordinates[1]);
    });
    // 兼容别名
    map['sichuan'] = map['jiangyou'] || map['chengdu'];
    map['huanghelou'] = map['jiangxia'];
    map['lu_shan'] = map['xunyang'];
    map['baidicheng'] = map['kuizhou'];
    map['yangzhou'] = map['guangling'];
    return map;
  }, []);

  // 当当前所处地点变化时，执行平滑移动动画
  useEffect(() => {
    const target = cityPixelMap[currentLocation.id] || cityPixelMap['chang_an'];
    if (!target) return;

    setIsTraveling(true);
    const startX = playerPixelPos.x;
    const startY = playerPixelPos.y;
    const destX = target.x;
    const destY = target.y;

    const startTime = performance.now();
    const duration = 1100; // 1.1s 平滑行旅

    const animateStep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      // easeInOutCubic 曲线
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setPlayerPixelPos({
        x: startX + (destX - startX) * ease,
        y: startY + (destY - startY) * ease,
      });

      if (progress < 1.0) {
        requestAnimationFrame(animateStep);
      } else {
        setIsTraveling(false);
      }
    };

    requestAnimationFrame(animateStep);
  }, [currentLocation.id, cityPixelMap]);

  // 聚焦定位某个城市 (点击世界纪事或名城标签时平滑居中)
  const handleFocusCity = useCallback((cityId: string) => {
    const pt = cityPixelMap[cityId] || cityPixelMap['chang_an'];
    if (!pt || !containerRef.current) return;

    const containerW = containerRef.current.clientWidth;
    const containerH = containerRef.current.clientHeight;

    const targetScale = 1.35;
    const targetX = containerW / 2 - pt.x * targetScale;
    const targetY = containerH / 2 - pt.y * targetScale;

    setTransform({
      x: targetX,
      y: targetY,
      scale: targetScale,
    });

    const cityObj = MAJOR_CITIES[cityId];
    if (cityObj) {
      setActiveCityDetail(cityObj);
    }
  }, [cityPixelMap]);

  // 鼠标滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(2.8, Math.max(0.65, prev.scale * zoomFactor)),
    }));
  };

  // 鼠标拖拽平移
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  // 移动端手势
  const touchStartDistRef = useRef<number | null>(null);
  const touchLastPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchLastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchStartDistRef.current = null;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && touchLastPosRef.current) {
      const deltaX = e.touches[0].clientX - touchLastPosRef.current.x;
      const deltaY = e.touches[0].clientY - touchLastPosRef.current.y;
      touchLastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      setTransform((prev) => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
    } else if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (dist > 10) {
        const factor = dist / touchStartDistRef.current;
        touchStartDistRef.current = dist;
        setTransform((prev) => ({
          ...prev,
          scale: Math.min(2.8, Math.max(0.65, prev.scale * factor)),
        }));
      }
    }
  };

  const handleTouchEnd = () => {
    touchLastPosRef.current = null;
    touchStartDistRef.current = null;
  };

  // 缩放控制按钮
  const zoomIn = () =>
    setTransform((prev) => ({ ...prev, scale: Math.min(2.8, prev.scale * 1.25) }));
  const zoomOut = () =>
    setTransform((prev) => ({ ...prev, scale: Math.max(0.65, prev.scale / 1.25) }));
  const resetView = () => setTransform({ x: -150, y: -80, scale: 1.0 });

  // 城市列表
  const cityList = Object.values(MAJOR_CITIES);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`relative w-full h-full flex-1 overflow-hidden select-none bg-[#F5F8F3] touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* 1. 顶部悬浮：世界播报风云台 */}
      <WorldChronicleDrawer
        currentYear={currentYear}
        chronicles={chronicles}
        activeHighlight={activeHighlight}
        onFocusCity={handleFocusCity}
      />

      {/* 2. 核心 2D 古典水墨与工笔山河矢量画布 */}
      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
        className="w-[1400px] h-[950px] relative pointer-events-auto"
      >
        <svg
          viewBox="0 0 1400 950"
          className="w-full h-full absolute inset-0 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 宣纸古绢本底纹 */}
            <radialGradient id="mapParchmentGlow" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#F4F8F3" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E6EDE4" stopOpacity="0.95" />
            </radialGradient>

            {/* 黄河泥金波光 */}
            <linearGradient id="yellowRiverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#D97706" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#B45309" stopOpacity="0.95" />
            </linearGradient>

            {/* 长江碧波流光 */}
            <linearGradient id="yangtzeRiverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0D9488" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.95" />
            </linearGradient>

            {/* 运河翠色 */}
            <linearGradient id="canalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0D9488" stopOpacity="0.85" />
            </linearGradient>

            {/* 湖泊水润 */}
            <radialGradient id="lakeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {/* 1. 绢本宣纸底色晕染 */}
          <rect x="0" y="0" width="1400" height="950" fill="url(#mapParchmentGlow)" />

          {/* 经纬度地理网格暗线 (古代经纬方舆线) */}
          <g stroke="#047857" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="6 6">
            <line x1="80" y1="200" x2="1320" y2="200" />
            <line x1="80" y1="400" x2="1320" y2="400" />
            <line x1="80" y1="600" x2="1320" y2="600" />
            <line x1="80" y1="800" x2="1320" y2="800" />
            <line x1="300" y1="80" x2="300" y2="880" />
            <line x1="600" y1="80" x2="600" y2="880" />
            <line x1="900" y1="80" x2="900" y2="880" />
            <line x1="1150" y1="80" x2="1150" y2="880" />
          </g>

          {/* 2. 东海沧海波澜海域 (水波纹理) */}
          <path
            d={`M 1150,80 L 1360,80 L 1360,900 L 900,900 L 980,820 L 1050,750 L 1100,680 L 1140,550 L 1180,480 L 1160,380 L 1220,320 L 1150,220 Z`}
            fill="#0F766E"
            fillOpacity="0.08"
          />
          <path
            d={coordsToPath(COASTLINE_COORDS)}
            fill="none"
            stroke="#0D9488"
            strokeWidth="2.5"
            strokeDasharray="8 5"
            strokeOpacity="0.5"
          />
          <text
            x="1220"
            y="420"
            fill="#0D9488"
            fontSize="14"
            letterSpacing="8"
            className="font-poetry font-bold opacity-40 select-none"
          >
            沧海万里 · 东海浩瀚
          </text>

          {/* 3. 历史各大地理区域水墨意象印鉴 */}
          <g className="font-poetry font-bold select-none tracking-widest opacity-15">
            <text x="320" y="440" fontSize="28" fill="#047857">【巴蜀天府】</text>
            <text x="560" y="290" fontSize="28" fill="#B45309">【关陇京畿】</text>
            <text x="780" y="270" fontSize="28" fill="#B45309">【中原腹地】</text>
            <text x="790" y="520" fontSize="28" fill="#0D9488">【荆襄九派】</text>
            <text x="1080" y="480" fontSize="28" fill="#047857">【烟雨江南】</text>
            <text x="890" y="160" fontSize="28" fill="#475569">【幽燕大地】</text>
            <text x="780" y="780" fontSize="28" fill="#047857">【南岭苍茫】</text>
          </g>

          {/* 4. 工笔水墨山脉群 (峰峦层叠) */}
          <g className="text-emerald-950 opacity-50" stroke="#064E3B" strokeWidth="1.5" fill="none">
            {/* 秦岭横亘 (关中南屏) */}
            <path d="M 520,375 L 545,350 L 570,380 L 595,345 L 620,380 L 650,355 L 680,380" />
            <text x="580" y="365" fill="#064E3B" fontSize="11" className="font-poetry font-bold opacity-80">
              ▲ 秦岭天险
            </text>

            {/* 太行山脉 (中原西屏) */}
            <path d="M 770,210 L 755,240 L 775,270 L 760,300 L 780,330" />
            <text x="775" y="260" fill="#064E3B" fontSize="11" className="font-poetry font-bold opacity-80">
              ▲ 太行山
            </text>

            {/* 巴山蜀道 / 剑阁天险 */}
            <path d="M 430,410 L 450,385 L 470,415 L 490,390 L 510,415" />
            <text x="445" y="405" fill="#064E3B" fontSize="10" className="font-poetry font-bold opacity-75">
              ▲ 剑阁蜀道
            </text>

            {/* 巫山三峡 */}
            <path d="M 640,455 L 655,435 L 670,460 L 685,440 L 700,460" />
            <text x="655" y="445" fill="#064E3B" fontSize="10" className="font-poetry font-bold opacity-80">
              ▲ 巫山三峡
            </text>

            {/* 匡庐秀峰 (庐山) */}
            <path d="M 915,505 L 930,480 L 945,510" />
            <text x="920" y="495" fill="#064E3B" fontSize="10" className="font-poetry font-bold opacity-80">
              ▲ 庐山
            </text>
          </g>

          {/* 5. 真实大江大河干流水系 */}
          {/* 黄河之水天上来 (泥金色) */}
          <path
            d={coordsToPath(YELLOW_RIVER_COORDS)}
            fill="none"
            stroke="url(#yellowRiverGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-sm opacity-90"
          />
          <text
            x="720"
            y="295"
            fill="#B45309"
            fontSize="11"
            className="font-poetry font-bold select-none opacity-80"
          >
            黄河之水天上来 ➔
          </text>

          {/* 万里长江浩荡东去 (碧水青玉色) */}
          <path
            d={coordsToPath(YANGTZE_RIVER_COORDS)}
            fill="none"
            stroke="url(#yangtzeRiverGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-sm opacity-95"
          />
          <text
            x="840"
            y="470"
            fill="#0D9488"
            fontSize="11"
            className="font-poetry font-bold select-none opacity-85"
          >
            万里长江浩荡东流 ➔
          </text>

          {/* 隋唐宋大运河 (通济渠与江南运河) */}
          <path
            d={coordsToPath(GRAND_CANAL_COORDS)}
            fill="none"
            stroke="url(#canalGrad)"
            strokeWidth="3.2"
            strokeDasharray="6 4"
            strokeLinecap="round"
            className="opacity-80"
          />
          <text
            x="960"
            y="370"
            fill="#059669"
            fontSize="10"
            className="font-poetry font-bold select-none opacity-70"
          >
            汴河大运河
          </text>

          {/* 湖泊意象 (洞庭湖、鄱阳湖、太湖) */}
          {/* 洞庭湖 */}
          <ellipse cx="795" cy="510" rx="20" ry="14" fill="url(#lakeGrad)" stroke="#0D9488" strokeWidth="1.2" />
          <text x="780" y="535" fill="#047857" fontSize="9" className="font-poetry font-bold opacity-75">洞庭湖</text>
          {/* 鄱阳湖 */}
          <ellipse cx="940" cy="530" rx="16" ry="22" fill="url(#lakeGrad)" stroke="#0D9488" strokeWidth="1.2" />
          <text x="925" y="560" fill="#047857" fontSize="9" className="font-poetry font-bold opacity-75">鄱阳湖</text>
          {/* 太湖 */}
          <ellipse cx="1120" cy="460" rx="22" ry="16" fill="url(#lakeGrad)" stroke="#0D9488" strokeWidth="1.2" />
          <text x="1105" y="485" fill="#047857" fontSize="9" className="font-poetry font-bold opacity-75">太湖</text>

          {/* 6. 古代官道驿路线网 (角色行动走廊) */}
          <g stroke="#B45309" strokeWidth="1.6" strokeDasharray="5 4" strokeOpacity="0.45" fill="none">
            {ANCIENT_ROADS.map(([c1, c2], idx) => {
              const p1 = cityPixelMap[c1];
              const p2 = cityPixelMap[c2];
              if (!p1 || !p2) return null;
              return (
                <line
                  key={idx}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                />
              );
            })}
          </g>

          {/* 7. 司南罗盘 (左下角) */}
          <g transform="translate(180, 830)" className="opacity-60 select-none">
            <circle cx="0" cy="0" r="32" fill="none" stroke="#047857" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="0" cy="0" r="24" fill="none" stroke="#B45309" strokeWidth="1.2" />
            <line x1="0" y1="-32" x2="0" y2="32" stroke="#047857" strokeWidth="1.8" />
            <line x1="-32" y1="0" x2="32" y2="0" stroke="#047857" strokeWidth="1.8" />
            <text x="-4" y="-36" fill="#047857" fontSize="11" className="font-poetry font-bold">北</text>
            <text x="-4" y="44" fill="#047857" fontSize="11" className="font-poetry">南</text>
            <text x="36" y="4" fill="#047857" fontSize="11" className="font-poetry">东</text>
            <text x="-46" y="4" fill="#047857" fontSize="11" className="font-poetry">西</text>
          </g>
        </svg>

        {/* 8. 名城地标节点印鉴 (高对比度清秀楼阁玉牌) */}
        {cityList.map((city) => {
          const pt = cityPixelMap[city.id];
          if (!pt) return null;

          const isCurrent =
            city.id === currentLocation.id ||
            (currentLocation.name_cn && city.name_cn.includes(currentLocation.name_cn));
          const dynastyData = dynasty === 'tang' ? city.tang : city.song;
          const dynastyName = dynastyData.name || city.name_cn;

          // 统计在当前城市的其他文人
          const poetsHere = otherPoets.filter((p) => p.currentCityId === city.id);

          return (
            <div
              key={city.id}
              style={{
                left: `${pt.x}px`,
                top: `${pt.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20"
            >
              {/* 当前所在地的呼吸发光波纹 */}
              {isCurrent && (
                <div className="absolute -inset-4 rounded-full bg-emerald-500/25 animate-ping pointer-events-none" />
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCityDetail(city);
                }}
                className={`group relative flex flex-col items-center transition-all duration-200 cursor-pointer ${
                  isCurrent ? 'scale-115 z-30' : 'hover:scale-110 hover:z-25'
                }`}
              >
                {/* 城池建筑印章图标 */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md transition-all border ${
                    isCurrent
                      ? 'bg-gradient-to-br from-emerald-700 to-teal-800 text-white border-emerald-300 ring-2 ring-white/90 shadow-emerald-700/40'
                      : 'bg-white text-emerald-800 border-slate-300 group-hover:border-emerald-600 group-hover:bg-emerald-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>

                {/* 城市名牌 (极高对比度纯正黑墨色，拒绝发虚发白) */}
                <div
                  className={`mt-1 text-xs px-2.5 py-0.5 rounded-full font-poetry whitespace-nowrap shadow-md border transition-all ${
                    isCurrent
                      ? 'bg-emerald-800 text-white border-emerald-600 font-bold shadow-emerald-800/20'
                      : 'bg-white/98 text-[#09131C] border-slate-300/90 font-semibold group-hover:border-emerald-600 group-hover:text-emerald-900'
                  }`}
                >
                  <span>{dynastyName}</span>
                </div>

                {/* 同城文人会聚微标 */}
                {poetsHere.length > 0 && (
                  <div className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white shadow-sm flex items-center space-x-0.5">
                    <Users className="w-2.5 h-2.5" />
                    <span>{poetsHere.length}</span>
                  </div>
                )}
              </button>
            </div>
          );
        })}

        {/* 9. 多文人自主漫游棋子层 (同时代文人在各自时间线自主行历) */}
        {otherPoets.map(({ poet, currentCityId, status, recentWork, age, isAlive }) => {
          if (!isAlive) return null;
          const cityPt = cityPixelMap[currentCityId];
          if (!cityPt) return null;

          // 为避免同城文人完全重叠，稍微进行径向偏移
          const offsetSeed = poet.id.charCodeAt(0) % 5;
          const offsetX = (offsetSeed - 2) * 18 + 12;
          const offsetY = (offsetSeed % 2 === 0 ? -1 : 1) * 22;

          return (
            <div
              key={poet.id}
              style={{
                left: `${cityPt.x + offsetX}px`,
                top: `${cityPt.y + offsetY}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-25 transition-all duration-700 ease-out"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPoetDossier({
                    poet,
                    cityId: currentCityId,
                    cityName: MAJOR_CITIES[currentCityId]?.name_cn || currentCityId,
                    status,
                    recentWork,
                    age,
                  });
                }}
                title={`${poet.name} (${age}岁) 正在此地：${status}`}
                className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-125"
              >
                {/* 文人头像小棋子印章 */}
                <div
                  style={{ backgroundColor: poet.color }}
                  className="w-7 h-7 rounded-full text-white font-bold text-[10px] font-poetry flex items-center justify-center shadow-lg border-2 border-white ring-1 ring-slate-300"
                >
                  {poet.avatarText}
                </div>

                {/* 悬浮文人姓名小微标 */}
                <span className="mt-0.5 px-1.5 py-0.2 rounded bg-slate-900/90 text-white text-[9px] font-poetry whitespace-nowrap shadow opacity-85 group-hover:opacity-100">
                  {poet.name}
                </span>
              </button>
            </div>
          );
        })}

        {/* 10. 玩家主角 (李白/苏轼) 当前动态行历棋子 (带平滑游历路径与光环) */}
        <div
          style={{
            left: `${playerPixelPos.x}px`,
            top: `${playerPixelPos.y}px`,
            transform: 'translate(-50%, -50%)',
            transition: isTraveling ? 'none' : 'transform 0.2s',
          }}
          className="absolute z-30 pointer-events-none"
        >
          {/* 行历足迹光晕 */}
          <div className="absolute -inset-3 rounded-full bg-amber-500/30 animate-ping" />

          <div className="relative flex flex-col items-center">
            {/* 主角金色印章 */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white flex items-center justify-center font-poetry font-bold text-xs shadow-xl border-2 border-amber-200 ring-2 ring-amber-600/50">
              {dynasty === 'tang' ? '太白' : '东坡'}
            </div>

            {/* 当前行历状态标签 */}
            <div className="mt-1 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold font-poetry whitespace-nowrap shadow-md flex items-center space-x-1 border border-amber-300">
              <Footprints className="w-3 h-3 text-amber-200" />
              <span>{isTraveling ? '策马行路中...' : '当前驻足'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 悬浮地图交互控件 (右下角) */}
      <div className="absolute right-4 bottom-24 z-30 flex flex-col items-center bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl p-1.5 shadow-xl space-y-1.5">
        <button
          onClick={zoomIn}
          title="放大地图"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 hover:text-emerald-800 active:scale-95 transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          title="缩小地图"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 hover:text-emerald-800 active:scale-95 transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-5 h-[1px] bg-slate-300 my-0.5" />
        <button
          onClick={resetView}
          title="复位全览"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 hover:text-emerald-800 active:scale-95 transition-all text-[11px] font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. 探索指南微标 (左下角) */}
      <div className="absolute left-4 bottom-24 z-20 hidden sm:flex items-center space-x-2.5 bg-white/95 backdrop-blur-md border border-slate-300 px-4 py-2 rounded-full text-xs text-slate-800 shadow-md">
        <Compass className="w-4 h-4 text-emerald-800 shrink-0" />
        <span className="font-medium">
          拖拽漫游 · 滚轮缩放 · 点击名城开启当朝风土 · 点击其他文人探查同期行迹
        </span>
      </div>

      {/* 5. 同行诗人档案弹窗 (点击地图上其他文人时弹出) */}
      {selectedPoetDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in">
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
      )}
    </div>
  );
};
