/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { HistoryIcon, SparkleIcon, LogoutIcon } from './icons';

interface HeaderProps {
  onHistoryClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHistoryClick, onLogout }) => {
  return (
    <header className="w-full py-4 px-8 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SparkleIcon className="w-6 h-6 text-teal-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              BEO IMAGE PRO
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onHistoryClick}
              className="p-2 text-slate-400 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Xem lịch sử chỉnh sửa"
            >
              <HistoryIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Đăng xuất"
            >
              <LogoutIcon className="w-6 h-6" />
            </button>
          </div>
      </div>
    </header>
  );
};

export default Header;
