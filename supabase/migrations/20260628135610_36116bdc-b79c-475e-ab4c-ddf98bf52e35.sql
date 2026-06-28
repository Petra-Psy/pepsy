CREATE TABLE public.site_files (
  key text PRIMARY KEY,
  storage_path text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_files TO anon, authenticated;
GRANT ALL ON public.site_files TO service_role;
ALTER TABLE public.site_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site_files" ON public.site_files FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert site_files" ON public.site_files FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site_files" ON public.site_files FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site_files" ON public.site_files FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_files_set_updated_at BEFORE UPDATE ON public.site_files FOR EACH ROW EXECUTE FUNCTION set_updated_at();