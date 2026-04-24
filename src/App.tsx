import { useState } from 'react';
import { Truck, Settings as SettingsIcon, History, DownloadCloud } from 'lucide-react';
import { useSettings } from './hooks/useSettings';
import { SettingsView } from './components/SettingsView';
import { DashboardView } from './components/DashboardView';
import { HistoriqueView } from './components/HistoriqueView';
import { cn } from './lib/utils';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'historique'>('dashboard');
  const { settings, updateSetting, isLoaded } = useSettings();

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 font-sans flex flex-col overflow-hidden" dir="rtl">
      <header className="bg-slate-900 border-b border-slate-800 px-6 sm:px-8 py-4 flex flex-wrap lg:flex-nowrap justify-between items-center gap-4 shadow-lg z-10 shrink-0">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-reverse space-x-4"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded flex items-center justify-center text-white shadow-inner border border-amber-400/20">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase flex gap-1">
            SME <span className="text-amber-500">CADEX</span>
          </h1>
        </motion.div>
        
        <nav className="flex items-center space-x-reverse space-x-2 w-full lg:w-auto justify-end">
          
          <a
            href="/download-github-ready.zip"
            download
            className="px-3 sm:px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 border bg-emerald-600 border-emerald-500 text-white shadow-md hover:bg-emerald-500 z-10 animate-pulse ml-2"
          >
            <DownloadCloud className="w-4 h-4" />
            <span className="hidden lg:inline">تحميل ملفات GitHub</span>
          </a>

          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "px-3 sm:px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 border relative",
              activeTab === 'settings' 
                ? "bg-amber-600 border-amber-500 text-white shadow-md z-10" 
                : "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
            )}
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="hidden lg:inline">إعدادات النظام</span>
          </button>
          <button
            onClick={() => setActiveTab('historique')}
            className={cn(
              "px-3 sm:px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 border relative",
              activeTab === 'historique' 
                ? "bg-amber-600 border-amber-500 text-white shadow-md z-10" 
                : "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
            )}
          >
            <History className="w-4 h-4" />
            <span className="hidden lg:inline">السجل</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "px-3 sm:px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 border relative",
              activeTab === 'dashboard' 
                ? "bg-amber-600 border-amber-500 text-white shadow-md z-10" 
                : "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
            )}
          >
            <span className="hidden lg:inline">📊</span> لوحة التحكم
          </button>
        </nav>
      </header>

      <main className="flex-1 overflow-hidden relative bg-[#f8f9fa]">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full flex"
            >
              <DashboardView settings={settings} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full overflow-y-auto"
            >
              <div className="max-w-4xl mx-auto py-8">
                 <div className="mb-6 px-4">
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">إعدادات النظام الأساسية</h2>
                  <p className="text-slate-500 mt-1">تخصيص السائقين، العمال، الوجهات والمهام.</p>
                </div>
                <SettingsView settings={settings} onUpdate={updateSetting} />
              </div>
            </motion.div>
          )}

          {activeTab === 'historique' && (
            <motion.div
              key="historique"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full flex"
            >
              <HistoriqueView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-900 text-slate-400 px-6 sm:px-8 py-3 text-xs flex justify-between items-center shrink-0">
        <p>© {new Date().getFullYear()} SME AFFECTATION SYSTEM - ALL RIGHTS RESERVED</p>
        <div className="flex space-x-reverse space-x-4">
          <span>v3.0.0-PRO</span>
          <span className="hidden sm:inline">Support: tech@sme.ma</span>
        </div>
      </footer>
    </div>
  );
}
