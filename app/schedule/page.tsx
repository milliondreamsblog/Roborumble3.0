"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { SlotText } from "../components/SlotText";
import Footer from "../components/Footer";
import { Clock, MapPin, Activity, ShieldAlert, Terminal } from "lucide-react";
import { useAudio } from "../hooks/useAudio";

// --- Types ---
interface Event {
  time: string;
  title: string;
  venue: string;
  type: string;
}

interface DayBlock {
  id: number;
  date: string;
  month: string;
  dayName: string;
  events: Event[];
}

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState(1);
  const playHoverSound = useAudio("audio.wav", 0.1);

  const scheduleData: DayBlock[] = [
    {
      id: 1,
      date: "9",
      month: "MAR",
      dayName: "MON",
      events: [
        {
          time: "10:00 AM",
          title: "Inauguration Ceremony",
          venue: "Innovation Cell CSJMU",
          type: "General",
        },
        {
          time: "11:00 AM",
          title: "Line Following Bot",
          venue: "Innovation Cell CSJMU",
          type: "Competition",
        },
        {
          time: "03:00 PM",
          title: "Project Expo",
          venue: "Innovation Cell CSJMU",
          type: "Exhibition",
        },
      ],
    },
    {
      id: 2,
      date: "10",
      month: "MAR",
      dayName: "TUE",
      events: [
        {
          time: "10:00 AM",
          title: "Robo Race",
          venue: "Innovation Cell CSJMU",
          type: "Competition",
        },
        {
          time: "12:00 PM",
          title: "Robo Wars",
          venue: "UIET CSJMU",
          type: "Competition",
        },
        {
          time: "03:00 PM",
          title: "Robo Soccer",
          venue: "UIET CSJMU",
          type: "Competition",
        },
      ],
    },
    {
      id: 3,
      date: "11",
      month: "MAR",
      dayName: "WED",
      events: [
        {
          time: "10:00 AM",
          title: "Esports Finals",
          venue: "UIET CSJMU",
          type: "Competition",
        },
        {
          time: "01:00 PM",
          title: "Defence Talk",
          venue: "UIET CSJMU",
          type: "Seminar",
        },
        {
          time: "03:00 PM",
          title: "Defence Expo",
          venue: "UIET CSJMU",
          type: "Exhibition",
        },
      ],
    },
  ];

  const activeDay = scheduleData.find((d) => d.id === activeTab);

  return (
    <main className="min-h-screen bg-transparent text-white relative overflow-hidden">
      {/* Background Matrix Effect */}


      <div className="relative z-10 pt-40 pb-20 container mx-auto px-4 md:px-8">
        {/* Page Header */}
        <div className="mb-20 text-center">
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4">
            <div className="h-[2px] w-12 md:w-20 bg-[#FF003C]" />
            <span className="text-[#FF003C] font-mono text-xs md:text-sm font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase">SYNCHRONIZING_SYSTEM_CLOCK</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black font-mono tracking-tighter uppercase leading-[0.85] mb-8 break-words">
            <div className="relative inline-block glitch-container">
              <span className="absolute top-0 left-0 text-[#FF003C] mix-blend-screen opacity-70 glitch-layer-red" style={{ transform: 'translate(-0.02em, 0.02em)' }}>
                EVENT
              </span>

              <span
                className={`text-xs md:text-sm tracking-widest mt-1 uppercase transition-colors duration-300
                  ${activeTab === item.id ? "text-[#00FF9E]" : ""}`}
              >
                {item.dayName}
              </span>
              <span className="relative text-white">EVENT</span>
            </div>
            <br />
            <div className="flex justify-center w-full">
              <SlotText text="TIMELINE_" className="text-4xl md:text-6xl lg:text-8xl" />
            </div>
          </h1>

          <div className="max-w-2xl mx-auto">
            <p className="text-zinc-500 text-lg leading-relaxed font-mono border-l-2 border-[#FF003C] pl-6 py-2 bg-gradient-to-r from-[#FF003C]/5 to-transparent uppercase text-xs">
              Monitor real-time operational schedule. Track all active deployment zones and engagement windows across the campus grid.
            </p>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="space-y-32">
          {schedule.map((dayBlock, dayIndex) => (
            <div key={dayIndex} className="relative">
              {/* Day Header */}
              <div className="flex items-center gap-6 mb-12">
                <div className="w-12 h-12 border border-[#00F0FF]/50 flex items-center justify-center bg-[#00F0FF]/10 text-[#00F0FF] font-mono font-bold">
                  0{dayIndex + 1}
                </div>
                <h2 className="text-4xl font-black text-white font-mono uppercase tracking-tighter italic">
                  {dayBlock.day}
                </h2>
                <div className="flex-grow h-[1px] bg-gradient-to-r from-[#00F0FF]/30 to-transparent" />
              </div>

              {/* Vertical Line */}
              <div className="relative border-l border-zinc-800 ml-6 space-y-12">
                {dayBlock.events.map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-12 group"
                    onMouseEnter={() => playHoverSound()}
                  >
                    {/* Timeline Node */}
                    <div className="absolute -left-[5px] top-2 w-[10px] h-[10px] bg-black border border-[#00F0FF] group-hover:bg-[#00F0FF] group-hover:shadow-[0_0_10px_#00F0FF] transition-all" />

                    {/* Event Card */}
                    <div
                      className="relative p-6 bg-zinc-950/50 border border-white/5 hover:border-[#00F0FF]/40 transition-all duration-500 backdrop-blur-md overflow-hidden"
                      style={{ clipPath: 'polygon(0 0, 95% 0, 100% 20%, 100% 100%, 5% 100%, 0 80%)' }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Activity size={14} className="text-[#FF003C] animate-pulse" />
                            <span className="text-[#FF003C] font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
                              // {event.type}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-white font-mono tracking-tighter uppercase group-hover:text-[#00F0FF] transition-colors">
                            {event.title}
                          </h3>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 text-xs font-mono">
                          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 border border-white/5">
                            <Clock size={16} className="text-[#00F0FF]" />
                            <span className="text-zinc-300">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 border border-white/5">
                            <MapPin size={16} className="text-[#FF003C]" />
                            <span className="text-zinc-300">{event.venue}</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl md:text-3xl font-black text-white font-['Orbitron'] tracking-wide uppercase group-hover:text-[#00F0FF] transition-colors">
                        {event.title}
                      </h3>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 md:gap-8 text-xs md:text-sm font-mono">
                      <div className="flex items-center gap-3 bg-white/5 px-4 py-2 border border-white/5 rounded">
                        <Clock size={16} className="text-[#00F0FF]" />
                        <span className="text-zinc-300">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white/5 px-4 py-2 border border-white/5 rounded">
                        <MapPin size={16} className="text-[#FF003C]" />
                        <span className="text-zinc-300">{event.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Scan Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F0FF]/5 to-transparent h-[10%] w-full opacity-0 group-hover:opacity-100 animate-scan pointer-events-none" />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Data */}
        <div className="mt-20 pt-10 border-t border-zinc-900 w-full max-w-5xl flex flex-col md:flex-row justify-between items-center text-zinc-600 font-mono text-[10px] uppercase tracking-widest gap-4">
          <div className="flex items-center gap-4">
            <ShieldAlert size={12} />
            <span>Operational Integrity: 99.8%</span>
          </div>
          <div className="flex items-center gap-4">
            <Terminal size={12} />
            <span>User_Access: Verified_Guest</span>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}