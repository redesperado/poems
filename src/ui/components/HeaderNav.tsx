import React from 'react';
import { PoetData } from '../../types/poet';
import { LocationData } from '../../types/location';
import { AVAILABLE_POETS } from '../../data/poets';
import { Palette, BookOpen, Compass, Users } from 'lucide-react';

interface HeaderNavProps {
  poet: PoetData;
  dynasty: 'tang' | 'song';
  onDynastyChange: (d: 'tang' | 'song') => void;
  onPoetChange: (poetId: string) => void;
  year: number;
  location: LocationData;
  currentTheme: string;
  onThemeChange: (t: string) => void;
  unlockedCount: number;
  totalCount: number;
  onOpenCollection: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  poet,
  dynasty,
  onDynastyChange,
  onPoetChange,
  year,
  location,
  currentTheme,
  onThemeChange,
  unlockedCount,
  totalCount,
  onOpenCollection,
}) => {
  const currentDynastyLocationName =
    location.dynasty_names[dynasty] || location.name_cn;

  return (
    <header className="w-full px-4 py-3 bg-theme-surface/85 backdrop-blur-md border-b border-theme-border flex items-center justify-between shadow-card-soft transition-colors duration-300 z-30">
      {/* 左侧：诗人状态（海棠形头像）与年份地点 */}
      <div className="flex items-center space-x-3">
        {/* 唐代海棠形头像底座 (可点击切换诗人) */}
        <div className="relative group">
          <div className="w-12 h-12 bg-gradient-to-br from-spring-emerald via-spring-celadon to-spring-gold p-[2px] shape-begonia flex items-center justify-center shadow-jade-glow transition-transform active:scale-95 cursor-pointer">
            <div className="w-full h-full bg-theme-surface-card shape-begonia flex items-center justify-center text-theme-primary font-bold text-base font-poetry">
              {poet.name_cn.slice(-2)}
            </div>
          </div>
          {/* 小红印章落款 */}
          <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[9px] px-1 py-0.5 rounded-full font-serif shadow pointer-events-none">
            {poet.title}
          </span>
        </div>

        {/* 诗人名称与年份地点 */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-base text-theme-text font-poetry">
              {poet.name_cn}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-spring-emerald/15 text-spring-deep border border-spring-emerald/30 font-medium">
              公元 {year} 年
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-theme-text-muted mt-0.5">
            <Compass className="w-3.5 h-3.5 text-theme-accent" />
            <span className="font-medium text-theme-accent">
              {currentDynastyLocationName}
            </span>
            <span className="text-[11px] text-gray-400">
              ({location.name_modern})
            </span>
          </div>
        </div>
      </div>

      {/* 右侧：文人切换、朝代切换、主题切换器、典藏阁入口 */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* 文人/词人切换下拉选择 (多人物高扩展性) */}
        <div className="relative group">
          <button
            title="切换当前主线诗人/词人"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-theme-surface-card border border-theme-border text-xs text-theme-text hover:border-theme-border-highlight transition-all active:scale-95"
          >
            <Users className="w-3.5 h-3.5 text-theme-primary" />
            <span className="hidden sm:inline font-medium">文人</span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-44 bg-theme-surface-card/95 backdrop-blur-lg border border-theme-border rounded-xl p-1.5 shadow-xl hidden group-hover:block transition-all z-50">
            <div className="text-[10px] text-theme-text-muted px-2 py-1 font-semibold">
              选择游历文人
            </div>
            {AVAILABLE_POETS.map((p) => (
              <button
                key={p.id}
                onClick={() => onPoetChange(p.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                  poet.id === p.id
                    ? 'bg-theme-primary/15 text-theme-primary font-bold'
                    : 'text-theme-text hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className="font-poetry">{p.name_cn}</span>
                  <span className="text-[10px] text-theme-text-muted">({p.title})</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                  {p.dynasty === 'tang' ? '唐' : '宋'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 朝代快速切换 */}
        <div className="flex items-center bg-theme-surface-card border border-theme-border rounded-full p-0.5 text-xs">
          <button
            onClick={() => onDynastyChange('tang')}
            className={`px-2.5 py-1 rounded-full transition-all ${
              dynasty === 'tang'
                ? 'bg-theme-primary text-white font-bold shadow-sm'
                : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            大唐
          </button>
          <button
            onClick={() => onDynastyChange('song')}
            className={`px-2.5 py-1 rounded-full transition-all ${
              dynasty === 'song'
                ? 'bg-theme-primary text-white font-bold shadow-sm'
                : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            两宋
          </button>
        </div>

        {/* 主题换肤下拉切换 (Theme Engine) */}
        <div className="relative group">
          <button
            title="切换游戏主题风格"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-theme-surface-card border border-theme-border text-xs text-theme-text hover:border-theme-border-highlight transition-all active:scale-95"
          >
            <Palette className="w-3.5 h-3.5 text-theme-primary" />
            <span className="hidden md:inline font-medium">主题</span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-36 bg-theme-surface-card/95 backdrop-blur-lg border border-theme-border rounded-xl p-1.5 shadow-xl hidden group-hover:block transition-all z-50">
            <div className="text-[10px] text-theme-text-muted px-2 py-1 font-semibold">
              换肤风格
            </div>
            <button
              onClick={() => onThemeChange('spring')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                currentTheme === 'spring'
                  ? 'bg-spring-emerald/15 text-spring-deep font-bold'
                  : 'text-theme-text hover:bg-gray-100/50'
              }`}
            >
              <span>新东方·春生</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </button>
            <button
              onClick={() => onThemeChange('song-celadon')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                currentTheme === 'song-celadon'
                  ? 'bg-teal-500/15 text-teal-800 font-bold'
                  : 'text-theme-text hover:bg-gray-100/50'
              }`}
            >
              <span>天青宋韵</span>
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
            </button>
            <button
              onClick={() => onThemeChange('tang-ink')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                currentTheme === 'tang-ink'
                  ? 'bg-amber-500/15 text-amber-900 font-bold'
                  : 'text-theme-text hover:bg-gray-100/50'
              }`}
            >
              <span>玄墨落木</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-700"></span>
            </button>
          </div>
        </div>

        {/* 典藏阁入口 */}
        <button
          onClick={onOpenCollection}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-theme-primary/10 border border-theme-primary/30 text-xs text-theme-primary font-bold hover:bg-theme-primary hover:text-white transition-all shadow-sm active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>典藏</span>
          <span className="bg-theme-gold text-white text-[10px] px-1.5 py-0.2 rounded-full">
            {unlockedCount}/{totalCount}
          </span>
        </button>
      </div>
    </header>
  );
};
