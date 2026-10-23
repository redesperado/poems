---
name: mobile-app-compatibility
description: >-
  Use this skill whenever designing UI, writing frontend components, or setting up architecture
  for the poetry game to ensure full compatibility with future mobile App deployment (iOS/Android via Capacitor or React Native/Flutter WebView), responsive layouts, and touch interactions.
---

# 移动端 APP 兼容与响应式设计规范

本项目未来需无缝打包为移动端 APP（iOS / Android），在进行任何页面设计（如使用 Google Stitch）和前端编码时，必须严格遵守以下兼容性准则。

## 1. 视口与安全区域（Viewport & Safe Areas）

- **动态视口高度**：移动端避免单纯使用 `100vh`（会导致底部导航栏遮挡），统一采用 `100dvh` 或 CSS 变量动态计算：
  ```css
  min-height: 100dvh;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  ```
- **禁用移动端默认手势干扰**：
  - 阻止双击缩放：`touch-action: manipulation;`
  - 禁止页面非意图全局橡皮筋滚动（但在地图和时间轴容器内允许惯性滑动）。
  - 选中禁用：除诗词正文赏析外，UI 按钮与标签设置 `user-select: none;`。

## 2. 交互与触控目标（Touch Ergonomics）

- **最小点击热区**：所有交互控件（地图地点印章、时间轴标记、拼词选项、关闭按钮）点击热区不得小于 `44 × 44 pt`（约 48px）。
- **零 Hover 依赖**：所有关键玩法（气泡说明、诗词触发动效、拼词释义）必须基于 `Tap/Click` 显式触发，不得设计“悬停才能看见”的致命阻塞逻辑。
- **手势友好**：
  - 时间轴支持移动端单指左右平移（Swipe/Drag）；
  - 地图支持双指捏合缩放（Pinch-to-zoom）与单指拖拽。

## 3. 屏幕方向与适配策略（Orientation）

- **首选模式**：游戏具有横向时间轴与广阔水墨地图，推荐以**横屏沉浸体验（Landscape）**为主，或**自适应流式折叠（Responsive Breakpoints）**：
  - **宽屏/横屏（>= 768px）**：完整展开底部 80px 时间轴，右侧/左侧悬浮情绪条与人物状态。
  - **窄屏/竖屏（< 768px 手机直屏）**：时间轴自动收拢为折叠抽屉或底部吸底卡片，地图支持上下滑动查看历史轨迹。

## 4. APP 打包兼容技术路线

- 推荐采用 **Capacitor 6.x**：
  - 无需重构 Web 代码，将 Vite + React/Vue Web 应用一键打包为原生 iOS（Xcode）和 Android（Android Studio）应用。
  - 易于接入移动端原生 API（如触觉震动反馈 `Haptics` 增强墨滴落下手感、本地离线持久化存储）。
