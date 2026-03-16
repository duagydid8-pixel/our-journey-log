import { motion, type Transition, type Variants } from "framer-motion";

const notes = [
  { sender: "H", content: "후쿠오카에서 먹은 라멘이 아직도 생각나. 다음에 또 가자.", date: "2025.01.15" },
  { sender: "J", content: "태안 바다에서 본 석양이 가장 좋았어.", date: "2025.02.03" },
  { sender: "H", content: "제주도 오름 위에서 바람 맞던 거 기억나? 머리가 다 날아갈 뻔했잖아.", date: "2025.03.10" },
  { sender: "J", content: "다음 여행은 어디로 갈까. 오사카도 좋을 것 같아.", date: "2025.03.14" },
  { sender: "H", content: "매일 같이 산책하는 것도 여행이지.", date: "2025.03.15" },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const transition: Transition = { duration: 0.8, ease };

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const NotesSection = () => {
  return (
    <section id="notes" className="bg-surface py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="mb-12"
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-taupe mb-2">기록</p>
          <h2 className="text-3xl md:text-4xl tracking-tighter text-charcoal">
            우리의 <span className="font-serif italic">메모</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {notes.map((note, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-bone/50 p-6 md:p-8 border-l-2 border-terracotta"
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-taupe mb-3">{note.sender}</p>
              <p className="text-[15px] leading-relaxed text-charcoal font-serif italic mb-4">
                {note.content}
              </p>
              <p className="text-[11px] text-taupe">{note.date}</p>
            </motion.div>
          ))}

          <motion.div
            variants={itemVariants}
            className="border-2 border-dashed border-border p-6 md:p-8 flex items-center justify-center cursor-pointer hover:border-terracotta transition-colors group"
          >
            <p className="text-[11px] tracking-[0.2em] uppercase text-taupe group-hover:text-terracotta transition-colors">
              + 새로운 메모 추가
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NotesSection;
