import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Send,
  RefreshCw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { soundEngine } from '../../engine/audio/soundEngine';

interface PoemAssemblyModalProps {
  poem: PoemData;
  onComplete: (poemId: string, score: number) => void;
  onClose: () => void;
  onOpenNote?: (poemTitle: string) => void;
}

type PlayMode = 'preview' | 'assembly' | 'dictation';
type AnalysisFilter = 'all' | 'translation' | 'keywords' | 'appreciation' | 'journal';

// 字符级校勘对比标记
interface DiffToken {
  type: 'correct' | 'wrong' | 'missing' | 'extra';
  userChar?: string;
  expectedChar?: string;
}

interface LineDiffResult {
  tokens: DiffToken[];
  isPerfect: boolean;
  correctCount: number;
  totalTargetCount: number;
}

/**
 * 基于最长公共子序列 (LCS) 算法对默写单句进行字符级精准对齐与校勘
 */
function diffPoemLine(userRaw: string, targetRaw: string): LineDiffResult {
  const user = (userRaw || '').trim().replace(/[，。？！、\s]/g, '');
  const target = (targetRaw || '').trim().replace(/[，。？！、\s]/g, '');

  const m = user.length;
  const n = target.length;

  if (n === 0) {
    return { tokens: [], isPerfect: true, correctCount: 0, totalTargetCount: 0 };
  }

  // 1. 动态规划构建 LCS 矩阵
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (user[i] === target[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // 2. 回溯求解差异标记
  let i = m;
  let j = n;
  let matchCount = 0;
  const revTokens: DiffToken[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && user[i - 1] === target[j - 1]) {
      revTokens.push({
        type: 'correct',
        userChar: user[i - 1],
        expectedChar: target[j - 1],
      });
      matchCount++;
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1]) {
      // 错字替换
      revTokens.push({
        type: 'wrong',
        userChar: user[i - 1],
        expectedChar: target[j - 1],
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // 遗漏字
      revTokens.push({
        type: 'missing',
        expectedChar: target[j - 1],
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i - 1][j] > dp[i][j - 1])) {
      // 衍字 / 多字
      revTokens.push({
        type: 'extra',
        userChar: user[i - 1],
      });
      i--;
    }
  }

  const tokens = revTokens.reverse();
  const isPerfect = user === target && user.length > 0;

  return {
    tokens,
    isPerfect,
    correctCount: matchCount,
    totalTargetCount: n,
  };
}

interface LineScaleConfig {
  charBox: string;
  charFont: string;
  charHeight: string;
  containerGap: string;
  getBlankWidth: (bLen: number) => string;
}

/**
 * 智能自适应字号与字模槽宽度系统：
 * 综合全诗最大行长与当前行长，实现五言舒展、七言温润、长歌自适应收缩，杜绝溢出与拥挤
 */
function getLineScale(lineLen: number, poemMaxLen: number): LineScaleConfig {
  const targetLen = Math.max(lineLen, poemMaxLen);

  if (targetLen <= 5) {
    return {
      charBox: 'w-8 sm:w-10 h-10 sm:h-12',
      charHeight: 'h-10 sm:h-12',
      charFont: 'text-xl sm:text-2xl font-bold',
      containerGap: 'gap-1.5 sm:gap-2',
      getBlankWidth: (bLen: number) => {
        if (bLen === 1) return 'w-8 sm:w-10';
        if (bLen === 2) return 'w-[70px] sm:w-[88px]';
        if (bLen === 3) return 'w-[106px] sm:w-[136px]';
        return 'w-[144px] sm:w-[184px]';
      },
    };
  }

  if (targetLen <= 7) {
    return {
      charBox: 'w-7 sm:w-8.5 h-9 sm:h-10.5',
      charHeight: 'h-9 sm:h-10.5',
      charFont: 'text-lg sm:text-xl font-bold',
      containerGap: 'gap-1 sm:gap-1.5',
      getBlankWidth: (bLen: number) => {
        if (bLen === 1) return 'w-7 sm:w-8.5';
        if (bLen === 2) return 'w-[60px] sm:w-[74px]';
        if (bLen === 3) return 'w-[92px] sm:w-[114px]';
        return 'w-[124px] sm:w-[154px]';
      },
    };
  }

  if (targetLen <= 10) {
    return {
      charBox: 'w-5.5 sm:w-7 h-7.5 sm:h-9',
      charHeight: 'h-7.5 sm:h-9',
      charFont: 'text-base sm:text-lg font-bold',
      containerGap: 'gap-0.5 sm:gap-1',
      getBlankWidth: (bLen: number) => {
        if (bLen === 1) return 'w-5.5 sm:w-7';
        if (bLen === 2) return 'w-[46px] sm:w-[60px]';
        if (bLen === 3) return 'w-[70px] sm:w-[92px]';
        return 'w-[94px] sm:w-[124px]';
      },
    };
  }

  if (targetLen <= 14) {
    return {
      charBox: 'w-4.5 sm:w-5.5 h-6.5 sm:h-7.5',
      charHeight: 'h-6.5 sm:h-7.5',
      charFont: 'text-xs sm:text-sm font-semibold',
      containerGap: 'gap-0.5 sm:gap-0.5',
      getBlankWidth: (bLen: number) => {
        if (bLen === 1) return 'w-4.5 sm:w-5.5';
        if (bLen === 2) return 'w-[38px] sm:w-[46px]';
        if (bLen === 3) return 'w-[58px] sm:w-[70px]';
        return 'w-[78px] sm:w-[94px]';
      },
    };
  }

  return {
    charBox: 'w-4 sm:w-4.5 h-5.5 sm:h-6.5',
    charHeight: 'h-5.5 sm:h-6.5',
    charFont: 'text-[10px] sm:text-xs font-semibold',
    containerGap: 'gap-0.5',
    getBlankWidth: (bLen: number) => {
      if (bLen === 1) return 'w-4 sm:w-4.5';
      if (bLen === 2) return 'w-[34px] sm:w-[38px]';
      if (bLen === 3) return 'w-[52px] sm:w-[58px]';
      return 'w-[70px] sm:w-[78px]';
    },
  };
}

/**
 * 根据选项字符长度动态适配字号，克制大方、舒适雅致
 */
function getOptionFontSizeClass(text: string): string {
  if (text.length >= 6) return 'text-[11px] sm:text-xs font-poetry font-medium';
  if (text.length >= 3) return 'text-xs sm:text-sm font-poetry font-medium';
  if (text.length === 2) return 'text-sm sm:text-base font-poetry font-medium';
  return 'text-base sm:text-lg font-poetry font-semibold';
}

export const PoemAssemblyModal: React.FC<PoemAssemblyModalProps> = ({
  poem,
  onComplete,
  onClose,
  onOpenNote,
}) => {
  // 核心模式：'preview' (全篇精读) | 'assembly' (推敲填词) | 'dictation' (名篇默写)
  const [activeMode, setActiveMode] = useState<PlayMode>('assembly');

  // 小屏视图切换 ('poem' | 'analysis')
  const [mobileView, setMobileView] = useState<'poem' | 'analysis'>('poem');

  // 移动端横滑手势 (TODO-POL-03)
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // 需满足：横向位移大于50px，且横向大于纵向1.5倍
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0 && mobileView === 'poem') {
        // 向左滑：展开右卷解析
        setMobileView('analysis');
      } else if (deltaX > 0 && mobileView === 'analysis') {
        // 向右滑：切回左卷诗屏
        setMobileView('poem');
      }
    }
  };

  // 右侧解析筛选 ('all' | 'translation' | 'keywords' | 'appreciation' | 'journal')
  const [analysisFilter, setAnalysisFilter] = useState<AnalysisFilter>('all');

  // 动态墨润动画状态 (行逐行显现)
  const [renderedLineCount, setRenderedLineCount] = useState<number>(0);

  // 古韵吟诵状态 (TODO-REC-01/02)
  const [isReciting, setIsReciting] = useState<boolean>(false);
  const [recitingLineIdx, setRecitingLineIdx] = useState<number | null>(null);

  // 停止朗诵
  const handleStopReciting = () => {
    soundEngine.stopPoemSpeech();
    setIsReciting(false);
    setRecitingLineIdx(null);
  };

  // 切换朗诵
  const handleToggleReciting = () => {
    if (isReciting) {
      handleStopReciting();
    } else {
      setIsReciting(true);
      soundEngine.speakPoem(
        poem.title,
        poem.lines.map((l) => l.text),
        {
          poetDynasty: poem.dynasty,
          poetId: poem.poet_id,
          onLineStart: (idx) => {
            setRecitingLineIdx(idx);
          },
          onEnd: () => {
            setIsReciting(false);
            setRecitingLineIdx(null);
          },
        }
      );
    }
  };

  // 离开页面或切换诗篇时停止朗诵
  useEffect(() => {
    return () => {
      soundEngine.stopPoemSpeech();
    };
  }, [poem.id]);

  // 重点词交互聚焦
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

  // 导读遮瑕防剧透状态
  const [showTranslationHint, setShowTranslationHint] = useState<boolean>(false);
  const [revealedKeywords, setRevealedKeywords] = useState<Record<string, boolean>>({});

  // 【推敲填词】状态
  const blankLines = poem.lines
    .map((line, index) => ({ line, lineIndex: index }))
    .filter((item) => item.line.blank_index !== null);

  // 动态全诗最长单行字数（用于整体和谐自适应）
  const poemMaxLen = useMemo(() => {
    return Math.max(...poem.lines.map((l) => l.text.length), 5);
  }, [poem.lines]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [wrongExplanation, setWrongExplanation] = useState<string | null>(null);
  const [correctExplanation, setCorrectExplanation] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(100);

  const activeBlankRef = useRef<HTMLDivElement>(null);

  // 填空推进时自动平滑居中聚焦当前考题诗行
  useEffect(() => {
    if (activeBlankRef.current) {
      activeBlankRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStepIndex, activeMode]);

  // 【名篇默写】全篇自由书写与统一提交校勘状态
  const [dictationInputs, setDictationInputs] = useState<string[]>(() =>
    new Array(poem.lines.length).fill('')
  );
  const [isDictationSubmitted, setIsDictationSubmitted] = useState<boolean>(false);
  const dictationInputsRef = useRef<Array<HTMLInputElement | null>>([]);

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

  // 当切换诗作或模式时重置默写输入与提示状态
  useEffect(() => {
    setShowTranslationHint(false);
    setRevealedKeywords({});
    setDictationInputs(new Array(poem.lines.length).fill(''));
    setIsDictationSubmitted(false);
    setWrongExplanation(null);
    setCorrectExplanation(null);
  }, [poem.id, activeMode]);

  // 推敲选项选择
  const handleOptionSelect = (option: string) => {
    if (!currentLine || isFinished || isAnswerCorrect === true) return;
    soundEngine.playInkDab();
    setSelectedWord(option);
    const correct = currentLine.correct;

    if (option === correct) {
      soundEngine.playJadeChime(659.25);
      setIsAnswerCorrect(true);
      setWrongExplanation(null);

      // 获取选用正字的文学解析深意
      const explanation =
        currentLine.correct_explanation ||
        poem.key_words.find((kw) => kw.word.includes(correct) || correct.includes(kw.word))?.explanation ||
        `“${correct}”字切中诗心，神完气足，极尽自然造化之妙。`;
      setCorrectExplanation(explanation);
    } else {
      soundEngine.playInkDab();
      setIsAnswerCorrect(false);
      setCorrectExplanation(null);
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

  // 进入下一句推敲或完成挑战
  const handleProceedNextStep = () => {
    setCorrectExplanation(null);
    setWrongExplanation(null);
    if (currentStepIndex + 1 < blankLines.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedWord(null);
      setIsAnswerCorrect(null);
    } else {
      finishAssembly();
    }
  };

  // 跳过填空
  const handleSkip = () => {
    if (!currentLine) return;
    setFinalScore(50);
    setCorrectExplanation(null);
    setWrongExplanation(null);
    if (currentStepIndex + 1 < blankLines.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedWord(null);
      setIsAnswerCorrect(null);
    } else {
      finishAssembly();
    }
  };

  // 键盘快捷键监听 (TODO-POL-04: 1/2/3/4选字、Enter推进、Space诵读、Esc关闭)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // 正在默写输入文本时，不拦截按键
      if (
        activeMode === 'dictation' ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === ' ' && !isFinished) {
        e.preventDefault();
        handleToggleReciting();
        return;
      }

      if (activeMode === 'assembly' && !isFinished) {
        if (isAnswerCorrect === true) {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleProceedNextStep();
          }
        } else if (currentLine?.options) {
          const num = parseInt(e.key, 10);
          if (num >= 1 && num <= currentLine.options.length) {
            e.preventDefault();
            handleOptionSelect(currentLine.options[num - 1]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeMode, isFinished, isAnswerCorrect, currentLine, isReciting, onClose]);

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

  // 更新某一行默写输入
  const handleDictationInputChange = (index: number, val: string) => {
    setDictationInputs((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  // 默写输入框按回车键聚焦下一行
  const handleDictationKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index + 1 < poem.lines.length) {
        dictationInputsRef.current[index + 1]?.focus();
      } else {
        handleSubmitDictation();
      }
    }
  };

  // 呈交全篇默写答卷并统一核验批改
  const handleSubmitDictation = () => {
    setIsDictationSubmitted(true);

    // 计算全篇统计
    let totalChars = 0;
    let totalCorrect = 0;

    poem.lines.forEach((line, idx) => {
      const diff = diffPoemLine(dictationInputs[idx] || '', line.text);
      totalChars += diff.totalTargetCount;
      totalCorrect += diff.correctCount;
    });

    const scorePercent = totalChars > 0 ? Math.round((totalCorrect / totalChars) * 100) : 0;

    if (scorePercent === 100) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#0D9488', '#F59E0B'],
      });
    }

    onComplete(poem.id, scorePercent);
  };

  // 重置默写
  const handleResetDictation = () => {
    setDictationInputs(new Array(poem.lines.length).fill(''));
    setIsDictationSubmitted(false);
    setTimeout(() => {
      dictationInputsRef.current[0]?.focus();
    }, 100);
  };

  // 全篇默写批改综合统计计算
  const dictationSummary = React.useMemo(() => {
    if (!isDictationSubmitted) return null;
    let totalChars = 0;
    let totalCorrect = 0;
    let totalErrors = 0;

    const lineDiffs = poem.lines.map((line, idx) => {
      const diff = diffPoemLine(dictationInputs[idx] || '', line.text);
      totalChars += diff.totalTargetCount;
      totalCorrect += diff.correctCount;
      diff.tokens.forEach((t) => {
        if (t.type !== 'correct') totalErrors++;
      });
      return diff;
    });

    const scorePercent = totalChars > 0 ? Math.round((totalCorrect / totalChars) * 100) : 0;
    let gradeTitle = '甲等 · 妙绝古今';
    if (scorePercent < 60) gradeTitle = '丁等 · 熟诵为先';
    else if (scorePercent < 80) gradeTitle = '丙等 · 仍需温故';
    else if (scorePercent < 100) gradeTitle = '乙等 · 文思斐然';

    return {
      lineDiffs,
      totalChars,
      totalCorrect,
      totalErrors,
      scorePercent,
      gradeTitle,
    };
  }, [isDictationSubmitted, poem.lines, dictationInputs]);

  // 判定某词条是否属于当前正在考核的答案字 (用于避免直接剧透)
  const isWordCurrentAnswer = (word: string) => {
    if (activeMode === 'preview' || isFinished || isDictationSubmitted) return false;
    if (activeMode === 'assembly' && currentLine?.correct) {
      return word.includes(currentLine.correct) || currentLine.correct.includes(word);
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/65 backdrop-blur-md animate-in fade-in select-none">
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

          {/* 古韵吟诵按钮 (TODO-REC-01/02) */}
          <button
            onClick={handleToggleReciting}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs transition-all font-poetry border cursor-pointer ${
              isReciting
                ? 'bg-amber-600 text-white border-amber-300 font-bold shadow-md animate-pulse'
                : 'bg-theme-surface hover:bg-theme-surface-card text-theme-text-muted hover:text-theme-text border-theme-border'
            }`}
            title={isReciting ? '点击暂停诵读' : '聆听名家古韵诵读'}
          >
            {isReciting ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-200" />
                <span>暂停诵读</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-theme-primary" />
                <span>✦ 聆听古韵</span>
              </>
            )}
          </button>

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

          {/* 右侧：札记与关闭按钮 */}
          <div className="flex items-center space-x-2">
            {onOpenNote && (
              <button
                onClick={() => onOpenNote(poem.title)}
                className="px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-poetry flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
                title="为此诗题写研学文心札记"
              >
                <span>✍</span>
                <span className="hidden sm:inline">提笔札记</span>
              </button>
            )}
            <button
              onClick={() => {
                handleStopReciting();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-theme-surface hover:bg-theme-surface-card text-theme-text-muted hover:text-theme-text border border-theme-border flex items-center justify-center transition-all shadow-xs cursor-pointer"
              title="关闭弹窗"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* =================================================================== */}
        {/* 2. 双联展卷主体区域 (左卷：诗境与互动 | 右卷：译文/字解/赏析/手记，支持单指横滑) */}
        {/* =================================================================== */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 grid grid-cols-12 gap-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-theme-border/60"
        >
          
          {/* ----------------------------------------------------------------- */}
          {/* 左卷 (6列)：诗屏吟诵、填词推敲、名篇整篇默写与宗师批改圈错 */}
          {/* ----------------------------------------------------------------- */}
          <div
            className={`col-span-12 lg:col-span-6 flex flex-col justify-between p-3 sm:p-5 bg-theme-canvas overflow-y-auto no-scrollbar ${
              mobileView === 'poem' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {/* 上部：宣纸绢本诗屏 */}
            <div className="relative text-center px-2 sm:px-4 py-3 sm:py-5 bg-theme-surface-card rounded-3xl border border-theme-border shadow-sm space-y-3 sm:space-y-4 overflow-hidden w-full max-h-[46vh] sm:max-h-[50vh] overflow-y-auto no-scrollbar scroll-smooth">
              <div className="text-xs text-theme-text-muted font-poetry border-b border-dashed border-theme-border/60 pb-2 flex items-center justify-between px-1">
                <span>
                  {activeMode === 'preview' && `✦ 全篇精读 · 传世长篇全文共 ${poem.lines.length} 句 ✦`}
                  {activeMode === 'assembly' && `✦ 格律推敲 · 全篇共 ${poem.lines.length} 句 · 斟酌文心 ✦`}
                  {activeMode === 'dictation' &&
                    (!isDictationSubmitted
                      ? `✦ 全篇背默 · 全文共 ${poem.lines.length} 句 · 逐句书写 ✦`
                      : '✦ 宗师朱批 · 圈红订正校勘卷 ✦')}
                </span>
                <span className="text-[10px] opacity-75 font-mono">
                  {activeMode === 'assembly' && !isFinished && `进度: ${currentStepIndex + 1}/${blankLines.length}`}
                </span>
              </div>

              {/* 模式 1: 全篇精读模式 */}
              {activeMode === 'preview' && (
                <div className="space-y-2.5 sm:space-y-3 font-poetry py-2 flex flex-col items-center w-full">
                  {poem.lines.map((line, idx) => {
                    const isVisible = idx < renderedLineCount;
                    const chars = Array.from(line.text);
                    const scale = getLineScale(chars.length, poemMaxLen);
                    return (
                      <div
                        key={idx}
                        className={`w-full max-w-full flex items-center justify-center ${scale.containerGap} transition-all duration-500 overflow-x-auto no-scrollbar py-0.5 px-2 rounded-2xl ${
                          recitingLineIdx === idx ? 'bg-amber-500/15 ring-2 ring-amber-400 shadow-sm scale-[1.02]' : ''
                        } ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 blur-[2px]'
                        }`}
                      >
                        {chars.map((char, cIdx) => (
                          <span
                            key={cIdx}
                            className={`${scale.charBox} ${scale.charFont} flex items-center justify-center font-poetry text-theme-text font-bold select-none shrink-0`}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 模式 2: 推敲填词模式 */}
              {activeMode === 'assembly' && (
                <div className="space-y-2.5 sm:space-y-3 font-poetry py-2 flex flex-col items-center w-full">
                  {poem.lines.map((line, idx) => {
                    const isVisible = idx < renderedLineCount;
                    const stepIdxForLine = blankLines.findIndex((b) => b.lineIndex === idx);
                    const isPastQuestion = stepIdxForLine !== -1 && stepIdxForLine < currentStepIndex;
                    const isCurrentQuestion = stepIdxForLine !== -1 && stepIdxForLine === currentStepIndex;
                    const chars = Array.from(line.text);
                    const scale = getLineScale(chars.length, poemMaxLen);

                    // 无填空的行
                    if (line.blank_index === null) {
                      return (
                        <div
                          key={idx}
                          className={`w-full max-w-full flex items-center justify-center ${scale.containerGap} transition-all duration-500 overflow-x-auto no-scrollbar py-0.5 px-2 rounded-2xl ${
                            recitingLineIdx === idx ? 'bg-amber-500/15 ring-2 ring-amber-400 shadow-sm scale-[1.02]' : ''
                          } ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                          }`}
                        >
                          {chars.map((char, cIdx) => (
                            <span
                              key={cIdx}
                              className={`${scale.charBox} ${scale.charFont} flex items-center justify-center font-poetry text-theme-text font-bold select-none shrink-0`}
                            >
                              {char}
                            </span>
                          ))}
                        </div>
                      );
                    }

                    // 存在填空的行
                    const bStart = line.blank_index;
                    const bLen = line.correct?.length || 1;
                    const bEnd = bStart + bLen;
                    const beforeChars = chars.slice(0, bStart);
                    const afterChars = chars.slice(bEnd);
                    const blankSlotWidth = scale.getBlankWidth(bLen);

                    return (
                      <div
                        key={idx}
                        ref={isCurrentQuestion ? activeBlankRef : null}
                        className={`w-full max-w-full flex items-center justify-center ${scale.containerGap} transition-all duration-500 overflow-x-auto no-scrollbar py-0.5 px-2 rounded-2xl ${
                          recitingLineIdx === idx ? 'bg-amber-500/15 ring-2 ring-amber-400 shadow-sm scale-[1.02]' : ''
                        } ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                        }`}
                      >
                        {/* 挖空前各字 */}
                        {beforeChars.map((char, cIdx) => (
                          <span
                            key={cIdx}
                            className={`${scale.charBox} ${scale.charFont} flex items-center justify-center font-poetry text-theme-text font-bold select-none shrink-0`}
                          >
                            {char}
                          </span>
                        ))}

                        {/* 填空字模槽 */}
                        <div
                          className={`${blankSlotWidth} ${scale.charHeight} rounded-xl flex items-center justify-center font-poetry font-bold transition-all duration-300 select-none shrink-0 ${scale.charFont} ${
                            isFinished || isPastQuestion
                              ? 'border-2 border-theme-primary/40 bg-theme-primary-light text-theme-primary shadow-xs'
                              : isCurrentQuestion
                              ? isAnswerCorrect === true
                                ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800 scale-105 shadow-sm'
                                : isAnswerCorrect === false
                                ? 'border-2 border-red-500 bg-red-50 text-red-600 animate-shake'
                                : 'border-2 border-theme-gold bg-theme-gold/15 text-theme-gold shadow-gold-glow animate-pulse font-serif'
                              : 'border-2 border-dashed border-theme-border/70 bg-theme-surface/50 text-theme-text-muted/40 font-serif'
                          }`}
                        >
                          {isFinished || isPastQuestion
                            ? line.correct
                            : isCurrentQuestion && selectedWord && isAnswerCorrect
                            ? selectedWord
                            : isCurrentQuestion && selectedWord && isAnswerCorrect === false
                            ? selectedWord
                            : '?'}
                        </div>

                        {/* 挖空后各字 */}
                        {afterChars.map((char, cIdx) => (
                          <span
                            key={cIdx + bEnd}
                            className={`${scale.charBox} ${scale.charFont} flex items-center justify-center font-poetry text-theme-text font-bold select-none shrink-0`}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 模式 3: 名篇默写模式 */}
              {activeMode === 'dictation' && (
                <div className="space-y-3.5 py-1 text-left">
                  {/* 3.1 未提交时：通篇连续默写答题卷 */}
                  {!isDictationSubmitted ? (
                    <div className="space-y-3">
                      {poem.lines.map((line, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-theme-text-muted font-poetry">
                            <span className="font-bold">第 {idx + 1} 句 ({line.text.length}字)：</span>
                            <span className="text-[10px] opacity-75">
                              {dictationInputs[idx] ? `已写 ${dictationInputs[idx].length} 字` : '未作答'}
                            </span>
                          </div>
                          <input
                            ref={(el) => {
                              dictationInputsRef.current[idx] = el;
                            }}
                            type="text"
                            value={dictationInputs[idx] || ''}
                            onChange={(e) => handleDictationInputChange(idx, e.target.value)}
                            onKeyDown={(e) => handleDictationKeyDown(idx, e)}
                            placeholder={`在此默写第 ${idx + 1} 句...`}
                            className="w-full text-base sm:text-lg font-poetry px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surface focus:bg-theme-surface-card focus:outline-none focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 text-theme-text transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* 3.2 已提交时：宗师朱批圈红订正卷 (严格圈出错误之处) */
                    <div className="space-y-4 pt-1 animate-in fade-in">
                      {dictationSummary?.lineDiffs.map((diff, lineIdx) => (
                        <div
                          key={lineIdx}
                          className="p-3.5 rounded-2xl bg-theme-surface border border-theme-border/80 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs border-b border-theme-border/40 pb-1">
                            <span className="font-poetry font-bold text-theme-text-muted">
                              第 {lineIdx + 1} 句校勘：
                            </span>
                            {diff.isPerfect ? (
                              <span className="text-theme-primary font-bold text-[11px] flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-theme-primary" />
                                <span>严丝合缝 · 全对</span>
                              </span>
                            ) : (
                              <span className="text-red-600 font-bold text-[11px] flex items-center space-x-1">
                                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                                <span>存在出入 · 已圈红</span>
                              </span>
                            )}
                          </div>

                          {/* 字符级圈红展示 */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-2 text-lg sm:text-xl font-poetry">
                            {diff.tokens.map((token, tIdx) => {
                              if (token.type === 'correct') {
                                return (
                                  <span
                                    key={tIdx}
                                    className="px-1 py-0.5 text-theme-text font-bold"
                                    title="正确"
                                  >
                                    {token.userChar}
                                  </span>
                                );
                              }

                              if (token.type === 'wrong') {
                                return (
                                  <span
                                    key={tIdx}
                                    className="relative inline-flex flex-col items-center mx-1 group"
                                  >
                                    <span className="text-[10px] text-red-600 font-bold font-poetry leading-none mb-1">
                                      正字:{token.expectedChar}
                                    </span>
                                    {/* 重点圈红 */}
                                    <span
                                      className="px-2 py-0.5 rounded-full border-2 border-red-500 bg-red-50 text-red-700 font-bold font-poetry shadow-xs ring-2 ring-red-200"
                                      title={`误写为【${token.userChar}】，正字应为【${token.expectedChar}】`}
                                    >
                                      {token.userChar}
                                    </span>
                                  </span>
                                );
                              }

                              if (token.type === 'missing') {
                                return (
                                  <span
                                    key={tIdx}
                                    className="relative inline-flex flex-col items-center mx-1 group"
                                  >
                                    <span className="text-[10px] text-red-600 font-bold font-poetry leading-none mb-1">
                                      漏字
                                    </span>
                                    {/* 漏字虚线圈红 */}
                                    <span
                                      className="px-2 py-0.5 rounded-lg border-2 border-dashed border-red-500 bg-red-50 text-red-700 font-bold font-poetry"
                                      title={`遗漏字【${token.expectedChar}】`}
                                    >
                                      [缺:{token.expectedChar}]
                                    </span>
                                  </span>
                                );
                              }

                              // extra 多字
                              return (
                                <span
                                  key={tIdx}
                                  className="relative inline-flex flex-col items-center mx-1 group"
                                >
                                  <span className="text-[10px] text-red-600 font-bold font-poetry leading-none mb-1">
                                    衍字
                                  </span>
                                  {/* 多字圈红划除 */}
                                  <span
                                    className="px-1.5 py-0.5 rounded-full border-2 border-red-400 bg-red-100 text-red-800 line-through font-bold font-poetry"
                                    title={`多写了【${token.userChar}】`}
                                  >
                                    {token.userChar}
                                  </span>
                                </span>
                              );
                            })}
                          </div>

                          {/* 原句对照提示 */}
                          {!diff.isPerfect && (
                            <div className="text-[11px] text-theme-text-muted/80 font-poetry pt-1 border-t border-dashed border-theme-border/50">
                              原句正文：{poem.lines[lineIdx].text}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
                    已阅毕全诗，可进入格律推敲或名篇背默模式检验文心！
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveMode('assembly')}
                      className="py-2.5 rounded-2xl bg-theme-primary text-white font-bold text-xs shadow-jade-glow hover:bg-theme-primary-hover active:scale-98 transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-theme-gold" />
                      <span>格律推敲 ➔</span>
                    </button>
                    <button
                      onClick={() => setActiveMode('dictation')}
                      className="py-2.5 rounded-2xl bg-theme-surface border border-theme-border hover:border-theme-primary text-theme-text font-bold text-xs shadow-xs active:scale-98 transition-all flex items-center justify-center space-x-1.5"
                    >
                      <PenTool className="w-3.5 h-3.5 text-theme-primary" />
                      <span>全篇默写 ➔</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 模式 B：填词推敲选项区域 */}
              {activeMode === 'assembly' && !isFinished && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-theme-text px-1">
                    <span className="flex items-center space-x-1.5 text-theme-primary">
                      <Lightbulb className="w-4 h-4 text-theme-gold shrink-0" />
                      <span>
                        {currentLine?.correct && currentLine.correct.length > 1
                          ? '请推敲最契合诗境之词句：'
                          : '请推敲最契合诗境之一字：'}
                      </span>
                    </span>
                    {errorCount >= 1 && (
                      <button
                        onClick={handleSkip}
                        className="text-theme-gold hover:underline flex items-center space-x-1 font-bold text-xs"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>跳过直接看解析</span>
                      </button>
                    )}
                  </div>

                  {/* 活字雕版 · 汲古玉牌选项按键 */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                    {currentLine?.options?.map((opt, i) => {
                      const label = ['A', 'B', 'C', 'D'][i];
                      const isThisSelected = selectedWord === opt;

                      return (
                        <button
                          key={opt}
                          disabled={isAnswerCorrect === true}
                          onClick={() => handleOptionSelect(opt)}
                          className={`group relative py-2 px-3 sm:py-2.5 sm:px-3.5 rounded-xl border transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-xs ${
                            isThisSelected && isAnswerCorrect === true
                              ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-900 shadow-sm scale-[1.01]'
                              : isThisSelected && isAnswerCorrect === false
                              ? 'bg-red-50 border-2 border-red-400 text-red-700'
                              : isAnswerCorrect === true
                              ? 'opacity-40 border-dashed border-theme-border/60 bg-theme-surface/40 text-theme-text-muted cursor-not-allowed'
                              : 'bg-theme-surface-card hover:bg-theme-surface border-theme-border hover:border-theme-primary/60 hover:shadow-card-soft hover:-translate-y-0.5'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            {/* 左侧选项序号与键盘快捷键提示 */}
                            <div className="flex items-center space-x-1">
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] border transition-colors ${
                                  isThisSelected && isAnswerCorrect === true
                                    ? 'bg-emerald-200/80 text-emerald-800 border-emerald-300'
                                    : isThisSelected && isAnswerCorrect === false
                                    ? 'bg-red-200/80 text-red-800 border-red-300'
                                    : 'bg-theme-surface border-theme-border text-theme-text-muted group-hover:text-theme-primary group-hover:border-theme-primary/40'
                                }`}
                              >
                                {label}
                              </span>
                              <span className="hidden sm:inline-block text-[9px] text-theme-text-muted/50 font-mono">
                                [{i + 1}]
                              </span>
                            </div>

                            {/* 中间核心字词 (舒适雅致字号) */}
                            <span
                              className={`${getOptionFontSizeClass(opt)} tracking-wider transition-transform group-hover:scale-105 ${
                                isThisSelected && isAnswerCorrect === true
                                  ? 'text-emerald-900 font-bold'
                                  : isThisSelected && isAnswerCorrect === false
                                  ? 'text-red-700 font-bold'
                                  : 'text-theme-text group-hover:text-theme-primary'
                              }`}
                            >
                              {opt}
                            </span>

                            {/* 右侧反馈微标 */}
                            <div className="w-5 flex items-center justify-end">
                              {isThisSelected && isAnswerCorrect === true ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-in zoom-in" />
                              ) : isThisSelected && isAnswerCorrect === false ? (
                                <AlertCircle className="w-4 h-4 text-red-600 animate-in zoom-in" />
                              ) : (
                                <span className="text-[10px] font-poetry opacity-0 group-hover:opacity-100 transition-opacity text-theme-primary">
                                  选
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* 选对即时炼字赏析卡片 */}
                  {correctExplanation && isAnswerCorrect === true && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2.5 animate-in fade-in text-xs text-emerald-950 shadow-xs">
                      <div className="flex items-start space-x-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <div className="font-bold text-emerald-800 font-poetry flex items-center space-x-1.5">
                            <span>✦ 妙笔天成 · 炼字正解：</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-200/60 text-emerald-800 text-[10px] font-mono font-bold">
                              {selectedWord}
                            </span>
                          </div>
                          <p className="leading-relaxed font-sans text-emerald-900 text-xs">
                            {correctExplanation}
                          </p>
                        </div>
                      </div>

                      {/* 前进按钮 */}
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={handleProceedNextStep}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center space-x-1.5"
                        >
                          <span>
                            {currentStepIndex + 1 < blankLines.length
                              ? '领悟文心 · 推敲下一句 ➔'
                              : '参透妙旨 · 载入典藏 ➔'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

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

              {/* 模式 C：全篇默写操作台 (未提交时可检查呈交；提交后显示综合评级与重默) */}
              {activeMode === 'dictation' && (
                <div className="space-y-3">
                  {!isDictationSubmitted ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-theme-text-muted px-1">
                        <span>
                          进度：已填写{' '}
                          <span className="font-bold text-theme-primary">
                            {dictationInputs.filter((t) => t.trim().length > 0).length}
                          </span>{' '}
                          / {poem.lines.length} 句
                        </span>
                        <button
                          onClick={handleResetDictation}
                          className="hover:text-theme-primary flex items-center space-x-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>清空重填</span>
                        </button>
                      </div>

                      <button
                        onClick={handleSubmitDictation}
                        className="w-full py-3 rounded-2xl bg-theme-primary text-white font-bold text-sm shadow-jade-glow hover:bg-theme-primary-hover active:scale-98 transition-all flex items-center justify-center space-x-2"
                      >
                        <Send className="w-4 h-4 text-theme-gold" />
                        <span>检查完毕 · 呈交卷轴批改</span>
                      </button>
                    </div>
                  ) : (
                    /* 批改评级面板 */
                    <div className="space-y-3 animate-in fade-in">
                      <div className="p-4 bg-theme-surface-card border border-theme-border rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-0.5 text-left">
                          <h4 className="font-bold text-sm font-poetry text-theme-text">
                            {dictationSummary?.gradeTitle}
                          </h4>
                          <p className="text-xs text-theme-text-muted">
                            共 {dictationSummary?.totalChars} 字 · 正字 {dictationSummary?.totalCorrect} 字 · 错漏 {dictationSummary?.totalErrors} 处
                          </p>
                        </div>
                        <span className="text-base font-bold font-poetry px-3.5 py-1 rounded-full bg-theme-primary text-white shadow-sm">
                          {dictationSummary?.scorePercent} 分
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleResetDictation}
                          className="py-2.5 rounded-xl border border-theme-border bg-theme-surface hover:bg-theme-surface-card text-theme-text font-bold text-xs flex items-center justify-center space-x-1 transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-theme-primary" />
                          <span>再默写一遍</span>
                        </button>
                        <button
                          onClick={onClose}
                          className="py-2.5 rounded-xl bg-theme-primary text-white font-bold text-xs shadow-jade-glow hover:bg-theme-primary-hover transition-all"
                        >
                          收卷 · 重返山河
                        </button>
                      </div>
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
            className={`col-span-12 lg:col-span-6 flex flex-col p-4 sm:p-6 bg-theme-surface overflow-hidden ${
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
              
              {/* 1. 【全篇白话今译】(精读模式/提交后常驻展开；默写与推敲过程中默认柔和遮瑕) */}
              {(analysisFilter === 'all' || analysisFilter === 'translation') && (
                <section className="p-4 sm:p-5 rounded-2xl bg-theme-surface-card border border-theme-border shadow-xs space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-theme-primary" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-theme-primary font-poetry font-bold text-sm">
                      <BookOpen className="w-4 h-4 text-theme-primary" />
                      <span>【全篇白话今译】</span>
                    </div>

                    {/* 防剧透开关 */}
                    {activeMode !== 'preview' && !isFinished && !isDictationSubmitted && (
                      <button
                        onClick={() => setShowTranslationHint(!showTranslationHint)}
                        className="text-[11px] font-bold text-theme-gold hover:underline flex items-center space-x-1"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{showTranslationHint ? '收起译文防剧透' : '揭晓译文锦囊提示'}</span>
                      </button>
                    )}
                  </div>

                  {activeMode === 'preview' || isFinished || isDictationSubmitted || showTranslationHint ? (
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

              {/* 2. 【重点字词训诂与典故出处】 */}
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

              {/* 3. 【名家美学绝评与章法艺术赏析】 */}
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
                <section className="p-5 rounded-2xl bg-theme-surface-card border border-theme-border shadow-xs font-poetry space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-theme-border/60">
                    <div className="flex items-center space-x-2 text-theme-gold font-bold text-xs sm:text-sm">
                      <Feather className="w-4 h-4 text-theme-gold" />
                      <span>【诗人第一人称文心手札 · 私密心语】</span>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-theme-gold/10 text-theme-gold border border-theme-gold/30 font-bold">
                      原重心境
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-theme-text leading-relaxed tracking-wider indent-6 whitespace-pre-line leading-7 font-poetry">
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
