'use client';

import Header from '@/components/header';
import Hero from '@/components/hero';
import TrustedBrands from '@/components/trusted-brands';
import HowItWorks from '@/components/how-it-works';
import Features from '@/components/features';
import Testimonials from '@/components/testimonials';
import Pricing from '@/components/pricing';
import FAQ from '@/components/faq';
import CallToAction from '@/components/call-to-action';
import Contact from '@/components/contact';
import Footer from '@/components/footer';
import { MainFeature } from '@/components/main-feature';
import ScrollToTop from '@/components/ui/scroll-to-top';

export default function Page() {
	return (
		<div className="min-h-screen">
			<Header />
      <Hero />
      <TrustedBrands />
      <HowItWorks />
      <Features />
      <Testimonials />
      <MainFeature />
      <Pricing />
      <FAQ />
      <CallToAction />
      <Contact />
      <Footer />
      <ScrollToTop />
		</div>		
	);
}
