import { MoodState } from './mood';

export type EventType =
  | 'travel'
  | 'appointment'
  | 'exile'
  | 'meeting'
  | 'crisis_response'
  | 'choice';

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
