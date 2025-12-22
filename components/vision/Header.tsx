import React from 'react';
import { ScanEye, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-teal-600 p-2 rounded-lg">
            <ScanEye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
              HexaCare<span className="text-teal-600">Vision</span>
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Intelligence Platform
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium">
            <Activity className="w-4 h-4" />
            <span>System Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};