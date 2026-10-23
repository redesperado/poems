export interface CityCulturalData {
  id: string;
  name_cn: string;
  name_modern: string;
  coordinates: [number, number]; // [经度, 纬度] (真实地理坐标)
  dynasty_names: {
    tang: string;
    song: string;
    [key: string]: string;
  };
  administrative_region: {
    tang: string; // 唐代道名 (如: 关内道, 河南道)
    song: string; // 宋代路名 (如: 京兆府路, 两浙路)
  };
  brief: string;
  landscape_banner_theme: string; // 城市特色意境主题（供视觉横幅呈现）
  famous_poems: Array<{
    title: string;
    author: string;
    verse: string;
  }>;
  humanities_history: string;
  scenic_spots: string[];
  local_specialty: string;
}

export const MAJOR_CITIES: Record<string, CityCulturalData> = {
  chang_an: {
    id: 'chang_an',
    name_cn: '长安',
    name_modern: '陕西西安',
    coordinates: [108.94, 34.34],
    dynasty_names: {
      tang: '长安（西京）',
      song: '京兆府',
    },
    administrative_region: {
      tang: '关内道',
      song: '永兴军路',
    },
    brief: '九天阊阖开宫殿，万国衣冠拜冕旒。十三朝古都，丝绸之路起点。',
    landscape_banner_theme: 'changan_palace',
    famous_poems: [
      {
        title: '登科后',
        author: '孟郊',
        verse: '春风得意马蹄疾，一日看尽长安花。',
      },
      {
        title: '清平调',
        author: '李白',
        verse: '云想衣裳花想容，春风拂槛露华浓。',
      },
      {
        title: '秋兴八首',
        author: '杜甫',
        verse: '闻道长安似弈棋，百年世事不胜悲。',
      },
    ],
    humanities_history:
      '自西周、秦、汉以降，隋唐建大兴长安城，为当时全球最大都会，人口达百万。李白在此供奉翰林，杜甫在此困居求仕，白居易在此写下长恨歌。唐末遭朱温焚毁迁都洛阳，入宋降为京兆府，仍为西北重镇。',
    scenic_spots: ['大雁塔', '华清池', '曲江池', '大明宫遗址', '终南山'],
    local_specialty: '秦腔、稠酒、关中石雕、皮影戏',
  },
  luoyang: {
    id: 'luoyang',
    name_cn: '洛阳',
    name_modern: '河南洛阳',
    coordinates: [112.45, 34.62],
    dynasty_names: {
      tang: '神都洛阳（东都）',
      song: '河南府（西京）',
    },
    administrative_region: {
      tang: '河南道',
      song: '京西北路',
    },
    brief: '千年帝都，牡丹花城。隋唐大运河中枢，天下文人荟萃之所。',
    landscape_banner_theme: 'luoyang_peony',
    famous_poems: [
      {
        title: '芙蓉楼送辛渐',
        author: '王昌龄',
        verse: '洛阳亲友如相问，一片冰心在玉壶。',
      },
      {
        title: '春夜洛城闻笛',
        author: '李白',
        verse: '谁家玉笛暗飞声，散入春风满洛城。',
      },
      {
        title: '洛中感怀',
        author: '欧阳修',
        verse: '洛阳地脉花最宜，牡丹尤为天下奇。',
      },
    ],
    humanities_history:
      '四山环绕，五水交汇。武则天称帝定为神都，大兴佛寺。公元744年，李白与杜甫在洛阳首次相会，奠定了中国文学史上最深厚的友谊。北宋定为西京，司马光在此隐居十五年编撰《资治通鉴》，邵雍、程颐程颢理学宗师在此讲学。',
    scenic_spots: ['龙门石窟', '白马寺', '洛阳天街', '天津桥', '伊阙山'],
    local_specialty: '洛阳水席、洛阳牡丹、唐三彩、杜康酒',
  },
  kaifeng: {
    id: 'kaifeng',
    name_cn: '开封',
    name_modern: '河南开封',
    coordinates: [114.34, 34.79],
    dynasty_names: {
      tang: '汴州',
      song: '东京开封府（汴京）',
    },
    administrative_region: {
      tang: '河南道',
      song: '京畿路',
    },
    brief: '汴水流，泗水流。北宋清明上河图中的繁华绝顶之帝都。',
    landscape_banner_theme: 'kaifeng_bianjing',
    famous_poems: [
      {
        title: '题临安邸',
        author: '林升',
        verse: '暖风熏得游人醉，直把杭州作汴州。',
      },
      {
        title: '夜宴左氏庄',
        author: '杜甫',
        verse: '检书烧烛短，看剑引杯长。',
      },
    ],
    humanities_history:
      '唐代为宣武军节度使驻地汴州，扼汴河漕运咽喉。公元960年赵匡胤陈桥兵变建立宋朝，定都于此，史称东京汴京。城内商铺林立、瓦子夜市通宵达旦，孕育了极度繁盛的市民文化、瓦舍说书与宋词绝艺。',
    scenic_spots: ['大相国寺', '州桥遗址', '繁塔', '铁塔', '金明池'],
    local_specialty: '开封灌汤包、汴绣、朱仙镇木版年画',
  },
  hangzhou: {
    id: 'hangzhou',
    name_cn: '杭州',
    name_modern: '浙江杭州',
    coordinates: [120.15, 30.27],
    dynasty_names: {
      tang: '杭州（余杭）',
      song: '临安府（行在）',
    },
    administrative_region: {
      tang: '江南东道',
      song: '两浙西路',
    },
    brief: '水光潋滟晴方好，山色空蒙雨亦奇。江南天堂，两宋文心之薮。',
    landscape_banner_theme: 'hangzhou_westlake',
    famous_poems: [
      {
        title: '饮湖上初晴后雨',
        author: '苏轼',
        verse: '欲把西湖比西子，淡妆浓抹总相宜。',
      },
      {
        title: '钱塘湖春行',
        author: '白居易',
        verse: '乱花渐欲迷人眼，浅草才能没马蹄。',
      },
      {
        title: '望海潮',
        author: '柳永',
        verse: '东南形胜，三吴都会，钱塘自古繁华。',
      },
    ],
    humanities_history:
      '隋代开凿江南运河直达杭州。白居易修白堤、苏轼修苏堤，两代文宗令西湖名扬天下。南宋建炎南渡，宋高宗定都临安，杭州成为全国政治文化经济中心，画院画师辈出，江南士族清雅之风达于极致。',
    scenic_spots: ['西湖十景', '灵隐寺', '钱塘江潮', '孤山', '苏堤春晓'],
    local_specialty: '西湖龙井、杭罗丝绸、西湖醋鱼、龙泉青瓷',
  },
  yangzhou: {
    id: 'yangzhou',
    name_cn: '扬州',
    name_modern: '江苏扬州',
    coordinates: [119.41, 32.39],
    dynasty_names: {
      tang: '扬州（广陵）',
      song: '扬州（江都）',
    },
    administrative_region: {
      tang: '淮南道',
      song: '淮南东路',
    },
    brief: '天下三分明月夜，二分无赖是扬州。大运河与长江交汇的繁华古都。',
    landscape_banner_theme: 'yangzhou_moon',
    famous_poems: [
      {
        title: '寄扬州韩绰判官',
        author: '杜牧',
        verse: '二十四桥明月夜，玉人何处教吹箫。',
      },
      {
        title: '黄鹤楼送孟浩然之广陵',
        author: '李白',
        verse: '烟花三月下扬州，孤帆远影碧空尽。',
      },
      {
        title: '静夜思',
        author: '李白',
        verse: '举头望明月，低头思故乡。',
      },
    ],
    humanities_history:
      '因盐铁专卖与运河漕运，唐代素有“扬一益二”之美誉。李白青年游扬州一年散金三十万，卧病客舍写下《静夜思》；杜牧在扬州留下了十里珠帘的浪漫传说。宋代欧阳修知扬州建平山堂，苏轼亦两度造访。',
    scenic_spots: ['瘦西湖', '二十四桥', '平山堂', '个园', '大明寺'],
    local_specialty: '扬州炒饭、三丁包子、扬州漆器、玉雕',
  },
  nanjing: {
    id: 'nanjing',
    name_cn: '金陵',
    name_modern: '江苏南京',
    coordinates: [118.79, 32.06],
    dynasty_names: {
      tang: '金陵（升州/润州）',
      song: '江宁府（建康府）',
    },
    administrative_region: {
      tang: '江南东道',
      song: '江南东路',
    },
    brief: '江南佳丽地，金陵帝王州。六朝古都，虎踞龙盘。',
    landscape_banner_theme: 'nanjing_qinhuai',
    famous_poems: [
      {
        title: '乌衣巷',
        author: '刘禹锡',
        verse: '旧时王谢堂前燕，飞入寻常百姓家。',
      },
      {
        title: '泊秦淮',
        author: '杜牧',
        verse: '商女不知亡国恨，隔江犹唱后庭花。',
      },
      {
        title: '登金陵凤凰台',
        author: '李白',
        verse: '总为浮云能蔽日，长安不见使人愁。',
      },
    ],
    humanities_history:
      '三国东吴、东晋、宋齐梁陈六朝建都于此。李白一生多次造访金陵，登凤凰台、游白鹭洲；王安石晚年退隐江宁半山园；辛弃疾在建康通判任上写下《水龙吟·登建康赏心亭》，楚天千里清秋。',
    scenic_spots: ['秦淮河', '夫子庙', '乌衣巷', '玄武湖', '雨花台'],
    local_specialty: '南京云锦、盐水鸭、金陵折扇',
  },
  chengdu: {
    id: 'chengdu',
    name_cn: '成都',
    name_modern: '四川成都',
    coordinates: [104.06, 30.57],
    dynasty_names: {
      tang: '益州（南京成都府）',
      song: '成都府',
    },
    administrative_region: {
      tang: '剑南道',
      song: '成都府路',
    },
    brief: '九天开出一成都，万户千门入画图。水旱从人，不知饥馑的天府之国。',
    landscape_banner_theme: 'chengdu_bashu',
    famous_poems: [
      {
        title: '春夜喜雨',
        author: '杜甫',
        verse: '随风潜入夜，润物细无声。',
      },
      {
        title: '蜀道难',
        author: '李白',
        verse: '蜀道之难，难于上青天！',
      },
      {
        title: '绝句',
        author: '杜甫',
        verse: '窗含西岭千秋雪，门泊东吴万里船。',
      },
    ],
    humanities_history:
      '李白生于蜀地青莲镇，在此仗剑去国。安史之乱爆发后唐玄宗避难入蜀，升益州为南京成都府。杜甫入蜀营建杜甫草堂，作诗数百首。北宋成都诞生了世界上最早的纸币“交子”，蜀锦织造甲于天下。',
    scenic_spots: ['杜甫草堂', '武侯祠', '锦里', '青羊宫', '都江堰'],
    local_specialty: '蜀锦、蜀绣、川茶、青城山道家素席',
  },
  wuhan: {
    id: 'wuhan',
    name_cn: '江夏',
    name_modern: '湖北武汉',
    coordinates: [114.30, 30.54],
    dynasty_names: {
      tang: '江夏（鄂州）',
      song: '鄂州（武昌）',
    },
    administrative_region: {
      tang: '淮南道',
      song: '荆湖北路',
    },
    brief: '黄鹤楼高人何在，白云千载空悠悠。九省通衢，荆襄咽喉。',
    landscape_banner_theme: 'wuhan_crane',
    famous_poems: [
      {
        title: '黄鹤楼',
        author: '崔颢',
        verse: '昔人已乘黄鹤去，此地空余黄鹤楼。',
      },
      {
        title: '与史郎中饮听黄鹤楼上吹笛',
        author: '李白',
        verse: '黄鹤楼中吹玉笛，江城五月落梅花。',
      },
    ],
    humanities_history:
      '自三国东吴孙权筑夏口城，历代皆为军事战略要津。崔颢在此题诗《黄鹤楼》，李白读后叹服“眼前有景道不得，崔颢题诗在上头”。岳飞曾在鄂州驻军八载，誓师北伐收复襄汉。',
    scenic_spots: ['黄鹤楼', '晴川阁', '东湖', '鹦鹉洲遗址', '古琴台'],
    local_specialty: '武昌鱼、热干面、汉绣',
  },
  suzhou: {
    id: 'suzhou',
    name_cn: '姑苏',
    name_modern: '江苏苏州',
    coordinates: [120.58, 31.30],
    dynasty_names: {
      tang: '苏州（吴郡）',
      song: '平江府',
    },
    administrative_region: {
      tang: '江南东道',
      song: '两浙西路',
    },
    brief: '君到姑苏见，人家尽枕河。古宫闲地少，水巷小桥多。',
    landscape_banner_theme: 'suzhou_water',
    famous_poems: [
      {
        title: '枫桥夜泊',
        author: '张继',
        verse: '月落乌啼霜满天，江枫渔火对愁眠。姑苏城外寒山寺，夜半钟声到客船。',
      },
      {
        title: '送人游吴',
        author: '杜荀鹤',
        verse: '君到姑苏见，人家尽枕河。',
      },
    ],
    humanities_history:
      '春秋吴国古都，伍子胥建阖闾大城。唐代白居易、韦应物先后任苏州刺史。宋代改平江府，水运繁盛，苏绣名动四海，范仲淹创设苏州府学与范氏义庄，造福士人。',
    scenic_spots: ['寒山寺', '枫桥', '虎丘', '沧浪亭', '山塘街'],
    local_specialty: '苏绣、碧螺春茶、苏式糕点',
  },
  jiujiang: {
    id: 'jiujiang',
    name_cn: '浔阳',
    name_modern: '江西九江',
    coordinates: [115.98, 29.72],
    dynasty_names: {
      tang: '浔阳（江州）',
      song: '江州',
    },
    administrative_region: {
      tang: '江南西道',
      song: '江南东路',
    },
    brief: '浔阳江头夜送客，枫叶荻花秋瑟瑟。匡庐倚江，锁钥九派。',
    landscape_banner_theme: 'lushan_waterfall',
    famous_poems: [
      {
        title: '琵琶行',
        author: '白居易',
        verse: '同是天涯沦落人，相逢何必曾相识！',
      },
      {
        title: '望庐山瀑布',
        author: '李白',
        verse: '日照香炉生紫烟，遥看瀑布挂前川。',
      },
      {
        title: '题西林壁',
        author: '苏轼',
        verse: '不识庐山真面目，只缘身在此山中。',
      },
    ],
    humanities_history:
      '扼长江与鄱阳湖之咽喉，号称“三江之口，七省通衢”。南倚名山庐山，自东晋慧远结白莲社，陶渊明结庐柴桑，成为文人隐逸圣地。李白五次登临庐山，白居易贬任江州司马写下千古名篇《琵琶行》。宋代白鹿洞书院为天下四大书院之首。',
    scenic_spots: ['庐山瀑布', '白鹿洞书院', '琵琶亭', '浔阳楼', '东林寺'],
    local_specialty: '庐山云雾茶、九江封缸酒、九江茶饼',
  },
  huangzhou: {
    id: 'huangzhou',
    name_cn: '黄州',
    name_modern: '湖北黄冈',
    coordinates: [114.88, 30.45],
    dynasty_names: {
      tang: '黄州',
      song: '齐安郡黄州',
    },
    administrative_region: {
      tang: '淮南道',
      song: '淮南西路',
    },
    brief: '大江东去，浪淘尽，千古风流人物。苏东坡涅槃超凡之地。',
    landscape_banner_theme: 'huangzhou_redcliff',
    famous_poems: [
      {
        title: '念奴娇·赤壁怀古',
        author: '苏轼',
        verse: '人生如梦，一尊还酹江月。',
      },
      {
        title: '定风波',
        author: '苏轼',
        verse: '竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。',
      },
      {
        title: '前赤壁赋',
        author: '苏轼',
        verse: '寄蜉蝣于天地，渺沧海之一粟。',
      },
    ],
    humanities_history:
      '古齐安之地。北宋元丰三年（1080年），苏轼因乌台诗案被贬黄州团练副使，无权无禄。苏轼在城东高坡荒地耕种，自号“东坡居士”。在这里，他不仅研制了“东坡肉”，更在沙湖道中遇雨悟道，夜游赤壁写下两赋一词，完成了文心与人格的千古升华。',
    scenic_spots: ['东坡赤壁', '雪堂遗址', '安国寺', '栖霞楼'],
    local_specialty: '东坡肉、黄州烧梅、东坡饼',
  },
  baidicheng: {
    id: 'baidicheng',
    name_cn: '白帝城',
    name_modern: '重庆奉节',
    coordinates: [109.57, 31.04],
    dynasty_names: {
      tang: '白帝城（夔州）',
      song: '夔州白帝城',
    },
    administrative_region: {
      tang: '剑南道',
      song: '夔州路',
    },
    brief: '朝辞白帝彩云间，千里江陵一日还。三峡之首，雄峙峡口。',
    landscape_banner_theme: 'baidi_gorge',
    famous_poems: [
      {
        title: '早发白帝城',
        author: '李白',
        verse: '两岸猿声啼不住，轻舟已过万重山。',
      },
      {
        title: '登高',
        author: '杜甫',
        verse: '无边落木萧萧下，不尽长江滚滚来。',
      },
    ],
    humanities_history:
      '扼长江三峡夔门天险，赤甲山与白盐山对峙，两岸如削。西汉公孙述割据自立为白帝，蜀汉刘备兵败夷陵托孤于白帝城。李白在此闻赦放舟，杜甫在此寓居作《登高》《秋兴八首》，苏轼、陆游皆留有名篇。',
    scenic_spots: ['夔门天下雄', '白帝庙', '赤甲山', '托孤堂'],
    local_specialty: '奉节脐橙、夔门石刻',
  },
  beijing: {
    id: 'beijing',
    name_cn: '幽州',
    name_modern: '北京',
    coordinates: [116.40, 39.90],
    dynasty_names: {
      tang: '幽州（范阳）',
      song: '辽南京（燕京/中都）',
    },
    administrative_region: {
      tang: '河北道',
      song: '辽国南京析津府',
    },
    brief: '前不见古人，后不见来者。念天地之悠悠，独怆然而涕下！',
    landscape_banner_theme: 'youzhou_terrace',
    famous_poems: [
      {
        title: '登幽州台歌',
        author: '陈子昂',
        verse: '前不见古人，后不见来者。念天地之悠悠，独怆然而涕下！',
      },
      {
        title: '燕歌行',
        author: '高适',
        verse: '战士军前半死生，美人帐下犹歌舞！',
      },
    ],
    humanities_history:
      '古蓟城，北扼燕山要隘，南临华北大平原，为古代华北边防重镇。唐代安禄山兼任范阳节度使，蓄谋叛乱起兵于此。辽代升为南京析津府，金代迁都定名中都，开启了八百年帝都格局。',
    scenic_spots: ['黄金台遗址', '卢沟桥', '居庸关', '蓟门烟树'],
    local_specialty: '北京烤鸭、景泰蓝、二锅头酒',
  },
  taiyuan: {
    id: 'taiyuan',
    name_cn: '并州',
    name_modern: '山西太原',
    coordinates: [112.55, 37.87],
    dynasty_names: {
      tang: '太原府（北京）',
      song: '并州',
    },
    administrative_region: {
      tang: '河东道',
      song: '河东路',
    },
    brief: '控带山河，踞天下之肩背。大唐龙兴之地，晋风浩荡。',
    landscape_banner_theme: 'taiyuan_jin',
    famous_poems: [
      {
        title: '塞下曲',
        author: '王昌龄',
        verse: '撩乱边愁听不尽，高高秋月照长城。',
      },
      {
        title: '太原早秋',
        author: '李白',
        verse: '岁落江湖暮，霜生树木冬。',
      },
    ],
    humanities_history:
      '古晋阳城，赵国都城。隋末李渊、李世民父子在此起兵太原，建立李唐王朝，唐代定为“北京”。五代后晋、后汉、北汉相继建都。宋太宗赵光义水灌晋阳城，后在其北筑太原新城。',
    scenic_spots: ['晋祠', '天龙山石窟', '双塔寺', '蒙山大佛'],
    local_specialty: '山西老陈醋、平遥牛肉、太原刀削面',
  },
  xiangyang: {
    id: 'xiangyang',
    name_cn: '襄阳',
    name_modern: '湖北襄阳',
    coordinates: [112.14, 32.04],
    dynasty_names: {
      tang: '襄阳（襄州）',
      song: '襄阳府',
    },
    administrative_region: {
      tang: '山南东道',
      song: '京西南路',
    },
    brief: '襄阳好风日，留醉与山翁。南船北马，七省通衢之铁打襄阳。',
    landscape_banner_theme: 'xiangyang_hanriver',
    famous_poems: [
      {
        title: '襄阳歌',
        author: '李白',
        verse: '襄阳小儿齐拍手，拦截街衢叫平生。',
      },
      {
        title: '过故人庄',
        author: '孟浩然',
        verse: '开轩面场圃，把酒话桑麻。',
      },
    ],
    humanities_history:
      '汉水中游要津。孟浩然世居襄阳岘山鹿门，人称“孟襄阳”。宋元战争中，襄阳军民坚守城池六年之久，名震青史。金庸笔下郭靖黄蓉镇守襄阳的故事亦以此时为背景。',
    scenic_spots: ['古隆中', '鹿门山', '襄阳城墙', '岘山'],
    local_specialty: '襄阳牛肉面、孔明菜、黄酒',
  },
  guangzhou: {
    id: 'guangzhou',
    name_cn: '广州',
    name_modern: '广东广州',
    coordinates: [113.26, 23.13],
    dynasty_names: {
      tang: '广州（番禺）',
      song: '广州',
    },
    administrative_region: {
      tang: '岭南道',
      song: '广南东路',
    },
    brief: '南海明珠，海上丝绸之路发祥重镇。番坊蕃客云集。',
    landscape_banner_theme: 'guangzhou_port',
    famous_poems: [
      {
        title: '越王台',
        author: '苏轼',
        verse: '南来万里真良策，好向越王台上看。',
      },
      {
        title: '早发广州',
        author: '韩愈',
        verse: '曲江水满花千树，何日重游泛画船。',
      },
    ],
    humanities_history:
      '古称番禺，秦置南海郡。唐代设立中国历史上第一个外贸海关管理机构“市舶使”，接待大食、波斯等万国商贾。苏轼晚年流放岭南，经广州前往惠州与儋州，叹道“日啖荔枝三百颗，不辞长作岭南人”。',
    scenic_spots: ['光孝寺', '南海神庙', '镇海楼', '怀圣寺光塔'],
    local_specialty: '广绣、广彩、岭南佳果荔枝、粤式早茶',
  },
};
