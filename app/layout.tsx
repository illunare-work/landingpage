import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@radix-ui/react-tooltip';

const inter = Inter({ subsets: ['latin'] });

import '@/styles/globals.css';

export const viewport: Viewport = {
  themeColor: '#0061F2',
};

export const metadata: Metadata = {
  title: {
    template: '%s | illunare',
    default: 'illunare 4.0 — IA multimodal com precisão de nível quântico 🚀',
  },
  description: 'Revolucione seu negócio com nossa plataforma de IA multimodal de gestão avançada. Inovação 4.0 eficiente, rentável e nacional. Teste grátis por 7 dias.',
  keywords: ['IA multimodal', 'inteligência artificial', 'inovação 4.0', 'automação', 'machine learning', 'deep learning', 'análise de dados', 'processamento de linguagem natural', 'visão computacional', 'IA brasileira', 'transformação digital'],
  authors: [{ name: 'illunare Team' }],
  creator: 'illunare',
  publisher: 'illunare',
  robots: 'index, follow',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://illunare.com.br',
    siteName: 'illunare',
    title: 'illunare 4.0 — IA multimodal com precisão de nível quântico 🚀',
    description: 'Revolucione seu negócio com nossa plataforma de IA multimodal de gestão avançada. Inovação 4.0 eficiente, rentável e nacional.',
    images: [
      {
        url: 'https://illunare.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'illunare 4.0 - IA multimodal com precisão de nível quântico'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'illunare 4.0 — IA multimodal com precisão de nível quântico 🚀',
    description: 'Revolucione seu negócio com nossa plataforma de IA multimodal de gestão avançada. Teste grátis por 7 dias.',
    images: ['https://illunare.com.br/og-image.jpg']
  }
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Intercept console methods in production
                if (typeof window !== 'undefined') {
                  const noop = () => {};
                  window.console.error = noop;
                  window.console.warn = noop;
                  window.console.log = noop;
                  window.console.info = noop;
                  window.console.debug = noop;
                  
                  // Intercept window errors
                  window.onerror = () => true;
                  window.addEventListener('unhandledrejection', (e) => e.preventDefault());
                }
              `,
            }}
          />
        )}
      </head>
      <body
        className={cn(
          'antialiased text-base text-foreground bg-background',
          inter.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="illunare-theme"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
