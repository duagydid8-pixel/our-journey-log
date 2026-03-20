import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
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
    <path d="M14 0C6.268 0 0 6.268 0 14c0 9.334 14 22 14 22s14-12.666 14-22C28 6.268 21.732 0 14 0z" fill="#b87333"/>
    <circle cx="14" cy="14" r="6" fill="#fff3e8"/>
    <circle cx="14" cy="14" r="3" fill="#b87333"/>
  </svg>`,
});

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
        style={{ background: "hsl(36 33% 96%)", borderColor: "hsl(30 15% 88%)" }}
      >
        <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "hsl(30 6% 53%)" }}>
          새 핀 추가
        </p>
        <p className="text-[11px] mb-5" style={{ color: "hsl(30 6% 65%)" }}>
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "hsl(30 6% 53%)" }}>
              여행지 이름 *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 교토, 제주도"
              className="w-full border px-3 py-2 text-sm bg-transparent focus:outline-none"
              style={{ borderColor: "hsl(30 15% 82%)", color: "hsl(30 5% 16%)" }}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "hsl(30 6% 53%)" }}>
              날짜
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="예: 2026.03"
              className="w-full border px-3 py-2 text-sm bg-transparent focus:outline-none"
              style={{ borderColor: "hsl(30 15% 82%)", color: "hsl(30 5% 16%)" }}
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "hsl(30 6% 53%)" }}>
              메모
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="간단한 기록을 남겨보세요"
              rows={2}
              className="w-full border px-3 py-2 text-sm bg-transparent focus:outline-none resize-none"
              style={{ borderColor: "hsl(30 15% 82%)", color: "hsl(30 5% 16%)" }}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex-1 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-colors"
              style={{
                background: "hsl(30 5% 16%)",
                color: "hsl(36 33% 96%)",
                opacity: saving || !name.trim() ? 0.5 : 1,
              }}
            >
              {saving ? "저장 중..." : "저장"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-[11px] tracking-[0.2em] uppercase border transition-colors"
              style={{ borderColor: "hsl(30 15% 82%)", color: "hsl(30 6% 53%)" }}
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
  };

  const handleDelete = async (pin: MapPin) => {
    if (!confirm(`"${pin.name}" 핀을 삭제하시겠습니까?`)) return;
    await deleteMapPin(pin.id);
    qc.invalidateQueries({ queryKey: ["map_pins"] });
    toast.success("핀이 삭제되었습니다.");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "hsl(36 33% 96%)" }}>
      <SideNav />

      {/* Header */}
      <div
        className="absolute top-0 left-9 right-0 z-[500] flex items-center justify-between px-8 h-14 border-b"
        style={{
          background: "hsl(36 33% 96% / 0.95)",
          borderColor: "hsl(30 15% 88%)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg tracking-[0.2em]" style={{ color: "hsl(30 5% 16%)" }}>
            지도
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "hsl(30 6% 60%)" }}>
            {isLoading ? "..." : `${pins.length}개의 여행지`}
          </span>
        </div>
        <p className="text-[10px] tracking-[0.18em]" style={{ color: "hsl(30 6% 65%)" }}>
          지도를 클릭해 핀을 추가하세요
        </p>
      </div>

      {/* Map — starts below header, right of sidebar */}
      <div className="absolute inset-0 pt-14 pl-9">
        <MapContainer
          center={[30, 20]}
          zoom={2}
          minZoom={2}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains={["a", "b", "c", "d"]}
          />

          <ClickHandler onMapClick={(lat, lng) => setPending({ lat, lng })} />

          {pins.map((pin) => (
            <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={pinIcon}>
              <Popup className="journey-popup" closeButton={false} minWidth={200} maxWidth={280}>
                <div style={{ padding: "4px 2px" }}>
                  <p
                    className="font-serif"
                    style={{ fontSize: 15, color: "hsl(30 5% 16%)", marginBottom: 4, letterSpacing: "0.05em" }}
                  >
                    {pin.name}
                  </p>
                  {pin.date && (
                    <p style={{ fontSize: 11, color: "hsl(30 6% 55%)", marginBottom: 4, letterSpacing: "0.1em" }}>
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
          background: hsl(36 33% 96%);
          border: 1px solid hsl(30 15% 86%);
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
