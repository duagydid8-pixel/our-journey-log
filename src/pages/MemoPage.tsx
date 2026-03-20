import SideNav from "@/components/SideNav";
import Navbar from "@/components/Navbar";
import NotesSection from "@/components/NotesSection";
import Footer from "@/components/Footer";

const MemoPage = () => (
  <div className="min-h-screen bg-background">
    <SideNav />
    <Navbar />
    <div className="pt-14">
      <NotesSection />
    </div>
    <Footer />
  </div>
);

export default MemoPage;
