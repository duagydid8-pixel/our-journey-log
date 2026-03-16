import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { toast } from "sonner";

const ADMIN_PASSWORD = "1234";

const useAdminAuth = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const login = (pw: string) => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      setAuthed(true);
      return true;
    }
    return false;
  };
  const logout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  };
  return { authed, login, logout };
};

// ---- Login Screen ----
const LoginScreen = ({ onLogin }: { onLogin: (pw: string) => boolean }) => {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-surface border border-border p-8 w-full max-w-sm">
        <h1 className="font-serif text-2xl tracking-[0.3em] text-charcoal mb-6 text-center">H & J</h1>
        <p className="text-[11px] tracking-[0.2em] uppercase text-taupe mb-4 text-center">관리자 로그인</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && !onLogin(pw) && setError(true)}
          placeholder="비밀번호"
          className="w-full border border-border bg-background px-4 py-3 text-sm text-charcoal placeholder:text-taupe focus:outline-none focus:border-terracotta"
        />
        {error && <p className="text-sm text-red-500 mt-2">비밀번호가 틀렸습니다.</p>}
        <button
          onClick={() => !onLogin(pw) && setError(true)}
          className="w-full mt-4 bg-charcoal text-background py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-terracotta transition-colors"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

// ---- Admin Dashboard ----
const AdminPage = () => {
  const { authed, login, logout } = useAdminAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"settings" | "trips" | "gallery" | "notes">("trips");

  if (!authed) return <LoginScreen onLogin={login} />;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="font-serif text-lg tracking-[0.3em] text-charcoal">H & J</a>
          <div className="flex items-center gap-6">
            {(["settings", "trips", "gallery", "notes"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-[11px] tracking-[0.2em] uppercase transition-colors ${tab === t ? "text-terracotta" : "text-taupe hover:text-charcoal"}`}
              >
                {t === "settings" ? "설정" : t === "trips" ? "여행" : t === "gallery" ? "갤러리" : "메모"}
              </button>
            ))}
            <button onClick={logout} className="text-[11px] tracking-[0.2em] uppercase text-taupe hover:text-charcoal">
              로그아웃
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {tab === "settings" && <SettingsTab />}
        {tab === "trips" && <TripsTab />}
        {tab === "gallery" && <GalleryTab />}
        {tab === "notes" && <NotesTab />}
      </div>
    </div>
  );
};

// ---- Settings Tab ----
const SettingsTab = () => {
  const { data: settings, isLoading } = useQuery({ queryKey: ["settings"], queryFn: api.getSettings });
  const qc = useQueryClient();
  const [startDate, setStartDate] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [nextName, setNextName] = useState("");

  useEffect(() => {
    if (settings) {
      setStartDate(settings.start_date || "");
      setNextDate(settings.next_trip_date || "");
      setNextName(settings.next_trip_name || "");
    }
  }, [settings]);

  const save = async () => {
    await api.updateSetting("start_date", startDate);
    await api.updateSetting("next_trip_date", nextDate);
    await api.updateSetting("next_trip_name", nextName);
    qc.invalidateQueries({ queryKey: ["settings"] });
    toast.success("설정이 저장되었습니다.");
  };

  if (isLoading) return <p className="text-taupe text-sm">로딩 중...</p>;

  return (
    <div className="max-w-md">
      <h2 className="text-xl tracking-tight text-charcoal mb-6">D-Day 설정</h2>
      <Label label="시작 날짜">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="admin-input" />
      </Label>
      <Label label="다음 여행 날짜">
        <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} className="admin-input" />
      </Label>
      <Label label="다음 여행 이름">
        <input type="text" value={nextName} onChange={(e) => setNextName(e.target.value)} className="admin-input" />
      </Label>
      <button onClick={save} className="admin-btn mt-4">저장</button>
    </div>
  );
};

// ---- Trips Tab ----
const TripsTab = () => {
  const { data: trips = [], isLoading } = useQuery({ queryKey: ["trips"], queryFn: api.getTrips });
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", date_range: "", tags: "", thumbnail: null as File | null });

  const resetForm = () => setForm({ title: "", date_range: "", tags: "", thumbnail: null });

  const handleSave = async () => {
    let thumbnail_url: string | undefined;
    if (form.thumbnail) {
      thumbnail_url = await api.uploadFile(form.thumbnail, "trip-thumbnails");
    }
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    if (editing) {
      await api.updateTrip(editing, { title: form.title, date_range: form.date_range, location_tags: tags, ...(thumbnail_url ? { thumbnail_url } : {}) });
      toast.success("여행이 수정되었습니다.");
    } else {
      await api.createTrip({ title: form.title, date_range: form.date_range, location_tags: tags, thumbnail_url, sort_order: trips.length });
      toast.success("여행이 추가되었습니다.");
    }
    qc.invalidateQueries({ queryKey: ["trips"] });
    resetForm();
    setEditing(null);
  };

  const startEdit = (trip: typeof trips[0]) => {
    setEditing(trip.id);
    setForm({ title: trip.title, date_range: trip.date_range, tags: (trip.location_tags || []).join(", "), thumbnail: null });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await api.deleteTrip(id);
    qc.invalidateQueries({ queryKey: ["trips"] });
    toast.success("삭제되었습니다.");
  };

  return (
    <div>
      <h2 className="text-xl tracking-tight text-charcoal mb-6">{editing ? "여행 수정" : "새 여행 추가"}</h2>
      <div className="max-w-md mb-8">
        <Label label="여행 제목">
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" placeholder="태안 바다 여행" />
        </Label>
        <Label label="날짜 범위">
          <input type="text" value={form.date_range} onChange={(e) => setForm({ ...form, date_range: e.target.value })} className="admin-input" placeholder="2022.07.15 — 2022.07.18" />
        </Label>
        <Label label="태그 (쉼표 구분)">
          <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="admin-input" placeholder="바다, 캠핑, 일몰" />
        </Label>
        <Label label="썸네일 이미지">
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, thumbnail: e.target.files?.[0] || null })} className="admin-input" />
        </Label>
        <div className="flex gap-3 mt-4">
          <button onClick={handleSave} className="admin-btn">{editing ? "수정" : "추가"}</button>
          {editing && <button onClick={() => { resetForm(); setEditing(null); }} className="admin-btn-secondary">취소</button>}
        </div>
      </div>

      <h3 className="text-sm tracking-[0.2em] uppercase text-taupe mb-4">등록된 여행</h3>
      {isLoading ? <p className="text-taupe text-sm">로딩 중...</p> : (
        <div className="space-y-3">
          {trips.map((trip) => (
            <div key={trip.id} className="flex items-center justify-between bg-surface border border-border p-4">
              <div>
                <p className="text-sm font-medium text-charcoal">{trip.title}</p>
                <p className="text-[11px] text-taupe">{trip.date_range}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(trip)} className="text-[11px] text-terracotta hover:underline">수정</button>
                <button onClick={() => handleDelete(trip.id)} className="text-[11px] text-red-500 hover:underline">삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Gallery Tab ----
const GalleryTab = () => {
  const { data: photos = [], isLoading } = useQuery({ queryKey: ["photos"], queryFn: () => api.getPhotos() });
  const qc = useQueryClient();
  const [files, setFiles] = useState<FileList | null>(null);
  const [caption, setCaption] = useState("");

  const handleUpload = async () => {
    if (!files) return;
    for (const file of Array.from(files)) {
      const url = await api.uploadFile(file, "gallery");
      await api.createPhoto({ url, caption: caption || undefined, is_gallery: true });
    }
    qc.invalidateQueries({ queryKey: ["photos"] });
    setFiles(null);
    setCaption("");
    toast.success("사진이 업로드되었습니다.");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await api.deletePhoto(id);
    qc.invalidateQueries({ queryKey: ["photos"] });
    toast.success("삭제되었습니다.");
  };

  return (
    <div>
      <h2 className="text-xl tracking-tight text-charcoal mb-6">갤러리 사진 관리</h2>
      <div className="max-w-md mb-8">
        <Label label="사진 업로드 (복수 선택 가능)">
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} className="admin-input" />
        </Label>
        <Label label="캡션 (선택)">
          <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} className="admin-input" placeholder="해변 석양" />
        </Label>
        <button onClick={handleUpload} disabled={!files} className="admin-btn mt-4">업로드</button>
      </div>

      <h3 className="text-sm tracking-[0.2em] uppercase text-taupe mb-4">등록된 사진</h3>
      {isLoading ? <p className="text-taupe text-sm">로딩 중...</p> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img src={photo.url} alt={photo.caption || ""} className="w-full aspect-square object-cover" />
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-2 right-2 bg-charcoal/80 text-background text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                삭제
              </button>
              {photo.caption && <p className="text-[11px] text-taupe mt-1">{photo.caption}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Notes Tab ----
const NotesTab = () => {
  const { data: notes = [], isLoading } = useQuery({ queryKey: ["notes"], queryFn: api.getNotes });
  const qc = useQueryClient();
  const [sender, setSender] = useState("H");
  const [content, setContent] = useState("");

  const handleAdd = async () => {
    if (!content.trim()) return;
    await api.createNote({ sender, content });
    qc.invalidateQueries({ queryKey: ["notes"] });
    setContent("");
    toast.success("메모가 추가되었습니다.");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await api.deleteNote(id);
    qc.invalidateQueries({ queryKey: ["notes"] });
    toast.success("삭제되었습니다.");
  };

  return (
    <div>
      <h2 className="text-xl tracking-tight text-charcoal mb-6">메모 관리</h2>
      <div className="max-w-md mb-8">
        <Label label="보낸 사람">
          <div className="flex gap-2">
            {["H", "J"].map((s) => (
              <button
                key={s}
                onClick={() => setSender(s)}
                className={`px-4 py-2 text-[11px] tracking-[0.2em] border transition-colors ${sender === s ? "border-terracotta text-terracotta" : "border-border text-taupe hover:border-charcoal"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </Label>
        <Label label="내용">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="admin-input min-h-[100px] resize-none"
            placeholder="메모를 작성하세요..."
          />
        </Label>
        <button onClick={handleAdd} className="admin-btn mt-4">추가</button>
      </div>

      <h3 className="text-sm tracking-[0.2em] uppercase text-taupe mb-4">등록된 메모</h3>
      {isLoading ? <p className="text-taupe text-sm">로딩 중...</p> : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="flex items-start justify-between bg-surface border border-border p-4">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-taupe mb-1">{note.sender}</p>
                <p className="text-sm text-charcoal">{note.content}</p>
                <p className="text-[11px] text-taupe mt-1">{new Date(note.created_at).toLocaleDateString("ko-KR")}</p>
              </div>
              <button onClick={() => handleDelete(note.id)} className="text-[11px] text-red-500 hover:underline shrink-0 ml-4">삭제</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Shared UI ----
const Label = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block mb-4">
    <span className="text-[11px] tracking-[0.2em] uppercase text-taupe block mb-2">{label}</span>
    {children}
  </label>
);

export default AdminPage;
