import { createFileRoute } from "@tanstack/react-router";
import { Clock, CreditCard, MapPin, FileText } from "lucide-react";

import iconAnxiety from "@/assets/icon-anxiety.png.asset.json";
import iconBurnout from "@/assets/icon-burnout.png.asset.json";
import iconRelationships from "@/assets/icon-relationships.png.asset.json";
import iconWellbeing from "@/assets/icon-wellbeing.png.asset.json";

import { EditableText } from "@/components/admin/EditableText";
import { EditableImage } from "@/components/admin/EditableImage";
import { EditableFileLink } from "@/components/admin/EditableFileLink";

import { useAdmin } from "@/components/admin/AdminContext";
import { useSiteContent } from "@/components/admin/SiteContentContext";
import { useLang } from "@/components/i18n/LanguageContext";
import { STRINGS } from "@/i18n/strings";
import { CollapsibleText } from "@/components/CollapsibleText";
import { FaqSection } from "@/components/FaqSection";
import { Header, BookingLink, Contact, Footer } from "@/components/site/SiteSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Petra Svobodová, MSc. — Psychologické poradenství Praha" },
      {
        name: "description",
        content: "Psychologické poradenství v Praze. Pomáhám zvládat úzkosti, stres, vyhoření a vztahové potíže.",
      },
      { property: "og:title", content: "Petra Svobodová, MSc. — Psychologické poradenství Praha" },
      { property: "og:description", content: "Psychologické poradenství v Praze." },
      { property: "og:url", content: "https://pepsy.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://pepsy.lovable.app/" },
      { rel: "alternate", hrefLang: "cs", href: "https://pepsy.lovable.app/" },
      { rel: "alternate", hrefLang: "en", href: "https://pepsy.lovable.app/en" },
      { rel: "alternate", hrefLang: "x-default", href: "https://pepsy.lovable.app/" },
    ],
  }),
  component: () => <Onepager />,
});

export function Onepager() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <About />
      <Services />
      <Pricing />
      <FaqSection />
      <Contact />
      <Footer />
    </div>
  );
}

function Hero() {
  const { t } = useLang();
  return (
    <section id="top" className="relative">
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-24 grid md:grid-cols-2 gap-6 md:gap-14 items-center">
        <div className="order-2 md:order-1">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight">
            <EditableText
              contentKey="hero.title"
              defaultValue="Pomáhám lidem zvládat úzkosti a krizové situace"
              defaultValueEn="Helping people navigate anxiety and life crises"
              multiline
            />
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground max-w-md">
            <EditableText
              contentKey="hero.subtitle"
              defaultValue="Psychologické poradenství v Praze"
              defaultValueEn="Psychological counselling in Prague"
            />
          </p>
          <div className="mt-6 md:mt-8 flex flex-wrap gap-3">
            <BookingLink className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 shadow-sm">
              <EditableText
                contentKey="hero.cta"
                defaultValue="Objednat se"
                defaultValueEn="Book a session"
              />
            </BookingLink>
            <a
              href="#o-mne"
              className="inline-flex items-center px-6 py-3 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              {t(STRINGS.hero.moreAbout.cs, STRINGS.hero.moreAbout.en)}
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2 mx-auto w-full max-w-[260px] sm:max-w-sm md:max-w-none">
          <EditableImage
            contentKey="hero.photo"
            alt="Petra Svobodová, MSc."
            loading="eager"
            aspect={4 / 5}
            className="aspect-[4/5] max-h-[40svh] md:max-h-none rounded-3xl overflow-hidden shadow-xl mx-auto"
            imgClassName="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="o-mne" className="bg-card/60 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid md:grid-cols-[260px_1fr] gap-10 items-start">
          <div className="flex flex-col items-center md:items-start gap-4">
            <EditableImage
              contentKey="about.portrait"
              alt="Portrét"
              aspect={1}
              cropShape="round"
              className="w-40 h-40 rounded-full overflow-hidden shadow-md"
              imgClassName="w-full h-full object-cover"
            />
            <div className="text-center md:text-left">
              <h2 className="font-display text-xl font-semibold tracking-tight">
                <EditableText contentKey="about.name" defaultValue="Petra Svobodová, MSc." defaultValueEn="Petra Svobodová, MSc." />
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                <EditableText
                  contentKey="about.role"
                  defaultValue={STRINGS.about.role.cs}
                  defaultValueEn={STRINGS.about.role.en}
                />
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <AboutBlock
              titleKey="about.intro.title"
              titleDefault={STRINGS.about.introTitle.cs}
              titleDefaultEn={STRINGS.about.introTitle.en}
              bodyKey="about.intro.body"
              bodyDefault={STRINGS.about.intro.cs}
              bodyDefaultEn={STRINGS.about.intro.en}
            />
            <AboutBlock
              titleKey="about.approach.title"
              titleDefault={STRINGS.about.approachTitle.cs}
              titleDefaultEn={STRINGS.about.approachTitle.en}
              bodyKey="about.approach.body"
              bodyDefault={STRINGS.about.approach.cs}
              bodyDefaultEn={STRINGS.about.approach.en}
            />
            <AboutBlock
              titleKey="about.edu.title"
              titleDefault={STRINGS.about.eduTitle.cs}
              titleDefaultEn={STRINGS.about.eduTitle.en}
              bodyKey="about.edu.body"
              bodyDefault={"Univerzita Karlova v Praze, jednooborová psychologie.\nPostgraduální výcvik v kognitivně-behaviorální terapii."}
              bodyDefaultEn={"Charles University in Prague, single-subject Psychology.\nPostgraduate training in cognitive-behavioural therapy."}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutBlock({
  titleKey, titleDefault, titleDefaultEn, bodyKey, bodyDefault, bodyDefaultEn,
}: {
  titleKey: string;
  titleDefault: string;
  titleDefaultEn: string;
  bodyKey: string;
  bodyDefault: string;
  bodyDefaultEn: string;
}) {
  const { isAdmin, editMode } = useAdmin();
  const { content, contentEn } = useSiteContent();
  const { lang } = useLang();
  const body =
    lang === "en"
      ? (contentEn[bodyKey]?.trim() || bodyDefaultEn || content[bodyKey] || bodyDefault)
      : (content[bodyKey] ?? bodyDefault);
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-primary mb-2">
        <EditableText contentKey={titleKey} defaultValue={titleDefault} defaultValueEn={titleDefaultEn} />
      </h3>
      {isAdmin && editMode ? (
        <p className="text-foreground/80 leading-relaxed">
          <EditableText
            contentKey={bodyKey}
            defaultValue={bodyDefault}
            defaultValueEn={bodyDefaultEn}
            multiline
          />
        </p>
      ) : (
        <CollapsibleText text={body} />
      )}
    </div>
  );
}

type SvcKey = "anxiety" | "burnout" | "relationships" | "wellbeing";

const SERVICES: { key: SvcKey; src: string }[] = [
  { key: "anxiety", src: iconAnxiety.url },
  { key: "burnout", src: iconBurnout.url },
  { key: "relationships", src: iconRelationships.url },
  { key: "wellbeing", src: iconWellbeing.url },
];

function Services() {
  return (
    <section id="sluzby" className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          <EditableText
            contentKey="services.title"
            defaultValue={STRINGS.services.title.cs}
            defaultValueEn={STRINGS.services.title.en}
          />
        </h2>
        <p className="mt-3 text-muted-foreground">
          <EditableText
            contentKey="services.subtitle"
            defaultValue={STRINGS.services.subtitle.cs}
            defaultValueEn={STRINGS.services.subtitle.en}
          />
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SERVICES.map((s) => {
          const item = STRINGS.serviceItems[s.key];
          return (
            <div
              key={s.key}
              className="group rounded-2xl bg-card border border-border p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <img
                src={s.src}
                alt=""
                width={64}
                height={64}
                loading="lazy"
                className="w-16 h-16 object-contain mb-4"
              />
              <h3 className="font-display text-lg font-semibold">
                <EditableText
                  contentKey={`services.${s.key}.title`}
                  defaultValue={item.title.cs}
                  defaultValueEn={item.title.en}
                />
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                <EditableText
                  contentKey={`services.${s.key}.body`}
                  defaultValue={item.body.cs}
                  defaultValueEn={item.body.en}
                  multiline
                />
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="cenik" className="bg-card/60 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            <EditableText
              contentKey="pricing.title"
              defaultValue={STRINGS.pricing.title.cs}
              defaultValueEn={STRINGS.pricing.title.en}
            />
          </h2>
          <p className="mt-3 text-muted-foreground">
            <EditableText
              contentKey="pricing.subtitle"
              defaultValue={STRINGS.pricing.subtitle.cs}
              defaultValueEn={STRINGS.pricing.subtitle.en}
            />
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <PriceRow
            label={
              <EditableText
                contentKey="pricing.first.label"
                defaultValue={STRINGS.pricing.first.cs}
                defaultValueEn={STRINGS.pricing.first.en}
              />
            }
            value={<EditableText contentKey="pricing.first.value" defaultValue="1 500 Kč" defaultValueEn="1 500 CZK" />}
          />
          <PriceRow
            label={
              <EditableText
                contentKey="pricing.next.label"
                defaultValue={STRINGS.pricing.next.cs}
                defaultValueEn={STRINGS.pricing.next.en}
              />
            }
            value={<EditableText contentKey="pricing.next.value" defaultValue="1 200 Kč" defaultValueEn="1 200 CZK" />}
          />
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem icon={Clock}>
            <EditableText
              contentKey="pricing.duration"
              defaultValue={STRINGS.pricing.duration.cs}
              defaultValueEn={STRINGS.pricing.duration.en}
            />
          </InfoItem>
          <InfoItem icon={MapPin}>
            <EditableText
              contentKey="pricing.format"
              defaultValue={STRINGS.pricing.format.cs}
              defaultValueEn={STRINGS.pricing.format.en}
            />
          </InfoItem>
          <InfoItem icon={CreditCard}>
            <EditableText
              contentKey="pricing.payment"
              defaultValue={STRINGS.pricing.payment.cs}
              defaultValueEn={STRINGS.pricing.payment.en}
            />
          </InfoItem>
        </ul>

        <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-background p-4">
          <FileText className="w-5 h-5 text-primary shrink-0" aria-hidden />
          <EditableFileLink
            fileKey="pricing.agreement.pdf"
            labelKey="pricing.agreement.label"
            labelDefault={STRINGS.pricing.agreement.cs}
          />
        </div>
      </div>
    </section>
  );
}

function PriceRow({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 rounded-xl border border-border bg-background p-5">
      <span className="text-sm uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <span className="font-display text-2xl font-semibold text-foreground">{value}</span>
    </div>
  );
}

function InfoItem({ icon: Icon, children }: { icon: typeof Clock; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
      <Icon className="w-5 h-5 text-primary shrink-0" aria-hidden />
      <span className="text-sm text-foreground/90">{children}</span>
    </li>
  );
}
