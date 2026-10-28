// =========================================================================
// 国风 Web Audio 轻量声音引擎与名篇古韵诵读控制器 (soundEngine.ts)
// 零外部资源依赖，100% 本地即时响应，兼容现代浏览器自主静音与无障碍支持
// =========================================================================

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    // 读取持久化静音设置
    try {
      const savedMute = localStorage.getItem('tang_song_game_muted');
      this.isMuted = savedMute === 'true';
    } catch {
      this.isMuted = false;
    }
  }

  // 初始化或激活 AudioContext (遵循现代浏览器用户手势激活策略)
  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch (e) {
      console.warn('AudioContext init failed:', e);
      return null;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('tang_song_game_muted', String(muted));
    } catch {
      // ignore
    }
    if (muted) {
      this.stopPoemSpeech();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // -----------------------------------------------------------------------
  // 1. 拟真音效：清脆玉磬声 (推敲答对 / 到达城池 / 达成高光成就)
  // -----------------------------------------------------------------------
  public playJadeChime(frequency = 659.25) { // 默认 E5 (高雅天青)
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // 基频与泛音双振荡器合成玉石清响
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(frequency, now);

      // 上五度泛音 (模拟编钟/玉磬金属微鸣)
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 1.5, now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.25);
      osc2.stop(now + 1.25);
    } catch {
      // 容错降级
    }
  }

  // -----------------------------------------------------------------------
  // 2. 拟真音效：墨汁浸润落纸声 (填词落子 / 按钮交互)
  // -----------------------------------------------------------------------
  public playInkDab() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // 容错降级
    }
  }

  // -----------------------------------------------------------------------
  // 3. 拟真音效：顺水行舟水流泛波声 (水路游历)
  // -----------------------------------------------------------------------
  public playWaterWave() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // 用低通滤波白噪声模拟柔和浪花拍岸
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.linearRampToValueAtTime(540, now + 0.4);
      filter.frequency.linearRampToValueAtTime(280, now + 0.8);
      filter.Q.setValueAtTime(2.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.35);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.82);
    } catch {
      // 容错
    }
  }

  // -----------------------------------------------------------------------
  // 4. 拟真音效：策马驿道疾蹄声 (陆路游历)
  // -----------------------------------------------------------------------
  public playHorseGallop() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // 模拟马蹄节奏 (嗒嗒-嗒嗒)
      const times = [0, 0.08, 0.22, 0.30];
      times.forEach((t) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, now + t);
        osc.frequency.exponentialRampToValueAtTime(45, now + t + 0.05);

        gain.gain.setValueAtTime(0.06, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + 0.055);
      });
    } catch {
      // 容错
    }
  }

  // -----------------------------------------------------------------------
  // 5. 拟真音效：战鼓低鸣 (安史之乱/时代危机爆发)
  // -----------------------------------------------------------------------
  public playWarDrum() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.75);
    } catch {
      // 容错
    }
  }

  // -----------------------------------------------------------------------
  // 6. 名篇古韵吟诵 (Web Speech API 诗词逐句诵读)
  // -----------------------------------------------------------------------
  public isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public isSpeaking(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }

  public stopPoemSpeech() {
    if (this.isSpeechSupported()) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  public speakPoem(
    _poemTitle: string,
    lines: string[],
    options?: {
      poetDynasty?: 'tang' | 'song';
      poetId?: string;
      onLineStart?: (lineIndex: number) => void;
      onEnd?: () => void;
    }
  ) {
    if (!this.isSpeechSupported() || this.isMuted) {
      options?.onEnd?.();
      return;
    }

    this.stopPoemSpeech();

    const voices = window.speechSynthesis.getVoices();
    // 优先寻找高品质普通话中文声音
    const zhVoice =
      voices.find((v) => v.lang === 'zh-CN' && (v.name.includes('Natural') || v.name.includes('Xiaoxiao') || v.name.includes('Yunxi') || v.name.includes('Chinese'))) ||
      voices.find((v) => v.lang.startsWith('zh')) ||
      null;

    let currentIdx = 0;

    const speakNextLine = () => {
      if (currentIdx >= lines.length) {
        options?.onEnd?.();
        return;
      }

      const rawText = lines[currentIdx].trim();
      if (!rawText) {
        currentIdx++;
        speakNextLine();
        return;
      }

      options?.onLineStart?.(currentIdx);

      // 李清照采用稍轻灵悠远的音调，李白苏轼采用从容豪旷的语速
      const isFemale = options?.poetId === 'li_qingzhao';
      const pitch = isFemale ? 1.15 : 0.92;
      const rate = isFemale ? 0.82 : 0.8;

      const utterance = new SpeechSynthesisUtterance(rawText);
      if (zhVoice) utterance.voice = zhVoice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = 'zh-CN';

      utterance.onend = () => {
        currentIdx++;
        // 诗行间留有 350ms 古韵余白断句
        setTimeout(() => {
          if (window.speechSynthesis.speaking || currentIdx <= lines.length) {
            speakNextLine();
          }
        }, 360);
      };

      utterance.onerror = () => {
        currentIdx++;
        speakNextLine();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    };

    // 播报前轻敲玉磬起调
    this.playJadeChime(523.25);
    setTimeout(() => {
      speakNextLine();
    }, 400);
  }
}

export const soundEngine = new SoundEngine();
