"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeMotionProps, safeStyle } from '@/lib/utils';

interface SafeMotionProps {
  children?: React.ReactNode;
  style?: Record<string, unknown>;
  className?: string;
  [key: string]: unknown;
}

export function SafeMotion({ children, ...props }: SafeMotionProps) {
  const safeProps = safeMotionProps(props);
  
  return (
    <motion.div {...safeProps}>
      {children}
    </motion.div>
  );
}

export function SafeMotionDiv({ children, style, ...props }: SafeMotionProps) {
  const safeProps = safeMotionProps(props);
  const safeStyleObj = style ? safeStyle(style) : {};
  
  return (
    <motion.div {...safeProps} style={safeStyleObj}>
      {children}
    </motion.div>
  );
}

export function SafeMotionSpan({ children, style, ...props }: SafeMotionProps) {
  const safeProps = safeMotionProps(props);
  const safeStyleObj = style ? safeStyle(style) : {};
  
  return (
    <motion.span {...safeProps} style={safeStyleObj}>
      {children}
    </motion.span>
  );
}

export function SafeMotionH1({ children, style, ...props }: SafeMotionProps) {
  const safeProps = safeMotionProps(props);
  const safeStyleObj = style ? safeStyle(style) : {};
  
  return (
    <motion.h1 {...safeProps} style={safeStyleObj}>
      {children}
    </motion.h1>
  );
}

export function SafeMotionImg({ style, ...props }: SafeMotionProps) {
  const safeProps = safeMotionProps(props);
  const safeStyleObj = style ? safeStyle(style) : {};
  
  return (
    <motion.img {...safeProps} style={safeStyleObj} />
  );
}

export { AnimatePresence };

// Hook para garantir que valores de animação sejam seguros
export function useSafeAnimation() {
  return {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 30 },
    },
    slideDown: {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -30 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
  };
} 