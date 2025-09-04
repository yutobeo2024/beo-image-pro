/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { getHistory, HistoryEntry, HistoryEntryType } from '../services/historyService';
import { CloseIcon } from './icons';

const timeAgo = (timestamp: number): string => {
    const now = new Date();
    const secondsPast = (now.getTime() - timestamp) / 1000;
  
    if (secondsPast < 60) {
      return `${Math.round(secondsPast)} giây trước`;
    }
    if (secondsPast < 3600) {
      return `${Math.round(secondsPast / 60)} phút trước`;
    }
    if (secondsPast <= 86400) {
      return `${Math.round(secondsPast / 3600)} giờ trước`;
    }
    const day = new Date(timestamp);
    return day.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const typeTranslations: Record<HistoryEntryType, string> = {
    retouch: 'Chỉnh sửa',
    adjustment: 'Tùy chỉnh',
    filter: 'Bộ lọc',
};


const HistoryModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
    >
        <div 
            className="relative w-full max-w-2xl max-h-[80vh] flex flex-col bg-slate-800/90 border border-slate-700 rounded-lg shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
        >
            <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                <h2 id="history-modal-title" className="text-lg font-semibold text-slate-200">Lịch sử Chỉnh sửa</h2>
                <button 
                    onClick={onClose} 
                    className="p-2 text-slate-400 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Đóng"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>
            </header>

            <main className="flex-grow p-4 overflow-y-auto">
                {history.length > 0 ? (
                    <ul className="space-y-3">
                        {history.map(entry => (
                            <li key={entry.id} className="p-3 bg-slate-900/50 border border-slate-700/50 rounded-md flex items-start gap-4">
                                {entry.imageUrl && (
                                    <img 
                                        src={entry.imageUrl} 
                                        alt={`Bản xem trước của: ${entry.prompt}`}
                                        className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-slate-700" 
                                    />
                                )}
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${entry.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <span className="font-semibold text-slate-300">{typeTranslations[entry.type]}</span>
                                        <span className="text-xs text-slate-500">{timeAgo(entry.timestamp)}</span>
                                    </div>
                                    <p className="text-sm text-slate-400 break-words">&quot;{entry.prompt}&quot;</p>
                                    {entry.status === 'error' && (
                                        <p className="mt-1 text-xs text-red-400/80 bg-red-500/10 p-1 rounded break-words">Lỗi: {entry.error}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                        <p className="font-semibold">Không có lịch sử</p>
                        <p className="text-sm">Các chỉnh sửa của bạn sẽ xuất hiện ở đây.</p>
                    </div>
                )}
            </main>
        </div>
    </div>
  );
};

export default HistoryModal;