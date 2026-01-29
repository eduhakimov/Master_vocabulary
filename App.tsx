
import React, { useState, useEffect } from 'react';
import { db, getFromLocalStorage, saveToLocalStorage, requestPersistence } from './db';
import { ThemeMode, TestSettings, WordItem, AppThemeColor } from './types';
import { SunIcon, MoonIcon, HomeIcon, BrushIcon } from './components/Icons';
import Dashboard from './views/Dashboard';
import ImportView from './views/ImportView';
import SettingsView from './views/SettingsView';
import TestSessionView from './views/TestSessionView';
import ResultsView from './views/ResultsView';

const THEME_COLORS: Record<AppThemeColor, string> = {
  blue: '#3b82f6',
  green: '#10b981',
  pink: '#ec4899',
  red: '#ef4444',
  orange: '#f59e0b'
};

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'import' | 'settings' | 'test' | 'results'>('dashboard');
  const [theme, setTheme] = useState<ThemeMode>(getFromLocalStorage('theme') || 'light');
  const [accentColor, setAccentColor] = useState<AppThemeColor>(getFromLocalStorage('accentColor') || 'blue');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [testSettings, setTestSettings] = useState<TestSettings | null>(null);
  const [isDbReady, setIsDbReady] = useState(false);
  const [sessionResults, setSessionResults] = useState<{
    correctCount: number;
    mistakes: WordItem[];
    totalTime: number;
    avgTime: number;
  } | null>(null);

  useEffect(() => {
    const initApp = async () => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      saveToLocalStorage('theme', theme);

      document.documentElement.style.setProperty('--theme-primary', THEME_COLORS[accentColor]);
      saveToLocalStorage('accentColor', accentColor);

      await requestPersistence();
      try {
        // Now that db.ts is fixed, isOpen() and open() are correctly recognized as methods inherited from Dexie
        if (!db.isOpen()) {
          await db.open();
        }
        setIsDbReady(true);
      } catch (err) {
        setIsDbReady(true);
      }
    };
    initApp();
  }, [theme, accentColor]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const startTest = (settings: TestSettings) => {
    setTestSettings(settings);
    setView('test');
  };

  const finishTest = async (results: { correctCount: number; mistakes: WordItem[]; totalTime: number; avgTime: number }) => {
    if (testSettings) {
      await db.history.add({
        date: Date.now(),
        unitNames: testSettings.units.join(', '),
        correct: results.correctCount,
        total: results.correctCount + results.mistakes.length,
        totalTime: results.totalTime,
        avgTime: results.avgTime
      });
    }
    setSessionResults(results);
    setView('results');
  };

  if (!isDbReady) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-primary animate-pulse font-bold text-xl">Master Voc. yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto shadow-xl bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 relative">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('dashboard')}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
            MV
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 italic">Master Voc.</h1>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="relative">
            <button onClick={() => setIsColorPickerOpen(!isColorPickerOpen)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
              <BrushIcon />
            </button>
            {isColorPickerOpen && (
              <div className="absolute top-full right-0 mt-2 p-2 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-700 flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                {(Object.keys(THEME_COLORS) as AppThemeColor[]).map(c => (
                  <button key={c} onClick={() => { setAccentColor(c); setIsColorPickerOpen(false); }} className={`w-6 h-6 rounded-full border-2 transition-transform ${accentColor === c ? 'scale-110 border-slate-400 dark:border-white' : 'border-transparent opacity-60 hover:opacity-100'}`} style={{ backgroundColor: THEME_COLORS[c] }} />
                ))}
              </div>
            )}
          </div>
          {view !== 'dashboard' && (
            <button onClick={() => setView('dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
              <HomeIcon />
            </button>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        {view === 'dashboard' && <Dashboard onImportClick={() => setView('import')} onStartClick={() => setView('settings')} />}
        {view === 'import' && <ImportView onComplete={() => setView('dashboard')} onCancel={() => setView('dashboard')} />}
        {view === 'settings' && <SettingsView onStart={startTest} onCancel={() => setView('dashboard')} />}
        {view === 'test' && testSettings && <TestSessionView settings={testSettings} onFinish={finishTest} onCancel={() => setView('dashboard')} />}
        {view === 'results' && sessionResults && <ResultsView results={sessionResults} onRetry={() => setView('settings')} onGoHome={() => setView('dashboard')} />}
      </main>

      <footer className="p-4 text-center text-[10px] text-slate-400 dark:text-slate-600 border-t border-slate-100 dark:border-slate-800 uppercase tracking-widest font-bold">
        Master Voc. &copy; {new Date().getFullYear()} • OFLAYN REJIM
      </footer>
    </div>
  );
};

export default App;
