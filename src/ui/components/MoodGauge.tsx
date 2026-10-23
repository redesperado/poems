import React from 'react';
import { MoodState, MOOD_META, MoodDimension } from '../../types/mood';
import { Flame, CloudRain, Wind, Zap, Moon } from 'lucide-react';

interface MoodGaugeProps {
  mood: MoodState;
}

const ICONS: Record<MoodDimension, React.ReactNode> = {
  passion: <Flame className="w-3.5 h-3.5 text-amber-500" />,
  sorrow: <CloudRain className="w-3.5 h-3.5 text-sky-500" />,
  freedom: <Wind className="w-3.5 h-3.5 text-emerald-500" />,
  anger: <Zap className="w-3.5 h-3.5 text-red-500" />,
  homesickness: <Moon className="w-3.5 h-3.5 text-purple-500" />,
};

export const MoodGauge: React.FC<MoodGaugeProps> = ({ mood }) => {
  const dimensions: MoodDimension[] = [
    'passion',
    'sorrow',
    'freedom',
    'anger',
    'homesickness',
  ];

  return (
    <div className="bg-theme-surface/80 backdrop-blur-md border border-theme-border rounded-2xl p-3 shadow-card-soft space-y-2.5 max-w-[200px] transition-all">
      <div className="flex items-center justify-between border-b border-theme-border/60 pb-1.5">
        <span className="text-xs font-bold text-theme-text font-poetry">
          心境气韵
        </span>
        <span className="text-[10px] text-theme-text-muted">五维律动</span>
      </div>

      <div className="space-y-2">
        {dimensions.map((dim) => {
          const val = Math.round(mood[dim] || 50);
          const meta = MOOD_META[dim];

          return (
            <div key={dim} className="space-y-1 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5">
                  {ICONS[dim]}
                  <span className="text-[11px] font-medium text-theme-text">
                    {meta.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-theme-text-muted">
                  {val}
                </span>
              </div>

              {/* 细致流线微光进度条 */}
              <div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${val}%`,
                    backgroundColor: meta.color,
                    boxShadow: `0 0 8px ${meta.color}80`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
