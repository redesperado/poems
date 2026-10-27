import React, { useState, useRef, useEffect } from 'react';
import { PoetData } from '../../types/poet';
import { LocationData } from '../../types/location';
import { Palette, BookOpen, Compass, ChevronDown, Check } from 'lucide-react';

interface HeaderNavProps {
  poet: PoetData;
  dynasty: 'tang' | 'song';
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
  year,
  location,
  currentTheme,
  onThemeChange,
  unlockedCount,
  totalCount,
  onOpenCollection,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部自动关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    if (isThemeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeMenuOpen]);

  const currentDynastyLocationName =
    location.dynasty_names[dynasty] || location.name_cn;

  const themes = [
    {
      id: 'spring',
      name: '新东方·春生',
      desc: '春水碧 · 晨露白',
      dotColor: 'bg-emerald-500',
    },
    {
      id: 'song-celadon',
      name: '天青宋韵',
      desc: '雨过天青 · 汝瓷润玉',
      dotColor: 'bg-teal-600',
    },
    {
      id: 'tang-ink',
      name: '玄墨落木',
      desc: '盛唐玄青 · 沉古金墨',
      dotColor: 'bg-amber-700',
    },
  ];

  return (
    <header className="w-full px-4 py-3 bg-theme-surface/85 backdrop-blur-md border-b border-theme-border flex items-center justify-between shadow-card-soft transition-colors duration-300 z-30">
      {/* 左侧：诗人状态（海棠形头像）与年份地点 */}
      <div className="flex items-center space-x-3">
        {/* 唐代海棠形头像底座 */}
        <div className="relative group">
          <div className="w-12 h-12 bg-gradient-to-br from-spring-emerald via-spring-celadon to-spring-gold p-[2px] shape-begonia flex items-center justify-center shadow-jade-glow">
            <div className="w-full h-full bg-theme-surface-card shape-begonia flex items-center justify-center text-theme-primary font-bold text-base font-poetry">
              {poet.name_cn.slice(-2)}
            </div>
          </div>
          {/* 小红印章落款 */}
          <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[9px] px-1 py-0.5 rounded-full font-serif shadow pointer-events-none">
            {poet.title}
          </span>
        </div>

        {/* 诗人名称与朝代年份地点 */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-base text-theme-text font-poetry">
              {poet.name_cn}
            </span>

            {/* 朝代不可切换，严格绑定诗人 */}
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-theme-primary/15 text-theme-primary font-bold border border-theme-primary/30 font-poetry">
              {poet.dynasty === 'tang' ? '大唐' : '两宋'}
            </span>

            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-950 border border-emerald-400 font-bold font-poetry">
              公元 {year} 年
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-theme-text-muted mt-0.5">
            <Compass className="w-3.5 h-3.5 text-theme-accent shrink-0" />
            <span className="font-bold text-theme-accent">
              {currentDynastyLocationName}
            </span>
            <span className="text-[11px] text-theme-text-muted font-medium">
              (今 {location.name_modern})
            </span>
          </div>
        </div>
      </div>

      {/* 右侧：主题切换器、典藏阁入口 */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* 主题换肤下拉切换 (点击常驻展开，彻底消除 Hover 间隙抖动) */}
        <div ref={themeMenuRef} className="relative">
          <button
            onClick={() => setIsThemeMenuOpen((prev) => !prev)}
            title="切换游戏主题风格"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs transition-all active:scale-95 ${
              isThemeMenuOpen
                ? 'bg-theme-primary text-white border-theme-primary shadow-jade-glow font-bold'
                : 'bg-theme-surface-card border-theme-border text-theme-text hover:border-theme-border-highlight'
            }`}
          >
            <Palette className={`w-3.5 h-3.5 ${isThemeMenuOpen ? 'text-white' : 'text-theme-primary'}`} />
            <span className="font-medium font-poetry">主题</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${
                isThemeMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* 下拉菜单面板：通过 state 严格控制显隐，无间隙、无鼠标移出消失 bug */}
          {isThemeMenuOpen && (
            <div className="absolute right-0 top-full pt-1.5 w-48 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="bg-theme-surface-card/98 backdrop-blur-xl border border-theme-border rounded-2xl p-2 shadow-2xl space-y-1">
                <div className="text-[10px] text-theme-text-muted px-2.5 py-1 font-bold font-poetry border-b border-theme-border/40 flex items-center justify-between">
                  <span>换肤风格</span>
                  <span className="text-[9px] opacity-70">点击立即切换</span>
                </div>

                <div className="space-y-0.5 pt-1">
                  {themes.map((t) => {
                    const isSelected = currentTheme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          onThemeChange(t.id);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-theme-primary-light text-theme-primary font-bold shadow-xs'
                            : 'text-theme-text hover:bg-theme-surface'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${t.dotColor} shrink-0 ring-1 ring-white/80 shadow-xs`} />
                          <div>
                            <div className="font-poetry font-bold leading-tight">{t.name}</div>
                            <div className="text-[10px] text-theme-text-muted opacity-80 leading-tight mt-0.5">
                              {t.desc}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-theme-primary shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 典藏阁入口 */}
        <button
          onClick={onOpenCollection}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-theme-primary/10 border border-theme-primary/30 text-xs text-theme-primary font-bold hover:bg-theme-primary hover:text-white transition-all shadow-sm active:scale-95 font-poetry"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>典藏</span>
          <span className="bg-theme-gold text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {unlockedCount}/{totalCount}
          </span>
        </button>
      </div>
    </header>
  );
};
