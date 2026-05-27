'use client';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div style={{ display: 'flex', backgroundColor: '#F7F7F7', borderRadius: 9999, padding: 3, border: '1px solid #EEEEEE' }}>
      {(['en', 'ta'] as const).map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: '5px 14px',
              borderRadius: 9999,
              backgroundColor: active ? '#fff' : 'transparent',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
              fontFamily: l === 'ta' ? 'var(--font-noto-tamil)' : 'var(--font-manrope)',
              fontSize: 12,
              fontWeight: active ? 600 : 400,
              color: active ? '#222222' : '#B0B0B0',
              transition: 'all 0.15s ease',
            }}
          >
            {l === 'en' ? 'EN' : 'தமிழ்'}
          </button>
        );
      })}
    </div>
  );
}
