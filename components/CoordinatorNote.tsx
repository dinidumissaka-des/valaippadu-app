'use client';
import { MessageSquareMore } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  text:       string;
  postedAt?:  string;
  onClear?:   () => void;
  showClear?: boolean;
}

export function CoordinatorNote({ text, postedAt, onClear, showClear = false }: Props) {
  const { t } = useLanguage();
  return (
    <div className="mx-4 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex gap-2">
      <MessageSquareMore size={15} color="#d97706" style={{ marginTop: 1, flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span style={{ fontSize: 10, fontFamily: 'var(--font-manrope)', fontWeight: 600, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            {t('coordinator_message')}
          </span>
          {showClear && onClear && (
            <button onClick={onClear} className="ml-2 shrink-0">
              <span style={{ fontSize: 10, color: '#d97706', textDecoration: 'underline' }}>{t('clear_note')}</span>
            </button>
          )}
        </div>
        <p style={{ fontSize: 12, color: '#92400e', lineHeight: '17px', fontFamily: 'var(--font-manrope)', margin: 0 }}>
          {text}
        </p>
        {postedAt && (
          <span style={{ fontSize: 9, color: '#d97706', marginTop: 4, display: 'block' }}>
            {new Date(postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}
