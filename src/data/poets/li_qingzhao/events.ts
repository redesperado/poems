import { GameEvent, LifeChoice } from '../../../types/event';

export const LI_QINGZHAO_EVENTS: GameEvent[] = [
  {
    id: 'lqz_youth_1100',
    poet_id: 'li_qingzhao',
    year: 1100,
    location_id: 'jinan',
    type: 'travel',
    title: '泉城胜地 · 溪亭沉醉《如梦令》',
    description:
      '十六七岁的李清照生活在齐州泉城，名门闺秀，天资超绝。夏日郊游溪亭泛舟，薄醉迷途，误入藕花深处惊起一滩鸥鹭，挥就名动京华的《如梦令》。',
    mood_delta: { freedom: 35, passion: 25 },
    triggers_poem_id: 'ru_meng_ling_xi_ting',
    next_event_id: 'lqz_marriage_kaifeng_1101',
  },
  {
    id: 'lqz_marriage_kaifeng_1101',
    poet_id: 'li_qingzhao',
    year: 1101,
    location_id: 'kaifeng',
    type: 'meeting',
    title: '汴京结缡 · 赌书泼茶金石缘',
    description:
      '十八岁李清照在东京汴梁与太学生赵明诚成婚。夫妻志趣高雅，省衣节食搜求商周鼎彝与汉魏碑刻，相濡以沫，“赌书消得泼茶香”，传为文坛千古佳话。',
    mood_delta: { freedom: 30, passion: 30 },
    next_event_id: 'lqz_kaifeng_yijianmei_1104',
  },
  {
    id: 'lqz_kaifeng_yijianmei_1104',
    poet_id: 'li_qingzhao',
    year: 1104,
    location_id: 'kaifeng',
    type: 'appointment',
    title: '深闺相思 · 才下眉头《一剪梅》',
    description:
      '赵明诚远行游学，青年少妇独守汴京深闺。清秋冷月，泛舟思君，写下“红藕香残玉簟秋”、“一种相思，两处闲愁。才下眉头，却上心头”的绝美词章。',
    mood_delta: { homesickness: 35, sorrow: 20 },
    triggers_poem_id: 'yi_jian_mei',
    next_event_id: 'lqz_jingkang_crisis_1127',
  },
  {
    id: 'lqz_jingkang_crisis_1127',
    poet_id: 'li_qingzhao',
    year: 1127,
    location_id: 'kaifeng',
    type: 'crisis_response',
    title: '靖康浩劫 · 北宋覆亡大南渡',
    description:
      '靖康二年春，金兵长驱南下攻陷汴梁，俘虏徽钦二帝及后妃皇族北狩，北宋轰然倾覆！李清照独自押运十五车累朝金石古籍书画，涉水渡淮，仓皇奔逃江南。',
    mood_delta: { sorrow: 50, anger: 40, homesickness: 45 },
    triggers_crisis: {
      title: '靖康之耻爆发 · 天倾西北',
      year: 1127,
      historical_event_name: '靖康浩劫 · 二帝北狩与宋室南渡',
      historical_background:
        '公元1127年（靖康二年）初，金军二次围攻开封，北宋都城沦陷。四月金军大肆搜掠汴京后，将宋徽宗、宋钦宗、宗室、妃嫔、重臣及匠人等三千余人俘虏北去，历经百六十年锦绣繁华的北宋王朝自此彻底覆灭，史称“靖康之耻”。五月康王赵构在南京应天府即位（宋高宗），偏安江南，建立南宋。',
      poet_impact:
        '李清照青州故居“归来堂”被战火烧毁，夫妻半生苦心搜求的大批金石珍玩化为灰烬。丈夫赵明诚受命南下江宁，李清照独自押送残存金石书画十五车，踏上艰难颠沛的千里流亡路，诗词由早年的清雅婉丽彻底转向家国沉痛与深切悲愤。',
      mood_delta_desc: '【天下剧变】：忧思 +50，悲愤 +40，乡愁 +45，豪情 -25',
    },
    next_event_id: 'lqz_jiangning_choice_1129',
  },
  {
    id: 'lqz_jiangning_choice_1129',
    poet_id: 'li_qingzhao',
    year: 1129,
    location_id: 'jiankang',
    type: 'choice',
    title: '江宁之变 · 乌江思项羽抉择',
    description:
      '建炎三年春，赵明诚任江宁知府，城中发生兵变，赵明诚竟弃城夜缒逃遁。李清照深感奇耻大辱。途经乌江项羽自刎处，面对丈夫的懦弱与朝廷的苟安，何以自处？',
    triggers_choice_id: 'choice_1129_jiangning',
    next_event_id: 'lqz_sea_escape_1130',
  },
  {
    id: 'lqz_sea_escape_1130',
    poet_id: 'li_qingzhao',
    year: 1130,
    location_id: 'hangzhou',
    type: 'travel',
    title: '海天云涛 · 豪迈浪漫《渔家傲》',
    description:
      '建炎四年金兵步步紧逼，宋高宗逃亡海上，李清照亦随难民船队漂泊浙东大洋。面对海天无际翻涌云涛，梦入天宫，写下“九万里风鹏正举。风休住，蓬舟吹取三山去”的旷世豪迈词！',
    mood_delta: { freedom: 45, passion: 35 },
    triggers_poem_id: 'yu_jia_ao_tian_jie',
    next_event_id: 'lqz_shengshengman_1134',
  },
  {
    id: 'lqz_shengshengman_1134',
    poet_id: 'li_qingzhao',
    year: 1134,
    location_id: 'hangzhou',
    type: 'travel',
    title: '避乱浙东 · 千古绝唱《声声慢》',
    description:
      '绍兴四年，赵明诚病卒数年，半生金石散佚殆尽，李清照孑然一身寓居江南客舍。秋雨黄昏，连用十四叠字，写尽千古第一愁绝之作《声声慢·寻寻觅觅》。',
    mood_delta: { sorrow: 55, homesickness: 40 },
    triggers_poem_id: 'sheng_sheng_man',
    next_event_id: 'lqz_wulingchun_1135',
  },
  {
    id: 'lqz_wulingchun_1135',
    poet_id: 'li_qingzhao',
    year: 1135,
    location_id: 'hangzhou',
    type: 'travel',
    title: '双溪舴艋 · 载不动愁《武陵春》',
    description:
      '绍兴五年春，避乱金华的李清照暮春伤怀。“物是人非事事休，欲语泪先流”，面对双溪轻舟，奇绝写下“只恐双溪舴艋舟，载不动许多愁”，化虚为实，登峰造极。',
    mood_delta: { sorrow: 30, freedom: 15 },
    triggers_poem_id: 'wu_ling_chun',
    next_event_id: 'lqz_linan_passing_1155',
  },
  {
    id: 'lqz_linan_passing_1155',
    poet_id: 'li_qingzhao',
    year: 1155,
    location_id: 'hangzhou',
    type: 'passing',
    title: '临安雨歇 · 易安谢幕',
    description:
      '绍兴二十五年，七十二岁的李清照在南宋都城临安（今杭州）孤寂离世。千古第一才女完成了《金石录后序》，留下一卷锦绣长词，浩然谢幕，芳名永垂青史！',
    mood_delta: { freedom: 50, sorrow: 20, passion: 20 },
    triggers_retrospective: {
      passing_year: 1155,
      passing_location_name: '临安（浙江杭州）',
      epitaph_title: '宋代婉约词宗 · 易安居士一生行状通鉴',
      swan_song_title: '《金石录后序》（易安绝笔跋文）',
      swan_song_lines: [
        '三十四年之间，忧患得失，何其备也！',
        '物之成毁，有时数存焉。',
        '曷足深动其心？是以区区记其始终，',
        '亦为好尚者之戒云尔。',
      ],
      departure_narrative:
        '南宋高宗绍兴二十五年（公元 1155 年）深秋，七十二岁高龄的李清照在临安陋巷的小楼中静静闭上了双眼。回首平生：齐州胜景、溪亭沉醉、汴京结缡、赌书泼茶、靖康天倾、流亡江浙、乌江悲歌、双溪载愁……这位以女儿之躯傲立两宋文坛顶峰的奇女子，历尽了人生最繁华的极乐，也咽下了时代最残酷的彻骨悲凉。临终前，她整理完了与亡夫毕生心血凝聚的《金石录》，完成了荡气回肠的《金石录后序》，坦然超越了物欲得失。千古第一才女，从此化作华夏文学夜空中最清绝璀璨的文曲巨星。',
      lifetime_summary:
        '李清照（1084年—1155年），号易安居士。宋代婉约词派至高宗师，公认的中国文学史“千古第一才女”。她以卓越的艺术天才在宋词中自树一帜，早年词风清新秀丽、机敏活泼，晚年因国破家亡、身世坎坷，转而沉郁凄绝、慷慨悲壮，其词论更确立了“词别是一家”的文学法度。',
      master_appraisals: [
        {
          critic: '王国维《人间词话》',
          relationship: '近代国学美学大师',
          quote: '词家多以儿女情长，易安则独有丈夫之气！',
          comment:
            '王国维盛赞李清照词格兼具极度的细腻与空前的豪健，“生当作人杰，死亦为鬼雄”气魄雄拔，宋代士大夫群臣皆愧不如。',
        },
        {
          critic: '辛弃疾（稼轩）',
          relationship: '南宋豪放派词宗',
          quote: '易安人比黄花，而骨如金石。其词之妙，真鬼斧神工也。',
          comment:
            '同为济南老乡的辛弃疾对李清照推崇备至，其爱国词意与沉雄气骨深受易安晚年慷慨悲歌之深刻熏陶。',
        },
        {
          critic: '王士禛（渔洋山人）',
          relationship: '清代一代诗宗',
          quote: '婉约以易安为宗，豪放以幼安为首，皆我济南之绝代奇才！',
          comment:
            '王士禛将李清照定为中国两千年婉约词派唯一的至高统领者，与辛弃疾并称为“济南二安”，双峰并峙。',
        },
        {
          critic: '朱熹',
          relationship: '南宋理学集大成者',
          quote: '本朝妇人能文，唯魏夫人与李易安二人而已，而易安尤杰出。',
          comment:
            '即使是以严苛著称的理学大师朱熹，面对李清照横溢的才华与渊博的学识，亦不得不由衷赞叹其为两宋女性文学无可比拟的巅峰。',
        },
        {
          critic: '梁启超',
          relationship: '近代思想家 · 学术宗师',
          quote: '易安身经丧乱，作词沉哀入骨，真天挺之杰也！',
          comment:
            '梁启超赞赏李清照在时代浩劫面前表现出的坚忍傲骨与民族气节，认为其五言绝句《夏日绝句》冠绝两宋三百年，令人肃然起敬。',
        },
      ],
      historical_legacy:
        '【两宋词坛的至高丰碑】：独创“易安体”，在长短句韵律、叠字技法（如《声声慢》十四叠字）、口语入词方面达至化境；\n\n【中国金石学的开拓宗师】：与赵明诚共同撰就三十卷《金石录》，不仅抢救了先秦两汉无数国宝重器，更以《金石录后序》成为中国传记文学千古奇文；\n\n【超越时代的女性独立风骨】：敢于面对封建礼教直斥男权懦弱，“生当作人杰，死亦为鬼雄”，为古代女性确立了独立自尊与家国大义的精神坐标；\n\n【民族苦难的深情吟唱者】：她的生命轨迹与北宋盛极转衰、南宋流亡偏安紧密相连，以柔弱之笔写下时代最沉痛的灵魂史诗。',
    },
  },
];

export const LI_QINGZHAO_CHOICES: Record<string, LifeChoice> = {
  choice_1129_jiangning: {
    id: 'choice_1129_jiangning',
    event_id: 'lqz_jiangning_choice_1129',
    prompt:
      '建炎三年江宁兵变，身为一府长官的丈夫赵明诚畏罪缒城弃职私逃，导致满城混乱。面对丈夫的软弱自私与朝廷的偏安苟活，你将如何表达自己的风骨？',
    historical_context:
      '历史上李清照对赵明诚弃城潜逃极为鄙视与痛心。五月乘船顺流而下经乌江项羽自刎处，李清照直视丈夫，悲愤题下《夏日绝句》：“生当作人杰，死亦为鬼雄。至今思项羽，不肯过江东！”赵明诚闻之愧悔交加，不久郁悒成疾而卒。',
    options: [
      {
        id: 'opt_jiangning_condemn',
        text: '借项羽讽刺苟安，题《夏日绝句》（历史正史）',
        mood_delta: { freedom: 30, passion: 35, anger: 20 },
        unlocks_poems: ['xia_ri_jue_ju'],
        unlocks_locations: ['jiankang'],
        is_historical: true,
        historical_note:
          '李清照选择了毫不妥协的直面与批判。这首《夏日绝句》不仅令丈夫赵明诚羞愧无地，更像一柄利剑刺向南渡偏安、苟且偷生的满朝群臣，铸就千古不灭的凛凛铁骨！',
      },
      {
        id: 'opt_jiangning_compromise',
        text: '顾全夫妻颜面，隐忍不发（平行历史）',
        mood_delta: { freedom: -25, sorrow: 30, anger: -10 },
        unlocks_poems: [],
        unlocks_locations: ['jiankang'],
        is_historical: false,
        historical_note:
          '若李清照选择隐忍吞声，虽可维系表面夫妻和睦，世间却将永远失去这首字字千钧、令无数须眉男儿汗颜的千古正气绝唱。',
      },
    ],
  },
};
