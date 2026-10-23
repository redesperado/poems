import React, { useState } from 'react';
import { PoemData, PoemLine } from '../../types/poem';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, AlertCircle, HelpCircle, X } from 'lucide-react';

interface PoemAssemblyModalProps {
  poem: PoemData;
  onComplete: (poemId: string, score: number) => void;
  onClose: () => void;
}

export const PoemAssemblyModal: React.FC<PoemAssemblyModalProps> = ({
  poem,
  onComplete,
  onClose,
}) => {
  // 找出所有需要填空的行
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

  // 当前正在填空的行
  const currentStep = blankLines[currentStepIndex];
  const currentLine: PoemLine | undefined = currentStep?.line;

  // 选项点击响应
  const handleOptionSelect = (option: string) => {
    if (!currentLine || isFinished) return;

    setSelectedWord(option);
    const correct = currentLine.correct;

    if (option === correct) {
      setIsAnswerCorrect(true);
      setWrongExplanation(null);

      // 短暂确认动效后进入下一题或结算
      setTimeout(() => {
        if (currentStepIndex + 1 < blankLines.length) {
          setCurrentStepIndex((prev) => prev + 1);
          setSelectedWord(null);
          setIsAnswerCorrect(null);
        } else {
          // 全部填空完成！
          finishAssembly();
        }
      }, 700);
    } else {
      setIsAnswerCorrect(false);
      const newErrors = errorCount + 1;
      setErrorCount(newErrors);

      // 计算扣分
      if (newErrors === 1) setFinalScore(75);
      else if (newErrors >= 2) setFinalScore(50);

      // 提取针对该选项的专属文学解析
      const explanation =
        currentLine.wrong_explanations?.[option] ||
        '此字在格律、气度或自然物象描写上略逊一筹。';
      setWrongExplanation(explanation);
    }
  };

  // 跳过填空（无阻断设计）
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

  // 结算与放彩带
  const finishAssembly = () => {
    setIsFinished(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#0D9488', '#F472B6'],
    });
    onComplete(poem.id, finalScore);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-theme-surface-card/95 backdrop-blur-xl border border-theme-border rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90dvh] overflow-y-auto no-scrollbar">
        {/* 顶部关闭与标题 */}
        <div className="flex items-center justify-between pb-3 border-b border-theme-border/60">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-theme-primary animate-pulse" />
            <span className="text-xs font-semibold text-theme-primary tracking-widest uppercase">
              灵感诗境 · 创作推敲
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 诗词挂轴主体 */}
        <div className="my-5 text-center px-4 py-6 bg-gradient-to-b from-white/80 to-theme-primary-light/30 rounded-2xl border border-theme-border/50 shadow-inner">
          <h2 className="text-xl font-bold font-poetry text-theme-text tracking-wide mb-1">
            《{poem.title}》
          </h2>
          <p className="text-[11px] text-theme-text-muted mb-5">
            唐 · 李白 · 纪元 {poem.year} 年
          </p>

          {/* 逐行展示诗句与填空金色光槽 */}
          <div className="space-y-3 font-poetry text-lg text-theme-text leading-relaxed tracking-widest">
            {poem.lines.map((line, idx) => {
              const isCurrentQuestion =
                currentStep && currentStep.lineIndex === idx;

              if (line.blank_index === null) {
                return <p key={idx}>{line.text}</p>;
              }

              // 拆分带填空的行
              const before = line.text.slice(0, line.blank_index);
              const after = line.text.slice(
                line.blank_index + (line.correct?.length || 1)
              );

              return (
                <p key={idx} className="flex items-center justify-center">
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
                          ? 'border-red-400 bg-red-50 text-red-600 animate-shake'
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

        {/* 交互区域：选项木牌 vs 结算全篇 */}
        {!isFinished ? (
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

            {/* 宋瓷葵口花瓣造型的选项按键 (A / B / C / D) */}
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

            {/* 逐项文学解析抽屉 (即时弹出) */}
            {wrongExplanation && (
              <div className="mt-2 p-3.5 bg-red-50/90 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-xs text-red-800 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold">文学析疑：</span>
                  {wrongExplanation}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 结算卡片与诗词全篇赏析 */
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-sm">诗作研毕 · 载入典藏</h4>
                  <p className="text-xs text-emerald-700">获得心境豪情与洒脱感悟</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow">
                评级：{finalScore === 100 ? '甲等' : finalScore >= 75 ? '乙等' : '丙等'}
              </span>
            </div>

            {/* 现代译文与历史背景 */}
            <div className="text-xs text-theme-text-muted space-y-2 bg-gray-50/70 p-3.5 rounded-xl border border-gray-200/50">
              <p>
                <span className="font-bold text-theme-text">【白话译文】</span>
                {poem.translation}
              </p>
              <p>
                <span className="font-bold text-theme-text">【历史背景】</span>
                {poem.background}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>重返江山图景</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
