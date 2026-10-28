import React, { useState } from 'react';
import { PoemData } from '../../types/poem';
import { PoetData } from '../../types/poet';
import { HISTORICAL_ENCOUNTERS } from '../../data/encounters';
import { ArtifactCabinet } from './ArtifactCabinet';
import { ALL_ARTIFACTS } from '../../data/artifacts';
import {
  X,
  BookOpen,
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  Feather,
  Quote,
  MapPin,
  Calendar,
  Compass,
  ScrollText,
  Crown,
} from 'lucide-react';

interface CollectionModalProps {
  poet: PoetData;
  poems: PoemData[];
  unlockedPoemIds: string[];
  poemScores: Record<string, number>;
  onClose: () => void;
  onSelectPoemForPlay?: (poem: PoemData) => void;
  unlockedBondIds?: string[];
  onOpenEncounter?: (encounterId: string) => void;
  unlockedArtifactIds?: string[];
  initialView?: 'poems' | 'artifacts';
  onExportPassport?: () => void;
}

type CatalogFilter = 'all' | 'unlocked' | 'locked';
type DetailTab = 'all' | 'text' | 'keywords' | 'appreciation' | 'journal';

export const CollectionModal: React.FC<CollectionModalProps> = ({
  poet,
  poems,
  unlockedPoemIds,
  poemScores,
  onClose,
  onSelectPoemForPlay,
  unlockedBondIds = [],
  onOpenEncounter,
  unlockedArtifactIds = [],
  initialView = 'poems',
  onExportPassport,
}) => {
  // 主展厅视图：传世诗卷 vs 山河风物匣
  const [mainView, setMainView] = useState<'poems' | 'artifacts'>(initialView);

  const allArtifacts = Object.values(ALL_ARTIFACTS);
  const collectedArtifactCount = allArtifacts.filter((a) =>
    unlockedArtifactIds.includes(a.id)
  ).length;

  // 选中的诗词，默认优先选中第一个已解锁的诗词
  const [selectedPoemId, setSelectedPoemId] = useState<string>(
    poems.find((p) => unlockedPoemIds.includes(p.id))?.id || poems[0]?.id || ''
  );

  // 千古羁绊印章
  const unlockedEncounters = Object.values(HISTORICAL_ENCOUNTERS).filter((enc) =>
    unlockedBondIds.includes(enc.bondSeal.id)
  );

  // 左侧藏目筛选
  const [catalogFilter, setCatalogFilter] = useState<CatalogFilter>('all');

  // 右侧研读模块筛选
  const [detailTab, setDetailTab] = useState<DetailTab>('all');

  const selectedPoem = poems.find((p) => p.id === selectedPoemId) || poems[0];
  const isSelectedUnlocked = selectedPoem ? unlockedPoemIds.includes(selectedPoem.id) : false;
  const selectedScore = selectedPoem ? poemScores[selectedPoem.id] || 100 : 100;

  // 过滤左侧列表
  const filteredPoems = poems.filter((p) => {
    const isUnlocked = unlockedPoemIds.includes(p.id);
    if (catalogFilter === 'unlocked') return isUnlocked;
    if (catalogFilter === 'locked') return !isUnlocked;
    return true;
  });

  const completionPercentage = Math.round((unlockedPoemIds.length / poems.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-theme-canvas border-2 border-theme-border rounded-3xl shadow-2xl flex flex-col h-[90dvh] max-h-[820px] overflow-hidden text-theme-text">
        {/* ============================================================== */}
        {/* 1. 顶部典藏大阁横幅 (Header)                                     */}
        {/* ============================================================== */}
        <header className="px-6 py-4 border-b border-theme-border bg-theme-surface flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-theme-primary/10 text-theme-primary flex items-center justify-center border border-theme-primary/30 shadow-xs shrink-0">
              <ScrollText className="w-5 h-5 text-theme-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold font-poetry text-theme-text">
                  {poet.name_cn} · 文渊典藏阁
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-theme-primary/15 text-theme-primary font-bold border border-theme-primary/30 font-poetry">
                  {poet.dynasty === 'tang' ? '盛唐真迹' : '两宋墨宝'}
                </span>
              </div>
              <p className="text-xs text-theme-text-muted mt-0.5">
                收录传世名篇 ({unlockedPoemIds.length}/{poems.length}) · 纳卷进度 {completionPercentage}%
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* 收集进度微环 */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-theme-surface-card border border-theme-border text-xs font-mono">
              <span className="text-theme-text-muted">典藏进度：</span>
              <span className="text-theme-primary font-bold">{completionPercentage}%</span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-theme-surface-card hover:bg-theme-surface border border-theme-border flex items-center justify-center text-theme-text-muted hover:text-theme-text transition-colors"
              title="关闭典藏阁"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ============================================================== */}
        {/* 1.5 顶部主展厅切换: 传世诗卷 vs 山河风物匣                       */}
        {/* ============================================================== */}
        <div className="px-6 py-2.5 bg-theme-surface-card/60 border-b border-theme-border flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMainView('poems')}
              className={`px-4 py-1.5 rounded-xl font-bold font-poetry text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                mainView === 'poems'
                  ? 'bg-theme-primary text-white shadow-xs'
                  : 'bg-theme-surface border border-theme-border text-theme-text-muted hover:text-theme-text'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>传世诗卷与千古羁绊</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  mainView === 'poems'
                    ? 'bg-white/20 text-white'
                    : 'bg-theme-primary/10 text-theme-primary'
                }`}
              >
                {unlockedPoemIds.length}/{poems.length}
              </span>
            </button>

            <button
              onClick={() => setMainView('artifacts')}
              className={`px-4 py-1.5 rounded-xl font-bold font-poetry text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                mainView === 'artifacts'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-theme-surface border border-theme-border text-theme-text-muted hover:text-theme-text'
              }`}
            >
              <span>🎒</span>
              <span>山河风物匣 · 行囊</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  mainView === 'artifacts'
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-600/15 text-amber-700 dark:text-amber-300 font-bold'
                }`}
              >
                {collectedArtifactCount}/{allArtifacts.length}
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-theme-text-muted hidden md:inline font-poetry">
              {mainView === 'poems' ? '沉浸研读 · 宗师绝评 · 手札心境' : '名城名产 · 文人信物 · 四海风物'}
            </span>
            {onExportPassport && (
              <button
                onClick={onExportPassport}
                className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold font-poetry shadow-xs flex items-center space-x-1 active:scale-95 transition-all cursor-pointer"
                title="导出通关文牒高清长卷海报"
              >
                <span>📜</span>
                <span>导出山河文牒长图</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. 主体展陈 (诗卷双栏展陈 OR 风物博古架)                         */}
        {/* ============================================================== */}
        {mainView === 'artifacts' ? (
          <ArtifactCabinet
            unlockedArtifactIds={unlockedArtifactIds}
            currentPoetId={poet.id}
          />
        ) : (
          <div className="flex-1 grid grid-cols-12 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-theme-border">
          {/* ------------------------------------------------------------ */}
          {/* 2.1 左栏：传世诗目清单 (Catalog List)                         */}
          {/* ------------------------------------------------------------ */}
          <aside className="col-span-12 md:col-span-5 lg:col-span-4 bg-theme-surface p-4 flex flex-col space-y-3 overflow-hidden">
            {/* 分类过滤器 */}
            <div className="flex items-center p-1 rounded-xl bg-theme-canvas border border-theme-border text-xs shrink-0">
              <button
                onClick={() => setCatalogFilter('all')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  catalogFilter === 'all'
                    ? 'bg-theme-surface-card text-theme-primary shadow-xs'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                全部 ({poems.length})
              </button>
              <button
                onClick={() => setCatalogFilter('unlocked')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  catalogFilter === 'unlocked'
                    ? 'bg-theme-surface-card text-theme-primary shadow-xs'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                已藏 ({unlockedPoemIds.length})
              </button>
              <button
                onClick={() => setCatalogFilter('locked')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  catalogFilter === 'locked'
                    ? 'bg-theme-surface-card text-theme-primary shadow-xs'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                待寻 ({poems.length - unlockedPoemIds.length})
              </button>
            </div>

            {/* 千古羁绊印章区 */}
            {unlockedEncounters.length > 0 && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 shrink-0">
                <div className="flex items-center justify-between text-xs font-bold font-poetry text-amber-800 dark:text-amber-300">
                  <span className="flex items-center space-x-1">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>千古羁绊印鉴 ({unlockedEncounters.length})</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {unlockedEncounters.map((enc) => (
                    <button
                      key={enc.id}
                      onClick={() => onOpenEncounter?.(enc.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-700 hover:bg-red-600 text-white text-[10px] font-poetry font-bold flex items-center space-x-1 border border-red-300/40 shadow-xs active:scale-95 transition-all cursor-pointer"
                      title={`点击重温《${enc.title}》`}
                    >
                      <span>🈴 {enc.bondSeal.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 诗目卡片列表 */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
              {filteredPoems.map((poem) => {
                const isUnlocked = unlockedPoemIds.includes(poem.id);
                const score = poemScores[poem.id] || 100;
                const isSelected = selectedPoem?.id === poem.id;

                if (!isUnlocked) {
                  return (
                    <div
                      key={poem.id}
                      onClick={() => setSelectedPoemId(poem.id)}
                      className={`p-3.5 rounded-2xl border border-dashed transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'border-theme-primary/60 bg-theme-surface-card ring-2 ring-theme-primary/20'
                          : 'border-theme-border/60 bg-theme-canvas/40 hover:bg-theme-surface-card/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-poetry font-bold text-sm text-theme-text-muted/70">
                          《{poem.title}》
                        </span>
                        <div className="flex items-center space-x-1 text-[11px] text-theme-text-muted/60">
                          <Lock className="w-3.5 h-3.5" />
                          <span>待纳</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-theme-text-muted/60 mt-1 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>待游历山河触发文思感通</span>
                      </p>
                    </div>
                  );
                }

                return (
                  <button
                    key={poem.id}
                    onClick={() => setSelectedPoemId(poem.id)}
                    className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-start justify-between group shadow-xs ${
                      isSelected
                        ? 'bg-theme-surface-card border-2 border-theme-primary ring-2 ring-theme-primary/20 shadow-md scale-[1.01]'
                        : 'bg-theme-surface-card/70 hover:bg-theme-surface-card border-theme-border hover:border-theme-border-highlight'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm sm:text-base font-poetry text-theme-text group-hover:text-theme-primary transition-colors">
                          《{poem.title}》
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-poetry ${
                            score === 100
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : score >= 75
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {score === 100 ? '甲等 · 妙品' : score >= 75 ? '乙等 · 研精' : '丙等 · 通习'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] text-theme-text-muted">
                        <span className="flex items-center space-x-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{poem.year}年</span>
                        </span>
                        <span>•</span>
                        <span>{poem.form === 'shi' ? '近体格律' : `词牌《${poem.cipai}》`}</span>
                      </div>
                    </div>

                    <div className="w-6 h-6 rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-theme-primary" />
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ------------------------------------------------------------ */}
          {/* 2.2 右栏：墨宝研读展陈卷轴 (Selected Poem Detail Pane)        */}
          {/* ------------------------------------------------------------ */}
          <main className="col-span-12 md:col-span-7 lg:col-span-8 bg-theme-canvas flex flex-col overflow-hidden">
            {selectedPoem ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* 诗词题头与研学重温按钮 */}
                <div className="p-5 sm:p-6 bg-theme-surface border-b border-theme-border flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-xl sm:text-2xl font-bold font-poetry text-theme-text">
                        《{selectedPoem.title}》
                      </h3>
                      {isSelectedUnlocked && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 font-poetry">
                          {selectedScore === 100
                            ? '甲等 · 妙品'
                            : selectedScore >= 75
                            ? '乙等 · 研精'
                            : '丙等 · 通习'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-theme-text-muted mt-1">
                      {selectedPoem.dynasty === 'tang' ? '唐' : '宋'} · {poet.name_cn} · 公元 {selectedPoem.year} 年 ·{' '}
                      {selectedPoem.form === 'shi' ? '传世格律' : `词牌《${selectedPoem.cipai}》`}
                    </p>
                  </div>

                  {isSelectedUnlocked && onSelectPoemForPlay && (
                    <button
                      onClick={() => onSelectPoemForPlay(selectedPoem)}
                      className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold font-poetry shadow-jade-glow active:scale-95 transition-all flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-theme-gold" />
                      <span>再入诗境 · 研读默写 ➔</span>
                    </button>
                  )}
                </div>

                {/* 研读模块子过滤标签 */}
                <div className="px-6 py-2.5 bg-theme-surface-card border-b border-theme-border/60 flex items-center space-x-2 text-xs overflow-x-auto no-scrollbar shrink-0">
                  <span className="text-theme-text-muted font-poetry mr-1">展陈卷轴：</span>
                  {(
                    [
                      { id: 'all', label: '全景总览' },
                      { id: 'text', label: '墨宝今译' },
                      { id: 'keywords', label: '训诂典故' },
                      { id: 'appreciation', label: '名家绝评' },
                      { id: 'journal', label: '文人心语' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailTab(tab.id)}
                      className={`px-3 py-1 rounded-full text-xs font-poetry transition-all ${
                        detailTab === tab.id
                          ? 'bg-theme-primary text-white font-bold shadow-xs'
                          : 'bg-theme-surface hover:bg-theme-surface-card border border-theme-border text-theme-text-muted'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 诗词详情内容滚动长卷 */}
                <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 no-scrollbar">
                  {/* 未解锁诗词提示 */}
                  {!isSelectedUnlocked ? (
                    <div className="p-8 rounded-3xl bg-theme-surface-card border border-theme-border text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-theme-surface border border-theme-border flex items-center justify-center mx-auto text-theme-text-muted">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-base font-poetry text-theme-text">
                        此卷尚未游历领悟
                      </h4>
                      <p className="text-xs text-theme-text-muted max-w-md mx-auto leading-relaxed">
                        李白/文人在特定历史年份漫游名城时方能触发文思。请跟随大地图官道路网策马行历，探访胜迹以解锁本篇传世绝唱。
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* 1. 诗文书法屏风 (整首诗逐句纵向排版) */}
                      {(detailTab === 'all' || detailTab === 'text') && (
                        <div className="p-6 rounded-3xl bg-theme-surface-card border border-theme-border shadow-xs text-center space-y-3 font-poetry">
                          <div className="text-xs text-theme-gold font-bold flex items-center justify-center space-x-1.5 border-b border-theme-border/60 pb-2">
                            <span>✦ 诗仙手书真迹墨宝 ✦</span>
                          </div>
                          <div className="space-y-2 py-2">
                            {selectedPoem.lines.map((line, idx) => (
                              <p
                                key={idx}
                                className="text-xl sm:text-2xl font-bold text-theme-text tracking-widest leading-relaxed"
                              >
                                {line.text}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2. 白话全篇通译 */}
                      {(detailTab === 'all' || detailTab === 'text') && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-theme-surface-card border border-theme-border shadow-xs space-y-2">
                          <div className="flex items-center space-x-2 text-theme-primary font-bold text-xs sm:text-sm font-poetry">
                            <BookOpen className="w-4 h-4 text-theme-primary" />
                            <span>【白话全篇通译】</span>
                          </div>
                          <p className="text-xs sm:text-sm text-theme-text leading-relaxed font-sans">
                            {selectedPoem.translation}
                          </p>
                        </div>
                      )}

                      {/* 3. 创作纪胜与文人背景 */}
                      {(detailTab === 'all' || detailTab === 'text') && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-theme-surface-card border border-theme-border shadow-xs space-y-2">
                          <div className="flex items-center space-x-2 text-theme-primary font-bold text-xs sm:text-sm font-poetry">
                            <Compass className="w-4 h-4 text-theme-primary" />
                            <span>【创作纪胜与山水溯源】</span>
                          </div>
                          <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed font-sans">
                            {selectedPoem.background}
                          </p>
                        </div>
                      )}

                      {/* 4. 诗人第一人称文心手札 */}
                      {(detailTab === 'all' || detailTab === 'journal') && selectedPoem.poet_journal && (
                        <div className="p-5 rounded-2xl bg-theme-surface-card border border-theme-border shadow-xs font-poetry space-y-2.5">
                          <div className="flex items-center justify-between pb-2 border-b border-theme-border/60">
                            <div className="flex items-center space-x-2 text-theme-gold font-bold text-xs sm:text-sm">
                              <Feather className="w-4 h-4 text-theme-gold" />
                              <span>【诗人第一人称文心手札 · 私密心语】</span>
                            </div>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-theme-gold/10 text-theme-gold border border-theme-gold/30 font-bold">
                              原重心境
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-theme-text leading-7 tracking-wider indent-6 whitespace-pre-line font-poetry">
                            {selectedPoem.poet_journal}
                          </p>
                        </div>
                      )}

                      {/* 5. 重点字词训诂与典籍考据 */}
                      {(detailTab === 'all' || detailTab === 'keywords') &&
                        selectedPoem.key_words.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-theme-text font-poetry font-bold text-sm px-1">
                              <Award className="w-4 h-4 text-theme-primary" />
                              <span>【重点字词训诂与典籍考据】</span>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5">
                              {selectedPoem.key_words.map((kw, idx) => (
                                <div
                                  key={idx}
                                  className="p-3.5 rounded-2xl bg-theme-surface-card border border-theme-border shadow-xs space-y-1.5"
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-bold font-poetry text-theme-text">
                                      {kw.word}
                                    </span>
                                    <span className="text-xs font-mono text-theme-primary bg-theme-primary/10 px-2 py-0.5 rounded-full font-bold">
                                      {kw.pinyin}
                                    </span>
                                  </div>

                                  <p className="text-xs text-theme-text leading-relaxed font-sans">
                                    {kw.explanation}
                                  </p>

                                  {kw.allusion && (
                                    <div className="p-2 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text-muted font-poetry leading-relaxed mt-1">
                                      <span className="font-bold text-theme-gold">📖 典籍考据出处：</span>
                                      {kw.allusion}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* 6. 名家美学绝评与章法艺术赏析 */}
                      {(detailTab === 'all' || detailTab === 'appreciation') && (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-theme-text font-poetry font-bold text-sm px-1">
                            <Quote className="w-4 h-4 text-theme-primary" />
                            <span>【名家美学绝评与章法艺术赏析】</span>
                          </div>

                          {/* 艺术章法特色 */}
                          {selectedPoem.literary_analysis.artistic_features.length > 0 && (
                            <div className="p-4 rounded-2xl bg-theme-surface-card border border-theme-border shadow-xs space-y-2">
                              <h4 className="font-bold text-xs text-theme-primary font-poetry">
                                ❖ 艺术手法与章法特色：
                              </h4>
                              <ul className="space-y-1.5 text-xs text-theme-text-muted leading-relaxed">
                                {selectedPoem.literary_analysis.artistic_features.map((feat, i) => (
                                  <li key={i} className="flex items-start space-x-1.5">
                                    <span className="text-theme-primary mt-0.5">•</span>
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* 全篇美学深度鉴赏长文 */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-theme-surface-card border border-theme-border shadow-xs space-y-2">
                            <h4 className="font-bold text-xs text-theme-primary font-poetry">
                              ❖ 全篇美学深度鉴赏：
                            </h4>
                            <p className="text-xs leading-relaxed text-theme-text font-sans leading-6">
                              {selectedPoem.literary_analysis.appreciation}
                            </p>
                          </div>

                          {/* 历代文宗名家绝评 */}
                          {selectedPoem.literary_analysis.master_comments.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-bold text-xs text-theme-gold font-poetry px-1">
                                ❖ 历代文宗名家绝评：
                              </h4>
                              {selectedPoem.literary_analysis.master_comments.map((mc, i) => (
                                <div
                                  key={i}
                                  className="p-3.5 bg-theme-surface-card border border-theme-border rounded-xl space-y-1 font-poetry"
                                >
                                  <span className="font-bold text-theme-gold text-xs flex items-center space-x-1">
                                    <span>📜</span>
                                    <span>{mc.critic}</span>
                                  </span>
                                  <p className="text-theme-text-muted text-xs italic pl-4 leading-relaxed">
                                    {mc.comment}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-theme-text-muted text-xs space-y-2">
                <Award className="w-10 h-10 opacity-40 text-theme-primary" />
                <p>游历名山大川以解锁更多名篇典藏</p>
              </div>
            )}
          </main>
        </div>
      )}
      </div>
    </div>
  );
};