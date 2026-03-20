import SideNav from "@/components/SideNav";
import Navbar from "@/components/Navbar";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";

const Gallery = () => (
  <div className="min-h-screen bg-background">
    <SideNav />
    <Navbar />
    <div className="pt-14">
      <GallerySection />
    </div>
    <Footer />
  </div>
);

export default Gallery;
