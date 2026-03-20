import SideNav from "@/components/SideNav";
import { FloralBanner, FloralDivider } from "@/components/FloralHeader";

const bucketItems = [
  { label: "제주도 한 달 살기", done: false },
  { label: "오로라 보러 가기", done: false },
  { label: "교토 벚꽃 시즌 여행", done: true },
  { label: "함께 요리 클래스 수강하기", done: false },
  { label: "별이 보이는 곳에서 캠핑", done: false },
  { label: "유럽 배낭여행", done: false },
];

// Small floral check icon
const FloralCheck = ({ done }: { done: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    {done ? (
      <>
        {[0,60,120,180,240,300].map(a => (
          <ellipse key={a} cx="11" cy="7" rx="2.5" ry="4.5"
            fill="#e8a0c0" opacity="0.9"
            transform={`rotate(${a} 11 11)`} />
        ))}
        <circle cx="11" cy="11" r="4" fill="#fde8d8" />
        <path d="M8 11l2 2 4-4" stroke="#c04878" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ) : (
      <>
        <circle cx="11" cy="11" r="8" fill="none" stroke="#f0c0d0" strokeWidth="1.5" />
        <circle cx="11" cy="11" r="2.5" fill="#f5d0da" />
      </>
    )}
  </svg>
);

const BucketListPage = () => (
  <div className="min-h-screen" style={{ background: "#fdf0ea" }}>
    <SideNav />
    <div className="pl-9">
      <FloralBanner title="버킷리스트" subtitle="Together" />
      <main className="pb-20 px-6 max-w-2xl mx-auto">
        <FloralDivider />
        <ul className="flex flex-col gap-3">
          {bucketItems.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-4 px-6 py-4 transition-all"
              style={{
                background: item.done
                  ? "rgba(232,160,192,0.08)"
                  : "rgba(255,248,245,0.9)",
                border: `1px solid ${item.done ? "#f0c0d0" : "#f5d5dc"}`,
                borderRadius: 4,
                boxShadow: "0 2px 12px rgba(232,160,192,0.08)",
              }}
            >
              <FloralCheck done={item.done} />
              <span
                className="font-serif text-[15px] tracking-wide flex-1"
                style={{
                  color: item.done ? "#c4909a" : "#4a2030",
                  textDecoration: item.done ? "line-through" : "none",
                }}
              >
                {item.label}
              </span>
              {item.done && (
                <span
                  className="text-[10px] tracking-[0.2em] uppercase font-serif italic"
                  style={{ color: "#c04878" }}
                >
                  Done ♡
                </span>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  </div>
);

export default BucketListPage;
