import React, { useState } from 'react';
import { ChronicleItem, ChronicleEventType } from '../../engine/world/chronicle';
import {
  Radio,
  Landmark,
  Compass,
  Scroll,
  X,
  ChevronRight,
  Sparkles,
  MapPin,
} from 'lucide-react';

interface WorldChronicleDrawerProps {
  currentYear: number;
  chronicles: ChronicleItem[];
  activeHighlight?: ChronicleItem;
  onFocusCity: (cityId: string) => void;
}

export const WorldChronicleDrawer: React.FC<WorldChronicleDrawerProps> = ({
  currentYear,
  chronicles,
  activeHighlight,
  onFocusCity,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<ChronicleEventType | 'all'>('all');

  const filteredList =
    filterType === 'all'
      ? chronicles
      : chronicles.filter((c) => c.type === filterType);

  const getTypeIcon = (type: ChronicleEventType) => {
    switch (type) {
      case 'world_event':
        return <Landmark className="w-3.5 h-3.5 text-red-600" />;
      case 'poet_movement':
        return <Compass className="w-3.5 h-3.5 text-emerald-700" />;
      case 'poem_creation':
        return <Scroll className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  const getTypeBadgeClass = (type: ChronicleEventType) => {
    switch (type) {
      case 'world_event':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'poet_movement':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'poem_creation':
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <>
      {/* 1. 顶部悬浮的最新纪事走马灯播报条 (Ticker Pill) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 max-w-xl w-[92%] sm:w-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between space-x-2 sm:space-x-3 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-emerald-700/30 shadow-lg text-slate-900 hover:border-emerald-600 hover:shadow-xl transition-all group active:scale-[0.98]"
        >
          <div className="flex items-center space-x-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
            </span>
            <div className="flex items-center space-x-1 text-xs font-bold text-emerald-900 font-poetry">
              <Radio className="w-3.5 h-3.5 text-emerald-700" />
              <span>山河风云播报</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300">
              {currentYear}年
            </span>
          </div>

          {/* 滚动/即时最新快讯预览 */}
          <div className="flex-1 text-xs text-left truncate text-slate-800 font-medium px-1">
            {activeHighlight ? (
              <span>
                【{activeHighlight.tag}】{activeHighlight.title}
              </span>
            ) : chronicles.length > 0 ? (
              <span>
                【{chronicles[0].tag}】{chronicles[0].title}
              </span>
            ) : (
              <span>四海清平，诗人正结庐苦读。</span>
            )}
          </div>

          <div className="flex items-center space-x-1 text-xs font-bold text-emerald-800 shrink-0 group-hover:translate-x-0.5 transition-transform">
            <span className="hidden sm:inline text-[11px]">查看全部({chronicles.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* 2. 侧边风云录抽屉 (展开查看完整的历史与文人行迹) */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-white/98 backdrop-blur-2xl border-l border-slate-300 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-slate-900">
          {/* 抽屉顶栏 */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50/50">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-emerald-800" />
              <div>
                <h3 className="font-bold text-sm font-poetry text-emerald-950">
                  山河风云录 · 世界播报台
                </h3>
                <p className="text-[10px] text-slate-600">
                  天下大势 · 文人行历 · 诗坛绝唱
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 分类过滤器 */}
          <div className="flex items-center space-x-1 p-2.5 border-b border-slate-200 bg-slate-50 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-emerald-800 text-white font-bold shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              全部 ({chronicles.length})
            </button>
            <button
              onClick={() => setFilterType('world_event')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                filterType === 'world_event'
                  ? 'bg-red-700 text-white font-bold shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              天下大势
            </button>
            <button
              onClick={() => setFilterType('poet_movement')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                filterType === 'poet_movement'
                  ? 'bg-emerald-700 text-white font-bold shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              文人行迹
            </button>
            <button
              onClick={() => setFilterType('poem_creation')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                filterType === 'poem_creation'
                  ? 'bg-amber-700 text-white font-bold shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              名篇诞生
            </button>
          </div>

          {/* 纪事条目列表 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar">
            {filteredList.map((item) => {
              const isCurrent = item.year === currentYear;
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border transition-all space-y-1.5 ${
                    isCurrent
                      ? 'bg-amber-50/80 border-amber-300 shadow-md ring-1 ring-amber-400'
                      : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      {getTypeIcon(item.type)}
                      <span className="font-bold text-xs text-slate-900 font-poetry">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full border font-medium ${getTypeBadgeClass(
                          item.type
                        )}`}
                      >
                        {item.tag}
                      </span>
                      <span className="text-[10px] font-mono text-slate-700 font-bold">
                        {item.year}年
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed font-sans">
                    {item.summary}
                  </p>

                  <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                    {item.poetName ? (
                      <span className="text-[11px] text-emerald-800 font-poetry font-semibold flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>涉事文人：{item.poetName}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">时局变幻</span>
                    )}

                    <button
                      onClick={() => {
                        onFocusCity(item.cityId);
                        setIsOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-[10px] flex items-center space-x-1 transition-all"
                    >
                      <MapPin className="w-3 h-3 text-emerald-800" />
                      <span>定位山河</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
