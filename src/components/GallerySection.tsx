import { motion, type Transition } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getPhotos } from "@/lib/api";

// Fallback images
import galleryTall from "@/assets/gallery-tall.jpg";
import galleryForest from "@/assets/gallery-forest.jpg";
import galleryTemple from "@/assets/gallery-temple.jpg";
import gallerySeaside from "@/assets/gallery-seaside.jpg";
import galleryCafe from "@/assets/gallery-cafe.jpg";

const fallbackImages = [
  { src: galleryTall, alt: "해변 석양", className: "col-span-2 row-span-2" },
  { src: galleryForest, alt: "숲길", className: "col-span-1 row-span-1" },
  { src: galleryTemple, alt: "사찰", className: "col-span-1 row-span-1" },
  { src: gallerySeaside, alt: "해안 산책", className: "col-span-1 row-span-1" },
  { src: galleryCafe, alt: "카페", className: "col-span-1 row-span-1" },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const transition: Transition = { duration: 0.8, ease };

const GallerySection = () => {
  const { data: dbPhotos = [] } = useQuery({ queryKey: ["photos", "gallery"], queryFn: () => getPhotos(true) });

  // Use DB photos if available, otherwise fallback
  const images = dbPhotos.length > 0
    ? dbPhotos.slice(0, 5).map((p, i) => ({
        src: p.url,
        alt: p.caption || "",
        className: i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1",
      }))
    : fallbackImages;

  return (
    <section id="gallery" className="bg-surface py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="mb-12"
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-taupe mb-2">모아보기</p>
          <h2 className="text-3xl md:text-4xl tracking-tighter text-charcoal">
            사진 <span className="font-serif italic">갤러리</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 h-[400px] md:h-[700px] gap-3 md:gap-4"
        >
          {images.map((img, i) => (
            <div key={i} className={`${img.className} overflow-hidden group`}>
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
