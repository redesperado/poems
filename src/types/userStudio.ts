// src/types/userStudio.ts
// 用户系统、多槽位存档、研学答卷与文心笔记规范与初始 Demo 数据

export interface UserAccount {
  id: string;
  username: string;
  penName: string; // 文人雅号 (如: 姑苏客、青莲墨客)
  avatarIcon: string; // 头像标识
  rankTitle: string; // 文位阶梯
  level: number;
  exp: number;
  maxExp: number;
  stats: {
    travelYears: number;
    poemsStudied: number;
    artifactsCollected: number;
    notesCount: number;
  };
  createdAt: string;
}

export interface JourneySaveSlot {
  id: string;
  slotName: string; // 槽位名称 (如: "太白任侠一梦")
  poetId: string;
  poetName: string;
  currentYear: number;
  locationName: string;
  moodOverview: string; // 心境概况 (如: "豪放不羁 · 92")
  unlockedPoemsCount: number;
  totalPoemsCount: number;
  artifactsCount: number;
  updatedAtText: string;
  isActive?: boolean;
  journeyLogs: Array<{
    year: number;
    location: string;
    event: string;
  }>;
}

export interface PoemMistake {
  lineIndex: number;
  charIndex: number;
  lineSnippet: string; // 句子片段，如: "齐鲁青未【？】"
  chosenOption: string; // 误选项
  correctOption: string; // 正确字
  explanation: string; // 名师辨析
}

export interface PoemStudyRecord {
  id: string;
  poemId: string;
  poemTitle: string;
  poetName: string;
  dynasty: 'tang' | 'song';
  score: number; // 100 | 75 | 50
  grade: '甲等·妙品' | '乙等·通达' | '丙等·尚可';
  durationSeconds: number;
  completedAtText: string;
  mistakes: PoemMistake[];
}

export interface PoetryNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  poemTitle?: string;
  poetName?: string;
  locationName?: string;
  createdAtText: string;
}

// 模拟初始用户档案
export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'user_01',
    username: 'qinglian_moke',
    penName: '青莲墨客',
    avatarIcon: '🪶',
    rankTitle: '翰林学士',
    level: 6,
    exp: 4200,
    maxExp: 5000,
    stats: {
      travelYears: 42,
      poemsStudied: 14,
      artifactsCollected: 11,
      notesCount: 6,
    },
    createdAt: '天宝元年仲春',
  },
  {
    id: 'user_02',
    username: 'dongpo_friend',
    penName: '东坡客·佛印',
    avatarIcon: '🍵',
    rankTitle: '进士及第',
    level: 4,
    exp: 2600,
    maxExp: 3500,
    stats: {
      travelYears: 28,
      poemsStudied: 8,
      artifactsCollected: 6,
      notesCount: 3,
    },
    createdAt: '元丰二年秋',
  },
  {
    id: 'user_guest',
    username: 'guest_walker',
    penName: '江湖游子 (游客)',
    avatarIcon: '🍂',
    rankTitle: '秀才',
    level: 2,
    exp: 800,
    maxExp: 1500,
    stats: {
      travelYears: 10,
      poemsStudied: 3,
      artifactsCollected: 2,
      notesCount: 1,
    },
    createdAt: '今日初入',
  },
];

// 模拟多槽位游历档案 (山河谱牒)
export const INITIAL_SAVE_SLOTS: JourneySaveSlot[] = [
  {
    id: 'slot_01',
    slotName: '【档一】太白纵酒入长安',
    poetId: 'li_bai',
    poetName: '李白',
    currentYear: 744,
    locationName: '洛阳',
    moodOverview: '狂放豪迈 92 / 浩然 85',
    unlockedPoemsCount: 4,
    totalPoemsCount: 4,
    artifactsCount: 6,
    updatedAtText: '刚刚 · 自动存档',
    isActive: true,
    journeyLogs: [
      { year: 726, location: '庐山', event: '望庐山瀑布，初试太白青锋' },
      { year: 742, location: '长安', event: '供奉翰林，力士脱靴，天子呼来不上船' },
      { year: 744, location: '洛阳', event: '赐金放还，遇少陵杜甫于东都，日与月相撞' },
    ],
  },
  {
    id: 'slot_02',
    slotName: '【档二】东坡赤壁释怀卷',
    poetId: 'su_shi',
    poetName: '苏轼',
    currentYear: 1082,
    locationName: '黄州',
    moodOverview: '旷达超然 96 / 苍凉 32',
    unlockedPoemsCount: 3,
    totalPoemsCount: 3,
    artifactsCount: 5,
    updatedAtText: '昨天 21:40',
    isActive: false,
    journeyLogs: [
      { year: 1079, location: '汴京', event: '乌台诗案，九死一生，移贬黄州' },
      { year: 1082, location: '黄州', event: '赤壁怀古，微雨竹杖芒鞋，一蓑烟雨任平生' },
    ],
  },
  {
    id: 'slot_03',
    slotName: '【档三】易安金石赌茶卷',
    poetId: 'li_qingzhao',
    poetName: '李清照',
    currentYear: 1108,
    locationName: '青州',
    moodOverview: '清婉敏慧 88 / 闲愁 60',
    unlockedPoemsCount: 2,
    totalPoemsCount: 3,
    artifactsCount: 4,
    updatedAtText: '3天前',
    isActive: false,
    journeyLogs: [
      { year: 1101, location: '汴京', event: '相国寺典衣买古碑，归来堂初试墨法' },
      { year: 1108, location: '青州', event: '屏居青州十载，赌书消得泼茶香，研治《金石录》' },
    ],
  },
];

// 模拟研学答卷与错题集 (推敲朱卷)
export const INITIAL_STUDY_RECORDS: PoemStudyRecord[] = [
  {
    id: 'rec_01',
    poemId: 'shu_dao_nan',
    poemTitle: '蜀道难',
    poetName: '李白',
    dynasty: 'tang',
    score: 100,
    grade: '甲等·妙品',
    durationSeconds: 42,
    completedAtText: '天宝三载 · 洛阳',
    mistakes: [],
  },
  {
    id: 'rec_02',
    poemId: 'wang_yue',
    poemTitle: '望岳',
    poetName: '杜甫',
    dynasty: 'tang',
    score: 75,
    grade: '乙等·通达',
    durationSeconds: 58,
    completedAtText: '开元二十四年 · 泰山',
    mistakes: [
      {
        lineIndex: 1,
        charIndex: 4,
        lineSnippet: '齐鲁青未【？】',
        chosenOption: '尽',
        correctOption: '了',
        explanation:
          '“了”字出其不意，化静态山色为动态天工，写尽泰山青翠绵延无尽之神韵；若用“尽”字过于平直，失却诗意顿挫。',
      },
    ],
  },
  {
    id: 'rec_03',
    poemId: 'ding_feng_bo',
    poemTitle: '定风波 · 莫听穿林打叶声',
    poetName: '苏轼',
    dynasty: 'song',
    score: 100,
    grade: '甲等·妙品',
    durationSeconds: 35,
    completedAtText: '元丰五年 · 黄州',
    mistakes: [],
  },
  {
    id: 'rec_04',
    poemId: 'ru_meng_ling',
    poemTitle: '如梦令 · 常记溪亭日暮',
    poetName: '李清照',
    dynasty: 'song',
    score: 50,
    grade: '丙等·尚可',
    durationSeconds: 76,
    completedAtText: '建中靖国元年 · 汴京',
    mistakes: [
      {
        lineIndex: 2,
        charIndex: 2,
        lineSnippet: '误入藕花【？】处',
        chosenOption: '岸',
        correctOption: '深',
        explanation:
          '“深”字极言荷花茂密参天，扁舟误入迷途之境；“岸”字则落入俗套，全无归舟不辨方向之醉眼朦胧感。',
      },
    ],
  },
];

// 模拟文心墨札笔记
export const INITIAL_POETRY_NOTES: PoetryNote[] = [
  {
    id: 'note_01',
    title: '《望岳》“造化钟神秀”推敲感悟',
    content:
      '读到“造化钟神秀，阴阳割昏晓”，方知泰山之巍峨并非直白陈述，而是造物者将天地灵秀一股脑儿“钟”聚于此。一个“割”字，更是把山南之明朗与山北之幽暗劈裂成两个世界，杜少陵青年时期的胸襟气魄跃然纸上！',
    tags: ['名句赏析', '杜甫登高', '造化钟灵'],
    poemTitle: '望岳',
    poetName: '杜甫',
    locationName: '泰山',
    createdAtText: '2026-10-28 14:15',
  },
  {
    id: 'note_02',
    title: '黄州赤壁怀古推敲：一尊还酹江月',
    content:
      '推敲“人生如梦，一尊还酹江月”时，联想苏子当时乌台诗案劫后余生。赤壁矶头水声如雷，英雄周郎已逝，自身亦双鬓华发。这一尊酒敬给倒映在长江中的冷月，是对苦难的彻底释怀，非大豪放者不可为。',
    tags: ['人生感怀', '东坡旷达', '背诵心法'],
    poemTitle: '念奴娇 · 赤壁怀古',
    poetName: '苏轼',
    locationName: '黄州',
    createdAtText: '2026-10-27 20:30',
  },
  {
    id: 'note_03',
    title: '青州归来堂赌书泼茶小记',
    content:
      '易安居士与赵明诚在归来堂中，饭后烹茶，指堆积书史，说某事在某书某卷第几页第几行，以角胜负，中者举杯大笑，至茶倾覆怀中。文人夫妻之雅趣，千载之下仍令人神往！',
    tags: ['金石考据', '易安逸事', '赌书泼茶'],
    poemTitle: '金石录后序',
    poetName: '李清照',
    locationName: '青州',
    createdAtText: '2026-10-26 16:20',
  },
];
