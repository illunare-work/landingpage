
import { motion } from 'framer-motion';
import Marquee from "@/components/ui/marquee";
import { CustomBadge } from '@/components/custom/badge';
import { CustomTitle } from '@/components/custom/title';
import { CustomSubtitle } from '@/components/custom/subtitle';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from 'next/image';

const Testimonials = () => {
  const isMobile = useIsMobile();
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CEO, TechStart',
      content: 'A illunare transformou nossas operações. 300% de crescimento em 6 meses!',
      avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Marcus Johnson',
      role: 'CTO, InnovateLab',
      content: 'Melhor decisão que tomamos. Os recursos de IA são revolucionários.',
      avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder, GrowthCo',
      content: 'Plataforma incrível. A produtividade da nossa equipe aumentou 250%.',
      avatar: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'David Kim',
      role: 'VP, ScaleUp Inc',
      content: 'Integração perfeita, análises poderosas. Recomendo fortemente!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Lisa Thompson',
      role: 'CMO, BrandForward',
      content: 'Os recursos de automação nos pouparam 40 horas por semana.',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Alex Martinez',
      role: 'Director, FutureFlow',
      content: 'Suporte e recursos excepcionais. Perfeito para escalar.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Jennifer Park',
      role: 'Product Manager, InnovateX',
      content: 'A experiência do usuário é excepcional. Nossos clientes adoram.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Michael Brown',
      role: 'Head of Operations, ScaleTech',
      content: 'Reduziu nossos custos operacionais em 40% melhorando a eficiência.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Rachel Green',
      role: 'Marketing Director, GrowthLab',
      content: 'O painel de análises nos dá insights que nunca tivemos antes.',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
    <div className="flex-shrink-0 w-[350px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-border/50 shadow-sm mx-4 my-2">
      <p className="text-muted-foreground mb-4 font-medium">{testimonial.content}</p>
      <div className="flex items-center gap-3">
        <Image 
          src={testimonial.avatar} 
          alt={testimonial.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-foreground">{testimonial.name}</div>
          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section className="py-24 bg-background overflow-hidden border-b border-border/50">
      <div className="container mx-auto px-6 mb-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }} className="flex items-center justify-center flex-col text-center gap-5 mb-16">
          <CustomBadge>
            Depoimentos
          </CustomBadge>

          <CustomTitle>
            Histórias de Sucesso
          </CustomTitle>
          
          <CustomSubtitle>
            Empresas reais compartilham como a illunare transformou seus processos, 
            aumentou produtividade e impulsionou resultados extraordinários.
          </CustomSubtitle>
        </motion.div>
      </div>

      <div className="container mx-auto px-6">
        <motion.div 
          className="relative flex md:h-[900px] w-full flex-col lg:flex-row items-center justify-center overflow-hidden gap-1 lg:gap-3 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ 
            contain: 'layout style paint',
            isolation: 'isolate',
          }}
         >
          <Marquee pauseOnHover vertical={isMobile ? false : true} className="[--duration:20s] flex-1">
            {firstColumn.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical={isMobile ? false : true} className="[--duration:25s] flex-1">
            {secondColumn.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </Marquee>
          <Marquee pauseOnHover vertical={isMobile ? false : true} className="[--duration:30s] flex-1">
            {thirdColumn.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </Marquee>
          <div className="hidden lg:block pointer-events-none absolute inset-x-0 top-0 h-1/8 bg-gradient-to-b from-background"></div>
          <div className="hidden lg:block pointer-events-none absolute inset-x-0 bottom-0 h-1/8 bg-gradient-to-t from-background"></div>
          <div className="lg:hidden pointer-events-none absolute inset-y-0 start-0 w-1/8 bg-gradient-to-r from-background"></div>
          <div className="lg:hidden pointer-events-none absolute inset-y-0 end-0 w-1/8 bg-gradient-to-l from-background"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
