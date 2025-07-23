
import { motion } from 'framer-motion';
import { CustomTitle } from '@/components/custom/title';
import { CustomSubtitle } from '@/components/custom/subtitle';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Shield, BarChart3, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'Automação de Tarefas',
      description: 'Automatize tarefas repetitivas e economize tempo com nosso sistema de automação inteligente que aprende com seus padrões de trabalho.',
      color: 'blue',
      stat: '4x mais rápido',
      statLabel: 'Aumento de Velocidade'
    },
    {
      icon: Shield,
      title: 'Otimização de Fluxo de Trabalho',
      description: 'Otimize seus processos com insights orientados por IA e manuseio seguro de dados, garantindo que suas informações permaneçam confidenciais.',
      color: 'red',
      stat: '99.9%',
      statLabel: 'Tempo de Atividade'
    },
    {
      icon: BarChart3,
      title: 'Análises e Insights',
      description: 'Obtenha insights valiosos sobre suas operações com nossos poderosos painéis de análise e relatórios em tempo real.',
      color: 'green',
      stat: '90%',
      statLabel: 'Melhoria na Eficiência'
    },
    {
      icon: Users,
      title: 'Colaboração em Equipe',
      description: 'Facilite a colaboração em equipe com ferramentas de comunicação integradas e gerenciamento de projetos em tempo real.',
      color: 'purple',
      stat: '50%',
      statLabel: 'Redução de Reuniões'
    }
  ];

  return (
    <section id="features" className="py-24 bg-background border-b border-border/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-center flex-col text-center gap-5 mb-16"
        >
          <CustomSubtitle className="py-1 text-purple-600 font-semibold border-b-2 border-purple-600 mb-1.5">
            Superpoderes
          </CustomSubtitle>
          <CustomTitle>Funcionalidades que fazem a diferença</CustomTitle>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra as capacidades que transformam ideias em resultados concretos, impulsionando seu desenvolvimento com inteligência artificial avançada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className={`h-full bg-background border border-border transition-all duration-500 p-8 relative overflow-hidden hover:shadow-lg hover:border-${feature.color}-500 group-hover:shadow-${feature.color}-500/30`}>
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`size-12 rounded-md flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-md relative overflow-hidden group-hover:shadow-${feature.color}-500/30 bg-${feature.color}-100 dark:bg-${feature.color}-900/20`}>
                      <feature.icon className={`size-6 relative z-10 drop-shadow-sm text-${feature.color}-600`} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-foreground mb-1">{feature.stat}</div>
                      <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{feature.statLabel}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-6 group-hover:text-foreground transition-colors leading-tight">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-8 font-medium">
                    {feature.description}
                  </p>
                </CardContent>
                
                {/* Bottom border animation */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left from-${feature.color}-500 via-${feature.color}-600 to-${feature.color}-700`} />
                
                {/* Background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-100/0 group-hover:from-slate-50/30 group-hover:to-slate-100/10 dark:from-slate-900/0 dark:to-slate-800/0 transition-all duration-500 pointer-events-none" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
