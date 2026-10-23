import { MoodState } from './mood';

export interface PoemLine {
  text: string;
  blank_index: number | null; // 缺字索引，null 表示整句完整无需填空
  correct: string | null;
  options: string[] | null;   // 4 个选项 (A, B, C, D)
  wrong_explanations: Record<string, string> | null; // 错误选项的深度文学赏析
}

export interface PoemTriggerCondition {
  location_id: string;
  mood: Partial<{
    [K in keyof MoodState]: { min?: number; max?: number };
  }>;
  year_range?: [number, number];
  requires_event?: string;
}

export interface PoemData {
  id: string;
  title: string;
  poet_id: string;
  dynasty: string;
  form: 'shi' | 'ci'; // 诗 (五言/七言等) 或 词 (词牌名长短句)
  cipai?: string;     // 若为词，注明词牌 (如《水调歌头》)
  year: number;
  location_id: string;
  trigger_conditions: PoemTriggerCondition;
  lines: PoemLine[];
  full_text: string;
  translation: string;
  background: string;
  themes: string[];
  is_parallel_history?: boolean;
}
