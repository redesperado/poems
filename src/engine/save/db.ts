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
  unlockedArtifactIds?: string[]; // 已纳藏的山河风物与器物 ID 列表
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
    unlockedArtifactIds: [],
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

// 导出全量离线存档为 JSON 文本 (TODO-POL-05)
export async function exportAllSavesJSON(): Promise<string> {
  const allSaves = await db.saves.toArray();
  return JSON.stringify(
    {
      app: 'tang-song-poetry-game',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      saves: allSaves,
    },
    null,
    2
  );
}

// 导入外部 JSON 存档数据并持久化恢复 (TODO-POL-05)
export async function importSavesJSON(jsonStr: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonStr);
    if (data && Array.isArray(data.saves)) {
      await db.saves.bulkPut(data.saves);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to import saves:', err);
    return false;
  }
}
