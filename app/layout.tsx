import type { Metadata } from 'next';
import { Manrope, Noto_Sans_Tamil } from 'next/font/google';
import '../global.css';
import { Providers } from './providers';

const manrope = Manrope({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display:  'swap',
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets:  ['tamil'],
  weight:   ['400', '700'],
  variable: '--font-noto-tamil',
  display:  'swap',
});

export const metadata: Metadata = {
  title:       'Valaippadu',
  description: 'Seaweed cultivation suitability score for Palk Bay farmers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta" className={`${manrope.variable} ${notoSansTamil.variable}`}>
      <body className="bg-slate-50 font-manrope antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
