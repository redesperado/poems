/**
 * 唐宋山河风物志 · 器物与行囊数据规范 (src/types/artifact.ts)
 */

export type ArtifactCategory = 'weapon' | 'tea_wine' | 'stationery' | 'relic' | 'food';

export type ArtifactRarity = 'legendary' | 'epic' | 'rare';

export interface ArtifactItem {
  id: string;
  name: string;
  category: ArtifactCategory;
  categoryName: string; // e.g. "兵刃文玩" | "佳酿香茗" | "笔墨碑拓" | "传家古物" | "珍馐食单"
  rarity: ArtifactRarity;
  icon: string; // e.g. "⚔️", "🍶", "📜", "🏺", "🥢"
  poetExclusiveId?: string | null; // 若为文人本命信物，则指定 poetId ('li_bai' | 'du_fu' | 'su_shi' | 'li_qingzhao')
  originCityId?: string | null; // 产地城市 ID (如 'jinling', 'changan', 'bianjing' 等)
  originCityName?: string; // 产地中文名
  dynasty?: 'tang' | 'song' | 'all';
  quote: string; // 传世诗句或名篇题刻
  description: string; // 器物风貌与文化意蕴
  historicalProvenance: string; // 史籍考证出处（如《新唐书》《东坡志林》《金石录后序》等）
  obtainMethod: string; // 获取途径描述
  moodBonus?: Partial<Record<'serenity' | 'melancholy' | 'pride' | 'inspiration' | 'indignation', number>>;
}
