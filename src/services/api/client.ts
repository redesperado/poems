// src/services/api/client.ts
// 统一前后端通信客户端 (对接 Rust Axum 后端，具备离线无感降级能力)

import { PoetData } from '../../types/poet';
import { LocationData } from '../../types/location';
import { PoemData } from '../../types/poem';
import { ArtifactItem } from '../../types/artifact';
import { PoetEncounterData } from '../../types/encounter';
import {
  UserAccount,
  JourneySaveSlot,
  PoemStudyRecord,
  PoetryNote,
  INITIAL_USER_ACCOUNTS,
  INITIAL_SAVE_SLOTS,
  INITIAL_STUDY_RECORDS,
  INITIAL_POETRY_NOTES,
} from '../../types/userStudio';
import { AVAILABLE_POETS, POET_PACKS } from '../../data/poets';
import { LOCATIONS } from '../../data/locations';
import { HISTORICAL_ENCOUNTERS } from '../../data/encounters';
import { ALL_ARTIFACTS } from '../../data/artifacts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export class PoetryApiClient {
  private baseUrl: string;
  private currentUserId: string = 'user_01';

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setUserId(userId: string) {
    this.currentUserId = userId;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-user-id': this.currentUserId,
    };
  }

  // ---------------------------------------------------------------------------
  // 1. 系统与探针
  // ---------------------------------------------------------------------------
  async checkHealth(): Promise<{ ok: boolean; message: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        return { ok: true, message: data.engine || 'Connected' };
      }
      return { ok: false, message: `HTTP ${res.status}` };
    } catch {
      return { ok: false, message: '离线模式 (使用本地静态数据源)' };
    }
  }

  // ---------------------------------------------------------------------------
  // 2. 文人与游历接口
  // ---------------------------------------------------------------------------
  async getPoets(dynasty?: 'tang' | 'song'): Promise<PoetData[]> {
    try {
      const url = dynasty
        ? `${this.baseUrl}/api/v1/poets?dynasty=${dynasty}`
        : `${this.baseUrl}/api/v1/poets`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Backend API unreachable, falling back to local poets:', e);
    }

    if (dynasty) {
      return AVAILABLE_POETS.filter((p) => p.dynasty === dynasty);
    }
    return AVAILABLE_POETS;
  }

  async getPoetById(id: string): Promise<PoetData | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/poets/${id}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch poet ${id} from API, falling back:`, e);
    }

    return AVAILABLE_POETS.find((p) => p.id === id) || null;
  }

  // ---------------------------------------------------------------------------
  // 3. 名城舆图接口
  // ---------------------------------------------------------------------------
  async getLocations(): Promise<Record<string, LocationData>> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/locations`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && Array.isArray(json.data) && json.data.length > 0) {
          const map: Record<string, LocationData> = {};
          for (const loc of json.data) {
            map[loc.id] = loc;
          }
          return map;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch locations from API, falling back:', e);
    }

    return LOCATIONS;
  }

  // ---------------------------------------------------------------------------
  // 4. 传世名篇题库
  // ---------------------------------------------------------------------------
  async getPoemsByPoet(poetId: string): Promise<PoemData[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/poems?poet_id=${poetId}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch poems for ${poetId} from API, falling back:`, e);
    }

    return POET_PACKS[poetId]?.poems || [];
  }

  // ---------------------------------------------------------------------------
  // 5. 风物与羁绊接口
  // ---------------------------------------------------------------------------
  async getArtifacts(): Promise<ArtifactItem[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/artifacts`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch artifacts from API, falling back:', e);
    }

    return Object.values(ALL_ARTIFACTS);
  }

  async getEncounters(): Promise<Record<string, PoetEncounterData>> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/encounters`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && Array.isArray(json.data) && json.data.length > 0) {
          const map: Record<string, PoetEncounterData> = {};
          for (const enc of json.data) {
            map[enc.id] = enc;
          }
          return map;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch encounters from API, falling back:', e);
    }

    return HISTORICAL_ENCOUNTERS;
  }

  // ---------------------------------------------------------------------------
  // 6. 用户认证与雅士档案
  // ---------------------------------------------------------------------------
  async login(username: string, password?: string): Promise<UserAccount | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, password }),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && json.data?.user) {
          this.currentUserId = json.data.user.id;
          return json.data.user;
        }
      }
    } catch (e) {
      console.warn('Login request failed, using local fallback:', e);
    }

    const matched = INITIAL_USER_ACCOUNTS.find((u) => u.username === username);
    if (matched) {
      this.currentUserId = matched.id;
      return matched;
    }
    return null;
  }

  async register(username: string, penName: string): Promise<UserAccount> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, pen_name: penName }),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && json.data?.user) {
          this.currentUserId = json.data.user.id;
          return json.data.user;
        }
      }
    } catch (e) {
      console.warn('Register request failed, using local fallback:', e);
    }

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      username,
      penName,
      avatarIcon: '📜',
      rankTitle: '童生初入',
      level: 1,
      exp: 100,
      maxExp: 1000,
      stats: {
        travelYears: 1,
        poemsStudied: 0,
        artifactsCollected: 0,
        notesCount: 0,
      },
      createdAt: '今日初入',
    };
    this.currentUserId = newUser.id;
    return newUser;
  }

  async getCurrentUser(): Promise<UserAccount> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/users/me`, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Get current user failed, falling back:', e);
    }

    return (
      INITIAL_USER_ACCOUNTS.find((u) => u.id === this.currentUserId) || INITIAL_USER_ACCOUNTS[0]
    );
  }

  // ---------------------------------------------------------------------------
  // 7. 多槽位游历存档
  // ---------------------------------------------------------------------------
  async getSaves(): Promise<JourneySaveSlot[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/saves`, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && Array.isArray(json.data) && json.data.length > 0) {
          return json.data.map((item: any) => ({
            id: item.id,
            slotName: item.slot_name,
            poetId: item.poet_id,
            poetName: item.poet_id === 'li_bai' ? '李白' : item.poet_id === 'su_shi' ? '苏轼' : '杜甫',
            currentYear: item.current_year,
            locationName: item.current_location_id,
            moodOverview: `心境 ${item.mood?.passion || 80}`,
            unlockedPoemsCount: Array.isArray(item.unlocked_poem_ids) ? item.unlocked_poem_ids.length : 0,
            totalPoemsCount: 4,
            artifactsCount: Array.isArray(item.unlocked_artifact_ids) ? item.unlocked_artifact_ids.length : 0,
            updatedAtText: '刚刚同步',
            isActive: item.is_active,
            journeyLogs: item.journey_logs || [],
          }));
        }
      }
    } catch (e) {
      console.warn('Fetch saves failed, falling back to local slots:', e);
    }

    return INITIAL_SAVE_SLOTS;
  }

  async saveSlot(data: {
    slotIndex: number;
    slotName: string;
    poetId: string;
    currentYear: number;
    currentLocationId: string;
    mood: any;
    unlockedPoemIds?: string[];
    poemScores?: Record<string, number>;
    unlockedArtifactIds?: string[];
    unlockedBondIds?: string[];
    completedEventIds?: string[];
    choicesMade?: Record<string, string>;
    journeyLogs?: any[];
  }): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/saves`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          slot_index: data.slotIndex,
          slot_name: data.slotName,
          poet_id: data.poetId,
          current_year: data.currentYear,
          current_location_id: data.currentLocationId,
          mood: data.mood,
          unlocked_poem_ids: data.unlockedPoemIds || [],
          poem_scores: data.poemScores || {},
          unlocked_artifact_ids: data.unlockedArtifactIds || [],
          unlocked_bond_ids: data.unlockedBondIds || [],
          completed_event_ids: data.completedEventIds || [],
          choices_made: data.choicesMade || {},
          journey_logs: data.journeyLogs || [],
          is_active: true,
        }),
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch (e) {
      console.warn('Save slot to API failed:', e);
      return false;
    }
  }

  async deleteSave(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/saves/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch (e) {
      console.warn(`Delete save ${id} failed:`, e);
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // 8. 研学推敲答卷与错题集
  // ---------------------------------------------------------------------------
  async getStudyRecords(): Promise<PoemStudyRecord[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/records`, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && Array.isArray(json.data) && json.data.length > 0) {
          return json.data.map((item: any) => ({
            id: item.id,
            poemId: item.poem_id,
            poemTitle: item.extra_data?.poemTitle || item.poem_id,
            poetName: item.extra_data?.poetName || '文人',
            dynasty: 'tang',
            score: item.score,
            grade: item.grade,
            durationSeconds: item.duration_seconds,
            completedAtText: item.extra_data?.completedAtText || '最近',
            mistakes: item.mistakes || [],
          }));
        }
      }
    } catch (e) {
      console.warn('Fetch study records failed, falling back:', e);
    }

    return INITIAL_STUDY_RECORDS;
  }

  async submitStudyRecord(data: {
    poemId: string;
    score: number;
    grade: string;
    durationSeconds: number;
    mistakes: any[];
    extraData?: any;
  }): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/records`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          poem_id: data.poemId,
          score: data.score,
          grade: data.grade,
          duration_seconds: data.durationSeconds,
          mistakes: data.mistakes,
          extra_data: data.extraData,
        }),
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch (e) {
      console.warn('Submit study record failed:', e);
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // 9. 文心墨札笔记
  // ---------------------------------------------------------------------------
  async getNotes(): Promise<PoetryNote[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/notes`, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && Array.isArray(json.data) && json.data.length > 0) {
          return json.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            tags: item.tags || [],
            poemTitle: item.metadata?.poemTitle,
            poetName: item.metadata?.poetName,
            locationName: item.metadata?.locationName,
            createdAtText: item.metadata?.createdAtText || '最近',
          }));
        }
      }
    } catch (e) {
      console.warn('Fetch notes failed, falling back:', e);
    }

    return INITIAL_POETRY_NOTES;
  }

  async createNote(data: {
    title: string;
    content: string;
    tags: string[];
    poemTitle?: string;
    poetName?: string;
    locationName?: string;
  }): Promise<PoetryNote> {
    const localNote: PoetryNote = {
      id: `note_${Date.now()}`,
      title: data.title,
      content: data.content,
      tags: data.tags,
      poemTitle: data.poemTitle,
      poetName: data.poetName,
      locationName: data.locationName,
      createdAtText: '刚刚',
    };

    try {
      const res = await fetch(`${this.baseUrl}/api/v1/notes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          tags: data.tags,
          metadata: {
            poemTitle: data.poemTitle,
            poetName: data.poetName,
            locationName: data.locationName,
            createdAtText: '刚刚',
          },
        }),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && json.data) {
          return {
            id: json.data.id,
            title: json.data.title,
            content: json.data.content,
            tags: json.data.tags || [],
            poemTitle: data.poemTitle,
            poetName: data.poetName,
            locationName: data.locationName,
            createdAtText: '刚刚',
          };
        }
      }
    } catch (e) {
      console.warn('Create note API failed, stored locally:', e);
    }

    return localNote;
  }

  async deleteNote(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/notes/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch (e) {
      console.warn(`Delete note ${id} failed:`, e);
      return false;
    }
  }
}

export const apiClient = new PoetryApiClient();
