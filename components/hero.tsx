import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import HeroVideoDialog from '@/components/ui/hero-video-dialog';
import RegisterModal from '@/components/ui/register-modal';
import { WordRotate } from '@/components/magicui/word-rotate';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const Hero = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const isVideoButtonDisabled = true; // Botão travado permanentemente
  // Para reativar o botão, altere para false ou use useState(false)

  useEffect(() => setMounted(true), []);

  const rotatingWords = ["Eficiente", "Rentável", "Nacional"];
  const users = [
    {name: 'Maria Silva', avatar: 'avatars/300-1.png'},
    {name: 'João Santos', avatar: 'avatars/300-2.png'},
    {name: 'Ana Costa', avatar: 'avatars/300-3.png'},
    {name: 'Carlos Oliveira', avatar: 'avatars/300-4.png'},
    {name: 'Fernanda Lima', avatar: 'avatars/300-5.png'}
  ]

  return (
    <section className="relative lg:min-h-screen bg-gradient-to-br from-gray-50 dark:from-zinc-950 via-white dark:via-black to-purple-50 dark:to-zinc-950 pt-25 pb-20 lg:pt-40 lg:pb-20 overflow-hidden group">
      {/* Animated gradient background */}
      <div className="hidden lg:block absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 dark:from-blue-300/20 via-purple-600/20 dark:via-purple-300/20 to-pink-600/20 dark:to-pink-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
          animate={{
            background: [
              "linear-gradient(215.133deg, rgba(159, 54, 227, 0.2), rgba(224, 80, 166, 0.2), rgba(74, 124, 245, 0.2))",
              "linear-gradient(135deg, rgba(224, 80, 166, 0.2), rgba(159, 54, 227, 0.2), rgba(74, 124, 245, 0.2))",
              "linear-gradient(225deg, rgba(74, 124, 245, 0.2), rgba(224, 80, 166, 0.2), rgba(159, 54, 227, 0.2))",
              "linear-gradient(315deg, rgba(159, 54, 227, 0.2), rgba(74, 124, 245, 0.2), rgba(224, 80, 166, 0.2))",
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-600/10 opacity-30"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tl from-pink-400/10 via-purple-500/10 to-blue-600/10 opacity-20"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Parallax moving elements on hover */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-xl"
        whileHover={{ x: 30, y: -20, scale: 1.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-blue-600/20 rounded-full blur-xl"
        whileHover={{ x: -25, y: 15, scale: 1.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-cyan-600/20 rounded-full blur-xl"
        whileHover={{ x: 20, y: -30, scale: 1.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Loved by thousands badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 bg-background backdrop-blur-sm rounded-full px-2.5 py-1.5 mb-6 lg:mb-8 border border-border/50 shadow-md"
          >
            <div className="flex -space-x-2">
              {users.map((user) => (
                <Avatar key={user.name} className='size-7 border-2 border-background'>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-muted-foreground text-sm font-medium">Tech rentável com sotaque brasileiro 🇧🇷</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-black flex flex-col md:flex-row items-center justify-center text-2xl md:text-4xl lg:text-6xl font-bold mb-4 lg:mb-8 leading-[1.2]"
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-50 dark:via-blue-300 dark:to-purple-900 bg-clip-text text-transparent text-center">
              Inovação
            </span>
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-50 dark:via-blue-300 dark:to-purple-900 bg-clip-text text-transparent text-center mx-3">
              4.0
            </span>
            <div className="ml-1">
              <WordRotate
                words={rotatingWords}
                duration={3000}
                motionProps={{
                  initial: { opacity: 0, scale: 0.8 },
                  animate: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuart
                    }
                  },
                  exit: {
                    opacity: 0,
                    scale: 0.8,
                    transition: {
                      duration: 0.6,
                      ease: [0.55, 0.06, 0.68, 0.19] // easeInQuart
                    }
                  },
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center"
              />
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-xl text-muted-foreground mb-6 md:mb-12 max-w-[600px] mx-auto leading-relaxed"
          >
            Revolucione seu negócio com nossa plataforma de IA multimodal de gestão avançada.
            Da concepção ao resultado em minutos - não em meses.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              size="lg"
              className="cursor-pointer hover:[&_svg]:translate-x-1"
              onClick={() => setIsRegisterModalOpen(true)}
            >
              Experimentar gratuitamente
              <ArrowRight className="h-5 w-5 transition-transform" />
            </Button>
          </motion.div>

          {/* Hero Video Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative max-w-5xl mx-auto"
          >
            {mounted && (
              <>
                {isVideoButtonDisabled ? (
                  /* Versão desabilitada com background preservado */
                  <div className="relative">
                    {/* Background da imagem baseado no tema */}
                    <Image
                      src={resolvedTheme === 'dark' ? '/screens/2.png' : '/screens/1.png'}
                      alt="Demonstração do Produto"
                      width={1200}
                      height={800}
                      className="w-full rounded-2xl shadow-2xl border border-border"
                      priority
                    />
                    {/* Overlay desabilitado */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-purple-600/10 dark:bg-purple-300/10 backdrop-blur-md rounded-full p-4 shadow-lg cursor-not-allowed opacity-75">
                        <div className="bg-background rounded-full p-3 shadow-lg">
                          <Play className="size-6 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400 ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Botão funcional completo */
                  <HeroVideoDialog
                    trigger={
                      <div className="bg-purple-600/10 dark:bg-purple-300/10 backdrop-blur-md rounded-full p-4 shadow-lg">
                        <div className="bg-background rounded-full p-3 shadow-lg">
                          <Play className="size-6 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400 ml-0.5" />
                        </div>
                      </div>
                    }
                    animationStyle="from-center"
                    videoSrc="#"
                    thumbnailSrc={resolvedTheme === 'dark' ? '/screens/2.png' : '/screens/1.png'}
                    thumbnailAlt="Demonstração do Produto"
                  />
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
