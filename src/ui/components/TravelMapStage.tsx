import React, { useState } from 'react';
import { LocationData } from '../../types/location';
import { LOCATIONS } from '../../data/locations';
import { MapPin, Sparkles, Footprints } from 'lucide-react';

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
    <div className="relative w-full h-full flex-1 overflow-hidden select-none">
      {/* 现代微水墨背景山水渐变 */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* 长江流线 (长江干流意象) */}
          <path
            d="M 250,550 Q 400,600 550,580 T 750,500"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="opacity-40"
          />
          {/* 黄河微弧 (黄河意象) */}
          <path
            d="M 380,380 Q 500,420 540,460 T 680,440"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            className="opacity-30"
          />
        </svg>
      </div>

      {/* 地点连接路线 (SVG Vector Layer) */}
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
                stroke="var(--color-border-highlight)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-50"
              />
            );
          })
        )}
      </svg>

      {/* 各历史城市与名胜地点印记 */}
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
                <div className="absolute -inset-3 rounded-full bg-theme-primary/20 animate-ping pointer-events-none" />
              )}

              {/* 地点按钮 */}
              <button
                onClick={() => {
                  if (isCurrent) return;
                  setSelectedPreviewLoc(loc);
                }}
                className={`group relative flex flex-col items-center transition-all duration-300 ${
                  isCurrent
                    ? 'scale-110 z-20'
                    : isConnected
                    ? 'hover:scale-105 cursor-pointer opacity-95'
                    : 'opacity-65 hover:opacity-90'
                }`}
              >
                {/* 地点印章图标 */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-theme-primary text-white shadow-jade-glow ring-2 ring-white'
                      : isConnected
                      ? 'bg-theme-surface-card border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white'
                      : 'bg-theme-surface border border-gray-300 text-gray-500'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>

                {/* 城市朝代地名标签 */}
                <span
                  className={`mt-1 text-xs px-2 py-0.5 rounded-full font-poetry whitespace-nowrap shadow-sm border transition-all ${
                    isCurrent
                      ? 'bg-theme-primary text-white border-transparent font-bold'
                      : 'bg-theme-surface-card/90 text-theme-text border-theme-border font-medium group-hover:border-theme-primary'
                  }`}
                >
                  {dynastyName}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 底部浮动的地点详情探访卡片 (Tap / Click Drawer) */}
      {selectedPreviewLoc && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-24 w-[90%] max-w-md bg-theme-surface-card/95 backdrop-blur-lg border border-theme-border rounded-2xl p-4 shadow-2xl z-30 transition-all animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-theme-text font-poetry">
                  {selectedPreviewLoc.dynasty_names[dynasty] || selectedPreviewLoc.name_cn}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                  {selectedPreviewLoc.name_modern}
                </span>
              </div>
              <p className="text-xs text-theme-text-muted mt-1 leading-relaxed">
                {selectedPreviewLoc.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedPreviewLoc(null)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none p-1"
            >
              ×
            </button>
          </div>

          <div className="mt-3.5 flex items-center justify-between border-t border-theme-border/50 pt-2.5">
            <span className="text-[11px] text-theme-text-muted flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-theme-gold" />
              <span>可能激发全新诗作灵感</span>
            </span>

            <button
              onClick={() => {
                onTravel(selectedPreviewLoc.id);
                setSelectedPreviewLoc(null);
              }}
              className="px-4 py-1.5 rounded-full bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>移步游历</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
