/**
 * Middleware de Segurança e Ofuscação
 * Intercepta requests e aplica proteções avançadas
 */

import { NextRequest, NextResponse } from 'next/server';

// Lista de user agents suspeitos para bloqueio
const BLOCKED_USER_AGENTS = [
  /bot/i, /spider/i, /crawl/i, /scrape/i, /phantom/i,
  /headless/i, /puppeteer/i, /selenium/i, /playwright/i,
  /chrome-lighthouse/i, /python-requests/i, /curl/i,
  /wget/i, /http/i, /axios/i, /postman/i
];

// IPs suspeitos (exemplos - adaptar conforme necessário)
const BLOCKED_IPS = [
  '127.0.0.1', // Exemplo - remover em produção
];

// Função para gerar hash de asset ofuscado
function generateAssetHash(originalPath: string): string {
  const timestamp = Date.now();
  const combined = originalPath + timestamp + process.env.SECRET_KEY || 'default-secret';
  
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

// Middleware para proteger assets
function protectAssets(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  
  // Proteger arquivos sensíveis
  const sensitiveFiles = [
    '.env', '.git', 'package.json', 'tsconfig.json',
    'next.config.ts', '.eslintrc', 'README.md'
  ];
  
  if (sensitiveFiles.some(file => pathname.includes(file))) {
    return new NextResponse('Not Found', { status: 404 });
  }
  
  // Ofuscar paths de imagens e assets estáticos
  if (pathname.includes('/screens/') || 
      pathname.includes('/icons/') || 
      pathname.includes('/_next/static/')) {
    
    // Adicionar headers para dificultar cache e download
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'no-referrer');
    
    // Adicionar timestamp para invalidar links diretos
    const url = request.nextUrl.clone();
    if (!url.searchParams.has('_t')) {
      url.searchParams.set('_t', Date.now().toString());
      return NextResponse.redirect(url);
    }
    
    return response;
  }
  
  return null;
}

// Detecção e bloqueio de bots - versão mais leniente
function detectAndBlockBots(request: NextRequest): NextResponse | null {
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
  
  // Apenas bloquear bots muito óbvios
  const obviousBots = [
    /bot.*scrape/i,
    /curl/i,
    /wget/i,
    /python-requests/i
  ];
  
  if (obviousBots.some(pattern => pattern.test(userAgent))) {
    console.log(`Blocked obvious bot: ${userAgent} from ${ip}`);
    return new NextResponse('Access Denied - Bot Detected', { 
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        'X-Block-Reason': 'OBVIOUS_BOT'
      }
    });
  }
  
  // Permitir tudo mais para não quebrar funcionalidade
  return null;
}

// Headers de segurança básicos - não restritivos
function addSecurityHeaders(response: NextResponse): NextResponse {
  const securityHeaders = {
    // Headers básicos que não quebram funcionalidade
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN', // Permitir iframe se necessário
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Remover headers que podem interferir com CSS/JS
    'X-Powered-By': 'illunare'
  };
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// Middleware principal
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // EM DESENVOLVIMENTO - DESABILITAR COMPLETAMENTE
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }
  
  // SEMPRE permitir recursos essenciais mesmo em produção
  const isEssentialResource = (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/_next/image') ||
    pathname.includes('.css') ||
    pathname.includes('.js') ||
    pathname.includes('.png') ||
    pathname.includes('.jpg') ||
    pathname.includes('.svg') ||
    pathname.includes('.ico') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.webmanifest'
  );
  
  if (isEssentialResource) {
    return NextResponse.next();
  }
  
  // Aplicar segurança apenas para páginas HTML específicas em produção
  const isSecurityEnabled = pathname === '/' || pathname.startsWith('/api/');
  
  if (!isSecurityEnabled) {
    return NextResponse.next();
  }
  
  try {
    // 1. Detectar e bloquear bots
    const botBlock = detectAndBlockBots(request);
    if (botBlock) return botBlock;
    
    // 2. Proteger assets
    const assetProtection = protectAssets(request);
    if (assetProtection) return assetProtection;
    
    // 3. Bloquear acesso direto a páginas sensíveis
    if (pathname.includes('/admin') || 
        pathname.includes('/debug') || 
        pathname.includes('/.well-known')) {
      return new NextResponse('Not Found', { status: 404 });
    }
    
    // 4. Adicionar headers de segurança a todas as responses
    const response = NextResponse.next();
    
    // Adicionar headers apenas para páginas HTML
    if (pathname.endsWith('/') || 
        pathname.endsWith('.html') || 
        !pathname.includes('.')) {
      addSecurityHeaders(response);
      
      // Adicionar nonce para scripts inline
      const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
      response.headers.set('X-Nonce', nonce);
    }
    
    // 5. Log de tentativas de acesso para monitoramento
    if (process.env.NODE_ENV === 'production') {
      console.log(`[SECURITY] ${request.method} ${pathname} - ${request.headers.get('user-agent')?.substring(0, 100)}`);
    }
    
    return response;
    
  } catch (error) {
    console.error('[SECURITY] Middleware error:', error);
    return new NextResponse('Internal Security Error', { status: 500 });
  }
}

// Configuração do matcher - mais restritiva para não interferir com recursos
export const config = {
  matcher: [
    /*
     * Match apenas páginas específicas, não todos os recursos
     */
    '/',
    '/api/:path*',
  ],
};