import React, { useState } from 'react';
import { LocationData } from '../../types/location';
import { LOCATIONS } from '../../data/locations';
import { MapPin, Sparkles, Footprints, Mountain } from 'lucide-react';

interface TravelMapStageProps {
  currentLocation: LocationData;
  dynasty: 'tang' | 'song';
  onTravel: (locationId: string) => void;
  unlockedPoemIds: string[];
}

export const TravelMapStage: React.FC<TravelMapStageProps> = ({
  currentLocation,
  dynasty,
  onTravel,
}) => {
  const [selectedPreviewLoc, setSelectedPreviewLoc] =
    useState<LocationData | null>(null);

  const allLocations = Object.values(LOCATIONS);

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden select-none bg-[#F7FAF6] transition-colors duration-500">
      {/* 1. 真实水墨山河地理底图 (SVG 矢量地理山水层) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 水体与山川墨染渐变 */}
          <linearGradient id="riverGradYangtze" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#0D9488" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="riverGradYellow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#D97706" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0.5" />
          </linearGradient>

          {/* 山峦晕染 */}
          <radialGradient id="mountainMist" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.12" />
            <stop offset="70%" stopColor="#059669" stopOpacity="0.04" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* 区域地理大区水墨晕染底色 */}
        {/* 巴蜀盆地 */}
        <circle cx="280" cy="400" r="95" fill="url(#mountainMist)" />
        {/* 关中平原 */}
        <ellipse cx="430" cy="290" rx="80" ry="50" fill="url(#mountainMist)" />
        {/* 中原大地 */}
        <ellipse cx="540" cy="310" rx="90" ry="60" fill="url(#mountainMist)" />
        {/* 江南水乡 */}
        <ellipse cx="720" cy="400" rx="110" ry="75" fill="url(#mountainMist)" />

        {/* 2. 中国历史海岸线与海域水波 (东海/黄海/渤海意象) */}
        <path
          d="M 820,120 Q 770,220 790,300 T 880,450 T 840,650"
          fill="none"
          stroke="#0D9488"
          strokeWidth="3"
          strokeDasharray="8 6"
          className="opacity-25"
        />
        <text x="860" y="320" fill="#0D9488" fontSize="11" letterSpacing="4" className="font-poetry opacity-30 select-none">
          沧海万顷
        </text>

        {/* 3. 黄河干流 (九曲黄河巨龙奔涌 "几" 字形) */}
        <g id="yellow-river">
          <path
            d="M 330,280 C 350,190 410,180 430,220 C 450,260 440,320 490,310 C 530,300 580,280 640,300 T 780,270"
            fill="none"
            stroke="url(#riverGradYellow)"
            strokeWidth="5"
            strokeLinecap="round"
            className="filter drop-shadow-sm"
          />
          <text x="500" y="275" fill="#B45309" fontSize="10" className="font-poetry opacity-40 select-none">
            黄河之水天上来 ➔
          </text>
        </g>

        {/* 4. 长江干流 (浩浩长江横贯东西，经巴蜀、三峡、江夏、浔阳、广陵入海) */}
        <g id="yangtze-river">
          <path
            d="M 230,420 C 270,390 320,410 380,400 C 440,390 480,420 540,410 C 600,400 640,440 700,390 C 740,360 780,380 820,370"
            fill="none"
            stroke="url(#riverGradYangtze)"
            strokeWidth="7"
            strokeLinecap="round"
            className="filter drop-shadow-md"
          />
          <text x="610" y="435" fill="#0D9488" fontSize="10" className="font-poetry opacity-50 select-none">
            长江大江东去 ➔
          </text>
        </g>

        {/* 5. 隋唐宋大运河水脉 (洛阳 ➔ 广陵 ➔ 临安) */}
        <path
          d="M 520,315 Q 630,340 730,350 T 770,430"
          fill="none"
          stroke="#10B981"
          strokeWidth="2.5"
          strokeDasharray="5 4"
          className="opacity-45"
        />
        <text x="660" y="335" fill="#059669" fontSize="9" className="font-poetry opacity-40 select-none">
          汴河通济渠
        </text>

        {/* 6. 秦岭与大巴山脉意象 (横亘关中与巴蜀之间) */}
        <g className="opacity-30 text-emerald-800" stroke="#059669" strokeWidth="1.2" fill="none">
          <path d="M 330,330 L 350,310 L 370,335 L 390,305 L 420,335 L 450,310 L 480,335" />
          <path d="M 360,345 L 380,325 L 400,350 L 430,320 L 460,345" />
          <text x="390" y="325" fill="#047857" fontSize="10" className="font-poetry font-bold opacity-60">
            ▲ 秦岭
          </text>
        </g>

        {/* 巫山三峡山峦 */}
        <g className="opacity-30 text-emerald-800" stroke="#059669" strokeWidth="1.2" fill="none">
          <path d="M 370,410 L 385,385 L 400,415 L 415,390 L 430,410" />
          <text x="382" y="380" fill="#047857" fontSize="9" className="font-poetry opacity-60">
            ▲ 巫山三峡
          </text>
        </g>

        {/* 匡庐匡山 */}
        <g className="opacity-30 text-emerald-800" stroke="#059669" strokeWidth="1.2" fill="none">
          <path d="M 605,445 L 620,415 L 635,445" />
          <text x="608" y="410" fill="#047857" fontSize="9" className="font-poetry opacity-60">
            ▲ 庐山香炉
          </text>
        </g>

        {/* 7. 地理历史人文大区水印 */}
        <g className="font-poetry select-none font-bold opacity-20">
          <text x="260" y="370" fontSize="18" fill="#10B981" letterSpacing="6">【巴蜀】</text>
          <text x="400" y="260" fontSize="18" fill="#F59E0B" letterSpacing="6">【关中】</text>
          <text x="520" y="270" fontSize="18" fill="#F59E0B" letterSpacing="6">【中原】</text>
          <text x="510" y="470" fontSize="18" fill="#0D9488" letterSpacing="6">【荆襄】</text>
          <text x="730" y="450" fontSize="18" fill="#10B981" letterSpacing="6">【江南】</text>
        </g>

        {/* 8. 司南罗盘 (古风方位角) */}
        <g transform="translate(80, 560)" className="opacity-35 select-none">
          <circle cx="0" cy="0" r="32" fill="none" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="#0D9488" strokeWidth="1" />
          <line x1="0" y1="-32" x2="0" y2="32" stroke="#10B981" strokeWidth="1.5" />
          <line x1="-32" y1="0" x2="32" y2="0" stroke="#10B981" strokeWidth="1.5" />
          <text x="-4" y="-36" fill="#059669" fontSize="9" className="font-poetry font-bold">北</text>
          <text x="-4" y="45" fill="#059669" fontSize="9" className="font-poetry">南</text>
          <text x="36" y="3" fill="#059669" fontSize="9" className="font-poetry">东</text>
          <text x="-45" y="3" fill="#059669" fontSize="9" className="font-poetry">西</text>
        </g>
      </svg>

      {/* 2. 地点间陆路与驿道连接线 (SVG 驿道层) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {allLocations.map((loc) =>
          loc.connected_to.map((targetId) => {
            const targetLoc = LOCATIONS[targetId];
            if (!targetLoc) return null;
            return (
              <line
                key={`${loc.id}-${targetId}`}
                x1={`${loc.mapPosition.x}%`}
                y1={`${loc.mapPosition.y}%`}
                x2={`${targetLoc.mapPosition.x}%`}
                y2={`${targetLoc.mapPosition.y}%`}
                stroke="var(--color-primary)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-40"
              />
            );
          })
        )}
      </svg>

      {/* 3. 历史城市与名胜地点印章 (交互层) */}
      <div className="absolute inset-0">
        {allLocations.map((loc) => {
          const isCurrent = loc.id === currentLocation.id;
          const isConnected = currentLocation.connected_to.includes(loc.id);
          const dynastyName = loc.dynasty_names[dynasty] || loc.name_cn;

          return (
            <div
              key={loc.id}
              style={{
                left: `${loc.mapPosition.x}%`,
                top: `${loc.mapPosition.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              {/* 当前所在地的金色/翠色涟漪扩散动效 */}
              {isCurrent && (
                <div className="absolute -inset-4 rounded-full bg-theme-primary/25 animate-ping pointer-events-none" />
              )}

              {/* 地点交互按钮 */}
              <button
                onClick={() => {
                  if (isCurrent) return;
                  setSelectedPreviewLoc(loc);
                }}
                className={`group relative flex flex-col items-center transition-all duration-300 ${
                  isCurrent
                    ? 'scale-115 z-20'
                    : isConnected
                    ? 'hover:scale-110 cursor-pointer opacity-95'
                    : 'opacity-65 hover:opacity-90'
                }`}
              >
                {/* 地点印章图标 */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
                    isCurrent
                      ? 'bg-gradient-to-br from-theme-primary to-theme-accent text-white shadow-jade-glow ring-2 ring-white'
                      : isConnected
                      ? 'bg-theme-surface-card border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white'
                      : 'bg-theme-surface border border-gray-300 text-gray-500'
                  }`}
                >
                  {loc.type === 'landmark' ? (
                    <Mountain className="w-4 h-4" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </div>

                {/* 城市朝代地名标签 (朱砂印/玉牌风格) */}
                <span
                  className={`mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-poetry whitespace-nowrap shadow-sm border transition-all ${
                    isCurrent
                      ? 'bg-theme-primary text-white border-transparent font-bold shadow-md'
                      : 'bg-theme-surface-card/95 text-theme-text border-theme-border font-medium group-hover:border-theme-primary'
                  }`}
                >
                  {dynastyName}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 4. 底部浮动的地点详情探访卡片 (Tap / Click Drawer) */}
      {selectedPreviewLoc && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-24 w-[92%] max-w-md bg-theme-surface-card/95 backdrop-blur-xl border border-theme-border rounded-3xl p-5 shadow-2xl z-30 transition-all animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-theme-text font-poetry">
                  {selectedPreviewLoc.dynasty_names[dynasty] || selectedPreviewLoc.name_cn}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                  {selectedPreviewLoc.name_modern}
                </span>
              </div>
              <p className="text-xs text-theme-text-muted mt-1.5 leading-relaxed">
                {selectedPreviewLoc.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedPreviewLoc(null)}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
            >
              ×
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-theme-border/50 pt-3">
            <span className="text-[11px] text-theme-text-muted flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-theme-gold" />
              <span>可能激发全新诗作灵感</span>
            </span>

            <button
              onClick={() => {
                onTravel(selectedPreviewLoc.id);
                setSelectedPreviewLoc(null);
              }}
              className="px-5 py-2 rounded-full bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
            >
              <Footprints className="w-4 h-4" />
              <span>移步游历此地</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
