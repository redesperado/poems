export interface MoodState {
  passion: number;      // 豪情 (0–100)
  sorrow: number;       // 忧思 (0–100)
  freedom: number;      // 洒脱 (0–100)
  anger: number;        // 愤懑 (0–100)
  homesickness: number; // 乡愁 (0–100)
}

export type MoodDimension = keyof MoodState;

export const MOOD_META: Record<
  MoodDimension,
  { label: string; color: string; desc: string }
> = {
  passion: { label: '豪情', color: '#F59E0B', desc: '壮志凌云、意气风发' },
  sorrow: { label: '忧思', color: '#0284C7', desc: '感怀伤逝、体恤苍生' },
  freedom: { label: '洒脱', color: '#10B981', desc: '放浪山水、物我两忘' },
  anger: { label: '愤懑', color: '#DC2626', desc: '怀才不遇、不平之鸣' },
  homesickness: { label: '乡愁', color: '#8B5CF6', desc: '孤鸿万里、故园情深' },
};
