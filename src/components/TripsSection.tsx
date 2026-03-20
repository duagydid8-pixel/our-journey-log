import { motion, type Transition, type Variants } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getTrips } from "@/lib/api";

// Fallback images for trips without thumbnails
import tripTaean from "@/assets/trip-taean.jpg";
import tripPyeongtaek from "@/assets/trip-pyeongtaek.jpg";
import tripFukuoka from "@/assets/trip-fukuoka.jpg";
import tripJeju from "@/assets/trip-jeju.jpg";

const fallbackImages = [tripTaean, tripPyeongtaek, tripJeju, tripFukuoka];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const transition: Transition = { duration: 0.8, ease };

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const TripsSection = () => {
  const { data: trips = [] } = useQuery({ queryKey: ["trips"], queryFn: getTrips });

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

        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-sm">
            <p className="text-taupe text-sm tracking-wide mb-6">아직 기록된 여행이 없습니다</p>
            <a
              href="/admin"
              className="text-[11px] tracking-[0.25em] uppercase px-6 py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-background transition-colors"
            >
              + 새 여행 추가
            </a>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12"
          >
            {trips.map((trip, i) => (
              <motion.div
                key={trip.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden bg-secondary mb-4 aspect-[16/10]">
                  <img
                    src={trip.thumbnail_url || fallbackImages[i % fallbackImages.length]}
                    alt={trip.title}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-terracotta font-serif italic text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-medium tracking-tight text-charcoal">{trip.title}</h3>
                  <p className="text-sm text-taupe mb-2">{trip.date_range}</p>
                  <div className="flex gap-2">
                    {(trip.location_tags || []).map((tag) => (
                      <span key={tag} className="text-[10px] bg-secondary px-2 py-0.5 text-taupe">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TripsSection;
