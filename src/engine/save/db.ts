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

export async function loadGameSave(poetId: string, initialMood: MoodState): Promise<PlayerSaveRecord> {
  const existing = await db.saves.get(DEFAULT_SAVE_ID);
  if (existing) {
    return existing;
  }
  const defaultSave: PlayerSaveRecord = {
    id: DEFAULT_SAVE_ID,
    poetId,
    year: 726,
    locationId: 'lu_shan',
    mood: initialMood,
    unlockedPoemIds: [],
    poemScores: {},
    completedEventIds: [],
    choicesMade: {},
    currentTheme: 'spring',
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
