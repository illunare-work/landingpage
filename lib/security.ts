/**
 * Sistema de Segurança e Ofuscação Avançado
 * Proteção multi-camada contra inspeção, scraping e engenharia reversa
 */

// Criptografia quântica básica para strings sensíveis
class QuantumCrypt {
  private static key = Math.random().toString(36).substring(2, 15);
  
  static encode(str: string): string {
    return btoa(str.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.key.charCodeAt(i % this.key.length))
    ).join(''));
  }
  
  static decode(encoded: string): string {
    return atob(encoded).split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.key.charCodeAt(i % this.key.length))
    ).join('');
  }
}

// Detector de Dev Tools
class DevToolsDetector {
  private static isDetectionActive = false;
  private static callbacks: Array<() => void> = [];
  
  static onDevToolsOpen(callback: () => void) {
    this.callbacks.push(callback);
  }
  
  static startDetection() {
    if (this.isDetectionActive) return;
    this.isDetectionActive = true;
    
    // Método 1: Detector baseado em timing
    setInterval(() => {
      const start = performance.now();
      debugger;
      const duration = performance.now() - start;
      
      if (duration > 100) {
        this.callbacks.forEach(cb => cb());
      }
    }, 1000);
    
    // Método 2: Detector de redimensionamento
    const devtools = { open: false };
    const threshold = 160;
    
    setInterval(() => {
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      
      if (!(heightThreshold && widthThreshold) && 
          (widthThreshold || heightThreshold)) {
        if (!devtools.open) {
          devtools.open = true;
          this.callbacks.forEach(cb => cb());
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }
}

// Proteção contra seleção de texto e contexto
export class DOMProtection {
  static disableSelection() {
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // CSS dinâmico para proteção adicional
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        -khtml-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  static disableKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // F12, F11, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U, Ctrl+S
      if (e.key === 'F12' || e.key === 'F11' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
          (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
          (e.ctrlKey && e.shiftKey && e.key === 'J')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });
  }
}

// Ofuscador de assets e URLs
export class AssetObfuscator {
  private static urlMap = new Map<string, string>();
  
  static obfuscateUrl(originalUrl: string): string {
    if (this.urlMap.has(originalUrl)) {
      return this.urlMap.get(originalUrl)!;
    }
    
    const hash = this.generateHash(originalUrl);
    const obfuscated = `/api/asset/${hash}`;
    this.urlMap.set(originalUrl, obfuscated);
    return obfuscated;
  }
  
  private static generateHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

// Console Protection
export class ConsoleProtection {
  static protect() {
    // Limpar console
    if (typeof console !== 'undefined') {
      console.clear();
    }
    
    // Sobrescrever métodos do console
    const noop = () => {};
    const methods = ['log', 'warn', 'error', 'info', 'debug', 'trace'];
    
    methods.forEach(method => {
      if (console && console[method as keyof Console]) {
        (console as unknown as Record<string, unknown>)[method] = noop;
      }
    });
    
    // Detector de monkey patching
    Object.defineProperty(console, '_isProtected', {
      value: true,
      writable: false,
      configurable: false
    });
  }
}

// Anti-scraping bot detection
export class BotDetection {
  static detectBot(): boolean {
    const botPatterns = [
      /bot/i, /spider/i, /crawl/i, /scrape/i, /phantom/i,
      /headless/i, /puppeteer/i, /selenium/i, /playwright/i
    ];
    
    const userAgent = navigator.userAgent.toLowerCase();
    return botPatterns.some(pattern => pattern.test(userAgent)) ||
           !navigator.webdriver === undefined || // Selenium
           (window as unknown as Record<string, unknown>).phantom !== undefined || // PhantomJS
           (window as unknown as Record<string, unknown>).__nightmare !== undefined; // Nightmare
  }
  
  static addMouseTrap() {
    let mouseMovements = 0;
    let isBot = true;
    
    const mouseHandler = () => {
      mouseMovements++;
      if (mouseMovements > 3) {
        isBot = false;
        document.removeEventListener('mousemove', mouseHandler);
      }
    };
    
    document.addEventListener('mousemove', mouseHandler);
    
    setTimeout(() => {
      if (isBot) {
        // Redirecionar bots para página de erro
        window.location.href = '/404';
      }
    }, 5000);
  }
}

// Inicialização do sistema de segurança
export class SecuritySystem {
  static initialize() {
    if (typeof window === 'undefined') return;
    
    // Detectar e bloquear bots
    if (BotDetection.detectBot()) {
      window.location.href = '/404';
      return;
    }
    
    // Proteções DOM
    DOMProtection.disableSelection();
    DOMProtection.disableKeyboardShortcuts();
    
    // Proteção console
    ConsoleProtection.protect();
    
    // Detector de dev tools
    DevToolsDetector.onDevToolsOpen(() => {
      document.body.innerHTML = '<h1>Acesso Negado</h1><p>Detecção de ferramentas de desenvolvedor.</p>';
    });
    DevToolsDetector.startDetection();
    
    // Mouse trap para bots
    BotDetection.addMouseTrap();
    
    // Proteções adicionais
    this.addAntiDebugger();
    this.addPerformanceCheck();
  }
  
  private static addAntiDebugger() {
    setInterval(() => {
      debugger;
    }, 100);
  }
  
  private static addPerformanceCheck() {
    const start = performance.now();
    
    setInterval(() => {
      const now = performance.now();
      if (now - start > 1000) {
        console.clear();
      }
    }, 100);
  }
}

export { QuantumCrypt };