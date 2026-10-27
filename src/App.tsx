import React, { useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { HeaderNav } from './ui/components/HeaderNav';
import { MoodGauge } from './ui/components/MoodGauge';
import { TravelMapStage } from './ui/components/TravelMapStage';
import { TimelineDock } from './ui/components/TimelineDock';
import { PoemAssemblyModal } from './ui/components/PoemAssemblyModal';
import { CollectionModal } from './ui/components/CollectionModal';
import { LifeChoiceModal } from './ui/components/LifeChoiceModal';
import { CrisisModal } from './ui/components/CrisisModal';
import { GameEvent } from './types/event';
import { Sparkles, Compass, GitFork } from 'lucide-react';

export const App: React.FC = () => {
  const {
    currentPoet,
    currentDynasty,
    currentTheme,
    switchTheme,
    currentYear,
    currentLocation,
    mood,
    unlockedPoemIds,
    poemScores,
    activePoemToAssemble,
    setActivePoemToAssemble,
    activeLifeChoice,
    setActiveLifeChoice,
    triggerLifeChoice,
    confirmLifeChoice,
    activeCrisis,
    dismissCrisis,
    isCollectionOpen,
    setIsCollectionOpen,
    travelToLocation,
    completePoemAssembly,
    activePack,
    isLoading,
  } = useGameStore();

  const [activeEventNotice, setActiveEventNotice] = useState<GameEvent | null>(null);

  // 快捷触发当前地点的诗词创作
  const handleTriggerCurrentLocationPoem = () => {
    const currentLocPoem = activePack.poems.find(
      (p) => p.location_id === currentLocation.id
    );
    if (currentLocPoem) {
      setActivePoemToAssemble(currentLocPoem);
    }
  };

  // 点击时间轴事件
  const handleTimelineEventClick = (event: GameEvent) => {
    if (event.triggers_choice_id) {
      triggerLifeChoice(event.triggers_choice_id);
    } else {
      setActiveEventNotice(event);
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-theme-canvas">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-theme-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-theme-text font-poetry">正在展开盛唐两宋山河长卷...</p>
        </div>
      </div>
    );
  }

  const currentHasPoem = activePack.poems.some(
    (p) => p.location_id === currentLocation.id
  );
  const currentPoemUnlocked = activePack.poems.some(
    (p) => p.location_id === currentLocation.id && unlockedPoemIds.includes(p.id)
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between bg-theme-canvas min-h-dvh-safe transition-colors duration-300">
      {/* 1. 顶部状态与导航 (海棠形头像、朝代绑定、主题换肤) */}
      <HeaderNav
        poet={currentPoet}
        dynasty={currentDynasty}
        year={currentYear}
        location={currentLocation}
        currentTheme={currentTheme}
        onThemeChange={switchTheme}
        unlockedCount={unlockedPoemIds.length}
        totalCount={activePack.poems.length}
        onOpenCollection={() => setIsCollectionOpen(true)}
      />

      {/* 2. 主场景：地图游历与右侧悬浮 5 维情绪仪表 */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex">
        {/* 地图核心舞台 */}
        <TravelMapStage
          currentLocation={currentLocation}
          dynasty={currentDynasty}
          onTravel={travelToLocation}
          unlockedPoemIds={unlockedPoemIds}
          currentYear={currentYear}
        />

        {/* 右上角悬浮：五维心境水滴仪表盘 */}
        <div className="absolute right-4 top-4 z-20 hidden sm:block">
          <MoodGauge mood={mood} />
        </div>

        {/* 悬浮快捷诗词灵感按钮 (当到达具有诗作的地点时浮现) */}
        {currentHasPoem && (
          <div className="absolute left-6 bottom-6 z-20">
            <button
              onClick={handleTriggerCurrentLocationPoem}
              className={`px-4 py-2.5 rounded-full flex items-center space-x-2 shadow-lg transition-all active:scale-95 border ${
                currentPoemUnlocked
                  ? 'bg-theme-surface-card border-theme-gold text-theme-gold hover:bg-amber-50'
                  : 'bg-gradient-to-r from-theme-primary to-theme-accent text-white border-white/40 shadow-jade-glow animate-bounce'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold font-poetry">
                {currentPoemUnlocked ? '重温文心' : '感悟当令诗作'}
              </span>
            </button>
          </div>
        )}
      </main>

      {/* 3. 底部历史时间轴托盘 (飞檐起翘流线) */}
      <TimelineDock
        events={activePack.events}
        currentYear={currentYear}
        unlockedPoemIds={unlockedPoemIds}
        onSelectEvent={handleTimelineEventClick}
      />

      {/* 4. 诗词拼组与灵感填空弹窗 (核心交互) */}
      {activePoemToAssemble && (
        <PoemAssemblyModal
          poem={activePoemToAssemble}
          onComplete={completePoemAssembly}
          onClose={() => setActivePoemToAssemble(null)}
        />
      )}

      {/* 5. 人生岔路抉择弹窗 (Life Choice) */}
      {activeLifeChoice && (
        <LifeChoiceModal
          choice={activeLifeChoice}
          onConfirmChoice={confirmLifeChoice}
          onClose={() => setActiveLifeChoice(null)}
        />
      )}

      {/* 6. 时代洪流危机弹窗 (Historical Crisis) */}
      {activeCrisis && (
        <CrisisModal
          year={activeCrisis.year}
          title={activeCrisis.title}
          description={activeCrisis.description}
          moodDeltaText={activeCrisis.moodDeltaText}
          onConfirm={dismissCrisis}
        />
      )}

      {/* 7. 典藏阁弹窗 */}
      {isCollectionOpen && (
        <CollectionModal
          poet={currentPoet}
          poems={activePack.poems}
          unlockedPoemIds={unlockedPoemIds}
          poemScores={poemScores}
          onClose={() => setIsCollectionOpen(false)}
          onSelectPoemForPlay={(poem) => {
            setIsCollectionOpen(false);
            setActivePoemToAssemble(poem);
          }}
        />
      )}

      {/* 8. 时间轴事件简介提示 Drawer */}
      {activeEventNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-theme-surface-card border border-theme-border rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-theme-border/50 pb-2">
              <span className="text-xs font-bold text-theme-primary font-poetry">
                公元 {activeEventNotice.year} 年
              </span>
              <button
                onClick={() => setActiveEventNotice(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <h3 className="font-bold text-base text-theme-text font-poetry">
              {activeEventNotice.title}
            </h3>
            <p className="text-xs text-theme-text-muted leading-relaxed">
              {activeEventNotice.description}
            </p>
            <div className="pt-2 flex justify-end space-x-2">
              {activeEventNotice.triggers_choice_id && (
                <button
                  onClick={() => {
                    triggerLifeChoice(activeEventNotice.triggers_choice_id!);
                    setActiveEventNotice(null);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold shadow-sm flex items-center space-x-1 hover:bg-purple-700"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>抉择分水岭</span>
                </button>
              )}
              <button
                onClick={() => {
                  travelToLocation(activeEventNotice.location_id);
                  setActiveEventNotice(null);
                }}
                className="px-3.5 py-1.5 rounded-full bg-theme-primary text-white text-xs font-bold shadow-sm flex items-center space-x-1"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>前往该地</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
