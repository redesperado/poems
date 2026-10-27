import React, { useRef, useEffect, useState } from 'react';
import { GameEvent } from '../../types/event';
import { Sparkles, Calendar, GitFork, Lock, Check, Flame, Crown } from 'lucide-react';

interface TimelineDockProps {
  events: GameEvent[];
  currentYear: number;
  completedEventIds: string[];
  unlockedPoemIds: string[];
  onSelectEvent: (event: GameEvent, isCurrent: boolean, isCompleted: boolean) => void;
}

export const TimelineDock: React.FC<TimelineDockProps> = ({
  events,
  currentYear: _currentYear,
  completedEventIds,
  unlockedPoemIds,
  onSelectEvent,
}) => {
  const activeNodeRef = useRef<HTMLDivElement>(null);
  const [lockedToast, setLockedToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  // 计算当前应该进行到的事件索引（不可跳过原则）
  const currentIndex = events.findIndex((e) => !completedEventIds.includes(e.id));
  const activeEventIndex = currentIndex === -1 ? events.length - 1 : currentIndex;
  const currentEvent = events[activeEventIndex] || null;

  // 自动平滑滚动聚焦到当前进行中的人生节点
  useEffect(() => {
    if (activeNodeRef.current) {
      activeNodeRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeEventIndex]);

  // 处理节点点击
  const handleNodeClick = (event: GameEvent, index: number) => {
    const isCompleted = completedEventIds.includes(event.id);
    const isCurrent = index === activeEventIndex;
    const isLocked = !isCompleted && !isCurrent;

    if (isLocked) {
      // 严禁跳过：提示用户先亲历当前历程
      const currentTitle = currentEvent ? currentEvent.title : '当下年岁';
      setLockedToast({
        visible: true,
        message: `岁月不可轻越：请先亲历当前历程【${currentTitle}】`,
      });
      setTimeout(() => {
        setLockedToast((prev) => ({ ...prev, visible: false }));
      }, 2500);
      return;
    }

    onSelectEvent(event, isCurrent, isCompleted);
  };

  const completedCount = events.filter((e) => completedEventIds.includes(e.id)).length;

  return (
    <div className="w-full bg-theme-surface/95 backdrop-blur-md border-t border-theme-border relative z-20 flex flex-col shadow-lg select-none">
      {/* 顶部微型状态条：进度统计与图例 */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-1.5 border-b border-theme-border/40 text-[10px] text-theme-text-muted">
        <div className="flex items-center space-x-2">
          <span className="font-bold font-poetry text-theme-text">人生长卷</span>
          <span className="px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary font-mono font-bold">
            历程 {completedCount} / {events.length}
          </span>
        </div>

        {/* 状态图例 */}
        <div className="flex items-center space-x-3 text-[10px]">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>已经历</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-300 animate-pulse inline-block" />
            <span className="text-amber-600 dark:text-amber-400 font-bold">当下节点</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-400">
            <Lock className="w-2.5 h-2.5 inline" />
            <span>未至（不可跳过）</span>
          </span>
        </div>
      </div>

      {/* 滚动时间轴本体 */}
      <div className="w-full h-20 sm:h-22 relative flex items-center px-4 overflow-x-auto no-scrollbar scroll-smooth">
        {/* 锁定提示 Toast 气泡 */}
        {lockedToast.visible && (
          <div className="absolute left-1/2 -top-10 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-stone-900/90 text-amber-300 text-xs font-bold border border-amber-500/50 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 flex items-center space-x-1.5 pointer-events-none whitespace-nowrap">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{lockedToast.message}</span>
          </div>
        )}

        {/* 节点序列 */}
        <div className="flex items-center space-x-10 sm:space-x-14 min-w-max mx-auto px-8 relative py-2">
          {events.map((event, index) => {
            const isCompleted = completedEventIds.includes(event.id);
            const isCurrent = index === activeEventIndex;
            const isLocked = !isCompleted && !isCurrent;

            const hasPoem = !!event.triggers_poem_id;
            const hasChoice = !!event.triggers_choice_id;
            const isCrisis = event.type === 'crisis_response' || !!event.triggers_crisis;
            const isPassing = event.type === 'passing' || !!event.triggers_retrospective;
            const isPoemUnlocked = hasPoem && unlockedPoemIds.includes(event.triggers_poem_id!);

            return (
              <div
                key={event.id}
                ref={isCurrent ? activeNodeRef : null}
                className="relative flex flex-col items-center"
              >
                {/* 当前节点专属指示徽章 */}
                {isCurrent && (
                  <div className="absolute -top-5.5 z-10 animate-bounce">
                    <span className={`px-1.5 py-0.5 rounded-full text-white text-[9px] font-bold shadow-md tracking-wider whitespace-nowrap ${
                      isPassing
                        ? 'bg-gradient-to-r from-amber-500 via-purple-600 to-amber-500'
                        : isCrisis
                        ? 'bg-gradient-to-r from-red-600 to-amber-600'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600'
                    }`}>
                      {isPassing ? '终章 · 骑鲸捉月' : '当下历程'}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => handleNodeClick(event, index)}
                  className={`group flex flex-col items-center transition-all ${
                    isLocked
                      ? 'opacity-40 grayscale cursor-not-allowed hover:opacity-50'
                      : 'cursor-pointer active:scale-95'
                  }`}
                  title={
                    isLocked
                      ? `不可跳过：请先亲历当前历程【${currentEvent?.title || ''}】`
                      : isCompleted
                      ? `已经历：点击回溯【${event.title}】`
                      : `当下历程：点击亲历【${event.title}】`
                  }
                >
                  {/* 年份标记 */}
                  <span
                    className={`text-[10px] font-mono mb-1 transition-colors ${
                      isCurrent
                        ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
                        : isCompleted
                        ? 'text-theme-primary font-bold'
                        : 'text-slate-400 font-medium'
                    }`}
                  >
                    {event.year}年
                  </span>

                  {/* 节点形状 */}
                  <div
                    className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                      isLocked
                        ? 'border border-dashed border-slate-400 text-slate-400 bg-slate-100/60 dark:bg-slate-800/60'
                        : isCurrent
                        ? isPassing
                          ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white ring-4 ring-amber-300/80 shadow-lg scale-110 animate-pulse'
                          : isCrisis
                          ? 'bg-red-600 text-white ring-4 ring-red-400/70 shadow-lg scale-110 animate-pulse'
                          : 'bg-amber-500 text-white ring-4 ring-amber-300/70 shadow-lg scale-110 animate-pulse'
                        : isCompleted
                        ? isPassing
                          ? 'bg-purple-900 text-amber-200 ring-2 ring-amber-400/50 shadow-md'
                          : isCrisis
                          ? 'bg-red-800 text-red-100 ring-2 ring-red-400/40'
                          : hasPoem && isPoemUnlocked
                          ? 'bg-theme-gold text-white shadow-gold-glow ring-2 ring-amber-300'
                          : 'bg-emerald-600 text-white ring-2 ring-emerald-300/50 shadow-sm'
                        : 'border border-slate-400 text-slate-600 bg-white'
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-3 h-3 text-slate-500" />
                    ) : isCompleted ? (
                      isPassing ? (
                        <Crown className="w-3.5 h-3.5 text-amber-300" />
                      ) : hasPoem ? (
                        <Sparkles className="w-3.5 h-3.5" />
                      ) : isCrisis ? (
                        <Flame className="w-3.5 h-3.5 text-red-200" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                      )
                    ) : isPassing ? (
                      <Crown className="w-4 h-4 text-amber-200 animate-bounce" />
                    ) : isCrisis ? (
                      <Flame className="w-4 h-4 text-amber-200 animate-bounce" />
                    ) : hasPoem ? (
                      <Sparkles className="w-4 h-4 text-white" />
                    ) : hasChoice ? (
                      <GitFork className="w-4 h-4 text-white" />
                    ) : (
                      <Calendar className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>

                  {/* 事件标题微标 */}
                  <span
                    className={`mt-1 text-[11px] font-poetry whitespace-nowrap transition-colors max-w-[80px] truncate ${
                      isCurrent
                        ? 'text-amber-700 dark:text-amber-300 font-bold scale-105'
                        : isCompleted
                        ? 'text-theme-text font-medium group-hover:text-theme-primary'
                        : 'text-slate-400 font-normal'
                    }`}
                  >
                    {event.title}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
