/**
 * Ofuscador de CSS e Classes
 * Sistema para ofuscar estilos críticos e nomes de classes
 */

// Mapeamento de classes ofuscadas
const classMap = new Map<string, string>();
let classCounter = 0;

// Gerar nome de classe ofuscado
export function obfuscateClassName(originalClass: string): string {
  if (classMap.has(originalClass)) {
    return classMap.get(originalClass)!;
  }
  
  const obfuscated = `c${(++classCounter).toString(36)}${Math.random().toString(36).substring(2, 5)}`;
  classMap.set(originalClass, obfuscated);
  return obfuscated;
}

// CSS criptografado para componentes críticos
export const encryptedStyles = {
  // Proteção contra seleção de texto
  noSelect: `
    -webkit-touch-callout: none !important;
    -webkit-user-select: none !important;
    -khtml-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
    -webkit-user-drag: none !important;
    -webkit-tap-highlight-color: transparent !important;
  `,
  
  // Proteção contra inspeção
  noInspect: `
    pointer-events: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  `,
  
  // Camada de proteção invisível
  protectionLayer: `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: transparent;
    pointer-events: auto;
  `,
  
  // Filtros anti-screenshot
  antiScreenshot: `
    filter: contrast(1.001) brightness(1.001) saturate(1.001);
    -webkit-filter: contrast(1.001) brightness(1.001) saturate(1.001);
  `,
  
  // Ofuscação de texto
  textObfuscation: `
    text-shadow: 0 0 0 transparent;
    background: linear-gradient(45deg, currentColor 0%, currentColor 100%);
    -webkit-background-clip: text;
    background-clip: text;
  `
};

// Gerador de CSS dinâmico
export function generateDynamicCSS(): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  
  return `
    /* Gerado em: ${timestamp} */
    .protected-${randomSuffix} {
      ${encryptedStyles.noSelect}
      ${encryptedStyles.antiScreenshot}
    }
    
    .no-inspect-${randomSuffix} {
      ${encryptedStyles.noInspect}
    }
    
    .protection-layer-${randomSuffix} {
      ${encryptedStyles.protectionLayer}
    }
    
    /* Anti-devtools CSS */
    @media screen and (max-width: 0px) {
      .devtools-detector {
        display: block !important;
      }
    }
    
    /* CSS que só funciona em dev tools */
    @media screen and (min-width: 99999px) {
      body {
        display: none !important;
      }
    }
    
    /* Detector de print */
    @media print {
      * {
        display: none !important;
      }
      body::after {
        content: "Impressão não permitida - © illunare ${new Date().getFullYear()}" !important;
        display: block !important;
        font-size: 24px !important;
        text-align: center !important;
        padding: 50px !important;
      }
    }
    
    /* Esconder de screen readers maliciosos */
    .sr-protected {
      speak: none;
      -webkit-speak: none;
    }
    
    /* CSS que confunde scrapers */
    .fake-content::before {
      content: "Esta não é a informação real";
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
  `;
}

// Injetor de CSS dinâmico
export function injectProtectionCSS(): void {
  if (typeof document === 'undefined') return;
  
  const existingStyle = document.getElementById('protection-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  const style = document.createElement('style');
  style.id = 'protection-styles';
  style.textContent = generateDynamicCSS();
  
  // Adicionar ao head de forma ofuscada
  setTimeout(() => {
    document.head.appendChild(style);
  }, Math.random() * 1000);
  
  // Regenerar estilos periodicamente
  setInterval(() => {
    style.textContent = generateDynamicCSS();
  }, 30000 + Math.random() * 10000);
}

// Detector de modificação de CSS
export function protectCSS(): void {
  if (typeof document === 'undefined') return;
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as Element;
            
            // Detectar injeção de estilos maliciosos
            if (element.tagName === 'STYLE' && 
                !element.id.includes('protection') &&
                !element.hasAttribute('data-allowed')) {
              
              const content = element.textContent || '';
              const suspiciousPatterns = [
                /user-select\s*:\s*text/i,
                /pointer-events\s*:\s*auto/i,
                /display\s*:\s*block.*important/i,
                /-webkit-user-select\s*:\s*text/i
              ];
              
              if (suspiciousPatterns.some(pattern => pattern.test(content))) {
                console.log('[SECURITY] CSS injection blocked');
                element.remove();
              }
            }
          }
        });
      }
      
      // Detectar modificação de atributos style
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'style') {
        const target = mutation.target as Element;
        const style = target.getAttribute('style') || '';
        
        if (style.includes('user-select: text') ||
            style.includes('pointer-events: auto')) {
          target.removeAttribute('style');
          console.log('[SECURITY] Style attribute modification blocked');
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
}

// Hook para aplicar proteções CSS
export function useProtectedStyles() {
  if (typeof window === 'undefined') return;
  
  // Injetar CSS de proteção
  injectProtectionCSS();
  
  // Proteger contra modificações
  protectCSS();
  
  // Detectar tentativas de override
  const originalGetComputedStyle = window.getComputedStyle;
  let accessCount = 0;
  
  window.getComputedStyle = function(element, pseudoElement) {
    accessCount++;
    
    // Limitar acesso a estilos computados
    if (accessCount > 100) {
      console.log('[SECURITY] Excessive style access detected');
      return {} as CSSStyleDeclaration;
    }
    
    return originalGetComputedStyle.call(this, element, pseudoElement);
  };
}