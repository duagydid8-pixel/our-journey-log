import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "홈", path: "/", icon: "✦" },
  { label: "갤러리", path: "/gallery", icon: "◈" },
  { label: "캘린더", path: "/calendar", icon: "◻" },
  { label: "D+day", path: "/dday", icon: "♡" },
  { label: "버킷리스트", path: "/bucketlist", icon: "☆" },
  { label: "지도", path: "/map", icon: "◎" },
  { label: "메모", path: "/memo", icon: "✐" },
];

const SideNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Invisible hover trigger zone on the left edge */}
      <div
        ref={triggerRef}
        className="fixed left-0 top-0 h-full w-3 z-50"
        onMouseEnter={() => setOpen(true)}
      />

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -220 }}
            animate={{ x: 0 }}
            exit={{ x: -220 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 h-full z-50 flex flex-col"
            style={{ width: 220 }}
            onMouseLeave={() => setOpen(false)}
          >
            {/* Sidebar panel */}
            <div
              className="h-full flex flex-col py-12 px-7 border-r"
              style={{
                background: "hsl(36 33% 96% / 0.97)",
                borderColor: "hsl(30 15% 88%)",
                backdropFilter: "blur(8px)",
                boxShadow: "4px 0 24px hsl(30 10% 60% / 0.12)",
              }}
            >
              {/* Logo / title */}
              <div className="mb-12">
                <span
                  className="font-serif text-2xl tracking-[0.3em]"
                  style={{ color: "hsl(30 5% 16%)" }}
                >
                  H &amp; J
                </span>
                <div
                  className="mt-1 text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: "hsl(30 6% 53%)" }}
                >
                  Our Journey
                </div>
              </div>

              {/* Divider */}
              <div
                className="mb-8 h-px w-8"
                style={{ background: "hsl(30 15% 88%)" }}
              />

              {/* Nav items */}
              <nav className="flex flex-col gap-1 flex-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="group flex items-center gap-3 px-2 py-2.5 rounded-sm transition-colors duration-200"
                      style={{
                        background: isActive
                          ? "hsl(20 40% 50% / 0.1)"
                          : "transparent",
                      }}
                      onClick={() => setOpen(false)}
                    >
                      <span
                        className="text-[11px] w-4 text-center transition-colors duration-200"
                        style={{
                          color: isActive
                            ? "hsl(20 40% 50%)"
                            : "hsl(30 6% 60%)",
                        }}
                      >
                        {item.icon}
                      </span>
                      <span
                        className="font-serif text-[13px] tracking-[0.15em] transition-colors duration-200"
                        style={{
                          color: isActive
                            ? "hsl(20 40% 50%)"
                            : "hsl(30 5% 30%)",
                          fontWeight: isActive ? 500 : 400,
                        }}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="ml-auto w-1 h-1 rounded-full"
                          style={{ background: "hsl(20 40% 50%)" }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom hint */}
              <div
                className="mt-auto text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "hsl(30 6% 70%)" }}
              >
                ← Hover to close
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideNav;
