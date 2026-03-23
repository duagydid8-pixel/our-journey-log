import "leaflet/dist/leaflet.css";
import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMapPins, createMapPin, deleteMapPin, type MapPin } from "@/lib/api";
import SideNav from "@/components/SideNav";
import { toast } from "sonner";

// Fix Leaflet default icon paths broken by Vite bundler
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom terracotta SVG pin icon
const pinIcon = new L.DivIcon({
  className: "",
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -38],
  html: `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 9.334 14 22 14 22s14-12.666 14-22C28 6.268 21.732 0 14 0z" fill="#c04878"/>
    <circle cx="14" cy="14" r="6" fill="#fde8f0"/>
    <circle cx="14" cy="14" r="2.5" fill="#c04878"/>
    <ellipse cx="14" cy="10" rx="2" ry="3.2" fill="#f5a0b5" opacity="0.7"/>
    <ellipse cx="14" cy="18" rx="2" ry="3.2" fill="#f5a0b5" opacity="0.7"/>
    <ellipse cx="10" cy="14" rx="3.2" ry="2" fill="#f5a0b5" opacity="0.7"/>
    <ellipse cx="18" cy="14" rx="3.2" ry="2" fill="#f5a0b5" opacity="0.7"/>
  </svg>`,
});

// ── Search result type ──
type SearchResult = { display_name: string; lat: string; lon: string };

// ── Search box (must be inside MapContainer to use useMap) ──
const SearchBox = () => {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=kr&format=json&limit=6&accept-language=ko`
      );
      const data: SearchResult[] = await res.json();
      setResults(data);
      setOpen(true);
    } catch {
      toast.error("검색에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (r: SearchResult) => {
    map.flyTo([parseFloat(r.lat), parseFloat(r.lon)], 12, { duration: 1.2 });
    setOpen(false);
    setQuery(r.display_name.split(",")[0]);
    setResults([]);
  };

  return (
    <div
      ref={wrapperRef}
      className="absolute top-3 right-4 z-[600]"
      style={{ width: 260 }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex border shadow-md" style={{ background: "#fdf0ea", borderColor: "#f0c8d4" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="지역 검색 (예: 제주, 강남구)"
          className="flex-1 px-3 py-2 text-[12px] bg-transparent focus:outline-none"
          style={{ color: "#4a2030" }}
        />
        <button
          onClick={search}
          className="px-3 py-2 text-[11px] transition-colors"
          style={{ background: "#c04878", color: "#fdf0ea", minWidth: 36 }}
        >
          {loading ? "…" : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="#fdf0ea" strokeWidth="1.5"/>
              <path d="M9.5 9.5L13 13" stroke="#fdf0ea" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>
      {open && results.length > 0 && (
        <ul className="border shadow-lg max-h-52 overflow-y-auto" style={{ background: "#fdf0ea", borderColor: "#f0c8d4" }}>
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              className="px-3 py-2 text-[12px] cursor-pointer hover:bg-[#fce8f0] border-b last:border-b-0"
              style={{ color: "#4a2030", borderColor: "#f0c8d4" }}
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
      {open && results.length === 0 && !loading && (
        <div className="border px-3 py-2 text-[12px]" style={{ background: "#fdf0ea", borderColor: "#f0c8d4", color: "#c4909a" }}>
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

// ── Map click handler (must be inside MapContainer) ──
const ClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// ── Add-pin modal ──
const AddPinModal = ({
  lat,
  lng,
  onSave,
  onClose,
}: {
  lat: number;
  lng: number;
  onSave: (name: string, date: string, memo: string) => Promise<void>;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onSave(name.trim(), date, memo.trim());
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ background: "rgba(61,46,26,0.35)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm mx-4 border p-7 shadow-xl"
        style={{ background: "#fdf0ea", borderColor: "#f0c8d4" }}
      >
        <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "#c4909a" }}>
          새 핀 추가
        </p>
        <p className="text-[11px] mb-5" style={{ color: "#d4a0b0" }}>
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "#c4909a" }}>
              여행지 이름 *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 교토, 제주도"
              className="w-full border px-3 py-2 text-sm bg-transparent focus:outline-none"
              style={{ borderColor: "#f0c8d4", color: "#4a2030" }}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "#c4909a" }}>
              날짜
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="예: 2026.03"
              className="w-full border px-3 py-2 text-sm bg-transparent focus:outline-none"
              style={{ borderColor: "#f0c8d4", color: "#4a2030" }}
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "#c4909a" }}>
              메모
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="간단한 기록을 남겨보세요"
              rows={2}
              className="w-full border px-3 py-2 text-sm bg-transparent focus:outline-none resize-none"
              style={{ borderColor: "#f0c8d4", color: "#4a2030" }}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex-1 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-colors"
              style={{
                background: "#c04878",
                color: "#fdf0ea",
                opacity: saving || !name.trim() ? 0.5 : 1,
              }}
            >
              {saving ? "저장 중..." : "저장"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-[11px] tracking-[0.2em] uppercase border transition-colors"
              style={{ borderColor: "#f0c8d4", color: "#c4909a" }}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main MapPage ──
const MapPage = () => {
  const qc = useQueryClient();
  const { data: pins = [], isLoading } = useQuery({ queryKey: ["map_pins"], queryFn: getMapPins });
  const [pending, setPending] = useState<{ lat: number; lng: number } | null>(null);

  const handleSave = async (name: string, date: string, memo: string) => {
    if (!pending) return;
    try {
      await createMapPin({
        name,
        date: date || undefined,
        memo: memo || undefined,
        lat: pending.lat,
        lng: pending.lng,
      });
      qc.invalidateQueries({ queryKey: ["map_pins"] });
      toast.success(`"${name}" 핀이 추가되었습니다.`);
      setPending(null);
    } catch (err) {
      console.error("핀 저장 오류:", err);
      toast.error("핀 저장에 실패했습니다. Supabase 연결을 확인해 주세요.");
    }
  };

  const handleDelete = async (pin: MapPin) => {
    if (!confirm(`"${pin.name}" 핀을 삭제하시겠습니까?`)) return;
    await deleteMapPin(pin.id);
    qc.invalidateQueries({ queryKey: ["map_pins"] });
    toast.success("핀이 삭제되었습니다.");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#fdf0ea" }}>
      <SideNav />

      {/* Header */}
      <div
        className="absolute top-0 left-9 right-0 z-[500] flex items-center justify-between px-8 h-14 border-b"
        style={{
          background: "rgba(253,240,234,0.96)",
          borderColor: "#f0c8d4",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Small flower accent */}
          <svg width="16" height="16" viewBox="0 0 16 16">
            {[0,60,120,180,240,300].map(a => (
              <ellipse key={a} cx="8" cy="4.5" rx="2" ry="3.5"
                fill="#f5a0b5" opacity="0.85"
                transform={`rotate(${a} 8 8)`} />
            ))}
            <circle cx="8" cy="8" r="2.8" fill="#fde8d8" />
          </svg>
          <span className="font-serif text-lg tracking-[0.2em]" style={{ color: "#4a2030" }}>
            지도
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#c4909a" }}>
            {isLoading ? "..." : `${pins.length}개의 여행지`}
          </span>
        </div>
        <p className="text-[10px] tracking-[0.18em]" style={{ color: "#c4909a" }}>
          지도를 클릭해 핀을 추가하세요
        </p>
      </div>

      {/* Map — starts below header, right of sidebar */}
      <div className="absolute inset-0 pt-14 pl-9">
        <MapContainer
          center={[36.5, 127.8]}
          zoom={7}
          minZoom={6}
          maxZoom={13}
          maxBounds={[[33.0, 124.0], [38.9, 132.0]]}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <SearchBox />
          <ClickHandler onMapClick={(lat, lng) => setPending({ lat, lng })} />

          {pins.map((pin) => (
            <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={pinIcon}>
              <Popup className="journey-popup" closeButton={false} minWidth={200} maxWidth={280}>
                <div style={{ padding: "4px 2px" }}>
                  <p
                    className="font-serif"
                    style={{ fontSize: 15, color: "#4a2030", marginBottom: 4, letterSpacing: "0.05em" }}
                  >
                    {pin.name}
                  </p>
                  {pin.date && (
                    <p style={{ fontSize: 11, color: "#c4909a", marginBottom: 4, letterSpacing: "0.1em" }}>
                      {pin.date}
                    </p>
                  )}
                  {pin.memo && (
                    <p
                      className="font-serif italic"
                      style={{ fontSize: 12, color: "hsl(30 5% 35%)", lineHeight: 1.55, marginBottom: 8 }}
                    >
                      {pin.memo}
                    </p>
                  )}
                  <button
                    onClick={() => handleDelete(pin)}
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "hsl(0 60% 55%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    핀 삭제
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Add-pin modal */}
      {pending && (
        <AddPinModal
          lat={pending.lat}
          lng={pending.lng}
          onSave={handleSave}
          onClose={() => setPending(null)}
        />
      )}

      {/* Popup style overrides */}
      <style>{`
        .journey-popup .leaflet-popup-content-wrapper {
          background: #fdf0ea;
          border: 1px solid #f0c8d4;
          border-radius: 2px;
          box-shadow: 0 4px 20px rgba(61,46,26,0.12);
          padding: 0;
        }
        .journey-popup .leaflet-popup-content {
          margin: 14px 16px;
        }
        .journey-popup .leaflet-popup-tip-container {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MapPage;
