import { PoetEncounterData } from '../../types/encounter';

export const HISTORICAL_ENCOUNTERS: Record<string, PoetEncounterData> = {
  // =========================================================================
  // 1. 李白 × 杜甫：双星并峙 · 天宝三载洛阳初会
  // =========================================================================
  encounter_li_du_744: {
    id: 'encounter_li_du_744',
    title: '双星并峙 · 李杜洛阳初会',
    subtitle: '公元744年（天宝三载）· 东都洛阳 · 梁宋齐鲁壮游',
    year: 744,
    locationId: 'luoyang',
    locationName: '东都洛阳',
    primaryPoetId: 'li_bai',
    secondaryPoetId: 'du_fu',
    secondaryPoet: {
      name: '杜甫',
      courtesyName: '子美',
      title: '少陵才俊 · 诗圣',
      avatarText: '子美',
      avatarImage: '/images/poets/du_fu.svg',
      color: '#B45309',
      age: 33,
      bioBrief: '少陵野老，早年读书开封洛阳，壮游齐赵，胸怀“会当凌绝顶，一览众山小”之万丈豪情，对太白倾心仰慕。',
    },
    historicalNarrative:
      '闻一多先生在《唐诗杂论》中盛赞：“四千年来中国文学史上最璀璨的神圣会晤，犹如青天里太阳和月亮走碰了头，我们该当如何庆祝这一个大碰撞！”\n\n公元744年，四十四岁的李白刚因权贵谗谄，被唐玄宗“赐金放还”，傲岸步出长安帝都；而三十三岁的杜甫正在洛阳客居漫游。诗坛谪仙与未来诗圣在此刻历史性相遇！两人一见如故、恨晚情深，随后邀约高适同游梁宋、策马齐鲁，白日策马驰猎、夜间抵足而眠，开创盛唐文学最磅礴的双峰并峙。',
    dialogues: [
      {
        speakerId: 'du_fu',
        speakerName: '杜甫',
        speakerTitle: '洛阳客旅 · 时年三十三',
        avatarText: '子美',
        avatarImage: '/images/poets/du_fu.svg',
        quote: '“笔落惊风雨，诗成泣鬼神！”',
        text: '太白兄！常闻翰林大名，如雷贯耳！今日在东都酒肆得睹仙姿，玄宗赐金放还，朝中宵小安识真国士？兄长骨相天成，何必郁郁于金马玉堂！',
      },
      {
        speakerId: 'li_bai',
        speakerName: '李白',
        speakerTitle: '青莲居士 · 时年四十四',
        avatarText: '太白',
        avatarImage: '/images/poets/li_bai.jpg',
        quote: '“仰天大笑出门去，我辈岂是蓬蒿人！”',
        text: '哈哈哈哈！子美贤弟！吾观君《望岳》“会当凌绝顶，一览众山小”，真乃吞吐天地之句！长安浊气扑面，哪及洛阳天地开阔？走！唤上高达夫（高适），随我痛饮狂歌，策马登吹台而啸八荒！',
      },
      {
        speakerId: 'du_fu',
        speakerName: '杜甫',
        speakerTitle: '洛阳客旅 · 时年三十三',
        avatarText: '子美',
        avatarImage: '/images/poets/du_fu.svg',
        quote: '“醉眠秋共被，携手日同行。”',
        text: '固所愿也，不敢请耳！秋来相顾，痛饮狂歌，弟愿与兄策马梁宋，日夕畅谈诗道与天下苍生！',
      },
      {
        speakerId: 'li_bai',
        speakerName: '李白',
        speakerTitle: '青莲居士 · 时年四十四',
        avatarText: '太白',
        avatarImage: '/images/poets/li_bai.jpg',
        quote: '“思君若汶水，浩荡寄南征。”',
        text: '好！青山不老，绿水长流！千载之后，盛唐青史必记你我今日一聚！',
      },
    ],
    reciprocalPoems: [
      {
        id: 'poem_zeng_li_bai_du_fu',
        title: '赠李白',
        author: '杜甫',
        recipient: '李白',
        verses: [
          '秋来相顾尚飘蓬，未就丹砂愧葛洪。',
          '痛饮狂歌空度日，飞扬跋扈为谁雄？',
        ],
        background: '天宝三载，李杜同游梁宋齐鲁时，杜甫怀着深沉敬意与关切为李白所作。',
        appreciation:
          '“飞扬跋扈”四字在此绝非贬义，而是少陵以极深之爱惜与豪迈气魄，精准刻画太白旷世独立、不可羁绁的天才傲骨。前两句写二人皆漂泊无根，后两句写李白狂歌度日之绝代豪情。',
      },
      {
        id: 'poem_xi_zeng_du_fu_li_bai',
        title: '戏赠杜甫',
        author: '李白',
        recipient: '杜甫',
        verses: [
          '饭颗山头逢杜甫，顶戴笠子日卓午。',
          '借问别来太瘦生，总为从前作诗苦。',
        ],
        background: '二人在齐鲁道中相别前夕，李白以诙谐幽默口吻赠别杜甫。',
        appreciation:
          '太白以极其亲切打趣的笔调，调侃杜甫顶着烈日头戴竹笠、苦吟雕琢以致清瘦如柴。既体现了二人无话不谈的莫逆之交，也深刻道出了李白“清水出芙蓉”的天赋天才与杜甫“语不惊人死不休”的苦心孤诣之辩证对比。',
      },
      {
        id: 'poem_sha_qiu_ji_du_fu_li_bai',
        title: '沙丘城下寄杜甫',
        author: '李白',
        recipient: '杜甫',
        verses: [
          '我来竟何事，高卧沙丘城。城边有古树，日夕连秋声。',
          '鲁酒不可醉，齐歌空复情。思君若汶水，浩荡寄南征。',
        ],
        background: '天宝四载秋，二人于石门分手，李白南下兖州，秋夜孤寂深切思念杜甫。',
        appreciation:
          '末二句“思君若汶水，浩荡寄南征”与“孤帆远影碧空尽，唯见长江天际流”有异曲同工之妙。太白以昼夜浩荡不绝的汶河江水比拟心中奔涌不绝的知己思念，情深意切，动人心魄。',
      },
    ],
    bondSeal: {
      id: 'bond_li_du_shuangxing',
      name: '双星并峙',
      dynasty: 'tang',
      poetNames: ['李白', '杜甫'],
      sealTitle: '李杜同光 · 盛唐之冠',
      description: '李白豪放飘逸如天马行空，杜甫沉郁顿挫如地载万物。双星相遇，铸就中国古典诗歌永恒巅峰。',
      unlockedAtYear: 744,
      locationName: '东都洛阳',
    },
    moodDelta: {
      freedom: 25,
      passion: 35,
      anger: -15,
      homesickness: -10,
    },
  },

  // =========================================================================
  // 2. 苏轼 × 佛印：元丰清风 · 黄州赤壁禅趣相知
  // =========================================================================
  encounter_su_foyin_1080: {
    id: 'encounter_su_foyin_1080',
    title: '元丰清风 · 东坡佛印禅悟',
    subtitle: '公元1080年（元丰三年）· 湖北黄州 · 赤壁泛舟',
    year: 1080,
    locationId: 'huangzhou',
    locationName: '黄州',
    primaryPoetId: 'su_shi',
    secondaryPoetId: 'fo_yin',
    secondaryPoet: {
      name: '佛印',
      courtesyName: '了元',
      title: '云居高僧 · 禅宗尊宿',
      avatarText: '佛印',
      color: '#0D9488',
      age: 49,
      bioBrief: '字了元，宋代著名高僧，博通内外典籍，机智绝伦，与苏东坡相交数十载，亦师亦友，谐谑机锋留名千古。',
    },
    historicalNarrative:
      '公元1080年，苏轼经历“乌台诗案”死里逃生，贬黄州团练副使，本州安置，不得签书公事。正是人生的至暗时刻，苏轼在东坡筑雪堂，躬耕自给自足。高僧佛印禅师渡江相访，二人常泛舟赤壁之下，夜宿临皋亭，在诗酒与机锋辨析中顿悟生死荣辱，成就了千古词圣的超然旷达之境。',
    dialogues: [
      {
        speakerId: 'su_shi',
        speakerName: '苏轼',
        speakerTitle: '东坡居士 · 乌台余生',
        avatarText: '东坡',
        avatarImage: '/images/poets/su_shi.jpg',
        quote: '“问汝平生功业，黄州惠州儋州。”',
        text: '大和尚！我苏子瞻一生直言，竟被小人下狱百日，投置黄州冷板凳。今日在东坡开荒筑屋，泥污芒鞋，可还像当年那个名满汴京的翰林学士？',
      },
      {
        speakerId: 'fo_yin',
        speakerName: '佛印',
        speakerTitle: '佛印了元禅师',
        avatarText: '佛印',
        quote: '“八风吹不动，端坐紫金莲。”',
        text: '学士着相矣！昔日汴京金鞍骏马，不过是过眼云烟。今日黄州泥腿农夫，方悟得天地本真！不经一番寒彻骨，安得赤壁“大江东去”之旷达？',
      },
      {
        speakerId: 'su_shi',
        speakerName: '苏轼',
        speakerTitle: '东坡居士 · 乌台余生',
        avatarText: '东坡',
        avatarImage: '/images/poets/su_shi.jpg',
        quote: '“一蓑烟雨任平生，也无风雨也无晴。”',
        text: '妙哉！江上之清风，与山间之明月，耳得之而为声，目遇之而成色，取之无禁，用之不竭！走，我新煨好了东坡肉，与你这酒肉和尚大嚼三百壶！',
      },
    ],
    reciprocalPoems: [
      {
        id: 'poem_ding_feng_bo_su_shi',
        title: '定风波·莫听穿林打叶声',
        author: '苏轼',
        recipient: '佛印与天下旷达者',
        verses: [
          '莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。',
          '料峭春风吹酒醒，微冷，山头斜照却相迎。回首向来萧瑟处，归去，也无风雨也无晴。',
        ],
        background: '苏轼在黄州沙湖道中遇雨，与友人同行皆狼狈，独苏轼泰然自若，写下千古第一达观词。',
        appreciation: '全词以雨中行路隐喻人生逆境，竹杖芒鞋胜过骏马官服，坦荡从容超拔于世俗祸福之上。',
      },
    ],
    bondSeal: {
      id: 'bond_su_foyin_fengyue',
      name: '元丰清风',
      dynasty: 'song',
      poetNames: ['苏轼', '佛印'],
      sealTitle: '东坡禅心 · 物我两忘',
      description: '儒释兼通，谐谑超旷。在逆境中开荒筑雪堂，赤壁泛舟，开两宋词境之最广阔天地。',
      unlockedAtYear: 1080,
      locationName: '黄州',
    },
    moodDelta: {
      freedom: 35,
      passion: 25,
      anger: -30,
      sorrow: -25,
    },
  },

  // =========================================================================
  // 3. 李清照 × 赵明诚：金石良缘 · 汴京相许赌书泼茶
  // =========================================================================
  encounter_qingzhao_zhaomingcheng_1101: {
    id: 'encounter_qingzhao_zhaomingcheng_1101',
    title: '金石良缘 · 汴京赌书泼茶',
    subtitle: '公元1101年（建中靖国元年）· 汴京相许 · 金石之契',
    year: 1101,
    locationId: 'bianjing',
    locationName: '汴京（开封）',
    primaryPoetId: 'li_qingzhao',
    secondaryPoetId: 'zhao_mingcheng',
    secondaryPoet: {
      name: '赵明诚',
      courtesyName: '德父',
      title: '太学高足 · 金石宗匠',
      avatarText: '德父',
      color: '#047857',
      age: 21,
      bioBrief: '宰相赵挺之之子，金石考据学泰斗，与李清照志趣相投，琴瑟和鸣，三十年间倾尽家财搜求天下古器拓本，合著《金石录》。',
    },
    historicalNarrative:
      '建中靖国元年，十八岁的李清照与二十一岁的太学生赵明诚结为连理。新婚燕尔，二人节衣缩食，每逢初一、十五便步行至开封大相国寺，典质衣物搜罗古籍残简、商周彝器、汉唐碑拓。\n\n归家后相对烹茶，指堆积如山的经史百家，猜某事在某书某卷某页某行，猜中者先饮，往往举杯大笑，茶倾怀中，反不得饮。这一幕“赌书消得泼茶香”，成为了中国古代文人婚姻中最美好的爱情丰碑。',
    dialogues: [
      {
        speakerId: 'zhao_mingcheng',
        speakerName: '赵明诚',
        speakerTitle: '太学诸生 · 时年二十一',
        avatarText: '德父',
        quote: '“言与司合，安上已脱，怎当他钓鳌客？”',
        text: '易安！今日在大相国寺后廊，从古董商手中淘得汉代《石门颂》整纸未断拓本！虽典尽我这身貂裘，然古墨沉凝，刀法如神，真乃人间至宝！',
      },
      {
        speakerId: 'li_qingzhao',
        speakerName: '李清照',
        speakerTitle: '济南李氏 · 时年十八',
        avatarText: '易安',
        avatarImage: '/images/poets/li_qingzhao.svg',
        quote: '“卖花担上，买得一枝春欲放。”',
        text: '德父何必惜一件貂裘？古纸千载不朽，貂裘过冬即弊！来，水已初沸，且考你汉武帝封禅之语出于何策？若答不出，这第一盏龙井新茶便归我了！',
      },
      {
        speakerId: 'zhao_mingcheng',
        speakerName: '赵明诚',
        speakerTitle: '太学诸生 · 时年二十一',
        avatarText: '德父',
        quote: '“赌书消得泼茶香，当时只道是寻常。”',
        text: '哈哈，天下经史若论博闻强记，谁人及得过夫人？且饮且饮，愿与卿白首穷经，编成一部千古《金石录》！',
      },
    ],
    reciprocalPoems: [
      {
        id: 'poem_ru_meng_ling_li_qingzhao',
        title: '如梦令·昨夜雨疏风骤',
        author: '李清照',
        recipient: '赵明诚与汴京芳华',
        verses: [
          '昨夜雨疏风骤，浓睡不消残酒。',
          '试问卷帘人，却道海棠依旧。',
          '知否，知否？应是绿肥红瘦。',
        ],
        background: '新婚前后作于汴京，暮春残酒中惜花怜春，赵明诚见之叹服无以复加。',
        appreciation: '“绿肥红瘦”四字化静为动，千古传诵。新巧灵动，洋溢着青春闺中的才情雅趣。',
      },
    ],
    bondSeal: {
      id: 'bond_qingzhao_mingcheng_jinshi',
      name: '金石良缘',
      dynasty: 'song',
      poetNames: ['李清照', '赵明诚'],
      sealTitle: '赌书泼茶 · 金石同心',
      description: '大相国寺市肆典衣买书，归家展玩校雠，赌书泼茶，写下中国文人世家最深情而璀璨的篇章。',
      unlockedAtYear: 1101,
      locationName: '汴京（开封）',
    },
    moodDelta: {
      passion: 35,
      freedom: 25,
      sorrow: -20,
    },
  },
};
