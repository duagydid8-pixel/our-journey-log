import { motion } from "framer-motion";

const START_DATE = new Date("2026-03-01");
const daysTogether = Math.floor(
  (new Date().getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24)
);

/* ── individual flower / leaf helpers ── */

// Red poppy
const Poppy = ({ x, y, r = 0 }: { x: number; y: number; r?: number }) => (
  <g transform={`translate(${x},${y}) rotate(${r})`}>
    <ellipse cx="0" cy="-13" rx="9" ry="14" fill="#e03030" opacity="0.92" transform="rotate(0 0 0)" />
    <ellipse cx="0" cy="-13" rx="9" ry="14" fill="#d02020" opacity="0.85" transform="rotate(90 0 0)" />
    <ellipse cx="0" cy="-13" rx="9" ry="14" fill="#e84040" opacity="0.8"  transform="rotate(45 0 0)" />
    <ellipse cx="0" cy="-13" rx="9" ry="14" fill="#cc2020" opacity="0.8"  transform="rotate(135 0 0)" />
    <circle cx="0" cy="0" r="5" fill="#1a1a2e" />
    <circle cx="-1" cy="-1" r="2" fill="#2a2a4e" opacity="0.7" />
  </g>
);

// Purple/lavender flower
const PurpleFlower = ({ x, y, r = 0, size = 1 }: { x: number; y: number; r?: number; size?: number }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${size})`}>
    {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => (
      <ellipse key={a} cx="0" cy="-11" rx="5" ry="10"
        fill="#9b59b6" opacity="0.88"
        transform={`rotate(${a} 0 0)`} />
    ))}
    <circle cx="0" cy="0" r="4.5" fill="#f9e4ff" />
    <circle cx="0" cy="0" r="2" fill="#c678dd" opacity="0.7" />
  </g>
);

// Orange rose
const OrangeRose = ({ x, y, r = 0 }: { x: number; y: number; r?: number }) => (
  <g transform={`translate(${x},${y}) rotate(${r})`}>
    <circle cx="0" cy="0" r="15" fill="#e8732a" opacity="0.9" />
    <circle cx="0" cy="0" r="11" fill="#f0883a" opacity="0.85" />
    <circle cx="0" cy="0" r="8"  fill="#f89c4a" opacity="0.9" />
    <circle cx="0" cy="0" r="5"  fill="#fdb060" opacity="0.95" />
    <circle cx="0" cy="0" r="2.5" fill="#ffc870" />
    {/* Petal edges */}
    {[0, 60, 120, 180, 240, 300].map(a => (
      <ellipse key={a} cx="0" cy="-13" rx="5" ry="8"
        fill="#e8732a" opacity="0.6"
        transform={`rotate(${a} 0 0)`} />
    ))}
  </g>
);

// Blue flower
const BlueFlower = ({ x, y, r = 0, size = 1 }: { x: number; y: number; r?: number; size?: number }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${size})`}>
    {[0, 51, 102, 153, 204, 255, 306].map((a) => (
      <ellipse key={a} cx="0" cy="-10" rx="5.5" ry="10"
        fill="#3a7bd5" opacity="0.88"
        transform={`rotate(${a} 0 0)`} />
    ))}
    <circle cx="0" cy="0" r="4" fill="#fff8e8" />
    <circle cx="0" cy="0" r="1.8" fill="#5a9be0" opacity="0.7" />
  </g>
);

// Leaf
const Leaf = ({ x, y, r = 0, size = 1, color = "#4a9e4a" }: {
  x: number; y: number; r?: number; size?: number; color?: string
}) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${size})`}>
    <ellipse cx="0" cy="-14" rx="7" ry="16" fill={color} opacity="0.85" />
    <line x1="0" y1="0" x2="0" y2="-26" stroke={color} strokeWidth="1" opacity="0.5" />
    {[-3, 3].map((dx, i) => (
      <line key={i} x1="0" y1="-8" x2={dx * 3} y2="-14"
        stroke={color} strokeWidth="0.8" opacity="0.4" />
    ))}
  </g>
);

/* ── The full floral circle illustration ── */
const FloralCircle = () => {
  const R = 210; // circle radius

  return (
    <svg
      width={R * 2 + 80}
      height={R * 2 + 80}
      viewBox={`${-R - 40} ${-R - 40} ${(R + 40) * 2} ${(R + 40) * 2}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soft drop shadow circle */}
      <circle cx="0" cy="0" r={R + 6} fill="rgba(0,0,0,0.08)" />

      {/* Main circle fill */}
      <circle cx="0" cy="0" r={R}
        fill="rgba(255,255,255,0.18)" />

      {/* Circle stroke */}
      <circle cx="0" cy="0" r={R}
        fill="none"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="3" />

      {/* Inner circle stroke */}
      <circle cx="0" cy="0" r={R - 14}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1" />

      {/* ── Flowers arranged around the circle ring ── */}

      {/* Top */}
      <PurpleFlower x={0}    y={-R + 2}  size={1.1} />
      <Poppy        x={-38}  y={-R + 14} />
      <Poppy        x={38}   y={-R + 14} />
      <BlueFlower   x={-72}  y={-R + 36} size={0.9} />
      <BlueFlower   x={72}   y={-R + 36} size={0.9} />
      <OrangeRose   x={-108} y={-R + 68} />
      <OrangeRose   x={108}  y={-R + 68} />
      <PurpleFlower x={-148} y={-R + 110} size={0.85} />
      <PurpleFlower x={148}  y={-R + 110} size={0.85} />

      {/* Left side */}
      <Poppy        x={-R + 18} y={0}    r={90} />
      <BlueFlower   x={-R + 38} y={-55}  size={0.9} r={20} />
      <BlueFlower   x={-R + 38} y={55}   size={0.9} r={-20} />

      {/* Right side */}
      <Poppy        x={R - 18}  y={0}    r={-90} />
      <BlueFlower   x={R - 38}  y={-55}  size={0.9} r={-20} />
      <BlueFlower   x={R - 38}  y={55}   size={0.9} r={20} />

      {/* Bottom */}
      <OrangeRose   x={0}    y={R - 18} />
      <Poppy        x={-42}  y={R - 28} r={15} />
      <Poppy        x={42}   y={R - 28} r={-15} />
      <PurpleFlower x={-80}  y={R - 52} size={0.9} />
      <PurpleFlower x={80}   y={R - 52} size={0.9} />
      <BlueFlower   x={-118} y={R - 88} size={0.85} />
      <BlueFlower   x={118}  y={R - 88} size={0.85} />

      {/* Leaves filling gaps */}
      <Leaf x={-20}  y={-R + 8}   r={0}    size={0.9} color="#3a8a3a" />
      <Leaf x={20}   y={-R + 8}   r={0}    size={0.9} color="#3a8a3a" />
      <Leaf x={-58}  y={-R + 26}  r={-25}  size={0.85} color="#4aaa4a" />
      <Leaf x={58}   y={-R + 26}  r={25}   size={0.85} color="#4aaa4a" />
      <Leaf x={-92}  y={-R + 56}  r={-45}  size={0.8} color="#3a9a3a" />
      <Leaf x={92}   y={-R + 56}  r={45}   size={0.8} color="#3a9a3a" />
      <Leaf x={-130} y={-R + 96}  r={-60}  color="#5aba5a" />
      <Leaf x={130}  y={-R + 96}  r={60}   color="#5aba5a" />
      <Leaf x={-168} y={-R + 148} r={-80}  size={0.9} color="#3a8a3a" />
      <Leaf x={168}  y={-R + 148} r={80}   size={0.9} color="#3a8a3a" />

      <Leaf x={-20}  y={R - 10}   r={180}  size={0.9} color="#3a8a3a" />
      <Leaf x={20}   y={R - 10}   r={180}  size={0.9} color="#3a8a3a" />
      <Leaf x={-62}  y={R - 34}   r={160}  size={0.85} color="#4aaa4a" />
      <Leaf x={62}   y={R - 34}   r={200}  size={0.85} color="#4aaa4a" />
      <Leaf x={-100} y={R - 68}   r={140}  size={0.8} color="#5aba5a" />
      <Leaf x={100}  y={R - 68}   r={220}  size={0.8} color="#5aba5a" />

      {/* ── Center text ── */}
      <text
        x="0" y="-18"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="52"
        fontStyle="italic"
        fontWeight="500"
        fill="white"
        style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.25))" }}
      >
        YU &amp; YEOM
      </text>
      <text
        x="0" y="18"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="12"
        fill="rgba(255,255,255,0.8)"
        letterSpacing="6"
      >
        OUR JOURNEY
      </text>
    </svg>
  );
};

/* ── Main component ── */
const HeroSection = () => (
  <div
    className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
    style={{ background: "#F2B5A0" }}
  >
    {/* Subtle radial glow behind circle */}
    <div
      className="absolute pointer-events-none"
      style={{
        width: 560,
        height: 560,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)",
      }}
    />

    {/* Floral circle */}
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10"
    >
      <FloralCircle />
    </motion.div>

    {/* D+day badge below circle */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex flex-col items-center"
      style={{ marginTop: "1.2rem" }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.32)",
          border: "1px solid rgba(255,255,255,0.55)",
          borderRadius: 999,
          padding: "0.4rem 1.8rem",
          backdropFilter: "blur(6px)",
        }}
      >
        <span
          className="font-serif"
          style={{
            fontSize: "1.4rem",
            color: "#fff",
            letterSpacing: "0.05em",
            fontWeight: 400,
            textShadow: "0 1px 6px rgba(0,0,0,0.18)",
          }}
        >
          D + {daysTogether}
        </span>
      </div>
      <span
        style={{
          marginTop: "0.4rem",
          fontSize: "0.62rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.75)",
        }}
      >
        2026.03.01 ~
      </span>
    </motion.div>
  </div>
);

export default HeroSection;
