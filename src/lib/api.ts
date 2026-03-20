import { supabase } from "@/integrations/supabase/client";

export const getSettings = async () => {
  const { data, error } = await supabase.from("settings").select("*");
  if (error) throw error;
  const map: Record<string, string> = {};
  data?.forEach((s) => (map[s.key] = s.value));
  return map;
};

export const updateSetting = async (key: string, value: string) => {
  const { error } = await supabase.from("settings").update({ value }).eq("key", key);
  if (error) throw error;
};

export const getTrips = async () => {
  const { data, error } = await supabase.from("trips").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const createTrip = async (trip: { title: string; date_range: string; location_tags: string[]; thumbnail_url?: string; sort_order: number }) => {
  const { data, error } = await supabase.from("trips").insert(trip).select().single();
  if (error) throw error;
  return data;
};

export const updateTrip = async (id: string, trip: Partial<{ title: string; date_range: string; location_tags: string[]; thumbnail_url: string; sort_order: number }>) => {
  const { error } = await supabase.from("trips").update(trip).eq("id", id);
  if (error) throw error;
};

export const deleteTrip = async (id: string) => {
  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) throw error;
};

export const getPhotos = async (galleryOnly = false) => {
  let q = supabase.from("photos").select("*").order("sort_order", { ascending: true });
  if (galleryOnly) q = q.eq("is_gallery", true);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
};

export const createPhoto = async (photo: { url: string; caption?: string; trip_id?: string; is_gallery?: boolean; sort_order?: number }) => {
  const { data, error } = await supabase.from("photos").insert(photo).select().single();
  if (error) throw error;
  return data;
};

export const deletePhoto = async (id: string) => {
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) throw error;
};

export const getNotes = async () => {
  const { data, error } = await supabase.from("notes").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const createNote = async (note: { sender: string; content: string }) => {
  const { data, error } = await supabase.from("notes").insert(note).select().single();
  if (error) throw error;
  return data;
};

export const deleteNote = async (id: string) => {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
};

export const deleteAllTrips = async () => {
  const { error } = await supabase.from("trips").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) throw error;
};

export const deleteAllNotes = async () => {
  const { error } = await supabase.from("notes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) throw error;
};

export const upsertSetting = async (key: string, value: string) => {
  const { error } = await supabase.from("settings").upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
};

export const uploadFile = async (file: File, folder = "uploads") => {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("journal-assets").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("journal-assets").getPublicUrl(path);
  return data.publicUrl;
};
