
-- Create settings table for D-day dates
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Settings can be updated by anyone" ON public.settings FOR UPDATE USING (true);
CREATE POLICY "Settings can be inserted by anyone" ON public.settings FOR INSERT WITH CHECK (true);

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES ('start_date', '2021-05-20');
INSERT INTO public.settings (key, value) VALUES ('next_trip_date', '2026-12-24');
INSERT INTO public.settings (key, value) VALUES ('next_trip_name', '후쿠오카');

-- Create trips table
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date_range TEXT NOT NULL,
  location_tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trips are viewable by everyone" ON public.trips FOR SELECT USING (true);
CREATE POLICY "Trips can be inserted by anyone" ON public.trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Trips can be updated by anyone" ON public.trips FOR UPDATE USING (true);
CREATE POLICY "Trips can be deleted by anyone" ON public.trips FOR DELETE USING (true);

-- Create photos table
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_gallery BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos are viewable by everyone" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Photos can be inserted by anyone" ON public.photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Photos can be updated by anyone" ON public.photos FOR UPDATE USING (true);
CREATE POLICY "Photos can be deleted by anyone" ON public.photos FOR DELETE USING (true);

-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notes are viewable by everyone" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Notes can be inserted by anyone" ON public.notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Notes can be updated by anyone" ON public.notes FOR UPDATE USING (true);
CREATE POLICY "Notes can be deleted by anyone" ON public.notes FOR DELETE USING (true);

-- Create storage bucket for journal assets
INSERT INTO storage.buckets (id, name, public) VALUES ('journal-assets', 'journal-assets', true);

CREATE POLICY "Journal assets are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'journal-assets');
CREATE POLICY "Anyone can upload journal assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'journal-assets');
CREATE POLICY "Anyone can update journal assets" ON storage.objects FOR UPDATE USING (bucket_id = 'journal-assets');
CREATE POLICY "Anyone can delete journal assets" ON storage.objects FOR DELETE USING (bucket_id = 'journal-assets');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
