import { PoetData } from '../../../types/poet';
import { SU_SHI_POEMS } from './poems';
import { SU_SHI_EVENTS, SU_SHI_CHOICES } from './events';

export const SU_SHI: PoetData = {
  id: 'su_shi',
  name_cn: '苏轼',
  title: '东坡居士',
  dynasty: 'song',
  born: 1037,
  died: 1101,
  style: ['heroic', 'zen', 'optimistic', 'profound'],
  bio_short: '字子瞻，号东坡居士，北宋豪放派词人代表，唐宋八大家之一，一生屡遭贬谪却随遇而安，旷达达观。',
  initial_mood: {
    passion: 65,
    sorrow: 30,
    freedom: 75,
    anger: 20,
    homesickness: 45,
  },
  start_year: 1074,
  start_location_id: 'hangzhou',
  start_event_id: 'su_shi_hangzhou_1074',
  theme_color: '#0D9488',
  preferred_theme_id: 'song-celadon',
};

export { SU_SHI_POEMS, SU_SHI_EVENTS, SU_SHI_CHOICES };
