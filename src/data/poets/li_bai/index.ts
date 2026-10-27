import { PoetData } from '../../../types/poet';
import { LI_BAI_POEMS } from './poems';
import { LI_BAI_EVENTS, LI_BAI_CHOICES } from './events';

export const LI_BAI: PoetData = {
  id: 'li_bai',
  name_cn: '李白',
  title: '诗仙',
  dynasty: 'tang',
  born: 701,
  died: 762,
  style: ['romantic', 'adventurous', 'philosophical'],
  bio_short: '字太白，号青莲居士，盛唐浪漫主义诗歌巅峰，仗剑去国，辞亲远游，天下称之“谪仙人”。',
  initial_mood: {
    passion: 70,
    sorrow: 25,
    freedom: 65,
    anger: 15,
    homesickness: 35,
  },
  start_year: 701,
  start_location_id: 'sichuan',
  start_event_id: 'li_bai_youth_sichuan',
  theme_color: '#10B981',
  preferred_theme_id: 'spring',
};

export { LI_BAI_POEMS, LI_BAI_EVENTS, LI_BAI_CHOICES };
