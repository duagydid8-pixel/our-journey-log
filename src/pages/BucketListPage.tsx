import SideNav from "@/components/SideNav";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const bucketItems = [
  { label: "제주도 한 달 살기", done: false },
  { label: "오로라 보러 가기", done: false },
  { label: "교토 벚꽃 시즌 여행", done: true },
  { label: "함께 요리 클래스 수강하기", done: false },
  { label: "별이 보이는 곳에서 캠핑", done: false },
  { label: "유럽 배낭여행", done: false },
];

const BucketListPage = () => (
  <div className="min-h-screen bg-background">
    <SideNav />
    <Navbar />
    <main className="pt-28 pb-20 px-6 max-w-2xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "hsl(30 6% 53%)" }}>
          Together
        </p>
        <h1 className="font-serif text-4xl tracking-[0.1em]" style={{ color: "hsl(30 5% 16%)" }}>
          버킷리스트
        </h1>
        <div className="mt-4 mx-auto w-12 h-px" style={{ background: "hsl(30 15% 88%)" }} />
      </div>

      <ul className="flex flex-col gap-3">
        {bucketItems.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-4 border px-6 py-4 rounded-sm"
            style={{
              background: item.done ? "hsl(20 40% 50% / 0.05)" : "hsl(0 0% 100%)",
              borderColor: item.done ? "hsl(20 40% 50% / 0.3)" : "hsl(30 15% 88%)",
            }}
          >
            <span
              className="text-base"
              style={{ color: item.done ? "hsl(20 40% 50%)" : "hsl(30 15% 80%)" }}
            >
              {item.done ? "✦" : "☆"}
            </span>
            <span
              className="font-serif text-[15px] tracking-wide flex-1"
              style={{
                color: item.done ? "hsl(30 6% 53%)" : "hsl(30 5% 16%)",
                textDecoration: item.done ? "line-through" : "none",
              }}
            >
              {item.label}
            </span>
            {item.done && (
              <span
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{ color: "hsl(20 40% 50%)" }}
              >
                Done
              </span>
            )}
          </li>
        ))}
      </ul>
    </main>
    <Footer />
  </div>
);

export default BucketListPage;
