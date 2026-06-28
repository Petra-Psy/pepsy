/**
 * Static UI strings translated for the EN locale.
 * For editable database content, see `LanguageContext.pick()`.
 */
export const STRINGS = {
  nav: {
    about: { cs: "O mně", en: "About" },
    services: { cs: "Služby", en: "Services" },
    pricing: { cs: "Ceník", en: "Pricing" },
    faq: { cs: "FAQ", en: "FAQ" },
    contact: { cs: "Kontakt", en: "Contact" },
    cta: { cs: "Rezervace", en: "Book" },
  },
  hero: {
    moreAbout: { cs: "Více o mně", en: "More about me" },
  },
  reservation: {
    title: { cs: "Online rezervace", en: "Online booking" },
    intro: {
      cs: "Vyberte si volný termín přímo zde. Po potvrzení vám přijde e-mail s detaily.",
      en: "Pick an available slot below. You'll receive a confirmation email with all the details.",
    },
    back: { cs: "Zpět na hlavní stránku", en: "Back to home" },
  },
  contact: {
    title: { cs: "Kontakt", en: "Contact" },
    subtitle: {
      cs: "Ozvěte se telefonicky, e-mailem nebo se objednejte přímo online.",
      en: "Reach out by phone, e-mail, or book your session online.",
    },
    cta: { cs: "Rezervovat online", en: "Book online" },
    parking: {
      cs: "Parkování v modré zóně, MHD zastávka 5 min.",
      en: "Blue-zone parking, public transport stop 5 min away.",
    },
  },
  footer: {
    note: { cs: "Psychologické poradenství", en: "Psychological counselling" },
  },
  faq: {
    title: { cs: "Často kladené otázky", en: "Frequently asked questions" },
    showMore: { cs: "Zobrazit více otázek", en: "Show more questions" },
    hide: { cs: "Skrýt další otázky", en: "Hide more questions" },
  },
  pricing: {
    title: { cs: "Ceník", en: "Pricing" },
    subtitle: { cs: "Vše důležité na jednom místě.", en: "Everything important in one place." },
    first: { cs: "První sezení", en: "First session" },
    next: { cs: "Další sezení", en: "Follow-up sessions" },
    duration: { cs: "Délka sezení: 50 minut", en: "Session length: 50 minutes" },
    format: { cs: "Osobně v ordinaci i online", en: "In person at the practice or online" },
    payment: { cs: "Platba hotově nebo kartou (QR)", en: "Cash or card (QR) payment" },
    agreement: { cs: "Terapeutická dohoda (PDF)", en: "Therapeutic agreement (PDF)" },
  },
  services: {
    title: { cs: "S čím vám mohu pomoci", en: "How I can help" },
    subtitle: {
      cs: "Bezpečný prostor pro práci s tématy, která vás zatěžují.",
      en: "A safe space to work through what's weighing on you.",
    },
  },
  about: {
    introTitle: { cs: "Představení", en: "Introduction" },
    intro: {
      cs: "V poradně se věnuji dospělým klientům. Pomáhám zvládat náročné životní situace, úzkosti, vyhoření i vztahové potíže.",
      en: "I work with adult clients. I help them navigate demanding life situations, anxiety, burnout and relationship difficulties.",
    },
    approachTitle: { cs: "Můj přístup", en: "My approach" },
    approach: {
      cs: "Vycházím z principů KBT, pracuji s úzkostmi a stresem v bezpečném, respektujícím prostředí. Důraz kladu na konkrétní kroky a porozumění.",
      en: "I draw on cognitive-behavioural therapy in a safe, respectful environment. I focus on practical steps and understanding.",
    },
    eduTitle: { cs: "Mé vzdělání", en: "My education" },
    role: { cs: "Psycholog", en: "Psychologist" },
  },
  serviceItems: {
    anxiety: {
      title: { cs: "Úzkostné stavy", en: "Anxiety" },
      body: {
        cs: "Práce s úzkostí, panickými atakami a fobiemi.",
        en: "Working with anxiety, panic attacks and phobias.",
      },
    },
    burnout: {
      title: { cs: "Vyhoření a stres", en: "Burnout & stress" },
      body: {
        cs: "Pomoc při chronickém stresu a syndromu vyhoření.",
        en: "Support for chronic stress and burnout.",
      },
    },
    relationships: {
      title: { cs: "Vztahové problémy", en: "Relationships" },
      body: {
        cs: "Podpora při krizích v partnerských i rodinných vztazích.",
        en: "Support through partner and family relationship crises.",
      },
    },
    wellbeing: {
      title: { cs: "Osobní rozvoj", en: "Personal growth" },
      body: {
        cs: "Práce na sebepoznání, hranicích a duševní pohodě.",
        en: "Self-awareness, healthy boundaries and mental wellbeing.",
      },
    },
  },
  editor: {
    editingEn: { cs: "Editujete EN", en: "Editing EN" },
    editingCs: { cs: "Editujete CZ", en: "Editing CZ" },
  },
} as const;
