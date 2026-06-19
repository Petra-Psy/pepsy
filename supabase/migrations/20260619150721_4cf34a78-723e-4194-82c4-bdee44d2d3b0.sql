CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position integer NOT NULL DEFAULT 0,
  question text NOT NULL DEFAULT '',
  answer text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.faq_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.faq_items TO authenticated;
GRANT ALL ON public.faq_items TO service_role;

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read faq_items" ON public.faq_items
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert faq_items" ON public.faq_items
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update faq_items" ON public.faq_items
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete faq_items" ON public.faq_items
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER faq_items_set_updated_at
  BEFORE UPDATE ON public.faq_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX faq_items_position_idx ON public.faq_items (position);

INSERT INTO public.faq_items (position, question, answer) VALUES
  (1, 'Co mě čeká na prvním sezení?', 'Na úvod si v klidu popovídáme o tom, co vás přivádí, jaká máte očekávání a jak může spolupráce vypadat. První sezení trvá 50 minut.'),
  (2, 'Jak dlouho terapie trvá?', 'Délka závisí na vašem tématu a cílech. Krátkodobá spolupráce zahrnuje 5–10 sezení, dlouhodobější terapie pak desítky sezení.'),
  (3, 'Předepisujete léky?', 'Ne, jsem psycholog, nikoli psychiatr. V případě potřeby vám doporučím spolupracujícího lékaře.');
