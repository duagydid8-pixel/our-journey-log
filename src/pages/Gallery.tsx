import SideNav from "@/components/SideNav";
import { FloralBanner } from "@/components/FloralHeader";
import GallerySection from "@/components/GallerySection";

const Gallery = () => (
  <div className="min-h-screen" style={{ background: "#fdf0ea" }}>
    <SideNav />
    <div className="pl-9">
      <FloralBanner title="갤러리" subtitle="Our Gallery" />
      <GallerySection />
    </div>
  </div>
);

export default Gallery;
