import React, { useState } from 'react';
import { PoetData } from '../../types/poet';
import { PoetRetrospectiveData } from '../../types/event';
import { MoodState } from '../../types/mood';
import {
  Sparkles,
  BookOpen,
  Crown,
  Quote,
  Feather,
  RotateCcw,
  Compass,
  X,
  ScrollText,
} from 'lucide-react';

export interface PoetRetrospectiveModalProps {
  poet: PoetData;
  retrospective: PoetRetrospectiveData;
  unlockedCount: number;
  totalCount: number;
  mood: MoodState;
  onOpenCollection: () => void;
  onRestartJourney: () => void;
  onBackToHome?: () => void;
  onExportPassport?: () => void;
  onClose: () => void;
}

export const PoetRetrospectiveModal: React.FC<PoetRetrospectiveModalProps> = ({
  poet,
  retrospective,
  unlockedCount,
  totalCount,
  mood,
  onOpenCollection,
  onRestartJourney,
  onBackToHome,
  onExportPassport,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'epitaph' | 'appraisals' | 'legacy'>('epitaph');
  const [selectedCriticIdx, setSelectedCriticIdx] = useState<number>(0);

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-stone-900/95 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl text-stone-100 flex flex-col space-y-4 overflow-hidden">
        {/* 背景金辉与水墨微芒 */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-transparent to-stone-950/80 pointer-events-none" />

        {/* 顶部标题栏：千秋通鉴 · 绝代谢幕 */}
        <div className="relative flex items-center justify-between pb-3.5 border-b border-amber-500/30 shrink-0">
          <div className="flex items-center space-x-2.5 text-amber-400">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40 shadow-sm">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-bold font-poetry text-amber-200 tracking-wider">
                  千秋定评 · 绝代谢幕
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  公元 {retrospective.passing_year} 年
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-poetry">
                {poet.name_cn} · 享年六十二载（公元 {poet.born} — {retrospective.passing_year}）
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 flex items-center justify-center transition-all cursor-pointer"
              title="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 中部导航标签页 (平生行状 / 宗匠合论 / 千秋总评) */}
        <div className="relative flex items-center justify-center space-x-2 border-b border-stone-800 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('epitaph')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold font-poetry transition-all cursor-pointer ${
              activeTab === 'epitaph'
                ? 'bg-amber-500 text-stone-950 shadow-gold-glow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <ScrollText className="w-3.5 h-3.5" />
              <span>【羽化谢幕 · 绝笔行状】</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('appraisals')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold font-poetry transition-all cursor-pointer ${
              activeTab === 'appraisals'
                ? 'bg-amber-500 text-stone-950 shadow-gold-glow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <Quote className="w-3.5 h-3.5" />
              <span>【千秋定评 · 宗师合论】</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('legacy')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold font-poetry transition-all cursor-pointer ${
              activeTab === 'legacy'
                ? 'bg-amber-500 text-stone-950 shadow-gold-glow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>【一世功过 · 精神丰碑】</span>
            </span>
          </button>
        </div>

        {/* 核心内容滚动区 */}
        <div className="relative flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 text-xs sm:text-[13px] leading-relaxed">
          {/* 选项卡 1: 平生行状与绝笔 */}
          {activeTab === 'epitaph' && (
            <div className="space-y-4 animate-in fade-in">
              {/* 绝笔《临终歌》书法横额 */}
              {retrospective.swan_song_lines && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-800/70 to-amber-950/40 border border-amber-500/40 text-center space-y-2 shadow-inner">
                  <div className="flex items-center justify-center space-x-2 text-amber-300 font-bold font-poetry text-sm">
                    <Feather className="w-4 h-4 text-amber-400" />
                    <span>{retrospective.swan_song_title || '《临终歌》'}</span>
                  </div>
                  <div className="space-y-1.5 py-1">
                    {retrospective.swan_song_lines.map((line, idx) => (
                      <p
                        key={idx}
                        className="text-amber-100 font-poetry text-base sm:text-lg font-bold tracking-widest leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  <p className="text-[11px] text-amber-300/70 font-poetry">
                    宝应元年冬，太白绝笔托付李阳冰
                  </p>
                </div>
              )}

              {/* 平生大数据成就仪表板 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/80 text-center space-y-1">
                  <div className="text-[10px] text-stone-400 font-poetry">春秋年寿</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
                    62 <span className="text-xs font-normal">载</span>
                  </div>
                  <div className="text-[10px] text-stone-400">701 — 762</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/80 text-center space-y-1">
                  <div className="text-[10px] text-stone-400 font-poetry">传世名篇研习</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                    {unlockedCount} / {totalCount}
                  </div>
                  <div className="text-[10px] text-stone-400">登峰造极 · 墨宝尽收</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/80 text-center space-y-1">
                  <div className="text-[10px] text-stone-400 font-poetry">平生游历名城</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
                    20+ <span className="text-xs font-normal">座</span>
                  </div>
                  <div className="text-[10px] text-stone-400">两京江淮 · 蜀道苍茫</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/80 text-center space-y-1">
                  <div className="text-[10px] text-stone-400 font-poetry">终局豪迈文心</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-purple-300">
                    {mood.freedom} <span className="text-xs font-normal">点</span>
                  </div>
                  <div className="text-[10px] text-stone-400">洒脱不羁 · 仙风道骨</div>
                </div>
              </div>

              {/* 谢幕纪胜：骑鲸捉月传闻 */}
              <div className="p-4 rounded-2xl bg-stone-800/70 border border-amber-500/20 space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-bold font-poetry text-sm border-b border-stone-700/60 pb-1.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>【当涂谢幕 · 骑鲸捉月之千古神话】</span>
                </div>
                <p className="text-stone-300 leading-relaxed indent-4">
                  {retrospective.departure_narrative}
                </p>
              </div>
            </div>
          )}

          {/* 选项卡 2: 千秋宗师定评 */}
          {activeTab === 'appraisals' && (
            <div className="space-y-4 animate-in fade-in">
              {/* 历代名家头像/姓名横向切换器 */}
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
                {retrospective.master_appraisals.map((appraisal, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCriticIdx(idx)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-poetry whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                      selectedCriticIdx === idx
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-xs'
                        : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{appraisal.critic}</span>
                  </button>
                ))}
              </div>

              {/* 当前选中宗师名评详案卡片 */}
              {retrospective.master_appraisals[selectedCriticIdx] && (
                <div className="p-5 rounded-2xl bg-stone-800/80 border border-amber-500/40 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-stone-700/60 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold font-poetry text-amber-300">
                        {retrospective.master_appraisals[selectedCriticIdx].critic}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-stone-700 text-stone-300 font-poetry">
                        {retrospective.master_appraisals[selectedCriticIdx].relationship}
                      </span>
                    </div>
                  </div>

                  {/* 警策金句 */}
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-100 font-poetry text-sm sm:text-base font-bold italic">
                    “{retrospective.master_appraisals[selectedCriticIdx].quote}”
                  </div>

                  {/* 详细论断 */}
                  <p className="text-stone-300 leading-relaxed indent-4 pt-1">
                    {retrospective.master_appraisals[selectedCriticIdx].comment}
                  </p>
                </div>
              )}

              {/* 其余宗师速览清单 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {retrospective.master_appraisals.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedCriticIdx(idx)}
                    className="p-3 rounded-xl bg-stone-800/50 border border-stone-700 hover:border-amber-500/40 transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold font-poetry text-amber-300">{item.critic}</span>
                      <span className="text-[10px] text-stone-400">{item.relationship}</span>
                    </div>
                    <p className="text-[11px] text-stone-300 truncate font-poetry italic">
                      “{item.quote}”
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 选项卡 3: 一世功过与历史丰碑 */}
          {activeTab === 'legacy' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-3">
                <div className="flex items-center space-x-2 text-amber-300 font-bold font-poetry text-base border-b border-amber-500/30 pb-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>【千秋行状 · 盛唐之魂】</span>
                </div>
                <div className="space-y-2.5 text-stone-200">
                  {retrospective.historical_legacy.split('\n\n').map((paragraph, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/60 leading-relaxed">
                      {paragraph}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部三大行动按键 */}
        <div className="relative pt-3 border-t border-stone-800 shrink-0 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {onExportPassport && (
              <button
                onClick={onExportPassport}
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-poetry font-bold text-xs shadow-md transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
              >
                <span>📜</span>
                <span>镌印文牒 · 导出长图</span>
              </button>
            )}
            <button
              onClick={onOpenCollection}
              className="px-4 py-2.5 rounded-full bg-stone-800 hover:bg-stone-700 border border-amber-500/40 text-amber-300 font-poetry font-bold text-xs shadow-md transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>重温文渊典藏 ({unlockedCount}/{totalCount})</span>
            </button>
            <button
              onClick={onRestartJourney}
              className="px-4 py-2.5 rounded-full bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-300 font-poetry font-bold text-xs shadow-md transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重走{poet.title}路 · 重启长卷</span>
            </button>
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-4 py-2.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 font-poetry font-bold text-xs shadow-md transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>返回长卷首页 · 切换文人 ➔</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
          >
            <span>合卷静思 · 归隐山河</span>
          </button>
        </div>
      </div>
    </div>
  );
};
