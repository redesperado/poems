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
import { PoetRetrospectiveModal } from './ui/components/PoetRetrospectiveModal';
import { PoetSwitchModal } from './ui/components/PoetSwitchModal';
import { PoetHomePage } from './ui/components/PoetHomePage';
import { AVAILABLE_POETS } from './data/poets';
import { GameEvent } from './types/event';
import { Sparkles, Compass, GitFork, Flame, Crown } from 'lucide-react';

export const App: React.FC = () => {
  const {
    currentPoet,
    currentPoetId,
    switchPoet,
    currentDynasty,
    currentTheme,
    switchTheme,
    currentYear,
    currentLocation,
    mood,
    unlockedPoemIds,
    poemScores,
    completedEventIds,
    choicesMade,
    activePoemToAssemble,
    setActivePoemToAssemble,
    activeLifeChoice,
    setActiveLifeChoice,
    triggerLifeChoice,
    confirmLifeChoice,
    activeCrisis,
    triggerCrisisForEvent,
    dismissCrisis,
    activeRetrospective,
    setActiveRetrospective,
    triggerRetrospectiveForEvent,
    resetPoetJourney,
    completeEvent,
    isCollectionOpen,
    setIsCollectionOpen,
    travelToLocation,
    completePoemAssembly,
    activePack,
    isLoading,
  } = useGameStore();

  const [activeEventNotice, setActiveEventNotice] = useState<GameEvent | null>(null);
  const [isPoetSwitchOpen, setIsPoetSwitchOpen] = useState<boolean>(false);
  const [isOnHomePage, setIsOnHomePage] = useState<boolean>(true);

  // 快捷触发当前地点的诗词创作
  const handleTriggerCurrentLocationPoem = () => {
    const currentLocPoem = activePack.poems.find(
      (p) => p.location_id === currentLocation.id
    );
    if (currentLocPoem) {
      setActivePoemToAssemble(currentLocPoem);
    }
  };

  // 点击时间轴事件（不可跳过原则）
  const handleTimelineEventClick = (event: GameEvent, isCurrent: boolean, isCompleted: boolean) => {
    if (!isCurrent && !isCompleted) return;

    if (event.type === 'passing' || event.triggers_retrospective) {
      triggerRetrospectiveForEvent(event);
    } else if (event.triggers_crisis || event.type === 'crisis_response') {
      triggerCrisisForEvent(event);
    } else if (event.triggers_choice_id && !choicesMade[event.triggers_choice_id]) {
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

  // 首页：朝代与文人长卷挑选
  if (isOnHomePage) {
    return (
      <>
        <PoetHomePage
          poets={AVAILABLE_POETS}
          currentPoetId={currentPoetId}
          currentTheme={currentTheme}
          onThemeChange={switchTheme}
          onStartJourney={(poetId) => {
            if (poetId !== currentPoetId) {
              switchPoet(poetId);
            }
            setIsOnHomePage(false);
          }}
          onOpenCollection={() => setIsCollectionOpen(true)}
        />

        {/* 典藏阁弹窗 */}
        {isCollectionOpen && (
          <CollectionModal
            poet={currentPoet}
            poems={activePack.poems}
            unlockedPoemIds={unlockedPoemIds}
            poemScores={poemScores}
            onClose={() => setIsCollectionOpen(false)}
            onSelectPoemForPlay={(poem) => {
              setIsCollectionOpen(false);
              setIsOnHomePage(false);
              setActivePoemToAssemble(poem);
            }}
          />
        )}
      </>
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
        onOpenPoetSwitch={() => setIsPoetSwitchOpen(true)}
        onBackToHome={() => setIsOnHomePage(true)}
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

      {/* 3. 底部历史时间轴托盘 (严格依序历程，不可跳过，状态鲜明区分) */}
      <TimelineDock
        events={activePack.events}
        currentYear={currentYear}
        completedEventIds={completedEventIds}
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

      {/* 6. 朝代大事节点危机弹窗 (Historical Dynastic Crisis，如安史之乱) */}
      {activeCrisis && (
        <CrisisModal
          year={activeCrisis.year}
          title={activeCrisis.title}
          historicalEventName={activeCrisis.historicalEventName}
          historicalBackground={activeCrisis.historicalBackground}
          poetImpact={activeCrisis.poetImpact}
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

      {/* 8. 时间轴事件详情与交互弹窗 */}
      {activeEventNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-theme-surface-card border-2 border-theme-border rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border/50 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-theme-primary/10 text-theme-primary font-mono font-bold">
                  公元 {activeEventNotice.year} 年
                </span>
                {completedEventIds.includes(activeEventNotice.id) ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-medium">
                    已经历 · 历史履痕
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold animate-pulse">
                    当下历程 · 亲历中
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveEventNotice(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5"
              >
                ×
              </button>
            </div>

            <div>
              <h3 className="font-bold text-lg text-theme-text font-poetry flex items-center gap-2">
                {(activeEventNotice.type === 'crisis_response' || activeEventNotice.triggers_crisis) && (
                  <Flame className="w-5 h-5 text-red-500 shrink-0" />
                )}
                <span>{activeEventNotice.title}</span>
              </h3>
              <p className="text-xs sm:text-[13px] text-theme-text-muted leading-relaxed mt-2.5">
                {activeEventNotice.description}
              </p>
            </div>

            {/* 关联诗作提示 */}
            {activeEventNotice.triggers_poem_id && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-poetry font-bold">
                    【关联经典诗篇】
                  </span>
                </div>
                <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  {unlockedPoemIds.includes(activeEventNotice.triggers_poem_id) ? '已收录于典藏' : '待感悟创作'}
                </span>
              </div>
            )}

            {/* 操作按钮区 */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
              {/* 如果是诗人谢幕与生平总评 */}
              {(activeEventNotice.type === 'passing' || activeEventNotice.triggers_retrospective) && (
                <button
                  onClick={() => {
                    triggerRetrospectiveForEvent(activeEventNotice);
                    setActiveEventNotice(null);
                  }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-600 via-purple-600 to-indigo-700 hover:from-amber-500 hover:to-indigo-600 text-white text-xs font-bold shadow-lg flex items-center space-x-1.5 cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>阅览诗仙羽化 · 一生总评</span>
                </button>
              )}

              {/* 如果是朝代危机 */}
              {(activeEventNotice.type === 'crisis_response' || activeEventNotice.triggers_crisis) && (
                <button
                  onClick={() => {
                    triggerCrisisForEvent(activeEventNotice);
                    setActiveEventNotice(null);
                  }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>查看朝代大事件与影响</span>
                </button>
              )}

              {/* 如果是人生抉择 */}
              {activeEventNotice.triggers_choice_id && (
                <button
                  onClick={() => {
                    triggerLifeChoice(activeEventNotice.triggers_choice_id!);
                    setActiveEventNotice(null);
                  }}
                  className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>直面人生抉择</span>
                </button>
              )}

              {/* 如果有关联诗词 */}
              {activeEventNotice.triggers_poem_id && (
                <button
                  onClick={() => {
                    const poem = activePack.poems.find((p) => p.id === activeEventNotice.triggers_poem_id);
                    if (poem) {
                      setActivePoemToAssemble(poem);
                      setActiveEventNotice(null);
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{unlockedPoemIds.includes(activeEventNotice.triggers_poem_id) ? '重温诗作' : '感悟创作'}</span>
                </button>
              )}

              {/* 亲历或前往 */}
              {!completedEventIds.includes(activeEventNotice.id) ? (
                <button
                  onClick={() => {
                    travelToLocation(activeEventNotice.location_id);
                    completeEvent(activeEventNotice.id);
                    setActiveEventNotice(null);
                  }}
                  className="px-4 py-2 rounded-full bg-theme-primary hover:bg-theme-accent text-white text-xs font-bold shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>亲历此程，步入新程</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    travelToLocation(activeEventNotice.location_id);
                    setActiveEventNotice(null);
                  }}
                  className="px-4 py-2 rounded-full bg-stone-700 hover:bg-stone-600 text-white text-xs font-medium flex items-center space-x-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>重访此地</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. 诗人谢幕 · 一生总评与宗师定评全景弹窗 (Poet Retrospective) */}
      {activeRetrospective && (
        <PoetRetrospectiveModal
          poet={currentPoet}
          retrospective={activeRetrospective}
          unlockedCount={unlockedPoemIds.length}
          totalCount={activePack.poems.length}
          mood={mood}
          onOpenCollection={() => {
            setActiveRetrospective(null);
            setIsCollectionOpen(true);
          }}
          onRestartJourney={() => {
            setActiveRetrospective(null);
            resetPoetJourney();
          }}
          onOpenPoetSwitch={() => {
            setActiveRetrospective(null);
            setIsPoetSwitchOpen(true);
          }}
          onClose={() => setActiveRetrospective(null)}
        />
      )}

      {/* 10. 历代千古文宗 · 诗词长卷切换弹窗 (Poet Switch) */}
      {isPoetSwitchOpen && (
        <PoetSwitchModal
          currentPoetId={currentPoetId}
          availablePoets={AVAILABLE_POETS}
          onSelectPoet={(poetId) => {
            switchPoet(poetId);
            setIsPoetSwitchOpen(false);
          }}
          onBackToHome={() => {
            setIsPoetSwitchOpen(false);
            setIsOnHomePage(true);
          }}
          onClose={() => setIsPoetSwitchOpen(false)}
        />
      )}
    </div>
  );
};
