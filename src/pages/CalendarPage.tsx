import SideNav from "@/components/SideNav";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CalendarPage = () => (
  <div className="min-h-screen bg-background">
    <SideNav />
    <Navbar />
    <main className="pt-28 pb-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "hsl(30 6% 53%)" }}>
          Our Calendar
        </p>
        <h1 className="font-serif text-4xl tracking-[0.1em]" style={{ color: "hsl(30 5% 16%)" }}>
          캘린더
        </h1>
        <div className="mt-4 mx-auto w-12 h-px" style={{ background: "hsl(30 15% 88%)" }} />
      </div>
      <div
        className="rounded-sm border p-12 text-center"
        style={{
          background: "hsl(0 0% 100%)",
          borderColor: "hsl(30 15% 88%)",
        }}
      >
        <p className="font-serif text-xl tracking-wide" style={{ color: "hsl(30 6% 53%)" }}>
          준비 중입니다
        </p>
        <p className="mt-2 text-sm tracking-wider" style={{ color: "hsl(30 6% 70%)" }}>
          곧 우리의 특별한 날들을 기록할 수 있어요
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default CalendarPage;
