import React, { useState, useRef, useCallback } from 'react';
import { LocationData } from '../../types/location';
import { MAJOR_CITIES, CityCulturalData } from '../../data/cities';
import { CityDetailModal } from './CityDetailModal';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Compass,
} from 'lucide-react';

interface TravelMapStageProps {
  currentLocation: LocationData;
  dynasty: 'tang' | 'song';
  onTravel: (locationId: string) => void;
  unlockedPoemIds: string[];
}

// 真实经纬度向 SVG 坐标投影函数 (中央经纬度投影)
export function projectGeo([lng, lat]: [number, number]): { x: number; y: number } {
  const minLng = 98.0;
  const maxLng = 123.8;
  const minLat = 20.2;
  const maxLat = 41.8;

  const normX = (lng - minLng) / (maxLng - minLng);
  const normY = (maxLat - lat) / (maxLat - minLat);

  const x = normX * 1060 + 70;
  const y = normY * 730 + 50;
  return { x, y };
}

// 辅助：生成平滑 SVG 路径
function coordsToPath(coords: [number, number][]): string {
  if (coords.length === 0) return '';
  const pts = coords.map(projectGeo);
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
  }
  return d;
}

// 真实地理航道关键点集 (基于国家基础地理真实经纬度采样子集)
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
  [110.2, 34.6], // 潼关大拐弯
  [111.2, 34.8], // 三门峡
  [112.45, 34.9], // 洛阳北
  [114.34, 35.0], // 开封北
  [116.8, 36.5],
  [118.8, 37.6],
  [119.2, 37.8], // 入渤海
];

const YANGTZE_RIVER_COORDS: [number, number][] = [
  [100.2, 27.2],
  [102.5, 27.8],
  [104.6, 28.8], // 宜宾
  [105.4, 28.9], // 泸州
  [106.5, 29.5], // 重庆
  [107.5, 29.8], // 涪陵
  [109.57, 31.04], // 白帝城夔门
  [110.0, 31.1], // 巫峡
  [111.3, 30.7], // 宜昌
  [112.2, 30.3], // 荆州
  [113.1, 29.4], // 岳阳洞庭湖
  [114.3, 30.54], // 武汉江夏
  [115.98, 29.72], // 九江浔阳/鄱阳湖
  [117.0, 30.5], // 安庆
  [118.4, 31.3], // 芜湖
  [118.79, 32.06], // 南京
  [119.41, 32.39], // 扬州
  [120.8, 31.8],
  [121.5, 31.23], // 入东海
];

// 京杭大运河 (汴河/通济渠/江南运河)
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

export const TravelMapStage: React.FC<TravelMapStageProps> = ({
  currentLocation,
  dynasty,
  onTravel,
}) => {
  // 缩放与平移变换状态
  const [transform, setTransform] = useState({ x: -40, y: -20, scale: 1.05 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 选中的城市详情弹窗
  const [activeCityDetail, setActiveCityDetail] = useState<CityCulturalData | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // 鼠标滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    setTransform((prev) => {
      const nextScale = Math.min(3.0, Math.max(0.75, prev.scale * zoomFactor));
      return { ...prev, scale: nextScale };
    });
  }, []);

  // 鼠标拖拽平移
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  // 缩放按钮交互
  const zoomIn = () =>
    setTransform((prev) => ({ ...prev, scale: Math.min(3.0, prev.scale * 1.25) }));
  const zoomOut = () =>
    setTransform((prev) => ({ ...prev, scale: Math.max(0.75, prev.scale / 1.25) }));
  const resetView = () => setTransform({ x: -40, y: -20, scale: 1.05 });

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
      className={`relative w-full h-full flex-1 overflow-hidden select-none bg-[#F5F8F4] ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* 2. 可缩放与平移的矢量图层画布 */}
      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '50% 50%',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
        className="w-[1200px] h-[850px] relative pointer-events-auto"
      >
        <svg
          viewBox="0 0 1200 850"
          className="w-full h-full absolute inset-0 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 长江春水碧渐变 */}
            <linearGradient id="realYangtzeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#0D9488" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
            </linearGradient>

            {/* 黄河古道泥金色 */}
            <linearGradient id="realYellowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.75" />
              <stop offset="65%" stopColor="#D97706" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#B45309" stopOpacity="0.9" />
            </linearGradient>

            {/* 大运河青绿 */}
            <linearGradient id="realCanalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
            </linearGradient>

            {/* 盆地与山脉水墨微晕 */}
            <radialGradient id="bashuMist" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.16" />
              <stop offset="80%" stopColor="#059669" stopOpacity="0.04" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* 1. 地形大区底色晕染 */}
          <ellipse cx="330" cy="450" rx="110" ry="75" fill="url(#bashuMist)" />
          <ellipse cx="520" cy="310" rx="90" ry="50" fill="url(#bashuMist)" />
          <ellipse cx="710" cy="300" rx="100" ry="60" fill="url(#bashuMist)" />
          <ellipse cx="940" cy="420" rx="120" ry="85" fill="url(#bashuMist)" />

          {/* 2. 真实中国东部沿海海岸线 (渤海、山东半岛、东海、杭州湾、南海) */}
          <path
            d={coordsToPath(COASTLINE_COORDS)}
            fill="none"
            stroke="#0D9488"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="opacity-40"
          />
          <text
            x="1060"
            y="350"
            fill="#0D9488"
            fontSize="12"
            letterSpacing="6"
            className="font-poetry opacity-40 select-none font-bold"
          >
            沧海万顷
          </text>

          {/* 3. 真实黄河干流 ("几" 字型自然曲流) */}
          <path
            d={coordsToPath(YELLOW_RIVER_COORDS)}
            fill="none"
            stroke="url(#realYellowGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-sm opacity-85"
          />
          <text
            x="640"
            y="265"
            fill="#B45309"
            fontSize="10"
            className="font-poetry font-bold opacity-60 select-none"
          >
            黄河之水天上来 ➔
          </text>

          {/* 4. 真实长江干流 (自金沙江、巴蜀、三峡、江汉平原、浔阳至广陵入海) */}
          <path
            d={coordsToPath(YANGTZE_RIVER_COORDS)}
            fill="none"
            stroke="url(#realYangtzeGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-sm opacity-90"
          />
          <text
            x="760"
            y="420"
            fill="#0D9488"
            fontSize="10"
            className="font-poetry font-bold opacity-75 select-none"
          >
            万里长江浩荡东去 ➔
          </text>

          {/* 5. 隋唐大运河通济渠与江南运河 */}
          <path
            d={coordsToPath(GRAND_CANAL_COORDS)}
            fill="none"
            stroke="url(#realCanalGrad)"
            strokeWidth="2.2"
            strokeDasharray="4 3"
            strokeLinecap="round"
            className="opacity-70"
          />
          <text
            x="850"
            y="340"
            fill="#059669"
            fontSize="9"
            className="font-poetry opacity-60 select-none"
          >
            汴河通济渠
          </text>

          {/* 6. 秦岭大巴山山岳剪影 (地标山脉) */}
          <g className="opacity-40 text-emerald-800" stroke="#047857" strokeWidth="1.2" fill="none">
            {/* 秦岭 */}
            <path d="M 460,340 L 485,320 L 510,345 L 535,315 L 560,345 L 585,325 L 610,345" />
            <text x="525" y="335" fill="#047857" fontSize="10" className="font-poetry font-bold opacity-75">
              ▲ 秦岭天险
            </text>
            {/* 巫山三峡 */}
            <path d="M 545,410 L 560,390 L 575,415 L 590,395 L 605,415" />
            <text x="565" y="390" fill="#047857" fontSize="9" className="font-poetry font-bold opacity-70">
              ▲ 巫山三峡
            </text>
            {/* 太行山脉 */}
            <path d="M 685,210 L 675,235 L 685,260 L 675,285" />
            <text x="690" y="245" fill="#047857" fontSize="9" className="font-poetry font-bold opacity-70">
              ▲ 太行山
            </text>
            {/* 庐山 */}
            <path d="M 805,480 L 815,455 L 825,480" />
            <text x="800" y="450" fill="#047857" fontSize="9" className="font-poetry font-bold opacity-70">
              ▲ 匡庐
            </text>
          </g>

          {/* 7. 湖泊意象 (洞庭湖、鄱阳湖、太湖) */}
          {/* 洞庭湖 */}
          <ellipse cx="690" cy="465" rx="14" ry="10" fill="#10B981" fillOpacity="0.25" stroke="#0D9488" strokeWidth="1" />
          <text x="678" y="485" fill="#059669" fontSize="8" className="font-poetry opacity-60">洞庭湖</text>
          {/* 鄱阳湖 */}
          <ellipse cx="825" cy="485" rx="12" ry="16" fill="#10B981" fillOpacity="0.25" stroke="#0D9488" strokeWidth="1" />
          <text x="815" y="510" fill="#059669" fontSize="8" className="font-poetry opacity-60">鄱阳湖</text>
          {/* 太湖 */}
          <ellipse cx="980" cy="425" rx="15" ry="12" fill="#10B981" fillOpacity="0.25" stroke="#0D9488" strokeWidth="1" />
          <text x="970" y="445" fill="#059669" fontSize="8" className="font-poetry opacity-60">太湖</text>

          {/* 8. 朝代历史大区水印 */}
          <g className="font-poetry font-bold opacity-15 select-none tracking-widest">
            <text x="290" y="420" fontSize="22" fill="#10B981">【巴蜀】</text>
            <text x="490" y="280" fontSize="22" fill="#F59E0B">【关中】</text>
            <text x="700" y="270" fontSize="22" fill="#F59E0B">【中原】</text>
            <text x="700" y="480" fontSize="22" fill="#0D9488">【荆襄】</text>
            <text x="960" y="470" fontSize="22" fill="#10B981">【江南】</text>
            <text x="680" y="660" fontSize="22" fill="#10B981">【岭南】</text>
          </g>

          {/* 9. 司南罗盘 (右下角水墨图饰) */}
          <g transform="translate(140, 720)" className="opacity-45 select-none">
            <circle cx="0" cy="0" r="30" fill="none" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="22" fill="none" stroke="#0D9488" strokeWidth="1" />
            <line x1="0" y1="-30" x2="0" y2="30" stroke="#10B981" strokeWidth="1.5" />
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#10B981" strokeWidth="1.5" />
            <text x="-4" y="-34" fill="#059669" fontSize="10" className="font-poetry font-bold">北</text>
            <text x="-4" y="42" fill="#059669" fontSize="10" className="font-poetry">南</text>
            <text x="34" y="4" fill="#059669" fontSize="10" className="font-poetry">东</text>
            <text x="-42" y="4" fill="#059669" fontSize="10" className="font-poetry">西</text>
          </g>
        </svg>

        {/* 3. 所有名城交互地标印章 (全国各大主要城市均可点击探索) */}
        {cityList.map((city) => {
          const pos = projectGeo(city.coordinates);
          const isCurrent =
            city.id === currentLocation.id ||
            (currentLocation.name_cn && city.name_cn.includes(currentLocation.name_cn));
          const dynastyName = city.dynasty_names[dynasty] || city.name_cn;

          return (
            <div
              key={city.id}
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              {/* 当前所在地的呼吸发光波纹 */}
              {isCurrent && (
                <div className="absolute -inset-4 rounded-full bg-theme-primary/30 animate-ping pointer-events-none" />
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCityDetail(city);
                }}
                className={`group relative flex flex-col items-center transition-all duration-300 ${
                  isCurrent
                    ? 'scale-125 z-30'
                    : 'hover:scale-115 cursor-pointer opacity-90 hover:opacity-100'
                }`}
              >
                {/* 城市印鉴图章 */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                    isCurrent
                      ? 'bg-gradient-to-br from-theme-primary to-theme-accent text-white shadow-jade-glow ring-2 ring-white'
                      : 'bg-theme-surface-card border border-theme-primary/40 text-theme-primary hover:bg-theme-primary hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>

                {/* 城市名称标签 (根据朝代动态变更名称) */}
                <span
                  className={`mt-1 text-[11px] px-2 py-0.5 rounded-full font-poetry whitespace-nowrap shadow-sm border transition-all ${
                    isCurrent
                      ? 'bg-theme-primary text-white border-transparent font-bold shadow-md ring-1 ring-white/50'
                      : 'bg-theme-surface-card/95 text-theme-text border-theme-border font-medium group-hover:border-theme-primary group-hover:text-theme-primary'
                  }`}
                >
                  {dynastyName}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 3. 悬浮的地图缩放控制器 (右下角) */}
      <div className="absolute right-4 bottom-24 z-30 flex flex-col items-center bg-theme-surface-card/90 backdrop-blur-md border border-theme-border rounded-2xl p-1 shadow-xl space-y-1">
        <button
          onClick={zoomIn}
          title="放大地图"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-theme-text hover:bg-gray-100 hover:text-theme-primary active:scale-95 transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          title="缩小地图"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-theme-text hover:bg-gray-100 hover:text-theme-primary active:scale-95 transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-4 h-[1px] bg-theme-border my-0.5" />
        <button
          onClick={resetView}
          title="重置全览"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-theme-text hover:bg-gray-100 hover:text-theme-primary active:scale-95 transition-all text-[10px] font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. 探索指引与当前所处位置指示器 (左下角) */}
      <div className="absolute left-4 bottom-24 z-20 hidden sm:flex items-center space-x-2 bg-theme-surface-card/85 backdrop-blur-md border border-theme-border px-3.5 py-1.5 rounded-full text-xs text-theme-text-muted shadow-sm">
        <Compass className="w-3.5 h-3.5 text-theme-primary" />
        <span>滚轮缩放 / 拖拽漫游 · 点击任意名城探访风土胜迹</span>
      </div>

      {/* 5. 城市人文详情弹窗 (点击任意地名时展开) */}
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
