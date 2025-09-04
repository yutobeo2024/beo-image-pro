/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { SparkleIcon } from './icons';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      if (username === 'admin' && password === 'password123') {
        onLoginSuccess();
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không hợp lệ.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center p-8 transition-all duration-300 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <SparkleIcon className="w-8 h-8 text-teal-400" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">
              BEO IMAGE PRO
            </h1>
          </div>
          <p className="text-slate-400">Vui lòng đăng nhập để tiếp tục</p>

          <form onSubmit={handleSubmit} className="w-full mt-6 flex flex-col gap-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên đăng nhập"
              className="bg-slate-800 border border-slate-600 text-slate-200 rounded-lg p-4 text-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition w-full"
              disabled={isLoading}
              aria-label="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="bg-slate-800 border border-slate-600 text-slate-200 rounded-lg p-4 text-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition w-full"
              disabled={isLoading}
              aria-label="Password"
            />

            {error && (
              <p className="text-red-400 text-sm animate-fade-in">{error}</p>
            )}

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-br from-teal-600 to-teal-500 text-white font-bold py-4 px-8 text-lg rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-teal-800 disabled:to-teal-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
