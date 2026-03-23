import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPhotos, createPhoto, deletePhoto, uploadFile, type Photo } from "@/lib/api";
import SideNav from "@/components/SideNav";
import { toast } from "sonner";

// ── Upload Modal ──
const UploadModal = ({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => { setFile(f); setPreview(URL.createObjectURL(f)); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };
  const handleSave = async () => {
    if (!file) return;
    setSaving(true);
    try {
      const url = await uploadFile(file, "gallery");
      await createPhoto({ url, date: date || undefined, memo: memo || undefined, is_gallery: true, sort_order: Date.now() });
      toast.success("사진이 추가되었습니다.");
      onSaved();
      onClose();
    } catch {
      toast.error("사진 업로드에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ background: "rgba(61,46,26,0.4)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md mx-4 border p-7 shadow-xl" style={{ background: "#fdf0ea", borderColor: "#f0c8d4" }}>
        <p className="text-[10px] tracking-[0.3em] uppercase mb-5" style={{ color: "#c4909a" }}>사진 추가</p>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full mb-4 flex flex-col items-center justify-center cursor-pointer border border-dashed"
          style={{ borderColor: "#f0c8d4", background: preview ? "transparent" : "#fef6f0", height: preview ? "auto" : 140 }}
        >
          {preview ? (
            <img src={preview} alt="preview" className="w-full max-h-64 object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-8">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="#c4909a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15v3a2 2 0 002 2h14a2 2 0 002-2v-3" stroke="#c4909a" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-[11px] tracking-[0.1em]" style={{ color: "#c4909a" }}>클릭하거나 사진을 드래그하세요</p>
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

        {/* Date */}
        <div className="mb-3">
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "#c4909a" }}>날짜</label>
          <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="예: 2026.03.23"
            className="w-full border px-3 py-2 text-sm bg-transparent focus:outline-none"
            style={{ borderColor: "#f0c8d4", color: "#4a2030" }} />
        </div>

        {/* Memo */}
        <div className="mb-5">
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "#c4909a" }}>메모</label>
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="이 순간을 기억하고 싶은 한 마디"
            rows={2} className="w-full border px-3 py-2 text-sm bg-transparent focus:outline-none resize-none"
            style={{ borderColor: "#f0c8d4", color: "#4a2030" }} />
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving || !file}
            className="flex-1 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-colors"
            style={{ background: "#c04878", color: "#fdf0ea", opacity: saving || !file ? 0.5 : 1 }}>
            {saving ? "저장 중..." : "저장"}
          </button>
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 text-[11px] tracking-[0.2em] uppercase border"
            style={{ borderColor: "#f0c8d4", color: "#c4909a" }}>취소</button>
        </div>
      </div>
    </div>
  );
};

// ── Photo Card ──
const PhotoCard = ({ photo, onDelete }: { photo: Photo; onDelete: (id: string) => void }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <img src={photo.url} alt={photo.memo || ""}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }} />
        {hovered && (
          <button onClick={() => onDelete(photo.id)}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center"
            style={{ background: "rgba(253,240,234,0.92)", border: "1px solid #f0c8d4" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="#c04878" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
      {(photo.date || photo.memo) && (
        <div className="px-1 pt-2 pb-3 border-b" style={{ borderColor: "#f0c8d4" }}>
          {photo.date && (
            <p className="text-[10px] tracking-[0.15em] mb-0.5" style={{ color: "#c4909a" }}>{photo.date}</p>
          )}
          {photo.memo && (
            <p className="text-[12px] font-serif italic leading-snug" style={{ color: "#4a2030" }}>{photo.memo}</p>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main Gallery Page ──
const Gallery = () => {
  const qc = useQueryClient();
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["photos", "gallery"],
    queryFn: () => getPhotos(true),
  });
  const [showUpload, setShowUpload] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("이 사진을 삭제하시겠습니까?")) return;
    await deletePhoto(id);
    qc.invalidateQueries({ queryKey: ["photos", "gallery"] });
    toast.success("사진이 삭제되었습니다.");
  };

  return (
    <div className="min-h-screen" style={{ background: "#fdf0ea" }}>
      <SideNav />
      <div className="pl-9">
        {/* Header */}
        <div className="sticky top-0 z-[100] flex items-center justify-between px-8 h-14 border-b"
          style={{ background: "rgba(253,240,234,0.96)", borderColor: "#f0c8d4", backdropFilter: "blur(8px)" }}>
          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16">
              {[0,60,120,180,240,300].map(a => (
                <ellipse key={a} cx="8" cy="4.5" rx="2" ry="3.5" fill="#f5a0b5" opacity="0.85" transform={`rotate(${a} 8 8)`} />
              ))}
              <circle cx="8" cy="8" r="2.8" fill="#fde8d8" />
            </svg>
            <span className="font-serif text-lg tracking-[0.2em]" style={{ color: "#4a2030" }}>갤러리</span>
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#c4909a" }}>
              {isLoading ? "..." : `${photos.length}장`}
            </span>
          </div>
          <button onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-1.5 text-[11px] tracking-[0.2em] uppercase border transition-colors hover:bg-[#c04878] hover:text-[#fdf0ea] hover:border-[#c04878]"
            style={{ borderColor: "#f0c8d4", color: "#c4909a" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            사진 추가
          </button>
        </div>

        {/* Photo Grid */}
        <div className="px-8 py-8">
          {isLoading ? (
            <p className="text-[12px] tracking-[0.1em]" style={{ color: "#c4909a" }}>불러오는 중...</p>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="8" width="32" height="24" rx="2" stroke="#f0c8d4" strokeWidth="1.5"/>
                <circle cx="14" cy="17" r="3" stroke="#f0c8d4" strokeWidth="1.5"/>
                <path d="M4 28L13 20L19 26L25 21L36 28" stroke="#f0c8d4" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              <p className="text-[12px] tracking-[0.15em]" style={{ color: "#c4909a" }}>아직 사진이 없습니다</p>
              <button onClick={() => setShowUpload(true)} className="mt-1 px-5 py-2 text-[11px] tracking-[0.2em] uppercase"
                style={{ background: "#c04878", color: "#fdf0ea" }}>첫 사진 추가하기</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {(photos as Photo[]).map((photo) => (
                <PhotoCard key={photo.id} photo={photo} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSaved={() => qc.invalidateQueries({ queryKey: ["photos", "gallery"] })}
        />
      )}
    </div>
  );
};

export default Gallery;
