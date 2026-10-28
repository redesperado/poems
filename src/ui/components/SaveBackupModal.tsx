import React, { useState } from 'react';
import { exportAllSavesJSON, importSavesJSON } from '../../engine/save/db';
import { soundEngine } from '../../engine/audio/soundEngine';
import { Download, Upload, X, ShieldCheck, Database, Check, AlertTriangle } from 'lucide-react';

interface SaveBackupModalProps {
  onClose: () => void;
  onRefreshSave?: () => void;
}

export const SaveBackupModal: React.FC<SaveBackupModalProps> = ({ onClose, onRefreshSave }) => {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleExport = async () => {
    try {
      const jsonStr = await exportAllSavesJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `唐宋山河诗境_离线存档备份_${new Date().toISOString().slice(0, 10)}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      soundEngine.playJadeChime();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      const success = await importSavesJSON(content);
      if (success) {
        setImportStatus('success');
        setStatusMessage('离线存档导入恢复成功！即将重新载入...');
        soundEngine.playJadeChime();
        setTimeout(() => {
          if (onRefreshSave) {
            onRefreshSave();
          } else {
            window.location.reload();
          }
        }, 1200);
      } else {
        setImportStatus('error');
        setStatusMessage('存档文件格式不正确，未能成功恢复');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-md bg-theme-canvas border-2 border-theme-border rounded-3xl shadow-2xl p-6 text-theme-text space-y-4">
        {/* 标题栏 */}
        <div className="flex items-center justify-between border-b border-theme-border pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center text-theme-primary shadow-xs">
              <Database className="w-4 h-4 text-theme-primary" />
            </div>
            <div>
              <h3 className="font-bold font-poetry text-base text-theme-text">
                离线游历存档与跨端备份
              </h3>
              <p className="text-[11px] text-theme-text-muted">
                100% 本地 IndexedDB 离线存储，数据自主可控
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-theme-surface-card hover:bg-theme-surface border border-theme-border flex items-center justify-center text-theme-text-muted hover:text-theme-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 状态提示 */}
        <div className="p-3.5 rounded-2xl bg-theme-surface-card/70 border border-theme-border text-xs space-y-1.5 leading-relaxed">
          <div className="flex items-center space-x-1.5 text-theme-primary font-bold font-poetry">
            <ShieldCheck className="w-4 h-4 text-theme-primary" />
            <span>无服务器依赖 · 本地离线即时存储</span>
          </div>
          <p className="text-theme-text-muted leading-relaxed">
            您在《唐宋山河诗境》中游历的四大文宗历史时间轴、已解锁传世诗篇、千古相遇羁绊与山河行囊风物均安全保存在当前浏览器的离线数据库中。跨设备体验或清理浏览器前，建议随时导出备份。
          </p>
        </div>

        {/* 操作卡片 */}
        <div className="space-y-3 pt-1">
          {/* 导出 */}
          <button
            onClick={handleExport}
            className="w-full p-3.5 rounded-2xl bg-theme-surface-card hover:bg-theme-surface border border-theme-border hover:border-theme-primary/60 transition-all flex items-center justify-between group active:scale-[0.99] cursor-pointer shadow-xs"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold font-poetry text-xs sm:text-sm text-theme-text group-hover:text-theme-primary">
                  导出离线存档 (JSON)
                </h4>
                <p className="text-[11px] text-theme-text-muted">
                  下载全量诗词、信物风物与游历进度为备份文件
                </p>
              </div>
            </div>
            <span className="text-xs text-theme-primary font-bold">导出 ➔</span>
          </button>

          {/* 导入 */}
          <label className="w-full p-3.5 rounded-2xl bg-theme-surface-card hover:bg-theme-surface border border-theme-border hover:border-theme-primary/60 transition-all flex items-center justify-between group active:scale-[0.99] cursor-pointer shadow-xs">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold font-poetry text-xs sm:text-sm text-theme-text group-hover:text-theme-primary">
                  导入恢复存档 (JSON)
                </h4>
                <p className="text-[11px] text-theme-text-muted">
                  从之前导出的 JSON 备份文件中恢复所有游历成果
                </p>
              </div>
            </div>
            <span className="text-xs text-emerald-600 font-bold">上传 ➔</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* 结果反馈信息 */}
        {importStatus !== 'idle' && (
          <div
            className={`p-3 rounded-2xl border text-xs flex items-center space-x-2 animate-in fade-in ${
              importStatus === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}
          >
            {importStatus === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
