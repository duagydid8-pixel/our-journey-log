import { motion } from "framer-motion";

const START_DATE = new Date("2026-03-01");

const daysTogether = Math.floor(
  (new Date().getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24)
);

const HeroSection = () => {
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(180deg, #b8dff5 0%, #d6eef8 30%, #e8f4f0 60%, #f0ede0 100%)",
      }}
    >
      {/* ── Sky layer ── */}

      {/* Sun glow */}
      <div
        className="absolute"
        style={{
          top: "8%",
          right: "18%",
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "radial-gradient(circle, #fff5c0 0%, #fde68a88 50%, transparent 75%)",
          filter: "blur(6px)",
        }}
      />

      {/* Clouds */}
      <Cloud x="8%" y="12%" scale={1.2} delay={0} />
      <Cloud x="55%" y="7%" scale={0.85} delay={1.5} />
      <Cloud x="72%" y="18%" scale={1} delay={3} />
      <Cloud x="30%" y="20%" scale={0.65} delay={0.8} />

      {/* Birds */}
      <Birds x="62%" y="14%" delay={0} />
      <Birds x="22%" y="10%" delay={2} />

      {/* ── Hill / Ground layer ── */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 340"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Back hill */}
        <ellipse cx="900" cy="420" rx="700" ry="260" fill="#b8d8a0" opacity="0.55" />
        {/* Mid hill */}
        <path
          d="M0,220 Q200,100 440,160 Q680,220 900,140 Q1100,70 1440,180 L1440,340 L0,340 Z"
          fill="#8fbe6e"
          opacity="0.75"
        />
        {/* Front ground */}
        <path
          d="M0,280 Q300,240 600,265 Q900,290 1200,255 Q1340,240 1440,260 L1440,340 L0,340 Z"
          fill="#6aaa44"
        />
      </svg>

      {/* Grass blades */}
      <GrassRow />

      {/* Tiny flower dots */}
      <Flowers />

      {/* ── Tree silhouettes ── */}
      <TreeLeft />
      <TreeRight />

      {/* ── Center content ── */}
      <div className="relative z-10 flex flex-col items-center select-none" style={{ marginTop: "-60px" }}>
        {/* Script title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif italic text-center leading-tight"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            color: "#3d2e1a",
            letterSpacing: "0.06em",
            textShadow: "0 2px 12px rgba(255,255,240,0.6)",
          }}
        >
          H &amp; J
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.32em",
            color: "#6b5a3e",
            textTransform: "uppercase",
            marginTop: "0.5rem",
          }}
        >
          우리의 여행 기록
        </motion.p>

        {/* D+day pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <div
            style={{
              background: "rgba(255,252,240,0.72)",
              border: "1px solid rgba(180,155,100,0.35)",
              borderRadius: "999px",
              padding: "0.45rem 1.6rem",
              backdropFilter: "blur(6px)",
              boxShadow: "0 2px 16px rgba(100,80,40,0.08)",
            }}
          >
            <span
              className="font-serif"
              style={{ fontSize: "1.5rem", color: "#b87333", letterSpacing: "0.04em", fontWeight: 400 }}
            >
              D + {daysTogether}
            </span>
          </div>
          <span style={{ fontSize: "0.65rem", color: "#8a7456", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            2026.03.01 ~
          </span>
        </motion.div>
      </div>

      {/* Soft bottom fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-16 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(106,170,68,0.18), transparent)" }}
      />
    </div>
  );
};

/* ── Sub-components ── */

const Cloud = ({ x, y, scale, delay }: { x: string; y: string; scale: number; delay: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    animate={{ x: [0, 14, 0] }}
    transition={{ duration: 9 + delay * 2, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg
      width={120 * scale}
      height={54 * scale}
      viewBox="0 0 120 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="60" cy="38" rx="54" ry="16" fill="white" opacity="0.82" />
      <ellipse cx="45" cy="30" rx="26" ry="20" fill="white" opacity="0.88" />
      <ellipse cx="72" cy="28" rx="22" ry="18" fill="white" opacity="0.85" />
      <ellipse cx="55" cy="24" rx="18" ry="16" fill="white" opacity="0.9" />
    </svg>
  </motion.div>
);

const Birds = ({ x, y, delay }: { x: string; y: string; delay: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    animate={{ x: [0, 20, 0], y: [0, -5, 0] }}
    transition={{ duration: 7 + delay, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg width="52" height="20" viewBox="0 0 52 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 10 Q8 4 14 10" stroke="#5a7a5a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M20 8 Q26 2 32 8" stroke="#5a7a5a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M38 11 Q44 5 50 11" stroke="#5a7a5a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  </motion.div>
);

const GrassRow = () => (
  <svg
    className="absolute pointer-events-none"
    style={{ bottom: 52, left: 0, width: "100%", height: 60 }}
    viewBox="0 0 1440 60"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {Array.from({ length: 72 }).map((_, i) => {
      const x = i * 20 + 4;
      const h = 14 + ((i * 7) % 12);
      const lean = (i % 3 === 0 ? -3 : i % 3 === 1 ? 3 : 0);
      return (
        <line
          key={i}
          x1={x} y1={60}
          x2={x + lean} y2={60 - h}
          stroke="#4e8c2a"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={0.55 + (i % 4) * 0.1}
        />
      );
    })}
  </svg>
);

const Flowers = () => (
  <svg
    className="absolute pointer-events-none"
    style={{ bottom: 55, left: 0, width: "100%", height: 30 }}
    viewBox="0 0 1440 30"
    xmlns="http://www.w3.org/2000/svg"
  >
    {[60, 160, 300, 480, 620, 780, 950, 1100, 1280, 1380].map((x, i) => (
      <g key={i} transform={`translate(${x},${18 - (i % 3) * 3})`}>
        <circle cx="0" cy="0" r="3.5" fill={i % 2 === 0 ? "#f9d0d0" : "#fde68a"} opacity="0.9" />
        <circle cx="0" cy="-5" r="2" fill={i % 2 === 0 ? "#f9d0d0" : "#fde68a"} opacity="0.7" />
        <circle cx="4" cy="2" r="2" fill={i % 2 === 0 ? "#f9d0d0" : "#fde68a"} opacity="0.7" />
        <circle cx="-4" cy="2" r="2" fill={i % 2 === 0 ? "#f9d0d0" : "#fde68a"} opacity="0.7" />
      </g>
    ))}
  </svg>
);

const TreeLeft = () => (
  <svg
    className="absolute pointer-events-none"
    style={{ bottom: 60, left: "2%", width: 110, height: 200 }}
    viewBox="0 0 110 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Trunk */}
    <rect x="46" y="130" width="18" height="70" rx="4" fill="#7c5c3a" />
    {/* Canopy layers */}
    <ellipse cx="55" cy="120" rx="48" ry="36" fill="#4a7c2f" opacity="0.9" />
    <ellipse cx="55" cy="98" rx="38" ry="30" fill="#5a9436" opacity="0.95" />
    <ellipse cx="55" cy="78" rx="28" ry="24" fill="#6aaa44" />
    <ellipse cx="55" cy="62" rx="18" ry="18" fill="#78be4e" />
    {/* Highlight */}
    <ellipse cx="44" cy="68" rx="8" ry="6" fill="#a0d46a" opacity="0.4" />
  </svg>
);

const TreeRight = () => (
  <svg
    className="absolute pointer-events-none"
    style={{ bottom: 60, right: "4%", width: 90, height: 170 }}
    viewBox="0 0 90 170"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="37" y="110" width="16" height="60" rx="4" fill="#7c5c3a" />
    <ellipse cx="45" cy="100" rx="38" ry="30" fill="#4a7c2f" opacity="0.88" />
    <ellipse cx="45" cy="82" rx="30" ry="25" fill="#5a9436" opacity="0.95" />
    <ellipse cx="45" cy="65" rx="22" ry="20" fill="#6aaa44" />
    <ellipse cx="45" cy="50" rx="14" ry="15" fill="#78be4e" />
    <ellipse cx="36" cy="56" rx="6" ry="5" fill="#a0d46a" opacity="0.4" />
  </svg>
);

export default HeroSection;
