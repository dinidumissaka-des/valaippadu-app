'use client';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
      <button
        className={cn('px-3 py-1.5 text-xs font-semibold transition-colors',
          lang === 'en' ? 'bg-white text-slate-900 border-r border-slate-200' : 'text-slate-400 hover:text-slate-600')}
        onClick={() => setLang('en')}
      >
        EN
      </button>
      <button
        className={cn('px-3 py-1.5 text-xs font-semibold transition-colors',
          lang === 'ta' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-slate-600')}
        onClick={() => setLang('ta')}
      >
        தமிழ்
      </button>
    </div>
  );
}
