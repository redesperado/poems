import { MoodState } from './mood';

export type EventType =
  | 'travel'
  | 'appointment'
  | 'exile'
  | 'meeting'
  | 'crisis_response'
  | 'choice'
  | 'passing';

export interface MasterAppraisal {
  critic: string;
  relationship: string;
  quote: string;
  comment: string;
}

export interface PoetRetrospectiveData {
  passing_year: number;
  passing_location_name: string;
  epitaph_title: string;
  swan_song_title?: string;
  swan_song_lines?: string[];
  departure_narrative: string;
  lifetime_summary: string;
  master_appraisals: MasterAppraisal[];
  historical_legacy: string;
}

export interface CrisisDetails {
  title: string;
  year: number;
  historical_event_name: string;
  historical_background: string;
  poet_impact: string;
  mood_delta_desc: string;
}

export interface GameEvent {
  id: string;
  poet_id: string;
  year: number;
  location_id: string;
  type: EventType;
  title: string;
  description: string;
  mood_delta?: Partial<MoodState>;
  triggers_choice_id?: string | null;
  triggers_poem_id?: string | null;
  triggers_crisis?: CrisisDetails | null;
  triggers_retrospective?: PoetRetrospectiveData | null;
  triggers_encounter_id?: string | null;
  next_event_id?: string | null;
}

export interface LifeChoiceOption {
  id: string;
  text: string;
  mood_delta: Partial<MoodState>;
  unlocks_poems: string[];
  unlocks_locations: string[];
  next_event_id?: string;
  is_historical: boolean;
  historical_note: string;
}

export interface LifeChoice {
  id: string;
  event_id: string;
  prompt: string;
  historical_context: string;
  options: LifeChoiceOption[];
}
