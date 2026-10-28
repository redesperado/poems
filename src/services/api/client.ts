// src/services/api/client.ts
// 统一前后端通信客户端 (支持对接 Rust Axum 后端，具备离线无感降级能力)

import { PoetData } from '../../types/poet';
import { LocationData } from '../../types/location';
import { PoemData } from '../../types/poem';
import { AVAILABLE_POETS, POET_PACKS } from '../../data/poets';
import { LOCATIONS } from '../../data/locations';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export class PoetryApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // 健康探针
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

  // 获取文人列表 (支持朝代筛选)
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
      console.warn('Backend API unreachable, falling back to local dataset:', e);
    }

    // 优雅降级：读取本地内置数据
    if (dynasty) {
      return AVAILABLE_POETS.filter((p) => p.dynasty === dynasty);
    }
    return AVAILABLE_POETS;
  }

  // 获取单文人详情
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

  // 获取全量名城舆图
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

  // 获取某文人的传世名篇列表
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
}

export const apiClient = new PoetryApiClient();
