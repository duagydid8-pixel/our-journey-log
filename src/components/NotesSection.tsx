import { motion, type Transition, type Variants } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getNotes, createNote } from "@/lib/api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const { data: notes = [] } = useQuery({ queryKey: ["notes"], queryFn: getNotes });
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [sender, setSender] = useState("H");
  const [content, setContent] = useState("");

  const handleAdd = async () => {
    if (!content.trim()) return;
    await createNote({ sender, content });
    qc.invalidateQueries({ queryKey: ["notes"] });
    setContent("");
    setAdding(false);
    toast.success("메모가 추가되었습니다.");
  };

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
          {notes.map((note) => (
            <motion.div
              key={note.id}
              variants={itemVariants}
              className="bg-bone/50 p-6 md:p-8 border-l-2 border-terracotta"
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-taupe mb-3">{note.sender}</p>
              <p className="text-[15px] leading-relaxed text-charcoal font-serif italic mb-4">
                {note.content}
              </p>
              <p className="text-[11px] text-taupe">{new Date(note.created_at).toLocaleDateString("ko-KR")}</p>
            </motion.div>
          ))}

          {/* Add note */}
          {adding ? (
            <motion.div variants={itemVariants} className="bg-bone/50 p-6 md:p-8 border-l-2 border-terracotta">
              <div className="flex gap-2 mb-3">
                {["H", "J"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSender(s)}
                    className={`text-[10px] tracking-[0.3em] uppercase px-2 py-1 transition-colors ${sender === s ? "text-terracotta border-b border-terracotta" : "text-taupe"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent border-none text-[15px] leading-relaxed text-charcoal font-serif italic mb-4 resize-none focus:outline-none placeholder:text-taupe/50"
                placeholder="메모를 작성하세요..."
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleAdd} className="text-[11px] tracking-[0.2em] text-terracotta hover:underline">저장</button>
                <button onClick={() => { setAdding(false); setContent(""); }} className="text-[11px] tracking-[0.2em] text-taupe hover:underline">취소</button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              onClick={() => setAdding(true)}
              className="border-2 border-dashed border-border p-6 md:p-8 flex items-center justify-center cursor-pointer hover:border-terracotta transition-colors group"
            >
              <p className="text-[11px] tracking-[0.2em] uppercase text-taupe group-hover:text-terracotta transition-colors">
                + 새로운 메모 추가
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NotesSection;
