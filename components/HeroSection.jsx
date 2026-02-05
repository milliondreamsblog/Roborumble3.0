"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link"; // Assuming next/link is used for navigation
// Icons from lucide-react (standard in many Next.js projects) or just SVGs if not available. 
// I will use SVGs to be safe and dependency-free.

const HeroSectionNew = () => {
  const canvasRef = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // --- MATRIX RAIN EFFECT ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";
    const fontSize = 14;
    const columns = width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      // Black with slight opacity for trail effect
      ctx.fillStyle = "rgba(2, 6, 23, 0.05)";
      ctx.fillRect(0, 0, width, height);

      // Green text
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      setWindowSize({ width, height });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative w-full h-[100dvh] bg-[#020617] overflow-hidden flex flex-col items-center justify-center">
      {/* 1. Matrix Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
      />

      {/* 2. Vignette/Overlay for better text contrast */}
      <div className="absolute inset-0 z-0 bg-radial-gradient-vignette opacity-80 pointer-events-none" />

      {/* LAYER 2: HERO SECTION CONTENT */}
      <div className="relative z-10 w-full flex-grow flex flex-col items-center justify-center pt-24 md:pt-32">

        {/* ROBOT IMAGE */}
        <motion.div
          className="relative w-full flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, y: [-10, 10, -10] }}
          transition={{
            opacity: { duration: 1 },
            scale: { duration: 1 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <img
            src="/uiettechfest.jpeg"
            alt="Robo Theme"
            className="h-[40vh] md:h-[55vh] w-auto object-contain drop-shadow-[0_10px_30px_rgba(0,200,255,0.2)]"
            style={{
              maskImage: "linear-gradient(to bottom, black 50%, transparent 95%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 95%)",
            }}
          />
        </motion.div>

        {/* TITLE & PRIZE POOL */}
        <div className="flex flex-col items-center gap-6 pb-20 -mt-10 md:-mt-14 relative z-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-green-400 font-black tracking-widest text-center uppercase px-4"
            style={{
              fontSize: "clamp(28px, 6vw, 64px)",
              filter: "drop-shadow(0 0 20px rgba(34, 255, 200, 0.5))",
            }}
          >
            ROBO RUMBLE'26
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg blur-2xl opacity-20 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative px-8 sm:px-12 py-3 sm:py-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg flex flex-col items-center shadow-lg">
              <span className="text-cyan-400 text-[10px] sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] font-bold uppercase mb-1">
                Total Prize Pool
              </span>
              <span className="text-white text-2xl sm:text-4xl md:text-5xl font-bold tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                ₹ 1,56,000
              </span>
            </div>
          </motion.div>

          {/* REGISTER BUTTON */}
          <Link href="/dashboard">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0, 255, 255, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-widest rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.3)] relative overflow-hidden group"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>

          {/* Button 2: EXPLORE EVENTS (Cyan Hollow) */}
          <Link
            href="/events"
            className="group relative w-auto flex items-center justify-center gap-2 border border-[#00FFFF] text-[#00FFFF] font-mono font-bold text-sm md:text-base px-8 py-4 hover:bg-[#00FFFF]/10 transition-all duration-300 min-w-[200px]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            {/* Decoration corners */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00FFFF]"></span>
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00FFFF]"></span>
            EXPLORE_EVENTS
          </Link>

          {/* Button 3: BROCHURE (Purple Outline) */}
          <a
            href="/brochure.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full md:w-auto flex items-center justify-center gap-2 border border-purple-500 text-purple-400 font-mono font-bold text-sm md:text-base px-8 py-4 rounded-md hover:bg-purple-500/10 transition-all duration-300 min-w-[200px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            BROCHURE.PDF
          </a>

        </div>

      </div>

      {/* FOOTER DECORATIONS (Optional lines/grid from image) */}
      <div className="absolute bottom-10 w-full flex justify-between px-10 opacity-30 pointer-events-none hidden md:flex">
        <div className="h-full flex gap-2">
          <div className="w-[1px] h-10 bg-white/20"></div>
          <div className="w-[1px] h-16 bg-white/40"></div>
          <div className="w-[1px] h-8 bg-white/20"></div>
        </div>

      </div>

    </section>
  );
};

export default HeroSectionNew;