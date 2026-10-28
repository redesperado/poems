import { GameEvent, LifeChoice } from '../../../types/event';

export const DU_FU_EVENTS: GameEvent[] = [
  {
    id: 'du_fu_youth_736',
    poet_id: 'du_fu',
    year: 736,
    location_id: 'taishan',
    type: 'travel',
    title: '齐赵壮游 · 登泰山《望岳》',
    description:
      '二十四岁的杜甫应举落第后，胸怀壮志漫游齐赵。登临东岳泰山绝顶，见天地造化，豪气干云，挥笔写下“会当凌绝顶，一览众山小”！',
    mood_delta: { passion: 35, freedom: 25 },
    triggers_poem_id: 'wang_yue',
    next_event_id: 'du_fu_luoyang_meeting_744',
  },
  {
    id: 'du_fu_luoyang_meeting_744',
    poet_id: 'du_fu',
    year: 744,
    location_id: 'luoyang',
    type: 'meeting',
    title: '洛阳初会 · 诗坛双星相遇',
    description:
      '天宝三载，三十三岁的杜甫在洛阳与刚被唐玄宗“赐金放还”的李白相逢。两人一见如故，携手同游梁宋、把酒论诗，成为中国文学史上最璀璨的双星交汇。',
    mood_delta: { freedom: 30, passion: 25 },
    triggers_encounter_id: 'encounter_li_du_744',
    next_event_id: 'du_fu_changan_struggle_751',
  },
  {
    id: 'du_fu_changan_struggle_751',
    poet_id: 'du_fu',
    year: 751,
    location_id: 'chang_an',
    type: 'travel',
    title: '困守长安 · 忧思国步艰危',
    description:
      '天宝年间，杜甫客居长安长达十年，求官不第，目睹李林甫奸相弄权与权贵奢靡。“朝扣富儿门，暮随肥马尘”，写下《兵车行》《丽人行》，文心转向现实苍生。',
    mood_delta: { sorrow: 30, anger: 25, passion: -10 },
    next_event_id: 'du_fu_an_shi_crisis_755',
  },
  {
    id: 'du_fu_an_shi_crisis_755',
    poet_id: 'du_fu',
    year: 755,
    location_id: 'chang_an',
    type: 'crisis_response',
    title: '安史大乱 · 陷贼长安《春望》',
    description:
      '天宝十四载冬，安史之乱爆发，潼关失守，两京沦陷。杜甫北上奔赴行在途中被叛军俘获押回长安，面对沦陷国都，血泪写就《春望》与《哀江头》！',
    mood_delta: { sorrow: 40, anger: 30, homesickness: 35 },
    triggers_poem_id: 'chun_wang',
    triggers_crisis: {
      title: '安史之乱爆发 · 盛唐天倾',
      year: 755,
      historical_event_name: '天宝危机 · 安史之乱与长安沦陷',
      historical_background:
        '公元755年（天宝十四载）十一月，身兼三镇节度使的安禄山在范阳起兵反唐，率十五万叛军长驱南下。次年六月哥舒翰潼关兵败，唐玄宗仓皇奔蜀，马嵬坡将士哗变杨玉环被赐死。七月太子李亨在灵武即位为唐肃宗。盛世大唐自此跌入长达八年的战火深渊！',
      poet_impact:
        '杜甫安置家小在鄜州后只身奔赴灵武，途中不幸被叛军所俘，解送沦陷后的长安。目睹往昔万国来朝的帝都天街荒草没膝、宫阙焚毁，杜甫写下“国破山河在，城春草木深”等千古血泪篇章，彻底铸就其“诗史”之魂。',
      mood_delta_desc: '【天下巨变】：忧思 +40，悲愤 +30，乡愁 +35，豪情 -30',
    },
    next_event_id: 'du_fu_fengxiang_choice_757',
  },
  {
    id: 'du_fu_fengxiang_choice_757',
    poet_id: 'du_fu',
    year: 757,
    location_id: 'chang_an',
    type: 'choice',
    title: '冒死奔凤翔 · 拾遗进谏抉择',
    description:
      '至德二年四月，杜甫冒死穿过敌防线潜逃至凤翔行在，获授左拾遗。因宰相房琯兵败获罪，杜甫面临是否犯颜直谏的生死抉择。',
    triggers_choice_id: 'choice_757_shiyi',
    next_event_id: 'du_fu_chengdu_thatched_760',
  },
  {
    id: 'du_fu_chengdu_thatched_760',
    poet_id: 'du_fu',
    year: 760,
    location_id: 'chengdu',
    type: 'travel',
    title: '入蜀定居 · 谒武侯祠《蜀相》',
    description:
      '乾元二年底，杜甫弃官携家颠沛流离入蜀，在成都西郊浣花溪畔营建草堂。安定初定，杜甫前往城外武侯祠凭吊诸葛孔明，写下名绝千古的七律《蜀相》。',
    mood_delta: { freedom: 25, sorrow: 10 },
    triggers_poem_id: 'shu_xiang',
    next_event_id: 'du_fu_chengdu_autumn_wind_761',
  },
  {
    id: 'du_fu_chengdu_autumn_wind_761',
    poet_id: 'du_fu',
    year: 761,
    location_id: 'chengdu',
    type: 'travel',
    title: '浣花溪草堂 · 庇佑天下寒士',
    description:
      '上元二年，杜甫在成都草堂躬耕。春夜细雨催生万木，赋《春夜喜雨》；八月秋风怒号卷破茅屋，杜甫长夜难眠，发出“安得广厦千万间，大庇天下寒士俱欢颜”的至圣悲悯！',
    mood_delta: { passion: 35, sorrow: 25, freedom: 20 },
    triggers_poem_id: 'mao_wu_wei_qiu_feng_suo_po_ge',
    next_event_id: 'du_fu_rejoice_recovery_763',
  },
  {
    id: 'du_fu_rejoice_recovery_763',
    poet_id: 'du_fu',
    year: 763,
    location_id: 'chengdu',
    type: 'travel',
    title: '平生第一快诗 · 收复蓟北',
    description:
      '宝应二年春，史朝义自缢，安史之乱历经八年彻底平定！杜甫在梓州闻听收复河南河北大捷，喜极而泣，挥毫写下平生最痛快的绝唱《闻官军收河南河北》！',
    mood_delta: { passion: 50, freedom: 40, sorrow: -30 },
    triggers_poem_id: 'wen_guan_jun_shou_he_nan_he_bei',
    next_event_id: 'du_fu_kuizhou_denggao_767',
  },
  {
    id: 'du_fu_kuizhou_denggao_767',
    poet_id: 'du_fu',
    year: 767,
    location_id: 'baidicheng',
    type: 'travel',
    title: '夔州登高 · 登峰造极《登高》',
    description:
      '大历二年重阳，多病衰老的杜甫羁留夔州白帝城。独自登临江头高台，面对无边落木与滔滔长江，融八重悲怆于十四字中，写就千古七律冠冕《登高》。',
    mood_delta: { sorrow: 45, passion: 20 },
    triggers_poem_id: 'deng_gao',
    next_event_id: 'du_fu_xiangjiang_passing_770',
  },
  {
    id: 'du_fu_xiangjiang_passing_770',
    poet_id: 'du_fu',
    year: 770,
    location_id: 'xiangjiang',
    type: 'passing',
    title: '湘江扁舟 · 诗圣谢幕',
    description:
      '大历五年深冬，五十九岁的杜甫在由潭州往岳阳的湘江小舟上病逝。一代诗圣以天地一沙鸥之孤傲，在颠沛与悲悯中走完了波澜壮阔的一生，诗史光芒永耀千秋！',
    mood_delta: { sorrow: 20, freedom: 40, passion: 20 },
    triggers_poem_id: 'lv_ye_shu_huai',
    triggers_retrospective: {
      passing_year: 770,
      passing_location_name: '湘江（湖南岳阳/平江）',
      epitaph_title: '大唐千古诗圣 · 少陵野老一生行状通鉴',
      swan_song_title: '《旅夜书怀》（少陵绝唱）',
      swan_song_lines: [
        '细草微风岸，危樯独夜舟。',
        '星垂平野阔，月涌大江流。',
        '名岂文章著，官应老病休。',
        '飘飘何所似，天地一沙鸥。',
      ],
      departure_narrative:
        '唐代宗大历五年（公元 770 年）深冬，五十九岁的杜甫拖着中风、肺疾缠身的病骨，携带着全家泛舟漂泊在冰冷的湘江之上。从巩县出世、齐赵壮游、困顿长安、安史陷贼、草堂避难、再到夔州登高，这位将大唐整个时代的沧桑巨变与黎民饥寒深深铭刻在血泪诗篇里的伟人，在连绵阴雨与贫寒病痛中，合上了疲惫的双目。临终前，他留下了《风疾舟中伏枕书怀三十六韵》：“战血流依旧，军声动至今。凄凉宝剑篇，羁旅白头吟。”一代诗圣，在潇湘风涛里悄然谢幕，长眠于天地江山之间。',
      lifetime_summary:
        '杜甫（712年—770年），字子美，自号少陵野老，后世尊称“诗圣”。他的诗作不仅达到了中国古典格律诗的至高极诣，更以至大至深的同情心、正义感与家国担当，全面而深刻地反映了唐帝国由开元盛世急转为安史之乱浩劫的历史全貌，被千古公推为“诗史”。',
      master_appraisals: [
        {
          critic: '苏轼（东坡）',
          relationship: '北宋文宗 · 跨代崇仰',
          quote: '古今诗人多矣，至杜子美而集大成。',
          comment:
            '苏东坡在《王定国诗集序》中尊杜甫为古往今来集大成者，其诗一洗前代浮华轻艳之态，气象深沉博大，前无古人，后无来者。',
        },
        {
          critic: '元稹',
          relationship: '中唐元白诗派领袖',
          quote: '诗人以来，未有如子美者矣！',
          comment:
            '元稹在《唐故检校工部员外郎杜君墓系铭》中极赞杜甫：“尽得古今之体势，兼人人之所独专。”首次将杜甫推举到凌驾历代文人的无上至尊地位。',
        },
        {
          critic: '黄庭坚（山谷）',
          relationship: '宋代江西诗派宗祖',
          quote: '杜之诗法，如灵丹一粒，点铁成金。',
          comment:
            '黄庭坚极力推崇杜甫的法度格律与造语锤炼，认为杜诗“无一字无来处”，开创了宋代尊杜学杜的时代大潮。',
        },
        {
          critic: '严羽《沧浪诗话》',
          relationship: '南宋诗论泰斗',
          quote: '子美不能为太白之飘逸，太白不能为子美之沉郁。',
          comment:
            '严羽将杜甫定为中国古典诗歌“沉郁顿挫”的绝对顶峰，其诗骨力雄健，忧思深刻，为现实主义文学立下了万古不易之准绳。',
        },
        {
          critic: '韩愈',
          relationship: '唐代文坛领袖',
          quote: '李杜文章在，光焰万丈长。不知群儿愚，那用故谤伤！',
          comment:
            '韩愈坚定地将杜甫与李白并列为中华诗坛双子星，断定两人的文章如同日月当空，任何诋毁非议都无法减损其万丈光辉。',
        },
      ],
      historical_legacy:
        '【集大成的万世诗圣】：杜甫将中国古典五律、七律、五言古诗推向了空前绝后的法度巅峰，“千古七律第一”名冠史册；\n\n【惊天地泣鬼神的“诗史”】：以《三吏》《三别》《春望》忠实记录民间疾苦与时代风云，成为历史最忠诚、最深情的见证人；\n\n【致君尧舜上、再使风俗淳的儒者典范】：终其一生未忘兼济天下，“安得广厦千万间，大庇天下寒士俱欢颜”成为华夏知识分子最高道德情怀的图腾；\n\n【杜诗风骨代代相传】：自中唐以降，白居易、韩愈、苏轼、黄庭坚、陆游、辛弃疾等历代文豪无不奉杜甫为精神导师，其诗魂早已融入中华民族忧国忧民、自强不息的血脉之中。',
    },
  },
];

export const DU_FU_CHOICES: Record<string, LifeChoice> = {
  choice_757_shiyi: {
    id: 'choice_757_shiyi',
    event_id: 'du_fu_fengxiang_choice_757',
    prompt:
      '凤翔行在，宰相房琯因用春秋古法车战大败于叛军，肃宗震怒欲严惩除名。满朝文武噤若寒蝉。身为官职微卑的左拾遗，你是否冒死上疏营救？',
    historical_context:
      '历史上杜甫认为房琯是忠直之臣，有大臣器量，虽犯战略失误但不至治重罪。杜甫冒死上疏力争，触怒肃宗被敕命下狱审讯，幸得宰相张镐等极力营救才获免，旋即被贬为华州司功参军。这一抉择展现了杜甫宁折不弯的直谏骨气。',
    options: [
      {
        id: 'opt_shiyi_speak_up',
        text: '直言力谏，虽千万人吾往矣（历史正史）',
        mood_delta: { freedom: 25, passion: 30, sorrow: 10 },
        unlocks_poems: ['chun_wang'],
        unlocks_locations: ['chang_an'],
        is_historical: true,
        historical_note:
          '杜甫选择了冒死上章谏救房琯。虽因此触怒龙颜险遭诛杀、终生仕途尽毁，却以一介布衣铮铮铁骨，践行了古代诤臣言官以死报国的崇高操守。',
      },
      {
        id: 'opt_shiyi_silent',
        text: '明哲保身，曲意求全（平行历史）',
        mood_delta: { freedom: -20, sorrow: 35, anger: -15 },
        unlocks_poems: [],
        unlocks_locations: ['chang_an'],
        is_historical: false,
        historical_note:
          '若杜甫在此保持沉默，或许能顺遂升迁为朝中高官，免去半生颠沛之苦；然而世间却将永远失去一位敢于直面苦难、与苍生同呼吸的纯粹诗圣。',
      },
    ],
  },
};
