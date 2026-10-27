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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/65 backdrop-blur-md animate-in fade-in select-none">
      {/* 博物馆展卷级主模态框 (双联屏长卷设计) */}
      <div className="relative w-full max-w-6xl bg-[#FCFAF7] border-2 border-[#E7DFD3] rounded-[2rem] shadow-[0_25px_80px_rgba(0,0,0,0.4)] flex flex-col h-[92vh] max-h-[900px] overflow-hidden text-slate-900">
        
        {/* =================================================================== */}
        {/* 1. 顶栏：诗题华彩、朝代印鉴、三大模式切换与关闭按钮 */}
        {/* =================================================================== */}
        <header className="px-5 py-3.5 border-b border-[#E7DFD3] bg-white/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* 左侧：诗题与作者朝代徽章 */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex items-center justify-center shadow-md border border-emerald-600/40 shrink-0">
              <ScrollText className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold font-poetry tracking-wide text-[#09131C]">
                  《{poem.title}》
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100/90 text-red-900 font-bold border border-red-300 font-poetry shadow-xs">
                  {poem.poet_id === 'su_shi' ? '东坡真迹' : '太白绝唱'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-poetry">
                {poem.dynasty === 'tang' ? '盛唐' : '两宋'} · {poem.form === 'ci' ? `词牌【${poem.cipai}】` : '近体律绝'} · 公元 {poem.year} 年
              </p>
            </div>
          </div>

          {/* 中间：三大研学模式切换按钮 (全篇精读 / 格律推敲 / 名篇背默) */}
          <div className="flex items-center bg-[#F2EDE4] p-1 rounded-full border border-[#DDD4C4] shadow-inner">
            <button
              onClick={() => setActiveMode('preview')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all font-poetry ${
                activeMode === 'preview'
                  ? 'bg-emerald-800 text-white font-bold shadow-md'
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-white/60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>全篇精读</span>
            </button>
            <button
              onClick={() => setActiveMode('assembly')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all font-poetry ${
                activeMode === 'assembly'
                  ? 'bg-emerald-800 text-white font-bold shadow-md'
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>推敲填词</span>
            </button>
            <button
              onClick={() => setActiveMode('dictation')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all font-poetry ${
                activeMode === 'dictation'
                  ? 'bg-emerald-800 text-white font-bold shadow-md'
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-white/60'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>名篇默写</span>
            </button>
          </div>

          {/* 小屏专属：切换【诗卷】与【解析】标签 */}
          <div className="flex lg:hidden items-center bg-emerald-50 rounded-full p-0.5 border border-emerald-200">
            <button
              onClick={() => setMobileView('poem')}
              className={`px-3 py-1 rounded-full text-xs font-bold font-poetry ${
                mobileView === 'poem' ? 'bg-emerald-700 text-white shadow-xs' : 'text-emerald-900'
              }`}
            >
              诗境卷面
            </button>
            <button
              onClick={() => setMobileView('analysis')}
              className={`px-3 py-1 rounded-full text-xs font-bold font-poetry ${
                mobileView === 'analysis' ? 'bg-emerald-700 text-white shadow-xs' : 'text-emerald-900'
              }`}
            >
              译文赏析
            </button>
          </div>

          {/* 右侧：优雅关闭按钮 */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all shadow-xs"
            title="关闭弹窗"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* =================================================================== */}
        {/* 2. 双联展卷主体区域 (左卷：诗境与互动 | 右卷：译文/字解/赏析/手记) */}
        {/* =================================================================== */}
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-[#E7DFD3]">
          
          {/* ----------------------------------------------------------------- */}
          {/* 左卷 (5列)：诗屏吟诵、填词推敲与选项交互 */}
          {/* ----------------------------------------------------------------- */}
          <div
            className={`col-span-12 lg:col-span-5 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-white/95 to-[#F9F7F3] overflow-y-auto no-scrollbar ${
              mobileView === 'poem' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {/* 上部：宣纸绢本诗屏 */}
            <div className="relative text-center px-4 py-6 bg-white/95 rounded-3xl border border-[#E7DFD3] shadow-sm space-y-4">
              {/* 装饰红印章水印 */}
              <div className="absolute right-4 bottom-3 opacity-15 pointer-events-none select-none text-red-800 font-poetry text-4xl border-2 border-red-800 p-1.5 rounded-lg rotate-12">
                文心
              </div>

              <div className="text-xs text-slate-500 font-poetry border-b border-dashed border-slate-200 pb-2">
                {activeMode === 'preview' && '✦ 全篇精读 · 重点词条可直接参阅右侧考据 ✦'}
                {activeMode === 'assembly' && '✦ 格律推敲 · 请斟酌文心选出最佳字眼 ✦'}
                {activeMode === 'dictation' && '✦ 经典背默 · 逐句还原传世名句 ✦'}
              </div>

              {/* 逐行墨润渐显诗句 */}
              <div className="space-y-4 font-poetry text-xl sm:text-2xl text-[#09131C] leading-relaxed tracking-widest py-2">
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
                            ? 'text-emerald-900 font-bold'
                            : isCurrent
                            ? 'text-amber-700 font-bold animate-pulse'
                            : 'text-slate-300'
                        }`}
                      >
                        {isPast ? line.text : isCurrent ? `第 ${idx + 1} 句：待填入...` : '············'}
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
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-sm'
                            : isCurrentQuestion
                            ? isAnswerCorrect === true
                              ? 'border-emerald-600 bg-emerald-100 text-emerald-800 scale-105'
                              : isAnswerCorrect === false
                              ? 'border-red-400 bg-red-50 text-red-600'
                              : 'border-amber-500 bg-amber-50/90 text-amber-800 font-bold ring-4 ring-amber-300/40 shadow-md animate-pulse'
                            : 'border-dashed border-slate-300 text-slate-400 bg-slate-50'
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

              {/* 创作背景小传 */}
              <div className="pt-3 border-t border-slate-200/80 text-left">
                <span className="text-[11px] font-bold text-emerald-950 font-poetry">🏛️ 创作背景：</span>
                <p className="text-xs text-slate-700 leading-relaxed font-sans mt-0.5">
                  {poem.background}
                </p>
              </div>
            </div>

            {/* 下部：各模式互动控件 */}
            <div className="mt-4 pt-3 border-t border-[#E7DFD3]">
              {/* 模式 A：全篇精读底部引导 */}
              {activeMode === 'preview' && (
                <div className="text-center space-y-2">
                  <p className="text-xs text-slate-600">
                    已阅览全诗，可进入格律推敲模式尝试一字之师的妙处！
                  </p>
                  <button
                    onClick={() => setActiveMode('assembly')}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white font-bold text-sm shadow-lg hover:from-emerald-900 hover:to-teal-950 active:scale-98 transition-all flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>开启格律填词推敲 ➔</span>
                  </button>
                </div>
              )}

              {/* 模式 B：填词推敲选项区域 */}
              {activeMode === 'assembly' && !isFinished && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span className="flex items-center space-x-1 text-emerald-950">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>请推敲最契合诗意之一字：</span>
                    </span>
                    {errorCount >= 1 && (
                      <button
                        onClick={handleSkip}
                        className="text-amber-800 hover:text-amber-900 flex items-center space-x-1 font-bold underline decoration-amber-400"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>跳过直接看解析</span>
                      </button>
                    )}
                  </div>

                  {/* 葵口宋瓷玉牌选项按键 (高对比度、清晰大字) */}
                  <div className="grid grid-cols-2 gap-3">
                    {currentLine?.options?.map((opt, i) => {
                      const label = ['A', 'B', 'C', 'D'][i];
                      const isThisSelected = selectedWord === opt;

                      return (
                        <button
                          key={opt}
                          onClick={() => handleOptionSelect(opt)}
                          className={`relative py-3.5 px-4 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-95 shadow-sm ${
                            isThisSelected && isAnswerCorrect === true
                              ? 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-md ring-2 ring-emerald-300'
                              : isThisSelected && isAnswerCorrect === false
                              ? 'bg-red-50 border-red-400 text-red-700'
                              : 'bg-white hover:border-emerald-600 hover:bg-emerald-50/60 text-[#09131C] border-[#D9D1C3]'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs flex items-center justify-center font-bold">
                            {label}
                          </span>
                          <span className="text-2xl font-poetry font-bold tracking-widest text-[#09131C]">
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
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-2.5 text-emerald-950">
                      <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                      <div>
                        <h4 className="font-bold text-sm">诗作推敲研毕 · 载入典藏</h4>
                        <p className="text-xs text-emerald-800">参悟盛唐妙笔，心境豪情与文思大幅提升</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-700 text-white shadow-sm font-poetry">
                      评级：{finalScore === 100 ? '甲等' : finalScore >= 75 ? '乙等' : '丙等'}
                    </span>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-2xl bg-emerald-800 text-white text-xs font-bold shadow-md hover:bg-emerald-900 active:scale-98 transition-all"
                  >
                    重返山河图景
                  </button>
                </div>
              )}

              {/* 模式 C：默写输入 */}
              {activeMode === 'dictation' && (
                <div className="space-y-3">
                  {!dictationDone ? (
                    <div className="p-3.5 bg-white rounded-2xl border border-slate-300 space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#09131C]">
                          请默写第 {dictationStep + 1} 句：
                        </span>
                        <span className="text-slate-500 font-mono">
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
                          className="flex-1 px-4 py-2 text-sm rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 font-poetry"
                        />
                        <button
                          onClick={handleDictationCheck}
                          className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs shadow hover:bg-emerald-900 active:scale-95"
                        >
                          核验
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                      <h4 className="font-bold text-emerald-950 font-poetry text-base">
                        🎉 名篇熟诵 · 全诗默毕！
                      </h4>
                      <p className="text-xs text-emerald-800">
                        错漏次数：{dictationErrors} 次。胸有锦绣，落笔生花！
                      </p>
                      <button
                        onClick={() => {
                          setDictationDone(false);
                          setDictationStep(0);
                          setDictationInput('');
                        }}
                        className="px-4 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-bold inline-flex items-center space-x-1"
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
          {/* 右卷 (7列)：全诗文解析常驻展陈 (白话翻译、重点字词、名家赏析、文人手札) */}
          {/* ----------------------------------------------------------------- */}
          <div
            className={`col-span-12 lg:col-span-7 flex flex-col p-4 sm:p-6 bg-[#FAF7F2] overflow-hidden ${
              mobileView === 'analysis' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {/* 解析快速筛选标签 */}
            <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-[#E7DFD3] text-xs shrink-0 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-slate-500 font-poetry shrink-0">
                锦囊导读：
              </span>
              <button
                onClick={() => setAnalysisFilter('all')}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                  analysisFilter === 'all'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-emerald-600'
                }`}
              >
                全部解析
              </button>
              <button
                onClick={() => setAnalysisFilter('translation')}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                  analysisFilter === 'translation'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-emerald-600'
                }`}
              >
                白话今译
              </button>
              <button
                onClick={() => setAnalysisFilter('keywords')}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                  analysisFilter === 'keywords'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-emerald-600'
                }`}
              >
                重点字词 ({poem.key_words.length})
              </button>
              <button
                onClick={() => setAnalysisFilter('appreciation')}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                  analysisFilter === 'appreciation'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-emerald-600'
                }`}
              >
                名家赏析
              </button>
              <button
                onClick={() => setAnalysisFilter('journal')}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                  analysisFilter === 'journal'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-emerald-600'
                }`}
              >
                文人心札
              </button>
            </div>

            {/* 可滚动解析长卷内容 */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar text-slate-900">
              
              {/* 1. 【全篇白话今译】(翻译要有) */}
              {(analysisFilter === 'all' || analysisFilter === 'translation') && (
                <section className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600" />
                  <div className="flex items-center space-x-2 text-emerald-950 font-poetry font-bold text-sm">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span>【全篇白话今译】</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#1E293B] font-sans font-medium pl-1">
                    {poem.translation}
                  </p>
                </section>
              )}

              {/* 2. 【重点字词训诂与典故出处】(重点字解释要有) */}
              {(analysisFilter === 'all' || analysisFilter === 'keywords') && (
                <section className="space-y-2.5">
                  <div className="flex items-center space-x-2 text-slate-900 font-poetry font-bold text-sm px-1">
                    <Feather className="w-4 h-4 text-emerald-700" />
                    <span>【重点字词训诂与典故】</span>
                    <span className="text-xs font-mono font-normal text-slate-500">
                      ({poem.key_words.length} 处关键字义)
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {poem.key_words.map((kw, idx) => {
                      const isHighlighted = activeKeyword === kw.word;

                      return (
                        <div
                          key={idx}
                          onClick={() =>
                            setActiveKeyword(isHighlighted ? null : kw.word)
                          }
                          className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                            isHighlighted
                              ? 'bg-emerald-50/80 border-emerald-600 shadow-md ring-2 ring-emerald-300/50'
                              : 'bg-white border-[#E2D9CB] hover:border-emerald-600 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-base font-poetry text-[#09131C]">
                                {kw.word}
                              </span>
                              <span className="text-xs font-mono text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full font-bold">
                                [{kw.pinyin}]
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-sans">
                              {isHighlighted ? '收起' : '释义'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-800 leading-relaxed font-sans">
                            {kw.explanation}
                          </p>

                          {kw.allusion && (
                            <div className="p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-950 font-poetry leading-relaxed mt-1">
                              <span className="font-bold text-amber-900">📖 古籍考据与出处：</span>
                              {kw.allusion}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 3. 【名家美学绝评与章法艺术赏析】(赏析也要有) */}
              {(analysisFilter === 'all' || analysisFilter === 'appreciation') && (
                <section className="space-y-3">
                  <div className="flex items-center space-x-2 text-slate-900 font-poetry font-bold text-sm px-1">
                    <Quote className="w-4 h-4 text-emerald-700" />
                    <span>【名家美学绝评与艺术赏析】</span>
                  </div>

                  {/* 艺术章法特色 */}
                  {poem.literary_analysis.artistic_features.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white border border-[#E2D9CB] shadow-xs space-y-2">
                      <h4 className="font-bold text-xs text-emerald-950 font-poetry">
                        ❖ 艺术手法与章法特色：
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-800 leading-relaxed">
                        {poem.literary_analysis.artistic_features.map((feat, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="text-emerald-700 mt-0.5">•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 全篇深度美学鉴赏长文 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2D9CB] shadow-xs space-y-2">
                    <h4 className="font-bold text-xs text-emerald-950 font-poetry">
                      ❖ 全篇美学深度鉴赏：
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-800 font-sans leading-6">
                      {poem.literary_analysis.appreciation}
                    </p>
                  </div>

                  {/* 历代文宗名家绝评 */}
                  {poem.literary_analysis.master_comments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs text-amber-950 font-poetry px-1">
                        ❖ 历代文宗名家绝评：
                      </h4>
                      {poem.literary_analysis.master_comments.map((mc, i) => (
                        <div
                          key={i}
                          className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 font-poetry"
                        >
                          <span className="font-bold text-amber-950 text-xs flex items-center space-x-1">
                            <span>📜</span>
                            <span>{mc.critic}</span>
                          </span>
                          <p className="text-amber-900 text-xs italic pl-4 leading-relaxed">
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
                <section className="p-5 rounded-2xl bg-[#FFFDF9] border border-amber-300/80 shadow-xs relative overflow-hidden font-poetry space-y-2">
                  <div className="absolute right-3 bottom-2 text-7xl text-amber-900/5 select-none pointer-events-none font-serif">
                    手札
                  </div>

                  <div className="flex items-center space-x-2 text-amber-950 pb-2 border-b border-amber-200 font-bold text-xs">
                    <Feather className="w-4 h-4 text-amber-700" />
                    <span>【诗人第一人称文心手札 · 私密心语】</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed tracking-wider indent-6 whitespace-pre-line leading-7 font-poetry">
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
