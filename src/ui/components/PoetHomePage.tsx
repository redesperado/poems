import React, { useState } from 'react';
import { PoetData } from '../../types/poet';
import { POET_PACKS } from '../../data/poets';
import { LOCATIONS } from '../../data/locations';
import {
  Compass,
  BookOpen,
  Check,
  ChevronRight,
  ScrollText,
  Landmark,
} from 'lucide-react';

interface PoetHomePageProps {
  poets: PoetData[];
  currentPoetId: string;
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  onStartJourney: (poetId: string) => void;
  onOpenCollection: () => void;
}

export const PoetHomePage: React.FC<PoetHomePageProps> = ({
  poets,
  currentPoetId,
  currentTheme,
  onThemeChange,
  onStartJourney,
  onOpenCollection,
}) => {
  const [selectedDynasty, setSelectedDynasty] = useState<'all' | 'tang' | 'song'>('all');
  const [selectedPoetId, setSelectedPoetId] = useState<string>(currentPoetId || 'li_bai');

  const filteredPoets = poets.filter((p) => {
    if (selectedDynasty === 'all') return true;
    return p.dynasty === selectedDynasty;
  });

  const selectedPoet = poets.find((p) => p.id === selectedPoetId) || poets[0];
  const selectedPack = POET_PACKS[selectedPoet.id];
  const startLoc = LOCATIONS[selectedPoet.start_location_id];

  const themes = [
    { id: 'spring', name: '新东方·春生', dot: 'bg-emerald-500' },
    { id: 'song-celadon', name: '天青宋韵', dot: 'bg-teal-600' },
    { id: 'tang-ink', name: '玄墨落木', dot: 'bg-amber-700' },
  ];

  return (
    <div className="relative w-screen h-screen overflow-y-auto bg-theme-canvas text-theme-text select-none flex flex-col justify-between transition-colors duration-500">
      {/* 背景水墨山水与微茫晨曦 */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-theme-primary/20 via-theme-gold/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* 1. 顶部品牌与主题换肤栏 */}
      <header className="relative z-20 w-full px-5 py-4 border-b border-theme-border/60 bg-theme-surface/70 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-theme-primary to-theme-accent text-white flex items-center justify-center shadow-jade-glow">
            <ScrollText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-poetry font-bold text-lg sm:text-xl text-theme-text tracking-wide">
                唐宋山河诗境
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary font-bold border border-theme-primary/20">
                诗历山河 · 沉浸游历
              </span>
            </div>
            <p className="text-[11px] text-theme-text-muted mt-0.5">
              溯江涉川，神游八荒 · 翻开两千载华夏文脉长卷
            </p>
          </div>
        </div>

        {/* 右侧：主题换肤与典藏阁入口 */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 主题选择微组件 */}
          <div className="hidden sm:flex items-center space-x-1 p-1 rounded-full bg-theme-surface-card border border-theme-border text-xs">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`px-2.5 py-1 rounded-full flex items-center space-x-1.5 transition-all text-[11px] font-poetry ${
                  currentTheme === t.id
                    ? 'bg-theme-primary text-white font-bold shadow-xs'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${t.dot}`} />
                <span>{t.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={onOpenCollection}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-theme-surface-card hover:bg-theme-surface border border-theme-border text-theme-text text-xs font-poetry transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>典藏阁</span>
          </button>
        </div>
      </header>

      {/* 2. 主展厅：朝代筛选与诗人图文卡片展区 */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col space-y-6">
        {/* 朝代选择器 (全部 / 盛唐气象 / 两宋风雅) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-theme-border/40 pb-4">
          <div className="flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-theme-primary shrink-0" />
            <span className="text-xs font-bold text-theme-text font-poetry">
              按朝代风雅筛选：
            </span>
            <div className="flex items-center p-1 rounded-2xl bg-theme-surface-card border border-theme-border text-xs">
              <button
                onClick={() => setSelectedDynasty('all')}
                className={`px-3 py-1.5 rounded-xl font-poetry transition-all cursor-pointer ${
                  selectedDynasty === 'all'
                    ? 'bg-theme-primary text-white font-bold shadow-xs'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                全卷并览 (4)
              </button>
              <button
                onClick={() => setSelectedDynasty('tang')}
                className={`px-3 py-1.5 rounded-xl font-poetry transition-all cursor-pointer ${
                  selectedDynasty === 'tang'
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                盛唐华章 (李杜)
              </button>
              <button
                onClick={() => setSelectedDynasty('song')}
                className={`px-3 py-1.5 rounded-xl font-poetry transition-all cursor-pointer ${
                  selectedDynasty === 'song'
                    ? 'bg-teal-600 text-white font-bold shadow-xs'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                两宋风雅 (苏李)
              </button>
            </div>
          </div>

          <div className="text-[11px] text-theme-text-muted font-poetry">
            {selectedDynasty === 'tang'
              ? '「大唐气象 · 盛极天宝，李杜双星，浩荡千古」'
              : selectedDynasty === 'song'
              ? '「两宋词韵 · 汴杭烟雨，苏李双绝，旷达婉约」'
              : '「盛唐两宋 · 诗仙诗圣，词宗大家，四峰并峙」'}
          </div>
        </div>

        {/* 诗人画卷卡片画廊 (图片形式展出 + 少量介绍) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPoets.map((poet) => {
            const isSelected = poet.id === selectedPoetId;
            const pack = POET_PACKS[poet.id];
            const poemCount = pack?.poems.length || 0;
            const eventCount = pack?.events.length || 0;
            const startLocation = LOCATIONS[poet.start_location_id];

            return (
              <div
                key={poet.id}
                onClick={() => setSelectedPoetId(poet.id)}
                className={`group relative rounded-3xl overflow-hidden border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-theme-surface-card border-theme-primary shadow-2xl scale-[1.02] ring-4 ring-theme-primary/20'
                    : 'bg-theme-surface-card/80 hover:bg-theme-surface-card border-theme-border hover:border-theme-border-highlight hover:-translate-y-1 shadow-md hover:shadow-xl'
                }`}
              >
                {/* 1. 诗人经典画卷立绘展示区 (图片形式展出) */}
                <div className="relative w-full aspect-[4/5] bg-stone-900/10 overflow-hidden">
                  {poet.avatar_image ? (
                    <img
                      src={poet.avatar_image}
                      alt={poet.name_cn}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    /* 优雅水墨备用展板 */
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900">
                      <div className="w-20 h-20 rounded-full border-2 border-theme-primary/40 flex items-center justify-center text-3xl font-bold font-poetry text-theme-primary">
                        {poet.name_cn.slice(-2)}
                      </div>
                      <div className="mt-3 text-sm font-bold font-poetry text-theme-text">
                        {poet.title}
                      </div>
                    </div>
                  )}

                  {/* 顶部朝代与头衔印鉴徽标 */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5 z-10">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold font-poetry shadow-md border ${
                        poet.dynasty === 'tang'
                          ? 'bg-amber-950/80 text-amber-200 border-amber-500/50 backdrop-blur-sm'
                          : 'bg-teal-950/80 text-teal-200 border-teal-500/50 backdrop-blur-sm'
                      }`}
                    >
                      {poet.dynasty === 'tang' ? '大唐 · 诗宗' : '两宋 · 词宗'}
                    </span>
                  </div>

                  {/* 选中高亮状态小红印章 */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-10 animate-in zoom-in-50">
                      <span className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border border-red-300">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    </div>
                  )}

                  {/* 底部渐变墨晕遮罩 */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-theme-surface-card via-theme-surface-card/60 to-transparent pointer-events-none" />

                  {/* 画幅底部名讳与号 */}
                  <div className="absolute bottom-2 inset-x-4 flex items-end justify-between z-10">
                    <div>
                      <h3 className="font-bold text-2xl text-theme-text font-poetry tracking-wider">
                        {poet.name_cn}
                      </h3>
                      <div className="text-xs text-theme-gold font-poetry font-bold">
                        【{poet.title}】
                      </div>
                    </div>
                    <span className="text-[11px] text-theme-text-muted font-mono">
                      {poet.born} — {poet.died}
                    </span>
                  </div>
                </div>

                {/* 2. 诗人少量核心精炼介绍与数据展布 */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* 少量核心介绍 */}
                    <p className="text-xs text-theme-text-muted leading-relaxed font-poetry">
                      {poet.brief_intro || poet.bio_short}
                    </p>

                    {/* 标志性传世金句 */}
                    {poet.famous_quote && (
                      <div className="p-2.5 rounded-xl bg-theme-primary/5 border border-theme-primary/15 text-xs text-theme-primary font-poetry italic">
                        “{poet.famous_quote}”
                      </div>
                    )}
                  </div>

                  {/* 代表作徽标与游历起点 */}
                  <div className="pt-2 border-t border-theme-border/40 space-y-2 text-[11px]">
                    {/* 代表作 */}
                    {poet.representative_poems && (
                      <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                        <span className="text-theme-text-muted font-poetry">名篇:</span>
                        {poet.representative_poems.slice(0, 3).map((p) => (
                          <span
                            key={p}
                            className="px-1.5 py-0.5 rounded bg-theme-surface border border-theme-border text-theme-text font-poetry text-[10px]"
                          >
                            《{p}》
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 旅途速览 */}
                    <div className="flex items-center justify-between text-theme-text-muted font-poetry">
                      <span className="flex items-center space-x-1">
                        <Compass className="w-3.5 h-3.5 text-theme-accent" />
                        <span>起点: {startLocation?.name_cn || '蜀地'}</span>
                      </span>
                      <span>
                        收录 <b className="text-theme-text font-mono">{poemCount}</b> 篇 ·{' '}
                        <b className="text-theme-text font-mono">{eventCount}</b> 节点
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 3. 底部启程控制台 (开始游历大按钮) */}
      <footer className="relative z-20 w-full px-5 py-4 border-t border-theme-border/60 bg-theme-surface/85 backdrop-blur-md shadow-card-soft">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 左侧：当前选中文人状态速览 */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="w-10 h-10 rounded-2xl bg-theme-primary/15 border border-theme-primary/30 flex items-center justify-center text-theme-primary font-bold font-poetry text-base">
              {selectedPoet.name_cn.slice(-2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-theme-text font-poetry">
                  当前化身：{selectedPoet.name_cn}（{selectedPoet.title}）
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-theme-primary/10 text-theme-primary border border-theme-primary/30 font-poetry">
                  {selectedPoet.dynasty === 'tang' ? '大唐盛世' : '两宋风雅'}
                </span>
              </div>
              <p className="text-[11px] text-theme-text-muted font-poetry mt-0.5">
                即将自公元 {selectedPoet.start_year} 年【{startLoc?.name_cn || '蜀地'}】启程，踏足华夏锦绣山河 · 历经 {selectedPack?.events.length || 0} 个历史节点与 {selectedPack?.poems.length || 0} 篇传世名作
              </p>
            </div>
          </div>

          {/* 右侧：开始游历核心行动大按钮 */}
          <button
            onClick={() => onStartJourney(selectedPoet.id)}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-theme-primary via-theme-accent to-theme-gold hover:opacity-95 text-white font-poetry font-bold text-sm sm:text-base shadow-jade-glow transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer group"
          >
            <Compass className="w-5 h-5 text-amber-200 group-hover:rotate-45 transition-transform" />
            <span>开启【{selectedPoet.name_cn}】山河游历长卷</span>
            <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </footer>
    </div>
  );
};
