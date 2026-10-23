import { PoemData } from '../../../types/poem';

export const LI_BAI_POEMS: PoemData[] = [
  {
    id: 'wang_lu_shan_pu_bu',
    title: '望庐山瀑布',
    poet_id: 'li_bai',
    dynasty: 'tang',
    form: 'shi',
    year: 726,
    location_id: 'lu_shan',
    trigger_conditions: {
      location_id: 'lu_shan',
      mood: { freedom: { min: 50 }, passion: { min: 40 } },
      year_range: [726, 762],
    },
    lines: [
      {
        text: '日照香炉生紫烟',
        blank_index: 4,
        correct: '生',
        options: ['生', '起', '飘', '吐'],
        wrong_explanations: {
          起: '“起”字突兀骤现，香炉峰在晴日照耀下应是岚气蒸腾、温和化育之态。',
          飘: '“飘”字轻盈无力，无法展现瀑布香炉水汽凝聚为紫色祥云的雄浑感。',
          吐: '“吐”字造作粗率，失却了自然造化的仙意与清奇。',
        },
      },
      {
        text: '遥看瀑布挂前川',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '飞流直下三千尺',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '疑是银河落九天',
        blank_index: 2,
        correct: '银河',
        options: ['银河', '白练', '玉龙', '云雾'],
        wrong_explanations: {
          白练: '“白练”过于写实平俗，李白此句乃神来之笔，非星汉从九天垂落不足以状其奇绝。',
          玉龙: '“玉龙”多为战阵或冰雪俗套比喻，缺了李太白超拔宇宙的浪漫仙气。',
          云雾: '“云雾”呈飘散静态，无法体现奔涌下泻的磅礴动势。',
        },
      },
    ],
    full_text: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
    translation:
      '阳光照耀香炉峰升起紫色烟霞，远看瀑布如白练高挂在山川之前。飞泻直下足有三千尺，让人怀疑是九天之上的银河倾泻而下。',
    background:
      '开元十四年（726年），26岁的李白初出蜀地游历名山大川。伫立庐山香炉峰前，见晴光紫气、飞瀑轰鸣，豪气勃发，一气呵成千古绝唱。',
    themes: ['nature', 'grandeur', 'freedom'],
  },
  {
    id: 'jing_ye_si',
    title: '静夜思',
    poet_id: 'li_bai',
    dynasty: 'tang',
    form: 'shi',
    year: 726,
    location_id: 'yangzhou',
    trigger_conditions: {
      location_id: 'yangzhou',
      mood: { homesickness: { min: 55 } },
      year_range: [726, 762],
    },
    lines: [
      {
        text: '床前明月光',
        blank_index: 2,
        correct: '明月',
        options: ['明月', '冷月', '皎月', '落月'],
        wrong_explanations: {
          冷月: '“冷月”词意显露太尽，缺少了皎洁月色直透床前的清澈与宁静。',
          皎月: '“皎月”文人造作感过重，不若“明月”口语天然，清水出芙蓉。',
          落月: '“落月”时值破晓残月，与秋夜惊醒忽生乡愁的孤寂长夜意境不合。',
        },
      },
      {
        text: '疑是地上霜',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '举头望明月',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '低头思故乡',
        blank_index: 2,
        correct: '思',
        options: ['思', '忆', '念', '想'],
        wrong_explanations: {
          忆: '“忆”重在向后追溯过往人事，“思”则是心绪无边漫卷，深沉博大。',
          念: '“念”字稍显急促，不如“思”字低头良久的绵长回甘。',
          想: '“想”过于浅显平直，欠缺古典诗词的温厚含蓄。',
        },
      },
    ],
    full_text: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    translation:
      '床前洒满皎洁的月光，朦胧中恍若地上凝了一层白霜。抬头凝望天上的明月，低下头来不禁涌起对故乡的深切思念。',
    background:
      '李白旅居扬州，深秋卧病客舍，孤身一人。深夜忽见月光泻地，恍惚若秋霜，触景伤情，写下这首千百年来华人传诵第一的思乡短章。',
    themes: ['homesickness', 'moon', 'autumn'],
  },
  {
    id: 'huang_he_lou_song_meng_hao_ran',
    title: '黄鹤楼送孟浩然之广陵',
    poet_id: 'li_bai',
    dynasty: 'tang',
    form: 'shi',
    year: 727,
    location_id: 'huanghelou',
    trigger_conditions: {
      location_id: 'huanghelou',
      mood: { freedom: { min: 50 }, sorrow: { min: 30 } },
      year_range: [727, 762],
    },
    lines: [
      {
        text: '故人西辞黄鹤楼',
        blank_index: 0,
        correct: '故人',
        options: ['故人', '良朋', '夫子', '知交'],
        wrong_explanations: {
          良朋: '虽言朋友，但“良朋”略显书卷客套，少了一份相交有年的平实深厚。',
          夫子: '虽李白称孟浩然“吾爱孟夫子”，但起首七字“故人西辞”更具送别苍茫之概。',
          知交: '音节平仄不如“故人”朗畅动人。',
        },
      },
      {
        text: '烟花三月下扬州',
        blank_index: 0,
        correct: '烟花',
        options: ['烟花', '风光', '春风', '柳烟'],
        wrong_explanations: {
          风光: '风光空洞泛指，绝无“烟花三月”柳絮如烟、繁花似锦的江南盛景之妙。',
          春风: '春风三月平平无奇，失却李白名句传诵千载的诗意绝美色彩。',
          柳烟: '柳烟专写柳色，格局过狭，不如烟花兼收花柳之盛。',
        },
      },
      {
        text: '孤帆远影碧空尽',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '唯见长江天际流',
        blank_index: 0,
        correct: '唯见',
        options: ['唯见', '空余', '但看', '独留'],
        wrong_explanations: {
          空余: '“空余”过于强调凄凉落寞，李白为好友奔赴繁华扬州壮行，情虽依依，意仍开阔。',
          但看: '“但看”语调轻浮，不及“唯见”极目远眺天地苍茫之凝定。',
          独留: '“独留”语意促狭，失却江天辽阔、浩浩东去的自然壮景。',
        },
      },
    ],
    full_text: '故人西辞黄鹤楼，烟花三月下扬州。孤帆远影碧空尽，唯见长江天际流。',
    translation:
      '老友在黄鹤楼向我挥手告别，在柳絮如烟、繁花似锦的三月顺流东下扬州。那一叶孤舟的帆影渐渐消失在苍翠碧空的尽头，只看见浩荡的长江水奔流向天地边际。',
    background:
      '开元十五年（727年），李白在江夏与前辈好友孟浩然相聚数日。孟浩然将东下扬州，李白在黄鹤楼登高远送，极目江天，写下这首飘逸脱俗的送别名作。',
    themes: ['friendship', 'farewell', 'spring'],
  },
  {
    id: 'qiang_jin_jiu',
    title: '将进酒',
    poet_id: 'li_bai',
    dynasty: 'tang',
    form: 'shi',
    year: 752,
    location_id: 'yingyang',
    trigger_conditions: {
      location_id: 'yingyang',
      mood: { passion: { min: 70 }, anger: { min: 30 } },
      year_range: [752, 762],
    },
    lines: [
      {
        text: '君不见黄河之水天上来',
        blank_index: 3,
        correct: '黄河',
        options: ['黄河', '沧浪', '银河', '巨浪'],
        wrong_explanations: {
          沧浪: '“沧浪”重在澄澈或避世濯缨，无黄河巨灵劈山而来的大开大合。',
          银河: '此处乃地上实景化虚景之奇笔，若直写银河，反落第二乘。',
          巨浪: '“巨浪”过于直白干瘪，失却大河横绝天地的浩荡神韵。',
        },
      },
      {
        text: '奔流到海不复回',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '天生我材必有用',
        blank_index: 2,
        correct: '我材',
        options: ['我材', '吾生', '此生', '我辈'],
        wrong_explanations: {
          吾生: '“吾生”偏向慨叹生命个体，不及“我材”直抒天生大才、豪情狂傲之气！',
          此生: '“此生”略带宿命自哀，非李白自信傲岸的太白本色。',
          我辈: '“我辈”泛指群体，此句乃李白为天下狂客立言，舍我其谁。',
        },
      },
      {
        text: '千金散尽还复来',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
    ],
    full_text:
      '君不见黄河之水天上来，奔流到海不复回。君不见高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。天生我材必有用，千金散尽还复来！',
    translation:
      '你没看见那黄河之水从天际奔涌而来，波涛翻滚直奔大海再也不回还？你没看见高堂明镜中白发凄凄，早晨还是乌黑青丝傍晚就已白发如雪？人生得意之时自当开怀尽欢，切莫让金色酒杯空对天上明月！天既然生下我这样的奇才就必然有其大用，千两黄金就算挥霍散尽也定会重新赚回！',
    background:
      '天宝十一载（752年），李白离开长安已有数年。与友人岑勋、元丹丘在颍阳石门山聚会，三人开怀痛饮。李白借酒兴大舒怀才不遇的悲愤与笑傲王侯的极致豪情。',
    themes: ['passion', 'wine', 'freedom', 'defiance'],
  },
  {
    id: 'zeng_wang_lun',
    title: '赠汪伦',
    poet_id: 'li_bai',
    dynasty: 'tang',
    form: 'shi',
    year: 753,
    location_id: 'jingxian',
    trigger_conditions: {
      location_id: 'jingxian',
      mood: { freedom: { min: 55 } },
      year_range: [753, 762],
    },
    lines: [
      {
        text: '李白乘舟将欲行',
        blank_index: 0,
        correct: '李白',
        options: ['李白', '太白', '孤舟', '诗人'],
        wrong_explanations: {
          太白: '以直呼己名“李白”自况，天然古朴，毫无学究气，真率至极。',
          孤舟: '若写孤舟，后句“将欲行”无主体呼应，失去直白清朗之趣。',
          诗人: '古诗罕见自称“诗人”，生硬隔阂。',
        },
      },
      {
        text: '忽闻岸上踏歌声',
        blank_index: 0,
        correct: '忽闻',
        options: ['忽闻', '遥听', '惊看', '且听'],
        wrong_explanations: {
          遥听: '“遥听”早有意料，失却了临别之际岸上突然踏歌送行的惊喜意外。',
          惊看: '“惊看”过于剧烈，不如“忽闻”声先至而心先喜的自然生动。',
          且听: '“且听”如同看客评点，失却主客间深厚情义的即时呼应。',
        },
      },
      {
        text: '桃花潭水深千尺',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '不及汪伦送我情',
        blank_index: 0,
        correct: '不及',
        options: ['不及', '不比', '怎及', '莫若'],
        wrong_explanations: {
          不比: '“不比”语气干瘪生硬，少了一泻千里的诗意转折。',
          怎及: '“怎及”变为疑问修辞，不似“不及”直抒胸臆、落地生根。',
          莫若: '“莫若”偏于议论劝诫，在此完全不合情境。',
        },
      },
    ],
    full_text: '李白乘舟将欲行，忽闻岸上踏歌声。桃花潭水深千尺，不及汪伦送我情。',
    translation:
      '我李白正要乘船远行，忽然听见岸上村民踏着节拍唱着歌前来相送。即使桃花潭的水深达千尺，也远远比不上汪伦先生送我的一片真挚深情。',
    background:
      '天宝十二载（753年），泾县村民汪伦好客，盛情款待李白多日。李白临别之际登舟欲发，汪伦率乡民在岸边踏地为节、踏歌送行，李白大为感动，当即题赠此诗。',
    themes: ['friendship', 'rustic', 'gratitude'],
  },
  {
    id: 'zao_fa_bai_di_cheng',
    title: '早发白帝城',
    poet_id: 'li_bai',
    dynasty: 'tang',
    form: 'shi',
    year: 759,
    location_id: 'baidicheng',
    trigger_conditions: {
      location_id: 'baidicheng',
      mood: { freedom: { min: 60 } },
      year_range: [759, 762],
    },
    lines: [
      {
        text: '朝辞白帝彩云间',
        blank_index: 0,
        correct: '朝辞',
        options: ['朝辞', '早发', '晓别', '清晨'],
        wrong_explanations: {
          早发: '题为早发，若首句亦“早发”，犯了同韵重字之忌，不若“朝辞”音韵俊美。',
          晓别: '“晓别”音韵略促，“朝辞”兼带山高天远辞别白帝之雄浑。',
          清晨: '四字无法入七绝格律。',
        },
      },
      {
        text: '千里江陵一日还',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '两岸猿声啼不住',
        blank_index: 2,
        correct: '猿声',
        options: ['猿声', '鸟啼', '风雷', '水声'],
        wrong_explanations: {
          鸟啼: '三峡险绝以两岸猿啼苍凉回荡著称，“猿声”最契合长江三峡的地理与文学典故。',
          风雷: '风雷喧宾夺主，失却流放重获自由后心境如电、轻舟飞驰的快意。',
          水声: '水声过于寻常，无法映衬轻舟瞬息万里的速度感。',
        },
      },
      {
        text: '轻舟已过万重山',
        blank_index: 0,
        correct: '轻舟',
        options: ['轻舟', '快船', '小舟', '飞帆'],
        wrong_explanations: {
          快船: '“快船”俗不可耐，纯属现代口语，完全无文学美感。',
          小舟: '“小舟”徒状船小，唯“轻舟”二字，既写船轻水急，更点透诗人遇赦后心头重担顿卸的无限畅快！',
          飞帆: '帆在峡谷回旋，多用摇橹，“轻舟”神韵完胜飞帆。',
        },
      },
    ],
    full_text: '朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。',
    translation:
      '清晨告别高入彩云之中的白帝城，远在千里的江陵只用一天就能乘流返回。两岸峡谷险峰的猿猴鸣叫声还在耳边回荡，轻快的小舟却早已经穿过了千山万岭！',
    background:
      '乾元二年（759年），李白因卷入永王璘案被流放夜郎，行至白帝城忽闻大赦天下。绝处逢生的李白欣喜若狂，随即乘舟顺江东返，一洗半生沉冤郁气！',
    themes: ['relief', 'speed', 'nature', 'freedom'],
  },
];
