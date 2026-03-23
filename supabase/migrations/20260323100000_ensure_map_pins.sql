-- Ensure map_pins table exists (idempotent)
CREATE TABLE IF NOT EXISTS public.map_pins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT,
  memo TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.map_pins ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'map_pins' AND policyname = 'Map pins are viewable by everyone'
  ) THEN
    CREATE POLICY "Map pins are viewable by everyone" ON public.map_pins FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'map_pins' AND policyname = 'Map pins can be inserted by anyone'
  ) THEN
    CREATE POLICY "Map pins can be inserted by anyone" ON public.map_pins FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'map_pins' AND policyname = 'Map pins can be updated by anyone'
  ) THEN
    CREATE POLICY "Map pins can be updated by anyone" ON public.map_pins FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'map_pins' AND policyname = 'Map pins can be deleted by anyone'
  ) THEN
    CREATE POLICY "Map pins can be deleted by anyone" ON public.map_pins FOR DELETE USING (true);
  END IF;
END $$;
