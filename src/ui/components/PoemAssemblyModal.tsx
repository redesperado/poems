import React, { useState, useEffect } from 'react';
import { PoemData, PoemLine } from '../../types/poem';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  BookOpen,
  Feather,
  Quote,
  Eye,
  PenTool,
  RotateCcw,
  ScrollText,
  Lightbulb,
} from 'lucide-react';

interface PoemAssemblyModalProps {
  poem: PoemData;
  onComplete: (poemId: string, score: number) => void;
  onClose: () => void;
}

type PlayMode = 'preview' | 'assembly' | 'dictation';
type AnalysisFilter = 'all' | 'translation' | 'keywords' | 'appreciation' | 'journal';

export const PoemAssemblyModal: React.FC<PoemAssemblyModalProps> = ({
  poem,
  onComplete,
  onClose,
}) => {
  // 核心模式：'preview' (全篇精读) | 'assembly' (推敲填词) | 'dictation' (名篇默写)
  const [activeMode, setActiveMode] = useState<PlayMode>('assembly');

  // 小屏视图切换 ('poem' | 'analysis')
  const [mobileView, setMobileView] = useState<'poem' | 'analysis'>('poem');

  // 右侧解析筛选 ('all' | 'translation' | 'keywords' | 'appreciation' | 'journal')
  const [analysisFilter, setAnalysisFilter] = useState<AnalysisFilter>('all');

  // 动态墨润动画状态 (行逐行显现)
  const [renderedLineCount, setRenderedLineCount] = useState<number>(0);

  // 重点词交互聚焦
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

  // 导读遮瑕防剧透状态 (推敲/默写中默认遮盖答案线索，避免直接剧透)
  const [showTranslationHint, setShowTranslationHint] = useState<boolean>(false);
  const [revealedKeywords, setRevealedKeywords] = useState<Record<string, boolean>>({});

  // 【推敲填词】状态
  const blankLines = poem.lines
    .map((line, index) => ({ line, lineIndex: index }))
    .filter((item) => item.line.blank_index !== null);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [wrongExplanation, setWrongExplanation] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(100);

  // 【名篇默写】状态
  const [dictationStep, setDictationStep] = useState<number>(0);
  const [dictationInput, setDictationInput] = useState<string>('');
  const [dictationErrors, setDictationErrors] = useState<number>(0);
  const [dictationDone, setDictationDone] = useState<boolean>(false);

  const currentStep = blankLines[currentStepIndex];
  const currentLine: PoemLine | undefined = currentStep?.line;

  // 动态墨润逐行显现动画
  useEffect(() => {
    setRenderedLineCount(0);
    const interval = setInterval(() => {
      setRenderedLineCount((prev) => {
        if (prev < poem.lines.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 240);
    return () => clearInterval(interval);
  }, [poem.id, activeMode]);

  // 当切换模式时重置提示状态
  useEffect(() => {
    setShowTranslationHint(false);
    setRevealedKeywords({});
  }, [activeMode]);

  // 推敲选项选择
  const handleOptionSelect = (option: string) => {
    if (!currentLine || isFinished) return;
    setSelectedWord(option);
    const correct = currentLine.correct;

    if (option === correct) {
      setIsAnswerCorrect(true);
      setWrongExplanation(null);

      setTimeout(() => {
        if (currentStepIndex + 1 < blankLines.length) {
          setCurrentStepIndex((prev) => prev + 1);
          setSelectedWord(null);
          setIsAnswerCorrect(null);
        } else {
          finishAssembly();
        }
      }, 700);
    } else {
      setIsAnswerCorrect(false);
      const newErrors = errorCount + 1;
      setErrorCount(newErrors);
      if (newErrors === 1) setFinalScore(75);
      else if (newErrors >= 2) setFinalScore(50);

      const explanation =
        currentLine.wrong_explanations?.[option] ||
        '此字在格律、气度或自然物象描写上略逊一筹。';
      setWrongExplanation(explanation);
    }
  };

  // 跳过填空
  const handleSkip = () => {
    if (!currentLine) return;
    setFinalScore(50);
    if (currentStepIndex + 1 < blankLines.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedWord(null);
      setIsAnswerCorrect(null);
      setWrongExplanation(null);
    } else {
      finishAssembly();
    }
  };

  const finishAssembly = () => {
    setIsFinished(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#0D9488', '#F472B6'],
    });
    onComplete(poem.id, finalScore);
  };

  // 默写行提交检查
  const handleDictationCheck = () => {
    const targetLine = poem.lines[dictationStep];
    if (!targetLine) return;

    const trimmedInput = dictationInput.trim().replace(/[，。？！、]/g, '');
    const cleanTarget = targetLine.text.replace(/[，。？！、]/g, '');

    if (trimmedInput === cleanTarget) {
      if (dictationStep + 1 < poem.lines.length) {
        setDictationStep((prev) => prev + 1);
        setDictationInput('');
      } else {
        setDictationDone(true);
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#10B981', '#0D9488', '#F59E0B'],
        });
        onComplete(poem.id, dictationErrors === 0 ? 100 : 80);
      }
    } else {
      setDictationErrors((prev) => prev + 1);
      alert(`原句为：“${targetLine.text}”，再仔细回忆一下吧！`);
    }
  };

  // 判定某词条是否属于当前正在考核的答案字 (用于避免直接剧透)
  const isWordCurrentAnswer = (word: string) => {
    if (activeMode === 'preview' || isFinished) return false;
    if (activeMode === 'assembly' && currentLine?.correct) {
      return word.includes(currentLine.correct) || currentLine.correct.includes(word);
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/65 backdrop-blur-md animate-in fade-in select-none">
      {/* 展馆级主模态框 (双联屏长卷设计，严格遵循主题变量) */}
      <div className="relative w-full max-w-6xl bg-theme-surface-card border border-theme-border rounded-[2rem] shadow-2xl flex flex-col h-[92vh] max-h-[900px] overflow-hidden text-theme-text">
        
        {/* =================================================================== */}
        {/* 1. 顶栏：诗题华彩、朝代印鉴、三大模式切换与关闭按钮 */}
        {/* =================================================================== */}
        <header className="px-5 py-3.5 border-b border-theme-border/60 bg-theme-surface backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* 左侧：诗题与作者朝代徽章 */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-theme-primary/10 text-theme-primary flex items-center justify-center border border-theme-primary/30 shrink-0 shadow-sm">
              <ScrollText className="w-5 h-5 text-theme-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold font-poetry tracking-wide text-theme-text">
                  《{poem.title}》
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-theme-accent/10 text-theme-accent font-bold border border-theme-accent/30 font-poetry shadow-xs">
                  {poem.poet_id === 'su_shi' ? '东坡墨宝' : '太白真迹'}
                </span>
              </div>
              <p className="text-[11px] text-theme-text-muted font-poetry">
                {poem.dynasty === 'tang' ? '盛唐' : '两宋'} · {poem.form === 'ci' ? `词牌【${poem.cipai}】` : '近体律绝'} · 公元 {poem.year} 年
              </p>
            </div>
          </div>

          {/* 中间：三大研学模式切换按钮 (全篇精读 / 格律推敲 / 名篇背默) */}
          <div className="flex items-center bg-theme-surface border border-theme-border rounded-full p-1 shadow-inner space-x-1">
            <button
              onClick={() => setActiveMode('preview')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all font-poetry ${
                activeMode === 'preview'
                  ? 'bg-theme-primary text-white font-bold shadow-jade-glow'
                  : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-card'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>全篇精读</span>
            </button>
            <button
              onClick={() => setActiveMode('assembly')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all font-poetry ${
                activeMode === 'assembly'
                  ? 'bg-theme-primary text-white font-bold shadow-jade-glow'
                  : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-card'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>格律推敲</span>
            </button>
            <button
              onClick={() => setActiveMode('dictation')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all font-poetry ${
                activeMode === 'dictation'
                  ? 'bg-theme-primary text-white font-bold shadow-jade-glow'
                  : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-card'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>名篇默写</span>
            </button>
          </div>

          {/* 小屏专属：切换【诗卷】与【解析】标签 */}
          <div className="flex lg:hidden items-center bg-theme-surface rounded-full p-0.5 border border-theme-border">
            <button
              onClick={() => setMobileView('poem')}
              className={`px-3 py-1 rounded-full text-xs font-bold font-poetry ${
                mobileView === 'poem' ? 'bg-theme-primary text-white shadow-xs' : 'text-theme-text-muted'
              }`}
            >
              诗境卷面
            </button>
            <button
              onClick={() => setMobileView('analysis')}
              className={`px-3 py-1 rounded-full text-xs font-bold font-poetry ${
                mobileView === 'analysis' ? 'bg-theme-primary text-white shadow-xs' : 'text-theme-text-muted'
              }`}
            >
              译文赏析
            </button>
          </div>

          {/* 右侧：关闭按钮 */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-theme-surface hover:bg-theme-surface-card text-theme-text-muted hover:text-theme-text border border-theme-border flex items-center justify-center transition-all shadow-xs"
            title="关闭弹窗"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* =================================================================== */}
        {/* 2. 双联展卷主体区域 (左卷：诗境与互动 | 右卷：译文/字解/赏析/手记) */}
        {/* =================================================================== */}
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-theme-border/60">
          
          {/* ----------------------------------------------------------------- */}
          {/* 左卷 (5列)：诗屏吟诵、填词推敲与选项交互 */}
          {/* ----------------------------------------------------------------- */}
          <div
            className={`col-span-12 lg:col-span-5 flex flex-col justify-between p-4 sm:p-6 bg-theme-canvas overflow-y-auto no-scrollbar ${
              mobileView === 'poem' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {/* 上部：宣纸绢本诗屏 */}
            <div className="relative text-center px-4 py-6 bg-theme-surface-card rounded-3xl border border-theme-border shadow-sm space-y-4">
              {/* 装饰水印 */}
              <div className="absolute right-4 bottom-3 opacity-10 pointer-events-none select-none text-theme-accent font-poetry text-4xl border-2 border-theme-accent p-1.5 rounded-lg rotate-12">
                文心
              </div>

              <div className="text-xs text-theme-text-muted font-poetry border-b border-dashed border-theme-border/60 pb-2">
                {activeMode === 'preview' && '✦ 全篇精读 · 重点词条与译文赏析已全览展开 ✦'}
                {activeMode === 'assembly' && '✦ 格律推敲 · 斟酌文心，右侧锦囊可在卡壳时参阅 ✦'}
                {activeMode === 'dictation' && '✦ 经典背默 · 逐句还原传世绝唱，检验真功 ✦'}
              </div>

              {/* 逐行墨润渐显诗句 */}
              <div className="space-y-4 font-poetry text-xl sm:text-2xl text-theme-text leading-relaxed tracking-widest py-2">
                {poem.lines.map((line, idx) => {
                  const isVisible = idx < renderedLineCount;

                  // 1. 全篇精读模式
                  if (activeMode === 'preview') {
                    return (
                      <p
                        key={idx}
                        className={`transition-all duration-700 ${
                          isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-2 blur-[2px]'
                        }`}
                      >
                        {line.text}
                      </p>
                    );
                  }

                  // 2. 名篇默写模式
                  if (activeMode === 'dictation') {
                    const isPast = idx < dictationStep;
                    const isCurrent = idx === dictationStep;
                    return (
                      <p
                        key={idx}
                        className={`transition-all duration-500 ${
                          isPast
                            ? 'text-theme-primary font-bold'
                            : isCurrent
                            ? 'text-theme-gold font-bold animate-pulse'
                            : 'text-theme-text-muted/40'
                        }`}
                      >
                        {isPast ? line.text : isCurrent ? `第 ${idx + 1} 句：待背默...` : '············'}
                      </p>
                    );
                  }

                  // 3. 推敲填词模式
                  const isCurrentQuestion = currentStep && currentStep.lineIndex === idx;

                  if (line.blank_index === null) {
                    return (
                      <p
                        key={idx}
                        className={`transition-all duration-700 ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                        }`}
                      >
                        {line.text}
                      </p>
                    );
                  }

                  const before = line.text.slice(0, line.blank_index);
                  const after = line.text.slice(line.blank_index + (line.correct?.length || 1));

                  return (
                    <p
                      key={idx}
                      className={`flex items-center justify-center transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      <span>{before}</span>
                      {/* 金字玉框墨槽 */}
                      <span
                        className={`inline-flex items-center justify-center mx-1.5 px-3.5 py-1 rounded-xl border-2 transition-all duration-300 ${
                          isFinished
                            ? 'border-theme-primary bg-theme-primary-light text-theme-primary font-bold shadow-sm'
                            : isCurrentQuestion
                            ? isAnswerCorrect === true
                              ? 'border-theme-primary bg-theme-primary-light text-theme-primary scale-105'
                              : isAnswerCorrect === false
                              ? 'border-red-400 bg-red-50 text-red-600'
                              : 'border-theme-gold bg-theme-gold/15 text-theme-gold font-bold ring-4 ring-theme-gold/20 shadow-gold-glow animate-pulse'
                            : 'border-dashed border-theme-border text-theme-text-muted/40 bg-theme-surface'
                        }`}
                      >
                        {isFinished
                          ? line.correct
                          : isCurrentQuestion && selectedWord && isAnswerCorrect
                          ? selectedWord
                          : '?'}
                      </span>
                      <span>{after}</span>
                    </p>
                  );
                })}
              </div>

              {/* 创作背景简述 */}
              <div className="pt-3 border-t border-theme-border/50 text-left">
                <span className="text-[11px] font-bold text-theme-primary font-poetry">🏛️ 创作背景：</span>
                <p className="text-xs text-theme-text-muted leading-relaxed font-sans mt-0.5">
                  {poem.background}
                </p>
              </div>
            </div>

            {/* 下部：各模式互动控件 */}
            <div className="mt-4 pt-3 border-t border-theme-border/60">
              {/* 模式 A：全篇精读底部引导 */}
              {activeMode === 'preview' && (
                <div className="text-center space-y-2">
                  <p className="text-xs text-theme-text-muted">
                    已阅毕全诗，可进入格律推敲模式领会诗圣词宗的炼字心法！
                  </p>
                  <button
                    onClick={() => setActiveMode('assembly')}
                    className="w-full py-3 rounded-2xl bg-theme-primary text-white font-bold text-sm shadow-jade-glow hover:bg-theme-primary-hover active:scale-98 transition-all flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-theme-gold" />
                    <span>开启格律填词推敲 ➔</span>
                  </button>
                </div>
              )}

              {/* 模式 B：填词推敲选项区域 */}
              {activeMode === 'assembly' && !isFinished && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-theme-text">
                    <span className="flex items-center space-x-1 text-theme-primary">
                      <Lightbulb className="w-4 h-4 text-theme-gold" />
                      <span>请推敲最契合诗境之一字：</span>
                    </span>
                    {errorCount >= 1 && (
                      <button
                        onClick={handleSkip}
                        className="text-theme-gold hover:underline flex items-center space-x-1 font-bold"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>跳过直接看解析</span>
                      </button>
                    )}
                  </div>

                  {/* 葵口宋瓷玉牌选项按键 (继承 shape-lobed-petal 异形剪裁与主题样式) */}
                  <div className="grid grid-cols-2 gap-3">
                    {currentLine?.options?.map((opt, i) => {
                      const label = ['A', 'B', 'C', 'D'][i];
                      const isThisSelected = selectedWord === opt;

                      return (
                        <button
                          key={opt}
                          onClick={() => handleOptionSelect(opt)}
                          className={`relative py-3.5 px-4 rounded-2xl shape-lobed-petal border-2 flex items-center justify-between transition-all active:scale-95 shadow-sm ${
                            isThisSelected && isAnswerCorrect === true
                              ? 'bg-theme-primary text-white border-theme-primary font-bold shadow-jade-glow'
                              : isThisSelected && isAnswerCorrect === false
                              ? 'bg-red-50 border-red-400 text-red-700'
                              : 'bg-theme-surface-card hover:border-theme-primary hover:bg-theme-primary-light/40 text-theme-text border-theme-border'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-theme-surface text-theme-text-muted font-mono text-xs flex items-center justify-center font-bold">
                            {label}
                          </span>
                          <span className="text-2xl font-poetry font-bold tracking-widest text-theme-text">
                            {opt}
                          </span>
                          <span className="w-5" />
                        </button>
                      );
                    })}
                  </div>

                  {/* 选错即时解析指引抽屉 */}
                  {wrongExplanation && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2 text-xs text-red-900 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold">推敲析疑：</span>
                        {wrongExplanation}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 模式 B 完成状态 */}
              {activeMode === 'assembly' && isFinished && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="p-4 bg-theme-primary-light border border-theme-border rounded-2xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-2.5 text-theme-text">
                      <CheckCircle2 className="w-6 h-6 text-theme-primary" />
                      <div>
                        <h4 className="font-bold text-sm font-poetry">诗作推敲研毕 · 载入典藏</h4>
                        <p className="text-xs text-theme-text-muted">参悟文心妙笔，右侧解析已全部解锁</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-theme-primary text-white shadow-sm font-poetry">
                      评级：{finalScore === 100 ? '甲等' : finalScore >= 75 ? '乙等' : '丙等'}
                    </span>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-2xl bg-theme-primary text-white text-xs font-bold shadow-jade-glow hover:bg-theme-primary-hover active:scale-98 transition-all"
                  >
                    重返山河图景
                  </button>
                </div>
              )}

              {/* 模式 C：默写输入 */}
              {activeMode === 'dictation' && (
                <div className="space-y-3">
                  {!dictationDone ? (
                    <div className="p-3.5 bg-theme-surface-card rounded-2xl border border-theme-border space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-theme-text">
                          请默写第 {dictationStep + 1} 句：
                        </span>
                        <span className="text-theme-text-muted font-mono">
                          {dictationStep + 1} / {poem.lines.length}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={dictationInput}
                          onChange={(e) => setDictationInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleDictationCheck()}
                          placeholder="在此输入本句诗词（可省略标点）"
                          className="flex-1 px-4 py-2 text-sm rounded-xl border border-theme-border bg-theme-surface focus:bg-theme-surface-card focus:outline-none focus:border-theme-primary font-poetry text-theme-text"
                        />
                        <button
                          onClick={handleDictationCheck}
                          className="px-5 py-2 rounded-xl bg-theme-primary text-white font-bold text-xs shadow-sm hover:bg-theme-primary-hover active:scale-95"
                        >
                          核验
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-theme-primary-light border border-theme-border rounded-2xl text-center space-y-2">
                      <h4 className="font-bold text-theme-primary font-poetry text-base">
                        🎉 名篇熟诵 · 全诗默毕！
                      </h4>
                      <p className="text-xs text-theme-text-muted">
                        错漏次数：{dictationErrors} 次。胸有锦绣，落笔生花！
                      </p>
                      <button
                        onClick={() => {
                          setDictationDone(false);
                          setDictationStep(0);
                          setDictationInput('');
                        }}
                        className="px-4 py-1.5 rounded-full bg-theme-primary text-white text-xs font-bold inline-flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>再默写一遍</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* 右卷 (7列)：全诗文解析展陈 (白话翻译、重点字词、名家赏析、文人手札) */}
          {/* 结合模式进行遮瑕防剧透，避免变成直接提示默写答案！ */}
          {/* ----------------------------------------------------------------- */}
          <div
            className={`col-span-12 lg:col-span-7 flex flex-col p-4 sm:p-6 bg-theme-surface overflow-hidden ${
              mobileView === 'analysis' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {/* 解析快速筛选标签 */}
            <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-theme-border/60 text-xs shrink-0 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-theme-text-muted font-poetry shrink-0">
                导读锦囊：
              </span>
              <button
                onClick={() => setAnalysisFilter('all')}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                  analysisFilter === 'all'
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-theme-surface-card text-theme-text-muted border border-theme-border hover:border-theme-primary hover:text-theme-text'
                }`}
              >
                全部解析
              </button>
              <button
                onClick={() => setAnalysisFilter('translation')}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                  analysisFilter === 'translation'
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-theme-surface-card text-theme-text-muted border border-theme-border hover:border-theme-primary hover:text-theme-text'
                }`}
              >
                白话今译
              </button>
              <button
                onClick={() => setAnalysisFilter('keywords')}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                  analysisFilter === 'keywords'
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-theme-surface-card text-theme-text-muted border border-theme-border hover:border-theme-primary hover:text-theme-text'
                }`}
              >
                重点字词 ({poem.key_words.length})
              </button>
              <button
                onClick={() => setAnalysisFilter('appreciation')}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                  analysisFilter === 'appreciation'
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-theme-surface-card text-theme-text-muted border border-theme-border hover:border-theme-primary hover:text-theme-text'
                }`}
              >
                名家赏析
              </button>
              <button
                onClick={() => setAnalysisFilter('journal')}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                  analysisFilter === 'journal'
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-theme-surface-card text-theme-text-muted border border-theme-border hover:border-theme-primary hover:text-theme-text'
                }`}
              >
                文人心札
              </button>
            </div>

            {/* 可滚动解析长卷内容 */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar text-theme-text">
              
              {/* 1. 【全篇白话今译】(精读模式常驻展开；推敲/默写时折叠遮瑕，避免直接剧透默写) */}
              {(analysisFilter === 'all' || analysisFilter === 'translation') && (
                <section className="p-4 sm:p-5 rounded-2xl bg-theme-surface-card border border-theme-border shadow-xs space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-theme-primary" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-theme-primary font-poetry font-bold text-sm">
                      <BookOpen className="w-4 h-4 text-theme-primary" />
                      <span>【全篇白话今译】</span>
                    </div>

                    {/* 推敲/默写模式下的防剧透开关 */}
                    {activeMode !== 'preview' && !isFinished && !dictationDone && (
                      <button
                        onClick={() => setShowTranslationHint(!showTranslationHint)}
                        className="text-[11px] font-bold text-theme-gold hover:underline flex items-center space-x-1"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{showTranslationHint ? '收起译文防剧透' : '揭晓译文锦囊提示'}</span>
                      </button>
                    )}
                  </div>

                  {/* 译文内容：精读模式/完成状态下直接显示；推敲默写状态下默认柔和遮瑕，按需查看 */}
                  {activeMode === 'preview' || isFinished || dictationDone || showTranslationHint ? (
                    <p className="text-xs sm:text-sm leading-relaxed text-theme-text font-sans font-medium pl-1 animate-in fade-in">
                      {poem.translation}
                    </p>
                  ) : (
                    <div className="relative py-3">
                      <p className="text-xs text-theme-text-muted/30 blur-[4px] select-none leading-relaxed font-sans">
                        {poem.translation}
                      </p>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => setShowTranslationHint(true)}
                          className="px-3.5 py-1.5 rounded-full bg-theme-surface border border-theme-border shadow-sm text-theme-primary text-xs font-bold font-poetry hover:border-theme-primary transition-all flex items-center space-x-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-theme-gold" />
                          <span>答题默写中 · 点击查看译文意境锦囊</span>
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* 2. 【重点字词训诂与典故出处】(当前正在考查的字自动遮瑕，答出或精读时完全展开) */}
              {(analysisFilter === 'all' || analysisFilter === 'keywords') && (
                <section className="space-y-2.5">
                  <div className="flex items-center space-x-2 text-theme-text font-poetry font-bold text-sm px-1">
                    <Feather className="w-4 h-4 text-theme-primary" />
                    <span>【重点字词训诂与典故】</span>
                    <span className="text-xs font-mono font-normal text-theme-text-muted">
                      ({poem.key_words.length} 处微言大义)
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {poem.key_words.map((kw, idx) => {
                      const isHighlighted = activeKeyword === kw.word;
                      const isAnswerWord = isWordCurrentAnswer(kw.word);
                      const isWordRevealed = revealedKeywords[kw.word];

                      return (
                        <div
                          key={idx}
                          onClick={() =>
                            setActiveKeyword(isHighlighted ? null : kw.word)
                          }
                          className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                            isHighlighted
                              ? 'bg-theme-primary-light border-theme-primary shadow-sm'
                              : 'bg-theme-surface-card border-theme-border hover:border-theme-primary shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {/* 若该词为当前填空答案且尚未答出，则隐去原字避免送分 */}
                              <span className="font-bold text-base font-poetry text-theme-text">
                                {isAnswerWord && !isWordRevealed ? '【？】（待推敲字眼）' : kw.word}
                              </span>
                              <span className="text-xs font-mono text-theme-primary bg-theme-primary/10 px-2 py-0.5 rounded-full font-bold">
                                {isAnswerWord && !isWordRevealed ? '[* * *]' : `[${kw.pinyin}]`}
                              </span>
                            </div>

                            {isAnswerWord && !isWordRevealed && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRevealedKeywords((prev) => ({ ...prev, [kw.word]: true }));
                                }}
                                className="text-[11px] text-theme-gold hover:underline font-bold"
                              >
                                查看考据
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-theme-text leading-relaxed font-sans">
                            {isAnswerWord && !isWordRevealed
                              ? '此词含有当下推敲的关键考点，暂作掩卷。完成本句推敲或点击右上角查看考据。'
                              : kw.explanation}
                          </p>

                          {kw.allusion && (!isAnswerWord || isWordRevealed) && (
                            <div className="p-2.5 bg-theme-surface border border-theme-border rounded-xl text-xs text-theme-text-muted font-poetry leading-relaxed mt-1">
                              <span className="font-bold text-theme-gold">📖 典籍考据出处：</span>
                              {kw.allusion}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 3. 【名家美学绝评与章法艺术赏析】(文学章法无直接剧透，全面供玩家悟道) */}
              {(analysisFilter === 'all' || analysisFilter === 'appreciation') && (
                <section className="space-y-3">
                  <div className="flex items-center space-x-2 text-theme-text font-poetry font-bold text-sm px-1">
                    <Quote className="w-4 h-4 text-theme-primary" />
                    <span>【名家美学绝评与章法艺术赏析】</span>
                  </div>

                  {/* 艺术章法特色 */}
                  {poem.literary_analysis.artistic_features.length > 0 && (
                    <div className="p-4 rounded-2xl bg-theme-surface-card border border-theme-border shadow-xs space-y-2">
                      <h4 className="font-bold text-xs text-theme-primary font-poetry">
                        ❖ 艺术手法与章法特色：
                      </h4>
                      <ul className="space-y-1.5 text-xs text-theme-text-muted leading-relaxed">
                        {poem.literary_analysis.artistic_features.map((feat, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="text-theme-primary mt-0.5">•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 全篇深度美学鉴赏长文 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-theme-surface-card border border-theme-border shadow-xs space-y-2">
                    <h4 className="font-bold text-xs text-theme-primary font-poetry">
                      ❖ 全篇美学深度鉴赏：
                    </h4>
                    <p className="text-xs leading-relaxed text-theme-text font-sans leading-6">
                      {poem.literary_analysis.appreciation}
                    </p>
                  </div>

                  {/* 历代文宗名家绝评 */}
                  {poem.literary_analysis.master_comments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs text-theme-gold font-poetry px-1">
                        ❖ 历代文宗名家绝评：
                      </h4>
                      {poem.literary_analysis.master_comments.map((mc, i) => (
                        <div
                          key={i}
                          className="p-3.5 bg-theme-surface-card border border-theme-border rounded-xl space-y-1 font-poetry"
                        >
                          <span className="font-bold text-theme-gold text-xs flex items-center space-x-1">
                            <span>📜</span>
                            <span>{mc.critic}</span>
                          </span>
                          <p className="text-theme-text-muted text-xs italic pl-4 leading-relaxed">
                            {mc.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* 4. 【诗人第一人称文心私密手札】 */}
              {(analysisFilter === 'all' || analysisFilter === 'journal') && (
                <section className="p-5 rounded-2xl bg-theme-surface-card border border-theme-border shadow-xs relative overflow-hidden font-poetry space-y-2">
                  <div className="absolute right-3 bottom-2 text-7xl text-theme-primary/5 select-none pointer-events-none font-serif">
                    手札
                  </div>

                  <div className="flex items-center space-x-2 text-theme-gold pb-2 border-b border-theme-border/60 font-bold text-xs">
                    <Feather className="w-4 h-4 text-theme-gold" />
                    <span>【诗人第一人称文心手札 · 私密心语】</span>
                  </div>

                  <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed tracking-wider indent-6 whitespace-pre-line leading-7 font-poetry">
                    {poem.poet_journal}
                  </p>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
