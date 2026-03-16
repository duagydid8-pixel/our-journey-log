import { motion, type Transition } from "framer-motion";

const transition: Transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" className="font-serif text-xl tracking-[0.3em] text-foreground">
          H & J
        </a>
        <div className="flex items-center gap-8">
          <a href="#trips" className="text-[11px] tracking-[0.2em] uppercase text-taupe hover:text-foreground transition-colors">
            여행
          </a>
          <a href="#gallery" className="text-[11px] tracking-[0.2em] uppercase text-taupe hover:text-foreground transition-colors">
            갤러리
          </a>
          <a href="#notes" className="text-[11px] tracking-[0.2em] uppercase text-taupe hover:text-foreground transition-colors">
            메모
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
