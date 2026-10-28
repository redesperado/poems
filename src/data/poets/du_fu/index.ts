import { PoetData } from '../../../types/poet';
import { DU_FU_POEMS } from './poems';
import { DU_FU_EVENTS, DU_FU_CHOICES } from './events';

export const DU_FU: PoetData = {
  id: 'du_fu',
  name_cn: '杜甫',
  title: '诗圣',
  dynasty: 'tang',
  born: 712,
  died: 770,
  style: ['realistic', 'sorrowful', 'patriotic', 'profound'],
  bio_short:
    '字子美，自号少陵野老，后世尊称“诗圣”。其诗沉郁顿挫，悲悯苍生，全面反映盛唐由盛转衰的历史全貌，被千古公推为“诗史”。',
  initial_mood: {
    passion: 45,
    sorrow: 60,
    freedom: 35,
    anger: 35,
    homesickness: 50,
  },
  start_year: 736,
  start_location_id: 'taishan',
  start_event_id: 'du_fu_youth_736',
  theme_color: '#B45309',
  preferred_theme_id: 'tang-ink',
  avatar_image: '/images/poets/du_fu.svg',
  famous_quote: '安得广厦千万间，大庇天下寒士俱欢颜',
  representative_poems: ['望岳', '春望', '茅屋为秋风所破歌', '登高'],
  brief_intro: '集大成的万世诗圣，以沉郁顿挫之血泪史诗见证苍生黎庶，千古风骨如山。',
};

export { DU_FU_POEMS, DU_FU_EVENTS, DU_FU_CHOICES };
