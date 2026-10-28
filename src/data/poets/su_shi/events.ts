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
    type: 'meeting',
    title: '东坡雪堂 · 佛印赤壁相悟',
    description: '贬谪黄州团练副使，躬耕东坡荒地，与佛印禅师泛舟赤壁之下，谈禅论道，豁达超然。',
    mood_delta: { freedom: 40, sorrow: -25 },
    triggers_encounter_id: 'encounter_su_foyin_1080',
    triggers_poem_id: 'ding_feng_bo',
    next_event_id: 'su_shi_changzhou_passing_1101',
  },
  {
    id: 'su_shi_changzhou_passing_1101',
    poet_id: 'su_shi',
    year: 1101,
    location_id: 'hangzhou',
    type: 'passing',
    title: '常州谢幕 · 问汝平生功业',
    description:
      '建中靖国元年七月，六十六岁的苏轼自海南儋州北归，病逝于江苏常州。临终笑对生死，平生历尽黄州、惠州、儋州九死一生，浩然超脱，羽化仙逝！',
    mood_delta: { freedom: 50, passion: 20 },
    triggers_retrospective: {
      passing_year: 1101,
      passing_location_name: '常州（江苏常州孙氏馆）',
      epitaph_title: '北宋绝代文宗 · 东坡居士一生行状通鉴',
      swan_song_title: '《自题金山画像》（坡仙绝笔）',
      swan_song_lines: [
        '心似已灰之木，身如不系之舟。',
        '问汝平生功业，黄州惠州儋州。',
      ],
      departure_narrative:
        '宋徽宗建中靖国元年（公元 1101 年）七月二十八日，六十六岁的苏东坡在常州寓所平静走向生命的终点。病榻前，好友维琳方丈对他耳语：“端明宜勿忘西方（极乐世界）！”东坡笑答：“西方即不无，但个里着力不得。”门人钱济明问：“后事如何？”东坡坦然道：“着力即差。”遂溘然而逝。从眉山出蜀名动京华，到乌江大狱九死一生，再到躬耕东坡、贬谪岭南、跨海儋州，这位历尽三朝风雨的天才文宗，将一生的挫折与苦难全化作了人间的至味清欢与无边旷达。',
      lifetime_summary:
        '苏轼（1037年—1101年），字子瞻，号东坡居士。北宋中期文坛领袖，“唐宋八大家”之一，豪放词派开创宗师。诗、词、文、书、画皆臻神品，是中国历史上少有的全才通才，其随遇而安、乐观超脱的人生态度，成为华夏士大夫最温润可亲的精神港湾。',
      master_appraisals: [
        {
          critic: '黄庭坚（山谷）',
          relationship: '苏门四学士之首 · 挚友',
          quote: '苏东坡天才卓绝，迈往凌云，人莫能测。',
          comment:
            '黄庭坚深知东坡为人，赞其文章如江河破浪、天马行空，而其为人更是一片赤子之心，光明磊落如青天白日。',
        },
        {
          critic: '陆游（放翁）',
          relationship: '南宋爱国诗翁',
          quote: '世间唯有东坡叟，天地无私一幅春。',
          comment:
            '陆游尊奉东坡为平生楷模，称其胸次浩然，即使处身蛮荒瘴疠之地，亦能将春天般的温暖与旷达洒向人间。',
        },
        {
          critic: '王国维《人间词话》',
          relationship: '近代美学大师',
          quote: '东坡之词旷，稼轩之词豪。东坡以性情入词，开千古豪放新天地！',
          comment:
            '王国维评断苏轼将宋词从五代以来的花间脂粉之狭窄天地中彻底解放出来，“无意不可入，无事不可言”，气象横绝千秋。',
        },
        {
          critic: '晁补之',
          relationship: '苏门四学士',
          quote: '东坡词，如天风海雨，回不可遏；又如挟天子以令诸侯，令人敛衽！',
          comment:
            '晁补之盛赞苏轼词的磅礴气魄与音乐韵律，认为其词作一旦吟诵，便如狂飙卷席，令同时代所有词家尽皆折服。',
        },
        {
          critic: '朱熹',
          relationship: '南宋理学巨擘',
          quote: '自三代以下，文章绝伦，唯公一人而已。',
          comment:
            '即使在学术理路与苏轼政见不同的朱熹，亦赞叹苏东坡文才天纵，汪洋恣肆，为三代之后文坛罕逢敌手之巨匠。',
        },
      ],
      historical_legacy:
        '【开宗立派的豪放词宗】：打破了“词为艳科”的千年成见，开拓出“大江东去浪淘尽”、“一蓑烟雨任平生”的万千壮阔气象；\n\n【随遇而安的生活哲学大成】：在流放中发现美食（东坡肉）、治理西湖（苏堤春晓）、劝导农桑，把苦难活成了诗意的盛宴；\n\n【百科全书式的文艺通才】：书法列“宋四家”之冠（《黄州寒食帖》天下一绝），开创文人写意枯木竹石画派；\n\n【中国人心灵的永远避风港】：“问汝平生功业，黄州惠州儋州”，苏东坡用一生的豁达教会了中国人如何在逆境中与命运温柔和解。',
    },
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
