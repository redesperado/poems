import React from 'react';
import { PoetData } from '../../types/poet';
import { POET_PACKS } from '../../data/poets';
import { Compass, Check, X, BookOpen, Crown } from 'lucide-react';

interface PoetSwitchModalProps {
  currentPoetId: string;
  availablePoets: PoetData[];
  onSelectPoet: (poetId: string) => void;
  onClose: () => void;
}

export const PoetSwitchModal: React.FC<PoetSwitchModalProps> = ({
  currentPoetId,
  availablePoets,
  onSelectPoet,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-theme-surface-card border-2 border-theme-border rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col space-y-4 overflow-hidden">
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between pb-3 border-b border-theme-border/60 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-theme-primary/15 text-theme-primary flex items-center justify-center border border-theme-primary/30 shadow-xs">
              <Crown className="w-5 h-5 text-theme-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-theme-text font-poetry flex items-center gap-2">
                <span>历代千古文宗 · 诗词长卷</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  盛唐两宋 · 双峰并峙
                </span>
              </h2>
              <p className="text-xs text-theme-text-muted mt-0.5">
                选择一位文豪入画，亲历其跌宕起伏的一生、感悟传世名篇与历史岔路
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-theme-text-muted hover:text-theme-text hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 四位文人卡片网格 */}
        <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4 py-1">
          {availablePoets.map((poet) => {
            const isCurrent = poet.id === currentPoetId;
            const pack = POET_PACKS[poet.id];
            const poemCount = pack?.poems.length || 0;
            const eventCount = pack?.events.length || 0;

            const styleMap: Record<string, string> = {
              romantic: '浪漫奇逸',
              heroic: '豪迈狂放',
              free: '洒脱不羁',
              transcendent: '仙风道骨',
              realistic: '现实深沉',
              sorrowful: '沉郁顿挫',
              patriotic: '忧国忧民',
              profound: '波澜老成',
              zen: '旷达超然',
              optimistic: '随遇而安',
              graceful: '婉约凄婉',
              witty: '灵动天真',
            };

            return (
              <div
                key={poet.id}
                onClick={() => {
                  if (!isCurrent) {
                    onSelectPoet(poet.id);
                    onClose();
                  }
                }}
                className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isCurrent
                    ? 'bg-theme-surface/90 border-theme-primary shadow-jade-glow ring-2 ring-theme-primary/30'
                    : 'bg-theme-canvas/60 hover:bg-theme-surface border-theme-border hover:border-theme-border-highlight hover:-translate-y-0.5 shadow-sm hover:shadow-md'
                }`}
              >
                {/* 顶栏：头像、姓名、称号与朝代徽标 */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    {/* 海棠形头像底座 */}
                    <div className="relative">
                      <div className="w-13 h-13 bg-gradient-to-br from-spring-emerald via-spring-celadon to-spring-gold p-[2px] shape-begonia flex items-center justify-center shadow-md">
                        <div className="w-full h-full bg-theme-surface-card shape-begonia flex items-center justify-center text-theme-primary font-bold text-lg font-poetry">
                          {poet.name_cn.slice(-2)}
                        </div>
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-serif shadow pointer-events-none">
                        {poet.title}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg text-theme-text font-poetry">
                          {poet.name_cn}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-poetry border ${
                            poet.dynasty === 'tang'
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                              : 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30'
                          }`}
                        >
                          {poet.dynasty === 'tang' ? '大唐' : '两宋'}
                        </span>
                      </div>
                      <div className="text-[11px] text-theme-text-muted mt-0.5 font-mono">
                        公元 {poet.born} — {poet.died} 年（享年 {poet.died - poet.born + 1} 载）
                      </div>
                    </div>
                  </div>

                  {/* 状态指示徽章 */}
                  {isCurrent ? (
                    <span className="px-2.5 py-1 rounded-full bg-theme-primary text-white text-[10px] font-bold shadow-xs flex items-center space-x-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>正在游历中</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-theme-surface-card border border-theme-border text-theme-text-muted text-[10px] font-medium group-hover:text-theme-primary">
                      开启此卷 ➔
                    </span>
                  )}
                </div>

                {/* 生平简介 */}
                <p className="text-xs text-theme-text-muted leading-relaxed line-clamp-2">
                  {poet.bio_short}
                </p>

                {/* 风格标签 */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {poet.style.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-theme-primary/8 text-theme-primary border border-theme-primary/20 font-poetry"
                    >
                      {styleMap[s] || s}
                    </span>
                  ))}
                </div>

                {/* 底部数据概况与进入按键 */}
                <div className="pt-2.5 border-t border-theme-border/40 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 text-[11px] text-theme-text-muted font-poetry">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3 text-amber-500" />
                      <span>收录名篇: {poemCount} 首</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Compass className="w-3 h-3 text-teal-500" />
                      <span>生平里程碑: {eventCount} 处</span>
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold font-poetry px-3 py-1 rounded-full ${
                      isCurrent
                        ? 'text-theme-primary'
                        : 'bg-theme-primary text-white shadow-xs'
                    }`}
                  >
                    {isCurrent ? '当前主角' : '切换化身'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="pt-2 border-t border-theme-border/50 flex items-center justify-between text-xs text-theme-text-muted">
          <span>提示：切换文人将自动载入其所属朝代舆图、生平轨迹、专属作品与历史事件存档</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-theme-surface-card border border-theme-border hover:bg-black/5 dark:hover:bg-white/5 font-poetry text-xs font-bold text-theme-text cursor-pointer"
          >
            关闭长卷
          </button>
        </div>
      </div>
    </div>
  );
};
