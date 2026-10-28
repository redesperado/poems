import React, { useState } from 'react';
import { PoetEncounterData, ReciprocalPoem } from '../../types/encounter';
import { PoetData } from '../../types/poet';
import { soundEngine } from '../../engine/audio/soundEngine';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  BookOpen,
  Crown,
  Quote,
  X,
  Volume2,
  VolumeX,
  ScrollText,
  MapPin,
  Flame,
  Check,
} from 'lucide-react';

interface PoetEncounterModalProps {
  encounter: PoetEncounterData;
  currentPoet: PoetData;
  isAlreadyUnlocked?: boolean;
  onConfirm: (encounter: PoetEncounterData) => void;
  onClose: () => void;
}

export const PoetEncounterModal: React.FC<PoetEncounterModalProps> = ({
  encounter,
  currentPoet,
  isAlreadyUnlocked = false,
  onConfirm,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'narrative' | 'poems' | 'seal'>('narrative');
  const [selectedPoemIdx, setSelectedPoemIdx] = useState<number>(0);
  const [isReciting, setIsReciting] = useState<boolean>(false);

  const selectedPoem: ReciprocalPoem | undefined = encounter.reciprocalPoems[selectedPoemIdx];

  // 播放当前选中的互赠诗作
  const handleTogglePoemRecite = (poem: ReciprocalPoem) => {
    if (isReciting) {
      soundEngine.stopPoemSpeech();
      setIsReciting(false);
    } else {
      setIsReciting(true);
      soundEngine.speakPoem(poem.title, poem.verses, {
        poetDynasty: encounter.bondSeal.dynasty,
        onEnd: () => setIsReciting(false),
      });
    }
  };

  const handleConfirmEncounter = () => {
    soundEngine.playJadeChime(784); // G5 激越之声
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#E11D48', '#8B5CF6'],
    });
    onConfirm(encounter);
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-theme-surface-card border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col space-y-4 overflow-hidden text-theme-text">
        {/* 背景金辉与水墨微芒 */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-theme-primary/10 pointer-events-none" />

        {/* 1. 顶部标题栏 */}
        <div className="relative flex items-center justify-between pb-3.5 border-b border-theme-border/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-md">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-lg sm:text-xl text-theme-text font-poetry">
                  {encounter.title}
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 font-bold font-poetry">
                  千古同框 · 历史羁绊
                </span>
              </div>
              <p className="text-xs text-theme-text-muted mt-0.5 font-poetry flex items-center space-x-2">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-theme-primary" />
                  <span>{encounter.subtitle}</span>
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.stopPoemSpeech();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-theme-text-muted hover:text-theme-text hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 篇章导航 Tab */}
        <div className="relative flex items-center space-x-2 border-b border-theme-border/40 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('narrative')}
            className={`px-4 py-1.5 rounded-full text-xs font-poetry font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'narrative'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                : 'text-theme-text-muted hover:text-theme-text hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>【绝代长卷 · 历史会晤】</span>
          </button>
          <button
            onClick={() => setActiveTab('poems')}
            className={`px-4 py-1.5 rounded-full text-xs font-poetry font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'poems'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                : 'text-theme-text-muted hover:text-theme-text hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>【互赠名篇 · 墨宝唱和 ({encounter.reciprocalPoems.length})】</span>
          </button>
          <button
            onClick={() => setActiveTab('seal')}
            className={`px-4 py-1.5 rounded-full text-xs font-poetry font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'seal'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                : 'text-theme-text-muted hover:text-theme-text hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>【羁绊之印 · 铭金结契】</span>
          </button>
        </div>

        {/* 3. 主体内容展卷 */}
        <div className="relative flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
          {/* TAB 1: 历史长卷与双人对话 */}
          {activeTab === 'narrative' && (
            <div className="space-y-4 animate-in fade-in">
              {/* 历史背景评价横幅 */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-[13px] leading-relaxed text-theme-text">
                <div className="font-bold text-amber-700 dark:text-amber-300 font-poetry mb-1.5 flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>【千古一会 · 历史华章】</span>
                </div>
                <div className="space-y-2 whitespace-pre-line text-theme-text/90">
                  {encounter.historicalNarrative}
                </div>
              </div>

              {/* 双人对坐画像屏风 */}
              <div className="grid grid-cols-11 gap-2 items-center p-3 sm:p-4 rounded-2xl bg-theme-surface border border-theme-border/60">
                {/* 主角屏风 */}
                <div className="col-span-5 flex flex-col items-center text-center p-3 rounded-xl bg-theme-surface-card border border-theme-border">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-theme-primary/50 shadow-md mb-2 bg-theme-primary/10 flex items-center justify-center font-poetry font-bold text-lg text-theme-primary">
                    {currentPoet.avatar_image ? (
                      <img src={currentPoet.avatar_image} alt={currentPoet.name_cn} className="w-full h-full object-cover" />
                    ) : (
                      currentPoet.name_cn.slice(-2)
                    )}
                  </div>
                  <div className="font-bold font-poetry text-sm text-theme-text">
                    {currentPoet.name_cn}（{currentPoet.title}）
                  </div>
                  <div className="text-[11px] text-theme-text-muted mt-0.5 font-poetry">
                    公元 {encounter.year} 年 · 时年 {encounter.year - currentPoet.born} 岁
                  </div>
                </div>

                {/* 中间交汇徽标 */}
                <div className="col-span-1 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center border border-amber-500/40 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-poetry text-amber-700 dark:text-amber-400 whitespace-nowrap mt-1">
                    同框相遇
                  </span>
                </div>

                {/* 相遇文人屏风 */}
                <div className="col-span-5 flex flex-col items-center text-center p-3 rounded-xl bg-theme-surface-card border border-theme-border">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-md mb-2 bg-amber-500/10 flex items-center justify-center font-poetry font-bold text-lg text-amber-600">
                    {encounter.secondaryPoet.avatarImage ? (
                      <img src={encounter.secondaryPoet.avatarImage} alt={encounter.secondaryPoet.name} className="w-full h-full object-cover" />
                    ) : (
                      encounter.secondaryPoet.avatarText
                    )}
                  </div>
                  <div className="font-bold font-poetry text-sm text-theme-text">
                    {encounter.secondaryPoet.name}（{encounter.secondaryPoet.title}）
                  </div>
                  <div className="text-[11px] text-theme-text-muted mt-0.5 font-poetry">
                    字{encounter.secondaryPoet.courtesyName} · 时年 {encounter.secondaryPoet.age} 岁
                  </div>
                </div>
              </div>

              {/* 沉浸对白对话流 */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-bold font-poetry text-theme-text-muted flex items-center space-x-1.5">
                  <Quote className="w-3.5 h-3.5 text-amber-500" />
                  <span>【酒肆相逢 · 对白唱和】</span>
                </div>

                <div className="space-y-3">
                  {encounter.dialogues.map((dlg, idx) => {
                    const isSelf = dlg.speakerId === currentPoet.id || dlg.speakerId === encounter.primaryPoetId;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start space-x-3 p-3.5 rounded-2xl border transition-all ${
                          isSelf
                            ? 'bg-theme-primary/5 border-theme-primary/30 mr-4 sm:mr-8'
                            : 'bg-amber-500/5 border-amber-500/30 ml-4 sm:ml-8'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-poetry font-bold text-xs text-white shrink-0 shadow-xs ${
                            isSelf ? 'bg-theme-primary' : 'bg-amber-600'
                          }`}
                        >
                          {dlg.avatarText}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs font-poetry text-theme-text">
                              {dlg.speakerName} · <span className="text-[11px] text-theme-text-muted font-normal">{dlg.speakerTitle}</span>
                            </span>
                            {dlg.quote && (
                              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-poetry italic">
                                {dlg.quote}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-theme-text leading-relaxed font-poetry">
                            {dlg.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 互赠名篇与墨宝唱和 */}
          {activeTab === 'poems' && (
            <div className="space-y-4 animate-in fade-in">
              {/* 顶部诗作选择卡 */}
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
                {encounter.reciprocalPoems.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPoemIdx(idx);
                      soundEngine.stopPoemSpeech();
                      setIsReciting(false);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-poetry font-bold whitespace-nowrap transition-all border cursor-pointer ${
                      selectedPoemIdx === idx
                        ? 'bg-theme-surface-card border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'bg-theme-surface/70 border-theme-border/60 text-theme-text-muted hover:text-theme-text'
                    }`}
                  >
                    《{p.title}》
                    <span className="text-[10px] ml-1.5 opacity-75">
                      ({p.author} 赠 {p.recipient})
                    </span>
                  </button>
                ))}
              </div>

              {/* 当前选中诗篇全卷展示 */}
              {selectedPoem && (
                <div className="p-5 rounded-3xl bg-theme-surface border border-theme-border space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-theme-border/60 pb-3">
                    <div>
                      <h3 className="font-bold font-poetry text-base text-theme-text flex items-center space-x-2">
                        <span>《{selectedPoem.title}》</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          {selectedPoem.author} 作赠 {selectedPoem.recipient}
                        </span>
                      </h3>
                      <p className="text-xs text-theme-text-muted mt-1 font-poetry">
                        {selectedPoem.background}
                      </p>
                    </div>

                    <button
                      onClick={() => handleTogglePoemRecite(selectedPoem)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-poetry font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isReciting
                          ? 'bg-amber-600 text-white border-amber-300 animate-pulse'
                          : 'bg-theme-surface-card hover:bg-theme-surface text-theme-text border-theme-border'
                      }`}
                      title="聆听名家诵读"
                    >
                      {isReciting ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>暂停诵读</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-theme-primary" />
                          <span>✦ 聆听诵读</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 诗句大字展示屏风 */}
                  <div className="py-4 px-6 rounded-2xl bg-theme-surface-card border border-theme-border/70 text-center space-y-2">
                    {selectedPoem.verses.map((v, i) => (
                      <div key={i} className="text-sm sm:text-base font-poetry font-bold text-theme-text tracking-wide">
                        {v}
                      </div>
                    ))}
                  </div>

                  {/* 名家鉴赏评点 */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-theme-text leading-relaxed">
                    <span className="font-bold text-amber-700 dark:text-amber-300 font-poetry">【美学赏析】：</span>
                    {selectedPoem.appreciation}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 羁绊之印与心境增益 */}
          {activeTab === 'seal' && (
            <div className="space-y-4 animate-in fade-in flex flex-col items-center text-center p-4">
              {/* 红色朱砂方印 */}
              <div className="w-32 h-32 rounded-3xl border-4 border-red-700 bg-gradient-to-br from-red-600 to-red-800 text-white flex flex-col items-center justify-center p-2 shadow-2xl shadow-red-950/40 relative group">
                <div className="w-full h-full border-2 border-dashed border-red-300/60 rounded-2xl flex flex-col items-center justify-center space-y-1">
                  <Crown className="w-6 h-6 text-amber-200" />
                  <span className="font-poetry font-bold text-lg tracking-widest text-amber-100">
                    {encounter.bondSeal.name}
                  </span>
                  <span className="text-[10px] font-poetry text-red-200">
                    千古名仕印
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg font-poetry text-theme-text mt-2">
                  【{encounter.bondSeal.sealTitle}】
                </h3>
                <p className="text-xs text-theme-text-muted font-poetry mt-1 max-w-lg">
                  {encounter.bondSeal.description}
                </p>
              </div>

              {/* 缔结文人与缔结时间 */}
              <div className="flex items-center space-x-3 text-xs font-poetry bg-theme-surface p-3 rounded-2xl border border-theme-border">
                <span>缔结文人：<b>{encounter.bondSeal.poetNames.join(' × ')}</b></span>
                <span>•</span>
                <span>缔结年月：公元 <b>{encounter.bondSeal.unlockedAtYear}</b> 年</span>
                <span>•</span>
                <span>缔结地点：<b>{encounter.bondSeal.locationName}</b></span>
              </div>

              {/* 心境激荡收益 */}
              <div className="w-full max-w-md p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 font-poetry">✦ 文心激荡收益：</span>
                <div className="flex items-center justify-center space-x-4 mt-2 font-mono font-bold text-emerald-800 dark:text-emerald-200">
                  {Object.entries(encounter.moodDelta).map(([k, v]) => (
                    <span key={k} className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                      {k === 'freedom' && '洒脱'}
                      {k === 'passion' && '豪迈'}
                      {k === 'anger' && '愤懑'}
                      {k === 'homesickness' && '乡愁'}
                      {k === 'sorrow' && '悲悯'}{' '}
                      {v > 0 ? `+${v}` : v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. 底部行动栏 */}
        <div className="relative pt-3 border-t border-theme-border/60 shrink-0 flex items-center justify-between">
          <div className="text-xs text-theme-text-muted font-poetry">
            {isAlreadyUnlocked
              ? '✦ 已经历此段千古奇逢，可随时于典藏阁重温唱和诗卷'
              : '✦ 亲历此段旷世相会，将永久点亮专属金石印章并收录互赠诗作'}
          </div>

          <div className="flex items-center space-x-2">
            {!isAlreadyUnlocked ? (
              <button
                onClick={handleConfirmEncounter}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:opacity-95 text-white font-bold font-poetry text-xs shadow-lg flex items-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>缔结千古羁绊 · 铭金入册 ➔</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundEngine.stopPoemSpeech();
                  onClose();
                }}
                className="px-6 py-2.5 rounded-full bg-theme-surface hover:bg-theme-surface-card border border-theme-border text-theme-text font-bold font-poetry text-xs active:scale-95 transition-all cursor-pointer"
              >
                合卷静思
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
