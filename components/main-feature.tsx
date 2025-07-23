"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function MainFeature() {
  const [parallax, setParallax] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
      setParallax({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-[300px] md:h-[60vh] w-full flex items-center justify-center relative overflow-hidden bg-slate-950"
    >
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="relative w-full aspect-[16/9]"
            animate={{
              x: parallax.x * 30, // px, adjust for intensity
              y: parallax.y * 30,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <Image
              src="/screens/3.png"
              alt="Background"
              fill
              className="object-cover [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
      <motion.h1  
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="leading-[1.2] text-2xl md:text-5xl lg:text-7xl font-semibold text-center text-white relative z-20">
        A <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Plataforma</span> Completa <br /> para seu Negócio
      </motion.h1>
    </div>
  );
}