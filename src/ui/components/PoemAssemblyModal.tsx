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
} from 'lucide-react';

interface PoemAssemblyModalProps {
  poem: PoemData;
  onComplete: (poemId: string, score: number) => void;
  onClose: () => void;
}

type PlayMode = 'preview' | 'assembly' | 'dictation';
type TabType = 'main' | 'keywords' | 'analysis' | 'journal';

export const PoemAssemblyModal: React.FC<PoemAssemblyModalProps> = ({
  poem,
  onComplete,
  onClose,
}) => {
  // 模式与标签切换
  const [activeMode, setActiveMode] = useState<PlayMode>('assembly');
  const [activeTab, setActiveTab] = useState<TabType>('main');

  // 动态墨润动画状态 (行逐行显现)
  const [renderedLineCount, setRenderedLineCount] = useState<number>(0);

  // 重点词高亮状态
  const [selectedKeywordWord, setSelectedKeywordWord] = useState<string | null>(null);

  // 【推敲模式】状态
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

  // 【默写模式】状态 (逐句验证)
  const [dictationStep, setDictationStep] = useState<number>(0);
  const [dictationInput, setDictationInput] = useState<string>('');
  const [dictationErrors, setDictationErrors] = useState<number>(0);
  const [dictationDone, setDictationDone] = useState<boolean>(false);

  const currentStep = blankLines[currentStepIndex];
  const currentLine: PoemLine | undefined = currentStep?.line;

  // 动态墨润逐行显现动画效果
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
    }, 280);
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
      particleCount: 90,
      spread: 75,
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
          particleCount: 80,
          spread: 70,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-theme-surface-card/95 backdrop-blur-2xl border border-theme-border rounded-[2rem] p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden">
        {/* 1. 顶部操作栏：模式切换器与关闭按钮 */}
        <div className="flex items-center justify-between pb-3 border-b border-theme-border/60">
          {/* 三大模式切换按钮 */}
          <div className="flex items-center bg-theme-surface border border-theme-border rounded-full p-1 space-x-1">
            <button
              onClick={() => setActiveMode('preview')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-all ${
                activeMode === 'preview'
                  ? 'bg-theme-primary text-white font-bold shadow-sm'
                  : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>全篇精读</span>
            </button>
            <button
              onClick={() => setActiveMode('assembly')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-all ${
                activeMode === 'assembly'
                  ? 'bg-theme-primary text-white font-bold shadow-sm'
                  : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>推敲填词</span>
            </button>
            <button
              onClick={() => setActiveMode('dictation')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-all ${
                activeMode === 'dictation'
                  ? 'bg-theme-primary text-white font-bold shadow-sm'
                  : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>名篇默写</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 深度文化内容标签页导航 */}
        <div className="flex items-center space-x-4 border-b border-theme-border/40 text-xs mt-3 px-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('main')}
            className={`py-2 border-b-2 font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'main'
                ? 'border-theme-primary text-theme-primary font-bold'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>诗境正文</span>
          </button>

          <button
            onClick={() => setActiveTab('keywords')}
            className={`py-2 border-b-2 font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'keywords'
                ? 'border-theme-primary text-theme-primary font-bold'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>重点字词 ({poem.key_words.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-2 border-b-2 font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'analysis'
                ? 'border-theme-primary text-theme-primary font-bold'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>名家赏析</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`py-2 border-b-2 font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'journal'
                ? 'border-theme-primary text-theme-primary font-bold'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>文人手记</span>
          </button>
        </div>

        {/* 3. 标签主体内容区域 */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-1">
          {/* TAB 1: 诗境正文与各模式交互 */}
          {activeTab === 'main' && (
            <div className="space-y-4">
              {/* 宣纸古典诗屏 */}
              <div className="relative text-center px-4 py-6 bg-gradient-to-b from-white/90 to-theme-primary-light/20 rounded-2xl border border-theme-border/60 shadow-inner">
                {/* 标题与朝代信息 */}
                <h2 className="text-xl sm:text-2xl font-bold font-poetry text-theme-text tracking-wide mb-1">
                  《{poem.title}》
                </h2>
                <p className="text-[11px] text-theme-text-muted mb-6">
                  {poem.dynasty === 'tang' ? '盛唐' : '两宋'} · {poem.form === 'ci' ? `词牌【${poem.cipai}】` : '近体诗'} · 纪元 {poem.year} 年
                </p>

                {/* 逐行墨润渐显诗句 */}
                <div className="space-y-3.5 font-poetry text-lg sm:text-xl text-theme-text leading-relaxed tracking-widest">
                  {poem.lines.map((line, idx) => {
                    const isVisible = idx < renderedLineCount;

                    // 1. 全篇精读模式展示 (全词完整、重点词可点击)
                    if (activeMode === 'preview') {
                      return (
                        <p
                          key={idx}
                          className={`transition-all duration-700 ${
                            isVisible ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-2 blur-[2px]'
                          }`}
                        >
                          {line.text}
                        </p>
                      );
                    }

                    // 2. 默写模式展示 (已默写行显示，当前行提示输入)
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
                              ? 'text-theme-gold animate-pulse'
                              : 'text-gray-300'
                          }`}
                        >
                          {isPast ? line.text : isCurrent ? `第 ${idx + 1} 句：待默写...` : '········'}
                        </p>
                      );
                    }

                    // 3. 填词推敲模式展示 (带金色墨槽)
                    const isCurrentQuestion =
                      currentStep && currentStep.lineIndex === idx;

                    if (line.blank_index === null) {
                      return (
                        <p
                          key={idx}
                          className={`transition-all duration-700 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 blur-[2px]'
                          }`}
                        >
                          {line.text}
                        </p>
                      );
                    }

                    const before = line.text.slice(0, line.blank_index);
                    const after = line.text.slice(
                      line.blank_index + (line.correct?.length || 1)
                    );

                    return (
                      <p
                        key={idx}
                        className={`flex items-center justify-center transition-all duration-700 ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 blur-[2px]'
                        }`}
                      >
                        <span>{before}</span>
                        {/* 金色墨晕填空框 */}
                        <span
                          className={`inline-flex items-center justify-center mx-1 px-3 py-0.5 rounded-lg border-2 transition-all duration-300 ${
                            isFinished
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold'
                              : isCurrentQuestion
                              ? isAnswerCorrect === true
                                ? 'border-emerald-500 bg-emerald-100 text-emerald-700'
                                : isAnswerCorrect === false
                                ? 'border-red-400 bg-red-50 text-red-600'
                                : 'border-theme-gold bg-amber-50/80 text-theme-gold font-bold shadow-gold-glow animate-pulse'
                              : 'border-dashed border-gray-300 text-gray-400'
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
              </div>

              {/* 模式 A：全篇精读模式的底部赏读指引 */}
              {activeMode === 'preview' && (
                <div className="space-y-3">
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-1.5 text-emerald-900">
                    <div className="font-bold flex items-center space-x-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>【白话今译】</span>
                    </div>
                    <p className="leading-relaxed text-emerald-800">{poem.translation}</p>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => setActiveMode('assembly')}
                      className="px-6 py-2.5 rounded-full bg-theme-primary text-white font-bold text-xs shadow-md hover:bg-theme-primary-hover active:scale-95 transition-all"
                    >
                      进入格律填词推敲 ➔
                    </button>
                  </div>
                </div>
              )}

              {/* 模式 B：填词推敲模式交互 */}
              {activeMode === 'assembly' && !isFinished && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-theme-text-muted">
                    <span>请选择最契合当下诗意的一字：</span>
                    {errorCount >= 2 && (
                      <button
                        onClick={handleSkip}
                        className="text-theme-gold hover:underline flex items-center space-x-1 font-medium"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>跳过看题解</span>
                      </button>
                    )}
                  </div>

                  {/* 宋瓷葵口花瓣造型选项卡 */}
                  <div className="grid grid-cols-2 gap-3">
                    {currentLine?.options?.map((opt, i) => {
                      const label = ['A', 'B', 'C', 'D'][i];
                      const isThisSelected = selectedWord === opt;

                      return (
                        <button
                          key={opt}
                          onClick={() => handleOptionSelect(opt)}
                          className={`relative py-3.5 px-4 shape-lobed-petal border flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-sm ${
                            isThisSelected && isAnswerCorrect === true
                              ? 'bg-emerald-500 text-white border-emerald-600 font-bold shadow-jade-glow'
                              : isThisSelected && isAnswerCorrect === false
                              ? 'bg-red-50 border-red-400 text-red-600'
                              : 'bg-theme-surface-card hover:border-theme-primary text-theme-text border-theme-border'
                          }`}
                        >
                          <span className="text-xs font-mono opacity-50">{label}</span>
                          <span className="text-lg font-poetry font-bold">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 逐项文学解析抽屉 (选错即时弹出) */}
                  {wrongExplanation && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-xs text-red-800 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
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
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 text-emerald-900">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h4 className="font-bold text-sm">诗作推敲研毕 · 载入典藏</h4>
                        <p className="text-xs text-emerald-700">心境豪情与文思大幅提升</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow">
                      评级：{finalScore === 100 ? '甲等' : finalScore >= 75 ? '乙等' : '丙等'}
                    </span>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-full bg-theme-primary text-white text-xs font-bold shadow-md hover:bg-theme-primary-hover active:scale-95 transition-all"
                  >
                    重返山河图景
                  </button>
                </div>
              )}

              {/* 模式 C：名篇默写模式交互 */}
              {activeMode === 'dictation' && (
                <div className="space-y-3">
                  {!dictationDone ? (
                    <div className="p-4 bg-theme-surface rounded-2xl border border-theme-border space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-theme-text">
                          请默写第 {dictationStep + 1} 句：
                        </span>
                        <span className="text-theme-text-muted">
                          进度：{dictationStep + 1} / {poem.lines.length}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={dictationInput}
                          onChange={(e) => setDictationInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleDictationCheck()}
                          placeholder="输入本句诗词（可不带标点）"
                          className="flex-1 px-4 py-2 text-sm rounded-xl border border-theme-border bg-white focus:outline-none focus:border-theme-primary font-poetry"
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
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                      <h4 className="font-bold text-emerald-900 font-poetry text-base">
                        🎉 名篇熟诵 · 全诗默毕！
                      </h4>
                      <p className="text-xs text-emerald-700">
                        错漏次数：{dictationErrors} 次。文思泉涌，过目不忘！
                      </p>
                      <button
                        onClick={() => {
                          setDictationDone(false);
                          setDictationStep(0);
                          setDictationInput('');
                        }}
                        className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold inline-flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>再默写一遍</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 重点字词深度注解与典故 */}
          {activeTab === 'keywords' && (
            <div className="space-y-3 animate-in fade-in">
              <p className="text-xs text-theme-text-muted px-1">
                点击词条查看字音、训诂微言大义与古代文献出处：
              </p>
              <div className="space-y-2.5">
                {poem.key_words.map((kw, i) => {
                  const isSelected = selectedKeywordWord === kw.word;
                  return (
                    <div
                      key={i}
                      onClick={() =>
                        setSelectedKeywordWord(isSelected ? null : kw.word)
                      }
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-theme-primary/10 border-theme-primary shadow-sm'
                          : 'bg-theme-surface border-theme-border hover:border-theme-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-base font-poetry text-theme-text">
                            {kw.word}
                          </span>
                          <span className="text-xs font-mono text-theme-primary bg-theme-primary/10 px-2 py-0.5 rounded-full">
                            [{kw.pinyin}]
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-theme-text leading-relaxed mt-1">
                        {kw.explanation}
                      </p>
                      {kw.allusion && (
                        <p className="text-[11px] text-theme-gold bg-amber-50/60 p-2 rounded-xl mt-1.5 leading-relaxed font-poetry">
                          📖 典故考据：{kw.allusion}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: 名家深度赏析 */}
          {activeTab === 'analysis' && (
            <div className="space-y-4 animate-in fade-in text-xs text-theme-text">
              {/* 艺术手法 */}
              <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-2">
                <h4 className="font-bold text-theme-primary text-sm flex items-center space-x-1.5">
                  <Feather className="w-4 h-4" />
                  <span>【章法与艺术特色】</span>
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-theme-text leading-relaxed">
                  {poem.literary_analysis.artistic_features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>

              {/* 深度长评 */}
              <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-2">
                <h4 className="font-bold text-theme-primary text-sm flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>【全篇美学鉴赏】</span>
                </h4>
                <p className="leading-relaxed leading-6 text-theme-text">
                  {poem.literary_analysis.appreciation}
                </p>
              </div>

              {/* 历代名家评点 */}
              {poem.literary_analysis.master_comments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-theme-gold text-xs px-1">
                    历代文宗绝评：
                  </h4>
                  {poem.literary_analysis.master_comments.map((mc, i) => (
                    <div
                      key={i}
                      className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1 font-poetry"
                    >
                      <span className="font-bold text-amber-900 text-[11px]">
                        {mc.critic}
                      </span>
                      <p className="text-amber-800 text-xs italic">{mc.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 诗人文心手记（第一人称亲笔手札） */}
          {activeTab === 'journal' && (
            <div className="animate-in fade-in space-y-3">
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-sm relative overflow-hidden font-poetry">
                {/* 仿真毛笔墨宝底纹水印 */}
                <div className="absolute right-2 bottom-2 text-6xl text-amber-900/5 font-serif select-none pointer-events-none">
                  太白手札
                </div>

                <div className="flex items-center space-x-2 text-theme-primary pb-3 border-b border-amber-200/60">
                  <Quote className="w-4 h-4 text-theme-primary" />
                  <span className="text-xs font-bold tracking-widest">
                    诗人创作原点 · 孤本私密手札
                  </span>
                </div>

                <p className="text-sm text-theme-text leading-relaxed tracking-wider pt-3 indent-6 whitespace-pre-line leading-7">
                  {poem.poet_journal}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
