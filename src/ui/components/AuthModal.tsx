import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  KeyRound,
  Dice5,
  Award,
  Compass,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Feather,
  Scroll,
} from 'lucide-react';
import { UserAccount, INITIAL_USER_ACCOUNTS } from '../../types/userStudio';
import { StoneSealStamp } from './StoneSealStamp';
import { apiClient } from '../../services/api/client';
import { soundEngine } from '../../engine/audio/soundEngine';

interface AuthModalProps {
  isOpen: boolean;
  currentUser?: UserAccount;
  onSuccess: (user: UserAccount) => void;
  onClose: () => void;
}

const LITERARY_AVATARS = [
  { icon: '📜', label: '诗书经卷' },
  { icon: '🪶', label: '太白羽冠' },
  { icon: '🍵', label: '东坡香茗' },
  { icon: '⚔️', label: '青锋宝剑' },
  { icon: '🍶', label: '春酒金樽' },
  { icon: '🌸', label: '溪亭桃花' },
  { icon: '🌊', label: '大江东去' },
  { icon: '🎋', label: '竹林高士' },
  { icon: '🏔️', label: '泰山极顶' },
  { icon: '🪕', label: '焦尾古琴' },
  { icon: '🌙', label: '床前明月' },
  { icon: '🍂', label: '江湖游子' },
];

const RANDOM_PEN_NAMES = [
  '沧浪客',
  '漱玉词人',
  '烟波钓叟',
  '放翁门生',
  '白云山人',
  '孤舟蓑笠',
  '玉壶冰心',
  '临江仙客',
  '醉翁之友',
  '枕石卧云',
  '竹林隐者',
  '松溪墨客',
  '清风引客',
  '西湖醉客',
  '赤壁渔樵',
  '长平布衣',
];

const ASPIRATIONS = [
  { id: 'romantic', title: '豪放奔逸', desc: '追慕太白东坡，斗酒百篇，笑看山河万朵' },
  { id: 'realistic', title: '沉郁博爱', desc: '承袭少陵悲悯，胸怀广厦，笔落惊风动雨' },
  { id: 'graceful', title: '清婉灵慧', desc: '寄意易安溪亭，赌茶泼墨，字字金石清霜' },
  { id: 'zen', title: '达观隐逸', desc: '泛舟五湖风月，竹杖芒鞋，一蓑烟雨平生' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  currentUser,
  onSuccess,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'guest'>('login');

  // 现有用户列表（用于快速切换与推荐）
  const [availableUsers, setAvailableUsers] = useState<UserAccount[]>(INITIAL_USER_ACCOUNTS);

  // 登录表单
  const [loginAccount, setLoginAccount] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 注册表单
  const [regPenName, setRegPenName] = useState('沧浪客');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🪶');
  const [selectedAspiration, setSelectedAspiration] = useState('romantic');

  // 交互与提示
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg('');
    apiClient.getUsers().then((list) => {
      if (list && list.length > 0) {
        setAvailableUsers(list);
      }
    });
  }, [isOpen]);

  if (!isOpen) return null;

  // 随机取名
  const handleRandomName = () => {
    const randomPick = RANDOM_PEN_NAMES[Math.floor(Math.random() * RANDOM_PEN_NAMES.length)];
    setRegPenName(randomPick);
    if (!regUsername) {
      setRegUsername(`usr_${Date.now().toString().slice(-4)}`);
    }
  };

  // 执行登录
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const account = loginAccount.trim();
    if (!account) {
      setErrorMsg('请填写您的文人雅号或通行账号');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const user = await apiClient.login(account, loginPassword || undefined);
      if (user) {
        soundEngine.playJadeChime();
        onSuccess(user);
        onClose();
      } else {
        setErrorMsg('未寻得该文人牒印，请核验雅号或切换至“题名结契”新建');
      }
    } catch {
      setErrorMsg('登临验证受阻，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 点击快速登临候选卡片
  const handleQuickLogin = async (user: UserAccount) => {
    setIsLoading(true);
    try {
      const logged = await apiClient.login(user.username);
      soundEngine.playJadeChime();
      onSuccess(logged || user);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // 执行注册新雅号
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const penName = regPenName.trim();
    if (!penName) {
      setErrorMsg('请题写您的文人雅号');
      return;
    }

    const username = regUsername.trim() || `usr_${Date.now().toString().slice(-6)}`;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const newUser = await apiClient.register({
        username,
        penName,
        password: regPassword || undefined,
        avatarIcon: selectedAvatar,
        rankTitle: '童生初入',
      });

      soundEngine.playJadeChime();
      onSuccess(newUser);
      onClose();
    } catch {
      setErrorMsg('结契入道受阻，请换个雅号重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 游客试玩
  const handleGuestPlay = () => {
    const guestUser = availableUsers.find((u) => u.username === 'guest_walker') || {
      id: 'user_guest',
      username: 'guest_walker',
      penName: '江湖游子 (游客)',
      avatarIcon: '🍂',
      rankTitle: '秀才',
      level: 2,
      exp: 800,
      maxExp: 1500,
      stats: { travelYears: 1, poemsStudied: 3, artifactsCollected: 2, notesCount: 1 },
      createdAt: '今日初入',
    };
    apiClient.setUserId(guestUser.id);
    soundEngine.playJadeChime();
    onSuccess(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-xl bg-theme-canvas border-2 border-theme-border rounded-3xl shadow-2xl overflow-hidden flex flex-col font-poetry text-theme-text transition-colors duration-300 max-h-[92vh]">
        {/* ================================================================= */}
        {/* 1. 顶部额楣：雅士登临阁                                            */}
        {/* ================================================================= */}
        <div className="px-6 py-4 border-b border-theme-border bg-theme-surface-card flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center text-theme-primary text-xl shadow-xs">
              🏛️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-theme-text tracking-wide">
                  雅士登临阁 · 鉴印入牒
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-theme-primary/10 border border-theme-primary/20 text-theme-primary font-bold">
                  云端谱牒
                </span>
              </div>
              <p className="text-xs text-theme-text-muted mt-0.5">
                一纸文牒，系连千古盛唐与两宋山河
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-theme-surface hover:bg-theme-border/40 border border-theme-border flex items-center justify-center text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* 2. 模式切换标签 Tab (凭牒登临 / 题名结契 / 江湖泛舟)                   */}
        {/* ================================================================= */}
        <div className="px-6 border-b border-theme-border bg-theme-surface-card/60 flex space-x-2 sm:space-x-6 text-sm shrink-0">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`py-3 flex items-center space-x-1.5 border-b-2 font-medium transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'border-theme-primary text-theme-primary font-bold'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>凭牒登临 (登录)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
            }}
            className={`py-3 flex items-center space-x-1.5 border-b-2 font-medium transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'border-theme-primary text-theme-primary font-bold'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <Feather className="w-4 h-4" />
            <span>题名结契 (新建雅号)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('guest');
              setErrorMsg('');
            }}
            className={`py-3 flex items-center space-x-1.5 border-b-2 font-medium transition-all cursor-pointer ${
              activeTab === 'guest'
                ? 'border-theme-primary text-theme-primary font-bold'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>江湖泛舟 (访客游历)</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* 3. 错误信息横幅                                                   */}
        {/* ================================================================= */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center space-x-2 animate-fadeIn shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. 核心交互内容区                                                 */}
        {/* ================================================================= */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-theme-canvas">
          {/* TAB 1: 凭牒登临 (登录模式) */}
          {activeTab === 'login' && (
            <div className="space-y-6 max-w-md mx-auto animate-fadeIn">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-theme-text mb-1.5">
                    文人雅号 / 通行账号
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="输入您的文人雅号（如：青莲墨客）"
                      value={loginAccount}
                      onChange={(e) => setLoginAccount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text text-sm focus:outline-none focus:border-theme-primary transition-colors pl-10"
                    />
                    <User className="w-4 h-4 text-theme-text-muted absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-text mb-1.5 flex items-center justify-between">
                    <span>密押凭信（密码，可留空体验）</span>
                    <span className="text-[10px] text-theme-text-muted font-normal">留空即直接鉴印</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="若设置过密押请键入"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text text-sm focus:outline-none focus:border-theme-primary transition-colors pl-10 pr-10"
                    />
                    <KeyRound className="w-4 h-4 text-theme-text-muted absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-theme-text-muted hover:text-theme-text cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Scroll className="w-4 h-4" />
                  <span>{isLoading ? '正在通传鉴核...' : '登临山河 · 入牒启程'}</span>
                </button>
              </form>

              {/* 快捷一键登临雅士列表 */}
              <div className="pt-4 border-t border-theme-border/60">
                <p className="text-xs font-bold text-theme-text-muted mb-3 flex items-center justify-between">
                  <span>往昔同行雅士名录（点击直接登临）：</span>
                  <span className="text-[10px] text-theme-primary">一键切换</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableUsers.map((u) => {
                    const isCurrent = currentUser?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                          isCurrent
                            ? 'border-theme-primary bg-theme-primary/10 shadow-xs'
                            : 'border-theme-border bg-theme-surface hover:border-theme-primary/50 hover:bg-theme-surface-card'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-xl">{u.avatarIcon}</span>
                          <div>
                            <div className="text-xs font-bold text-theme-text group-hover:text-theme-primary transition-colors flex items-center space-x-1.5">
                              <span>{u.penName}</span>
                              {isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-theme-primary text-white">当前</span>
                              )}
                            </div>
                            <span className="text-[10px] text-theme-text-muted block">
                              {u.rankTitle} · 历{u.stats?.travelYears ?? 1}载
                            </span>
                          </div>
                        </div>

                        <CheckCircle2
                          className={`w-4 h-4 transition-colors ${
                            isCurrent
                              ? 'text-theme-primary'
                              : 'text-theme-border group-hover:text-theme-primary/50'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 题名结契 (新建文人雅号模式) */}
          {activeTab === 'register' && (
            <div className="space-y-6 max-w-lg mx-auto animate-fadeIn">
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                {/* 雅号输入与随机生成 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-theme-text">
                      文人雅号（如：沧浪客、放翁门生）
                    </label>
                    <button
                      type="button"
                      onClick={handleRandomName}
                      className="text-xs text-theme-primary hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Dice5 className="w-3.5 h-3.5" />
                      <span>🎲 灵感天成</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="题写独属于您的文人雅号"
                    value={regPenName}
                    onChange={(e) => setRegPenName(e.target.value)}
                    maxLength={10}
                    className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text text-sm focus:outline-none focus:border-theme-primary transition-colors font-bold"
                  />
                </div>

                {/* 动态石刻名印实时预览 */}
                <div className="p-4 rounded-2xl bg-theme-surface-card border border-theme-border flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs font-bold text-theme-text block">
                      专属金石印鉴实时篆刻预览
                    </span>
                    <p className="text-[11px] text-theme-text-muted mt-0.5">
                      系统自动将雅号转化为古篆石刻印信，支持阴刻/阳刻点选切换
                    </p>
                  </div>
                  <StoneSealStamp
                    penName={regPenName || '山河雅士'}
                    size="md"
                    defaultMode="yin"
                    className="shrink-0"
                  />
                </div>

                {/* 信物符号选择器 */}
                <div>
                  <label className="block text-xs font-bold text-theme-text mb-2">
                    随身信物（个人图腾）
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {LITERARY_AVATARS.map((item) => (
                      <button
                        key={item.icon}
                        type="button"
                        onClick={() => setSelectedAvatar(item.icon)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center space-y-1 ${
                          selectedAvatar === item.icon
                            ? 'border-theme-primary bg-theme-primary/15 shadow-xs scale-105'
                            : 'border-theme-border bg-theme-surface hover:border-theme-primary/40'
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-[10px] text-theme-text font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 入世门径与文人志向倾向 */}
                <div>
                  <label className="block text-xs font-bold text-theme-text mb-2">
                    入卷志向倾向
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ASPIRATIONS.map((asp) => (
                      <button
                        key={asp.id}
                        type="button"
                        onClick={() => setSelectedAspiration(asp.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedAspiration === asp.id
                            ? 'border-theme-primary bg-theme-primary/10 shadow-xs'
                            : 'border-theme-border bg-theme-surface hover:border-theme-primary/40'
                        }`}
                      >
                        <div className="text-xs font-bold text-theme-text mb-0.5">{asp.title}</div>
                        <div className="text-[10px] text-theme-text-muted">{asp.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 密码保护（可选） */}
                <div>
                  <label className="block text-xs font-bold text-theme-text mb-1 flex items-center justify-between">
                    <span>私密通关密押（选填）</span>
                    <span className="text-[10px] text-theme-text-muted font-normal">不填即免密保存</span>
                  </label>
                  <input
                    type="password"
                    placeholder="输入密码保护您的游历存档（可选）"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-theme-border bg-theme-surface text-theme-text text-xs focus:outline-none focus:border-theme-primary transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Award className="w-4 h-4" />
                  <span>{isLoading ? '正在结契立牒...' : '结契定誓 · 立命入卷'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: 江湖泛舟 (访客游历体验模式) */}
          {activeTab === 'guest' && (
            <div className="space-y-6 max-w-md mx-auto py-6 text-center animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-4xl mx-auto shadow-sm">
                🍂
              </div>

              <div>
                <h4 className="text-lg font-bold text-theme-text">江湖游子 · 随舟泛行</h4>
                <p className="text-xs text-theme-text-muted max-w-sm mx-auto mt-2 leading-relaxed">
                  无需键入任何账号与密码，以“江湖游子”身份一键漫游盛唐两宋。游历期间的推敲答卷、风物收集与山河谱牒同样会妥善保存在本地，往后随时可在书斋中正式立契归档！
                </p>
              </div>

              <div className="p-4 rounded-xl bg-theme-surface-card border border-theme-border text-left space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>全功能无缝开放：推敲默写、舆图漫游、千古相遇</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>本地自动存盘：随时重开继续前行</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>支持一键升级：随时结契绑定为您专属的名士雅号</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGuestPlay}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
              >
                <Compass className="w-4 h-4" />
                <span>以江湖游子一键启程</span>
              </button>
            </div>
          )}
        </div>

        {/* 底部保障与温馨提示 */}
        <div className="px-6 py-3 border-t border-theme-border bg-theme-surface-card flex items-center justify-between text-[11px] text-theme-text-muted shrink-0">
          <span>唐宋山河诗境 · 离线优先无感云同步</span>
          <button
            onClick={onClose}
            className="hover:text-theme-text transition-colors cursor-pointer"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
};
