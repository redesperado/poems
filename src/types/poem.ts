import { MoodState } from './mood';

export interface PoemLine {
  text: string;
  blank_index: number | null; // 缺字索引，null 表示整句完整无需填空
  correct: string | null;
  options: string[] | null;   // 4 个选项 (A, B, C, D)
  wrong_explanations: Record<string, string> | null; // 错误选项的深度文学赏析
  correct_explanation?: string; // 正确选项的炼字深意与文学赏析
}

export interface KeyWordAnnotation {
  word: string;
  pinyin: string;
  explanation: string;
  allusion?: string; // 典故或字形渊源
}

export interface LiteraryAnalysis {
  artistic_features: string[]; // 艺术手法 (如“化静为动”、“虚实相生”)
  master_comments: { critic: string; comment: string }[]; // 历代名家评点
  appreciation: string; // 深度赏析长文
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
  dynasty: 'tang' | 'song';
  form: 'shi' | 'ci'; // 诗 (五言/七言等) 或 词 (词牌名长短句)
  cipai?: string;     // 若为词，注明词牌 (如《水调歌头》)
  year: number;
  location_id: string;
  trigger_conditions: PoemTriggerCondition;
  lines: PoemLine[];
  full_text: string;
  translation: string;
  background: string;
  poet_journal: string; // 诗人文心手记（第一人称心路独白）
  key_words: KeyWordAnnotation[]; // 重点字词深度注解
  literary_analysis: LiteraryAnalysis; // 文学名家深度赏析
  themes: string[];
  is_parallel_history?: boolean;
}
