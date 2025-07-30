"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { CustomBadge } from '@/components/custom/badge';
import { CustomTitle } from '@/components/custom/title';
import { CustomSubtitle } from '@/components/custom/subtitle';
import SecureImage from '@/components/security/secure-image';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(-1); // Start with no active step (-1 means all collapsed)
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Track if animation has started
  
  const progressRef = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const stepTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const steps = [
    {
      id: 1,
      title: "Conecte Seus Dados",
      description: "Integre perfeitamente suas ferramentas e fontes de dados existentes com nossa plataforma poderosa em poucos cliques.",
      image: "/screens/4.png"
    },
    {
      id: 2,
      title: "Análise Inteligente", 
      description: "Nossos algoritmos avançados de IA analisam padrões em seus dados e fornecem insights inteligentes automaticamente.",
      image: "/screens/5.png"
    },
    {
      id: 3,
      title: "Configure & Personalize",
      description: "Ajuste as configurações de acordo com suas necessidades específicas e personalize a experiência.",
      image: "/screens/3.png"
    },
    {
      id: 4,
      title: "Lance & Escale",
      description: "Implemente sua solução e escale de acordo com suas necessidades, com suporte completo para expansão.",
      image: "/screens/6.png"
    },
  ];

  const stepDuration = 4000;

  // Auto-scroll timing with steps
  useEffect(() => {
    if (!hasStarted || activeStep === -1) return;

    const timer = setTimeout(() => {
      if (activeStep < steps.length - 1) {
        setActiveStep(prev => prev + 1);
      }
    }, 3000); // 3 seconds per step

    return () => clearTimeout(timer);
  }, [activeStep, hasStarted, steps.length]);

  // Detect screen size for responsive calculations (mobile-first)
  const [, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  useEffect(() => {
    const updateScreenSize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width >= 1024) {
          setScreenSize('desktop');
        } else if (width >= 768) {
          setScreenSize('tablet');
        } else {
          setScreenSize('mobile');
        }
      }
    };

    updateScreenSize();
    const debouncedResize = () => {
      setTimeout(updateScreenSize, 100);
    };

    window.addEventListener('resize', debouncedResize, { passive: true });
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  // Simplified layout - removed complex calculations for better stability

  // Optimized scroll detection with debouncing
  const handleScroll = useCallback(() => {
    if (!isInView) return;
    
    setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [isInView]);

  // Enhanced scroll listener with passive option
  useEffect(() => {
    const controller = new AbortController();
    
    window.addEventListener('scroll', handleScroll, { 
      passive: true,
      signal: controller.signal 
    });
    
    return () => {
      controller.abort();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Auto-start animation when component enters view
  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
      setTimeout(() => {
        setActiveStep(0);
      }, 800);
    }
  }, [isInView, hasStarted]);

  // Optimized progress animation using requestAnimationFrame
  const animateProgress = useCallback(() => {
    if (isPaused || isScrolling || !isInView || !hasStarted || activeStep === -1) {
      return;
    }

    progressRef.current += (100 / (stepDuration / 16));
    
    if (progressRef.current >= 100) {
      progressRef.current = 100;
      setProgress(100);
      
      stepTimeoutRef.current = setTimeout(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
        progressRef.current = 0;
        setProgress(0);
      }, 100);
      
      return;
    }
    
    setProgress(progressRef.current);
    animationFrameRef.current = requestAnimationFrame(animateProgress);
  }, [isPaused, isScrolling, isInView, hasStarted, activeStep, stepDuration, steps.length]);

  // Start/stop animation based on conditions
  useEffect(() => {
    if (isPaused || isScrolling || !isInView || !hasStarted || activeStep === -1) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    progressRef.current = 0;
    setProgress(0);
    animationFrameRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }
    };
  }, [activeStep, isPaused, isScrolling, isInView, hasStarted, animateProgress]);

  // Handle step click with improved UX
  const handleStepClick = useCallback((index: number) => {
    if (index === activeStep) return;
    
    // If animation hasn't started yet, start it
    if (!hasStarted) {
      setHasStarted(true);
    }
    
    setActiveStep(index);
    setIsPaused(true);
    progressRef.current = 0;
    setProgress(0);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  }, [activeStep, hasStarted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="how-it-works" 
      className="py-16 md:py-20 lg:py-24 border-b border-border/50"
      style={{ overflowAnchor: 'none' }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => setIsInView(true)}
          onViewportLeave={() => setIsInView(false)}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex items-center justify-center flex-col text-center gap-4 md:gap-5 mb-12 md:mb-16"
        >
          <CustomBadge>
            Simplicidade Total
          </CustomBadge>

          <CustomTitle>
            Como Funciona
          </CustomTitle>
          
          <CustomSubtitle>
            Quatro passos estratégicos para transformar sua visão em realidade, com tecnologia que pensa e executa ao seu lado.
          </CustomSubtitle>
        </motion.div>

        {/* Main Content Grid with Mobile-First Responsive Design */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-start"
        >
          {/* Left Side - Collapsible Step Navigation (Mobile-First) */}
          <div className="order-2 lg:order-1">
            {/* Dynamic container with calculated height to fit all steps */}
            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={cn(
                    'rounded-lg cursor-pointer transition-all duration-300 border backdrop-blur-sm',
                    index === activeStep && 'bg-background/95 border-border/50 shadow-lg shadow-black/5',
                    index !== activeStep && 'bg-background/80 hover:bg-background/90 border-transparent hover:border-border/30 hover:shadow-md hover:shadow-black/5'
                  )}
                  style={{
                    height: index === activeStep ? '140px' : '65px',
                    transition: 'height 0.3s ease-in-out, background-color 0.2s ease'
                  }}
                  onClick={() => handleStepClick(index)}
                  whileHover={{ scale: index === activeStep ? 1.005 : 1.01 }}
                  whileTap={{ scale: 0.995 }}
                >
                  <div className="h-full flex flex-col">
                    {/* Step Header - Always Visible (Mobile-First) */}
                    <div className="flex items-center justify-between p-3 sm:p-4 flex-shrink-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={cn(
                          'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300',
                          index === activeStep 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                            : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
                        )}>
                          {step.id}
                        </div>
                        <h3 className={cn(
                          'font-bold mb-0 transition-all duration-300 leading-tight',
                          index === activeStep 
                            ? 'text-base sm:text-lg text-foreground' 
                            : 'text-sm sm:text-base text-secondary-foreground/70 hover:text-secondary-foreground'
                        )}>
                          {step.title}
                        </h3>
                      </div>
                      
                      {/* Expand/Collapse Indicator (Mobile-First) */}
                      <motion.div
                        className="text-muted-foreground flex-shrink-0"
                        animate={{ rotate: index === activeStep ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.div>
                    </div>
                    
                    {/* Expandable Content (Mobile-First) */}
                    <motion.div 
                      className="flex-1 overflow-hidden"
                      initial={false}
                      animate={{
                        opacity: index === activeStep ? 1 : 0,
                        height: index === activeStep ? 'auto' : 0,
                        marginTop: index === activeStep ? 0 : -8
                      }}
                      transition={{ 
                        duration: 0.3, 
                        ease: "easeInOut"
                      }}
                    >
                      <div className="px-3 pb-3 sm:px-4 sm:pb-4 h-full flex flex-col">
                        <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm flex-1 mb-3 sm:mb-4">
                          {step.description}
                        </p>
                        
                        {/* Progress Bar - Only show for active step */}
                        {index === activeStep && (
                          <div className="mt-auto">
                            <div className="w-full rounded-full h-1 bg-muted">
                              <motion.div
                                className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: progress / 100 }}
                                transition={{ 
                                  duration: 0.1, 
                                  ease: "linear",
                                  type: "tween"
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side - Mobile-First Image Display */}
          <div className="order-1 lg:order-2 relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-lg sm:rounded-xl overflow-hidden border border-border bg-background">
            <AnimatePresence mode="wait">
              {activeStep >= 0 && steps[activeStep] && (
                <motion.div
                  key={`image-${activeStep}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: "easeInOut",
                    opacity: { duration: 0.3 }
                  }}
                  className="w-full h-full"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <SecureImage
                    src={steps[activeStep]?.image || '/screens/1.png'}
                    alt={`Visualização da etapa: ${steps[activeStep]?.title || 'Carregando'}`}
                    className="w-full h-full object-cover object-top rounded-md"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </motion.div>
              )}
              {activeStep === -1 && (
                <motion.div
                  key="placeholder"
                  className="w-full h-full flex items-center justify-center bg-muted/50 rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center px-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                      Clique em qualquer step para começar
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom CTA (Mobile-First) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-muted-foreground mb-4 text-sm sm:text-base px-4">
            Pronto para decolar? Leva menos de 5 minutos para começar.
          </p>
          <RainbowButton size="lg" asChild>
            <Link href="#pricing">Iniciar Jornada</Link>
          </RainbowButton>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
