import React from 'react';
import { Flame, AlertTriangle, ArrowRight, ShieldAlert, BookOpen, UserMinus } from 'lucide-react';

export interface CrisisModalProps {
  year: number;
  title: string;
  historicalEventName?: string;
  historicalBackground?: string;
  poetImpact?: string;
  description: string;
  moodDeltaText?: string;
  onConfirm: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  year,
  title,
  historicalEventName,
  historicalBackground,
  poetImpact,
  description,
  moodDeltaText,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-stone-900/95 border-2 border-amber-600/60 rounded-3xl p-5 sm:p-7 shadow-2xl text-stone-100 flex flex-col space-y-4 overflow-hidden">
        {/* 背景战火与山河微光纹理 */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/40 via-transparent to-stone-950/80 pointer-events-none" />

        {/* 顶部大事节点烽火印记 */}
        <div className="relative flex items-center justify-between pb-3 border-b border-red-500/30 shrink-0">
          <div className="flex items-center space-x-2 text-amber-400">
            <Flame className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold tracking-widest font-poetry text-amber-300">
              朝代大事变 · 时代洪流
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs px-3 py-1 rounded-full bg-red-950/80 text-amber-200 border border-red-500/50 font-mono font-bold">
              公元 {year} 年
            </span>
          </div>
        </div>

        {/* 大事件主标题 */}
        <div className="relative text-center py-1 shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold font-poetry text-amber-200 tracking-wider flex items-center justify-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span>{historicalEventName || title}</span>
          </h2>
          <p className="text-xs text-stone-300 mt-1 font-medium">
            {description}
          </p>
        </div>

        {/* 中间核心内容可滚动区 */}
        <div className="relative flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 text-xs sm:text-[13px] leading-relaxed">
          {/* 板块 1: 朝代大事件历史全貌 */}
          {historicalBackground && (
            <div className="p-4 rounded-2xl bg-stone-800/80 border border-red-500/30 space-y-2">
              <div className="flex items-center space-x-2 text-red-400 font-bold font-poetry text-sm border-b border-red-500/20 pb-1.5">
                <BookOpen className="w-4 h-4 text-red-400" />
                <span>【朝代大事始末 · 山河剧变】</span>
              </div>
              <p className="text-stone-300 leading-relaxed indent-4">
                {historicalBackground}
              </p>
            </div>
          )}

          {/* 板块 2: 对诗人的深远影响与命运转折 */}
          {poetImpact && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 space-y-2">
              <div className="flex items-center space-x-2 text-amber-300 font-bold font-poetry text-sm border-b border-amber-600/30 pb-1.5">
                <UserMinus className="w-4 h-4 text-amber-400" />
                <span>【对诗人之深远影响 · 命运转折】</span>
              </div>
              <div className="text-stone-200 space-y-2.5">
                {poetImpact.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* 板块 3: 心境受时代剧变强制重构 */}
          {moodDeltaText && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center space-x-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
              <div>
                <span className="font-bold text-red-300">山河震荡 · 心境巨变：</span>
                <span className="text-amber-200 ml-1 font-mono font-medium">{moodDeltaText}</span>
              </div>
            </div>
          )}
        </div>

        {/* 底部确认按钮 */}
        <div className="relative pt-2 shrink-0">
          <button
            onClick={onConfirm}
            className="w-full py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-red-700 via-amber-600 to-red-800 hover:from-red-600 hover:to-amber-500 text-amber-50 text-xs sm:text-sm font-bold shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer border border-amber-400/40"
          >
            <span>亲历时代风云 · 共赴沧海桑田</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
