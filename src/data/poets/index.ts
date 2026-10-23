import { PoetData } from '../../types/poet';
import { PoemData } from '../../types/poem';
import { GameEvent, LifeChoice } from '../../types/event';
import { LI_BAI, LI_BAI_POEMS, LI_BAI_EVENTS, LI_BAI_CHOICES } from './li_bai';
import { SU_SHI, SU_SHI_POEMS, SU_SHI_EVENTS, SU_SHI_CHOICES } from './su_shi';

export interface PoetPack {
  poet: PoetData;
  poems: PoemData[];
  events: GameEvent[];
  choices: Record<string, LifeChoice>;
}

export const POET_PACKS: Record<string, PoetPack> = {
  li_bai: {
    poet: LI_BAI,
    poems: LI_BAI_POEMS,
    events: LI_BAI_EVENTS,
    choices: LI_BAI_CHOICES,
  },
  su_shi: {
    poet: SU_SHI,
    poems: SU_SHI_POEMS,
    events: SU_SHI_EVENTS,
    choices: SU_SHI_CHOICES,
  },
};

export const AVAILABLE_POETS: PoetData[] = [LI_BAI, SU_SHI];
