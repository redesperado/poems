import { useState, useEffect, useCallback } from 'react';
import { MoodState } from '../types/mood';
import { LocationData } from '../types/location';
import { PoemData } from '../types/poem';
import { GameEvent, LifeChoice, LifeChoiceOption, PoetRetrospectiveData } from '../types/event';
import { PoetData } from '../types/poet';
import { PoetEncounterData } from '../types/encounter';
import { HISTORICAL_ENCOUNTERS } from '../data/encounters';
import { LOCATIONS } from '../data/locations';
import { POET_PACKS, PoetPack } from '../data/poets';
import { loadGameSave, persistGameSave, PlayerSaveRecord } from '../engine/save/db';
import { ALL_ARTIFACTS, getCityArtifact, getPoetExclusiveArtifacts } from '../data/artifacts';
import { ArtifactItem } from '../types/artifact';
import { soundEngine } from '../engine/audio/soundEngine';
import { apiClient } from '../services/api/client';

export interface ActiveCrisisState {
  year: number;
  title: string;
  description: string;
  historicalEventName?: string;
  historicalBackground?: string;
  poetImpact?: string;
  moodDeltaText: string;
  eventId?: string;
}

export interface GameStoreState {
  currentPoet: PoetData;
  currentPoetId: string;
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
  activeCrisis: ActiveCrisisState | null;
  activeRetrospective: PoetRetrospectiveData | null;
  isCollectionOpen: boolean;
  isLoading: boolean;
}

export function useGameStore() {
  const [currentPoetId, setCurrentPoetId] = useState<string>('li_bai');
  const activePack: PoetPack = POET_PACKS[currentPoetId] || POET_PACKS.li_bai;
  const currentPoet = activePack.poet;

  const [currentDynasty, setCurrentDynasty] = useState<'tang' | 'song'>('tang');
  const [currentTheme, setCurrentTheme] = useState<string>('spring');
  const [currentYear, setCurrentYear] = useState<number>(currentPoet.start_year || 701);
  const [currentLocation, setCurrentLocation] = useState<LocationData>(
    LOCATIONS[currentPoet.start_location_id] || LOCATIONS.sichuan
  );
  const [mood, setMood] = useState<MoodState>(activePack.poet.initial_mood);
  const [unlockedPoemIds, setUnlockedPoemIds] = useState<string[]>([]);
  const [poemScores, setPoemScores] = useState<Record<string, number>>({});
  const [completedEventIds, setCompletedEventIds] = useState<string[]>([]);
  const [choicesMade, setChoicesMade] = useState<Record<string, string>>({});
  const [unlockedBondIds, setUnlockedBondIds] = useState<string[]>([]);
  const [unlockedArtifactIds, setUnlockedArtifactIds] = useState<string[]>([]);

  const [activePoemToAssemble, setActivePoemToAssemble] = useState<PoemData | null>(null);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [activeLifeChoice, setActiveLifeChoice] = useState<LifeChoice | null>(null);
  const [activeCrisis, setActiveCrisis] = useState<ActiveCrisisState | null>(null);
  const [activeRetrospective, setActiveRetrospective] = useState<PoetRetrospectiveData | null>(null);
  const [activeEncounter, setActiveEncounter] = useState<PoetEncounterData | null>(null);

  const [isCollectionOpen, setIsCollectionOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 初始化加载本地 IndexedDB 存档
  useEffect(() => {
    async function initSave() {
      try {
        const save = await loadGameSave(
          currentPoet.id,
          currentPoet.initial_mood,
          currentPoet.start_year || 701,
          currentPoet.start_location_id || 'sichuan',
          currentPoet.preferred_theme_id || 'spring'
        );
        if (save) {
          setCurrentYear(save.year);
          setCurrentTheme(save.currentTheme || 'spring');
          setMood(save.mood);
          setUnlockedPoemIds(save.unlockedPoemIds);
          setPoemScores(save.poemScores);
          setCompletedEventIds(save.completedEventIds || []);
          setChoicesMade(save.choicesMade || {});
          setUnlockedBondIds(save.unlockedBondIds || []);
          // 初始化文人随身本命信物与已收集风物
          const poetHeirlooms = getPoetExclusiveArtifacts(currentPoet.id).map((a) => a.id);
          const initialHeirloom = poetHeirlooms.length > 0 ? [poetHeirlooms[0]] : [];
          const savedArtifacts = save.unlockedArtifactIds || [];
          const mergedArtifacts = Array.from(new Set([...initialHeirloom, ...savedArtifacts]));
          setUnlockedArtifactIds(mergedArtifacts);

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
  }, [currentPoet.id, currentPoet.initial_mood, currentPoet.start_year, currentPoet.start_location_id, currentPoet.preferred_theme_id]);

  // 切换诗人/词人（全系统无缝切换）
  const switchPoet = useCallback((poetId: string) => {
    const pack = POET_PACKS[poetId];
    if (!pack) return;

    setCurrentPoetId(poetId);
    setCurrentDynasty(pack.poet.dynasty);
    const themeToUse = pack.poet.preferred_theme_id || 'spring';
    setCurrentTheme(themeToUse);
    document.documentElement.setAttribute('data-theme', themeToUse);

    const startYear = pack.poet.start_year || 701;
    setCurrentYear(startYear);
    if (LOCATIONS[pack.poet.start_location_id]) {
      setCurrentLocation(LOCATIONS[pack.poet.start_location_id]);
    }
    setMood(pack.poet.initial_mood);
    setCompletedEventIds([]);
    setActivePoemToAssemble(null);
    setActiveLifeChoice(null);
    setActiveCrisis(null);

    // 载入新文人本命信物
    const poetHeirlooms = getPoetExclusiveArtifacts(poetId).map((a) => a.id);
    const initialHeirloom = poetHeirlooms.length > 0 ? [poetHeirlooms[0]] : [];
    setUnlockedArtifactIds((prev) => Array.from(new Set([...prev, ...initialHeirloom])));
  }, []);

  // 切换主题 (运行时换肤)
  const switchTheme = useCallback(
    (themeId: string) => {
      setCurrentTheme(themeId);
      document.documentElement.setAttribute('data-theme', themeId);
      // 持久化主题
      const saveRecord: PlayerSaveRecord = {
        id: `save_${currentPoet.id}`,
        poetId: currentPoet.id,
        year: currentYear,
        locationId: currentLocation.id,
        mood,
        unlockedPoemIds,
        poemScores,
        completedEventIds,
        choicesMade,
        currentTheme: themeId,
        unlockedBondIds,
        unlockedArtifactIds,
        updatedAt: Date.now(),
      };
      persistGameSave(saveRecord);
    },
    [currentPoet.id, currentYear, currentLocation.id, mood, unlockedPoemIds, poemScores, completedEventIds, choicesMade, unlockedBondIds, unlockedArtifactIds]
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

  // 触发朝代危机事件
  const triggerCrisisForEvent = useCallback((event: GameEvent) => {
    if (event.triggers_crisis) {
      setActiveCrisis({
        year: event.triggers_crisis.year,
        title: event.triggers_crisis.title,
        description: event.description,
        historicalEventName: event.triggers_crisis.historical_event_name,
        historicalBackground: event.triggers_crisis.historical_background,
        poetImpact: event.triggers_crisis.poet_impact,
        moodDeltaText: event.triggers_crisis.mood_delta_desc,
        eventId: event.id,
      });
    } else {
      setActiveCrisis({
        year: event.year,
        title: event.title,
        description: event.description,
        moodDeltaText: '山河震荡 · 时代剧变',
        eventId: event.id,
      });
    }
  }, []);

  // 顺序亲历并完成人生事件（不可跳过原则）
  const completeEvent = useCallback(
    (eventId: string) => {
      setCompletedEventIds((prev) => {
        if (prev.includes(eventId)) return prev;
        const nextCompleted = [...prev, eventId];

        // 寻找下一个事件
        const currentIdx = activePack.events.findIndex((e) => e.id === eventId);
        const nextEvent = activePack.events[currentIdx + 1];

        let nextYear = currentYear;
        let nextLoc = currentLocation;

        if (nextEvent) {
          nextYear = nextEvent.year;
          setCurrentYear(nextEvent.year);
          if (LOCATIONS[nextEvent.location_id]) {
            nextLoc = LOCATIONS[nextEvent.location_id];
            setCurrentLocation(nextLoc);
          }
          // 如果下一个事件是朝代大事（如安史之乱）
          if (nextEvent.triggers_crisis) {
            setActiveCrisis({
              year: nextEvent.triggers_crisis.year,
              title: nextEvent.triggers_crisis.title,
              description: nextEvent.description,
              historicalEventName: nextEvent.triggers_crisis.historical_event_name,
              historicalBackground: nextEvent.triggers_crisis.historical_background,
              poetImpact: nextEvent.triggers_crisis.poet_impact,
              moodDeltaText: nextEvent.triggers_crisis.mood_delta_desc,
              eventId: nextEvent.id,
            });
          }
          // 如果下一个事件是诗人故去生平总评
          if (nextEvent.triggers_retrospective) {
            setActiveRetrospective(nextEvent.triggers_retrospective);
          }
          // 如果下一个事件是千古文人相遇羁绊
          if (nextEvent.triggers_encounter_id) {
            const enc = HISTORICAL_ENCOUNTERS[nextEvent.triggers_encounter_id];
            if (enc) {
              setActiveEncounter(enc);
            }
          }
        }

        // 持久化到 IndexedDB
        persistGameSave({
          id: `save_${currentPoet.id}`,
          poetId: currentPoet.id,
          year: nextYear,
          locationId: nextLoc.id,
          mood,
          unlockedPoemIds,
          poemScores,
          completedEventIds: nextCompleted,
          choicesMade,
          currentTheme,
          unlockedBondIds,
          unlockedArtifactIds,
          updatedAt: Date.now(),
        });

        return nextCompleted;
      });
    },
    [activePack.events, currentPoet.id, currentYear, currentLocation, mood, unlockedPoemIds, poemScores, choicesMade, currentTheme, unlockedBondIds, unlockedArtifactIds]
  );

  // 触发人生岔路
  const triggerLifeChoice = useCallback(
    (choiceId: string) => {
      const choice = activePack.choices[choiceId];
      if (choice) {
        setActiveLifeChoice(choice);
      }
    },
    [activePack.choices]
  );

  // 确认人生岔路选择
  const confirmLifeChoice = useCallback(
    (choiceId: string, option: LifeChoiceOption) => {
      setChoicesMade((prev) => ({ ...prev, [choiceId]: option.id }));

      // 应用心境变化
      const updatedMood = { ...mood };
      Object.entries(option.mood_delta).forEach(([k, delta]) => {
        const dim = k as keyof MoodState;
        updatedMood[dim] = Math.max(0, Math.min(100, (updatedMood[dim] || 50) + (delta || 0)));
      });
      setMood(updatedMood);

      // 自动完成对应事件
      const choice = activePack.choices[choiceId];
      if (choice && choice.event_id) {
        completeEvent(choice.event_id);
      }
    },
    [activePack.choices, completeEvent, mood]
  );

  // 时代洪流确认
  const dismissCrisis = useCallback(() => {
    const crisisEventId = activeCrisis?.eventId;
    setActiveCrisis(null);

    // 强制巨变情绪：安史之乱使人愤懑与羁旅暴涨，洒脱受制
    const updatedMood = {
      ...mood,
      anger: Math.min(100, mood.anger + 35),
      homesickness: Math.min(100, mood.homesickness + 40),
      freedom: Math.max(0, mood.freedom - 25),
    };
    setMood(updatedMood);

    // 若危机绑定了事件，将其标记为完成并推进至下一历程
    if (crisisEventId) {
      completeEvent(crisisEventId);
    }
  }, [activeCrisis, mood, completeEvent]);

  // 完成诗词拼组并解锁
  const completePoemAssembly = useCallback(
    (poemId: string, score: number) => {
      const nextUnlocked = unlockedPoemIds.includes(poemId)
        ? unlockedPoemIds
        : [...unlockedPoemIds, poemId];

      setUnlockedPoemIds(nextUnlocked);
      setPoemScores((prev) => ({ ...prev, [poemId]: score }));

      // 增加灵感与豪情
      const nextMood: MoodState = {
        ...mood,
        passion: Math.min(100, mood.passion + 10),
        freedom: Math.min(100, mood.freedom + 10),
      };
      setMood(nextMood);

      // 检查是否有与该诗关联的当前未完成事件，并顺畅推进历程
      const matchedEvent = activePack.events.find(
        (e) => e.triggers_poem_id === poemId
      );

      let nextCompleted = completedEventIds;
      let nextYear = currentYear;
      let nextLoc = currentLocation;

      if (matchedEvent && !completedEventIds.includes(matchedEvent.id)) {
        nextCompleted = [...completedEventIds, matchedEvent.id];
        setCompletedEventIds(nextCompleted);

        const currentIdx = activePack.events.findIndex((e) => e.id === matchedEvent.id);
        const nextEvent = activePack.events[currentIdx + 1];
        if (nextEvent) {
          nextYear = nextEvent.year;
          setCurrentYear(nextEvent.year);
          if (LOCATIONS[nextEvent.location_id]) {
            nextLoc = LOCATIONS[nextEvent.location_id];
            setCurrentLocation(nextLoc);
          }
          if (nextEvent.triggers_crisis) {
            setActiveCrisis({
              year: nextEvent.triggers_crisis.year,
              title: nextEvent.triggers_crisis.title,
              description: nextEvent.description,
              historicalEventName: nextEvent.triggers_crisis.historical_event_name,
              historicalBackground: nextEvent.triggers_crisis.historical_background,
              poetImpact: nextEvent.triggers_crisis.poet_impact,
              moodDeltaText: nextEvent.triggers_crisis.mood_delta_desc,
              eventId: nextEvent.id,
            });
          }
          if (nextEvent.triggers_retrospective) {
            setActiveRetrospective(nextEvent.triggers_retrospective);
          }
          if (nextEvent.triggers_encounter_id) {
            const enc = HISTORICAL_ENCOUNTERS[nextEvent.triggers_encounter_id];
            if (enc) {
              setActiveEncounter(enc);
            }
          }
        }
      }

      // 妙品甲等诗词通感风物掉落 (TODO-ART-03)
      let nextArtifacts = [...unlockedArtifactIds];
      if (score === 100) {
        const POEM_ARTIFACT_DROPS: Record<string, string> = {
          poem_lb_02: 'artifact_jiange_tongling', // 《蜀道难》 -> 蜀道铜铃
          poem_lb_05: 'artifact_jinling_chunjiu', // 《将进酒》 -> 金陵春酒
          poem_dufu_01: 'artifact_qizhao_gong', // 《望岳》 -> 齐赵良弓
          poem_dufu_03: 'artifact_caotang_li', // 《茅屋》 -> 草堂笠
          poem_su_01: 'artifact_dongpo_liji', // 《定风波》 -> 东坡笠屐
          poem_su_02: 'artifact_weirou_shidan', // 《水调歌头》 -> 黄州煨肉法帖
          poem_lqz_01: 'artifact_shuyu_guqin', // 《如梦令》 -> 漱玉泉古琴
          poem_lqz_03: 'artifact_zemeng_mudiao', // 《声声慢》 -> 双溪舴艋舟
        };
        const dropId = POEM_ARTIFACT_DROPS[poemId];
        if (dropId && !nextArtifacts.includes(dropId)) {
          nextArtifacts.push(dropId);
          setUnlockedArtifactIds(nextArtifacts);
        }
      }

      // 持久化到 IndexedDB
      persistGameSave({
        id: `save_${currentPoet.id}`,
        poetId: currentPoet.id,
        year: nextYear,
        locationId: nextLoc.id,
        mood: nextMood,
        unlockedPoemIds: nextUnlocked,
        poemScores: { ...poemScores, [poemId]: score },
        completedEventIds: nextCompleted,
        choicesMade,
        currentTheme,
        unlockedBondIds,
        unlockedArtifactIds: nextArtifacts,
        updatedAt: Date.now(),
      });

      // 异步同步到后端 PostgreSQL 数据库 (支持离线降级)
      apiClient.submitStudyRecord({
        poemId,
        score,
        grade: score >= 90 ? '甲等·妙品' : score >= 70 ? '乙等·通达' : '丙等·尚可',
        durationSeconds: 45,
        mistakes: [],
        extraData: { poetName: currentPoet.name_cn, completedAtText: `${currentYear}年 · ${nextLoc.name_cn}` },
      });

      apiClient.saveSlot({
        slotIndex: 1,
        slotName: `【当朝】${currentPoet.name_cn}山河游历`,
        poetId: currentPoet.id,
        currentYear: nextYear,
        currentLocationId: nextLoc.id,
        mood: nextMood,
        unlockedPoemIds: nextUnlocked,
        poemScores: { ...poemScores, [poemId]: score },
        completedEventIds: nextCompleted,
        choicesMade,
        unlockedBondIds,
        unlockedArtifactIds: nextArtifacts,
      });
    },
    [unlockedPoemIds, mood, activePack.events, completedEventIds, currentYear, currentLocation, currentPoet.id, currentPoet.name_cn, poemScores, choicesMade, currentTheme, unlockedBondIds, unlockedArtifactIds]
  );

  // 触发终极生平总评
  const triggerRetrospectiveForEvent = useCallback((event: GameEvent) => {
    if (event.triggers_retrospective) {
      setActiveRetrospective(event.triggers_retrospective);
    }
  }, []);

  // 触发千古相遇
  const triggerEncounter = useCallback((encounterId: string) => {
    const enc = HISTORICAL_ENCOUNTERS[encounterId];
    if (enc) {
      setActiveEncounter(enc);
    }
  }, []);

  // 确认并缔结千古相遇羁绊
  const confirmEncounter = useCallback(
    (encounter: PoetEncounterData) => {
      const nextBonds = unlockedBondIds.includes(encounter.bondSeal.id)
        ? unlockedBondIds
        : [...unlockedBondIds, encounter.bondSeal.id];
      setUnlockedBondIds(nextBonds);

      // 增益心境
      const updatedMood = { ...mood };
      Object.entries(encounter.moodDelta).forEach(([k, delta]) => {
        const dim = k as keyof MoodState;
        if (updatedMood[dim] !== undefined) {
          updatedMood[dim] = Math.max(0, Math.min(100, updatedMood[dim] + delta));
        }
      });
      setMood(updatedMood);

      setActiveEncounter(null);

      // 持久化到 IndexedDB
      persistGameSave({
        id: `save_${currentPoet.id}`,
        poetId: currentPoet.id,
        year: currentYear,
        locationId: currentLocation.id,
        mood: updatedMood,
        unlockedPoemIds,
        poemScores,
        completedEventIds,
        choicesMade,
        currentTheme,
        unlockedBondIds: nextBonds,
        unlockedArtifactIds,
        updatedAt: Date.now(),
      });
    },
    [unlockedBondIds, mood, currentPoet.id, currentYear, currentLocation.id, unlockedPoemIds, poemScores, completedEventIds, choicesMade, currentTheme, unlockedArtifactIds]
  );

  // 重走诗仙长卷
  const resetPoetJourney = useCallback(() => {
    setCompletedEventIds([]);
    const startYear = currentPoet.start_year || 701;
    setCurrentYear(startYear);
    if (LOCATIONS[currentPoet.start_location_id]) {
      setCurrentLocation(LOCATIONS[currentPoet.start_location_id]);
    }
    setMood(currentPoet.initial_mood);
    setActiveRetrospective(null);
    setActiveCrisis(null);
    setActivePoemToAssemble(null);
    setActiveLifeChoice(null);
    setActiveEncounter(null);

    persistGameSave({
      id: `save_${currentPoet.id}`,
      poetId: currentPoet.id,
      year: startYear,
      locationId: currentPoet.start_location_id || 'sichuan',
      mood: currentPoet.initial_mood,
      unlockedPoemIds,
      poemScores,
      completedEventIds: [],
      choicesMade: {},
      currentTheme,
      unlockedBondIds,
      unlockedArtifactIds,
      updatedAt: Date.now(),
    });
  }, [currentPoet, unlockedPoemIds, poemScores, currentTheme, unlockedBondIds, unlockedArtifactIds]);

  // 纳藏山河风物与文人本命信物 (TODO-ART-01 ~ 03)
  const unlockArtifact = useCallback(
    (artifactId: string) => {
      const art = ALL_ARTIFACTS[artifactId];
      if (!art) return;
      if (unlockedArtifactIds.includes(artifactId)) return;

      const nextArtifacts = [...unlockedArtifactIds, artifactId];
      setUnlockedArtifactIds(nextArtifacts);

      // 施加心境通感加成
      let updatedMood = { ...mood };
      if (art.moodBonus) {
        Object.entries(art.moodBonus).forEach(([k, delta]) => {
          const dim = k as keyof MoodState;
          if (updatedMood[dim] !== undefined && typeof delta === 'number') {
            updatedMood[dim] = Math.max(0, Math.min(100, updatedMood[dim] + delta));
          }
        });
        setMood(updatedMood);
      }

      soundEngine.playJadeChime();

      persistGameSave({
        id: `save_${currentPoet.id}`,
        poetId: currentPoet.id,
        year: currentYear,
        locationId: currentLocation.id,
        mood: updatedMood,
        unlockedPoemIds,
        poemScores,
        completedEventIds,
        choicesMade,
        currentTheme,
        unlockedBondIds,
        unlockedArtifactIds: nextArtifacts,
        updatedAt: Date.now(),
      });

      apiClient.saveSlot({
        slotIndex: 1,
        slotName: `【当朝】${currentPoet.name_cn}山河游历`,
        poetId: currentPoet.id,
        currentYear: currentYear,
        currentLocationId: currentLocation.id,
        mood: updatedMood,
        unlockedPoemIds,
        poemScores,
        completedEventIds,
        choicesMade,
        unlockedBondIds,
        unlockedArtifactIds: nextArtifacts,
      });
    },
    [unlockedArtifactIds, mood, currentPoet.id, currentYear, currentLocation.id, unlockedPoemIds, poemScores, completedEventIds, choicesMade, currentTheme, unlockedBondIds]
  );

  // 采撷当前城市特产风物
  const collectCityArtifact = useCallback(
    (cityId: string): ArtifactItem | null => {
      const art = getCityArtifact(cityId);
      if (art && !unlockedArtifactIds.includes(art.id)) {
        unlockArtifact(art.id);
        return art;
      }
      return null;
    },
    [unlockedArtifactIds, unlockArtifact]
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
    unlockedBondIds,
    unlockedArtifactIds,
    unlockArtifact,
    collectCityArtifact,
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
    triggerCrisisForEvent,
    dismissCrisis,
    activeRetrospective,
    setActiveRetrospective,
    triggerRetrospectiveForEvent,
    activeEncounter,
    setActiveEncounter,
    triggerEncounter,
    confirmEncounter,
    resetPoetJourney,
    completeEvent,
    isCollectionOpen,
    setIsCollectionOpen,
    isLoading,
    travelToLocation,
    completePoemAssembly,
    activePack,
  };
}
