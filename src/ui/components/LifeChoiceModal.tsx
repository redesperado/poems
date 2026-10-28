import React, { useState } from 'react';
import { LifeChoice, LifeChoiceOption } from '../../types/event';
import { GitFork, History, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LifeChoiceModalProps {
  choice: LifeChoice;
  onConfirmChoice: (choiceId: string, option: LifeChoiceOption) => void;
  onClose: () => void;
}

export const LifeChoiceModal: React.FC<LifeChoiceModalProps> = ({
  choice,
  onConfirmChoice,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<LifeChoiceOption | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const handleSelectOption = (option: LifeChoiceOption) => {
    setSelectedOption(option);
    setIsRevealed(true);
  };

  const handleProceed = () => {
    if (!selectedOption) return;
    onConfirmChoice(choice.id, selectedOption);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-theme-surface-card/95 backdrop-blur-2xl border border-theme-border rounded-[2rem] p-6 shadow-2xl flex flex-col max-h-[92dvh] overflow-y-auto no-scrollbar">
        {/* 顶部月门微弧装饰与标题 */}
        <div className="text-center pb-4 border-b border-theme-border/60">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-theme-primary/10 border border-theme-primary/30 text-theme-primary text-xs font-semibold mb-2">
            <GitFork className="w-3.5 h-3.5" />
            <span>历史关键抉择 · 人生岔路</span>
          </div>

          <h2 className="text-xl font-bold font-poetry text-theme-text tracking-wide">
            命运的分水岭
          </h2>
          <p className="text-xs text-theme-text-muted mt-2 leading-relaxed px-2">
            {choice.prompt}
          </p>
        </div>

        {/* 选项对比卡片 (非直角有机流线按键) */}
        {!isRevealed ? (
          <div className="my-5 space-y-3.5">
            <div className="text-[11px] text-theme-text-muted text-center">
              每个抉择都将深刻影响诗人的创作心境，并解锁不同的历史走向：
            </div>

            <div className="space-y-3">
              {choice.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left p-4 rounded-2xl border border-theme-border bg-theme-surface hover:border-theme-primary hover:shadow-jade-glow transition-all active:scale-[0.98] group flex flex-col space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-theme-text font-poetry group-hover:text-theme-primary transition-colors">
                      {opt.text}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        opt.is_historical
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-teal-100 text-teal-900 border border-teal-300'
                      }`}
                    >
                      {opt.is_historical ? '正史脉络' : '平行时空'}
                    </span>
                  </div>

                  {/* 情绪变化预测小标签 */}
                  <div className="flex items-center space-x-2 text-[11px] text-theme-text-muted">
                    {opt.mood_delta.passion && (
                      <span className="text-amber-600">
                        豪情 {opt.mood_delta.passion > 0 ? `+${opt.mood_delta.passion}` : opt.mood_delta.passion}
                      </span>
                    )}
                    {opt.mood_delta.freedom && (
                      <span className="text-emerald-600">
                        洒脱 {opt.mood_delta.freedom > 0 ? `+${opt.mood_delta.freedom}` : opt.mood_delta.freedom}
                      </span>
                    )}
                    {opt.mood_delta.anger && (
                      <span className="text-red-600">
                        愤懑 {opt.mood_delta.anger > 0 ? `+${opt.mood_delta.anger}` : opt.mood_delta.anger}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 选后揭示：历史上真实发生了什么（教育沉淀） */
          <div className="my-5 space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-theme-primary/10 border border-theme-primary/30 flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-theme-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-theme-text font-poetry">
                  你选择了：{selectedOption?.text}
                </h4>
                <p className="text-xs text-theme-text-muted mt-1 leading-relaxed">
                  {selectedOption?.historical_note}
                </p>
              </div>
            </div>

            {/* 历史真相知识卡片 */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                <History className="w-4 h-4 text-amber-700" />
                <span>【历史回响 · 真相纪要】</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {choice.historical_context}
              </p>
            </div>

            <button
              onClick={handleProceed}
              className="w-full py-3 rounded-full bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>顺承此径，继续游历</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 底部备注 */}
        {!isRevealed && (
          <div className="pt-2 text-center text-[10px] text-gray-400">
            不同抉择将解锁不同的诗作典藏与游历机缘
          </div>
        )}
      </div>
    </div>
  );
};
