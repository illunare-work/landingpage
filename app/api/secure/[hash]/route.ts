/**
 * API Route para Assets Seguros
 * Serve imagens e recursos de forma ofuscada e protegida
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Mapeamento de hashes para arquivos reais (em produção, usar cache/database)
// const assetMap = new Map<string, string>();

// Função para validar hash de asset
// function validateAssetHash(hash: string, originalPath: string): boolean {
//   const timestamp = Date.now();
//   const validWindow = 5 * 60 * 1000; // 5 minutos
//   
//   // Validar formato do hash
//   if (!/^[a-zA-Z0-9]{8,16}$/.test(hash)) {
//     return false;
//   }
//   
//   // Em produção, implementar validação mais robusta
//   return true;
// }

// Função para detectar bots/scrapers
function detectBot(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  
  const botPatterns = [
    /bot/i, /spider/i, /crawl/i, /scrape/i,
    /phantom/i, /headless/i, /puppeteer/i, /selenium/i
  ];
  
  // Bloquear se não há referer válido
  if (!referer || !referer.includes(process.env.NEXT_PUBLIC_SITE_URL || 'localhost')) {
    return true;
  }
  
  return botPatterns.some(pattern => pattern.test(userAgent));
}

// GET - Servir asset protegido
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;
    const searchParams = request.nextUrl.searchParams;
    const timestamp = searchParams.get('_t');
    const providedHash = searchParams.get('_h');
    
    // Verificações de segurança
    if (detectBot(request)) {
      return new NextResponse('Access Denied', { status: 403 });
    }
    
    if (!hash || !timestamp || !providedHash) {
      return new NextResponse('Invalid Request', { status: 400 });
    }
    
    // Validar timestamp (link expira em 1 hora)
    const timestampNum = parseInt(timestamp);
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hora
    
    if (now - timestampNum > maxAge) {
      return new NextResponse('Link Expired', { status: 410 });
    }
    
    // Rate limiting básico por IP
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    // const rateLimitKey = `asset_${clientIp}`;
    
    // Em produção, implementar rate limiting com Redis
    
    // Mapear hash para arquivo real
    let filePath: string;
    
    // Decodificar o hash para o caminho original
    // Implementação simplificada - em produção usar criptografia mais robusta
    if (hash.startsWith('screen')) {
      const screenNum = hash.replace('screen', '');
      filePath = path.join(process.cwd(), 'public', 'screens', `${screenNum}.png`);
    } else if (hash.startsWith('icon')) {
      const iconPath = hash.replace('icon', '').replace(/\./g, '/');
      filePath = path.join(process.cwd(), 'public', 'icons', `${iconPath}.svg`);
    } else {
      return new NextResponse('Asset Not Found', { status: 404 });
    }
    
    // Verificar se arquivo existe
    try {
      await fs.access(filePath);
    } catch {
      return new NextResponse('Asset Not Found', { status: 404 });
    }
    
    // Ler arquivo
    const fileBuffer = await fs.readFile(filePath);
    
    // Determinar content type
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
    }
    
    // Headers de segurança para assets
    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Download-Options': 'noopen',
      'Content-Security-Policy': "default-src 'none'",
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
      
      // Headers customizados para detecção
      'X-Asset-ID': hash,
      'X-Served-At': new Date().toISOString(),
      'X-Security-Level': 'MAXIMUM'
    });
    
    // Log de acesso para monitoramento
    console.log(`[SECURE-ASSET] ${clientIp} accessed ${hash} at ${new Date().toISOString()}`);
    
    return new NextResponse(fileBuffer, { headers });
    
  } catch (error) {
    console.error('[SECURE-ASSET] Error serving asset:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST - Endpoint para validar acesso
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;
    const body = await request.json();
    const { challenge, timestamp } = body;
    
    // Verificações de segurança
    if (detectBot(request)) {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 });
    }
    
    // Validar challenge (implementar lógica de desafio-resposta)
    const expectedChallenge = btoa(`${hash}_${timestamp}_${process.env.SECRET_KEY}`);
    
    if (challenge !== expectedChallenge) {
      return NextResponse.json({ error: 'Invalid Challenge' }, { status: 401 });
    }
    
    // Retornar token de acesso temporário
    const accessToken = btoa(`${hash}_${Date.now()}_${Math.random()}`);
    
    return NextResponse.json({
      success: true,
      accessToken,
      expiresIn: 3600 // 1 hora
    });
    
  } catch (error) {
    console.error('[SECURE-ASSET] Error validating access:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// OPTIONS - CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}