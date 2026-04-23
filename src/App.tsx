import { useState } from 'react';
import { Truck, Settings as SettingsIcon, History } from 'lucide-react';
import { useSettings } from './hooks/useSettings';
import { SettingsView } from './components/SettingsView';
import { DashboardView } from './components/DashboardView';
import { HistoriqueView } from './components/HistoriqueView';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'historique'>('dashboard');
  const { settings, updateSetting, isLoaded } = useSettings();

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden" dir="rtl">
      <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-4 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 shadow-sm z-10 shrink-0">
        <div className="flex items-center space-x-reverse space-x-4">
          <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 uppercase flex gap-1">
            SME <span className="text-indigo-600">CADEX</span>
          </h1>
        </div>
        
        <nav className="flex items-center space-x-reverse space-x-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "px-3 sm:px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2",
              activeTab === 'settings' 
                ? "bg-indigo-600 text-white shadow-sm" 
                : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
            )}
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="hidden sm:inline">إعدادات النظام</span>
          </button>
          <button
            onClick={() => setActiveTab('historique')}
            className={cn(
              "px-3 sm:px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2",
              activeTab === 'historique' 
                ? "bg-indigo-600 text-white shadow-sm" 
                : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
            )}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">السجل</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "px-3 sm:px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2",
              activeTab === 'dashboard' 
                ? "bg-indigo-600 text-white shadow-sm" 
                : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
            )}
          >
            <span className="hidden sm:inline">📊</span> لوحة التحكم
          </button>
        </nav>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'dashboard' && <DashboardView settings={settings} />}
        {activeTab === 'settings' && <SettingsView settings={settings} onUpdate={updateSetting} />}
        {activeTab === 'historique' && <HistoriqueView />}
      </main>

      <footer className="bg-slate-900 text-slate-400 px-6 sm:px-8 py-3 text-xs flex justify-between items-center shrink-0">
        <p>© {new Date().getFullYear()} SME AFFECTATION SYSTEM - ALL RIGHTS RESERVED</p>
        <div className="flex space-x-reverse space-x-4">
          <span>v2.4.0-PRO</span>
          <span className="hidden sm:inline">Support: tech@sme.ma</span>
        </div>
      </footer>
    </div>
  );
}
