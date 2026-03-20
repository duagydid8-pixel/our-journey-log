import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { label: "홈", path: "/", icon: "✦" },
  { label: "갤러리", path: "/gallery", icon: "◈" },
  { label: "캘린더", path: "/calendar", icon: "◻" },
  { label: "D+day", path: "/dday", icon: "♡" },
  { label: "버킷리스트", path: "/bucketlist", icon: "☆" },
  { label: "지도", path: "/map", icon: "◎" },
  { label: "메모", path: "/memo", icon: "✐" },
];

const COLLAPSED_W = 36;
const EXPANDED_W = 220;

const SideNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: open ? EXPANDED_W : COLLAPSED_W }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-full z-50 overflow-hidden"
      style={{
        background: "hsl(36 33% 96% / 0.96)",
        borderRight: "1px solid hsl(30 15% 88%)",
        backdropFilter: "blur(10px)",
        boxShadow: open ? "4px 0 28px hsl(30 10% 60% / 0.14)" : "2px 0 8px hsl(30 10% 60% / 0.06)",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Always-visible collapsed tab content */}
      <div className="absolute inset-0 flex flex-col">

        {/* Top: toggle icon strip */}
        <div
          className="flex items-center justify-center shrink-0"
          style={{ width: COLLAPSED_W, height: 56 }}
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: "hsl(20 40% 50%)", lineHeight: 1 }}
          >
            {/* Chevron arrow */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M5 2.5L9.5 7L5 11.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>

        {/* Thin divider */}
        <div
          className="mx-auto shrink-0"
          style={{
            width: 16,
            height: 1,
            background: "hsl(30 15% 88%)",
            marginBottom: 8,
          }}
        />

        {/* Nav items — icon always visible, label fades in */}
        <nav className="flex flex-col gap-0.5 flex-1 px-1.5 pt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center rounded-sm transition-colors duration-150"
                style={{
                  height: 36,
                  minWidth: COLLAPSED_W - 12,
                  paddingLeft: 6,
                  paddingRight: 6,
                  background: isActive ? "hsl(20 40% 50% / 0.1)" : "transparent",
                }}
                onClick={() => setOpen(false)}
              >
                {/* Icon — always visible */}
                <span
                  className="shrink-0 flex items-center justify-center text-[12px]"
                  style={{
                    width: 22,
                    color: isActive ? "hsl(20 40% 50%)" : "hsl(30 6% 58%)",
                  }}
                >
                  {item.icon}
                </span>

                {/* Label — fades in when open */}
                <motion.span
                  animate={{ opacity: open ? 1 : 0, x: open ? 0 : -4 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="font-serif text-[13px] tracking-[0.15em] whitespace-nowrap ml-2"
                  style={{
                    color: isActive ? "hsl(20 40% 50%)" : "hsl(30 5% 28%)",
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {item.label}
                </motion.span>

                {/* Active dot */}
                {isActive && open && (
                  <motion.div
                    layoutId="active-dot"
                    className="ml-auto w-1 h-1 rounded-full shrink-0"
                    style={{ background: "hsl(20 40% 50%)" }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: logo fades in when expanded */}
        <div className="shrink-0 px-4 pb-8 pt-4" style={{ minWidth: EXPANDED_W }}>
          <motion.div
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="h-px w-8 mb-4"
              style={{ background: "hsl(30 15% 88%)" }}
            />
            <p
              className="font-serif text-lg tracking-[0.3em]"
              style={{ color: "hsl(30 5% 16%)" }}
            >
              H &amp; J
            </p>
            <p
              className="mt-0.5 text-[9px] tracking-[0.25em] uppercase"
              style={{ color: "hsl(30 6% 60%)" }}
            >
              Our Journey
            </p>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
};

export default SideNav;
