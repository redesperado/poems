---
name: poetry-game-engine
description: >-
  Use this skill to implement, modify, or verify the core gameplay loop and systems of the Tang-Song poetry game,
  including MoodSystem (5 dimensions), PoemAssembly (4-option blanks & pedagogical explanations),
  TravelSystem (locations & route rendering), LifeChoice (historical branching), and CollectionSystem.
---

# 唐宋诗人游历游戏核心系统与规则规范

根据 `doc/GDD_唐宋诗人游戏.md`，游戏核心循环由六步驱动：
**做出选择 -> 游历地图 -> 情绪积累 -> 诗词触发 -> 拼词创作 -> 揭秘收藏**。

## 1. 情绪驱动系统（Mood System）

情绪由 5 维构成，取值范围 `0 ~ 100`，默认基准值为 50（李白初始设定见数据表）：
- `passion` (豪情)
- `sorrow` (忧思)
- `freedom` (洒脱)
- `anger` (愤懑)
- `homesickness` (乡愁)

**衰减机制**：每当推进 1 个游戏月，所有远离 50 的维度自动向 50 靠拢（每月 ±2）。

## 2. 诗词触发判定（Trigger Engine）

系统在每一步游历或事件后判定条件：
```typescript
interface TriggerCondition {
  location_id: string;
  mood: {
    [key in 'passion' | 'sorrow' | 'freedom' | 'anger' | 'homesickness']?: { min?: number; max?: number };
  };
  year_range?: [number, number];
  time_of_day?: 'day' | 'night' | 'any';
  requires_event?: string;
}
```
满足触发条件时，地图对应点产生**金色水墨涟漪动画**，点击后进入创作场景。

## 3. 诗词拼组系统（Poem Assembly Rules）

- **选项构造**：每处填空 4 个选项（A/B/C/D），混杂形近字、同义字、押韵字与意反字。
- **逐项教学**：对每个错误选项必须有单独的文学解析（如“起”字为什么不如“生”字有自然生腾的壮阔感）。
- **无阻断机制**：连续错选 3 次后提供“跳过并看题解”按钮，保证叙事流畅进行。
- **评分体系**：1次正确=100分；2次=75分；3次及以上/跳过=50分。

## 4. 时代洪流（Historical Crisis）

特定年份（如 755 年安史之乱）触发全屏历史动效，强制修改地图通行路线（北方路线关闭），并强制大幅修正所有诗人情绪值。
