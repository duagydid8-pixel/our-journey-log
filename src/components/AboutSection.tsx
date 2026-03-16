import { motion } from "framer-motion";
import aboutPortrait from "@/assets/about-portrait.jpg";

const START_DATE = new Date("2021-05-20");
const getDaysTogether = () =>
  Math.floor((new Date().getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));

const stats = [
  { value: getDaysTogether().toLocaleString(), label: "함께한 날" },
  { value: "4", label: "여행 횟수" },
  { value: "∞", label: "추억" },
  { value: "♡", label: "사랑" },
];

const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

const AboutSection = () => {
  return (
    <section id="about" className="bg-background py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left: Text + Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={transition}
          >
            <p className="text-[11px] tracking-[0.2em] uppercase text-taupe mb-2">소개</p>
            <h2 className="text-3xl md:text-4xl tracking-tighter text-charcoal mb-6">
              우리 <span className="font-serif italic">이야기</span>
            </h2>
            <p className="text-[15px] leading-relaxed text-taupe mb-10">
              우리는 기록하고, 기억합니다.<br />
              함께 걷는 모든 길 위의 조각들.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="border-t border-border pt-4">
                  <p className="text-3xl font-light text-terracotta font-serif">{stat.value}</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-taupe mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...transition, delay: 0.15 }}
            className="flex justify-center md:justify-end"
          >
            <div className="p-3 bg-surface shadow-sm max-w-sm">
              <img
                src={aboutPortrait}
                alt="H & J"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
