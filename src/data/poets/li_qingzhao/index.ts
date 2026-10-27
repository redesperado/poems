import { PoetData } from '../../../types/poet';
import { LI_QINGZHAO_POEMS } from './poems';
import { LI_QINGZHAO_EVENTS, LI_QINGZHAO_CHOICES } from './events';

export const LI_QINGZHAO: PoetData = {
  id: 'li_qingzhao',
  name_cn: '李清照',
  title: '易安居士',
  dynasty: 'song',
  born: 1084,
  died: 1155,
  style: ['graceful', 'sorrowful', 'witty', 'patriotic'],
  bio_short:
    '号易安居士，宋代婉约词派宗匠，被尊为“千古第一才女”。词兼婉约与慷慨，前半生清雅俊爽，南渡后国破家亡，沉郁凄绝，风骨凌霜。',
  initial_mood: {
    passion: 55,
    sorrow: 30,
    freedom: 65,
    anger: 20,
    homesickness: 35,
  },
  start_year: 1100,
  start_location_id: 'jinan',
  start_event_id: 'lqz_youth_1100',
  theme_color: '#EC4899',
  preferred_theme_id: 'song-celadon',
};

export { LI_QINGZHAO_POEMS, LI_QINGZHAO_EVENTS, LI_QINGZHAO_CHOICES };
