import { useState, useEffect, useCallback } from 'react';
import { MoodState } from '../types/mood';
import { LocationData } from '../types/location';
import { PoemData } from '../types/poem';
import { GameEvent, LifeChoice, LifeChoiceOption } from '../types/event';
import { PoetData } from '../types/poet';
import { LOCATIONS } from '../data/locations';
import { POET_PACKS, PoetPack } from '../data/poets';
import { loadGameSave, persistGameSave, PlayerSaveRecord } from '../engine/save/db';

export interface GameStoreState {
  currentPoet: PoetData;
  currentDynasty: 'tang' | 'song';
  currentTheme: string;
  currentYear: number;
  currentLocation: LocationData;
  mood: MoodState;
  unlockedPoemIds: string[];
  poemScores: Record<string, number>;
  completedEventIds: string[];
  choicesMade: Record<string, string>;
  activePoemToAssemble: PoemData | null;
  activeEvent: GameEvent | null;
  activeLifeChoice: LifeChoice | null;
  activeCrisis: {
    year: number;
    title: string;
    description: string;
    moodDeltaText: string;
  } | null;
  isCollectionOpen: boolean;
  isLoading: boolean;
}

export function useGameStore() {
  const [currentPoetId, setCurrentPoetId] = useState<string>('li_bai');
  const activePack: PoetPack = POET_PACKS[currentPoetId] || POET_PACKS.li_bai;
  const currentPoet = activePack.poet;

  const [currentDynasty, setCurrentDynasty] = useState<'tang' | 'song'>('tang');
  const [currentTheme, setCurrentTheme] = useState<string>('spring');
  const [currentYear, setCurrentYear] = useState<number>(726);
  const [currentLocation, setCurrentLocation] = useState<LocationData>(LOCATIONS.lu_shan);
  const [mood, setMood] = useState<MoodState>(activePack.poet.initial_mood);
  const [unlockedPoemIds, setUnlockedPoemIds] = useState<string[]>([]);
  const [poemScores, setPoemScores] = useState<Record<string, number>>({});
  const [completedEventIds, setCompletedEventIds] = useState<string[]>([]);
  const [choicesMade, setChoicesMade] = useState<Record<string, string>>({});

  const [activePoemToAssemble, setActivePoemToAssemble] = useState<PoemData | null>(null);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [activeLifeChoice, setActiveLifeChoice] = useState<LifeChoice | null>(null);
  const [activeCrisis, setActiveCrisis] = useState<{
    year: number;
    title: string;
    description: string;
    moodDeltaText: string;
  } | null>(null);

  const [isCollectionOpen, setIsCollectionOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 初始化加载本地 IndexedDB 存档
  useEffect(() => {
    async function initSave() {
      try {
        const save = await loadGameSave(currentPoet.id, currentPoet.initial_mood);
        if (save) {
          setCurrentYear(save.year);
          setCurrentTheme(save.currentTheme || 'spring');
          setMood(save.mood);
          setUnlockedPoemIds(save.unlockedPoemIds);
          setPoemScores(save.poemScores);
          setCompletedEventIds(save.completedEventIds);
          setChoicesMade(save.choicesMade || {});
          if (LOCATIONS[save.locationId]) {
            setCurrentLocation(LOCATIONS[save.locationId]);
          }
          document.documentElement.setAttribute('data-theme', save.currentTheme || 'spring');
        }
      } catch (err) {
        console.warn('Load IndexedDB failed, fallback to memory:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initSave();
  }, [currentPoet.id, currentPoet.initial_mood]);

  // 切换诗人/词人（全系统无缝切换）
  const switchPoet = useCallback((poetId: string) => {
    const pack = POET_PACKS[poetId];
    if (!pack) return;

    setCurrentPoetId(poetId);
    setCurrentDynasty(pack.poet.dynasty);
    const themeToUse = pack.poet.preferred_theme_id || 'spring';
    setCurrentTheme(themeToUse);
    document.documentElement.setAttribute('data-theme', themeToUse);

    setCurrentYear(pack.poet.start_year);
    if (LOCATIONS[pack.poet.start_location_id]) {
      setCurrentLocation(LOCATIONS[pack.poet.start_location_id]);
    }
    setMood(pack.poet.initial_mood);
    setActivePoemToAssemble(null);
    setActiveLifeChoice(null);
    setActiveCrisis(null);
  }, []);

  // 切换主题 (运行时换肤)
  const switchTheme = useCallback(
    (themeId: string) => {
      setCurrentTheme(themeId);
      document.documentElement.setAttribute('data-theme', themeId);
      // 持久化主题
      const saveRecord: PlayerSaveRecord = {
        id: 'main_save',
        poetId: currentPoet.id,
        year: currentYear,
        locationId: currentLocation.id,
        mood,
        unlockedPoemIds,
        poemScores,
        completedEventIds,
        choicesMade,
        currentTheme: themeId,
        updatedAt: Date.now(),
      };
      persistGameSave(saveRecord);
    },
    [currentPoet.id, currentYear, currentLocation.id, mood, unlockedPoemIds, poemScores, completedEventIds, choicesMade]
  );

  // 游历至新地点
  const travelToLocation = useCallback(
    (locationId: string) => {
      const targetLoc = LOCATIONS[locationId];
      if (!targetLoc) return;

      setCurrentLocation(targetLoc);

      // 地点心境影响
      if (targetLoc.mood_on_arrive) {
        setMood((prev) => {
          const nextMood = { ...prev };
          Object.entries(targetLoc.mood_on_arrive || {}).forEach(([k, delta]) => {
            const dim = k as keyof MoodState;
            nextMood[dim] = Math.max(0, Math.min(100, (nextMood[dim] || 50) + (delta || 0)));
          });
          return nextMood;
        });
      }

      // 检查当前诗人当前地点是否有未解锁诗词
      const matchedPoem = activePack.poems.find(
        (p) => p.location_id === locationId && !unlockedPoemIds.includes(p.id)
      );
      if (matchedPoem) {
        setActivePoemToAssemble(matchedPoem);
      }
    },
    [activePack.poems, unlockedPoemIds]
  );

  // 触发人生岔路
  const triggerLifeChoice = useCallback((choiceId: string) => {
    const choice = activePack.choices[choiceId];
    if (choice) {
      setActiveLifeChoice(choice);
    }
  }, [activePack.choices]);

  // 确认人生岔路选择
  const confirmLifeChoice = useCallback(
    (choiceId: string, option: LifeChoiceOption) => {
      setChoicesMade((prev) => ({ ...prev, [choiceId]: option.id }));

      // 应用心境变化
      setMood((prev) => {
        const nextMood = { ...prev };
        Object.entries(option.mood_delta).forEach(([k, delta]) => {
          const dim = k as keyof MoodState;
          nextMood[dim] = Math.max(0, Math.min(100, (nextMood[dim] || 50) + (delta || 0)));
        });
        return nextMood;
      });

      // 持久化
      const saveRecord: PlayerSaveRecord = {
        id: 'main_save',
        poetId: currentPoet.id,
        year: currentYear,
        locationId: currentLocation.id,
        mood,
        unlockedPoemIds,
        poemScores,
        completedEventIds,
        choicesMade: { ...choicesMade, [choiceId]: option.id },
        currentTheme,
        updatedAt: Date.now(),
      };
      persistGameSave(saveRecord);
    },
    [currentPoet.id, currentYear, currentLocation.id, mood, unlockedPoemIds, poemScores, completedEventIds, choicesMade, currentTheme]
  );

  // 时代洪流确认
  const dismissCrisis = useCallback(() => {
    setActiveCrisis(null);
    // 强制巨变情绪
    setMood((prev) => ({
      ...prev,
      anger: Math.min(100, prev.anger + 35),
      homesickness: Math.min(100, prev.homesickness + 40),
      freedom: Math.max(0, prev.freedom - 20),
    }));
  }, []);

  // 完成诗词拼组并解锁
  const completePoemAssembly = useCallback(
    (poemId: string, score: number) => {
      const nextUnlocked = unlockedPoemIds.includes(poemId)
        ? unlockedPoemIds
        : [...unlockedPoemIds, poemId];

      setUnlockedPoemIds(nextUnlocked);
      setPoemScores((prev) => ({ ...prev, [poemId]: score }));

      // 增加灵感与豪情
      setMood((prev) => ({
        ...prev,
        passion: Math.min(100, prev.passion + 10),
        freedom: Math.min(100, prev.freedom + 10),
      }));

      // 持久化到 IndexedDB
      const saveRecord: PlayerSaveRecord = {
        id: 'main_save',
        poetId: currentPoet.id,
        year: currentYear,
        locationId: currentLocation.id,
        mood,
        unlockedPoemIds: nextUnlocked,
        poemScores: { ...poemScores, [poemId]: score },
        completedEventIds,
        choicesMade,
        currentTheme,
        updatedAt: Date.now(),
      };
      persistGameSave(saveRecord);
    },
    [currentPoet.id, currentYear, currentLocation.id, mood, unlockedPoemIds, poemScores, completedEventIds, choicesMade, currentTheme]
  );

  return {
    currentPoet,
    currentPoetId,
    switchPoet,
    currentDynasty,
    setCurrentDynasty,
    currentTheme,
    switchTheme,
    currentYear,
    setCurrentYear,
    currentLocation,
    mood,
    setMood,
    unlockedPoemIds,
    poemScores,
    completedEventIds,
    choicesMade,
    activePoemToAssemble,
    setActivePoemToAssemble,
    activeEvent,
    setActiveEvent,
    activeLifeChoice,
    setActiveLifeChoice,
    triggerLifeChoice,
    confirmLifeChoice,
    activeCrisis,
    setActiveCrisis,
    dismissCrisis,
    isCollectionOpen,
    setIsCollectionOpen,
    isLoading,
    travelToLocation,
    completePoemAssembly,
    activePack,
  };
}
