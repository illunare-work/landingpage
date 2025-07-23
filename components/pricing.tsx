
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Check, Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const isYearly = billingPeriod === 'yearly';

  const plans = [
    {
      name: 'Inicial',
      monthlyPrice: 'R$ 149',
      yearlyPrice: 'R$ 1.490',
      period: isYearly ? '/ano' : '/mês',
      description: 'Perfeito para pequenas equipes começando',
      features: [
        'Até 5 membros da equipe',
        '10GB de armazenamento',
        'Análises básicas',
        'Suporte por email',
        'Integrações essenciais'
      ],
      popular: false
    },
    {
      name: 'Profissional',
      monthlyPrice: 'R$ 499',
      yearlyPrice: 'R$ 4.990',
      period: isYearly ? '/ano' : '/mês',
      description: 'Ideal para empresas em expansão',
      features: [
        'Até 25 membros da equipe',
        '100GB de armazenamento',
        'Análises avançadas',
        'Suporte prioritário',
        'Todas as integrações',
        'Acesso à API',
        'Fluxos de trabalho personalizados'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      monthlyPrice: 'R$ 1.499',
      yearlyPrice: 'R$ 14.990',
      period: isYearly ? '/ano' : '/mês',
      description: 'Para grandes organizações com necessidades avançadas',
      features: [
        'Membros da equipe ilimitados',
        '1TB de armazenamento',
        'Análises empresariais',
        'Suporte dedicado 24/7',
        'Todas as integrações',
        'Acesso completo à API',
        'Fluxos de trabalho personalizados',
        'SSO e segurança avançada',
        'Onboarding personalizado'
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-background border-b border-border/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div 
          className="flex items-center justify-center flex-col text-center gap-5"
          style={{ opacity: 1, transform: 'none' }}
        >
          <div className="py-1 text-purple-600 font-semibold border-b-2 border-purple-600 mb-1.5">
            Investimento
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Planos que Cabem no seu Bolso
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Soluções flexíveis para cada momento da sua jornada empreendedora.
            <br />
            Teste grátis por 7 dias — com funcionalidades de demonstração para sentir o potencial.
          </p>

          {/* Pricing Period Toggle */}
          <div className="flex items-center justify-center mb-18">
            <ToggleGroup
              type="single"
              value={billingPeriod}
              onValueChange={(value) => value && setBillingPeriod(value)}
              className="bg-accent rounded-xl gap-1 p-1.5"
            >
              <ToggleGroupItem 
                value="monthly" 
                className="cursor-pointer flex items-center rounded-lg text-sm font-medium px-6 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm"
              >
                Mensal
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="yearly" 
                className="cursor-pointer flex items-center rounded-lg text-sm font-medium px-6 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm flex items-center gap-2"
              >
                Anual
                <Badge variant="outline" className="leading-0 rounded-sm px-1 py-0.5 text-[11px] bg-purple-100 border-purple-100 text-purple-700 dark:text-purple-200 dark:bg-purple-950/50 dark:border-purple-950/50 font-semibold">
                  -20%
                </Badge>  
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={cn(
                'h-full relative transition-all duration-300 group', 
                plan.popular ? 'border-purple-500 shadow-2xl scale-105' : 'border-border hover:border-purple-500'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2.5 py-1">
                      <Star className="h-3 w-3 me-0.5" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center py-6">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground mb-5">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-end justify-center">
                    <div className="relative h-16 flex items-end">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={isYearly ? 'yearly' : 'monthly'}
                          initial={{ opacity: 0, y: 20, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.8 }}
                          transition={{ 
                            duration: 0.2,
                            ease: "easeInOut"
                          }}
                          className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative"
                        >
                          {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <span className="text-muted-foreground ms-1 mb-1">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <motion.div
                    whileHover={{ scale: 1.025 }}
                    whileTap={{ scale: 0.98 }}
                    className="pt-6"
                  >
                    <Button className="w-full cursor-pointer" size="lg" variant={plan.popular ? "default" : "outline"}>
                      Começar Agora
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
