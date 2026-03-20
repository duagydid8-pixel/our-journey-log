import SideNav from "@/components/SideNav";
import { FloralBanner } from "@/components/FloralHeader";
import NotesSection from "@/components/NotesSection";

const MemoPage = () => (
  <div className="min-h-screen" style={{ background: "#fdf0ea" }}>
    <SideNav />
    <div className="pl-9">
      <FloralBanner title="메모" subtitle="Our Notes" />
      <NotesSection />
    </div>
  </div>
);

export default MemoPage;
