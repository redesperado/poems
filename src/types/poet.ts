import { MoodState } from './mood';

export interface PoetData {
  id: string;
  name_cn: string;
  title: string;          // 诗仙 / 诗圣 / 东坡居士
  dynasty: 'tang' | 'song';
  born: number;
  died: number;
  style: string[];
  bio_short: string;
  initial_mood: MoodState;
  start_year: number;
  start_location_id: string;
  start_event_id: string;
  theme_color: string;
  preferred_theme_id?: string;
}
