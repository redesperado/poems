import { GameEvent, LifeChoice } from '../../../types/event';

export const SU_SHI_EVENTS: GameEvent[] = [
  {
    id: 'su_shi_youth_meizhou',
    poet_id: 'su_shi',
    year: 1057,
    location_id: 'sichuan',
    type: 'travel',
    title: '眉山出蜀',
    description: '二十二岁苏轼与弟苏辙进京应举，欧阳修读其卷大为惊叹：“老夫当避路，放他出一头地也！”',
    mood_delta: { passion: 35, freedom: 25 },
    next_event_id: 'su_shi_hangzhou_1074',
  },
  {
    id: 'su_shi_hangzhou_1074',
    poet_id: 'su_shi',
    year: 1074,
    location_id: 'hangzhou',
    type: 'appointment',
    title: '西湖水光',
    description: '通判杭州，巡察江堤，留连西湖山水，写下“欲把西湖比西子，淡妆浓抹总相宜”。',
    mood_delta: { freedom: 30, passion: 20 },
    triggers_poem_id: 'shui_diao_ge_tou',
    next_event_id: 'su_shi_wutai_crisis_1079',
  },
  {
    id: 'su_shi_wutai_crisis_1079',
    poet_id: 'su_shi',
    year: 1079,
    location_id: 'huangzhou',
    type: 'choice',
    title: '乌台诗案抉择',
    description: '御史台台吏搜检苏轼诗文罗织罪名，逮捕入狱。面对生死险境，是委曲求全还是坚守文心？',
    triggers_choice_id: 'choice_1079_wutai',
    next_event_id: 'su_shi_huangzhou_1082',
  },
  {
    id: 'su_shi_huangzhou_1082',
    poet_id: 'su_shi',
    year: 1082,
    location_id: 'huangzhou',
    type: 'travel',
    title: '东坡雪堂',
    description: '贬谪黄州团练副使，无权无禄，躬耕于东坡荒地。沙湖道中遇雨，顿悟“也无风雨也无晴”。',
    mood_delta: { freedom: 40, sorrow: -25 },
    triggers_poem_id: 'ding_feng_bo',
  },
];

export const SU_SHI_CHOICES: Record<string, LifeChoice> = {
  choice_1079_wutai: {
    id: 'choice_1079_wutai',
    event_id: 'su_shi_wutai_crisis_1079',
    prompt: '乌台大狱，九死一生。狱卒逼供，朝野震荡。你将如何安放自己这颗赤子之心？',
    historical_context: '历史上王安石、曹太后等多人力保，苏轼被贬黄州。这场大难彻底摧毁了苏轼的功名执念，却淬炼出一个千古不朽的“苏东坡”。',
    options: [
      {
        id: 'opt_wutai_accept',
        text: '直面贬谪，躬耕东坡（历史正史）',
        mood_delta: { freedom: 35, sorrow: -20, passion: 15 },
        unlocks_poems: ['ding_feng_bo'],
        unlocks_locations: ['huangzhou'],
        is_historical: true,
        historical_note: '苏轼选择了坦然接受命运的流放。在黄州赤壁之下，一个原本可能普通的北宋名臣，终于涅槃成为中国文学史的参天巨人东坡居士。',
      },
      {
        id: 'opt_wutai_withdraw',
        text: '万念俱灰，归隐田园（平行历史）',
        mood_delta: { freedom: 20, homesickness: 30, passion: -20 },
        unlocks_poems: ['gui_yuan_tian_ju_ci'],
        unlocks_locations: ['sichuan'],
        is_historical: false,
        historical_note: '若苏轼彻底心灰意冷隐遁林泉，或许能得享山野终老之安宁，世间却将永远失去《前赤壁赋》与《念奴娇·赤壁怀古》。',
      },
    ],
  },
};
