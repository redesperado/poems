import React from 'react';
import { CityCulturalData } from '../../data/cities';
import { PoemData } from '../../types/poem';
import { getCityArtifact } from '../../data/artifacts';
import {
  Compass,
  Landmark,
  BookOpen,
  MapPin,
  Footprints,
  X,
  Scroll,
  Sparkles,
} from 'lucide-react';

interface CityDetailModalProps {
  city: CityCulturalData;
  dynasty: 'tang' | 'song';
  isCurrentLocation: boolean;
  onTravelHere: (cityId: string) => void;
  onClose: () => void;
  activePoems?: PoemData[];
  unlockedPoemIds?: string[];
  onSelectPoemForPlay?: (poem: PoemData) => void;
  unlockedArtifactIds?: string[];
  onCollectArtifact?: (artifactId: string) => void;
}

export const CityDetailModal: React.FC<CityDetailModalProps> = ({
  city,
  dynasty,
  isCurrentLocation,
  onTravelHere,
  onClose,
  activePoems,
  unlockedPoemIds,
  onSelectPoemForPlay,
  unlockedArtifactIds,
  onCollectArtifact,
}) => {
  // 严格只读取当前朝代的信息，绝不混杂其他朝代！
  const dynastyData = dynasty === 'tang' ? city.tang : city.song;

  // 匹配本城特色传世风物
  const cityArtifact = getCityArtifact(city.id);
  const isArtifactCollected = cityArtifact
    ? (unlockedArtifactIds || []).includes(cityArtifact.id)
    : false;

  // 查找当期主角在此城池关联的收录诗作
  const matchingPoems = (activePoems || []).filter((p) => {
    if (p.location_id === city.id) return true;
    if (city.id === 'chang_an' && p.location_id === 'chang_an') return true;
    if (city.id === 'jiangyou' && (p.location_id === 'sichuan' || p.location_id === 'jiangyou')) return true;
    if (city.id === 'jiangxia' && (p.location_id === 'huanghelou' || p.location_id === 'jiangxia')) return true;
    if (city.id === 'xunyang' && (p.location_id === 'lu_shan' || p.location_id === 'xunyang')) return true;
    if (city.id === 'kuizhou' && (p.location_id === 'baidicheng' || p.location_id === 'kuizhou')) return true;
    if (city.id === 'guangling' && (p.location_id === 'yangzhou' || p.location_id === 'guangling')) return true;
    if (city.id === 'chengdu' && p.location_id === 'chengdu') return true;
    if (city.id === 'jinan' && p.location_id === 'jinan') return true;
    if (city.id === 'bianjing' && p.location_id === 'bianjing') return true;
    if (city.id === 'linan' && p.location_id === 'linan') return true;
    if (city.id === 'jinling' && p.location_id === 'jinling') return true;
    if (city.id === 'taishan' && p.location_id === 'taishan') return true;
    return false;
  });

  // 意境横幅视觉渐变
  const getBannerGradient = () => {
    switch (city.landscape_banner_theme) {
      case 'changan_palace':
        return 'from-amber-800 via-orange-900 to-stone-950';
      case 'hangzhou_westlake':
        return 'from-emerald-800 via-teal-900 to-slate-950';
      case 'luoyang_peony':
        return 'from-rose-800 via-red-900 to-neutral-950';
      case 'yangzhou_moon':
        return 'from-indigo-900 via-purple-950 to-slate-950';
      case 'wuhan_crane':
        return 'from-amber-700 via-yellow-800 to-stone-950';
      case 'lushan_waterfall':
        return 'from-teal-800 via-emerald-950 to-slate-950';
      case 'baidi_gorge':
        return 'from-stone-800 via-emerald-950 to-slate-950';
      default:
        return 'from-teal-900 via-slate-900 to-stone-950';
    }
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white/98 backdrop-blur-2xl border border-slate-300 rounded-[2rem] shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden text-slate-900">
        {/* 1. 顶部特色山水意境横幅 */}
        <div
          className={`relative h-44 sm:h-48 bg-gradient-to-br ${getBannerGradient()} p-6 text-white flex flex-col justify-between overflow-hidden shadow-md`}
        >
          {/* 水墨浮雕微纹大字 */}
          <div className="absolute right-4 bottom-2 text-7xl sm:text-8xl font-serif text-white/10 select-none pointer-events-none font-bold">
            {dynastyData.name.slice(0, 2)}
          </div>

          {/* 顶栏：仅显示当朝的区划 */}
          <div className="flex items-center justify-between z-10">
            <span className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 font-medium flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {dynasty === 'tang' ? '大唐道制' : '两宋路制'}：{dynastyData.administrative_region}
              </span>
            </span>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 城市大标题与当朝地位 */}
          <div className="z-10">
            <div className="flex items-baseline space-x-3">
              <h2 className="text-2xl sm:text-3xl font-bold font-poetry tracking-wide text-white drop-shadow-sm">
                {dynastyData.name}
              </h2>
              <span className="text-xs text-amber-200/90 font-mono">
                (今 {city.name_modern})
              </span>
            </div>
            <p className="text-xs text-amber-200 font-poetry mt-1 italic drop-shadow-sm">
              “{dynastyData.brief}”
            </p>
          </div>
        </div>

        {/* 2. 主体人文内容区域（高对比度，黑字分明） */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4 bg-[#FCFDFB]">
          {/* 当朝地位总括 */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start space-x-3">
            <Scroll className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed">
              <span className="font-bold">【{dynasty === 'tang' ? '大唐' : '两宋'}地位】：</span>
              {dynastyData.dynasty_title}，隶属{dynastyData.administrative_region}。
            </div>
          </div>

          {/* ✦ 当令文心 · 传世绝唱 (快捷研学复习入口 TODO-POL-02) */}
          {matchingPoems.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-poetry text-amber-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>【当令文心 · 传世名篇】</span>
                </span>
                <span className="text-[10px] text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full font-poetry border border-amber-300/50">
                  收录 {matchingPoems.length} 篇
                </span>
              </div>

              <div className="space-y-2">
                {matchingPoems.map((poem) => {
                  const isUnlocked = unlockedPoemIds?.includes(poem.id);
                  return (
                    <div
                      key={poem.id}
                      className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-xs flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900 font-poetry truncate">
                            《{poem.title}》
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-medium ${
                              isUnlocked
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {isUnlocked ? '已收录' : '待感悟'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-poetry truncate mt-1">
                          “{poem.lines[0]?.text}”
                        </p>
                      </div>

                      {onSelectPoemForPlay && (
                        <button
                          onClick={() => {
                            onSelectPoemForPlay(poem);
                            onClose();
                          }}
                          className="shrink-0 px-3 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-poetry font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{isUnlocked ? '重温诗作' : '研悟创作'}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 纯当前朝代的人文历史风貌 */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
              <Landmark className="w-4 h-4 text-emerald-700" />
              <span>【{dynasty === 'tang' ? '盛唐' : '两宋'}风骨与建置】</span>
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed leading-6 indent-5">
              {dynastyData.humanities_history}
            </p>
          </div>

          {/* 纯当前朝代的历代传世诗篇 */}
          {dynastyData.famous_poems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>【{dynasty === 'tang' ? '唐音' : '宋韵'} · 传世名篇】</span>
              </h4>
              <div className="space-y-2">
                {dynastyData.famous_poems.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900 font-poetry">
                          《{p.title}》
                        </span>
                        <span className="text-[10px] text-slate-500 font-sans">
                          [{p.author}]
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800 font-poetry font-medium mt-1">
                        “{p.verse}”
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 当朝胜迹与特产 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">🏛 当朝胜迹：</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {dynastyData.scenic_spots.map((spot, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-700 font-medium"
                  >
                    {spot}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">🍵 当朝风物：</span>
              <p className="text-[11px] text-slate-700 mt-1">{dynastyData.local_specialty}</p>
            </div>
          </div>

          {/* 名城风物行囊收纳 (TODO-ART-03) */}
          {cityArtifact && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-emerald-50/70 to-amber-50/90 border border-amber-200/90 shadow-xs space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-2.5">
                  <div className="text-2xl p-2 rounded-2xl bg-white border border-amber-200 shadow-xs shrink-0">
                    {cityArtifact.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className="font-bold text-xs text-amber-950 font-poetry">
                        {cityArtifact.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                        {cityArtifact.categoryName}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-poetry">
                        {cityArtifact.rarity === 'legendary'
                          ? '绝品'
                          : cityArtifact.rarity === 'epic'
                          ? '珍品'
                          : '雅物'}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900 font-poetry italic mt-1 leading-snug">
                      “{cityArtifact.quote}”
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isArtifactCollected ? (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center space-x-1">
                      <span>✓ 已纳归行囊</span>
                    </span>
                  ) : isCurrentLocation ? (
                    <button
                      onClick={() => onCollectArtifact?.(cityArtifact.id)}
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-[11px] font-bold font-poetry shadow-sm flex items-center space-x-1 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>✦ 采撷归囊</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-white/80 border border-slate-200 px-2 py-1 rounded-full">
                      身在此城可采撷
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed indent-2 border-t border-amber-200/50 pt-1.5">
                {cityArtifact.description}
              </p>
            </div>
          )}
        </div>

        {/* 3. 底部游历操作栏 */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>
              {isCurrentLocation
                ? '文人当前正居于此地'
                : '大好山河，心之所向皆可亲历'}
            </span>
          </div>

          {isCurrentLocation ? (
            <div className="flex items-center space-x-2">
              {matchingPoems.length > 0 && onSelectPoemForPlay && (
                <button
                  onClick={() => {
                    onSelectPoemForPlay(matchingPoems[0]);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold font-poetry shadow-sm flex items-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>研习《{matchingPoems[0].title}》</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 cursor-pointer"
              >
                已身在城中
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onTravelHere(city.id);
                onClose();
              }}
              className="px-6 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center space-x-1.5"
            >
              <Footprints className="w-4 h-4" />
              <span>移步游历此地</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
