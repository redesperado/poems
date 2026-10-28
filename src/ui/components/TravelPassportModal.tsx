import React, { useEffect, useState } from 'react';
import { PoetData } from '../../types/poet';
import { PoemData } from '../../types/poem';
import { MoodState } from '../../types/mood';
import { ALL_ARTIFACTS } from '../../data/artifacts';
import { soundEngine } from '../../engine/audio/soundEngine';
import { Download, X, Sparkles, Share2, Check, Award } from 'lucide-react';

interface TravelPassportModalProps {
  poet: PoetData;
  dynasty: 'tang' | 'song';
  poems: PoemData[];
  unlockedPoemIds: string[];
  poemScores: Record<string, number>;
  unlockedBondIds?: string[];
  unlockedArtifactIds?: string[];
  mood: MoodState;
  completedEventCount?: number;
  onClose: () => void;
}

export const TravelPassportModal: React.FC<TravelPassportModalProps> = ({
  poet,
  dynasty,
  poems,
  unlockedPoemIds,
  poemScores,
  unlockedBondIds = [],
  unlockedArtifactIds = [],
  mood,
  completedEventCount = 0,
  onClose,
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // 收集品统计
  const unlockedPoems = poems.filter((p) => unlockedPoemIds.includes(p.id));
  const unlockedArtifacts = (unlockedArtifactIds || [])
    .map((id) => ALL_ARTIFACTS[id])
    .filter(Boolean);

  useEffect(() => {
    generatePassportImage();
  }, []);

  const generatePassportImage = () => {
    setIsGenerating(true);
    const canvas = document.createElement('canvas');
    // 高清画质：长卷基准 800 x 1400 (2x Retina 缩放: 1600 x 2800)
    const scale = 2;
    const width = 800 * scale;
    const height = 1380 * scale;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. 绢本暖宣底色
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#FAF7F0');
    bgGradient.addColorStop(0.5, '#F5EFE3');
    bgGradient.addColorStop(1, '#EDE4D3');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 细微宣纸纤维杂质感
    ctx.fillStyle = 'rgba(180, 160, 130, 0.03)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rw = Math.random() * 4 * scale;
      const rh = Math.random() * 2 * scale;
      ctx.fillRect(rx, ry, rw, rh);
    }

    // 2. 双重朱砂泥金边框
    const margin = 24 * scale;
    // 外圈金线
    ctx.strokeStyle = '#C29B38';
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    // 内圈朱红重线
    const innerMargin = margin + 8 * scale;
    ctx.strokeStyle = '#8C2522';
    ctx.lineWidth = 4 * scale;
    ctx.strokeRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);

    // 四角回纹装饰点缀
    const cornerSize = 20 * scale;
    ctx.fillStyle = '#8C2522';
    // 左上
    ctx.fillRect(innerMargin, innerMargin, cornerSize, 3 * scale);
    ctx.fillRect(innerMargin, innerMargin, 3 * scale, cornerSize);
    // 右上
    ctx.fillRect(width - innerMargin - cornerSize, innerMargin, cornerSize, 3 * scale);
    ctx.fillRect(width - innerMargin - 3 * scale, innerMargin, 3 * scale, cornerSize);
    // 左下
    ctx.fillRect(innerMargin, height - innerMargin - 3 * scale, cornerSize, 3 * scale);
    ctx.fillRect(innerMargin, height - innerMargin - cornerSize, 3 * scale, cornerSize);
    // 右下
    ctx.fillRect(width - innerMargin - cornerSize, height - innerMargin - 3 * scale, cornerSize, 3 * scale);
    ctx.fillRect(width - innerMargin - 3 * scale, height - innerMargin - cornerSize, 3 * scale, cornerSize);

    // 3. 顶部额楣：通关文牒金石篆额
    let currentY = innerMargin + 35 * scale;

    // 朝代通关大章
    ctx.fillStyle = '#8C2522';
    ctx.font = `bold ${14 * scale}px "STSong", "Songti SC", "SimSun", serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`【 ${dynasty === 'tang' ? '大唐天宝' : '大宋元丰'} · 鸿胪寺礼部颁颁牒 】`, width / 2, currentY);

    currentY += 28 * scale;
    ctx.fillStyle = '#1C1917';
    ctx.font = `bold ${32 * scale}px "STSong", "Songti SC", "SimSun", serif`;
    ctx.fillText('山 河 行 履 通 关 文 牒', width / 2, currentY);

    currentY += 16 * scale;
    ctx.fillStyle = '#78716C';
    ctx.font = `${11 * scale}px "STSong", "Songti SC", serif`;
    ctx.fillText('奉旨周游华夏名胜 · 词华光耀千秋宗师牒记', width / 2, currentY);

    // 分隔泥金线
    currentY += 18 * scale;
    ctx.strokeStyle = '#D6B875';
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(margin + 50 * scale, currentY);
    ctx.lineTo(width - margin - 50 * scale, currentY);
    ctx.stroke();

    // 4. 文人身份与肖像铭牌
    currentY += 32 * scale;
    // 肖像卡片底衬
    const profileBoxX = innerMargin + 24 * scale;
    const profileBoxW = width - (innerMargin + 24 * scale) * 2;
    const profileBoxH = 110 * scale;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(profileBoxX, currentY, profileBoxW, profileBoxH);
    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(profileBoxX, currentY, profileBoxW, profileBoxH);

    // 文人尊号与生平
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1C1917';
    ctx.font = `bold ${24 * scale}px "STSong", "Songti SC", serif`;
    ctx.fillText(`${poet.name_cn}`, profileBoxX + 20 * scale, currentY + 36 * scale);

    // 尊号印记
    ctx.fillStyle = '#8C2522';
    ctx.font = `bold ${12 * scale}px "STSong", "Songti SC", serif`;
    ctx.fillText(`【 ${poet.title} · ${poet.dynasty === 'tang' ? '盛唐文宗' : '两宋词宗'} 】`, profileBoxX + 110 * scale, currentY + 34 * scale);

    // 传世名句
    ctx.fillStyle = '#44403C';
    ctx.font = `italic ${12 * scale}px "STSong", "Songti SC", serif`;
    const iconicQuote = poet.id === 'li_bai'
      ? '“大鹏一日同风起，扶摇直上九万里。”'
      : poet.id === 'du_fu'
      ? '“安得广厦千万间，大庇天下寒士俱欢颜！”'
      : poet.id === 'su_shi'
      ? '“竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。”'
      : '“生当作人杰，死亦为鬼雄。”';
    ctx.fillText(iconicQuote, profileBoxX + 20 * scale, currentY + 65 * scale);

    // 履痕总纲
    ctx.fillStyle = '#78716C';
    ctx.font = `${11 * scale}px "STSong", "Songti SC", serif`;
    ctx.fillText(
      `生平纪年：${poet.start_year || 701} 年起步 · 历经山河事件 ${completedEventCount} 幕 · 结缘名士 ${unlockedBondIds.length} 位`,
      profileBoxX + 20 * scale,
      currentY + 92 * scale
    );

    // 右侧朱砂【甲等】大印
    const sealX = profileBoxX + profileBoxW - 60 * scale;
    const sealY = currentY + 25 * scale;
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(sealX, sealY, 50 * scale, 50 * scale);
    ctx.fillStyle = '#DC2626';
    ctx.font = `bold ${16 * scale}px "STSong", "Songti SC", serif`;
    ctx.textAlign = 'center';
    ctx.fillText('宗 师', sealX + 25 * scale, sealY + 22 * scale);
    ctx.fillText('准 牒', sealX + 25 * scale, sealY + 42 * scale);

    // 5. 传世诗词纳藏展评 (中部)
    currentY += profileBoxH + 28 * scale;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#8C2522';
    ctx.font = `bold ${15 * scale}px "STSong", "Songti SC", serif`;
    ctx.fillText('❖【 传 世 墨 宝 · 研 读 推 敲 功 令 】', innerMargin + 24 * scale, currentY);

    currentY += 16 * scale;
    const poemList = unlockedPoems.slice(0, 6);
    const cardW = (width - (innerMargin + 24 * scale) * 2 - 12 * scale) / 2;
    const cardH = 58 * scale;

    poemList.forEach((poem, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const px = innerMargin + 24 * scale + col * (cardW + 12 * scale);
      const py = currentY + row * (cardH + 8 * scale);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(px, py, cardW, cardH);
      ctx.strokeStyle = '#E7E5E4';
      ctx.lineWidth = 1 * scale;
      ctx.strokeRect(px, py, cardW, cardH);

      // 诗名
      ctx.fillStyle = '#1C1917';
      ctx.font = `bold ${12 * scale}px "STSong", "Songti SC", serif`;
      ctx.fillText(`《${poem.title}》`, px + 10 * scale, py + 22 * scale);

      // 考题首句
      ctx.fillStyle = '#57534E';
      ctx.font = `${10 * scale}px "STSong", "Songti SC", serif`;
      const versePreview = poem.lines[0]?.text || poem.translation || '';
      ctx.fillText(versePreview.slice(0, 16) + (versePreview.length > 16 ? '...' : ''), px + 10 * scale, py + 42 * scale);

      // 得分红印
      const score = poemScores[poem.id] || 100;
      const rankText = score >= 90 ? '妙品' : score >= 75 ? '研精' : '通习';
      ctx.fillStyle = '#DC2626';
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 1 * scale;
      const markX = px + cardW - 40 * scale;
      const markY = py + 12 * scale;
      ctx.strokeRect(markX, markY, 32 * scale, 32 * scale);
      ctx.font = `bold ${10 * scale}px "STSong", "Songti SC", serif`;
      ctx.textAlign = 'center';
      ctx.fillText(rankText, markX + 16 * scale, markY + 20 * scale);
      ctx.textAlign = 'left';
    });

    currentY += Math.ceil(poemList.length / 2) * (cardH + 8 * scale) + 16 * scale;

    // 6. 山河风物匣行囊展示 (下半部)
    ctx.fillStyle = '#8C2522';
    ctx.font = `bold ${15 * scale}px "STSong", "Songti SC", serif`;
    ctx.fillText('❖【 山 河 风 物 · 文 人 行 囊 宝 鉴 】', innerMargin + 24 * scale, currentY);

    currentY += 16 * scale;
    const artifactList = unlockedArtifacts.slice(0, 6);
    const artCardW = (width - (innerMargin + 24 * scale) * 2 - 16 * scale) / 3;
    const artCardH = 48 * scale;

    artifactList.forEach((art, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const ax = innerMargin + 24 * scale + col * (artCardW + 8 * scale);
      const ay = currentY + row * (artCardH + 8 * scale);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(ax, ay, artCardW, artCardH);
      ctx.strokeStyle = '#E7E5E4';
      ctx.lineWidth = 1 * scale;
      ctx.strokeRect(ax, ay, artCardW, artCardH);

      // 图标与名称
      ctx.font = `${18 * scale}px serif`;
      ctx.fillText(art.icon, ax + 8 * scale, ay + 30 * scale);

      ctx.fillStyle = '#1C1917';
      ctx.font = `bold ${11 * scale}px "STSong", "Songti SC", serif`;
      ctx.fillText(art.name.slice(0, 7), ax + 34 * scale, ay + 20 * scale);

      ctx.fillStyle = '#8C2522';
      ctx.font = `${9 * scale}px "STSong", "Songti SC", serif`;
      ctx.fillText(art.categoryName, ax + 34 * scale, ay + 36 * scale);
    });

    currentY += Math.ceil(artifactList.length / 3) * (artCardH + 8 * scale) + 16 * scale;

    // 7. 五维心境雷达柱状统览
    ctx.fillStyle = '#8C2522';
    ctx.font = `bold ${15 * scale}px "STSong", "Songti SC", serif`;
    ctx.fillText('❖【 五 维 心 境 · 文 心 气 象 评 定 】', innerMargin + 24 * scale, currentY);

    currentY += 20 * scale;
    const moodDimensions = [
      { label: '豪情', value: mood.passion || 50, color: '#F59E0B' },
      { label: '忧思', value: mood.sorrow || 30, color: '#0284C7' },
      { label: '洒脱', value: mood.freedom || 75, color: '#10B981' },
      { label: '愤懑', value: mood.anger || 20, color: '#DC2626' },
      { label: '乡愁', value: mood.homesickness || 40, color: '#8B5CF6' },
    ];

    const barW = (width - (innerMargin + 24 * scale) * 2) / moodDimensions.length;
    moodDimensions.forEach((dim, idx) => {
      const bx = innerMargin + 24 * scale + idx * barW;
      const progressW = barW - 16 * scale;
      // 标签
      ctx.fillStyle = '#44403C';
      ctx.font = `bold ${11 * scale}px "STSong", "Songti SC", serif`;
      ctx.fillText(`${dim.label} ${dim.value}`, bx + 4 * scale, currentY);

      // 底槽
      ctx.fillStyle = '#E7E5E4';
      ctx.fillRect(bx + 4 * scale, currentY + 6 * scale, progressW, 6 * scale);

      // 填充条
      ctx.fillStyle = dim.color;
      ctx.fillRect(bx + 4 * scale, currentY + 6 * scale, (progressW * dim.value) / 100, 6 * scale);
    });

    // 8. 底部颁牒官印与通关编码
    currentY += 45 * scale;
    ctx.strokeStyle = '#D6B875';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(margin + 40 * scale, currentY);
    ctx.lineTo(width - margin - 40 * scale, currentY);
    ctx.stroke();

    currentY += 22 * scale;
    ctx.fillStyle = '#78716C';
    ctx.font = `${10 * scale}px "STSong", "Songti SC", serif`;
    ctx.textAlign = 'left';
    const dateStr = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    ctx.fillText(`通关日期：${dateStr} · 典藏编号：TG-${poet.id.toUpperCase()}-${Math.floor(Date.now() / 1000).toString().slice(-6)}`, innerMargin + 24 * scale, currentY);

    ctx.fillText('山河诗境 · 沉浸式文人长卷研学系统 谨呈', innerMargin + 24 * scale, currentY + 16 * scale);

    // 终极红泥朱砂四方法印
    const imperialSealX = width - innerMargin - 90 * scale;
    const imperialSealY = currentY - 14 * scale;
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2.5 * scale;
    ctx.strokeRect(imperialSealX, imperialSealY, 56 * scale, 56 * scale);
    ctx.fillStyle = '#DC2626';
    ctx.font = `bold ${12 * scale}px "STSong", "Songti SC", serif`;
    ctx.textAlign = 'center';
    ctx.fillText('山 河', imperialSealX + 28 * scale, imperialSealY + 24 * scale);
    ctx.fillText('永 固', imperialSealX + 28 * scale, imperialSealY + 44 * scale);

    // 导出 Base64
    const url = canvas.toDataURL('image/png');
    setDataUrl(url);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `山河通关文牒_${poet.name_cn}_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    soundEngine.playJadeChime();
  };

  const handleCopy = async () => {
    if (!dataUrl) return;
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
      soundEngine.playJadeChime();
    } catch {
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[94vh] bg-stone-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl text-stone-100 flex flex-col overflow-hidden">
        {/* 顶部控制栏 */}
        <div className="px-5 py-3.5 border-b border-amber-500/30 bg-stone-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📜</span>
            <div>
              <h3 className="font-bold font-poetry text-amber-300 text-sm sm:text-base">
                通关文牒 · 山河行履图长卷
              </h3>
              <p className="text-[11px] text-stone-400">
                可一键导出为高清国风海报长图，长按亦可保存到相册
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>保存高清图</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 border border-stone-600 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 长图画布展示区 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center bg-stone-950/40 no-scrollbar">
          {isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-3">
              <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-xs text-amber-300 font-poetry">正在以泥金朱砂绘制山河长卷文牒...</p>
            </div>
          ) : dataUrl ? (
            <div className="relative group max-w-md w-full shadow-2xl rounded-2xl overflow-hidden border-2 border-amber-500/40">
              <img
                src={dataUrl}
                alt="通关文牒山河行履图"
                className="w-full h-auto block select-none pointer-events-auto"
              />
              <div className="p-3 bg-stone-900 border-t border-amber-500/20 text-center text-xs text-amber-200/80 font-poetry">
                📱 手机端长按上方图片可直接“存储图像”
              </div>
            </div>
          ) : null}
        </div>

        {/* 底部行动控制 */}
        <div className="p-3.5 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between text-xs shrink-0">
          <div className="text-stone-400 text-[11px] flex items-center space-x-1 font-poetry">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>已收录诗篇 {unlockedPoems.length} 首 · 纳藏风物 {unlockedArtifacts.length} 件</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-full bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 font-bold transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>已复制到剪贴板</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-stone-300" />
                  <span>复制长图</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold shadow-md transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载保存图片</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
