import React from 'react';
import { GameEvent } from '../../types/event';
import { LI_BAI_EVENTS } from '../../data/poets/li_bai/events';
import { Sparkles, Calendar, AlertTriangle } from 'lucide-react';

interface TimelineDockProps {
  currentYear: number;
  unlockedPoemIds: string[];
  onSelectEvent: (event: GameEvent) => void;
}

export const TimelineDock: React.FC<TimelineDockProps> = ({
  currentYear,
  unlockedPoemIds,
  onSelectEvent,
}) => {
  return (
    <div className="w-full h-20 bg-theme-surface/90 backdrop-blur-md border-t border-theme-border relative z-20 flex items-center px-4 overflow-x-auto no-scrollbar shadow-lg">
      <div className="flex items-center space-x-12 min-w-max mx-auto px-6">
        {LI_BAI_EVENTS.map((event) => {
          const isPastOrCurrent = event.year <= currentYear;
          const hasPoem = !!event.triggers_poem_id;
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
                    : 'text-gray-400'
                }`}
              >
                {event.year}年
              </span>

              {/* 节点形状：诗词为星芒，事件为圆印，危机为三角 */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  hasPoem
                    ? isPoemUnlocked
                      ? 'bg-theme-gold text-white shadow-gold-glow ring-2 ring-white scale-110'
                      : 'border-2 border-theme-gold text-theme-gold bg-amber-50'
                    : isPastOrCurrent
                    ? 'bg-theme-primary text-white shadow-sm'
                    : 'border border-gray-300 text-gray-400 bg-white'
                }`}
              >
                {hasPoem ? (
                  <Sparkles className="w-3.5 h-3.5" />
                ) : event.type === 'crisis_response' ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <Calendar className="w-3 h-3" />
                )}
              </div>

              {/* 事件标题微标 */}
              <span
                className={`mt-1 text-[11px] font-poetry whitespace-nowrap transition-colors ${
                  isPastOrCurrent
                    ? 'text-theme-text font-medium group-hover:text-theme-primary'
                    : 'text-gray-400'
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
