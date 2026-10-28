// =========================================================================
// 【千古相遇】历史文人同框羁绊系统类型定义 (encounter.ts)
// =========================================================================

export interface EncounterDialogueLine {
  speakerId: string;       // 说话人 ID
  speakerName: string;     // 说话人姓名 (如: "李白", "杜甫")
  speakerTitle: string;    // 头衔 (如: "翰林学士 · 谪仙人", "少陵野老")
  avatarText: string;      // 头像文字 (如: "太白", "子美")
  avatarImage?: string;    // 头像画像
  text: string;            // 对话正文
  quote?: string;          // 经典行止/吟诵句 (可选)
}

export interface ReciprocalPoem {
  id: string;
  title: string;
  author: string;
  recipient: string;
  verses: string[];
  background: string;
  appreciation: string;
}

export interface BondSeal {
  id: string;
  name: string;             // 印章名称 (如: "双星并峙", "元丰清风")
  dynasty: 'tang' | 'song';
  poetNames: [string, string]; // 缔结羁绊的两位文人 (如: ["李白", "杜甫"])
  sealTitle: string;        // 篆章印文 (如: "李杜同光 · 盛唐之冠")
  description: string;      // 羁绊深意评述
  unlockedAtYear: number;
  locationName: string;
}

export interface PoetEncounterData {
  id: string;
  title: string;            // 标题 (如: "双星并峙 · 洛阳初会")
  subtitle: string;         // 副标题 (如: "公元744年（天宝三载）· 东都洛阳")
  year: number;
  locationId: string;
  locationName: string;
  primaryPoetId: string;    // 主角 ID
  secondaryPoetId: string;  // 相逢文人 ID
  secondaryPoet: {
    name: string;
    courtesyName: string;
    title: string;
    avatarText: string;
    avatarImage?: string;
    color: string;
    age: number;
    bioBrief: string;
  };
  historicalNarrative: string; // 史诗叙事背景与文学史地位
  dialogues: EncounterDialogueLine[]; // 经典对话长卷
  reciprocalPoems: ReciprocalPoem[];  // 互赠传世名篇
  bondSeal: BondSeal;       // 解锁的千古印章
  moodDelta: Record<string, number>; // 心境增益
}
