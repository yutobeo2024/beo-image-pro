/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface AdjustmentPanelProps {
  onApplyAdjustment: (prompt: string) => void;
  isLoading: boolean;
}

const AdjustmentPanel: React.FC<AdjustmentPanelProps> = ({ onApplyAdjustment, isLoading }) => {
  const [selectedPresetPrompt, setSelectedPresetPrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const presets = [
    { name: 'Đẹp da', prompt: 'Naturally enhance and smooth the skin of any people in the photo. Reduce minor blemishes, wrinkles, and even out the skin tone for a healthy, glowing look, while keeping the result photorealistic and not artificial.' },
    { name: 'Làm mờ nền', prompt: 'Apply a realistic depth-of-field effect, making the background blurry while keeping the main subject in sharp focus.' },
    { name: 'Tăng chi tiết', prompt: 'Slightly enhance the sharpness and details of the image without making it look unnatural.' },
    { name: 'Sáng tự động', prompt: 'Automatically adjust the brightness and contrast of the image to optimal, natural-looking levels. Correct for underexposure or overexposure to create a well-balanced image.' },
    { name: 'Ánh sáng ấm', prompt: 'Adjust the color temperature to give the image warmer, golden-hour style lighting.' },
    { name: 'Đèn studio', prompt: 'Add dramatic, professional studio lighting to the main subject.' },
  ];

  const activePrompt = selectedPresetPrompt || customPrompt;

  const handlePresetClick = (prompt: string) => {
    setSelectedPresetPrompt(prompt);
    setCustomPrompt('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPrompt(e.target.value);
    setSelectedPresetPrompt(null);
  };

  const handleApply = () => {
    if (activePrompt) {
      onApplyAdjustment(activePrompt);
    }
  };

  return (
    <div className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-slate-300">Áp dụng Điều chỉnh Chuyên nghiệp</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset.prompt)}
            disabled={isLoading}
            className={`w-full text-center bg-white/10 border border-transparent text-slate-200 font-semibold py-3 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-white/20 hover:border-white/20 active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed ${selectedPresetPrompt === preset.prompt ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-teal-500' : ''}`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={customPrompt}
        onChange={handleCustomChange}
        placeholder="Hoặc mô tả một điều chỉnh (ví dụ: 'thay nền thành một khu rừng')"
        className="flex-grow bg-slate-800 border border-slate-600 text-slate-200 rounded-lg p-4 focus:ring-2 focus:ring-teal-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
        disabled={isLoading}
      />

      {activePrompt && (
        <div className="animate-fade-in flex flex-col gap-4 pt-2">
            <button
                onClick={handleApply}
                className="w-full bg-gradient-to-br from-teal-600 to-teal-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-teal-800 disabled:to-teal-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading || !activePrompt.trim()}
            >
                Áp dụng Điều chỉnh
            </button>
        </div>
      )}
    </div>
  );
};

export default AdjustmentPanel;