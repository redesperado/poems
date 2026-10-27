import { PoemData } from '../../../types/poem';

export const SU_SHI_POEMS: PoemData[] = [
  {
    id: 'ding_feng_bo',
    title: '定风波·莫听穿林打叶声',
    poet_id: 'su_shi',
    dynasty: 'song',
    form: 'ci',
    cipai: '定风波',
    year: 1082,
    location_id: 'huangzhou',
    trigger_conditions: {
      location_id: 'huangzhou',
      mood: { freedom: { min: 60 } },
      year_range: [1080, 1101],
    },
    lines: [
      {
        text: '莫听穿林打叶声',
        blank_index: 0,
        correct: '莫听',
        options: ['莫听', '休听', '不闻', '且听'],
        correct_explanation: '“莫听”起笔斩钉截铁，直抒宠辱不惊、不为外界风雨所动的从容与旷达。',
        wrong_explanations: {
          休听: '“休听”语气偏向柔婉劝诫，不如“莫听”斩钉截铁、坦荡旷达。',
          不闻: '“不闻”强作塞耳不闻之态，落入刻意，不如“莫听”任凭风雨之超然。',
          且听: '“且听”反成了细听风雨，与后句“何妨吟啸且徐行”从容之意相悖。',
        },
      },
      {
        text: '何妨吟啸且徐行',
        blank_index: 2,
        correct: '吟啸',
        options: ['吟啸', '高歌', '漫步', '独步'],
        correct_explanation: '“吟啸”兼具诗人的清雅与隐者的超脱，在暴雨骤风中自得其乐，尽显任真自得之风骨。',
        wrong_explanations: {
          高歌: '“高歌”过于亢奋外露，失却苏轼雨中竹杖芒鞋、闲庭信步的超脱神韵。',
          漫步: '“漫步”缺乏长啸破空的精神张力。',
          独步: '“独步”语境孤清凄凉，东坡此句虽遇骤雨，意境豁达无比。',
        },
      },
      {
        text: '竹杖芒鞋轻胜马',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '谁怕',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '一蓑烟雨任平生',
        blank_index: 2,
        correct: '烟雨',
        options: ['烟雨', '风雨', '沧浪', '江海'],
        correct_explanation: '“烟雨”将自然风雨与人生浮沉化为江南水墨诗境，一蓑平生，旷达至极。',
        wrong_explanations: {
          风雨: '“风雨”稍显直露粗砺，不若“烟雨”将自然风雨与人生风浪融为江南水墨之化境。',
          沧浪: '“沧浪”多涉避世隐逸，东坡身处江湖却从未自弃。',
          江海: '平仄不合词牌，且失却微雨空蒙的诗意质感。',
        },
      },
      {
        text: '料峭春风吹酒醒',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '微冷',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '山头斜照却相迎',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '回首向来萧瑟处',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '归去',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '也无风雨也无晴',
        blank_index: 0,
        correct: '也无风雨也无晴',
        options: ['也无风雨也无晴', '休管风雨休管晴', '任凭风雨任凭晴', '不辞风雨不辞晴'],
        correct_explanation: '“也无风雨也无晴”乃全词画龙点睛之笔，道出超越顺逆荣辱、心如明镜、物我两忘的最高人生境界。',
        wrong_explanations: {
          休管风雨休管晴: '流于市井口吻，失去千古名句超凡入圣的人生大哲思境界。',
          任凭风雨任凭晴: '仍有对抗风雨的执念，未到“也无风雨也无晴”的心如明镜、物我两忘。',
          不辞风雨不辞晴: '语意偏于勉强受之，缺少超然物外的通透顿悟。',
        },
      },
    ],
    full_text:
      '莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。料峭春风吹酒醒，微冷，山头斜照却相迎。回首向来萧瑟处，归去，也无风雨也无晴。',
    translation:
      '不要去理会那穿透树林敲打树叶的风雨声，何妨一边吟咏长啸一边悠闲前行？拄着竹杖穿着草鞋，脚步比骑马还要轻快，有什么可怕的？披一件蓑衣在风雨中度过一生也泰然自若。略带寒意的春风吹醒了酒意，略觉微冷，山头初现的夕阳斜照却迎面送来温暖。回头望向刚才风雨萧瑟之处，安然走去，回想起来，既无所谓风雨，也无所谓天晴。',
    background:
      '宋神宗元丰五年（1082年）春，苏轼因“乌台诗案”贬谪黄州已三年。三月七日沙湖道中遇大雨，同行者皆狼狈躲避，唯苏轼顶雨泰然缓行。雨过天晴，感悟平生宦海风浪，写下这首千古旷达之作。',
    poet_journal:
      '三月七日，沙湖道中遇雨。雨具先去，同行皆狼狈奔走，余独不觉。风过竹林，声若破浪，忽觉天地苍茫不过尔尔。官场谗谤、御史大狱，岂非亦如斯骤雨？少顷天霁，斜阳照坡，胸次豁然，平生忧患皆如浮云散去矣。',
    key_words: [
      {
        word: '竹杖芒鞋',
        pinyin: 'zhú zhàng máng xié',
        explanation: '竹杖与草鞋，为古代平民、山野隐士之简朴行装，在此与骑官马形成鲜明对比，展现自甘淡泊之情操。',
      },
      {
        word: '一蓑烟雨',
        pinyin: 'yī suō yān yǔ',
        explanation: '一件蓑衣便可抵御浩浩风雨。“任平生”道尽了坦然承受人生一切坎坷与风浪的大从容。',
      },
      {
        word: '萧瑟处',
        pinyin: 'xiāo sè chù',
        explanation: '既指刚才风狂雨骤之自然山径，亦暗喻此前乌台诗案所经历的惊涛骇浪与仕途险境。',
      },
      {
        word: '也无风雨也无晴',
        pinyin: 'yě wú fēng yǔ yě wú qíng',
        explanation: '词旨核心结穴。超越了对顺境（晴）的执着与逆境（雨）的畏惧，达致禅宗般超然物外的绝对平和。',
      },
    ],
    literary_analysis: {
      artistic_features: [
        '即事说理，以小见大：从途中遇雨这一生活小事，升华为处世哲学的人生大智慧。',
        '音律铿锵，长短顿挫：“谁怕？”二字突兀拔起，豪迈傲骨呼之欲出；“归去”二字轻收，余音袅袅。',
        '儒释道融汇之化境：既有儒家的坚毅挺立，又有道家的逍遥无碍与佛禅的超越物我。',
      ],
      master_comments: [
        {
          critic: '郑文焯《手批东坡乐府》',
          comment: '“此足征是翁坦荡之怀，任天而动。结笔尤旷，真天下奇男子、伟词客！”',
        },
      ],
      appreciation:
        '《定风波》不仅是苏轼词作的巅峰，更是中华文人士大夫精神人格的丰碑。面对无常之风雨与厄运，常人避之不及，东坡却“吟啸徐行”。末句“也无风雨也无晴”更是全词神光凝聚之处，不计荣辱得失，归于内心的安顿与从容。',
    },
    themes: ['resilience', 'zen', 'freedom', 'rain'],
  },
  {
    id: 'shui_diao_ge_tou',
    title: '水调歌头·明月几时有',
    poet_id: 'su_shi',
    dynasty: 'song',
    form: 'ci',
    cipai: '水调歌头',
    year: 1076,
    location_id: 'hangzhou',
    trigger_conditions: {
      location_id: 'hangzhou',
      mood: { homesickness: { min: 60 }, freedom: { min: 50 } },
      year_range: [1070, 1101],
    },
    lines: [
      {
        text: '明月几时有',
        blank_index: 0,
        correct: '明月',
        options: ['明月', '皓月', '金波', '玉兔'],
        correct_explanation: '“明月”对天发问，承接李太白《把酒问月》之气象，直探宇宙本源，澄澈空灵，气魄恢宏。',
        wrong_explanations: {
          皓月: '虽状月白，不如“明月”天然清澈，直承李太白“青天有月来几时”之问。',
          金波: '借代过繁，失去了中秋月圆纯净清冽的诗境。',
          玉兔: '借代俗套，与此词开篇发问苍天的哲理气质不合。',
        },
      },
      {
        text: '把酒问青天',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '不知天上宫阙',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '今夕是何年',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '我欲乘风归去',
        blank_index: 2,
        correct: '乘风',
        options: ['乘风', '凌空', '驾云', '逐月'],
        correct_explanation: '“乘风”浪漫超拔，写出欲羽化登仙、神游八极之道骨仙风，深契庄子御风之超脱。',
        wrong_explanations: {
          凌空: '“凌空”偏重动作姿态，不及“乘风”羽化登仙之道骨仙风。',
          驾云: '偏向神魔小说写实手法，失去诗性空灵感。',
          逐月: '语意重复，前文已有明月。',
        },
      },
      {
        text: '又恐琼楼玉宇',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '高处不胜寒',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '起舞弄清影',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '何似在人间',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
      {
        text: '但愿人长久',
        blank_index: 0,
        correct: '但愿',
        options: ['但愿', '唯愿', '只求', '安得'],
        correct_explanation: '“但愿”寄托了对天下离人最温厚真挚的祝祷，展现东坡由超然物外复归关切人间的博大情怀。',
        wrong_explanations: {
          唯愿: '“唯愿”口吻稍生硬，不如“但愿”温柔包容、情意绵长。',
          只求: '“只求”格局偏小，缺少博大的人间情怀。',
          安得: '“安得”多用于杜甫式沉郁顿挫的沉痛呼唤，与东坡超然旷达之祝愿不符。',
        },
      },
      {
        text: '千里共婵娟',
        blank_index: null,
        correct: null,
        options: null,
        wrong_explanations: null,
      },
    ],
    full_text:
      '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
    translation:
      '明月从什么时候开始有的？举起酒杯仰问苍天。不知道天上的仙宫广寒，今夜又是何年何代。我真想乘着清风飞回月宫，又恐怕那美玉琼楼太高太冷，让人经受不住。月下翩翩起舞顾盼着自己的清影，哪里比得上在这亲切的人间！月儿转过朱红的楼阁，低低探进雕花的门窗，照着因思念而无法入眠的人。明月不该对人们有什么怨恨吧，为什么总是在人们离别的时候格外圆满呢？人世间本有悲欢离合，月亮也自会有阴晴圆缺，这自古以来就是难以求全的事情。只愿我们思念的人平平安安、健康长久，即便相隔千里万里，也能共享这同一轮美好的明月！',
    background:
      '熙宁九年（1076年）中秋，苏轼在密州任上，因政治分歧与弟弟苏辙已有七年未见。中秋良夜欢饮达旦，借明月抒发思亲之情，更寄托了超越时空、包容一切的旷达仁爱，胡仔盛赞“中秋词自东坡《水调歌头》一出，余词尽废”。',
    poet_journal:
      '丙辰中秋，欢饮达旦，大醉。作此篇，兼怀子由。子由别余七载，月圆人不圆。天风浩荡，恍若身在广寒。然仙境虽美，不若与骨肉常聚于人间。悲欢离合，古今同慨，愿吾弟安好，两地同此玉盘清辉。',
    key_words: [
      {
        word: '琼楼玉宇',
        pinyin: 'qióng lóu yù yǔ',
        explanation: '月宫仙境中以美玉琼瑶筑造的宫殿楼阁，比喻极高远、不染凡尘之圣境，亦暗喻朝廷中枢高位。',
      },
      {
        word: '高处不胜寒',
        pinyin: 'gāo chù bù shèng hán',
        explanation: '站在高处经受不住风寒。既指天上宫阙之极度寒冷，亦喻指置身政治最高层的孤危与险测。',
      },
      {
        word: '婵娟',
        pinyin: 'chán juān',
        explanation: '本指姿态美好，此处代指清丽皎洁的明月。',
      },
    ],
    literary_analysis: {
      artistic_features: [
        '出世与入世的哲学张力：欲乘风归去（出世向往），又恋人间清影（入世温情），终以仁爱化解执念。',
        '理趣与情韵的完美熔铸：将“人有悲欢离合，月有阴晴圆缺”之宇宙哲理，化为抚慰万古心灵的宽厚诗语。',
      ],
      master_comments: [
        {
          critic: '胡仔《苕溪渔隐丛话》',
          comment: '“中秋词自东坡《水调歌头》一出，余词尽废。”',
        },
      ],
      appreciation:
        '这首词是千百年来中秋怀人之至尊之作。上阕由饮酒问月发端，在幻想与现实间跌宕起伏；下阕由月照无眠转入对离愁的哲理排解，最终升华出“但愿人长久，千里共婵娟”的旷达祝愿，意境雄深高远，千古绝响。',
    },
    themes: ['moon', 'mid-autumn', 'brotherhood', 'philosophy'],
  },
];
