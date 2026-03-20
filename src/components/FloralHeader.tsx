// Reusable floral decorative header for all pages

const Petal = ({ cx, cy, r, rotate, color }: { cx: number; cy: number; r: number; rotate: number; color: string }) => (
  <ellipse
    cx={cx} cy={cy}
    rx={r * 0.55} ry={r}
    fill={color}
    opacity={0.82}
    transform={`rotate(${rotate} ${cx} ${cy})`}
  />
);

const Flower = ({
  x, y, size = 22, color = "#f5a0b5", centerColor = "#fde8d8",
}: {
  x: number; y: number; size?: number; color?: string; centerColor?: string;
}) => (
  <g transform={`translate(${x},${y})`}>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <Petal key={angle} cx={0} cy={-size * 0.42} r={size * 0.38} rotate={angle} color={color} />
    ))}
    <circle cx={0} cy={0} r={size * 0.22} fill={centerColor} />
    <circle cx={0} cy={0} r={size * 0.12} fill={color} opacity={0.6} />
  </g>
);

const Leaf = ({ x, y, angle, size = 18, color = "#a8d5a2" }: {
  x: number; y: number; angle: number; size?: number; color?: string;
}) => (
  <ellipse
    cx={x} cy={y}
    rx={size * 0.35} ry={size}
    fill={color}
    opacity={0.7}
    transform={`rotate(${angle} ${x} ${y})`}
  />
);

// ── Full decorative bar used at top of pages ──
export const FloralBanner = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div
    className="relative w-full overflow-hidden"
    style={{
      background: "linear-gradient(135deg, #fdf0ea 0%, #fce8f0 50%, #fdf0ea 100%)",
      borderBottom: "1px solid #f0c8d4",
      minHeight: 160,
    }}
  >
    {/* SVG decoration */}
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 900 160"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left cluster */}
      <Flower x={42} y={55} size={34} color="#f5a0b5" centerColor="#fde8d8" />
      <Flower x={78} y={30} size={22} color="#f9c4d4" centerColor="#fff0f5" />
      <Flower x={18} y={90} size={18} color="#e8a0c0" centerColor="#fde8f0" />
      <Leaf x={60} y={110} angle={-30} size={22} color="#c8e6c0" />
      <Leaf x={30} y={70} angle={20} size={16} color="#b8ddb0" />
      <Leaf x={85} y={70} angle={-15} size={14} color="#c8e6c0" />

      {/* Right cluster */}
      <Flower x={858} y={55} size={34} color="#f5a0b5" centerColor="#fde8d8" />
      <Flower x={822} y={30} size={22} color="#f9c4d4" centerColor="#fff0f5" />
      <Flower x={882} y={90} size={18} color="#e8a0c0" centerColor="#fde8f0" />
      <Leaf x={840} y={110} angle={30} size={22} color="#c8e6c0" />
      <Leaf x={870} y={70} angle={-20} size={16} color="#b8ddb0" />
      <Leaf x={815} y={70} angle={15} size={14} color="#c8e6c0" />

      {/* Top center small accents */}
      <Flower x={450} y={18} size={14} color="#f9c4d4" centerColor="#fff0f5" />
      <Leaf x={430} y={22} angle={-40} size={10} color="#c8e6c0" />
      <Leaf x={470} y={22} angle={40} size={10} color="#c8e6c0" />

      {/* Scattered small flowers */}
      <Flower x={200} y={20} size={12} color="#f9c4d4" centerColor="#fff5f8" />
      <Flower x={700} y={20} size={12} color="#f9c4d4" centerColor="#fff5f8" />
      <Flower x={140} y={130} size={10} color="#f5a0b5" centerColor="#fde8f0" />
      <Flower x={760} y={130} size={10} color="#f5a0b5" centerColor="#fde8f0" />
    </svg>

    {/* Text content */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full py-10">
      {subtitle && (
        <p
          className="text-[10px] tracking-[0.35em] uppercase mb-3"
          style={{ color: "#c47a95", letterSpacing: "0.3em" }}
        >
          {subtitle}
        </p>
      )}
      <h1
        className="font-serif text-4xl md:text-5xl"
        style={{ color: "#4a2030", letterSpacing: "0.08em", textShadow: "0 1px 8px rgba(240,180,200,0.3)" }}
      >
        {title}
      </h1>
      <div
        className="mt-4 flex items-center gap-2"
      >
        <div style={{ width: 28, height: 1, background: "#f0c0d0" }} />
        <svg width="12" height="12" viewBox="0 0 12 12">
          <circle cx="6" cy="6" r="2.5" fill="#f5a0b5" />
          {[0,90,180,270].map(a => (
            <ellipse key={a} cx="6" cy="3" rx="1.2" ry="2" fill="#f9c4d4" opacity="0.8"
              transform={`rotate(${a} 6 6)`} />
          ))}
        </svg>
        <div style={{ width: 28, height: 1, background: "#f0c0d0" }} />
      </div>
    </div>
  </div>
);

// ── Inline small flower row (for cards/sections) ──
export const FloralDivider = () => (
  <div className="flex items-center justify-center gap-3 my-6">
    <div style={{ width: 40, height: 1, background: "#f0c0d0" }} />
    <svg width="48" height="16" viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg">
      <Flower x={8} y={8} size={10} color="#f5a0b5" centerColor="#fde8d8" />
      <Flower x={24} y={8} size={12} color="#e8a0c0" centerColor="#fde8f0" />
      <Flower x={40} y={8} size={10} color="#f5a0b5" centerColor="#fde8d8" />
    </svg>
    <div style={{ width: 40, height: 1, background: "#f0c0d0" }} />
  </div>
);

export default FloralBanner;
