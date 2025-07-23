import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility to ensure opacity values are valid
export function safeOpacity(value: number | string): number {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  // Ensure the value is a valid number
  if (isNaN(num) || !isFinite(num)) {
    return 1; // Default to fully opaque if invalid
  }
  
  // Clamp the value between 0 and 1
  return Math.max(0, Math.min(1, num));
}

// Utility to validate CSS background values
export function safeBackground(value: string): string {
  if (!value || typeof value !== 'string') {
    return 'transparent';
  }
  
  // Check for common invalid patterns
  if (value.includes('undefined') || value.includes('null') || value.includes('NaN')) {
    return 'transparent';
  }
  
  return value;
}

// Utility to validate CSS transform values
export function safeTransform(value: string): string {
  if (!value || typeof value !== 'string') {
    return 'none';
  }
  
  // Check for invalid transform values
  if (value.includes('undefined') || value.includes('null') || value.includes('NaN')) {
    return 'none';
  }
  
  return value;
}

// Utility to format style objects with comprehensive validation
export function safeStyle(style: Record<string, unknown>): Record<string, unknown> {
  const safeStyleObj = { ...style };
  
  // Validate opacity
  if ('opacity' in safeStyleObj) {
    safeStyleObj.opacity = safeOpacity(safeStyleObj.opacity as number | string);
  }
  
  // Validate background
  if ('background' in safeStyleObj && typeof safeStyleObj.background === 'string') {
    safeStyleObj.background = safeBackground(safeStyleObj.background);
  }
  
  // Validate transform
  if ('transform' in safeStyleObj && typeof safeStyleObj.transform === 'string') {
    safeStyleObj.transform = safeTransform(safeStyleObj.transform);
  }
  
  // Remove any undefined or null values
  Object.keys(safeStyleObj).forEach(key => {
    if (safeStyleObj[key] === undefined || safeStyleObj[key] === null) {
      delete safeStyleObj[key];
    }
  });
  
  return safeStyleObj;
}

// Utility for safe Framer Motion props
export function safeMotionProps(props: Record<string, unknown>): Record<string, unknown> {
  if (!props || typeof props !== 'object') {
    return {};
  }
  
  const safeProps = { ...props };
  
  // Validate initial values
  if (safeProps.initial && typeof safeProps.initial === 'object') {
    safeProps.initial = safeStyle(safeProps.initial as Record<string, unknown>);
  }
  
  // Validate animate values
  if (safeProps.animate) {
    if (Array.isArray(safeProps.animate)) {
      safeProps.animate = safeProps.animate.map((frame: unknown) => 
        typeof frame === 'object' && frame !== null ? safeStyle(frame as Record<string, unknown>) : frame
      );
    } else if (typeof safeProps.animate === 'object') {
      safeProps.animate = safeStyle(safeProps.animate as Record<string, unknown>);
    }
  }
  
  // Validate exit values
  if (safeProps.exit && typeof safeProps.exit === 'object') {
    safeProps.exit = safeStyle(safeProps.exit as Record<string, unknown>);
  }
  
  return safeProps;
} 