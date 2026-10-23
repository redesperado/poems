export type LocationType = 'city' | 'landmark' | 'pass' | 'palace' | 'hidden';

export interface LocationData {
  id: string;
  name_cn: string;
  name_modern: string;
  coordinates: [number, number]; // [纬度, 经度]
  mapPosition: { x: number; y: number }; // 百分比位置 (0-100) 供地图渲染
  type: LocationType;
  dynasty_names: {
    tang: string;
    song: string;
    [dynasty: string]: string;
  };
  description: string;
  mood_on_arrive?: Partial<Record<string, number>>;
  connected_to: string[];
}
