import React from 'react';
import { Flame, AlertTriangle, ArrowRight } from 'lucide-react';

interface CrisisModalProps {
  year: number;
  title: string;
  description: string;
  moodDeltaText: string;
  onConfirm: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  year,
  title,
  description,
  moodDeltaText,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-stone-900/95 border-2 border-red-500/60 rounded-3xl p-6 shadow-2xl text-stone-100 space-y-4">
        {/* 顶部危急红印 */}
        <div className="flex items-center justify-between pb-3 border-b border-red-500/30">
          <div className="flex items-center space-x-2 text-red-400">
            <Flame className="w-5 h-5 animate-bounce" />
            <span className="text-xs font-bold tracking-widest uppercase">
              时代洪流 · 历史剧变
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-900/80 text-red-200 border border-red-500/50 font-mono font-bold">
            公元 {year} 年
          </span>
        </div>

        {/* 标题与描述 */}
        <div className="space-y-2 text-center py-2">
          <h2 className="text-2xl font-bold font-poetry text-red-300 tracking-wider">
            {title}
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed text-left pt-2">
            {description}
          </p>
        </div>

        {/* 心境受时代剧变强制重构 */}
        <div className="p-3.5 bg-red-900/30 border border-red-500/30 rounded-2xl flex items-center space-x-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <div className="font-bold text-red-300">山河震荡 · 心境巨变</div>
            <div className="text-stone-300 text-[11px] mt-0.5">{moodDeltaText}</div>
          </div>
        </div>

        {/* 确认继续按钮 */}
        <button
          onClick={onConfirm}
          className="w-full py-3 rounded-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>亲历历史，共赴山河</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
