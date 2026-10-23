import React from 'react';
import { CityCulturalData } from '../../data/cities';
import {
  Compass,
  Landmark,
  BookOpen,
  MapPin,
  Footprints,
  X,
  Scroll,
} from 'lucide-react';

interface CityDetailModalProps {
  city: CityCulturalData;
  dynasty: 'tang' | 'song';
  isCurrentLocation: boolean;
  onTravelHere: (cityId: string) => void;
  onClose: () => void;
}

export const CityDetailModal: React.FC<CityDetailModalProps> = ({
  city,
  dynasty,
  isCurrentLocation,
  onTravelHere,
  onClose,
}) => {
  // 严格只读取当前朝代的信息，绝不混杂其他朝代！
  const dynastyData = dynasty === 'tang' ? city.tang : city.song;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-in fade-in">
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
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300"
            >
              已身在城中
            </button>
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
