import { useEffect, useState } from "react";
import SideNav from "@/components/SideNav";
import { FloralBanner } from "@/components/FloralHeader";

const START_DATE = new Date("2026-03-01");

// Floral wreath frame around the D+day number
const FloralFrame = ({ days }: { days: number }) => (
  <div className="relative flex items-center justify-center mx-auto" style={{ width: 340, height: 340 }}>
    {/* Outer ring SVG */}
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 340 340"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle guide (invisible) */}
      <circle cx="170" cy="170" r="148" fill="none" />

      {/* Petals around the wreath — 12 flowers evenly spaced */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const r = 148;
        const cx = 170 + r * Math.sin(angle);
        const cy = 170 - r * Math.cos(angle);
        const size = i % 3 === 0 ? 20 : 14;
        const color = i % 2 === 0 ? "#f5a0b5" : "#f9c4d4";
        const center = i % 2 === 0 ? "#fde8d8" : "#fff0f5";
        return (
          <g key={i} transform={`translate(${cx},${cy})`}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <ellipse
                key={a}
                cx={0} cy={-(size * 0.42)}
                rx={size * 0.32} ry={size * 0.42}
                fill={color} opacity={0.85}
                transform={`rotate(${a} 0 0)`}
              />
            ))}
            <circle cx={0} cy={0} r={size * 0.22} fill={center} />
          </g>
        );
      })}

      {/* Leaves between flowers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = ((i * 30 + 15) * Math.PI) / 180;
        const r = 148;
        const cx = 170 + r * Math.sin(angle);
        const cy = 170 - r * Math.cos(angle);
        const deg = i * 30 + 15;
        return (
          <ellipse
            key={i}
            cx={cx} cy={cy}
            rx={5} ry={11}
            fill="#b8ddb0" opacity={0.7}
            transform={`rotate(${deg} ${cx} ${cy})`}
          />
        );
      })}

      {/* Inner soft circle bg */}
      <circle cx="170" cy="170" r="118" fill="rgba(255,248,245,0.88)" />
      <circle cx="170" cy="170" r="118" fill="none" stroke="#f0c0d0" strokeWidth="1.5" />
    </svg>

    {/* Content inside frame */}
    <div className="relative z-10 flex flex-col items-center justify-center text-center" style={{ width: 220 }}>
      <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "#c47a95" }}>
        우리가 함께한 날
      </p>
      <div
        className="font-serif font-light"
        style={{ fontSize: "3.8rem", lineHeight: 1, color: "#c04878", letterSpacing: "-0.02em" }}
      >
        D+{days}
      </div>
      <p className="mt-4 text-[11px] tracking-widest" style={{ color: "#c4909a" }}>
        2026.03.01 ~
      </p>
    </div>
  </div>
);

const DdayPage = () => {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const diff = Math.floor((new Date().getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
    setDays(diff + 1);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#fdf0ea" }}>
      <SideNav />
      <div className="pl-9">
        <FloralBanner title="D+day" subtitle="Since We Met" />
        <main className="pb-20 px-6 flex flex-col items-center pt-10">
          <FloralFrame days={days} />
          <p className="mt-8 font-serif italic text-center" style={{ color: "#9a5870", fontSize: "1rem", letterSpacing: "0.1em" }}>
            매일이 소중한 우리의 날들 ♡
          </p>
        </main>
      </div>
    </div>
  );
};

export default DdayPage;
