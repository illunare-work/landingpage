
import { motion } from 'framer-motion';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import RegisterModal from '@/components/ui/register-modal';

import { useState, useEffect } from 'react';

const ParticleSystem3D = () => {
  const [dotConfigs, setDotConfigs] = useState<Array<{
    left: string;
    top: string;
    duration: number;
    delay: number;
  }> | null>(null);

  useEffect(() => {
    const configs = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
    setDotConfigs(configs);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Modern geometric background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-purple-900 to-zinc-900">
        {/* Animated geometric shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rotate-45"
          animate={{
            rotate: [45, 225, 45],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute top-3/4 right-1/3 w-24 h-24 bg-purple-500/10 rounded-full"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute top-1/2 right-1/4 w-16 h-40 bg-indigo-500/10 rotate-12"
          animate={{
            rotate: [12, -12, 12],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating dots pattern */}
        <div className="absolute inset-0">
          {dotConfigs && dotConfigs.map((cfg, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: cfg.left,
                top: cfg.top,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: cfg.duration,
                repeat: Infinity,
                delay: cfg.delay,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
    </div>
  );
};

const CallToAction = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <section id="cta" className="py-20 md:py-26 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 3D Particle System Background */}
      <ParticleSystem3D />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-purple-500/10"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-white/80 font-semibold text-sm uppercase tracking-wide mb-6"
          >
            Pronto para começar?
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-10"
          >
            Inicie seu teste gratuito hoje.
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <RainbowButton 
              variant="outline" 
              size="lg" 
              className="font-semibold" 
              onClick={() => setIsRegisterModalOpen(true)}
            >
              Comece gratuitamente
            </RainbowButton>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </section>
  );
};

export default CallToAction;
