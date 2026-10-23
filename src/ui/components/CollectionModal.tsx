import React, { useState } from 'react';
import { LI_BAI_POEMS } from '../../data/poets/li_bai/poems';
import { PoemData } from '../../types/poem';
import { X, BookOpen, Award, Check } from 'lucide-react';

interface CollectionModalProps {
  unlockedPoemIds: string[];
  poemScores: Record<string, number>;
  onClose: () => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  unlockedPoemIds,
  poemScores,
  onClose,
}) => {
  const [selectedPoem, setSelectedPoem] = useState<PoemData | null>(
    LI_BAI_POEMS.find((p) => unlockedPoemIds.includes(p.id)) || null
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-theme-surface-card/95 backdrop-blur-xl border border-theme-border rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90dvh]">
        {/* 顶部标题与关闭 */}
        <div className="flex items-center justify-between pb-3 border-b border-theme-border/60">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-theme-primary" />
            <h2 className="text-lg font-bold font-poetry text-theme-text">
              诗仙文渊 · 典藏阁
            </h2>
            <span className="text-xs text-theme-text-muted">
              ({unlockedPoemIds.length}/{LI_BAI_POEMS.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 典藏内容：多宝阁卡片网格 + 详情查看 */}
        <div className="mt-4 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto no-scrollbar">
          {/* 左侧：已解锁与未解锁诗作列表 */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-theme-text-muted">
              太白存卷
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {LI_BAI_POEMS.map((poem) => {
                const isUnlocked = unlockedPoemIds.includes(poem.id);
                const score = poemScores[poem.id] || 100;
                const isSelected = selectedPoem?.id === poem.id;

                return (
                  <button
                    key={poem.id}
                    disabled={!isUnlocked}
                    onClick={() => isUnlocked && setSelectedPoem(poem)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      !isUnlocked
                        ? 'opacity-40 border-dashed border-gray-300 bg-gray-50/50 cursor-not-allowed'
                        : isSelected
                        ? 'bg-theme-primary/10 border-theme-primary shadow-sm'
                        : 'bg-theme-surface hover:border-theme-border-highlight'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm font-poetry text-theme-text">
                          《{poem.title}》
                        </span>
                        {isUnlocked && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            {score === 100 ? '甲等' : score >= 75 ? '乙等' : '丙等'}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-theme-text-muted mt-0.5 block">
                        {isUnlocked
                          ? `${poem.year} 年 · 游历自得`
                          : '尚未在游历中触发灵感'}
                      </span>
                    </div>

                    {isUnlocked && (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 右侧：单篇诗词的墨宝鉴赏与白话背景 */}
          <div className="bg-gradient-to-b from-white to-gray-50/60 rounded-2xl p-4 border border-theme-border/60 flex flex-col justify-between">
            {selectedPoem ? (
              <div className="space-y-3.5 overflow-y-auto no-scrollbar">
                <div className="border-b border-theme-border/50 pb-2">
                  <h4 className="text-lg font-bold font-poetry text-theme-text">
                    《{selectedPoem.title}》
                  </h4>
                  <p className="text-[11px] text-theme-text-muted">
                    唐 · 李太白 · 公元 {selectedPoem.year} 年
                  </p>
                </div>

                {/* 诗词原著书法排版 */}
                <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/40 text-center font-poetry text-base leading-relaxed tracking-wider text-theme-text">
                  {selectedPoem.full_text}
                </div>

                {/* 白话译文 */}
                <div className="text-xs text-theme-text-muted space-y-1">
                  <span className="font-bold text-theme-text">【白话今译】</span>
                  <p className="leading-relaxed">{selectedPoem.translation}</p>
                </div>

                {/* 创作背景 */}
                <div className="text-xs text-theme-text-muted space-y-1">
                  <span className="font-bold text-theme-text">【创作心境】</span>
                  <p className="leading-relaxed">{selectedPoem.background}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-theme-text-muted text-xs space-y-2">
                <Award className="w-8 h-8 opacity-40" />
                <p>游历名山大川以解锁更多名篇典藏</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
