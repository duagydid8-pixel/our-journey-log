import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import HeroSection from "@/components/HeroSection";
import TripsSection from "@/components/TripsSection";
import GallerySection from "@/components/GallerySection";
import AboutSection from "@/components/AboutSection";
import NotesSection from "@/components/NotesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SideNav />
      <Navbar />
      <HeroSection />
      <TripsSection />
      <GallerySection />
      <AboutSection />
      <NotesSection />
      <Footer />
    </div>
  );
};

export default Index;
