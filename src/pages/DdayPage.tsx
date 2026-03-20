import { useEffect, useState } from "react";
import SideNav from "@/components/SideNav";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const START_DATE = new Date("2022-01-01"); // 기념일 날짜 — 필요시 수정

const DdayPage = () => {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const today = new Date();
    const diff = Math.floor(
      (today.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24)
    );
    setDays(diff + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SideNav />
      <Navbar />
      <main className="pt-28 pb-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "hsl(30 6% 53%)" }}>
            Since We Met
          </p>
          <h1 className="font-serif text-4xl tracking-[0.1em]" style={{ color: "hsl(30 5% 16%)" }}>
            D+day
          </h1>
          <div className="mt-4 mx-auto w-12 h-px" style={{ background: "hsl(30 15% 88%)" }} />
        </div>

        <div
          className="rounded-sm border p-16 text-center"
          style={{ background: "hsl(0 0% 100%)", borderColor: "hsl(30 15% 88%)" }}
        >
          <p className="text-[11px] tracking-[0.3em] uppercase mb-6" style={{ color: "hsl(30 6% 53%)" }}>
            우리가 함께한 날
          </p>
          <div
            className="font-serif text-8xl font-light tracking-tight"
            style={{ color: "hsl(20 40% 50%)" }}
          >
            D+{days.toLocaleString()}
          </div>
          <p className="mt-6 text-sm tracking-widest" style={{ color: "hsl(30 6% 60%)" }}>
            {START_DATE.getFullYear()}년 {START_DATE.getMonth() + 1}월 {START_DATE.getDate()}일 부터
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DdayPage;
