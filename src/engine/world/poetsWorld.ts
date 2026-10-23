export interface PoetWaypoint {
  year: number;
  cityId: string;
  status: string; // 当年历史行迹活动
  recentWork?: string; // 当年代表诗篇
}

export interface WorldPoet {
  id: string;
  name: string;
  courtesyName: string; // 字
  title: string; // 诗仙/诗圣/诗佛/边塞名家等
  avatarText: string;
  dynasty: 'tang' | 'song';
  birthYear: number;
  deathYear: number;
  color: string;
  waypoints: PoetWaypoint[];
}

// 唐代与同时代主要诗人历史行旅年表数据库
export const WORLD_POETS: Record<string, WorldPoet> = {
  // 1. 李白 (主角)
  li_bai: {
    id: 'li_bai',
    name: '李白',
    courtesyName: '太白',
    title: '青莲居士 · 诗仙',
    avatarText: '太白',
    dynasty: 'tang',
    birthYear: 701,
    deathYear: 762,
    color: '#047857',
    waypoints: [
      { year: 701, cityId: 'jiangyou', status: '蜀中青莲乡降诞，敏捷俊爽，博览百家。' },
      { year: 724, cityId: 'chengdu', status: '辞亲远游，仗剑去国，辞别巴蜀出峡。' },
      { year: 726, cityId: 'guangling', status: '漫游扬州，散金三十万，中秋思乡作《静夜思》。', recentWork: '《静夜思》' },
      { year: 730, cityId: 'jiangxia', status: '江夏黄鹤楼饯别孟浩然，极目长江碧水。', recentWork: '《黄鹤楼送孟浩然之广陵》' },
      { year: 742, cityId: 'chang_an', status: '玄宗诏令入京供奉翰林，名动金銮，醉草吓蛮书。', recentWork: '《清平调》' },
      { year: 744, cityId: 'luoyang', status: '赐金放还离京，抵洛阳初遇杜甫，同游梁宋登吹台。' },
      { year: 753, cityId: 'xunyang', status: '隐居庐山屏风叠，畅游五老峰，登临作啸。', recentWork: '《望庐山瀑布》' },
      { year: 755, cityId: 'jingxian', status: '漫游宣州泾县，桃花潭汪伦设酒款待，豪情赠诗。', recentWork: '《赠汪伦》' },
      { year: 757, cityId: 'xunyang', status: '入永王李璘幕府，旋即兵败被系浔阳狱中。' },
      { year: 759, cityId: 'kuizhou', status: '夜郎流放途中至巫山夔州遇赦东归，一日千里。', recentWork: '《早发白帝城》' },
      { year: 762, cityId: 'jinling', status: '寓居当涂族叔李阳冰处，抱病赋《临终歌》，乘风揽月仙逝。' },
    ],
  },

  // 2. 杜甫 (诗圣)
  du_fu: {
    id: 'du_fu',
    name: '杜甫',
    courtesyName: '子美',
    title: '少陵野老 · 诗圣',
    avatarText: '子美',
    dynasty: 'tang',
    birthYear: 712,
    deathYear: 770,
    color: '#B45309',
    waypoints: [
      { year: 712, cityId: 'luoyang', status: '生于巩县，少年豪纵，早岁读书开封洛阳。' },
      { year: 735, cityId: 'gusu', status: '漫游吴越，游历姑苏台、钱塘江。' },
      { year: 736, cityId: 'taiyuan', status: '游齐赵大地，登泰山极顶，胸怀万丈作《望岳》。', recentWork: '《望岳》' },
      { year: 744, cityId: 'luoyang', status: '洛阳与李白初相逢，情同骨肉，邀高适共饮吹台。' },
      { year: 746, cityId: 'chang_an', status: '赴长安应举受奸相李林甫所抑，客居京华困顿十年。', recentWork: '《兵车行》' },
      { year: 755, cityId: 'chang_an', status: '长安沦陷陷贼中，望城春草木，潸然作《春望》。', recentWork: '《春望》' },
      { year: 759, cityId: 'chengdu', status: '携家奔蜀，筑草堂于成都浣花溪畔，暂得栖息。', recentWork: '《茅屋为秋风所破歌》' },
      { year: 765, cityId: 'kuizhou', status: '出峡寓居夔州白帝城西阁，老病孤舟，悲秋作千古绝唱。', recentWork: '《登高》' },
      { year: 768, cityId: 'jiangxia', status: '出三峡舟泛洞庭岳阳，登岳阳楼作《登岳阳楼》。', recentWork: '《登岳阳楼》' },
    ],
  },

  // 3. 王维 (诗佛)
  wang_wei: {
    id: 'wang_wei',
    name: '王维',
    courtesyName: '摩诘',
    title: '摩诘居士 · 诗佛',
    avatarText: '摩诘',
    dynasty: 'tang',
    birthYear: 701,
    deathYear: 761,
    color: '#0F766E',
    waypoints: [
      { year: 701, cityId: 'taiyuan', status: '蒲州祁县人，幼聪颖，九岁知属辞，工草隶善琵琶。' },
      { year: 721, cityId: 'chang_an', status: '长安状元及第，解褐太乐丞。' },
      { year: 737, cityId: 'chang_an', status: '以监察御史出塞凉州，大漠苍茫作《使至塞上》。', recentWork: '《使至塞上》' },
      { year: 742, cityId: 'chang_an', status: '居长安辋川别业，半官半隐，弹琴赋诗以乐终日。', recentWork: '《山居秋暝》' },
      { year: 756, cityId: 'chang_an', status: '安禄山破两京，被执迫受伪职，心向盛唐作《凝碧池》。' },
      { year: 758, cityId: 'chang_an', status: '两京收复，蒙肃宗赦免，迁尚书右丞。' },
    ],
  },

  // 4. 高适 (边塞豪侠)
  gao_shi: {
    id: 'gao_shi',
    name: '高适',
    courtesyName: '达夫',
    title: '渤海县侯 · 边塞宗匠',
    avatarText: '达夫',
    dynasty: 'tang',
    birthYear: 704,
    deathYear: 765,
    color: '#9333EA',
    waypoints: [
      { year: 720, cityId: 'bianjing', status: '家贫落拓，客居宋州开封，躬耕取给，慷慨自喜。' },
      { year: 735, cityId: 'youzhou', status: '北上幽州蓟门，亲临边塞军旅，作千古名篇《燕歌行》。', recentWork: '《燕歌行》' },
      { year: 744, cityId: 'bianjing', status: '在开封迎候李白、杜甫，三贤并驾齐驱，登吹台畅谈天下。' },
      { year: 755, cityId: 'chang_an', status: '安史乱起，辅哥舒翰守潼关，后随玄宗奔蜀，封淮南节度使。' },
      { year: 757, cityId: 'guangling', status: '率大军驻节广陵扬州，讨伐永王李璘，克捷平叛。' },
      { year: 760, cityId: 'chengdu', status: '任蜀州刺史、剑南节度使，在成都常资助草堂杜甫。' },
    ],
  },

  // 5. 孟浩然 (山水高士)
  meng_haoran: {
    id: 'meng_haoran',
    name: '孟浩然',
    courtesyName: '浩然',
    title: '鹿门高士 · 山水宗师',
    avatarText: '浩然',
    dynasty: 'tang',
    birthYear: 689,
    deathYear: 740,
    color: '#0284C7',
    waypoints: [
      { year: 689, cityId: 'jiangxia', status: '隐居襄阳鹿门山，采菊赋诗，清旷独绝。', recentWork: '《过故人庄》' },
      { year: 725, cityId: 'guangling', status: '南游吴越，漫步广陵扬州瘦西湖畔，春水碧波。' },
      { year: 728, cityId: 'chang_an', status: '入长安应进士举不第，与王维交游，玄宗闻其诗。' },
      { year: 730, cityId: 'jiangxia', status: '在黄鹤楼同李白相别，乘一叶孤帆东下广陵。' },
      { year: 740, cityId: 'jiangxia', status: '病疽初愈，王昌龄过襄阳，相谈甚欢饮酒食鲜疾发卒。' },
    ],
  },

  // 6. 贺知章 (盛唐文范)
  he_zhizhang: {
    id: 'he_zhizhang',
    name: '贺知章',
    courtesyName: '季真',
    title: '四明狂客 · 秘书监',
    avatarText: '季真',
    dynasty: 'tang',
    birthYear: 659,
    deathYear: 744,
    color: '#E11D48',
    waypoints: [
      { year: 725, cityId: 'chang_an', status: '居长安为礼部侍郎、集贤院学士，德高望重。' },
      { year: 742, cityId: 'chang_an', status: '在长安初识李白，读《蜀道难》叹为谪仙，解金龟换酒相庆。' },
      { year: 744, cityId: 'linan', status: '八十六岁高龄告老辞官还乡，归抵越州杭州作《回乡偶书》。', recentWork: '《回乡偶书》' },
    ],
  },

  // 7. 苏轼 (宋代主角/行历)
  su_shi: {
    id: 'su_shi',
    name: '苏轼',
    courtesyName: '子瞻',
    title: '东坡居士 · 文宗',
    avatarText: '子瞻',
    dynasty: 'song',
    birthYear: 1037,
    deathYear: 1101,
    color: '#0F766E',
    waypoints: [
      { year: 1037, cityId: 'chengdu', status: '生于眉山，苏门三父子皆以雄文鸣天下。' },
      { year: 1057, cityId: 'bianjing', status: '同弟苏辙进京应试，欧阳修盛赞，一举中进士。' },
      { year: 1071, cityId: 'linan', status: '反对王安石急切变法，自请出京通判杭州，疏浚西湖。', recentWork: '《饮湖上初晴后雨》' },
      { year: 1079, cityId: 'bianjing', status: '乌台诗案爆发，自湖州被捕入御史台狱百日，九死一生。' },
      { year: 1080, cityId: 'jiangxia', status: '贬黄州团练副使，筑室东坡自耕，游赤壁作绝唱。', recentWork: '《念奴娇·赤壁怀古》' },
      { year: 1089, cityId: 'linan', status: '再知杭州，筑苏堤、建三潭印月，惠泽钱塘万民。' },
      { year: 1094, cityId: 'guangzhou', status: '哲宗亲政新党复起，贬惠州、再贬海南儋州，旷达度世。', recentWork: '《食荔枝》' },
      { year: 1101, cityId: 'gusu', status: '徽宗大赦北归，病逝于常州，归葬河南郏县。' },
    ],
  },

  // 8. 黄庭坚 (宋代文宗 · 苏门四学士)
  huang_tingjian: {
    id: 'huang_tingjian',
    name: '黄庭坚',
    courtesyName: '鲁直',
    title: '山谷道人 · 江西诗祖',
    avatarText: '鲁直',
    dynasty: 'song',
    birthYear: 1045,
    deathYear: 1105,
    color: '#D97706',
    waypoints: [
      { year: 1045, cityId: 'xunyang', status: '洪州分宁人，七岁作牧童诗，聪慧过人。' },
      { year: 1067, cityId: 'bianjing', status: '汴京及进士第，苏轼见其诗大喜，两人结为挚友。' },
      { year: 1086, cityId: 'bianjing', status: '元祐初起为秘书省正字，修《神宗实录》。' },
      { year: 1095, cityId: 'kuizhou', status: '新党得势被贬黔州、戎州，游历三峡白帝城。' },
      { year: 1105, cityId: 'guangzhou', status: '贬宜州除名，病逝于城南戍楼，旷达自若。' },
    ],
  },
};

// 计算某朝代在特定年份各诗人的即时坐标与状态
export function getPoetLocationsAtYear(
  dynasty: 'tang' | 'song',
  currentYear: number,
  excludePoetId?: string
): Array<{
  poet: WorldPoet;
  currentCityId: string;
  status: string;
  recentWork?: string;
  isAlive: boolean;
  age: number;
}> {
  const result: Array<{
    poet: WorldPoet;
    currentCityId: string;
    status: string;
    recentWork?: string;
    isAlive: boolean;
    age: number;
  }> = [];

  Object.values(WORLD_POETS).forEach((poet) => {
    if (poet.dynasty !== dynasty) return;
    if (excludePoetId && poet.id === excludePoetId) return;

    const isAlive = currentYear >= poet.birthYear && currentYear <= poet.deathYear;
    const age = Math.max(0, currentYear - poet.birthYear);

    // 寻找在当前年份或之前最近的一个足迹节点
    let matchedWaypoint = poet.waypoints[0];
    for (const wp of poet.waypoints) {
      if (wp.year <= currentYear) {
        matchedWaypoint = wp;
      } else {
        break;
      }
    }

    // 校验该城市在全国地图库中存在
    const cityId = matchedWaypoint ? matchedWaypoint.cityId : 'chang_an';

    result.push({
      poet,
      currentCityId: cityId,
      status: matchedWaypoint ? matchedWaypoint.status : '隐遁山水，闭门读书。',
      recentWork: matchedWaypoint ? matchedWaypoint.recentWork : undefined,
      isAlive,
      age,
    });
  });

  return result;
}
