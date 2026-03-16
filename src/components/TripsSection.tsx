import { motion } from "framer-motion";
import tripTaean from "@/assets/trip-taean.jpg";
import tripPyeongtaek from "@/assets/trip-pyeongtaek.jpg";
import tripFukuoka from "@/assets/trip-fukuoka.jpg";
import tripJeju from "@/assets/trip-jeju.jpg";

const trips = [
  {
    number: "01",
    title: "태안 바다 여행",
    date: "2022.07.15 — 2022.07.18",
    tags: ["바다", "캠핑", "일몰"],
    image: tripTaean,
  },
  {
    number: "02",
    title: "평택 주말 나들이",
    date: "2023.03.10 — 2023.03.12",
    tags: ["카페", "산책"],
    image: tripPyeongtaek,
  },
  {
    number: "03",
    title: "제주도 봄 여행",
    date: "2023.09.01 — 2023.09.05",
    tags: ["제주", "오름", "맛집"],
    image: tripJeju,
  },
  {
    number: "04",
    title: "후쿠오카 겨울 여행",
    date: "2024.12.24 — 2024.12.28",
    tags: ["일본", "라멘", "온천"],
    image: tripFukuoka,
  },
];

const stagger = { staggerChildren: 0.1 };
const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

const TripsSection = () => {
  return (
    <section id="trips" className="bg-background py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="mb-12"
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-taupe mb-2">여행 목록</p>
          <h2 className="text-3xl md:text-4xl tracking-tighter text-charcoal">
            기록된 <span className="font-serif italic">여행들</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12"
        >
          {trips.map((trip) => (
            <motion.div
              key={trip.number}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition },
              }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden bg-secondary mb-4 aspect-[16/10]">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-terracotta font-serif italic text-sm">{trip.number}</span>
                <h3 className="text-lg font-medium tracking-tight text-charcoal">{trip.title}</h3>
                <p className="text-sm text-taupe mb-2">{trip.date}</p>
                <div className="flex gap-2">
                  {trip.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-secondary px-2 py-0.5 text-taupe"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TripsSection;
