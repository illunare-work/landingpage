/**
 * Wrapper de Segurança
 * Componente que envolve a aplicação com proteções avançadas
 */

"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useSecurity } from '@/hooks/use-security';

interface SecurityWrapperProps {
  readonly children: ReactNode;
  readonly enableFullProtection?: boolean;
}

export default function SecurityWrapper({ 
  children, 
  enableFullProtection = false // Desabilitado por padrão para não quebrar layout
}: SecurityWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  useSecurity({
    enableProtection: enableFullProtection,
    antiScraping: true,
    obfuscateAssets: true
  });

  // Aplicar proteções CSS
  useEffect(() => {
    if (enableFullProtection && typeof window !== 'undefined') {
      import('@/lib/css-obfuscator').then((module) => {
        if (module.useProtectedStyles) {
          module.useProtectedStyles();
        }
      });
    }
  }, [enableFullProtection]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Verificações de segurança inicial - apenas quando explicitamente habilitado
    if (!enableFullProtection) {
      setIsLoaded(true);
      return;
    }

    const performSecurityChecks = async () => {
      try {
        // Check 1: Verificar se está sendo executado em ambiente suspeito (apenas em produção)
        if (process.env.NODE_ENV === 'production' && enableFullProtection) {
          const isSuspicious = (
            window.location.protocol === 'file:' ||
            /phantom|headless|selenium|puppeteer/i.test(navigator.userAgent)
          );

          if (isSuspicious) {
            setIsBlocked(true);
            return;
          }
        }

        // Check 2: Verificar integridade do DOM
        const observer = new MutationObserver((mutations) => {
          let suspiciousActivity = false;
          
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                  const element = node as Element;
                  
                  // Detectar injeção de scripts suspeitos
                  if (element.tagName === 'SCRIPT' && 
                      !element.hasAttribute('data-allowed')) {
                    suspiciousActivity = true;
                  }
                  
                  // Detectar extensões de browser mining/scraping
                  if (element.classList.contains('extension-injected') ||
                      element.id.includes('extension')) {
                    suspiciousActivity = true;
                  }
                }
              });
            }
          });

          if (suspiciousActivity) {
            setIsBlocked(true);
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true
        });

        // Check 3: Proteção contra console injection
        const originalConsole = { ...console };
        let consoleAccessCount = 0;
        
        Object.keys(originalConsole).forEach((key) => {
          Object.defineProperty(console, key, {
            get() {
              consoleAccessCount++;
              if (consoleAccessCount > 10) {
                setIsBlocked(true);
              }
              return originalConsole[key as keyof Console];
            }
          });
        });

        // Check 4: Detectar automated browsing
        const checkAutomation = () => {
          // Verificar se há sinais de automação
          const hasWebDriver = 'webdriver' in navigator;
          const hasPhantom = 'phantom' in window;
          const hasSelenium = '__selenium_unwrapped' in window;
          
          if (hasWebDriver || hasPhantom || hasSelenium) {
            setIsBlocked(true);
            return;
          }

          // Test de interação humana (apenas em produção)
          if (process.env.NODE_ENV === 'production') {
            let humanInteraction = false;
            const timeout = setTimeout(() => {
              if (!humanInteraction) {
                setIsBlocked(true);
              }
            }, 15000); // 15 segundos para primeira interação
          
            const handleInteraction = () => {
              humanInteraction = true;
              clearTimeout(timeout);
              document.removeEventListener('mousemove', handleInteraction);
              document.removeEventListener('click', handleInteraction);
              document.removeEventListener('scroll', handleInteraction);
              document.removeEventListener('keydown', handleInteraction);
            };

            document.addEventListener('mousemove', handleInteraction, { once: true });
            document.addEventListener('click', handleInteraction, { once: true });
            document.addEventListener('scroll', handleInteraction, { once: true });
            document.addEventListener('keydown', handleInteraction, { once: true });
          }
        };

        checkAutomation();

        // Tudo passou nas verificações
        setIsLoaded(true);

      } catch (error) {
        console.error('Security check failed:', error);
        setIsBlocked(true);
      }
    };

    performSecurityChecks();

    // Limpeza adicional de código malicioso
    const cleanup = setInterval(() => {
      // Remover elementos injetados maliciosamente
      const suspiciousElements = document.querySelectorAll('[data-suspicious], .injected-script');
      suspiciousElements.forEach(el => el.remove());

      // Limpar console
      if (console.clear) {
        console.clear();
      }
    }, 5000);

    return () => {
      clearInterval(cleanup);
    };
  }, [enableFullProtection]);

  // Loading state enquanto verificações de segurança são executadas
  if (!isLoaded && !isBlocked) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando segurança...</p>
        </div>
      </div>
    );
  }

  // Bloquear acesso se detectou atividade suspeita
  if (isBlocked) {
    return (
      <div className="fixed inset-0 bg-red-50 dark:bg-red-950 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="text-red-600 text-6xl mb-4">🛡️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Acesso Negado
          </h1>
          <p className="text-red-700 dark:text-red-300 mb-6">
            Atividade suspeita detectada. Este site está protegido contra scraping, 
            automação e tentativas de engenharia reversa.
          </p>
          <div className="text-sm text-red-600 dark:text-red-400">
            Código de Erro: SEC_VIOLATION_{Math.random().toString(36).substring(2, 8).toUpperCase()}
          </div>
        </div>
      </div>
    );
  }

  // Renderizar aplicação protegida
  return (
    <div data-security="active" style={{ 
      // Propriedades CSS para dificultar scraping
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      WebkitTouchCallout: 'none',
      WebkitTapHighlightColor: 'transparent'
    }}>
      {children}
      
      {/* Scripts de proteção injetados dinamicamente */}
      <script 
        data-allowed
        dangerouslySetInnerHTML={{
          __html: `
            // Proteção adicional em runtime
            (function() {
              // Detectar dev tools através de timing
              let devtools = false;
              const threshold = 160;
              
              function detect() {
                const start = +new Date();
                debugger;
                const end = +new Date();
                
                if (end - start > threshold) {
                  if (!devtools) {
                    devtools = true;
                    document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h1>🔒 Acesso Negado</h1><p>Ferramentas de desenvolvedor detectadas.</p></div>';
                  }
                }
              }
              
              setInterval(detect, 1000);
              
              // Ofuscar código fonte
              setTimeout(() => {
                const scripts = document.getElementsByTagName('script');
                for (let i = 0; i < scripts.length; i++) {
                  if (scripts[i].src) {
                    scripts[i].src = scripts[i].src + '?v=' + Math.random();
                  }
                }
              }, 2000);
            })();
          `
        }}
      />
    </div>
  );
}