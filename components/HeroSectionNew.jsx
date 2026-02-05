"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const HeroSectionNew = () => {
  const canvasRef = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

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
      ctx.fillStyle = "rgba(2, 6, 23, 0.05)";
      ctx.fillRect(0, 0, width, height);

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
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
      />

      <div className="absolute inset-0 z-0 bg-radial-gradient-vignette opacity-80 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-4 max-w-7xl mx-auto">

        <div className="mb-4 flex items-center gap-4 opacity-70">
          <div className="h-[1px] w-12 md:w-24 bg-red-600"></div>
          <span className="text-[10px] md:text-xs font-mono font-bold tracking-[0.3em] text-red-500 uppercase">
            Build Compete Dominate
          </span>
          <div className="h-[1px] w-12 md:w-24 bg-red-600"></div>
        </div>

        <div className="flex flex-col items-center leading-none select-none">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tighter mix-blend-screen drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            ROBO
          </h1>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tighter mix-blend-screen drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] -mt-2 md:-mt-6">
            RUMBLE
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mt-2 tracking-widest drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            3.0
          </h2>
        </div>

        <div className="mt-8 max-w-2xl px-4">
          <p className="text-gray-400 text-sm md:text-base font-mono leading-relaxed">
            Where Innovation Meets Competition. Join the ultimate robotics
            showdown featuring top talent from across the nation. //
          </p>
          <p className="text-green-500/80 text-xs md:text-sm font-mono mt-2 animate-pulse">
            SYSTEM_STATUS: READY
          </p>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">

          <Link
            href="/register"
            className="group relative w-full md:w-auto flex items-center justify-center gap-3 bg-[#FF003C] text-black font-bold font-mono text-sm md:text-base px-8 py-4 clip-path-slant hover:bg-[#ff3366] transition-all duration-300 min-w-[200px] cursor-pointer"
            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
          >
            REGISTER_NOW
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>

          <Link
            href="/events"
            className="group relative w-auto flex items-center justify-center gap-2 border border-[#00FFFF] text-[#00FFFF] font-mono font-bold text-sm md:text-base px-8 py-4 hover:bg-[#00FFFF]/10 transition-all duration-300 min-w-[200px] cursor-pointer"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00FFFF]"></span>
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00FFFF]"></span>
            EXPLORE_EVENTS
          </Link>

          <a
            href="/brochure.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full md:w-auto flex items-center justify-center gap-2 border border-purple-500 text-purple-400 font-mono font-bold text-sm md:text-base px-8 py-4 rounded-md hover:bg-purple-500/10 transition-all duration-300 min-w-[200px] cursor-pointer"
            aria-label="View Brochure PDF"
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            BROCHURE.PDF
          </a>

        </div>

      </div>

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