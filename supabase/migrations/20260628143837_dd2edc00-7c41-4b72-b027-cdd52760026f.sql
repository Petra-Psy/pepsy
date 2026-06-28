ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS value_en text;
ALTER TABLE public.faq_items ADD COLUMN IF NOT EXISTS question_en text;
ALTER TABLE public.faq_items ADD COLUMN IF NOT EXISTS answer_en text;
ALTER TABLE public.about_education ADD COLUMN IF NOT EXISTS text_en text;