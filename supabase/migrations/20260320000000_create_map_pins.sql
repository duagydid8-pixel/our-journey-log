-- Create map_pins table for travel location markers
CREATE TABLE public.map_pins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT,
  memo TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.map_pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Map pins are viewable by everyone" ON public.map_pins FOR SELECT USING (true);
CREATE POLICY "Map pins can be inserted by anyone" ON public.map_pins FOR INSERT WITH CHECK (true);
CREATE POLICY "Map pins can be updated by anyone" ON public.map_pins FOR UPDATE USING (true);
CREATE POLICY "Map pins can be deleted by anyone" ON public.map_pins FOR DELETE USING (true);
