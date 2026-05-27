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
    <div
      className="mx-4 flex gap-3 px-4 py-3.5"
      style={{
        backgroundColor: '#FFF9EC',
        borderRadius: 12,
        borderLeft: '4px solid #C47D00',
      }}
    >
      <MessageSquareMore size={16} color="#C47D00" style={{ marginTop: 1, flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          <span style={{ fontSize: 11, fontFamily: 'var(--font-manrope)', fontWeight: 700, color: '#C47D00', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            {t('coordinator_message')}
          </span>
          {showClear && onClear && (
            <button onClick={onClear} className="ml-2">
              <span style={{ fontSize: 11, color: '#C47D00', textDecoration: 'underline', fontFamily: 'var(--font-manrope)' }}>
                {t('clear_note')}
              </span>
            </button>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#484848', lineHeight: '19px', fontFamily: 'var(--font-manrope)', margin: 0 }}>
          {text}
        </p>
        {postedAt && (
          <span style={{ fontSize: 11, color: '#B0B0B0', marginTop: 6, display: 'block' }}>
            {new Date(postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}
