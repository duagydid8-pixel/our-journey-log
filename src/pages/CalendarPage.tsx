import SideNav from "@/components/SideNav";
import { FloralBanner, FloralDivider } from "@/components/FloralHeader";

const CalendarPage = () => (
  <div className="min-h-screen" style={{ background: "#fdf0ea" }}>
    <SideNav />
    <div className="pl-9">
      <FloralBanner title="캘린더" subtitle="Our Calendar" />
      <main className="pb-20 px-6 max-w-3xl mx-auto">
        <FloralDivider />
        <div
          className="rounded-sm p-12 text-center"
          style={{
            background: "rgba(255,248,245,0.9)",
            border: "1px solid #f0c8d4",
            boxShadow: "0 4px 24px rgba(232,160,192,0.1)",
          }}
        >
          {/* Mini flower decoration */}
          <svg width="60" height="30" viewBox="0 0 60 30" className="mx-auto mb-6">
            {[10,30,50].map((x,i) => (
              <g key={i} transform={`translate(${x},15)`}>
                {[0,60,120,180,240,300].map(a => (
                  <ellipse key={a} cx="0" cy="-5" rx="2.2" ry="4.2"
                    fill={i===1?"#e8a0c0":"#f9c4d4"} opacity="0.85"
                    transform={`rotate(${a} 0 0)`} />
                ))}
                <circle cx="0" cy="0" r="2.5" fill="#fde8d8" />
              </g>
            ))}
          </svg>
          <p className="font-serif text-xl tracking-wide mb-2" style={{ color: "#9a5870" }}>
            준비 중입니다
          </p>
          <p className="text-sm tracking-wider" style={{ color: "#c4909a" }}>
            곧 우리의 특별한 날들을 기록할 수 있어요
          </p>
        </div>
      </main>
    </div>
  </div>
);

export default CalendarPage;
