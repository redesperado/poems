import React, { useState } from 'react';

/**
 * 常见汉字至传统金石繁体与篆籀古体映射库
 * 将当代简化字自动转换为唐宋古玺印、汉印常用繁古篆字形
 */
const ARCHAIC_SEAL_MAP: Record<string, string> = {
  三: '三',
  尚: '尙',
  青: '靑',
  莲: '蓮',
  墨: '墨',
  客: '客',
  东: '東',
  坡: '坡',
  白: '白',
  杜: '杜',
  甫: '甫',
  李: '李',
  苏: '蘇',
  清: '淸',
  照: '照',
  居: '居',
  士: '士',
  云: '雲',
  山: '山',
  水: '水',
  风: '風',
  月: '月',
  江: '江',
  南: '南',
  北: '北',
  书: '書',
  斋: '齋',
  学: '學',
  道: '道',
  仙: '仙',
  圣: '聖',
  汉: '漢',
  唐: '唐',
  宋: '宋',
  之: '之',
  印: '印',
  信: '信',
  章: '章',
  玺: '璽',
  宝: '寶',
  文: '文',
  龙: '龍',
  凤: '鳳',
  雅: '雅',
  阁: '閣',
  亭: '亭',
  园: '園',
  归: '歸',
  隐: '隱',
  剑: '劍',
  酒: '酒',
  琴: '琴',
  棋: '棋',
  乐: '樂',
  华: '華',
  国: '國',
  门: '門',
  义: '義',
  灵: '靈',
  兰: '蘭',
  竹: '竹',
  松: '松',
  梅: '梅',
  菊: '菊',
};

/**
 * 将文人雅号规范化转换为传统 2x2 四字印文：
 * 右列：第 1 字、第 2 字
 * 左列：第 3 字、第 4 字
 * 读取顺序：右起纵排（右上 -> 右下 -> 左上 -> 左下）
 */
export function getSealFourCharacters(penName: string): [string, string, string, string] {
  const clean = penName.replace(/[^\u4e00-\u9fa5]/g, '');
  let raw: [string, string, string, string];

  if (clean.length === 2) {
    // 如 "三尚" -> [三, 尚, 之, 印]
    raw = [clean[0], clean[1], '之', '印'];
  } else if (clean.length === 3) {
    // 如 "苏东坡" -> [东, 坡, 之, 印]
    raw = [clean[1], clean[2], '之', '印'];
  } else if (clean.length >= 4) {
    // 如 "青莲墨客" -> [青, 莲, 墨, 客]
    raw = [clean[0], clean[1], clean[2], clean[3]];
  } else if (clean.length === 1) {
    // 单字 -> [X, 氏, 之, 印]
    raw = [clean[0], '氏', '之', '印'];
  } else {
    raw = ['雅', '士', '之', '印'];
  }

  // 转换为古风繁篆字形
  return [
    ARCHAIC_SEAL_MAP[raw[0]] || raw[0],
    ARCHAIC_SEAL_MAP[raw[1]] || raw[1],
    ARCHAIC_SEAL_MAP[raw[2]] || raw[2],
    ARCHAIC_SEAL_MAP[raw[3]] || raw[3],
  ];
}

export interface StoneSealStampProps {
  penName: string;
  size?: 'sm' | 'md' | 'lg';
  defaultMode?: 'yin' | 'yang'; // 'yin': 阴刻白文 (红底白字石印) | 'yang': 阳刻朱文 (朱红线条边线)
  interactive?: boolean; // 是否允许点击切换阴阳刻
  showCaption?: boolean;
  className?: string;
}

export const StoneSealStamp: React.FC<StoneSealStampProps> = ({
  penName,
  size = 'md',
  defaultMode = 'yin',
  interactive = true,
  showCaption = true,
  className = '',
}) => {
  const [mode, setMode] = useState<'yin' | 'yang'>(defaultMode);
  const chars = getSealFourCharacters(penName);

  // 尺寸映射 (像素)
  const sizeMap = {
    sm: { box: 54, fontSize: 24, strokeW: 2.2 },
    md: { box: 70, fontSize: 30, strokeW: 2.8 },
    lg: { box: 88, fontSize: 38, strokeW: 3.5 },
  };
  const { box, fontSize, strokeW } = sizeMap[size];

  // 唯一 Filter ID，防止页面多个印章产生冲突
  const filterId = `stone-chisel-filter-${penName.replace(/\s+/g, '') || 'seal'}-${size}`;

  const toggleMode = () => {
    if (interactive) {
      setMode((prev) => (prev === 'yin' ? 'yang' : 'yin'));
    }
  };

  return (
    <div
      className={`inline-flex flex-col items-center select-none ${className}`}
      title={`${penName} · 金石名印 (点击切换${mode === 'yin' ? '阳刻朱文' : '阴刻白文'})`}
    >
      <div
        onClick={toggleMode}
        className={`relative ${
          interactive ? 'cursor-pointer active:scale-95 group' : ''
        } transition-transform duration-300 -rotate-1 hover:rotate-0`}
        style={{ width: box, height: box }}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          className="overflow-visible drop-shadow-[0_2px_6px_rgba(153,27,27,0.35)]"
        >
          <defs>
            {/* 金石崩边、刀痕与风化微残剥效果滤镜 (真实金石印石拓印质感) */}
            <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
              {/* 1. 模拟金石刀削与石纹崩边 (分形低频扰动) */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.065"
                numOctaves="3"
                seed="12"
                result="roughNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="roughNoise"
                scale="3.2"
                xChannelSelector="R"
                yChannelSelector="G"
                result="chiseledStone"
              />
              {/* 2. 模拟朱砂矿物印泥细微砂眼与棉纸微渗 */}
              <feTurbulence
                type="turbulence"
                baseFrequency="0.25"
                numOctaves="2"
                seed="8"
                result="fineGrain"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.6  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.2 0"
                result="cinnabarTint"
              />
              <feComposite in="chiseledStone" in2="cinnabarTint" operator="over" />
            </filter>

            {/* 真实朱砂印泥色彩渐变 (深朱砂到暗矿红) */}
            <radialGradient id={`cinnabar-fill-${filterId}`} cx="40%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#A8231E" />
              <stop offset="65%" stopColor="#8C1814" />
              <stop offset="100%" stopColor="#6E100D" />
            </radialGradient>
          </defs>

          {/* ============================================================== */}
          {/* 模式 A：【阴刻·白文】(汉唐石刻官私印最纯粹典范：红底金石，白文凿字) */}
          {/* ============================================================== */}
          {mode === 'yin' && (
            <g filter={`url(#${filterId})`}>
              {/* 印章印石基底 (带崩边微圆角方块) */}
              <rect
                x="6"
                y="6"
                width="88"
                height="88"
                rx="4"
                ry="4"
                fill={`url(#cinnabar-fill-${filterId})`}
              />

              {/* 外圈微凹边线与刀痕装饰 */}
              <rect
                x="8.5"
                y="8.5"
                width="83"
                height="83"
                rx="2"
                fill="none"
                stroke="#540C0A"
                strokeWidth="1.2"
                opacity="0.45"
              />

              {/* 模拟四角刀痕残泐微裂 (古拙金石风化感) */}
              <circle cx="8" cy="8" r="2.5" fill="#FAF6EE" opacity="0.85" />
              <circle cx="92" cy="10" r="1.8" fill="#FAF6EE" opacity="0.7" />
              <circle cx="89" cy="91" r="2.2" fill="#FAF6EE" opacity="0.75" />
              <circle cx="9" cy="90" r="1.6" fill="#FAF6EE" opacity="0.6" />

              {/* 2x2 阳白雕凿文字 (仿秦汉古印小篆修长体态) */}
              {/* 右列 (首字在右上，次字在右下) */}
              <text
                x="71"
                y="34"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#FDF9F2"
                fontSize={fontSize}
                fontWeight="900"
                fontFamily="'Songti SC', 'Source Han Serif SC', 'STSong', 'SimSun-ExtB', 'MingLiU-ExtB', 'FZXiaoZhuanTi-S19S', serif"
                letterSpacing="1"
                transform="scale(0.92, 1.25) translate(6, -8)"
                style={{ filter: 'drop-shadow(0px 0.5px 0.5px rgba(60,10,10,0.5))' }}
              >
                {chars[0]}
              </text>
              <text
                x="71"
                y="68"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#FDF9F2"
                fontSize={fontSize}
                fontWeight="900"
                fontFamily="'Songti SC', 'Source Han Serif SC', 'STSong', 'SimSun-ExtB', 'MingLiU-ExtB', 'FZXiaoZhuanTi-S19S', serif"
                letterSpacing="1"
                transform="scale(0.92, 1.25) translate(6, -14)"
                style={{ filter: 'drop-shadow(0px 0.5px 0.5px rgba(60,10,10,0.5))' }}
              >
                {chars[1]}
              </text>

              {/* 左列 (三字在左上，四字在左下) */}
              <text
                x="29"
                y="34"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#FDF9F2"
                fontSize={fontSize}
                fontWeight="900"
                fontFamily="'Songti SC', 'Source Han Serif SC', 'STSong', 'SimSun-ExtB', 'MingLiU-ExtB', 'FZXiaoZhuanTi-S19S', serif"
                letterSpacing="1"
                transform="scale(0.92, 1.25) translate(2, -8)"
                style={{ filter: 'drop-shadow(0px 0.5px 0.5px rgba(60,10,10,0.5))' }}
              >
                {chars[2]}
              </text>
              <text
                x="29"
                y="68"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#FDF9F2"
                fontSize={fontSize}
                fontWeight="900"
                fontFamily="'Songti SC', 'Source Han Serif SC', 'STSong', 'SimSun-ExtB', 'MingLiU-ExtB', 'FZXiaoZhuanTi-S19S', serif"
                letterSpacing="1"
                transform="scale(0.92, 1.25) translate(2, -14)"
                style={{ filter: 'drop-shadow(0px 0.5px 0.5px rgba(60,10,10,0.5))' }}
              >
                {chars[3]}
              </text>
            </g>
          )}

          {/* ============================================================== */}
          {/* 模式 B：【阳刻·朱文】(两宋文人雅玩：朱砂笔线，石面崩边) */}
          {/* ============================================================== */}
          {mode === 'yang' && (
            <g filter={`url(#${filterId})`}>
              {/* 粗朱砂矿物崩边石刻框 */}
              <rect
                x="7"
                y="7"
                width="86"
                height="86"
                rx="3"
                ry="3"
                fill="none"
                stroke={`url(#cinnabar-fill-${filterId})`}
                strokeWidth={strokeW + 2}
              />

              {/* 中轴十字分界微痕 (传统汉印界格) */}
              <line
                x1="50"
                y1="10"
                x2="50"
                y2="90"
                stroke={`url(#cinnabar-fill-${filterId})`}
                strokeWidth="1.2"
                strokeDasharray="4 2"
                opacity="0.3"
              />
              <line
                x1="10"
                y1="50"
                x2="90"
                y2="50"
                stroke={`url(#cinnabar-fill-${filterId})`}
                strokeWidth="1.2"
                strokeDasharray="4 2"
                opacity="0.3"
              />

              {/* 2x2 阳刻朱红篆文 */}
              {/* 右列 */}
              <text
                x="71"
                y="34"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#8C1814"
                fontSize={fontSize}
                fontWeight="900"
                fontFamily="'Songti SC', 'Source Han Serif SC', 'STSong', 'SimSun-ExtB', 'MingLiU-ExtB', 'FZXiaoZhuanTi-S19S', serif"
                letterSpacing="1"
                transform="scale(0.92, 1.25) translate(6, -8)"
              >
                {chars[0]}
              </text>
              <text
                x="71"
                y="68"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#8C1814"
                fontSize={fontSize}
                fontWeight="900"
                fontFamily="'Songti SC', 'Source Han Serif SC', 'STSong', 'SimSun-ExtB', 'MingLiU-ExtB', 'FZXiaoZhuanTi-S19S', serif"
                letterSpacing="1"
                transform="scale(0.92, 1.25) translate(6, -14)"
              >
                {chars[1]}
              </text>

              {/* 左列 */}
              <text
                x="29"
                y="34"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#8C1814"
                fontSize={fontSize}
                fontWeight="900"
                fontFamily="'Songti SC', 'Source Han Serif SC', 'STSong', 'SimSun-ExtB', 'MingLiU-ExtB', 'FZXiaoZhuanTi-S19S', serif"
                letterSpacing="1"
                transform="scale(0.92, 1.25) translate(2, -8)"
              >
                {chars[2]}
              </text>
              <text
                x="29"
                y="68"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#8C1814"
                fontSize={fontSize}
                fontWeight="900"
                fontFamily="'Songti SC', 'Source Han Serif SC', 'STSong', 'SimSun-ExtB', 'MingLiU-ExtB', 'FZXiaoZhuanTi-S19S', serif"
                letterSpacing="1"
                transform="scale(0.92, 1.25) translate(2, -14)"
              >
                {chars[3]}
              </text>
            </g>
          )}
        </svg>

        {/* 交互微提示标签 (Hover 显示) */}
        {interactive && (
          <span className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] bg-red-900/80 text-amber-100 px-1 py-0.2 rounded font-sans scale-90">
            {mode === 'yin' ? '白文' : '朱文'}
          </span>
        )}
      </div>

      {showCaption && (
        <span className="text-[10px] text-red-800/80 font-poetry tracking-widest mt-1.5 font-bold select-none flex items-center space-x-1">
          <span>金石印信</span>
          {interactive && (
            <span className="text-[9px] text-red-600/70 font-normal">
              ({mode === 'yin' ? '阴刻' : '阳刻'})
            </span>
          )}
        </span>
      )}
    </div>
  );
};
