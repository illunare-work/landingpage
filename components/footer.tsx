
import { motion } from 'framer-motion';
import { Github, X, Linkedin, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/logo';
import PrivacyModal from '@/components/ui/privacy-modal';
import { useState } from 'react';

const Footer = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [privacyModalTab, setPrivacyModalTab] = useState<'privacy' | 'terms' | 'lgpd'>('privacy');

  const handleNavClick = (item: string) => {
    const sectionMap: { [key: string]: string } = {
      'Como Funciona': 'how-it-works',
      'Recursos': 'features',
      'Preços': 'pricing',
      'FAQ': 'faq',
      'Contato': 'contact'
    };
    
    const targetId = sectionMap[item];
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const handlePrivacyClick = (tab: 'privacy' | 'terms' | 'lgpd') => {
    setPrivacyModalTab(tab);
    setIsPrivacyModalOpen(true);
  };

  const links = {
    produto: [
      { name: 'Como Funciona', hasAnchor: true },
      { name: 'Recursos', hasAnchor: true },
      { name: 'Preços', hasAnchor: true },
      { name: 'API', hasAnchor: false },
      { name: 'Documentação', hasAnchor: false }
    ],
    empresa: [
      { name: 'Sobre', hasAnchor: false },
      { name: 'Blog', hasAnchor: false },
      { name: 'Carreiras', hasAnchor: false },
      { name: 'Contato', hasAnchor: true }
    ],
    suporte: [
      { name: 'FAQ', hasAnchor: true },
      { name: 'Central de Ajuda', hasAnchor: false },
      { name: 'Comunidade', hasAnchor: false },
      { name: 'Status', hasAnchor: false }
    ]
  };

  const socialLinks = [
    { icon: X, href: '#', label: 'X (Twitter)' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contato@illunare.com.br', label: 'Email' }
  ];

  return (
    <footer className="bg-background relative overflow-hidden">
      <div className="container px-6 mx-auto pt-14 pb-6 border-b border-border/50">
        <div className="flex flex-col lg:flex-row justify-between items-start">
          {/* Logo and description - Left side */}
          <div className="lg:w-1/3 mb-12 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-3">
                <Logo />
              </div>
              <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
                Revolucione seu negócio com nossa plataforma de IA multimodal de gestão avançada. Da concepção ao resultado em minutos - não em meses.
              </p>
              
              <div className="flex items-center gap-4 mt-8">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="size-10 bg-accent hover:bg-purple-100 dark:hover:bg-purple-900 rounded-full flex items-center justify-center transition-colors"
                    tabIndex={0}
                  >
                    <social.icon className="size-4 text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 3 Column Menu - Right aligned */}
          <div className="w-full grow lg:w-auto lg:grow-0 lg:w-2/3 flex justify-end">
            <div className="w-full lg:w-auto flex justify-between flex-wrap lg:grid lg:grid-cols-3 gap-8 lg:gap-16">
              {Object.entries(links).map(([category, items], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-medium text-base mb-4 capitalize text-muted-foreground/80">{category}</h3>
                  <ul className="text-base space-y-2">
                    {items.map((item, index) => (
                      <li key={index}>
                        {item.hasAnchor ? (
                          <button
                            onClick={() => handleNavClick(item.name)}
                            className="text-accent-foreground hover:text-purple-600 transition-colors hover:underline cursor-pointer"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <a
                            href="#"
                            className="text-accent-foreground hover:text-purple-600 transition-colors hover:underline cursor-pointer"
                          >
                            {item.name}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <Separator className="my-6 bg-border/50" />

        <div className="space-y-4">
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button
              onClick={() => handlePrivacyClick('privacy')}
              className="text-muted-foreground hover:text-purple-600 transition-colors hover:underline cursor-pointer"
            >
              Política de Privacidade
            </button>
            <span className="text-muted-foreground">•</span>
            <button
              onClick={() => handlePrivacyClick('terms')}
              className="text-muted-foreground hover:text-purple-600 transition-colors hover:underline cursor-pointer"
            >
              Termos de Uso
            </button>
            <span className="text-muted-foreground">•</span>
            <button
              onClick={() => handlePrivacyClick('lgpd')}
              className="text-muted-foreground hover:text-purple-600 transition-colors hover:underline cursor-pointer"
            >
              LGPD
            </button>
          </div>

          {/* Compliance and Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-muted-foreground text-sm text-center md:text-left">
                © 2025 illunare. Todos os direitos reservados.
              </p>
              <p className="text-muted-foreground text-xs mt-1 text-center md:text-left">
                Empresa em conformidade com LGPD (Lei 13.709/2018), Marco Civil da Internet e demais regulamentações aplicáveis.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-muted-foreground text-sm text-center md:text-right">
                Inovação 4.0 eficiente, rentável e nacional 🇧🇷
              </p>
              <p className="text-muted-foreground text-xs mt-1 text-center md:text-right">
                Desenvolvido com{' '}
                <span className="text-red-500">♥</span>
                {' '}para empresas brasileiras ·{' '}
                <a href="https://illunare.com.br" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-purple-600 hover:underline cursor-pointer">
                  illunare.com.br
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        initialTab={privacyModalTab}
      />
    </footer>
  );
};

export default Footer;
