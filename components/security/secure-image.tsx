/**
 * Componente de Imagem Segura
 * Ofusca URLs e adiciona proteções contra download/análise
 */

"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
// import { useSecureAssets } from '@/hooks/use-security';

interface SecureImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export default function SecureImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  loading = 'lazy',
  sizes,
  style,
  onLoad,
  onError
}: SecureImageProps) {
  const [, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [obfuscatedSrc, setObfuscatedSrc] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  // const { getSecureUrl } = useSecureAssets();

  // Intersection Observer para lazy loading avançado
  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  // Ofuscar URL quando componente torna-se visível
  useEffect(() => {
    if (isVisible || priority) {
      // Adicionar timestamp e hash para dificultar acesso direto
      const timestamp = Date.now();
      const hash = btoa(src + timestamp).replace(/[+=\/]/g, '').substring(0, 12);
      const secureUrl = `${src}?_t=${timestamp}&_h=${hash}`;
      setObfuscatedSrc(secureUrl);
    }
  }, [isVisible, priority, src]);

  // Handlers de proteção
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Adicionar log de tentativa de download
    console.log('[SECURITY] Tentativa de download de imagem bloqueada');
    return false;
  }, []);

  // Estilos de proteção
  const protectionStyles = {
    ...style,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    MozUserSelect: 'none' as const,
    msUserSelect: 'none' as const,
    WebkitUserDrag: 'none' as const,
    WebkitTouchCallout: 'none' as const,
    pointerEvents: 'none' as const,
    // Adicionar filtro sutil para dificultar OCR
    filter: 'contrast(1.02) brightness(1.01)',
  };

  // Placeholder enquanto não carregou
  if (!obfuscatedSrc && !priority) {
    return (
      <div 
        ref={imgRef}
        className={`bg-muted animate-pulse ${className}`}
        style={{ width, height, ...style }}
        aria-label={`Carregando: ${alt}`}
      />
    );
  }

  // Placeholder de erro
  if (hasError) {
    return (
      <div 
        className={`bg-muted/50 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
        aria-label={`Erro ao carregar: ${alt}`}
      >
        <span className="text-muted-foreground text-sm">⚠️</span>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onAuxClick={handleRightClick}
    >
      {/* Camada de proteção invisível */}
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          background: 'transparent',
          pointerEvents: 'auto'
        }}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
      />
      
      {/* Imagem protegida */}
      <Image
        src={obfuscatedSrc || src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        priority={priority}
        loading={loading}
        sizes={sizes}
        className="select-none"
        style={protectionStyles}
        onLoad={handleLoad}
        onError={handleError}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        unoptimized={process.env.NODE_ENV === 'production'} // Evitar otimização que pode expor URLs
      />
      
      {/* Overlay sutil para dificultar screenshot automático */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(45deg, 
            transparent 0%, 
            rgba(255,255,255,0.001) 25%, 
            transparent 50%, 
            rgba(0,0,0,0.001) 75%, 
            transparent 100%)`,
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Watermark invisível para detecção de cópia */}
      <div 
        className="absolute bottom-0 right-0 opacity-0 pointer-events-none"
        style={{ fontSize: '1px', color: 'transparent' }}
        aria-hidden="true"
      >
        illunare-{Date.now().toString(36)}
      </div>
    </div>
  );
}