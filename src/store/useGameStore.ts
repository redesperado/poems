import { useState, useEffect, useCallback } from 'react';
import { MoodState } from '../types/mood';
import { LocationData } from '../types/location';
import { PoemData } from '../types/poem';
import { GameEvent } from '../types/event';
import { PoetData } from '../types/poet';
import { LOCATIONS } from '../data/locations';
import { LI_BAI, LI_BAI_POEMS } from '../data/poets/li_bai';
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
  activePoemToAssemble: PoemData | null;
  activeEvent: GameEvent | null;
  isCollectionOpen: boolean;
  isLoading: boolean;
}

export function useGameStore() {
  const [currentPoet] = useState<PoetData>(LI_BAI);
  const [currentDynasty, setCurrentDynasty] = useState<'tang' | 'song'>('tang');
  const [currentTheme, setCurrentTheme] = useState<string>('spring');
  const [currentYear, setCurrentYear] = useState<number>(726);
  const [currentLocation, setCurrentLocation] = useState<LocationData>(LOCATIONS.lu_shan);
  const [mood, setMood] = useState<MoodState>(LI_BAI.initial_mood);
  const [unlockedPoemIds, setUnlockedPoemIds] = useState<string[]>([]);
  const [poemScores, setPoemScores] = useState<Record<string, number>>({});
  const [completedEventIds, setCompletedEventIds] = useState<string[]>([]);
  const [activePoemToAssemble, setActivePoemToAssemble] = useState<PoemData | null>(null);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [isCollectionOpen, setIsCollectionOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 初始化加载本地 IndexedDB 存档
  useEffect(() => {
    async function initSave() {
      try {
        const save = await loadGameSave(LI_BAI.id, LI_BAI.initial_mood);
        if (save) {
          setCurrentYear(save.year);
          setCurrentTheme(save.currentTheme || 'spring');
          setMood(save.mood);
          setUnlockedPoemIds(save.unlockedPoemIds);
          setPoemScores(save.poemScores);
          setCompletedEventIds(save.completedEventIds);
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
        choicesMade: {},
        currentTheme: themeId,
        updatedAt: Date.now(),
      };
      persistGameSave(saveRecord);
    },
    [currentPoet.id, currentYear, currentLocation.id, mood, unlockedPoemIds, poemScores, completedEventIds]
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

      // 检查当前地点是否有可触发的诗词
      const matchedPoem = LI_BAI_POEMS.find(
        (p) => p.location_id === locationId && !unlockedPoemIds.includes(p.id)
      );
      if (matchedPoem) {
        setActivePoemToAssemble(matchedPoem);
      }
    },
    [unlockedPoemIds]
  );

  // 完成诗词拼组并解锁
  const completePoemAssembly = useCallback(
    (poemId: string, score: number) => {
      setUnlockedPoemIds((prev) => (prev.includes(poemId) ? prev : [...prev, poemId]));
      setPoemScores((prev) => ({ ...prev, [poemId]: score }));

      // 增加灵感与豪情
      setMood((prev) => ({
        ...prev,
        passion: Math.min(100, prev.passion + 10),
        freedom: Math.min(100, prev.freedom + 10),
      }));

      // 持久化到 IndexedDB
      const nextUnlocked = unlockedPoemIds.includes(poemId)
        ? unlockedPoemIds
        : [...unlockedPoemIds, poemId];
      const saveRecord: PlayerSaveRecord = {
        id: 'main_save',
        poetId: currentPoet.id,
        year: currentYear,
        locationId: currentLocation.id,
        mood,
        unlockedPoemIds: nextUnlocked,
        poemScores: { ...poemScores, [poemId]: score },
        completedEventIds,
        choicesMade: {},
        currentTheme,
        updatedAt: Date.now(),
      };
      persistGameSave(saveRecord);
    },
    [currentPoet.id, currentYear, currentLocation.id, mood, unlockedPoemIds, poemScores, completedEventIds, currentTheme]
  );

  return {
    currentPoet,
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
    activePoemToAssemble,
    setActivePoemToAssemble,
    activeEvent,
    setActiveEvent,
    isCollectionOpen,
    setIsCollectionOpen,
    isLoading,
    travelToLocation,
    completePoemAssembly,
  };
}
