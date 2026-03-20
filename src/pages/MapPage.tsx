import SideNav from "@/components/SideNav";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const places = [
  { name: "후쿠오카", country: "일본", emoji: "🇯🇵", memo: "2024년 봄, 첫 해외 여행" },
  { name: "제주도", country: "한국", emoji: "🇰🇷", memo: "2023년 여름, 올레길 완주" },
  { name: "태안", country: "한국", emoji: "🇰🇷", memo: "2023년 가을, 해변 드라이브" },
  { name: "평택", country: "한국", emoji: "🇰🇷", memo: "2022년 겨울, 당일치기" },
];

const MapPage = () => (
  <div className="min-h-screen bg-background">
    <SideNav />
    <Navbar />
    <main className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "hsl(30 6% 53%)" }}>
          Places We've Been
        </p>
        <h1 className="font-serif text-4xl tracking-[0.1em]" style={{ color: "hsl(30 5% 16%)" }}>
          지도
        </h1>
        <div className="mt-4 mx-auto w-12 h-px" style={{ background: "hsl(30 15% 88%)" }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {places.map((place, i) => (
          <div
            key={i}
            className="border rounded-sm p-6"
            style={{ background: "hsl(0 0% 100%)", borderColor: "hsl(30 15% 88%)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{place.emoji}</span>
              <div>
                <p className="font-serif text-lg tracking-wide" style={{ color: "hsl(30 5% 16%)" }}>
                  {place.name}
                </p>
                <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "hsl(30 6% 53%)" }}>
                  {place.country}
                </p>
              </div>
            </div>
            <p className="text-sm tracking-wide" style={{ color: "hsl(30 6% 53%)" }}>
              {place.memo}
            </p>
          </div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default MapPage;
