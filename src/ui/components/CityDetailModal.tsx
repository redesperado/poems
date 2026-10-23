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
  const currentDynastyName = city.dynasty_names[dynasty] || city.name_cn;
  const currentRegion = city.administrative_region[dynasty];

  // 为各名城生成意境横幅色彩与纹理
  const getBannerGradient = () => {
    switch (city.landscape_banner_theme) {
      case 'changan_palace':
        return 'from-amber-700 via-orange-800 to-stone-900';
      case 'hangzhou_westlake':
        return 'from-emerald-700 via-teal-800 to-slate-900';
      case 'luoyang_peony':
        return 'from-rose-700 via-red-800 to-neutral-900';
      case 'yangzhou_moon':
        return 'from-indigo-800 via-purple-900 to-slate-950';
      case 'wuhan_crane':
        return 'from-amber-600 via-yellow-700 to-stone-900';
      case 'lushan_waterfall':
        return 'from-teal-700 via-emerald-800 to-slate-900';
      case 'baidi_gorge':
        return 'from-stone-700 via-emerald-900 to-slate-950';
      default:
        return 'from-teal-800 via-slate-800 to-stone-900';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-theme-surface-card/95 backdrop-blur-2xl border border-theme-border rounded-[2rem] shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden">
        {/* 1. 顶部特色山水意境横幅 (Hero Visual Banner) */}
        <div
          className={`relative h-44 sm:h-48 bg-gradient-to-br ${getBannerGradient()} p-6 text-white flex flex-col justify-between overflow-hidden shadow-md`}
        >
          {/* 水墨浮雕微纹与大字印鉴 */}
          <div className="absolute right-4 bottom-2 text-7xl sm:text-8xl font-serif text-white/10 select-none pointer-events-none font-bold">
            {city.name_cn}
          </div>

          {/* 顶栏关闭与行政区划微标 */}
          <div className="flex items-center justify-between z-10">
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 font-medium flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>{dynasty === 'tang' ? '唐代道制' : '两宋路制'}：{currentRegion}</span>
            </span>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 城市大标题与朝代历史更迭 */}
          <div className="z-10">
            <div className="flex items-baseline space-x-3">
              <h2 className="text-2xl sm:text-3xl font-bold font-poetry tracking-wide">
                {currentDynastyName}
              </h2>
              <span className="text-xs text-white/80 font-sans">
                (今 {city.name_modern})
              </span>
            </div>
            <p className="text-xs text-amber-200/90 font-poetry mt-1 line-clamp-1 italic">
              “{city.brief}”
            </p>
          </div>
        </div>

        {/* 2. 主体人文内容区域 */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          {/* 古今建置沿革 */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-start space-x-3">
            <Scroll className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">【古今地名沿革】：</span>
              大唐称「{city.dynasty_names.tang}」，两宋更名「{city.dynasty_names.song}」，今为{city.name_modern}。
            </div>
          </div>

          {/* 人文地理与历史渊源 */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-theme-primary flex items-center space-x-1.5">
              <Landmark className="w-4 h-4" />
              <span>【人文风骨与建置沿革】</span>
            </h4>
            <p className="text-xs text-theme-text leading-relaxed leading-6 indent-5">
              {city.humanities_history}
            </p>
          </div>

          {/* 历代文人传世名篇 */}
          {city.famous_poems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-theme-gold flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4" />
                <span>【千古吟咏 · 传世名篇】</span>
              </h4>
              <div className="space-y-2">
                {city.famous_poems.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-theme-surface rounded-xl border border-theme-border flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-theme-text font-poetry">
                          《{p.title}》
                        </span>
                        <span className="text-[10px] text-theme-text-muted">
                          [{p.author}]
                        </span>
                      </div>
                      <p className="text-xs text-theme-primary font-poetry mt-1">
                        “{p.verse}”
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 胜迹与物产 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/60 space-y-1">
              <span className="font-bold text-gray-700">🏛 名胜古迹：</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {city.scenic_spots.map((spot, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600"
                  >
                    {spot}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/60 space-y-1">
              <span className="font-bold text-gray-700">🍵 特色风物：</span>
              <p className="text-[11px] text-gray-600 mt-1">{city.local_specialty}</p>
            </div>
          </div>
        </div>

        {/* 3. 底部游历操作栏 */}
        <div className="p-4 border-t border-theme-border/60 bg-theme-surface flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-theme-text-muted">
            <MapPin className="w-4 h-4 text-theme-primary" />
            <span>
              {isCurrentLocation
                ? '诗人当前正驻足于此'
                : '天下山河，心之所向皆可亲历'}
            </span>
          </div>

          {isCurrentLocation ? (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300"
            >
              已身在城中
            </button>
          ) : (
            <button
              onClick={() => {
                onTravelHere(city.id);
                onClose();
              }}
              className="px-6 py-2 rounded-full bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center space-x-1.5"
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
