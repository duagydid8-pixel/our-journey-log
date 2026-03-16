import { motion, type Transition } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/lib/api";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const transition: Transition = { duration: 0.8, ease };

const HeroSection = () => {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: getSettings });

  const startDate = new Date(settings?.start_date || "2021-05-20");
  const nextTripDate = new Date(settings?.next_trip_date || "2026-12-24");
  const nextTripName = settings?.next_trip_name || "후쿠오카";

  const now = new Date();
  const daysTogether = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntil = Math.floor((nextTripDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <section className="relative bg-hero-bg pt-14 overflow-hidden">
      <div className="grid-pattern absolute inset-0 opacity-60" />

      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] opacity-30 pointer-events-none hidden md:block"
          viewBox="0 0 600 200"
        >
          <path d="M 80 150 Q 200 50 300 100 Q 400 150 520 60" fill="none" stroke="hsl(20 40% 50%)" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="80" cy="150" r="4" fill="hsl(20 40% 50%)" />
          <circle cx="80" cy="150" r="8" fill="none" stroke="white" strokeWidth="4" />
          <text x="80" y="175" textAnchor="middle" style={{ fontSize: 11, fill: "#8c857e" }}>태안</text>
          <circle cx="300" cy="100" r="4" fill="hsl(20 40% 50%)" />
          <circle cx="300" cy="100" r="8" fill="none" stroke="white" strokeWidth="4" />
          <text x="300" y="125" textAnchor="middle" style={{ fontSize: 11, fill: "#8c857e" }}>평택</text>
          <circle cx="520" cy="60" r="4" fill="hsl(20 40% 50%)" />
          <circle cx="520" cy="60" r="8" fill="none" stroke="white" strokeWidth="4" />
          <text x="520" y="85" textAnchor="middle" style={{ fontSize: 11, fill: "#8c857e" }}>후쿠오카</text>
        </svg>

        <div className="relative z-10 text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="text-5xl md:text-7xl tracking-tighter text-charcoal mb-3"
          >
            우리의 <span className="font-serif italic">여행 기록</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.15 }}
            className="font-serif text-lg tracking-[0.3em] text-taupe"
          >
            H & J
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.3 }}
          className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto"
        >
          <div className="flex-1 bg-surface/80 backdrop-blur-sm border border-border p-6 md:p-8 text-center">
            <p className="text-[10px] tracking-[0.2em] uppercase text-taupe mb-2">함께한 날</p>
            <p className="text-3xl md:text-4xl font-light text-terracotta font-serif">
              D + {daysTogether.toLocaleString()}
            </p>
            <p className="text-[11px] text-taupe mt-2">{settings?.start_date || "2021.05.20"} ~</p>
          </div>
          <div className="flex-1 bg-surface/80 backdrop-blur-sm border border-border p-6 md:p-8 text-center">
            <p className="text-[10px] tracking-[0.2em] uppercase text-taupe mb-2">다음 여행</p>
            <p className="text-3xl md:text-4xl font-light text-terracotta font-serif">
              D - {daysUntil}
            </p>
            <p className="text-[11px] text-taupe mt-2">{nextTripName}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
