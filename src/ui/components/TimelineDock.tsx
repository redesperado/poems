import React from 'react';
import { GameEvent } from '../../types/event';
import { Sparkles, Calendar, AlertTriangle, GitFork } from 'lucide-react';

interface TimelineDockProps {
  events: GameEvent[];
  currentYear: number;
  unlockedPoemIds: string[];
  onSelectEvent: (event: GameEvent) => void;
}

export const TimelineDock: React.FC<TimelineDockProps> = ({
  events,
  currentYear,
  unlockedPoemIds,
  onSelectEvent,
}) => {
  return (
    <div className="w-full h-20 bg-theme-surface/90 backdrop-blur-md border-t border-theme-border relative z-20 flex items-center px-4 overflow-x-auto no-scrollbar shadow-lg">
      <div className="flex items-center space-x-12 min-w-max mx-auto px-6">
        {events.map((event) => {
          const isPastOrCurrent = event.year <= currentYear;
          const hasPoem = !!event.triggers_poem_id;
          const hasChoice = !!event.triggers_choice_id;
          const isPoemUnlocked =
            hasPoem && unlockedPoemIds.includes(event.triggers_poem_id!);

          return (
            <button
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="group flex flex-col items-center relative transition-transform active:scale-95 cursor-pointer"
            >
              {/* 年份标记 */}
              <span
                className={`text-[10px] font-mono mb-1 transition-colors ${
                  isPastOrCurrent
                    ? 'text-theme-primary font-bold'
                    : 'text-slate-600 font-medium'
                }`}
              >
                {event.year}年
              </span>

              {/* 节点形状：诗词为星芒，岔路为菱形/分叉，危机为三角，普通为圆印 */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  hasPoem
                    ? isPoemUnlocked
                      ? 'bg-theme-gold text-white shadow-gold-glow ring-2 ring-white scale-110'
                      : 'border-2 border-theme-gold text-theme-gold bg-amber-50'
                    : hasChoice
                    ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-200'
                    : event.type === 'crisis_response'
                    ? 'bg-red-600 text-white shadow-md animate-pulse'
                    : isPastOrCurrent
                    ? 'bg-theme-primary text-white shadow-sm'
                    : 'border border-slate-400 text-slate-600 bg-white'
                }`}
              >
                {hasPoem ? (
                  <Sparkles className="w-3.5 h-3.5" />
                ) : hasChoice ? (
                  <GitFork className="w-3.5 h-3.5" />
                ) : event.type === 'crisis_response' ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <Calendar className="w-3 h-3" />
                )}
              </div>

              {/* 事件标题微标 */}
              <span
                className={`mt-1 text-[11px] font-poetry whitespace-nowrap transition-colors ${
                  isPastOrCurrent
                    ? 'text-theme-text font-bold group-hover:text-theme-primary'
                    : 'text-slate-600 font-medium'
                }`}
              >
                {event.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
