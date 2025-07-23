import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Shield, Eye, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'lgpd';
}

const PrivacyModal = ({ isOpen, onClose, initialTab = 'privacy' }: PrivacyModalProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const tabs = [
    {
      id: 'privacy',
      label: 'Privacidade',
      icon: Eye,
      content: {
        title: 'Política de Privacidade',
        lastUpdate: '01 de janeiro de 2025',
        sections: [
          {
            title: 'Informações que coletamos',
            content: 'Coletamos informações que você nos fornece diretamente, como nome, email, empresa e dados de contato quando você se cadastra em nossos serviços. Também coletamos dados de uso do site para melhorar sua experiência.'
          },
          {
            title: 'Como usamos suas informações',
            content: 'Utilizamos suas informações para fornecer e melhorar nossos serviços, enviar comunicações importantes, personalizar sua experiência e cumprir obrigações legais.'
          },
          {
            title: 'Compartilhamento de dados',
            content: 'Não vendemos suas informações pessoais. Podemos compartilhar dados apenas com prestadores de serviços confiáveis que nos ajudam a operar nossos serviços, sempre com proteções adequadas.'
          },
          {
            title: 'Seus direitos',
            content: 'Você tem o direito de acessar, corrigir, excluir ou portar seus dados pessoais. Entre em contato conosco para exercer esses direitos.'
          }
        ]
      }
    },
    {
      id: 'terms',
      label: 'Termos de Uso',
      icon: FileText,
      content: {
        title: 'Termos de Uso',
        lastUpdate: '01 de janeiro de 2025',
        sections: [
          {
            title: 'Aceitação dos termos',
            content: 'Ao usar nossos serviços, você concorda com estes termos. Se não concordar, não use nossos serviços.'
          },
          {
            title: 'Uso permitido',
            content: 'Você pode usar nossos serviços apenas para fins legais e de acordo com estes termos. É proibido usar nossos serviços para atividades ilegais ou prejudiciais.'
          },
          {
            title: 'Propriedade intelectual',
            content: 'Todo o conteúdo em nossos serviços é protegido por direitos autorais e outras leis de propriedade intelectual. Você não pode copiar ou redistribuir nosso conteúdo sem permissão.'
          },
          {
            title: 'Limitação de responsabilidade',
            content: 'Nossos serviços são fornecidos "como estão". Não nos responsabilizamos por danos indiretos ou consequenciais resultantes do uso de nossos serviços.'
          }
        ]
      }
    },
    {
      id: 'lgpd',
      label: 'LGPD',
      icon: Shield,
      content: {
        title: 'Lei Geral de Proteção de Dados (LGPD)',
        lastUpdate: '01 de janeiro de 2025',
        sections: [
          {
            title: 'Compromisso com a LGPD',
            content: 'Estamos totalmente comprometidos com o cumprimento da Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018). Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados.'
          },
          {
            title: 'Base legal para tratamento',
            content: 'Tratamos seus dados pessoais com base no consentimento, execução de contrato, cumprimento de obrigação legal, legítimo interesse ou outras bases legais previstas na LGPD.'
          },
          {
            title: 'Seus direitos sob a LGPD',
            content: 'Você tem direito a confirmação da existência de tratamento, acesso aos dados, correção, anonimização, bloqueio, eliminação, portabilidade, informação sobre compartilhamento e revogação do consentimento.'
          },
          {
            title: 'Encarregado de dados',
            content: 'Nosso encarregado de proteção de dados pode ser contatado através do email: dpo@illunare.com.br para questões relacionadas ao tratamento de dados pessoais.'
          },
          {
            title: 'Transferência internacional',
            content: 'Quando necessário, podemos transferir dados para outros países, sempre com garantias adequadas de proteção conforme a LGPD.'
          }
        ]
      }
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];
  
  if (!currentTab) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl max-h-[90vh] bg-background rounded-lg shadow-xl border border-border overflow-hidden"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <currentTab.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{currentTab.content.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Última atualização: {currentTab.content.lastUpdate}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-border/50 bg-muted/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'privacy' | 'terms' | 'lgpd')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative cursor-pointer",
                    activeTab === tab.id
                      ? "text-purple-600 dark:text-purple-400 bg-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Alert for LGPD compliance */}
                {activeTab === 'lgpd' && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-300">
                        Empresa em conformidade
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        Certificamos que nossa empresa está em total conformidade com a LGPD e demais regulamentações de proteção de dados aplicáveis.
                      </p>
                    </div>
                  </div>
                )}

                {/* Content sections */}
                {currentTab.content.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                      {section.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {section.content}
                    </p>
                    {index < currentTab.content.sections.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/50 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span>
                    Para dúvidas sobre privacidade, entre em contato:{' '}
                    <a href="mailto:contato@illunare.com.br" className="text-purple-600 hover:text-purple-700 cursor-pointer">
                      contato@illunare.com.br
                    </a>
                  </span>
                </div>
                <Button onClick={onClose} className="px-6 cursor-pointer">
                  Fechar
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return typeof window !== 'undefined' && document.body
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default PrivacyModal; 