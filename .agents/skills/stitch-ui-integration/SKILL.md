---
name: stitch-ui-integration
description: >-
  Use this skill when designing UI with Google Stitch (stitch.withgoogle.com) or converting
  Stitch-generated UI layouts, HTML, Tailwind CSS, or React components into the poetry game.
---

# Google Stitch UI 原型设计与对接规范（新东方·春生风格）

本项目采用 **Google Stitch (stitch.withgoogle.com)** 进行 UI/UX 的前期设计与原型构建。

## 1. Stitch 设计系统统一词典（Design Tokens for Stitch）

在给 Google Stitch 发送设计指令时，始终附带以下设计语言关键词，杜绝陈旧泛黄的刻板古风，拥抱当代极简与生机春色：

```text
Style: Modern Neo-Chinese aesthetic ("新东方·春生"), airy, vibrant spring vitality, zen minimalism with high-end tech polish.
Background: Ultra-clean morning-dew off-white canvas (#F6F9F5) with soft luminous emerald gradients (#10B981, #0D9488). NOT yellowish antique paper.
Palette:
- Spring Emerald & Jade (#10B981, #059669): Primary brand color, full of life and wandering spirit.
- Celadon Glaze (#0D9488, #14B8A6): Secondary accent, navigation bars, and delicate badges.
- Sunlight Gold (#F59E0B): Highlights, poetry trigger stars, and inspiration moments.
- Peach Blossom Pink (#F472B6): Subtle romantic accent for seasonal contrast.
- Modern Obsidian Ink (#0F172A): High-contrast crisp text typography.
Component Shapes & Contours:
- Tang Begonia floriform (海棠形 / 菱花) for avatars, seals, and achievement badges.
- Song Dynasty celadon lobed petals (葵口花瓣形) for choice plaques and buttons (NO rigid rectangles).
- Sweeping eave and moon-gate curves for bottom timeline docks and modal drawers.
- Glassmorphism (backdrop-blur-md) with glowing jade borders (1px solid rgba(16,185,129,0.18)).
Target: Mobile-first responsive layout (support phone landscape/portrait and tablets).
```

## 2. 需在 Stitch 中设计的 5 大核心界面清单（详见 doc/UI设计提示词与原型指南_Stitch.md）

1. **Screen 1: 游历大地图主界面（Main Travel Map & Timeline）**
   - 包含：海棠形诗人状态头像、晨露白水墨极简地图、玉滴 5 维情绪仪表、飞檐弧线半透时间轴。
2. **Screen 2: 诗词拼组与灵感填空界面（Poem Assembly Interface）**
   - 包含：春日飞瀑水汽底图、悬浮玉质微透诗屏、宋瓷葵口花瓣拼词选项卡（A/B/C/D）、升起式解析抽屉。
3. **Screen 3: 人生岔路抉择幕帘弹窗（Life Choice Modal）**
   - 包含：月洞门弧顶弹窗、两枚非对称有机流线选项磁贴（历史正史翠玉 vs 平行路线青粉）。
4. **Screen 4: 诗词多宝典藏阁（Collection Gallery）**
   - 包含：新中式博古多宝陈列架、葵口折沿诗词画卷卡、音频朗诵波形与赏析。
5. **Screen 5: 诗友唱和与青瓷书信界面（Poetic Exchange）**
   - 包含：淡青瓷折叠水纹信笺、李杜玉环知己亲密度计、鹅卵石/叶形回复选项。

## 3. Stitch 导出物接入项目的流程

1. **提取组件结构**：从 Stitch 导出的 React / HTML / Tailwind 代码中，将静态展示层与业务逻辑解耦。
2. **连接状态管理器**：接入 `GameState`（将情绪条绑定到 `mood` 状态，将时间轴绑定到 `currentYear`）。
3. **注入交互音效与触觉反馈**：移动端注入轻微震动（Haptics Light Impact），配合春水波纹扩散动效。
