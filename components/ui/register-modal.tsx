import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Building, Check, Globe, Info, Mail, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import PrivacyModal from './privacy-modal';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  domain: string;
  position: string;
  phone: string;
}

interface FieldError {
  message: string;
  type: 'error' | 'warning' | 'success';
}

const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    domain: '',
    position: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  
  const [mounted, setMounted] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [privacyModalTab, setPrivacyModalTab] = useState<'privacy' | 'terms' | 'lgpd'>('privacy');
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      domain: '',
      position: '',
      phone: ''
    });
    setErrors({});
    setSubmitStatus('idle');
  };

  const handlePrivacyClick = (tab: 'privacy' | 'terms' | 'lgpd') => {
    setPrivacyModalTab(tab);
    setIsPrivacyModalOpen(true);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { message: 'Email inválido', type: 'error' as const };
    }
    
    // Check for temporary/disposable email domains
    const tempDomains = ['temp-mail.org', '10minutemail.com', 'guerrillamail.com', 'mailinator.com'];
    const domain = email.split('@')[1];
    if (domain && tempDomains.includes(domain)) {
      return { message: 'Email temporário não permitido', type: 'error' as const };
    }
    
    return { message: 'Email válido', type: 'success' as const };
  };

  const validateDomain = (domain: string) => {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(domain)) {
      return { message: 'Domínio inválido', type: 'error' as const };
    }
    
    // Check for suspicious patterns
    if (domain.includes('test') || domain.includes('example') || domain.includes('localhost')) {
      return { message: 'Domínio suspeito', type: 'warning' as const };
    }
    
    return { message: 'Domínio válido', type: 'success' as const };
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    if (field === 'email' && value) {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
    
    if (field === 'domain' && value) {
      setErrors(prev => ({ ...prev, domain: validateDomain(value) }));
    }
    
    if (field === 'name') {
      if (!value.trim()) {
        setErrors(prev => ({ ...prev, name: { message: 'Nome é obrigatório', type: 'error' } }));
      } else if (value.trim().length < 2) {
        setErrors(prev => ({ ...prev, name: { message: 'Nome muito curto', type: 'error' } }));
      } else {
        setErrors(prev => ({ ...prev, name: { message: 'Nome válido', type: 'success' } }));
      }
    }
    
    if (field === 'company') {
      if (!value.trim()) {
        setErrors(prev => ({ ...prev, company: { message: 'Empresa é obrigatória', type: 'error' } }));
      } else if (value.trim().length < 2) {
        setErrors(prev => ({ ...prev, company: { message: 'Nome da empresa deve ter pelo menos 2 caracteres', type: 'error' } }));
      } else {
        setErrors(prev => ({ ...prev, company: { message: 'Empresa válida', type: 'success' } }));
      }
    }
    
    if (field === 'position') {
      if (!value.trim()) {
        setErrors(prev => ({ ...prev, position: { message: 'Cargo é obrigatório', type: 'error' } }));
      } else {
        setErrors(prev => ({ ...prev, position: { message: 'Cargo válido', type: 'success' } }));
      }
    }
    
    if (field === 'phone') {
      if (!value.trim()) {
        setErrors(prev => ({ ...prev, phone: { message: 'Telefone é obrigatório', type: 'error' } }));
      } else {
        setErrors(prev => ({ ...prev, phone: { message: 'Telefone válido', type: 'success' } }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, FieldError> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = { message: 'Nome é obrigatório', type: 'error' };
    } else if (formData.name.trim().length < 2) {
      newErrors.name = { message: 'Nome deve ter pelo menos 2 caracteres', type: 'error' };
    } else {
      newErrors.name = { message: 'Nome válido', type: 'success' };
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = { message: 'Email é obrigatório', type: 'error' };
    } else {
      const emailValidation = validateEmail(formData.email);
      newErrors.email = emailValidation;
    }

    // Validate company
    if (!formData.company.trim()) {
      newErrors.company = { message: 'Empresa é obrigatória', type: 'error' };
    } else if (formData.company.trim().length < 2) {
      newErrors.company = { message: 'Nome da empresa deve ter pelo menos 2 caracteres', type: 'error' };
    } else {
      newErrors.company = { message: 'Empresa válida', type: 'success' };
    }

    // Validate domain
    if (!formData.domain.trim()) {
      newErrors.domain = { message: 'Domínio é obrigatório', type: 'error' };
    } else {
      const domainValidation = validateDomain(formData.domain);
      newErrors.domain = domainValidation;
    }

    // Validate position
    if (!formData.position.trim()) {
      newErrors.position = { message: 'Cargo é obrigatório', type: 'error' };
    } else {
      newErrors.position = { message: 'Cargo válido', type: 'success' };
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = { message: 'Telefone é obrigatório', type: 'error' };
    } else {
      newErrors.phone = { message: 'Telefone válido', type: 'success' };
    }

    setErrors(newErrors);
    
    // Return true if no errors exist
    return Object.values(newErrors).every(error => error.type !== 'error');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setSubmitStatus('success');
      
      // Trigger confetti on success
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B']
      });
      
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldBorderColor = (fieldName: string) => {
    const error = errors[fieldName];
    if (!error) return 'border-input';
    
    switch (error.type) {
      case 'error':
        return 'border-red-500 focus:border-red-500';
      case 'warning':
        return 'border-yellow-500 focus:border-yellow-500';
      case 'success':
        return 'border-green-500 focus:border-green-500';
      default:
        return 'border-input';
    }
  };

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
            className="w-full max-w-md bg-background rounded-lg shadow-xl border border-border overflow-hidden"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-xl font-semibold">Teste Gratuito por 7 dias</h2>
                <p className="text-sm text-muted-foreground">
                  Comece sua jornada com IA illunare 4.0
                </p>
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

            {/* Success State */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">Sucesso!</h3>
                <p className="text-muted-foreground mb-4">
                  Sua conta foi criada com sucesso. Você receberá um email de confirmação em breve.
                </p>
                <Button onClick={onClose} className="w-full cursor-pointer">
                  Continuar
                </Button>
              </motion.div>
            )}

            {/* Error State */}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Erro</h3>
                <p className="text-muted-foreground mb-4">
                  Ocorreu um erro ao criar sua conta. Tente novamente.
                </p>
                <Button onClick={() => setSubmitStatus('idle')} className="w-full cursor-pointer">
                  Tentar novamente
                </Button>
              </motion.div>
            )}

            {/* Form */}
            {(submitStatus === 'idle' || submitStatus === 'loading') && (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nome completo
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={cn("mt-1 pl-10 h-10", getFieldBorderColor('name'))}
                      required
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {errors.name && (
                      <div className="flex items-center gap-1 mt-1">
                        {errors.name.type === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
                        {errors.name.type === 'success' && <Check className="h-3 w-3 text-green-500" />}
                        <span className={cn(
                          "text-xs",
                          errors.name.type === 'error' && "text-red-500",
                          errors.name.type === 'success' && "text-green-500"
                        )}>
                          {errors.name.message}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email profissional
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={cn("mt-1 pl-10 h-10", getFieldBorderColor('email'))}
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {errors.email && (
                      <div className="flex items-center gap-1 mt-1">
                        {errors.email.type === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
                        {errors.email.type === 'success' && <Check className="h-3 w-3 text-green-500" />}
                        <span className={cn(
                          "text-xs",
                          errors.email.type === 'error' && "text-red-500",
                          errors.email.type === 'success' && "text-green-500"
                        )}>
                          {errors.email.message}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Company */}
                <div>
                  <Label htmlFor="company" className="text-sm font-medium">
                    Empresa
                  </Label>
                  <div className="relative">
                    <Input
                      id="company"
                      type="text"
                      placeholder="Nome da sua empresa"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className={cn("mt-1 pl-10 h-10", getFieldBorderColor('company'))}
                      required
                    />
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {errors.company && (
                      <div className="flex items-center gap-1 mt-1">
                        {errors.company.type === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
                        {errors.company.type === 'success' && <Check className="h-3 w-3 text-green-500" />}
                        <span className={cn(
                          "text-xs",
                          errors.company.type === 'error' && "text-red-500",
                          errors.company.type === 'success' && "text-green-500"
                        )}>
                          {errors.company.message}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Domain */}
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="domain" className="text-sm font-medium">
                      Domínio da empresa
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Domínio principal da sua empresa (ex: empresa.com)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      id="domain"
                      type="text"
                      placeholder="empresa.com"
                      value={formData.domain}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                      className={cn("mt-1 pl-10 h-10", getFieldBorderColor('domain'))}
                      required
                    />
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {errors.domain && (
                      <div className="flex items-center gap-1 mt-1">
                        {errors.domain.type === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
                        {errors.domain.type === 'warning' && <AlertCircle className="h-3 w-3 text-yellow-500" />}
                        {errors.domain.type === 'success' && <Check className="h-3 w-3 text-green-500" />}
                        <span className={cn(
                          "text-xs",
                          errors.domain.type === 'error' && "text-red-500",
                          errors.domain.type === 'warning' && "text-yellow-500",
                          errors.domain.type === 'success' && "text-green-500"
                        )}>
                          {errors.domain.message}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Position */}
                <div>
                  <Label htmlFor="position" className="text-sm font-medium">
                    Cargo/Função
                  </Label>
                  <Input
                    id="position"
                    type="text"
                    placeholder="Desenvolvedor, Gerente, CEO..."
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className={cn("mt-1 h-10", getFieldBorderColor('position'))}
                    required
                  />
                  {errors.position && (
                    <div className="flex items-center gap-1 mt-1">
                      {errors.position.type === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
                      {errors.position.type === 'success' && <Check className="h-3 w-3 text-green-500" />}
                      <span className={cn(
                        "text-xs",
                        errors.position.type === 'error' && "text-red-500",
                        errors.position.type === 'success' && "text-green-500"
                      )}>
                        {errors.position.message}
                      </span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={cn("mt-1 h-10", getFieldBorderColor('phone'))}
                    required
                  />
                  {errors.phone && (
                    <div className="flex items-center gap-1 mt-1">
                      {errors.phone.type === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
                      {errors.phone.type === 'success' && <Check className="h-3 w-3 text-green-500" />}
                      <span className={cn(
                        "text-xs",
                        errors.phone.type === 'error' && "text-red-500",
                        errors.phone.type === 'success' && "text-green-500"
                      )}>
                        {errors.phone.message}
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full mt-6 h-11 cursor-pointer"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </motion.div>
                  ) : (
                    'Iniciar teste gratuito'
                  )}
                </Button>
              </form>
            )}

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/50 bg-muted/20">
              <div className="flex items-start gap-2">
                <span className="text-red-500 text-xs font-bold mt-0.5 flex-shrink-0">*</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ao continuar, você aceita nossos{' '}
                  <button
                    onClick={() => handlePrivacyClick('terms')}
                    className="text-purple-600 hover:text-purple-700 underline decoration-dotted underline-offset-2 transition-colors cursor-pointer"
                  >
                    termos de uso
                  </button>
                  {' '}e{' '}
                  <button
                    onClick={() => handlePrivacyClick('privacy')}
                    className="text-purple-600 hover:text-purple-700 underline decoration-dotted underline-offset-2 transition-colors cursor-pointer"
                  >
                    política de privacidade
                  </button>
                  . Seus dados estão protegidos conforme a{' '}
                  <button
                    onClick={() => handlePrivacyClick('lgpd')}
                    className="text-purple-600 hover:text-purple-700 underline decoration-dotted underline-offset-2 transition-colors cursor-pointer"
                  >
                    LGPD
                  </button>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const content = (
    <>
      {modalContent}
      {/* Privacy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        initialTab={privacyModalTab}
      />
    </>
  );

  if (!mounted) return null;

  return typeof window !== 'undefined' && document.body
    ? createPortal(content, document.body)
    : content;
};

export default RegisterModal; 