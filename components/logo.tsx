
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const Logo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      onClick={scrollToTop}
      className="flex items-center cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 rounded-md"
      aria-label="Voltar ao início"
    >
      {mounted && (
        <Image
          src={resolvedTheme === 'dark' ? '/logo-white.svg' : '/logo.svg'}
          alt="illunare 4.0 — IA multimodal com precisão de nível quântico"
          width={140}
          height={48}
          className="object-contain w-[140px] h-[48px]"
          priority
        />
      )}
    </button>
  );
};

export default Logo;
