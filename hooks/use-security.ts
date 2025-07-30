/**
 * Hook de Segurança React
 * Integra proteções de segurança nos componentes
 */

import { useEffect, useState } from 'react';
import { SecuritySystem, QuantumCrypt, AssetObfuscator } from '@/lib/security';

export function useSecurity(options: {
  enableProtection?: boolean;
  antiScraping?: boolean;
  obfuscateAssets?: boolean;
} = {}) {
  const {
    enableProtection = true,
    antiScraping = true,
    obfuscateAssets = true
  } = options;

  const [isSecure, setIsSecure] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (enableProtection) {
      SecuritySystem.initialize();
    }

    // Verificação de integridade da página
    const checkIntegrity = () => {
      const scripts = document.querySelectorAll('script');
      const expectedCount = scripts.length;
      
      setTimeout(() => {
        const currentCount = document.querySelectorAll('script').length;
        if (currentCount !== expectedCount) {
          window.location.reload();
        }
      }, 1000);
    };

    checkIntegrity();
    setIsSecure(true);
  }, [enableProtection, antiScraping]);

  const encryptString = (str: string) => QuantumCrypt.encode(str);
  const decryptString = (encrypted: string) => QuantumCrypt.decode(encrypted);
  const obfuscateAsset = (url: string) => obfuscateAssets ? AssetObfuscator.obfuscateUrl(url) : url;

  return {
    isSecure,
    encryptString,
    decryptString,
    obfuscateAsset
  };
}

// Hook para proteger componentes sensíveis
export function useComponentProtection() {
  useEffect(() => {
    // Ofuscar HTML do componente
    const obfuscateComponent = () => {
      const elements = document.querySelectorAll('[data-sensitive]');
      elements.forEach(el => {
        const originalHTML = el.innerHTML;
        const encoded = btoa(originalHTML);
        el.setAttribute('data-encoded', encoded);
        
        // Limpar HTML original após um delay
        setTimeout(() => {
          if (el.getAttribute('data-encoded')) {
            el.innerHTML = '';
          }
        }, 100);
      });
    };

    obfuscateComponent();
  }, []);
}

// Hook para assets protegidos
export function useSecureAssets() {
  const [assetMap, setAssetMap] = useState<Map<string, string>>(new Map());

  const getSecureUrl = (originalUrl: string): string => {
    if (assetMap.has(originalUrl)) {
      return assetMap.get(originalUrl)!;
    }

    // Gerar URL ofuscada
    const timestamp = Date.now();
    const hash = btoa(originalUrl + timestamp).replace(/[+=\/]/g, '');
    const secureUrl = `/secure/${hash.substring(0, 12)}`;
    
    setAssetMap(prev => new Map(prev).set(originalUrl, secureUrl));
    return secureUrl;
  };

  return { getSecureUrl };
}