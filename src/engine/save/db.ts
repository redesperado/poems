import Dexie, { Table } from 'dexie';
import { MoodState } from '../../types/mood';

export interface PlayerSaveRecord {
  id: string; // 'current_save'
  poetId: string;
  year: number;
  locationId: string;
  mood: MoodState;
  unlockedPoemIds: string[];
  poemScores: Record<string, number>; // poemId -> score (100 | 75 | 50)
  completedEventIds: string[];
  choicesMade: Record<string, string>; // choiceId -> optionId
  currentTheme: string;
  unlockedBondIds?: string[]; // 已解锁的千古羁绊印章 ID 列表
  updatedAt: number;
}

export class PoetryGameDatabase extends Dexie {
  saves!: Table<PlayerSaveRecord, string>;

  constructor() {
    super('TangSongPoetryGameDB');
    this.version(1).stores({
      saves: 'id, poetId, year, updatedAt',
    });
  }
}

export const db = new PoetryGameDatabase();

// 默认初始存档
export const DEFAULT_SAVE_ID = 'main_save';

export async function loadGameSave(
  poetId: string,
  initialMood: MoodState,
  startYear: number = 726,
  startLocationId: string = 'lu_shan',
  preferredTheme: string = 'spring'
): Promise<PlayerSaveRecord> {
  const saveId = `save_${poetId}`;
  const existing = await db.saves.get(saveId);
  if (existing) {
    return existing;
  }
  const defaultSave: PlayerSaveRecord = {
    id: saveId,
    poetId,
    year: startYear,
    locationId: startLocationId,
    mood: initialMood,
    unlockedPoemIds: [],
    poemScores: {},
    completedEventIds: [],
    choicesMade: {},
    currentTheme: preferredTheme,
    unlockedBondIds: [],
    updatedAt: Date.now(),
  };
  await db.saves.put(defaultSave);
  return defaultSave;
}

export async function persistGameSave(save: PlayerSaveRecord): Promise<void> {
  await db.saves.put({
    ...save,
    updatedAt: Date.now(),
  });
}
