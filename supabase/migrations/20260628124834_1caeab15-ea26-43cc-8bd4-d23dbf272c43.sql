CREATE TABLE public.about_education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position integer NOT NULL DEFAULT 0,
  text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.about_education TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.about_education TO authenticated;
GRANT ALL ON public.about_education TO service_role;

ALTER TABLE public.about_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read about_education" ON public.about_education
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert about_education" ON public.about_education
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update about_education" ON public.about_education
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete about_education" ON public.about_education
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_about_education_updated_at
  BEFORE UPDATE ON public.about_education
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.about_education (position, text) VALUES
  (1, 'Univerzita Karlova v Praze, jednooborová psychologie.'),
  (2, 'Postgraduální výcvik v kognitivně-behaviorální terapii.');