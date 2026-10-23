export type ChronicleEventType = 'world_event' | 'poet_movement' | 'poem_creation';

export interface ChronicleItem {
  id: string;
  year: number;
  dynasty: 'tang' | 'song';
  type: ChronicleEventType;
  title: string;
  summary: string;
  cityId: string; // 关联城市 ID (点击即可在地图上居中高亮)
  poetName?: string;
  poemTitle?: string;
  tag: string;
}

// 盛唐与两宋宏大世界历史风云与文人纪事总库
export const WORLD_CHRONICLES: ChronicleItem[] = [
  // ===================== 唐代风云纪事 (701 - 762) =====================
  {
    id: 't_701_libai_birth',
    year: 701,
    dynasty: 'tang',
    type: 'poet_movement',
    title: '青莲初啼 · 谪仙降世',
    summary: '李白生于蜀中绵州昌明县青莲乡，天资敏锐，其母梦太白金星入怀而诞，故名白。',
    cityId: 'jiangyou',
    poetName: '李白',
    tag: '文人降世',
  },
  {
    id: 't_712_dufu_birth',
    year: 712,
    dynasty: 'tang',
    type: 'poet_movement',
    title: '少陵降诞 · 诗圣初生',
    summary: '杜甫生于河南巩县，自幼好学，七岁思发，发语惊人，“七龄思即壮，开口咏凤凰”。',
    cityId: 'luoyang',
    poetName: '杜甫',
    tag: '文人降世',
  },
  {
    id: 't_713_kaiyuan_reign',
    year: 713,
    dynasty: 'tang',
    type: 'world_event',
    title: '开元肇基 · 盛世华章启幕',
    summary: '唐玄宗李隆基改元开元，任用姚崇、宋璟等一代名相，开创开元全盛大治之世。',
    cityId: 'chang_an',
    tag: '天下大势',
  },
  {
    id: 't_724_libai_out_shu',
    year: 724,
    dynasty: 'tang',
    type: 'poet_movement',
    title: '仗剑去国 · 辞别蜀中山川',
    summary: '二十四岁李白辞亲远游，乘舟顺岷江而下出三峡，“仗剑去国，辞亲远游，南穷苍梧，东涉溟海”。',
    cityId: 'chengdu',
    poetName: '李白',
    tag: '文人出蜀',
  },
  {
    id: 't_726_jingyesi',
    year: 726,
    dynasty: 'tang',
    type: 'poem_creation',
    title: '广陵客舍 · 千古《静夜思》问世',
    summary: '李白漫游扬州客居客舍，逢中秋望月忽发重病，孤凄思乡作下传唱千载的《静夜思》。',
    cityId: 'guangling',
    poetName: '李白',
    poemTitle: '静夜思',
    tag: '名篇问世',
  },
  {
    id: 't_730_huanghelou_parting',
    year: 730,
    dynasty: 'tang',
    type: 'poet_movement',
    title: '黄鹤饯行 · 烟花三月下扬州',
    summary: '李白与好友孟浩然相聚武昌黄鹤楼，极目万里长江，挥毫作《黄鹤楼送孟浩然之广陵》。',
    cityId: 'jiangxia',
    poetName: '李白 / 孟浩然',
    poemTitle: '黄鹤楼送孟浩然之广陵',
    tag: '文人会聚',
  },
  {
    id: 't_736_wangyue',
    year: 736,
    dynasty: 'tang',
    type: 'poem_creation',
    title: '齐鲁放怀 · 杜甫极顶赋《望岳》',
    summary: '青年杜甫漫游齐赵，登泰山绝顶，心怀宏图壮志，写就“会当凌绝顶，一览众山小”。',
    cityId: 'taiyuan',
    poetName: '杜甫',
    poemTitle: '望岳',
    tag: '名篇问世',
  },
  {
    id: 't_742_tianbao_reign',
    year: 742,
    dynasty: 'tang',
    type: 'world_event',
    title: '天宝初更 · 帝京繁华绝顶',
    summary: '唐玄宗改元天宝。四海升平，万国衣冠拜冕旒，盛唐气象达于巅峰。',
    cityId: 'chang_an',
    tag: '天下大势',
  },
  {
    id: 't_742_jinluan_call',
    year: 742,
    dynasty: 'tang',
    type: 'poet_movement',
    title: '奉诏入京 · 谪仙供奉金銮殿',
    summary: '唐玄宗闻李白诗名，宣召入京，降辇步迎，以七宝床赐食，命供奉翰林，草拟国书。',
    cityId: 'chang_an',
    poetName: '李白',
    tag: '翰林风采',
  },
  {
    id: 't_744_hezhizhang_home',
    year: 744,
    dynasty: 'tang',
    type: 'poet_movement',
    title: '四明狂客归越 · 赋《回乡偶书》',
    summary: '八十六岁高龄秘书监贺知章告老致仕，玄宗亲赠诗饯别。归抵越州杭州作《回乡偶书》。',
    cityId: 'linan',
    poetName: '贺知章',
    poemTitle: '回乡偶书',
    tag: '名士还乡',
  },
  {
    id: 't_744_ldh_meet',
    year: 744,
    dynasty: 'tang',
    type: 'poet_movement',
    title: '千古奇遇 · 李杜高三杰会盟洛阳',
    summary: '李白赐金放还抵达东都洛阳，与困居的杜甫相会，结识高适，三人并辔同游梁宋登吹台，青史生辉！',
    cityId: 'luoyang',
    poetName: '李白 / 杜甫 / 高适',
    tag: '诗坛盛事',
  },
  {
    id: 't_753_wangwei_wangchuan',
    year: 753,
    dynasty: 'tang',
    type: 'poem_creation',
    title: '辋川闲居 · 王维挥就水墨禅境',
    summary: '王维隐居蓝田辋川，焚香独坐，弹琴复长啸，写就《山居秋暝》《竹里馆》诸般空灵名篇。',
    cityId: 'chang_an',
    poetName: '王维',
    poemTitle: '山居秋暝',
    tag: '名篇问世',
  },
  {
    id: 't_755_anshiluan_burst',
    year: 755,
    dynasty: 'tang',
    type: 'world_event',
    title: '渔阳鼙鼓 · 安史之乱爆发震荡两京',
    summary: '范阳节度使安禄山起兵十五万反唐，势如破竹席卷河北，潼关危急，盛世风华瞬间转入干戈涂炭！',
    cityId: 'youzhou',
    tag: '时代巨变',
  },
  {
    id: 't_755_zengwanglun',
    year: 755,
    dynasty: 'tang',
    type: 'poem_creation',
    title: '桃花深潭 · 李白汪伦豪情别宴',
    summary: '李白漫游宣州泾县，桃花潭村豪汪伦酿酒相待，李白登舟欲行闻踏歌声，作下千古《赠汪伦》。',
    cityId: 'jingxian',
    poetName: '李白',
    poemTitle: '赠汪伦',
    tag: '名篇问世',
  },
  {
    id: 't_756_mawei_crisis',
    year: 756,
    dynasty: 'tang',
    type: 'world_event',
    title: '两京沦陷 · 马嵬兵变玄宗幸蜀',
    summary: '潼关失守，长安陷落。玄宗仓皇入蜀避乱，六军不发驻马嵬驿；太子李亨北上灵武即皇帝位（肃宗）。',
    cityId: 'chang_an',
    tag: '天下大势',
  },
  {
    id: 't_757_chunwang',
    year: 757,
    dynasty: 'tang',
    type: 'poem_creation',
    title: '国破山河 · 杜甫陷贼血泪书《春望》',
    summary: '杜甫陷贼于长安城中，目睹山河倾颓与长安残破，涕泗横流作《春望》“感时花溅泪，恨别鸟惊心”。',
    cityId: 'chang_an',
    poetName: '杜甫',
    poemTitle: '春望',
    tag: '名篇问世',
  },
  {
    id: 't_757_yongwang_incident',
    year: 757,
    dynasty: 'tang',
    type: 'world_event',
    title: '永王起兵败绩 · 浔阳系狱大祸临头',
    summary: '永王李璘起兵欲据长江半壁，高适奉肃宗诏统兵讨灭。入幕李白牵连系浔阳大狱，命悬一线。',
    cityId: 'xunyang',
    poetName: '李白 / 高适',
    tag: '波谲云诡',
  },
  {
    id: 't_759_baidicheng_amnesty',
    year: 759,
    dynasty: 'tang',
    type: 'poem_creation',
    title: '巫峡赦还 · 千里江陵《早发白帝城》',
    summary: '李白长流夜郎途中行至白帝城，忽闻朝廷大赦，狂喜下峡乘舟东归，赋诗“朝辞白帝彩云间，千里江陵一日还”。',
    cityId: 'kuizhou',
    poetName: '李白',
    poemTitle: '早发白帝城',
    tag: '绝唱诞生',
  },
  {
    id: 't_759_dufu_caotang',
    year: 759,
    dynasty: 'tang',
    type: 'poet_movement',
    title: '避乱入蜀 · 杜甫落户成都浣花草堂',
    summary: '杜甫弃官携家远徙巴蜀，在友人高适、严武资助下于成都浣花溪筑草堂，暂得安居耕读。',
    cityId: 'chengdu',
    poetName: '杜甫',
    tag: '草堂安居',
  },
  {
    id: 't_762_libai_farewell',
    year: 762,
    dynasty: 'tang',
    type: 'poet_movement',
    title: '骑鲸捉月 · 诗仙李白当涂仙逝',
    summary: '代宗宝应元年，六十二岁李白客居当涂族叔李阳冰处，抱病赋《临终歌》，一代诗仙乘风揽月归真。',
    cityId: 'jinling',
    poetName: '李白',
    tag: '诗仙羽化',
  },

  // ===================== 宋代风云纪事 (1037 - 1101) =====================
  {
    id: 's_1037_sushi_birth',
    year: 1037,
    dynasty: 'song',
    type: 'poet_movement',
    title: '东坡初降 · 眉山三苏文运兴',
    summary: '苏轼生于四川眉山，自幼在父苏洵、母程夫人教导下攻读经史，早岁即有匡世之志。',
    cityId: 'chengdu',
    poetName: '苏轼',
    tag: '文宗降诞',
  },
  {
    id: 's_1057_bianjing_exam',
    year: 1057,
    dynasty: 'song',
    type: 'poet_movement',
    title: '龙虎榜发 · 欧阳修大赏苏轼奇文',
    summary: '苏轼同弟苏辙赴汴京礼部试，主考官欧阳修读其文大喜，叹曰：“老夫当避路，放他出一头地也！”',
    cityId: 'bianjing',
    poetName: '苏轼',
    tag: '一举成名',
  },
  {
    id: 's_1079_wutai_case',
    year: 1079,
    dynasty: 'song',
    type: 'world_event',
    title: '乌台诗案 · 满朝震撼御史台狱',
    summary: '新党御史李定等摘苏轼诗句罗织罪名，苏轼自湖州被押往汴京御史台狱受审百余日，九死一生。',
    cityId: 'bianjing',
    poetName: '苏轼',
    tag: '命运巨变',
  },
  {
    id: 's_1082_chibi',
    year: 1082,
    dynasty: 'song',
    type: 'poem_creation',
    title: '赤壁怀古 · 大江东去浪淘尽',
    summary: '苏轼贬谪黄州，夜泛赤壁矶，望惊涛拍岸写下千古第一豪放词《念奴娇·赤壁怀古》与《前后赤壁赋》。',
    cityId: 'jiangxia',
    poetName: '苏轼',
    poemTitle: '念奴娇·赤壁怀古',
    tag: '绝唱诞生',
  },
  {
    id: 's_1089_westlake',
    year: 1089,
    dynasty: 'song',
    type: 'poet_movement',
    title: '再知杭州 · 疏浚西湖筑苏公堤',
    summary: '苏轼重掌杭州，发动民力疏浚西湖葑草，筑长堤贯穿南北（苏堤），栽柳夹道，政通人和。',
    cityId: 'linan',
    poetName: '苏轼',
    tag: '造福一方',
  },
];

// 获取某年份当前及之前的所有世界纪事播报
export function getChroniclesUpToYear(
  dynasty: 'tang' | 'song',
  currentYear: number
): ChronicleItem[] {
  return WORLD_CHRONICLES.filter(
    (item) => item.dynasty === dynasty && item.year <= currentYear
  ).sort((a, b) => b.year - a.year); // 最新的排在最前
}

// 获取当前年份触发的最核心要闻
export function getCurrentYearHighlight(
  dynasty: 'tang' | 'song',
  currentYear: number
): ChronicleItem | undefined {
  return WORLD_CHRONICLES.find(
    (item) => item.dynasty === dynasty && item.year === currentYear
  );
}
