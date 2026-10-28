import React, { useState } from 'react';
import { ArtifactItem, ArtifactCategory } from '../../types/artifact';
import { ALL_ARTIFACTS } from '../../data/artifacts';
import { soundEngine } from '../../engine/audio/soundEngine';
import {
  Sparkles,
  Lock,
  CheckCircle2,
  X,
  BookOpen,
  Feather,
} from 'lucide-react';

interface ArtifactCabinetProps {
  unlockedArtifactIds: string[];
  currentPoetId: string;
}

type CategoryFilter = 'all' | ArtifactCategory;
type SourceFilter = 'all' | 'poet' | 'cities';

export const ArtifactCabinet: React.FC<ArtifactCabinetProps> = ({
  unlockedArtifactIds,
  currentPoetId,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [inspectingArtifact, setInspectingArtifact] = useState<ArtifactItem | null>(null);

  const allArtifacts = Object.values(ALL_ARTIFACTS);

  // 过滤
  const filteredArtifacts = allArtifacts.filter((item) => {
    // 类别筛选
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    // 来源筛选
    if (sourceFilter === 'poet') {
      if (!item.poetExclusiveId) return false;
    } else if (sourceFilter === 'cities') {
      if (item.poetExclusiveId) return false;
    }
    return true;
  });

  const totalCount = allArtifacts.length;
  const collectedCount = allArtifacts.filter((item) =>
    unlockedArtifactIds.includes(item.id)
  ).length;

  const handleInspect = (item: ArtifactItem) => {
    setInspectingArtifact(item);
    soundEngine.playJadeChime();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-theme-canvas text-theme-text">
      {/* 1. 顶部博古架概览与筛选栏 */}
      <div className="p-4 sm:p-5 border-b border-theme-border bg-theme-surface/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 text-xl shadow-xs">
            🎒
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold font-poetry text-base text-theme-text">
                山河风物架 · 雅器行囊
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary font-bold border border-theme-primary/20">
                收纳 {collectedCount} / {totalCount} 件
              </span>
            </div>
            <p className="text-xs text-theme-text-muted mt-0.5">
              文人佩剑、名城名产、商周碑拓与四海风物，皆可漫游探索纳归行囊
            </p>
          </div>
        </div>

        {/* 来源切换 */}
        <div className="flex items-center p-1 rounded-xl bg-theme-canvas border border-theme-border text-xs">
          <button
            onClick={() => setSourceFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              sourceFilter === 'all'
                ? 'bg-theme-surface-card text-theme-primary shadow-xs'
                : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            全部藏品
          </button>
          <button
            onClick={() => setSourceFilter('poet')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              sourceFilter === 'poet'
                ? 'bg-theme-surface-card text-theme-primary shadow-xs'
                : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            文人本命信物
          </button>
          <button
            onClick={() => setSourceFilter('cities')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              sourceFilter === 'cities'
                ? 'bg-theme-surface-card text-theme-primary shadow-xs'
                : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            十六都会风物
          </button>
        </div>
      </div>

      {/* 2. 类别过滤器 */}
      <div className="px-4 sm:px-5 py-2.5 border-b border-theme-border bg-theme-surface-card/40 flex items-center space-x-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
        <span className="text-theme-text-muted text-[11px] font-bold shrink-0">风物分类：</span>
        {[
          { key: 'all', label: '全部' },
          { key: 'weapon', label: '⚔️ 兵刃文玩' },
          { key: 'tea_wine', label: '🍶 佳酿香茗' },
          { key: 'stationery', label: '📜 笔墨碑拓' },
          { key: 'relic', label: '🏺 传家古物' },
          { key: 'food', label: '🍲 珍馐食单' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCategoryFilter(tab.key as CategoryFilter)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all font-poetry text-xs ${
              categoryFilter === tab.key
                ? 'bg-theme-primary text-white shadow-xs font-bold'
                : 'bg-theme-surface border border-theme-border text-theme-text-muted hover:text-theme-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. 博古架网格展陈 */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredArtifacts.map((item) => {
            const isUnlocked = unlockedArtifactIds.includes(item.id);
            const isPoetExclusive = !!item.poetExclusiveId;
            const isCurrentPoetMatch = item.poetExclusiveId === currentPoetId;

            return (
              <div
                key={item.id}
                onClick={() => handleInspect(item)}
                className={`relative group rounded-2xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between select-none ${
                  isUnlocked
                    ? item.rarity === 'legendary'
                      ? 'bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/40 hover:border-amber-500/80 hover:shadow-lg shadow-amber-500/5'
                      : item.rarity === 'epic'
                      ? 'bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/40 hover:border-purple-500/80 hover:shadow-lg shadow-purple-500/5'
                      : 'bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/40 hover:border-emerald-500/80 hover:shadow-lg shadow-emerald-500/5'
                    : 'bg-theme-surface-card/40 border-dashed border-theme-border/70 hover:border-theme-border hover:bg-theme-surface-card/60 opacity-75'
                }`}
              >
                {/* 稀有度与状态徽标 */}
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold font-poetry ${
                        item.rarity === 'legendary'
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                          : item.rarity === 'epic'
                          ? 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.rarity === 'legendary' ? '绝品' : item.rarity === 'epic' ? '珍品' : '雅物'}
                    </span>
                    {isCurrentPoetMatch && (
                      <span className="text-[9px] px-1 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold font-poetry border border-amber-500/30">
                        本命
                      </span>
                    )}
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center space-x-1 text-[10px] text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">已纳</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-0.5 text-[10px] text-theme-text-muted">
                      <Lock className="w-3 h-3" />
                      <span className="hidden sm:inline">待寻</span>
                    </span>
                  )}
                </div>

                {/* 器物图腾与主视觉 */}
                <div className="py-2 sm:py-3 flex flex-col items-center justify-center">
                  <div
                    className={`text-3xl sm:text-4xl p-2.5 rounded-2xl transition-transform group-hover:scale-110 ${
                      isUnlocked
                        ? 'bg-theme-surface-card shadow-sm border border-theme-border'
                        : 'grayscale opacity-50 bg-theme-surface-card/30'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <h4
                    className={`font-bold font-poetry text-xs sm:text-sm mt-2 text-center line-clamp-1 ${
                      isUnlocked ? 'text-theme-text' : 'text-theme-text-muted'
                    }`}
                  >
                    {item.name}
                  </h4>
                </div>

                {/* 底部产地/归属 */}
                <div className="mt-1 pt-2 border-t border-theme-border/60 flex items-center justify-between text-[10px] text-theme-text-muted">
                  <span className="truncate">
                    {item.originCityName ? `📍 ${item.originCityName}` : isPoetExclusive ? '⭐ 本命信物' : '华夏名都'}
                  </span>
                  <span className="shrink-0 text-theme-primary/80 font-poetry">
                    {item.categoryName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 风物详察悬浮弹窗 (Artifact Inspector Modal) */}
      {inspectingArtifact && (
        <div className="fixed inset-0 z-[2600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-theme-canvas border-2 border-theme-border rounded-3xl shadow-2xl overflow-hidden text-theme-text p-6 space-y-4">
            {/* 关闭按钮 */}
            <button
              onClick={() => setInspectingArtifact(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-theme-surface-card hover:bg-theme-surface border border-theme-border flex items-center justify-center text-theme-text-muted hover:text-theme-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 顶栏图标与品级 */}
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-md border ${
                  inspectingArtifact.rarity === 'legendary'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-600'
                    : inspectingArtifact.rarity === 'epic'
                    ? 'bg-purple-500/10 border-purple-500/40 text-purple-600'
                    : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600'
                }`}
              >
                {inspectingArtifact.icon}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold font-poetry text-theme-text">
                    {inspectingArtifact.name}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-poetry ${
                      inspectingArtifact.rarity === 'legendary'
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                        : inspectingArtifact.rarity === 'epic'
                        ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40'
                        : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {inspectingArtifact.rarity === 'legendary'
                      ? '绝品传世'
                      : inspectingArtifact.rarity === 'epic'
                      ? '珍品遗物'
                      : '雅物拾遗'}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-theme-text-muted">
                  <span>分类：{inspectingArtifact.categoryName}</span>
                  <span>•</span>
                  <span>
                    产地：
                    {inspectingArtifact.originCityName || '华夏山河'}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-emerald-600">
                    {unlockedArtifactIds.includes(inspectingArtifact.id)
                      ? '✓ 已纳归行囊'
                      : '🔒 暂未收纳'}
                  </span>
                </div>
              </div>
            </div>

            {/* 诗词题咏名句 */}
            <div className="p-3.5 rounded-2xl bg-theme-surface-card border border-theme-border font-poetry text-xs text-theme-primary font-medium leading-relaxed italic">
              “{inspectingArtifact.quote}”
            </div>

            {/* 器物文化与意蕴描述 */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-theme-text font-poetry flex items-center space-x-1.5">
                <Feather className="w-3.5 h-3.5 text-theme-primary" />
                <span>【风物叙事与意蕴】</span>
              </h4>
              <p className="text-theme-text-muted leading-relaxed leading-6 indent-5">
                {inspectingArtifact.description}
              </p>
            </div>

            {/* 史料考证出处 */}
            <div className="p-3.5 rounded-2xl bg-theme-surface/70 border border-theme-border text-xs space-y-1 font-poetry">
              <h5 className="font-bold text-theme-gold flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-theme-gold" />
                <span>❖ 典籍与史料考证出处：</span>
              </h5>
              <p className="text-theme-text-muted leading-relaxed pl-4">
                {inspectingArtifact.historicalProvenance}
              </p>
            </div>

            {/* 获取方式与心境加成 */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-theme-border text-xs">
              <div className="text-[11px] text-theme-text-muted">
                <span className="font-bold">收纳途径：</span>
                <span>{inspectingArtifact.obtainMethod}</span>
              </div>

              {inspectingArtifact.moodBonus && (
                <div className="flex items-center space-x-1.5 text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    心境通感加成：
                    {Object.entries(inspectingArtifact.moodBonus)
                      .map(([_k, v]) => `+${v}`)
                      .join(' ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
