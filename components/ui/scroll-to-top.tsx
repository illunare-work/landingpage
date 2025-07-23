"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleVisibility = useCallback(() => {
    const scrollY = window.scrollY;
    
    // Show when scrolled past 300px
    if (scrollY > 300) {
      setIsVisible(true);
      
      // Smooth fade-out effect when approaching top
      if (scrollY < 200) {
        // Fade out gradually as approaching top (between 100-200px)
        const fadeOpacity = Math.min(1, (scrollY - 100) / 100);
        setOpacity(fadeOpacity);
      } else {
        // Full opacity when far from top
        setOpacity(1);
      }
    } else {
      // Hide completely when below 300px
      setIsVisible(false);
      setOpacity(0);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [mounted, toggleVisibility]);

  const scrollToTop = useCallback(() => {
    // Prevent multiple scroll calls
    if (window.scrollY < 100) return;
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  if (!mounted || !isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-50 group",
        "size-12 rounded-full",
        "bg-background/90 backdrop-blur-xl",
        "border border-border/60 hover:border-border",
        "shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10",
        "dark:shadow-white/5 dark:hover:shadow-white/10",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:bg-background/95",
        "cursor-pointer disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2",
        "disabled:opacity-60 disabled:scale-95",
      )}
      style={{
        opacity: opacity,
        transform: `scale(${0.8 + (opacity * 0.2)})`, // Subtle scale effect based on opacity
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
      }}
      aria-label="Voltar ao topo"
      tabIndex={0}
    >
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0"
      />
      <div>
        <ArrowUp 
          className="size-5 text-muted-foreground group-hover:text-foreground relative z-10 transition-all duration-500 ease-out group-hover:scale-110"
        />
      </div>
      <div 
        className="absolute inset-0 rounded-full border border-purple-500/10 opacity-0"
      />
      <div 
        className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0"
      />
    </button>
  );
};

export default ScrollToTop; 