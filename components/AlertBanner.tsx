'use client';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export function AlertBanner() {
  const { t } = useLanguage();
  return (
    <div
      className="mx-4 flex items-start gap-3 px-4 py-3.5"
      style={{
        backgroundColor: '#FFF1EE',
        borderRadius: 12,
        borderLeft: '4px solid #C13515',
      }}
    >
      <AlertTriangle size={18} color="#C13515" style={{ marginTop: 1, flexShrink: 0 }} />
      <div>
        <p style={{ fontSize: 13, fontFamily: 'var(--font-manrope)', fontWeight: 700, color: '#C13515', margin: 0 }}>
          {t('do_not_cultivate')}
        </p>
        <p style={{ fontFamily: 'var(--font-noto-tamil)', fontSize: 12, color: '#C13515', margin: '3px 0 0' }}>
          இன்று பயிரிட வேண்டாம்
        </p>
      </div>
    </div>
  );
}
