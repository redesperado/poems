import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Scroll,
  BookOpen,
  Bookmark,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Trash2,
  Edit3,
  Calendar,
  Compass,
  Tag,
  Share2,
} from 'lucide-react';
import {
  UserAccount,
  JourneySaveSlot,
  PoemStudyRecord,
  PoetryNote,
  INITIAL_USER_ACCOUNTS,
  INITIAL_SAVE_SLOTS,
  INITIAL_STUDY_RECORDS,
  INITIAL_POETRY_NOTES,
} from '../../types/userStudio';
import { StoneSealStamp } from './StoneSealStamp';
import { apiClient } from '../../services/api/client';

interface UserProfileModalProps {
  isOpen: boolean;
  currentUser?: UserAccount;
  onSelectUser?: (user: UserAccount) => void;
  onClose: () => void;
  onRetryPoem?: (poemId: string) => void;
  onLoadSlot?: (slot: JourneySaveSlot) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  currentUser: propUser,
  onSelectUser,
  onClose,
  onRetryPoem,
  onLoadSlot,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'saves' | 'study' | 'notes'>('profile');

  // 用户状态
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USER_ACCOUNTS);
  const [localCurrentUser, setLocalCurrentUser] = useState<UserAccount>(
    propUser || INITIAL_USER_ACCOUNTS[0]
  );
  const currentUser = propUser || localCurrentUser;

  const [isSwitchingUser, setIsSwitchingUser] = useState(false);
  const [newPenName, setNewPenName] = useState('');

  // 存档状态
  const [slots, setSlots] = useState<JourneySaveSlot[]>(INITIAL_SAVE_SLOTS);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(INITIAL_SAVE_SLOTS[0].id);

  // 研学记录状态
  const [studyRecords, setStudyRecords] = useState<PoemStudyRecord[]>(INITIAL_STUDY_RECORDS);
  const [studyFilter, setStudyFilter] = useState<'all' | 'mistakes' | 'perfect'>('all');

  // 札记状态
  const [notes, setNotes] = useState<PoetryNote[]>(INITIAL_POETRY_NOTES);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isWritingNote, setIsWritingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('名句赏析');
  const [bookmarkPreviewNote, setBookmarkPreviewNote] = useState<PoetryNote | null>(null);

  // 挂载或打开时从后端/本地拉取最新数据
  useEffect(() => {
    if (!isOpen) return;
    apiClient.setUserId(currentUser.id);
    apiClient.getSaves().then((data) => {
      if (data && data.length > 0) setSlots(data);
    });
    apiClient.getStudyRecords().then((data) => {
      if (data && data.length > 0) setStudyRecords(data);
    });
    apiClient.getNotes().then((data) => {
      if (data && data.length > 0) setNotes(data);
    });
  }, [isOpen, currentUser.id]);

  if (!isOpen) return null;

  // 切换用户
  const handleSelectUser = (user: UserAccount) => {
    apiClient.setUserId(user.id);
    setLocalCurrentUser(user);
    if (onSelectUser) {
      onSelectUser(user);
    }
    setIsSwitchingUser(false);
    apiClient.getSaves().then(setSlots);
    apiClient.getStudyRecords().then(setStudyRecords);
    apiClient.getNotes().then(setNotes);
  };

  // 创建新用户
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPenName.trim()) return;
    const username = `walker_${Date.now().toString().slice(-4)}`;
    const newUser = await apiClient.register(username, newPenName.trim());
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    handleSelectUser(newUser);
    setNewPenName('');
    setIsSwitchingUser(false);
  };

  // 载入存档
  const handleLoadSlot = (slot: JourneySaveSlot) => {
    setSlots(
      slots.map((s) => ({
        ...s,
        isActive: s.id === slot.id,
      }))
    );
    setSelectedSlotId(slot.id);
    if (onLoadSlot) {
      onLoadSlot(slot);
    }
  };

  // 新建存档槽位
  const handleCreateSlot = async () => {
    const newSlotNumber = slots.length + 1;
    const newSlot: JourneySaveSlot = {
      id: `slot_${Date.now()}`,
      slotName: `【档${newSlotNumber}】新辟山河游历`,
      poetId: 'li_bai',
      poetName: '李白',
      currentYear: 701,
      locationName: '剑南道',
      moodOverview: '初涉江湖 · 50',
      unlockedPoemsCount: 0,
      totalPoemsCount: 4,
      artifactsCount: 1,
      updatedAtText: '刚刚开辟',
      isActive: false,
      journeyLogs: [{ year: 701, location: '蜀地', event: '大匡山初启剑侠长游' }],
    };
    setSlots([...slots, newSlot]);
    await apiClient.saveSlot({
      slotIndex: newSlotNumber,
      slotName: newSlot.slotName,
      poetId: newSlot.poetId,
      currentYear: newSlot.currentYear,
      currentLocationId: 'sichuan',
      mood: { passion: 50, sorrow: 20, freedom: 50, anger: 10, homesickness: 20 },
      journeyLogs: newSlot.journeyLogs,
    });
  };

  // 删除存档
  const handleDeleteSlot = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slots.length <= 1) {
      alert('至少保留一个游历存档槽位！');
      return;
    }
    setSlots(slots.filter((s) => s.id !== id));
    await apiClient.deleteSave(id);
  };

  // 提交新札记
  const handleSaveNewNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    const newNote = await apiClient.createNote({
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      tags: [newNoteTag],
      locationName: '山河墨斋',
    });
    setNotes([newNote, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsWritingNote(false);
  };

  // 删除札记
  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(notes.filter((n) => n.id !== id));
    await apiClient.deleteNote(id);
  };

  // 研学记录过滤
  const filteredRecords = studyRecords.filter((rec) => {
    if (studyFilter === 'mistakes') return rec.mistakes.length > 0;
    if (studyFilter === 'perfect') return rec.score === 100;
    return true;
  });

  // 札记所有不重复标签
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));
  const filteredNotes =
    selectedTag === 'all' ? notes : notes.filter((n) => n.tags.includes(selectedTag));

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* 主展台容器：彻底契合全局主题背景与文字变量 */}
      <div className="relative w-full max-w-5xl h-[88vh] max-h-[820px] bg-theme-canvas border border-theme-border rounded-2xl shadow-2xl overflow-hidden flex flex-col font-poetry text-theme-text transition-colors duration-300">
        {/* 顶部标题栏 */}
        <div className="px-6 py-4 border-b border-theme-border bg-theme-surface-card flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center text-theme-primary text-xl shadow-xs">
              {currentUser.avatarIcon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-theme-text tracking-wide">
                  文人书斋 · 个人档案中心
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-theme-primary/10 border border-theme-primary/25 text-theme-primary font-bold">
                  {currentUser.rankTitle}
                </span>
              </div>
              <p className="text-xs text-theme-text-muted mt-0.5">
                雅士：<span className="font-bold text-theme-text">{currentUser.penName}</span>（{currentUser.username}） · 结契于 {currentUser.createdAt}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSwitchingUser(!isSwitchingUser)}
              className="px-3.5 py-1.5 text-xs rounded-full border border-theme-border hover:border-theme-primary text-theme-text bg-theme-surface hover:text-theme-primary transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs font-bold"
            >
              <User className="w-3.5 h-3.5 text-theme-primary" />
              <span>切换雅号 / 登录</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-theme-surface text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
              title="关闭书斋"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 切换用户抽屉 (Demo) */}
        {isSwitchingUser && (
          <div className="px-6 py-3.5 bg-theme-surface-card border-b border-theme-border flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn shrink-0 shadow-inner">
            <div className="flex items-center space-x-2">
              <span className="text-theme-primary font-bold">已备文人雅号：</span>
              <div className="flex flex-wrap gap-2">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className={`px-3 py-1 rounded-full border transition-all cursor-pointer font-poetry ${
                      u.id === currentUser.id
                        ? 'border-theme-primary bg-theme-primary text-white font-bold shadow-xs'
                        : 'border-theme-border bg-theme-surface hover:border-theme-primary/50 text-theme-text'
                    }`}
                  >
                    {u.avatarIcon} {u.penName}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="题写新雅号（如：沧浪客）"
                value={newPenName}
                onChange={(e) => setNewPenName(e.target.value)}
                className="px-3 py-1 rounded-lg border border-theme-border bg-theme-surface text-theme-text text-xs focus:outline-none focus:border-theme-primary"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                + 结契入斋
              </button>
            </form>
          </div>
        )}

        {/* 四大雅致 Tab 切换导航 */}
        <div className="px-6 border-b border-theme-border bg-theme-surface-card/60 flex space-x-6 text-sm shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 flex items-center space-x-2 border-b-2 font-medium transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-theme-primary text-theme-primary font-bold'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <User className="w-4 h-4" />
            <span>【雅士名牌】</span>
          </button>
          <button
            onClick={() => setActiveTab('saves')}
            className={`py-3 flex items-center space-x-2 border-b-2 font-medium transition-all cursor-pointer ${
              activeTab === 'saves'
                ? 'border-theme-primary text-theme-primary font-bold'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>【山河谱牒 · 多槽位】</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-theme-primary/10 text-theme-primary rounded-full font-bold">
              {slots.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('study')}
            className={`py-3 flex items-center space-x-2 border-b-2 font-medium transition-all cursor-pointer ${
              activeTab === 'study'
                ? 'border-theme-primary text-theme-primary font-bold'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>【推敲朱卷 · 答卷错题】</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-theme-primary/10 text-theme-primary rounded-full font-bold">
              {studyRecords.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 flex items-center space-x-2 border-b-2 font-medium transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'border-theme-primary text-theme-primary font-bold'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>【文心墨札 · 随笔书签】</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-theme-primary/10 text-theme-primary rounded-full font-bold">
              {notes.length}
            </span>
          </button>
        </div>

        {/* 内容展示区 */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-theme-canvas">
          {/* TAB 1: 雅士名牌 (Profile & Identity) */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
              {/* 核心身分卡：采用主题卡片背景与高对比度文字 */}
              <div className="p-6 rounded-2xl bg-theme-surface-card border border-theme-border shadow-card-soft flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="flex items-center space-x-5 z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-theme-primary/20 via-theme-surface to-theme-primary/5 border-2 border-theme-primary/40 flex items-center justify-center shadow-md">
                    <span className="text-4xl text-theme-primary">{currentUser.avatarIcon}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-2xl font-bold text-theme-text tracking-wide">
                        {currentUser.penName}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-theme-primary/10 border border-theme-primary/30 text-theme-primary flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>文位 · {currentUser.rankTitle}</span>
                      </span>
                    </div>
                    <p className="text-xs text-theme-text-muted mt-2">
                      文位进度：经验值 <span className="font-bold text-theme-text">{currentUser.exp}</span> / {currentUser.maxExp}（距晋升下一文位还需{' '}
                      <span className="font-bold text-theme-primary">{currentUser.maxExp - currentUser.exp}</span> 研悟点）
                    </p>
                    {/* 经验进度条 */}
                    <div className="w-64 h-2.5 bg-theme-canvas rounded-full overflow-hidden mt-2.5 border border-theme-border">
                      <div
                        className="h-full bg-gradient-to-r from-theme-primary to-theme-accent rounded-full transition-all duration-500"
                        style={{
                          width: `${(currentUser.exp / currentUser.maxExp) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 汉唐宋印 · 金石石刻名印 (当朝篆字、金石崩边、刀痕与朱砂矿物拓印效果，支持阴阳刻点击切换) */}
                <StoneSealStamp
                  penName={currentUser.penName}
                  size="md"
                  defaultMode="yin"
                  className="shrink-0 z-10"
                />
              </div>

              {/* 统计指标网格 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-theme-surface-card border border-theme-border text-center shadow-card-soft hover:border-theme-primary/40 transition-colors">
                  <p className="text-xs text-theme-text-muted mb-1 flex items-center justify-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-theme-primary" />
                    <span>漫游春秋</span>
                  </p>
                  <p className="text-2xl font-bold text-theme-text font-serif">
                    {currentUser.stats.travelYears}{' '}
                    <span className="text-xs font-normal text-theme-text-muted">载</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-theme-surface-card border border-theme-border text-center shadow-card-soft hover:border-theme-primary/40 transition-colors">
                  <p className="text-xs text-theme-text-muted mb-1 flex items-center justify-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-theme-primary" />
                    <span>精研名篇</span>
                  </p>
                  <p className="text-2xl font-bold text-theme-text font-serif">
                    {currentUser.stats.poemsStudied}{' '}
                    <span className="text-xs font-normal text-theme-text-muted">首</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-theme-surface-card border border-theme-border text-center shadow-card-soft hover:border-theme-primary/40 transition-colors">
                  <p className="text-xs text-theme-text-muted mb-1 flex items-center justify-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-theme-gold" />
                    <span>山河风物</span>
                  </p>
                  <p className="text-2xl font-bold text-theme-text font-serif">
                    {currentUser.stats.artifactsCollected}{' '}
                    <span className="text-xs font-normal text-theme-text-muted">件</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-theme-surface-card border border-theme-border text-center shadow-card-soft hover:border-theme-primary/40 transition-colors">
                  <p className="text-xs text-theme-text-muted mb-1 flex items-center justify-center space-x-1">
                    <Bookmark className="w-3.5 h-3.5 text-theme-accent" />
                    <span>文心墨札</span>
                  </p>
                  <p className="text-2xl font-bold text-theme-text font-serif">
                    {currentUser.stats.notesCount}{' '}
                    <span className="text-xs font-normal text-theme-text-muted">卷</span>
                  </p>
                </div>
              </div>

              {/* 文位进阶图谱 */}
              <div className="p-5 rounded-xl bg-theme-surface-card border border-theme-border shadow-card-soft">
                <h4 className="text-sm font-bold text-theme-text mb-3 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-theme-primary" />
                  <span>文人研学文位登真阶梯</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 text-center text-xs">
                  {['童生', '秀才', '举人', '进士及第', '翰林学士', '一代宗师'].map(
                    (rank, idx) => {
                      const isCurrent = currentUser.rankTitle.includes(rank);
                      const isPast = idx < 4; // 模拟已达到
                      return (
                        <div
                          key={rank}
                          className={`p-3 rounded-lg border transition-all ${
                            isCurrent
                              ? 'border-2 border-theme-primary bg-theme-primary/10 text-theme-primary font-bold shadow-xs'
                              : isPast
                              ? 'border-theme-border bg-theme-surface text-theme-text font-medium'
                              : 'border-theme-border/40 bg-theme-surface/40 text-theme-text-muted opacity-60'
                          }`}
                        >
                          <div className="text-base mb-1">
                            {isCurrent ? '👑' : isPast ? '✓' : '🔒'}
                          </div>
                          <span>{rank}</span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 山河谱牒 (Multi-Slot Saves & Footprints) */}
          {activeTab === 'saves' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-theme-text flex items-center space-x-2">
                    <Scroll className="w-4 h-4 text-theme-primary" />
                    <span>多槽位独立游历谱牒 (存档管理)</span>
                  </h3>
                  <p className="text-xs text-theme-text-muted mt-0.5">
                    每位文人、不同的人生抉择均可独立封存，随时在不同时空线穿梭游历
                  </p>
                </div>
                <button
                  onClick={handleCreateSlot}
                  className="px-3.5 py-1.5 rounded-full bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>开辟新游历槽位</span>
                </button>
              </div>

              {/* 槽位卡片列表 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {slots.map((slot) => {
                  const isSelected = slot.id === selectedSlotId;
                  return (
                    <div
                      key={slot.id}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-card-soft ${
                        slot.isActive
                          ? 'border-2 border-theme-primary bg-theme-primary/5 ring-1 ring-theme-primary'
                          : isSelected
                          ? 'border-theme-primary/70 bg-theme-surface-card'
                          : 'border-theme-border bg-theme-surface-card hover:border-theme-border-highlight'
                      }`}
                    >
                      {slot.isActive && (
                        <div className="absolute top-0 right-0 bg-theme-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                          当前游历中
                        </div>
                      )}

                      <div>
                        <div className="flex items-center space-x-2.5 mb-2.5">
                          <span className="w-8 h-8 rounded-full bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center font-bold text-theme-primary text-xs">
                            {slot.poetName[0]}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-theme-text">{slot.slotName}</h4>
                            <p className="text-[11px] text-theme-text-muted">
                              文人：{slot.poetName} · 公元 {slot.currentYear} 年 · {slot.locationName}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-theme-text-muted bg-theme-canvas p-2.5 rounded-lg border border-theme-border/60 my-2">
                          <div className="flex justify-between">
                            <span>心境状态：</span>
                            <span className="text-theme-text font-bold">{slot.moodOverview}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>传世名篇：</span>
                            <span className="text-theme-primary font-bold">
                              {slot.unlockedPoemsCount} / {slot.totalPoemsCount} 卷
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>纳藏风物：</span>
                            <span className="text-theme-gold font-bold">{slot.artifactsCount} 件</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-theme-border/60 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-theme-text-muted">{slot.updatedAtText}</span>
                        <div className="flex items-center space-x-1.5">
                          {!slot.isActive && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLoadSlot(slot);
                              }}
                              className="px-2.5 py-1 rounded bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary-hover shadow-xs transition-colors cursor-pointer"
                            >
                              载入游历
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteSlot(slot.id, e)}
                            className="p-1 rounded text-theme-text-muted hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="归档删除此槽位"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 选中槽位的游历足迹大年表 */}
              {selectedSlotId && (
                <div className="p-5 rounded-xl bg-theme-surface-card border border-theme-border shadow-card-soft">
                  <h4 className="text-sm font-bold text-theme-text mb-3 flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-theme-primary" />
                    <span>所选槽位历史游历足迹 (时间线行履录)</span>
                  </h4>
                  <div className="space-y-3.5 relative pl-6 border-l-2 border-theme-primary/30 ml-2 text-xs">
                    {slots
                      .find((s) => s.id === selectedSlotId)
                      ?.journeyLogs.map((log, idx) => (
                        <div key={idx} className="relative group">
                          <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-theme-primary border-2 border-theme-surface shadow-xs" />
                          <div className="flex items-center space-x-2 font-bold text-theme-text">
                            <span className="text-theme-primary font-bold">公元 {log.year} 年</span>
                            <span className="text-theme-text-muted font-normal">·</span>
                            <span>{log.location}</span>
                          </div>
                          <p className="text-theme-text-muted mt-0.5 leading-relaxed">{log.event}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 推敲朱卷 (Study Records & Mistake Book) */}
          {activeTab === 'study' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-theme-text flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-theme-primary" />
                    <span>推敲朱卷与默写研学答卷集 (错题集)</span>
                  </h3>
                  <p className="text-xs text-theme-text-muted mt-0.5">
                    记录每首诗篇推敲时错漏的字眼与名师辨析，支持随时一键错题重练
                  </p>
                </div>

                {/* 过滤切换 */}
                <div className="flex space-x-1.5 p-1 rounded-lg bg-theme-surface border border-theme-border text-xs shrink-0">
                  <button
                    onClick={() => setStudyFilter('all')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      studyFilter === 'all'
                        ? 'bg-theme-primary text-white font-bold shadow-xs'
                        : 'text-theme-text-muted hover:text-theme-text'
                    }`}
                  >
                    全部答卷 ({studyRecords.length})
                  </button>
                  <button
                    onClick={() => setStudyFilter('mistakes')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center space-x-1 ${
                      studyFilter === 'mistakes'
                        ? 'bg-red-700 text-white font-bold shadow-xs'
                        : 'text-theme-text-muted hover:text-theme-text'
                    }`}
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>错题辨析集 (2)</span>
                  </button>
                  <button
                    onClick={() => setStudyFilter('perfect')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center space-x-1 ${
                      studyFilter === 'perfect'
                        ? 'bg-theme-primary text-white font-bold shadow-xs'
                        : 'text-theme-text-muted hover:text-theme-text'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>甲等·妙品 (2)</span>
                  </button>
                </div>
              </div>

              {/* 答卷卷宗列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-5 rounded-xl border border-theme-border bg-theme-surface-card hover:border-theme-primary/40 shadow-card-soft transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-theme-primary/10 border border-theme-primary/25 text-theme-primary font-poetry font-bold">
                              {rec.dynasty === 'tang' ? '唐' : '宋'} · {rec.poetName}
                            </span>
                            <h4 className="font-bold text-base text-theme-text">{rec.poemTitle}</h4>
                          </div>
                          <p className="text-xs text-theme-text-muted mt-1">
                            研学于 {rec.completedAtText} · 用时 {rec.durationSeconds} 秒
                          </p>
                        </div>

                        {/* 朱砂成绩点评印 */}
                        <div
                          className={`px-2.5 py-1 rounded-md border-2 text-xs font-bold tracking-wider select-none font-serif ${
                            rec.score === 100
                              ? 'border-emerald-700 bg-emerald-700/10 text-emerald-800 dark:text-emerald-300'
                              : rec.score >= 70
                              ? 'border-amber-700 bg-amber-700/10 text-amber-800 dark:text-amber-300'
                              : 'border-red-700 bg-red-700/10 text-red-800 dark:text-red-300'
                          }`}
                        >
                          {rec.grade}
                        </div>
                      </div>

                      {/* 错题辨析区 */}
                      {rec.mistakes.length > 0 ? (
                        <div className="mt-3 p-3 rounded-lg bg-red-700/5 border border-red-700/20 text-xs space-y-2">
                          <div className="text-red-700 dark:text-red-400 font-bold flex items-center space-x-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>错题点拨（{rec.mistakes.length} 处需砥砺）：</span>
                          </div>
                          {rec.mistakes.map((m, idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="text-theme-text">
                                原句：<span className="font-bold text-theme-text">{m.lineSnippet}</span>
                              </p>
                              <p className="text-theme-text-muted">
                                误选为：<span className="line-through text-red-700 font-bold">{m.chosenOption}</span>，正解应为：
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold">【{m.correctOption}】</span>
                              </p>
                              <p className="text-theme-text leading-relaxed bg-theme-surface p-2.5 rounded border border-theme-border/60">
                                ✦ 名师辨析：{m.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 p-2.5 rounded-lg bg-emerald-700/10 border border-emerald-700/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>一字无差，尽得文豪风骨神韵！</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-theme-border/60 flex justify-end">
                      <button
                        onClick={() => {
                          if (onRetryPoem) {
                            onClose();
                            onRetryPoem(rec.poemId);
                          } else {
                            alert(`即将载入《${rec.poemTitle}》进行错题重练与再次推敲！`);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>错题重练 · 再次推敲 ➔</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 文心墨札 (Poetry Notes & Reflections) */}
          {activeTab === 'notes' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-theme-text flex items-center space-x-2">
                    <Bookmark className="w-4 h-4 text-theme-primary" />
                    <span>文心墨札 · 研学笔记与随笔库</span>
                  </h3>
                  <p className="text-xs text-theme-text-muted mt-0.5">
                    记录游历诗境时的诗意顿悟、字句赏析与心得，可一键凝结为水墨书签
                  </p>
                </div>

                <button
                  onClick={() => setIsWritingNote(!isWritingNote)}
                  className="px-3.5 py-1.5 rounded-full bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>✍ 提笔写新札记</span>
                </button>
              </div>

              {/* 提笔写札记抽屉 */}
              {isWritingNote && (
                <form
                  onSubmit={handleSaveNewNote}
                  className="p-5 rounded-xl bg-theme-surface-card border border-theme-border space-y-3.5 text-xs animate-fadeIn shadow-card-soft"
                >
                  <h4 className="font-bold text-theme-text text-sm">✦ 题写文心墨札</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="札记题头（如：《蜀道难》险绝意象感悟）"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-theme-border bg-theme-surface text-theme-text text-xs focus:outline-none focus:border-theme-primary"
                      required
                    />
                    <select
                      value={newNoteTag}
                      onChange={(e) => setNewNoteTag(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-theme-border bg-theme-surface text-theme-text text-xs focus:outline-none focus:border-theme-primary"
                    >
                      <option value="名句赏析">#名句赏析</option>
                      <option value="人生感怀">#人生感怀</option>
                      <option value="背诵诀窍">#背诵诀窍</option>
                      <option value="金石考据">#金石考据</option>
                      <option value="山河行履">#山河行履</option>
                    </select>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="在此挥毫手书您的赏析感悟、背诵心得或行路所思……"
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="w-full p-3 rounded-lg border border-theme-border bg-theme-surface text-theme-text text-xs leading-relaxed focus:outline-none focus:border-theme-primary"
                    required
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsWritingNote(false)}
                      className="px-3.5 py-1.5 rounded-lg border border-theme-border text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      封印墨宝
                    </button>
                  </div>
                </form>
              )}

              {/* 标签过滤栏 */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-theme-text-muted mr-1">分类：</span>
                <button
                  onClick={() => setSelectedTag('all')}
                  className={`px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                    selectedTag === 'all'
                      ? 'border-theme-primary bg-theme-primary text-white font-bold shadow-xs'
                      : 'border-theme-border text-theme-text-muted hover:text-theme-text bg-theme-surface-card'
                  }`}
                >
                  全部 ({notes.length})
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full border transition-colors cursor-pointer flex items-center space-x-1 ${
                      selectedTag === tag
                        ? 'border-theme-primary bg-theme-primary text-white font-bold shadow-xs'
                        : 'border-theme-border text-theme-text-muted hover:text-theme-text bg-theme-surface-card'
                    }`}
                  >
                    <Tag className="w-2.5 h-2.5" />
                    <span>#{tag}</span>
                  </button>
                ))}
              </div>

              {/* 札记卡片列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 rounded-xl border border-theme-border bg-theme-surface-card hover:border-theme-primary/40 shadow-card-soft transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-base text-theme-text">{note.title}</h4>
                        <span className="text-[10px] text-theme-text-muted shrink-0 ml-2">
                          {note.createdAtText}
                        </span>
                      </div>

                      {note.poemTitle && (
                        <p className="text-xs text-theme-primary mt-1 flex items-center space-x-1 font-medium">
                          <BookOpen className="w-3 h-3" />
                          <span>
                            关联：《{note.poemTitle}》· {note.poetName}（{note.locationName}）
                          </span>
                        </p>
                      )}

                      <p className="text-xs text-theme-text leading-relaxed mt-2.5 bg-theme-canvas p-3 rounded-lg border border-theme-border/60 whitespace-pre-line">
                        {note.content}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {note.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-theme-primary/10 border border-theme-primary/20 text-theme-primary font-bold"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-theme-border/60 flex items-center justify-between">
                      <button
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-theme-text-muted hover:text-red-500 transition-colors cursor-pointer"
                        title="删除札记"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setBookmarkPreviewNote(note)}
                        className="px-3.5 py-1.5 rounded-full bg-theme-surface border border-theme-border hover:border-theme-primary text-theme-text hover:text-theme-primary text-xs font-bold transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <Share2 className="w-3 h-3 text-theme-primary" />
                        <span>生成墨宝书签卡</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部信息栏 */}
        <div className="px-6 py-3.5 border-t border-theme-border bg-theme-surface-card flex items-center justify-between text-xs text-theme-text-muted shrink-0">
          <span>唐宋山河诗境 · 个人文心书斋已就绪</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-theme-surface border border-theme-border hover:border-theme-primary text-theme-text hover:text-theme-primary transition-colors cursor-pointer font-bold shadow-xs"
          >
            返回
          </button>
        </div>
      </div>

      {/* 墨宝书签卡生成预览模态 (Demo) */}
      {bookmarkPreviewNote && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#fcf8ee] text-stone-900 border-4 border-amber-950/70 rounded-2xl shadow-2xl p-6 font-poetry flex flex-col items-center">
            <button
              onClick={() => setBookmarkPreviewNote(null)}
              className="absolute top-3 right-3 p-1 rounded-full text-stone-700 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 书签流苏 */}
            <div className="w-4 h-12 bg-red-800 rounded-b shadow-md mb-3 flex items-center justify-center">
              <div className="w-1 h-8 bg-amber-400" />
            </div>

            <div className="text-center border-b border-stone-300 pb-3 w-full">
              <span className="text-[10px] text-stone-600 tracking-widest block">
                唐宋山河诗境 · 文心墨札
              </span>
              <h3 className="text-lg font-bold text-amber-950 mt-1">
                {bookmarkPreviewNote.title}
              </h3>
            </div>

            <div className="my-5 w-full bg-amber-900/5 p-4 rounded-xl border border-amber-900/20 text-xs text-stone-800 leading-relaxed italic">
              “{bookmarkPreviewNote.content}”
            </div>

            <div className="w-full flex items-center justify-between text-[11px] text-stone-600 border-t border-stone-300 pt-3">
              <span>雅士：{currentUser.penName}</span>
              <StoneSealStamp
                penName={currentUser.penName}
                size="sm"
                defaultMode="yin"
                showCaption={false}
                interactive={false}
              />
            </div>

            <button
              onClick={() => {
                alert('墨宝书签卡已复制至剪贴板（模拟）！');
                setBookmarkPreviewNote(null);
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              保存 / 分享墨宝书签
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
