
ALTER TABLE public.site_content ALTER COLUMN value DROP NOT NULL;
ALTER TABLE public.site_content ALTER COLUMN value DROP DEFAULT;

ALTER TABLE public.faq_items ALTER COLUMN question DROP NOT NULL;
ALTER TABLE public.faq_items ALTER COLUMN answer DROP NOT NULL;
ALTER TABLE public.faq_items ALTER COLUMN question DROP DEFAULT;
ALTER TABLE public.faq_items ALTER COLUMN answer DROP DEFAULT;

ALTER TABLE public.about_education ALTER COLUMN text DROP NOT NULL;
ALTER TABLE public.about_education ALTER COLUMN text DROP DEFAULT;

-- Data repair: rows where the previous bug blanked out the CZ value.
UPDATE public.site_content
   SET value = NULL
 WHERE value = ''
   AND value_en IS NOT NULL
   AND value_en <> '';

UPDATE public.faq_items
   SET question = NULL
 WHERE question = ''
   AND question_en IS NOT NULL
   AND question_en <> '';

UPDATE public.faq_items
   SET answer = NULL
 WHERE answer = ''
   AND answer_en IS NOT NULL
   AND answer_en <> '';

UPDATE public.about_education
   SET text = NULL
 WHERE text = ''
   AND text_en IS NOT NULL
   AND text_en <> '';
