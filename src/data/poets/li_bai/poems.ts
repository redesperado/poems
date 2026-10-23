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
    poet_journal:
      '吾辞蜀道、出三峡，初履匡庐之境。仰见香炉绝顶，红日蒸霞，浮云尽作紫黛之色。倏尔雷霆震耳，千仞飞泉倒挂青天！世人皆以绢帛状飞瀑，何其纤促！此造化吞吐银河之奇观也。掷笔痛饮，快哉平生！',
    key_words: [
      {
        word: '香炉',
        pinyin: 'xiāng lú',
        explanation: '指庐山西北的香炉峰。峰顶尖圆，云烟聚散，日光斜照宛如香炉升烟。',
        allusion: '《水经注》：“香炉峰孤峰耸出，烟云掩映，若博山炉之腾烟也。”',
      },
      {
        word: '生紫烟',
        pinyin: 'shēng zǐ yān',
        explanation: '“生”字极妙，化静态山峰为动态生机。水气经阳光折射呈紫色云岚。',
      },
      {
        word: '九天',
        pinyin: 'jiǔ tiān',
        explanation: '古人以九为极数，九天指最高深之苍穹霄汉。',
        allusion: '《楚辞·离骚》：“指九天以为正兮，夫唯灵修之故也。”',
      },
    ],
    literary_analysis: {
      artistic_features: [
        '化动为静与化静为动：首句山峰“生”烟（静转动），次句飞瀑“挂”川（动化静）。',
        '夸张极境与虚实莫辨：“三千尺”为虚极之数，“疑是银河”将人间飞水升华至天宇星汉。',
        '开阖跌宕的气度：起首壮丽，结句高潮，如惊雷破空，戛然而止却余韵无穷。',
      ],
      master_comments: [
        {
          critic: '苏轼《书李白望庐山瀑布诗后》',
          comment: '“帝遣银河一派垂，古来唯有谪仙词。飞流溅沫知多少，不与人间洗是非。”',
        },
        {
          critic: '沈德潜《唐诗别裁》',
          comment: '“日照香炉生紫烟，遥看瀑布挂前川。转折入神，太白之仙气全在于此。”',
        },
      ],
      appreciation:
        '这首诗堪称中国山水诗之冠冕。起句“日照香炉生紫烟”，以宏大开阔之全景开篇；次句“遥看瀑布挂前川”，一个“挂”字化奔流为凝练玉轴；三句“飞流直下三千尺”极写势能狂飙；末句“疑是银河落九天”奇峰突起，奇崛的比喻与恢宏的宇宙想象力熔于一炉，体现了盛唐昂扬向上、傲视寰宇的精神风貌。',
    },
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
    poet_journal:
      '客邸秋深，微疾侵骨。僮仆俱歇，四境悄然。忽闻窗棂风动，冷光皎洁满地，恍惚若深秋严霜覆户。披衣坐起，见孤轮悬天，巴蜀万里，亲朋安在？泪落沾襟，口占二十字。',
    key_words: [
      {
        word: '床前',
        pinyin: 'chuáng qián',
        explanation: '历来有“卧榻之床”、“井栏围床”与“胡床（交椅）”三说。在羁旅诗境中，多指客舍卧榻前的一席方寸之地。',
      },
      {
        word: '地上霜',
        pinyin: 'dì shàng shuāng',
        explanation: '以秋霜喻月色之洁白明亮，兼带深秋寒夜客子孤寂凄凉之触感体验。',
      },
      {
        word: '举头 / 低头',
        pinyin: 'jǔ tóu / dī tóu',
        explanation: '一仰一俯两个微小形体动作，将诗人由目击外物转入内心深沉沉思的瞬间神态刻画得入木三分。',
      },
    ],
    literary_analysis: {
      artistic_features: [
        '清水芙蓉，无一铅华字：纯用口语白描，不施藻饰，天然自成。',
        '仰俯对照：由疑霜到举头望月，再到低头念乡，情感流动浑然天成。',
        '跨越时空的普遍共情：以月亮作为普天之下羁旅之人共同的精神寄托。',
      ],
      master_comments: [
        {
          critic: '胡应麟《诗薮》',
          comment: '“太白五言绝句，自然圣也。《静夜思》二十字，无雕刻之迹，而神骨俱完。”',
        },
      ],
      appreciation:
        '《静夜思》之所以成为中国文学史上家喻户晓的神作，在于其以至简之文字承载了人类至深之羁旅乡愁。深夜见月光如霜，引发内心寒意；“举头”是追寻，“低头”是叩问内省。没有生僻字词，却句句击中羁旅天涯者的心灵深处。',
    },
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
    poet_journal:
      '孟夫子风仪潇洒，真高士也。今乘江风东趋广陵。长江滔滔，春草青青，芳洲烟柳如绣。登楼极目，白帆渐渺入云霄，天地间唯浩浩长江万古长流，夫子此去，当尽领东南之胜！',
    key_words: [
      {
        word: '烟花',
        pinyin: 'yān huā',
        explanation: '形容春意正浓时，柳絮如烟、繁花似锦的明媚绚烂春景。',
      },
      {
        word: '广陵',
        pinyin: 'guǎng líng',
        explanation: '即扬州，唐代东南最繁华的国际商业都会，“天下三分明月夜，二分无赖是扬州”。',
      },
      {
        word: '碧空尽',
        pinyin: 'bì kōng jìn',
        explanation: '帆影远去，直到完全消隐于碧蓝天宇的边缘，足见送行者久久伫立、深情凝望之态。',
      },
    ],
    literary_analysis: {
      artistic_features: [
        '融情于景，意境开阔：毫无寻常离别之小儿女沾巾涕泣，而是盛唐文人自信开阔的诗情。',
        '极目远送的动态长镜头：自黄鹤楼起，随舟而下，直至天际，一气呵成。',
      ],
      master_comments: [
        {
          critic: '王国维《人间词话》',
          comment: '“一切景语皆情语。孤帆远影碧空尽，唯见长江天际流，何等意境，真情深自见。”',
        },
      ],
      appreciation:
        '这首送别诗将离别的深情融于锦绣春色与辽阔江天之中。前两句以“烟花三月”点出风物之盛，后两句以目送孤帆写依依不舍之情。情深而不伤，气象高华，是盛唐诗歌极品。',
    },
    themes: ['friendship', 'farewell', 'spring'],
  },
];
