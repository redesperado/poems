export interface DynastyCityContent {
  name: string; // 当朝官方地名 (如: 长安 vs 京兆府)
  administrative_region: string; // 当朝行政区划 (如: 关内道 vs 永兴军路)
  dynasty_title: string; // 当朝地位称谓 (如: 大唐西京·万国之都)
  brief: string; // 当朝核心气象简述
  humanities_history: string; // 纯当朝历史背景与人文风貌（严禁混杂其他朝代）
  famous_poems: Array<{
    title: string;
    author: string;
    verse: string;
  }>;
  scenic_spots: string[]; // 当朝胜迹
  local_specialty: string; // 当朝特产物产
}

export interface CityCulturalData {
  id: string;
  name_cn: string; // 通用通用名
  name_modern: string; // 现代城市
  coordinates: [number, number]; // [经度, 纬度] (真实地理坐标)
  landscape_banner_theme: string; // 意境横幅主题
  tang: DynastyCityContent;
  song: DynastyCityContent;
}

export const MAJOR_CITIES: Record<string, CityCulturalData> = {
  chang_an: {
    id: 'chang_an',
    name_cn: '长安',
    name_modern: '陕西西安',
    coordinates: [108.94, 34.34],
    landscape_banner_theme: 'changan_palace',
    tang: {
      name: '长安（西京）',
      administrative_region: '关内道·京畿',
      dynasty_title: '大唐西京·万国帝都',
      brief: '九天阊阖开宫殿，万国衣冠拜冕旒。盛唐天街，百千家似围棋局。',
      humanities_history:
        '大唐帝国的心脏，天下第一都会，人口逾百万。李白在此供奉翰林、醉草吓蛮书；杜甫在此困居十年、沉郁顿挫；王维在此辋川隐居、赋诗酬唱。城内设有一百零八坊与东西两市，胡姬酒肆云集，万邦使节汇聚朝贡，展现出无可匹敌的开放与宏伟气魄。',
      famous_poems: [
        {
          title: '清平调·其一',
          author: '李白',
          verse: '云想衣裳花想容，春风拂槛露华浓。',
        },
        {
          title: '登科后',
          author: '孟郊',
          verse: '春风得意马蹄疾，一日看尽长安花。',
        },
        {
          title: '秋兴八首·其一',
          author: '杜甫',
          verse: '玉露凋伤枫树林，巫山巫峡气萧森。',
        },
      ],
      scenic_spots: ['大明宫含元殿', '大雁塔慈恩寺', '曲江池杏园', '华清池', '兴庆宫沉香亭'],
      local_specialty: '西域三彩、三勒浆葡萄酒、长安软裹、秦腔杂耍',
    },
    song: {
      name: '京兆府',
      administrative_region: '永兴军路',
      dynasty_title: '西北军政要枢·关陇锁钥',
      brief: '雄关阻河渭，重镇控西陲。金石碑林藏古韵。',
      humanities_history:
        '宋代降长安为京兆府，设永兴军路节度使，为北宋防范西北西夏政权之前哨重镇。虽无大唐帝国万国来朝之繁盛，但文教极盛。北宋张载在此创立“关学”，吕大防绘制《长安图》，富弼、范祥相继治抚关陇，兴修水利，驻扎重兵以御西夏。',
      famous_poems: [
        {
          title: '次韵和王安石过关中',
          author: '苏轼',
          verse: '西行千里见京兆，万古兴亡一叹嗟。',
        },
        {
          title: '横渠四句',
          author: '张载',
          verse: '为天地立心，为生民立命，为往圣继绝学，为万世开太平。',
        },
      ],
      scenic_spots: ['西安碑林（元祐年间建）', '终南山楼观台', '华山玉泉院', '灞桥驿站'],
      local_specialty: '关陇澄泥砚、金石拓片、西凤美酒',
    },
  },
  luoyang: {
    id: 'luoyang',
    name_cn: '洛阳',
    name_modern: '河南洛阳',
    coordinates: [112.45, 34.62],
    landscape_banner_theme: 'luoyang_peony',
    tang: {
      name: '神都洛阳（东都）',
      administrative_region: '河南道·都畿',
      dynasty_title: '盛唐神都·大运河枢纽',
      brief: '千年帝都，牡丹之城。洛水贯流，天下文宗相会之圣境。',
      humanities_history:
        '武周时期定为神都，大唐高宗、玄宗频年驾幸东都。公元744年，四十四岁的李白与三十三岁的杜甫在此首次相遇，诗坛双星交汇，携手同游梁宋。大运河在此交汇，洛阳南市商贾繁荣，龙门卢舍那大佛依山开凿，庄严辉煌。',
      famous_poems: [
        {
          title: '春夜洛城闻笛',
          author: '李白',
          verse: '谁家玉笛暗飞声，散入春风满洛城。',
        },
        {
          title: '芙蓉楼送辛渐',
          author: '王昌龄',
          verse: '洛阳亲友如相问，一片冰心在玉壶。',
        },
      ],
      scenic_spots: ['龙门石窟奉先寺', '白马寺', '天津桥洛水', '上阳宫', '定鼎门'],
      local_specialty: '洛阳唐三彩、洛阳水席、杜康原浆酒',
    },
    song: {
      name: '河南府（西京）',
      administrative_region: '京西北路',
      dynasty_title: '北宋西京·洛学圣地',
      brief: '名公硕学退居之所，牡丹天下第一奇。',
      humanities_history:
        '北宋建都汴京后，定洛阳为西京河南府。成为北宋重臣宿儒致仕退隐首选之地。司马光居洛阳独乐园十五载，专心修撰《资治通鉴》；二程先生在此讲授理学，开创“洛学”源流；欧阳修作《洛阳牡丹记》，使洛阳牡丹声名播于四海。',
      famous_poems: [
        {
          title: '洛阳雨中感怀',
          author: '欧阳修',
          verse: '洛阳地脉花最宜，牡丹尤为天下奇。',
        },
        {
          title: '独乐园寄题',
          author: '司马光',
          verse: '平生所学唯忠信，独乐园中看晚风。',
        },
      ],
      scenic_spots: ['独乐园遗址', '伊川程颢故里', '龙门香山寺', '天王寺花圃'],
      local_specialty: '洛阳魏紫牡丹、西京酥点、澄泥砚台',
    },
  },
  kaifeng: {
    id: 'kaifeng',
    name_cn: '开封',
    name_modern: '河南开封',
    coordinates: [114.34, 34.79],
    landscape_banner_theme: 'kaifeng_bianjing',
    tang: {
      name: '汴州',
      administrative_region: '河南道',
      dynasty_title: '大唐宣武军藩镇·汴水通衢',
      brief: '汴水清浊奔淮海，商船万斛出中原。',
      humanities_history:
        '唐代为汴州宣武军节度使驻地。控扼通济渠（汴水）与黄河航运要冲，江淮租米顺流而上入洛阳必经此地。李白、杜甫与高适曾在此登吹台痛饮，赋诗酬唱。中唐后成为兵家必争之雄镇。',
      famous_poems: [
        {
          title: '夜宴左氏庄',
          author: '杜甫',
          verse: '检书烧烛短，看剑引杯长。',
        },
        {
          title: '汴水流',
          author: '白居易',
          verse: '汴水流，泗水流，流到瓜洲古渡头。',
        },
      ],
      scenic_spots: ['古吹台（禹王台）', '相国寺初建遗址', '汴河古渡', '仓储大库'],
      local_specialty: '汴水红花鲤、中原石碾糕、宣武官瓷',
    },
    song: {
      name: '东京开封府（汴京）',
      administrative_region: '京畿路·首都',
      dynasty_title: '大宋东京·天下繁华极境',
      brief: '八荒争凑，万国咸通。人口百万，夜市通宵不绝。',
      humanities_history:
        '赵匡胤陈桥兵变建立大宋，定都开封。八朝古都中最辉煌之顶峰，《清明上河图》所绘之原型。城内彻底打破唐代坊市昼夜界限，御街两旁茶肆酒楼林立，相国寺万姓交易，桑家瓦子勾栏百戏，孕育出苏轼、柳永、周邦彦等无数宋词巨匠。',
      famous_poems: [
        {
          title: '望海潮·江南汴京忆',
          author: '柳永',
          verse: '乘醉听箫鼓，吟赏烟霞。',
        },
        {
          title: '破阵子·春景',
          author: '晏殊',
          verse: '池上碧苔三四点，叶底黄鹂一两声。日长飞絮轻。',
        },
      ],
      scenic_spots: ['大相国寺万姓交易', '州桥明月', '铁塔（开宝寺塔）', '金明池争标', '繁塔'],
      local_specialty: '汴京烤鸭、开封灌汤包子、宋代汴绣、州桥夜市熟食',
    },
  },
  hangzhou: {
    id: 'hangzhou',
    name_cn: '杭州',
    name_modern: '浙江杭州',
    coordinates: [120.15, 30.27],
    landscape_banner_theme: 'hangzhou_westlake',
    tang: {
      name: '杭州（余杭郡）',
      administrative_region: '江南东道',
      dynasty_title: '江南水乡胜地·运河南端',
      brief: '江南忆，最忆是杭州。山寺月中寻桂子，郡亭枕上看潮头。',
      humanities_history:
        '隋代开通江南运河，杭州自此成为南北水运南端起讫点。中唐白居易任杭州刺史，筑白堤以蓄钱塘湖水灌溉农田千顷，留下无数西湖绝妙诗篇，杭州自此由寻常州府一跃成为天下名胜之冠。',
      famous_poems: [
        {
          title: '钱塘湖春行',
          author: '白居易',
          verse: '几处早莺争暖树，谁家新燕啄春泥。乱花渐欲迷人眼，浅草才能没马蹄。',
        },
        {
          title: '忆江南',
          author: '白居易',
          verse: '江南好，风景旧曾谙。日出江花红胜火，春来江水绿如蓝。能不忆江南？',
        },
      ],
      scenic_spots: ['白沙堤（白堤）', '灵隐寺天竺峰', '钱塘江涌潮', '孤山古刹'],
      local_specialty: '杭罗丝绸、龙井绿茶、西湖莼菜',
    },
    song: {
      name: '临安府（行在）',
      administrative_region: '两浙西路·南宋都城',
      dynasty_title: '大宋行在·临安府',
      brief: '东南形胜，三吴都会，钱塘自古繁华。西湖歌舞几时休。',
      humanities_history:
        '北宋苏轼两度通判并知杭州，疏浚西湖构筑苏堤，写下“欲把西湖比西子”千古绝唱。靖康之难后，宋高宗赵构定都于此升为临安府。成为全国政治、文化与商业中心，画院画风秀逸，理学书院遍地，陆游、杨万里、辛弃疾皆在此留下感时伤世名篇。',
      famous_poems: [
        {
          title: '饮湖上初晴后雨',
          author: '苏轼',
          verse: '水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。',
        },
        {
          title: '望海潮',
          author: '柳永',
          verse: '重湖叠巘清嘉。有三秋桂子，十里荷花。羌管弄晴，菱歌泛夜。',
        },
        {
          title: '题临安邸',
          author: '林升',
          verse: '山外青山楼外楼，西湖歌舞几时休？暖风熏得游人醉，直把杭州作汴州！',
        },
      ],
      scenic_spots: ['苏堤春晓', '曲院风荷', '雷峰夕照', '南宋太庙皇城', '冷泉亭'],
      local_specialty: '南宋官窑青瓷、西湖龙井新茶、宋嫂鱼羹、东坡肉',
    },
  },
  yangzhou: {
    id: 'yangzhou',
    name_cn: '扬州',
    name_modern: '江苏扬州',
    coordinates: [119.41, 32.39],
    landscape_banner_theme: 'yangzhou_moon',
    tang: {
      name: '扬州（广陵）',
      administrative_region: '淮南道·治所',
      dynasty_title: '大唐东南第一都会·雄富甲天下',
      brief: '春风十里扬州路，卷上珠帘总不如。江淮盐铁大邑。',
      humanities_history:
        '扼长江与大运河十字水道，大唐素有“扬一益二”之美誉，富冠天下。李白青年辞亲远游，在扬州一年散金三十万，深秋客舍卧病写下千古名作《静夜思》；杜牧在扬州幕府留连十年，留下“二十四桥明月夜”风流佳话；波斯大食胡商云集，金银器皿精美绝伦。',
      famous_poems: [
        {
          title: '黄鹤楼送孟浩然之广陵',
          author: '李白',
          verse: '故人西辞黄鹤楼，烟花三月下扬州。孤帆远影碧空尽，唯见长江天际流。',
        },
        {
          title: '静夜思',
          author: '李白',
          verse: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        },
        {
          title: '寄扬州韩绰判官',
          author: '杜牧',
          verse: '青山隐隐水迢迢，秋尽江南草未凋。二十四桥明月夜，玉人何处教吹箫？',
        },
      ],
      scenic_spots: ['二十四桥古月', '禅智寺竹林', '蜀冈古刹', '瓜洲古渡'],
      local_specialty: '扬州玉雕、扬州漆器、唐代金银螺钿',
    },
    song: {
      name: '扬州（江都）',
      administrative_region: '淮南东路·节度使驻地',
      dynasty_title: '淮左名都·竹西佳处',
      brief: '自胡马窥江去后，废池乔木，犹厌言兵。二十四桥仍在，波心荡，冷月无声。',
      humanities_history:
        '宋代欧阳修任扬州太守，在蜀冈筑平山堂，邀苏轼等文友赋诗“手植堂前柳”。两宋之交，金兀术骑兵南侵，扬州毁于战火，由繁华都会变为江淮国防最前沿。姜夔绍熙年间过扬州，抚今追昔写下千古悲歌《扬州慢》。',
      famous_poems: [
        {
          title: '扬州慢·淮左名都',
          author: '姜夔',
          verse: '淮左名都，竹西佳处，解鞍少驻初程。过春风十里，尽荠麦青青。',
        },
        {
          title: '朝中措·平山堂感旧',
          author: '欧阳修',
          verse: '平山栏槛倚晴空，山色有无中。手种堂前垂柳，别来几度春风。',
        },
      ],
      scenic_spots: ['欧阳修平山堂', '竹西亭遗址', '大明寺栖灵塔', '瘦西湖前身白塔'],
      local_specialty: '江都琼花露酒、宋式灌汤包、淮南贡盐',
    },
  },
  jiujiang: {
    id: 'jiujiang',
    name_cn: '浔阳',
    name_modern: '江西九江',
    coordinates: [115.98, 29.72],
    landscape_banner_theme: 'lushan_waterfall',
    tang: {
      name: '浔阳（江州）',
      administrative_region: '江南西道',
      dynasty_title: '九派浔阳·匡庐仙岳',
      brief: '日照香炉生紫烟，飞流直下三千尺。江州司马青衫湿。',
      humanities_history:
        '长江中游南岸要冲，控鄱阳湖口。李白一生五次登临匡庐峰峦，在香炉峰下写就《望庐山瀑布》；元和十年白居易贬为江州司马，浔阳江头夜送客，忽闻江上琵琶声，感极涕零创作《琵琶行》，名满四海。',
      famous_poems: [
        {
          title: '望庐山瀑布',
          author: '李白',
          verse: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
        },
        {
          title: '琵琶行',
          author: '白居易',
          verse: '同是天涯沦落人，相逢何必曾相识！',
        },
      ],
      scenic_spots: ['庐山香炉峰瀑布', '琵琶亭', '东林寺白莲社', '浔阳江楼'],
      local_specialty: '庐山云雾御茶、浔阳封缸黄酒、鄱阳湖银鱼',
    },
    song: {
      name: '江州',
      administrative_region: '江南东路',
      dynasty_title: '理学白鹿洞·名山千载胜境',
      brief: '不识庐山真面目，只缘身在此山中。白鹿洞理学圣殿。',
      humanities_history:
        '宋代江州成为江南儒学与禅宗重镇。苏轼由黄州赴汝州途中游庐山，在西林寺壁题下千古哲理诗《题西林壁》；南宋理学大儒朱熹出任江州知事，重修白鹿洞书院，订立白鹿洞规，奠定数百年东亚书院教化准绳。',
      famous_poems: [
        {
          title: '题西林壁',
          author: '苏轼',
          verse: '横看成岭侧成峰，远近高低各不同。不识庐山真面目，只缘身在此山中。',
        },
        {
          title: '白鹿洞书院有感',
          author: '朱熹',
          verse: '问渠那得清如许？为有源头活水来。',
        },
      ],
      scenic_spots: ['白鹿洞书院', '西林寺苏轼题壁', '三叠泉绝景', '秀峰精舍'],
      local_specialty: '宋版白鹿洞古籍、庐山云雾古茶、青石碑刻',
    },
  },
  huangzhou: {
    id: 'huangzhou',
    name_cn: '黄州',
    name_modern: '湖北黄冈',
    coordinates: [114.88, 30.45],
    landscape_banner_theme: 'huangzhou_redcliff',
    tang: {
      name: '黄州（齐安郡）',
      administrative_region: '淮南道',
      dynasty_title: '大江淮南要津·古齐安郡',
      brief: '江汉之滨，竹楼风月。古有赤壁争霸战守之遗风。',
      humanities_history:
        '唐代为淮南道齐安郡。杜牧曾任黄州刺史，政事通达之余，游赤壁矶，作《赤壁》诗“东风不与周郎便，铜雀春深锁二乔”，借千古兴亡抒发才人怀才不遇之慨叹。',
      famous_poems: [
        {
          title: '赤壁',
          author: '杜牧',
          verse: '折戟沉沙铁未销，自将磨洗认前朝。东风不与周郎便，铜雀春深锁二乔。',
        },
      ],
      scenic_spots: ['赤壁矶头', '黄州古竹楼', '安国寺古木'],
      local_specialty: '齐安白酒、江汉鲜鳜鱼',
    },
    song: {
      name: '齐安郡黄州',
      administrative_region: '淮南西路',
      dynasty_title: '东坡居士文心涅槃地',
      brief: '大江东去，浪淘尽，千古风流人物。也无风雨也无晴。',
      humanities_history:
        '元丰三年苏轼因乌台诗案贬任黄州团练副使，无权无俸，躬耕东坡荒田，筑雪堂安顿全家。在此逆境之中，苏轼写就《念奴娇·赤壁怀古》、《前赤壁赋》、《后赤壁赋》及《定风波》，完成由普通官员向千古豪放词宗的人生飞跃。',
      famous_poems: [
        {
          title: '念奴娇·赤壁怀古',
          author: '苏轼',
          verse: '大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。',
        },
        {
          title: '定风波',
          author: '苏轼',
          verse: '竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。回首向来萧瑟处，归去，也无风雨也无晴。',
        },
      ],
      scenic_spots: ['东坡赤壁', '苏东坡雪堂遗址', '安国寺禅房', '栖霞楼'],
      local_specialty: '东坡肉、黄州烧梅、东坡手书拓本',
    },
  },
  baidicheng: {
    id: 'baidicheng',
    name_cn: '白帝城',
    name_modern: '重庆奉节',
    coordinates: [109.57, 31.04],
    landscape_banner_theme: 'baidi_gorge',
    tang: {
      name: '白帝城（夔州）',
      administrative_region: '剑南道',
      dynasty_title: '大唐三峡雄关·瞿塘门户',
      brief: '朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住。',
      humanities_history:
        '扼守瞿塘峡夔门险要，赤甲山与白盐山拔地如削。乾元二年李白流放夜郎途中行至白帝城，忽闻朝廷大赦天下，绝处逢生，乘轻舟一日疾驰顺江东返；杜甫暮年流落夔州两载，在白帝城写下“无边落木萧萧下，不尽长江滚滚来”等沉郁名作。',
      famous_poems: [
        {
          title: '早发白帝城',
          author: '李白',
          verse: '朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。',
        },
        {
          title: '登高',
          author: '杜甫',
          verse: '风急天高猿啸哀，渚清沙白鸟飞回。无边落木萧萧下，不尽长江滚滚来。',
        },
      ],
      scenic_spots: ['夔门天下雄', '白帝庙托孤堂', '赤甲古砦', '锁江铁索古遗址'],
      local_specialty: '巴山老腊肉、蜀江金橘、三峡石砚',
    },
    song: {
      name: '夔州白帝城',
      administrative_region: '夔州路·治所',
      dynasty_title: '两宋入蜀西津·夔门雄关',
      brief: '峡束长江一线天，西南半壁控荆蛮。',
      humanities_history:
        '宋代设夔州路，为两宋朝廷经略西南重镇。苏轼兄弟出蜀应试乘舟经此，陆游入蜀任官舟泊白帝城写下《入蜀记》，详述山峡雄奇险绝；南宋名将坚守瞿塘天险，锁江御敌，留存大量摩崖石刻与爱国绝笔。',
      famous_poems: [
        {
          title: '白帝城怀古',
          author: '陆游',
          verse: '江水东流去不回，英雄空有泪成堆。西风衰草夔门外，残日寒烟古砦开。',
        },
      ],
      scenic_spots: ['夔门锁江天险', '杜甫草堂奉节遗迹', '陆游登楼题字处'],
      local_specialty: '夔门雪桃、奉节老井茶、夔州皮纸',
    },
  },
  chengdu: {
    id: 'chengdu',
    name_cn: '成都',
    name_modern: '四川成都',
    coordinates: [104.06, 30.57],
    landscape_banner_theme: 'chengdu_bashu',
    tang: {
      name: '益州（南京成都府）',
      administrative_region: '剑南道·节度使治所',
      dynasty_title: '大唐南京·天府之国',
      brief: '九天开出一成都，万户千门入画图。扬一益二，蜀锦动天下。',
      humanities_history:
        '盛唐繁庶仅次于扬州。安史之乱爆发，唐玄宗避乱入蜀，升益州为南京成都府；杜甫为避关中战乱入蜀寓居浣花溪畔，营建浣花草堂，赋诗二百余首；女诗人薛涛创制薛涛笺，名动长安京华。',
      famous_poems: [
        {
          title: '春夜喜雨',
          author: '杜甫',
          verse: '好雨知时节，当春乃发生。随风潜入夜，润物细无声。',
        },
        {
          title: '蜀道难',
          author: '李白',
          verse: '问君西游何时还？畏途巉岩不可攀。但见悲鸟号古木，雄飞雌从绕林间。',
        },
        {
          title: '绝句四首·其三',
          author: '杜甫',
          verse: '两个黄鹂鸣翠柳，一行白鹭上青天。窗含西岭千秋雪，门泊东吴万里船。',
        },
      ],
      scenic_spots: ['杜甫浣花草堂', '武侯祠诸葛古殿', '薛涛望江楼草堂', '都江堰宝瓶口'],
      local_specialty: '蜀锦绫罗、薛涛诗笺、青羊宫素斋、剑南春美酒',
    },
    song: {
      name: '成都府',
      administrative_region: '成都府路·路治',
      dynasty_title: '大宋锦官城·世界上最早纸币诞生地',
      brief: '市列珠玑，户盈罗绮。交子行天下，文宗出西蜀。',
      humanities_history:
        '北宋初年十六家富商在成都首创世界上最早纸币“交子”，商业繁华冠绝西陲。三苏父子（苏洵、苏轼、苏辙）自眉山抵成都拜谒文伯，自此名扬天下；陆游晚年通判蜀州、任官成都，自号放翁，留有《剑南诗稿》千篇。',
      famous_poems: [
        {
          title: '梅花绝句',
          author: '陆游',
          verse: '二十里中香不断，青羊宫到浣花溪。当年走马锦城西，曾为梅花醉似泥。',
        },
      ],
      scenic_spots: ['成都交子官局旧址', '百花潭古渡', '大慈寺画壁', '三苏出蜀祠'],
      local_specialty: '交子纸钞复制本、蜀绣屏风、龙脑香花茶',
    },
  },
  wuhan: {
    id: 'wuhan',
    name_cn: '江夏',
    name_modern: '湖北武汉',
    coordinates: [114.30, 30.54],
    landscape_banner_theme: 'wuhan_crane',
    tang: {
      name: '江夏（鄂州）',
      administrative_region: '淮南道·江南西道交界',
      dynasty_title: '大唐江夏·黄鹤雄楼',
      brief: '昔人已乘黄鹤去，此地空余黄鹤楼。黄鹤楼中吹玉笛，江城五月落梅花。',
      humanities_history:
        '踞长江汉水交汇处，唐代名相李邕曾任江夏太守。崔颢在此题诗《黄鹤楼》，太白读后自叹弗如；李白青年于江夏为孟浩然壮行，晚年流放途中再登黄鹤楼，听玉笛落梅花，情韵千古。',
      famous_poems: [
        {
          title: '黄鹤楼',
          author: '崔颢',
          verse: '昔人已乘黄鹤去，此地空余黄鹤楼。黄鹤一去不复返，白云千载空悠悠。晴川历历汉阳树，芳草萋萋鹦鹉洲。',
        },
        {
          title: '与史郎中饮听黄鹤楼上吹笛',
          author: '李白',
          verse: '一为迁客去长沙，西望长安不见家。黄鹤楼中吹玉笛，江城五月落梅花。',
        },
      ],
      scenic_spots: ['黄鹤楼古基', '晴川阁晴川古渡', '鹦鹉洲芳草地', '古琴台'],
      local_specialty: '武昌江鱼、江夏生丝、汉水玉石',
    },
    song: {
      name: '鄂州（武昌）',
      administrative_region: '荆湖北路',
      dynasty_title: '两宋荆襄中枢·岳飞北伐誓师驻地',
      brief: '江汉雄镇，北望中原。岳家军驻节八载，忠魂长留。',
      humanities_history:
        '南宋绍兴年间，岳飞率岳家军以鄂州为大本营驻节八载，在此操练水陆三军，先后收复襄阳六郡与郑州洛阳，写下满江红悲壮誓词；陆游过鄂州登南楼，极目楚天，抚今悼昔。',
      famous_poems: [
        {
          title: '满江红·登黄鹤楼有感',
          author: '岳飞',
          verse: '遥望中原，荒烟外、许多城郭。想当年、花遮柳护，凤楼龙阁。万岁山前珠翠绕，蓬壶殿里笙歌作。',
        },
      ],
      scenic_spots: ['岳飞帅府遗迹', '黄鹤楼宋构旧址', '南楼月色', '赤壁东坡留足迹'],
      local_specialty: '鄂州武昌鱼、黄州宋瓷、荆湖麻布',
    },
  },
};
