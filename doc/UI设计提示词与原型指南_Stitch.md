# 唐宋诗人游历游戏 — UI 原型设计与 Google Stitch 提示词指南

> **文档定位**：本文档沉淀本项目在 UI/UX 设计、移动端 APP 适配、以及使用 **Google Stitch (stitch.withgoogle.com)** 进行原型生成时所需的核心设计规范、现代中式（新东方）视觉体系、中英提示词库与迭代资产。  
> **设计主张**：**“新东方·春生”风格（Neo-Oriental Spring）**——打破陈旧死板的传统泛黄水墨古风，大胆拥抱当代极简美学、充满生机的春日青绿光谱，深度融合唐宋器物弧线（海棠纹、葵口、飞檐弧线、月门洞）打造非四方框形态的有机界面。  
> **更新机制**：随项目开发与页面设计持续更新留存。

---

## 目录
1. [设计系统基础：新东方·春生（Neo-Oriental Spring Design Tokens）](#一设计系统基础新东方春生neo-oriental-spring-design-tokens)
2. [唐宋朝代意象与非直角形态规范（Organic & Dynastic Contours）](#二唐宋朝代意象与非直角形态规范organic--dynastic-contours)
3. [移动端 APP 触控与现代交互准则](#三移动端-app-触控与现代交互准则)
4. [Google Stitch 5 大核心界面全新提示词库（即拷即用）](#四google-stitch-5-大核心界面全新提示词库即拷即用)
   - [界面 1：游历大地图与生命历程时间轴主屏](#1-游历大地图与生命历程时间轴主屏main-travel-map--timeline)
   - [界面 2：诗词拼组与灵感填空界面](#2-诗词拼组与灵感填空界面poem-assembly-interface)
   - [界面 3：人生岔路抉择幕帘弹窗](#3-人生岔路抉择幕帘弹窗life-choice-modal)
   - [界面 4：诗词多宝典藏馆](#4-诗词多宝典藏馆collection-gallery)
   - [界面 5：诗友唱和与青瓷书信界面](#5-诗友唱和与青瓷书信界面poetic-exchange)
5. [Stitch 导出资产与前端工程对接规范](#五stitch-导出资产与前端工程对接规范)
6. [更新日志与留存记录](#六更新日志与留存记录)

---

## 一、设计系统基础：新东方·春生（Neo-Oriental Spring Design Tokens）

跳出传统“泛黄宣纸 + 沉闷老旧水墨”的刻板印象，以**生机勃勃的春日生命力**为核心基调。将**现代毛玻璃（Glassmorphism）、微渐变光晕与极简留白**同古典诗意融为一体：

### 1. 核心色彩体系（Spring Neo-Chinese Palette）
| 角色 | 色彩名称 | 色值 (Hex) | 现代设计与情绪隐喻 |
| :--- | :--- | :--- | :--- |
| **画布底色** | 晨露白 / 极光玉冷白 | `#F6F9F5` | 极高明度微绿冷白，如晨雾初散，摒弃发黄陈旧感，通透现代 |
| **主基调·生机** | 新柳翠 / 春水碧 | `#10B981` / `#059669` | 核心品牌色，代表早春嫩芽与初涨春水，充满生机与求索活力 |
| **辅色·润玉** | 晴空青瓷 / 秘色 | `#0D9488` / `#14B8A6` | 取自唐宋秘色瓷与越窑青翠，用于组件强调色、导航与徽章 |
| **高光·朝曦** | 春阳暖金 / 麦芒黄 | `#F59E0B` / `#FBBF24` | 诗词触发、灵感顿悟、成就获得的高光点缀，暖意拂面 |
| **破色·春桃** | 桃夭粉 / 杏花薄红 | `#F472B6` / `#FDA4AF` | 极小面积点缀，象征春花绽放、情绪波动与诗意灵性，增强视觉层次 |
| **正文·黑石** | 曜岩墨黑 / 现代黛 | `#0F172A` / `#18181B` | 极高对比度的冷灰墨黑，现代排版清晰利落，无晕染拖沓感 |
| **次级文本** | 苍青灰 / 晨雾灰 | `#475569` / `#64748B` | 注释、译文、时间轴刻度，层次分明 |
| **容器质感** | 玉质微透毛玻璃 | `rgba(255,255,255,0.78)` | `backdrop-blur-md`，搭配 `1px solid rgba(16,185,129,0.18)` 翠玉光边 |

### 2. 现代视觉质感与光影
- **通透毛玻璃（Neo-Glassmorphism）**：组件如漂浮在春水上的浮萍与玉片，利用微透磨砂玻璃反射春色背景。
- **微光羽化晕染**：取消粗重的毛笔黑墨边缘，代之以 `blur-2xl` 的淡绿/浅金柔光粒子，模拟春意盎然的诗意氛围。
- **微触感阴影**：`box-shadow: 0 10px 30px -10px rgba(16, 185, 129, 0.12)`，轻盈现代，毫无陈旧压迫感。

---

## 二、唐宋朝代意象与非直角形态规范（Organic & Dynastic Contours）

页面组件**彻底告别死板的四方四正直角盒子**。提炼唐宋代表性器物、园林、建筑中的标志性轮廓，融入现代 UI 的形状系统中：

```
      [ 唐代·菱花/海棠形 ]                 [ 宋代·葵口瓷瓣形 ]               [ 飞檐/月洞门微弧 ]
          ╭───╮  ╭───╮                         ╭─╮   ╭─╮                    ╭───────────────╮
        ╭╯     ╰╯     ╰╮                     ╭─╯ ╰─┬─╯ ╰─╮                 (                 )
        │              │                    │     │     │                  ╰───────────────╯
        ╰╮     ╭╮     ╭╯                     ╰─╮ ╭─┴─╭ ╭─╯                 底部微弧 / 顶部流线
          ╰───╯  ╰───╯                         ╰─╯   ╰─╯
       (头像框 / 独立勋章)                  (拼词选项按键 / 卡片)             (时间轴托盘 / 弹窗底座)
```

### 1. 典型轮廓元素库与应用场景

1. **唐代海棠形 / 菱花弧（Tang Begonia & Lobed Mirror Contour）**：
   * **形态特征**：四瓣或八瓣对称的外凸柔和圆弧，源于唐代菱花铜镜与金银盏托。
   * **适用组件**：诗人头像框、主交互印章按钮、触发事件提示 Badge、成就徽章底托。
   * **实现方式**：CSS `clip-path` 或 SVG 矢量蒙版包裹，外覆细翠色微光描边。
2. **宋瓷葵口 / 花瓣折沿（Song Celadon Lobed Petal Contour）**：
   * **形态特征**：借鉴宋代龙泉窑、汝窑盘碟的葵花瓣口，边缘带有轻微凹凸的波浪流线。
   * **适用组件**：**诗词填空选项卡（Choice Cards）**——每个词语不再是呆板矩形，而是一枚轻巧精致的“葵花玉牌”，触按时带下沉微动。
3. **飞檐起翘与月洞门穹顶（Sweeping Eave & Moon-gate Arch）**：
   * **形态特征**：顶部呈大半径优雅上凸弧线（模拟唐代大明宫飞檐），底部利落收口；或一端大圆角、一端微翘。
   * **适用组件**：底部 80px 时间轴托盘、人生岔路 Bottom Drawer、诗词赏析展开卷屏。
4. **流体春水与曲水流觞（Fluid Organic Meander）**：
   * **形态特征**：不规则平滑有机流线（`border-radius: 60% 40% 50% 50% / 40% 50% 60% 50%`）。
   * **适用组件**：右侧 5 维情绪雷达/水滴仪表盘、大地图浮动标记。

---

## 三、移动端 APP 触控与现代交互准则

1. **大热区异形按键（Ergonomic Touch Targets）**：
   * 虽然视觉上是灵动的葵花形或海棠形，但**逻辑点击感应区（Hitbox）**必须保持不低于 `48 × 48 px`，杜绝边缘误触。
2. **春水波纹触控反馈（Spring Water Ripple）**：
   * 点击任意选项卡或地点印记时，触发向外扩散的浅翠色微光波纹动效（Ripple），辅以轻微触觉震动反馈（Haptic Light Impact）。
3. **无障碍与横竖屏响应（Orientation Freedom）**：
   * **横屏（沉浸模式）**：春江水墨大地图横向铺开，底部飞檐时间轴一览无余。
   * **竖屏（随身单手模式）**：时间轴自动贴底变为半透月门抽屉，顶部保留海棠形诗人状态，交互体验媲美现代潮流 App。

---

## 四、Google Stitch 5 大核心界面全新提示词库（即拷即用）

> **使用方法**：打开 [stitch.withgoogle.com](https://stitch.withgoogle.com/)，创建新画布，直接将下方的**英文 Prompt**复制粘贴生成界面原型。

### 1. 游历大地图与生命历程时间轴主屏（Main Travel Map & Timeline）
* **设计特征**：现代春日极简冷白底色，晨光微亮，翠绿生机，告别泛黄古纸。顶部海棠形诗人头像，右侧玉质水滴情绪球，底部飞檐微弧半透明时间轴。
* **复制用 Prompt**：
```text
Create a modern, fresh, mobile-friendly game main screen for a Chinese Tang Dynasty poetry adventure game.
Design Aesthetic: "Neo-Chinese Spring Vitality" (新东方·春生). Vibrant, clean, airy modern aesthetic with fresh spring energy.
Background: Ultra-clean misty morning-dew off-white canvas (#F6F9F5) with subtle luminous watercolor gradients in spring emerald (#10B981) and celadon jade (#0D9488). NOT yellowish vintage parchment.
Top Bar:
- Left: Poet avatar (Li Bai) framed in an authentic Tang Dynasty 4-lobed begonia flower contour (海棠形), displaying poet name, current year "726 AD", and location "Lushan".
- Right: A floating frosted-glass droplet widget (backdrop-blur-md) displaying 5 mood dimensions (Passion, Sorrow, Freedom, Anger, Homesickness) with glowing fresh emerald and golden progress lines.
Center Map Area: A minimalist modern artistic map of Tang China. Emerald river paths, soft misty mountain silhouettes, and modern jade-seal pinpoints marking Chang'an, Luoyang, and Lushan with gentle breathing glow.
Bottom Timeline Dock: A floating glassmorphism bar with a gentle sweeping eave-curved top contour (inspired by Tang palace architecture). Shows horizontal scrollable life timeline with glowing golden stars for poetry nodes, jade circles for personal events, and rose-petal alerts for crises.
Clean, modern typography, zero visual clutter, refreshing spring vibes.
```

### 2. 诗词拼组与灵感填空界面（Poem Assembly Interface）
* **设计特征**：全屏春日飞瀑水汽微光，半透明玉质悬浮屏风，非矩形的“宋瓷葵口花瓣”拼词选项卡，清脆温润。
* **复制用 Prompt**：
```text
Design a modern poetry creation & word-assembly interface for a mobile cultural game.
Style: Fresh Neo-Oriental aesthetic, high-end minimal zen with lively spring green tones.
Background: Modern atmospheric scenic background of Mount Lu waterfall with spring sunlight refraction and misty emerald spray.
Center Display: A floating frosted translucent glass panel with soft arched top corners (moon-gate shape). Inside, modern vertical Chinese typography shows: "日照香炉[ ? ]紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。".
Missing Character Slot: An organic glowing amber-gold outline that pulses softly.
Bottom Choice Cards: 4 interactive answer plaques (A: 生, B: 起, C: 飘, D: 吐). CRITICAL: The cards are NOT rigid rectangles; they feature elegant Song Dynasty celadon lobed-petal contours (葵口花瓣形) with smooth jade-like touch surfaces and subtle emerald border glow.
Bottom Feedback Drawer: A sleek bottom sheet sliding up on selection, providing poetic pedagogical explanations in clean modern serif font with a minimalist cinnabar seal confirmation.
```

### 3. 人生岔路抉择幕帘弹窗（Life Choice Modal）
* **设计特征**：现代折扇/月亮门流线蒙版弹窗，告别老旧木框。两个大型异形抉择磁贴，左侧历史正史（翠玉光），右侧平行历史（晴空青与微粉光）。
* **复制用 Prompt**：
```text
Design a dramatic story-branching choice popup modal for a mobile historical narrative game.
Visual Tone: Modern Neo-Chinese aesthetic, fresh spring palette (#10B981, #0D9488, with subtle warm peach blossom accents).
Modal Shape: A contemporary floating dialog with a distinctive curved arch top (Chinese garden moon-gate arch contour), framed with ultra-thin glowing celadon borders and deep backdrop blur.
Header: Modern bold calligraphy title: "Emperor's Decree (742 AD) - The Call to Chang'an".
Story Context: 2 sentences describing the historical dilemma of freedom versus imperial ambition.
Choice Options: Two prominent interactive choice cards featuring organic curved silhouettes (asymmetric soft petal shapes):
- Option 1 (Historical Truth): "Enter the Court as Hanlin Scholar" marked with a glowing jade seal, showing mood impact (+Passion, -Freedom).
- Option 2 (Parallel Destiny): "Decline the Decree & Wander Free" accented with morning dew turquoise, revealing alternate poetry paths.
Footer: "Every choice reshapes history and your poetic spirit." Touch-friendly, sleek, contemporary.
```

### 4. 诗词多宝典藏馆（Collection Gallery）
* **设计特征**：现代东方生活美学展厅，极简展台陈列。收藏卡片结合海棠纹与现代卡片，金色印章评级（甲/乙）。
* **复制用 Prompt**：
```text
Design a modern "Poetry Collection Gallery" (典藏阁) screen for a mobile poetry game.
Layout & Vibe: Contemporary Oriental art gallery aesthetic. Clean bright off-white interior background (#F6F9F5) with soft emerald bamboo shadows.
Shelf Structure: Asymmetrical modern geometric curio grid (新中式博古架) displaying unlocked poetry scrolls.
Scroll Items: Each poem card has a unique silhouette—curved top corners with a subtle Song porcelain lobed rim. Shows miniature modern ink illustration, vertical title ("望庐山瀑布", "静夜思"), and an exquisite modern red seal stamp indicating achievement rank.
Interactivity: Tapping a card expands it into a sleek full-screen card with audio recitation wave, modern Chinese translation, and historic trivia.
Crisp typography, airy whitespace, sophisticated and energetic.
```

### 5. 诗友唱和与青瓷书信界面（Poetic Exchange）
* **设计特征**：折叠信笺与现代对话流融合，信纸带有春天柳叶与暗花水纹，底部 3 种回复采用圆润鹅卵石/葵花片形状选项。
* **复制用 Prompt**：
```text
Design a poetic correspondence and friendship screen between Tang Dynasty poets (Li Bai & Du Fu).
Style: Fresh Neo-Chinese, spring breeze and friendship theme.
Screen Layout: A modern mobile messaging interface reimagined as traditional stationery.
Center Card: A floating letter paper with a translucent celadon green tint (#F0FDF4), decorated with faint spring willow watermark. Features Du Fu's handwritten poem and a personalized inscription.
Top Status: Friendship intimacy gauge designed as a pair of intertwining jade rings (showing "Intimate Friends / 知己 85%").
Bottom Reply Section: 3 poetic response options styled as smooth organic river-pebble or lobed-leaf buttons, clearly previewing friendship point changes (+20 知己亲密度) and mood shifts.
Warm, uplifting, artistic, modern mobile interface.
```

---

## 五、Stitch 导出资产与前端工程对接规范

1. **Tailwind 色彩扩展（`tailwind.config.js`）**：
   * 将上述全新“新东方·春生”色板直接注入 Tailwind 变量：
     ```js
     theme: {
       extend: {
         colors: {
           spring: {
             dew: '#F6F9F5',      // 晨露白 (Canvas)
             sprout: '#6EE7B7',   // 嫩芽绿
             emerald: '#10B981',  // 春水碧 (Primary)
             deep: '#059669',     // 苍翠 (Brand)
             celadon: '#0D9488',  // 晴空青瓷
             gold: '#F59E0B',     // 暖阳金 (Inspiration)
             peach: '#F472B6',    // 桃夭粉 (Accent)
             ink: '#0F172A',      // 曜岩墨 (Text)
           }
         }
       }
     }
     ```
2. **异形剪裁与 SVG 蒙版支持**：
   * 针对海棠形与葵口，封装通用的 CSS 样式类与 SVG `clipPath`，确保各页面按钮、卡片无需额外切大图即可保持矢量非直角形态。
3. **触觉反馈注入**：
   * 移动端（Capacitor）点击非直角葵花按键时，绑定轻柔微震动（`Haptics.impact({ style: ImpactStyle.Light })`），模拟玉石相击的手感。

---

## 六、更新日志与留存记录

| 版本 | 日期 | 更新内容说明 | 记录人 |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-09-24 | 建立基础文档；初版传统泛黄水墨 Design Tokens 与 5 大核心界面 Stitch 提示词库。 | Antigravity AI |
| **v1.1** | 2026-10-23 | **UI 视觉体系重大重构**：全面转向“新东方·春生”现代风格（晨露白底、春水碧与青瓷光谱、毛玻璃与生机光晕）；打破死板直角，引入唐代海棠形、宋瓷葵口、飞檐弧线等朝代异形轮廓系统；全面重写 5 大 Stitch 英文 Prompt 库与 Tailwind 配置。 | Antigravity AI |
