
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CustomBadge } from '@/components/custom/badge';
import { CustomTitle } from '@/components/custom/title';
import { CustomSubtitle } from '@/components/custom/subtitle';

import Link from 'next/link'; 

const FAQ = () => {
  const faqs = [
    {
      question: "O que está incluído no teste gratuito?",
      answer: "Todos os planos incluem um teste gratuito de 7 dias com acesso completo a todos os recursos. Não é necessário cartão de crédito para iniciar seu teste."
    },
    {
      question: "Posso mudar meu plano a qualquer momento?",
      answer: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor imediatamente e faremos a cobrança proporcional."
    },
    {
      question: "Quais métodos de pagamento vocês aceitam?",
      answer: "Aceitamos todos os principais cartões de crédito (Visa, MasterCard, American Express), PayPal e transferências bancárias para planos anuais."
    },
    {
      question: "Existe taxa de configuração?",
      answer: "Não, não há taxas de configuração ou custos ocultos. Você paga apenas pelo plano escolhido, e o preço inclui tudo listado nos recursos."
    },
    {
      question: "Vocês oferecem reembolso?",
      answer: "Sim, oferecemos uma garantia de devolução do dinheiro de 30 dias. Se não estiver satisfeito com nosso serviço, faremos o reembolso total em até 30 dias da compra."
    },
    {
      question: "Como funciona o desconto anual?",
      answer: "Quando você escolhe cobrança anual, ganha 2 meses grátis (equivalente a 20% de desconto). O desconto é aplicado automaticamente ao seu total."
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento. Seu serviço continuará até o final do período de cobrança atual."
    },
    {
      question: "Vocês oferecem soluções empresariais personalizadas?",
      answer: "Absolutamente! Para grandes organizações com necessidades específicas, oferecemos preços e recursos customizados. Entre em contato com nossa equipe de vendas para discutir suas necessidades."
    }
  ];

  return (
    <section className="py-24 bg-background" id="faq">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }} className="flex items-center justify-center flex-col text-center gap-5 mb-25">
          <CustomBadge>
            FAQ
          </CustomBadge>

          <CustomTitle>
            Perguntas Frequentes
          </CustomTitle>
          
          <CustomSubtitle>
            Tem dúvidas? Nós temos respostas. Aqui estão as perguntas mais comuns sobre nossos preços e serviços.
          </CustomSubtitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem 
                  value={`item-${index}`} 
                  className="bg-background rounded-lg border! border-border px-6 hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-start font-semibold text-foreground hover:text-purple-600 data-[state=open]:text-purple-600 transition-colors cursor-pointer">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center items-center gap-1.5 text-center mt-12"
        >
          <span className="text-muted-foreground">
            Ainda tem dúvidas?
          </span>

          <Link href="#contact" className="text-purple-600 hover:text-purple-700 transition-colors hover:underline">
            Entre em contato com nossa equipe de suporte
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
