import React, { useState } from 'react';
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

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetryPoem?: (poemId: string) => void;
  onLoadSlot?: (slot: JourneySaveSlot) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onRetryPoem,
  onLoadSlot,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'saves' | 'study' | 'notes'>('profile');

  // 用户状态
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USER_ACCOUNTS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USER_ACCOUNTS[0]);
  const [isSwitchingUser, setIsSwitchingUser] = useState(false);
  const [newPenName, setNewPenName] = useState('');

  // 存档状态
  const [slots, setSlots] = useState<JourneySaveSlot[]>(INITIAL_SAVE_SLOTS);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(INITIAL_SAVE_SLOTS[0].id);

  // 研学记录状态
  const [studyRecords] = useState<PoemStudyRecord[]>(INITIAL_STUDY_RECORDS);
  const [studyFilter, setStudyFilter] = useState<'all' | 'mistakes' | 'perfect'>('all');

  // 札记状态
  const [notes, setNotes] = useState<PoetryNote[]>(INITIAL_POETRY_NOTES);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isWritingNote, setIsWritingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('名句赏析');
  const [bookmarkPreviewNote, setBookmarkPreviewNote] = useState<PoetryNote | null>(null);

  if (!isOpen) return null;

  // 切换用户
  const handleSelectUser = (user: UserAccount) => {
    setCurrentUser(user);
    setIsSwitchingUser(false);
  };

  // 创建新用户
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPenName.trim()) return;
    const newUser: UserAccount = {
      id: `user_${Date.now()}`,
      username: `walker_${Date.now().toString().slice(-4)}`,
      penName: newPenName.trim(),
      avatarIcon: '📜',
      rankTitle: '童生初入',
      level: 1,
      exp: 100,
      maxExp: 1000,
      stats: {
        travelYears: 1,
        poemsStudied: 0,
        artifactsCollected: 0,
        notesCount: 0,
      },
      createdAt: '方才结契',
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
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
  const handleCreateSlot = () => {
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
  };

  // 删除存档
  const handleDeleteSlot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slots.length <= 1) {
      alert('至少保留一个游历存档槽位！');
      return;
    }
    setSlots(slots.filter((s) => s.id !== id));
  };

  // 提交新札记
  const handleSaveNewNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    const newNote: PoetryNote = {
      id: `note_${Date.now()}`,
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      tags: [newNoteTag],
      createdAtText: '刚刚题写',
    };
    setNotes([newNote, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsWritingNote(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      {/* 主展台容器 */}
      <div className="relative w-full max-w-5xl h-[88vh] max-h-[820px] bg-theme-surface/95 border border-theme-gold/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-poetry text-theme-text transition-all">
        {/* 顶部标题栏与国风金石边框 */}
        <div className="px-6 py-4 border-b border-theme-border bg-theme-surface-card/90 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border border-amber-400/50 flex items-center justify-center shadow-md text-amber-100 text-lg">
              {currentUser.avatarIcon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-theme-gold tracking-wider">
                  文人书斋 · 个人档案中心
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300">
                  {currentUser.rankTitle}
                </span>
              </div>
              <p className="text-xs text-theme-text-muted mt-0.5">
                雅士：{currentUser.penName}（{currentUser.username}） · 结契于 {currentUser.createdAt}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSwitchingUser(!isSwitchingUser)}
              className="px-3 py-1.5 text-xs rounded-full border border-theme-border hover:border-theme-gold/60 text-theme-text bg-theme-surface hover:text-theme-gold transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>切换雅号</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-theme-surface text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 切换用户抽屉 (Demo) */}
        {isSwitchingUser && (
          <div className="px-6 py-3 bg-amber-950/40 border-b border-amber-700/30 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-amber-300 font-bold">已备文人雅号：</span>
              <div className="flex space-x-2">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className={`px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                      u.id === currentUser.id
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-bold'
                        : 'border-white/10 hover:border-white/30 text-theme-text-muted'
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
                className="px-2.5 py-1 rounded border border-theme-border bg-theme-surface text-xs focus:outline-none focus:border-theme-gold"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-amber-600/80 hover:bg-amber-600 text-amber-100 rounded text-xs transition-colors cursor-pointer"
              >
                + 结契入斋
              </button>
            </form>
          </div>
        )}

        {/* 四大雅致 Tab 切换导航 */}
        <div className="px-6 border-b border-theme-border/60 bg-theme-surface-card/40 flex space-x-6 text-sm shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 flex items-center space-x-2 border-b-2 font-medium transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-theme-gold text-theme-gold font-bold shadow-gold-glow'
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
                ? 'border-theme-gold text-theme-gold font-bold shadow-gold-glow'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>【山河谱牒 · 多槽位】</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full">
              {slots.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('study')}
            className={`py-3 flex items-center space-x-2 border-b-2 font-medium transition-all cursor-pointer ${
              activeTab === 'study'
                ? 'border-theme-gold text-theme-gold font-bold shadow-gold-glow'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>【推敲朱卷 · 答卷错题】</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded-full">
              {studyRecords.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 flex items-center space-x-2 border-b-2 font-medium transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'border-theme-gold text-theme-gold font-bold shadow-gold-glow'
                : 'border-transparent text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>【文心墨札 · 随笔书签】</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full">
              {notes.length}
            </span>
          </button>
        </div>

        {/* 内容展示区 */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {/* TAB 1: 雅士名牌 (Profile & Identity) */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
              {/* 核心身分卡 */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-theme-surface-card to-amber-950/30 border border-theme-gold/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-4 -bottom-6 text-amber-500/5 text-9xl font-poetry font-black select-none pointer-events-none">
                  墨
                </div>
                <div className="flex items-center space-x-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-700 to-amber-900 border-2 border-amber-400 p-1 flex items-center justify-center shadow-lg">
                    <span className="text-4xl text-amber-100">{currentUser.avatarIcon}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-2xl font-bold text-amber-200">{currentUser.penName}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-amber-300" />
                        <span>文位 · {currentUser.rankTitle}</span>
                      </span>
                    </div>
                    <p className="text-xs text-theme-text-muted mt-1.5">
                      文位进度：经验值 {currentUser.exp} / {currentUser.maxExp}（距晋升下一文位还需{' '}
                      {currentUser.maxExp - currentUser.exp} 研悟点）
                    </p>
                    {/* 经验进度条 */}
                    <div className="w-64 h-2 bg-theme-surface rounded-full overflow-hidden mt-2 border border-theme-border">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                        style={{
                          width: `${(currentUser.exp / currentUser.maxExp) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 朱砂方印 */}
                <div className="shrink-0 flex flex-col items-center justify-center p-3 border-2 border-red-700/60 rounded-xl bg-red-950/20 shadow-md">
                  <div className="w-12 h-12 border border-red-600/70 rounded-lg flex items-center justify-center text-red-400 font-bold text-xs tracking-widest writing-vertical select-none">
                    青莲之玺
                  </div>
                  <span className="text-[10px] text-red-300/80 mt-1">敕造研心朱印</span>
                </div>
              </div>

              {/* 统计指标网格 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-theme-surface-card border border-theme-border text-center hover:border-theme-gold/40 transition-colors">
                  <p className="text-xs text-theme-text-muted mb-1 flex items-center justify-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-theme-gold" />
                    <span>漫游春秋</span>
                  </p>
                  <p className="text-2xl font-bold text-theme-text">
                    {currentUser.stats.travelYears}{' '}
                    <span className="text-xs font-normal text-theme-text-muted">载</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-theme-surface-card border border-theme-border text-center hover:border-theme-gold/40 transition-colors">
                  <p className="text-xs text-theme-text-muted mb-1 flex items-center justify-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>精研名篇</span>
                  </p>
                  <p className="text-2xl font-bold text-theme-text">
                    {currentUser.stats.poemsStudied}{' '}
                    <span className="text-xs font-normal text-theme-text-muted">首</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-theme-surface-card border border-theme-border text-center hover:border-theme-gold/40 transition-colors">
                  <p className="text-xs text-theme-text-muted mb-1 flex items-center justify-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>山河风物</span>
                  </p>
                  <p className="text-2xl font-bold text-theme-text">
                    {currentUser.stats.artifactsCollected}{' '}
                    <span className="text-xs font-normal text-theme-text-muted">件</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-theme-surface-card border border-theme-border text-center hover:border-theme-gold/40 transition-colors">
                  <p className="text-xs text-theme-text-muted mb-1 flex items-center justify-center space-x-1">
                    <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                    <span>文心墨札</span>
                  </p>
                  <p className="text-2xl font-bold text-theme-text">
                    {currentUser.stats.notesCount}{' '}
                    <span className="text-xs font-normal text-theme-text-muted">卷</span>
                  </p>
                </div>
              </div>

              {/* 文位进阶图谱 */}
              <div className="p-5 rounded-xl bg-theme-surface-card border border-theme-border">
                <h4 className="text-sm font-bold text-theme-gold mb-3 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-theme-gold" />
                  <span>文人研学文位登真阶梯</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                  {['童生', '秀才', '举人', '进士及第', '翰林学士', '一代宗师'].map(
                    (rank, idx) => {
                      const isCurrent = currentUser.rankTitle.includes(rank);
                      const isPast = idx < 4; // 模拟已达到
                      return (
                        <div
                          key={rank}
                          className={`p-2.5 rounded-lg border transition-all ${
                            isCurrent
                              ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-bold shadow-md'
                              : isPast
                              ? 'border-emerald-600/40 bg-emerald-950/20 text-emerald-300'
                              : 'border-white/5 bg-theme-surface text-theme-text-muted'
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
                  <h3 className="text-base font-bold text-theme-gold flex items-center space-x-2">
                    <Scroll className="w-4 h-4 text-theme-gold" />
                    <span>多槽位独立游历谱牒 (存档管理)</span>
                  </h3>
                  <p className="text-xs text-theme-text-muted mt-0.5">
                    每位文人、不同的人生抉择均可独立封存，随时在不同时空线穿梭游历
                  </p>
                </div>
                <button
                  onClick={handleCreateSlot}
                  className="px-3.5 py-1.5 rounded-full bg-amber-600/80 hover:bg-amber-600 text-amber-100 text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
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
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        slot.isActive
                          ? 'border-amber-400 bg-gradient-to-b from-amber-950/30 to-theme-surface-card shadow-gold-glow'
                          : isSelected
                          ? 'border-amber-500/60 bg-theme-surface-card'
                          : 'border-theme-border bg-theme-surface hover:border-theme-border-highlight'
                      }`}
                    >
                      {slot.isActive && (
                        <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                          当前游历中
                        </div>
                      )}

                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="w-7 h-7 rounded-full bg-theme-surface border border-theme-border flex items-center justify-center font-bold text-theme-gold text-xs">
                            {slot.poetName[0]}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-theme-text">{slot.slotName}</h4>
                            <p className="text-[11px] text-theme-text-muted">
                              文人：{slot.poetName} · 公元 {slot.currentYear} 年 · {slot.locationName}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-theme-text-muted bg-theme-surface/70 p-2.5 rounded-lg border border-theme-border/50 my-2">
                          <div className="flex justify-between">
                            <span>心境状态：</span>
                            <span className="text-amber-300 font-medium">{slot.moodOverview}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>传世名篇：</span>
                            <span className="text-emerald-400 font-medium">
                              {slot.unlockedPoemsCount} / {slot.totalPoemsCount} 卷
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>纳藏风物：</span>
                            <span className="text-cyan-400 font-medium">{slot.artifactsCount} 件</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-theme-border/50 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-theme-text-muted">{slot.updatedAtText}</span>
                        <div className="flex items-center space-x-1.5">
                          {!slot.isActive && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLoadSlot(slot);
                              }}
                              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-colors cursor-pointer"
                            >
                              载入游历
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteSlot(slot.id, e)}
                            className="p-1 rounded text-theme-text-muted hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
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
                <div className="p-5 rounded-xl bg-theme-surface-card border border-theme-border">
                  <h4 className="text-sm font-bold text-theme-gold mb-3 flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-theme-gold" />
                    <span>所选槽位历史游历足迹 (时间线行履录)</span>
                  </h4>
                  <div className="space-y-3 relative pl-6 border-l-2 border-amber-600/30 ml-2 text-xs">
                    {slots
                      .find((s) => s.id === selectedSlotId)
                      ?.journeyLogs.map((log, idx) => (
                        <div key={idx} className="relative group">
                          <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-theme-surface shadow-sm" />
                          <div className="flex items-center space-x-2 font-bold text-amber-200">
                            <span>公元 {log.year} 年</span>
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
                  <h3 className="text-base font-bold text-theme-gold flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-theme-gold" />
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
                        ? 'bg-amber-500/20 text-amber-200 font-bold'
                        : 'text-theme-text-muted hover:text-theme-text'
                    }`}
                  >
                    全部答卷 ({studyRecords.length})
                  </button>
                  <button
                    onClick={() => setStudyFilter('mistakes')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center space-x-1 ${
                      studyFilter === 'mistakes'
                        ? 'bg-red-500/20 text-red-300 font-bold'
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
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
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
                    className="p-5 rounded-xl border border-theme-border bg-theme-surface-card hover:border-theme-gold/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-poetry">
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
                          className={`px-2.5 py-1 rounded-md border-2 text-xs font-bold tracking-wider select-none ${
                            rec.score === 100
                              ? 'border-emerald-500/60 bg-emerald-950/20 text-emerald-300'
                              : rec.score >= 70
                              ? 'border-amber-500/60 bg-amber-950/20 text-amber-300'
                              : 'border-red-500/60 bg-red-950/20 text-red-300'
                          }`}
                        >
                          {rec.grade}
                        </div>
                      </div>

                      {/* 错题辨析区 */}
                      {rec.mistakes.length > 0 ? (
                        <div className="mt-3 p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-xs space-y-2">
                          <div className="text-red-300 font-bold flex items-center space-x-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>错题点拨（{rec.mistakes.length} 处需砥砺）：</span>
                          </div>
                          {rec.mistakes.map((m, idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="text-theme-text">
                                原句：<span className="font-bold text-amber-200">{m.lineSnippet}</span>
                              </p>
                              <p className="text-theme-text-muted">
                                误选为：<span className="line-through text-red-400 font-bold">{m.chosenOption}</span>，正解应为：
                                <span className="text-emerald-400 font-bold">【{m.correctOption}】</span>
                              </p>
                              <p className="text-amber-200/80 leading-relaxed bg-black/20 p-2 rounded">
                                ✦ 名师辨析：{m.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-300 flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>一字无差，尽得文豪风骨神韵！</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-theme-border/50 flex justify-end">
                      <button
                        onClick={() => {
                          if (onRetryPoem) {
                            onClose();
                            onRetryPoem(rec.poemId);
                          } else {
                            alert(`即将载入《${rec.poemTitle}》进行错题重练与再次推敲！`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 text-xs font-bold transition-all active:scale-95 flex items-center space-x-1 cursor-pointer"
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
                  <h3 className="text-base font-bold text-theme-gold flex items-center space-x-2">
                    <Bookmark className="w-4 h-4 text-theme-gold" />
                    <span>文心墨札 · 研学笔记与随笔库</span>
                  </h3>
                  <p className="text-xs text-theme-text-muted mt-0.5">
                    记录游历诗境时的诗意顿悟、字句赏析与心得，可一键凝结为水墨书签
                  </p>
                </div>

                <button
                  onClick={() => setIsWritingNote(!isWritingNote)}
                  className="px-3.5 py-1.5 rounded-full bg-amber-600/80 hover:bg-amber-600 text-amber-100 text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>✍ 提笔写新札记</span>
                </button>
              </div>

              {/* 提笔写札记抽屉 */}
              {isWritingNote && (
                <form
                  onSubmit={handleSaveNewNote}
                  className="p-5 rounded-xl bg-amber-950/20 border border-amber-700/40 space-y-3 text-xs animate-fadeIn"
                >
                  <h4 className="font-bold text-amber-300 text-sm">✦ 题写文心墨札</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="札记题头（如：《蜀道难》险绝意象感悟）"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="px-3 py-2 rounded border border-theme-border bg-theme-surface text-xs focus:outline-none focus:border-theme-gold"
                      required
                    />
                    <select
                      value={newNoteTag}
                      onChange={(e) => setNewNoteTag(e.target.value)}
                      className="px-3 py-2 rounded border border-theme-border bg-theme-surface text-xs focus:outline-none focus:border-theme-gold"
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
                    className="w-full p-3 rounded border border-theme-border bg-theme-surface text-xs leading-relaxed focus:outline-none focus:border-theme-gold"
                    required
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsWritingNote(false)}
                      className="px-3 py-1.5 rounded border border-theme-border text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-amber-100 rounded font-bold shadow-md transition-colors cursor-pointer"
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
                  className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                    selectedTag === 'all'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-bold'
                      : 'border-theme-border text-theme-text-muted hover:text-theme-text'
                  }`}
                >
                  全部 ({notes.length})
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer flex items-center space-x-1 ${
                      selectedTag === tag
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-bold'
                        : 'border-theme-border text-theme-text-muted hover:text-theme-text'
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
                    className="p-5 rounded-xl border border-theme-border bg-theme-surface-card hover:border-theme-gold/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-base text-theme-gold">{note.title}</h4>
                        <span className="text-[10px] text-theme-text-muted shrink-0 ml-2">
                          {note.createdAtText}
                        </span>
                      </div>

                      {note.poemTitle && (
                        <p className="text-xs text-amber-300/80 mt-1 flex items-center space-x-1">
                          <BookOpen className="w-3 h-3" />
                          <span>
                            关联：《{note.poemTitle}》· {note.poetName}（{note.locationName}）
                          </span>
                        </p>
                      )}

                      <p className="text-xs text-theme-text leading-relaxed mt-2.5 bg-theme-surface/50 p-3 rounded-lg border border-theme-border/40 whitespace-pre-line">
                        {note.content}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {note.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-theme-border/50 flex justify-end">
                      <button
                        onClick={() => setBookmarkPreviewNote(note)}
                        className="px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 text-xs font-bold transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Share2 className="w-3 h-3 text-amber-300" />
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
        <div className="px-6 py-3 border-t border-theme-border bg-theme-surface-card/60 flex items-center justify-between text-xs text-theme-text-muted shrink-0">
          <span>唐宋山河诗境 · 个人文心书斋已就绪 (Demo 体验版)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-theme-surface border border-theme-border hover:border-theme-gold text-theme-text hover:text-theme-gold transition-colors cursor-pointer"
          >
            返回大地图游历
          </button>
        </div>
      </div>

      {/* 墨宝书签卡生成预览模态 (Demo) */}
      {bookmarkPreviewNote && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#f4ecd8] text-stone-900 border-4 border-amber-900/60 rounded-xl shadow-2xl p-6 font-poetry flex flex-col items-center">
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

            <div className="text-center border-b border-stone-400/60 pb-3 w-full">
              <span className="text-[10px] text-stone-600 tracking-widest block">
                唐宋山河诗境 · 文心墨札
              </span>
              <h3 className="text-lg font-bold text-amber-950 mt-1">
                {bookmarkPreviewNote.title}
              </h3>
            </div>

            <div className="my-5 w-full bg-stone-100/60 p-4 rounded border border-stone-300 text-xs text-stone-800 leading-relaxed italic">
              “{bookmarkPreviewNote.content}”
            </div>

            <div className="w-full flex items-center justify-between text-[11px] text-stone-600 border-t border-stone-300 pt-3">
              <span>雅士：{currentUser.penName}</span>
              <div className="w-8 h-8 border border-red-700 bg-red-800/10 rounded flex items-center justify-center text-red-700 font-bold text-[9px] select-none">
                研墨
              </div>
            </div>

            <button
              onClick={() => {
                alert('墨宝书签卡已复制至剪贴板（模拟）！');
                setBookmarkPreviewNote(null);
              }}
              className="mt-5 w-full py-2 rounded bg-amber-900 text-amber-100 text-xs font-bold hover:bg-amber-800 transition-colors cursor-pointer"
            >
              保存 / 分享墨宝书签
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
