import { createFileRoute } from "@tanstack/react-router";
import { Clock, CreditCard, MapPin, FileText } from "lucide-react";
import type { SVGProps } from "react";

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

function AnxietyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18.5 36.5c-4.7-.9-8.2-5-8.2-9.9 0-4.1 2.4-7.6 5.9-9.2.9-4.4 4.8-7.7 9.5-7.7 5.4 0 9.8 4.4 9.8 9.8v.3c3.1 1.4 5.2 4.5 5.2 8 0 4.9-4 8.8-8.8 8.8" />
      <path d="M19.5 20.5c2.2-1.7 5.1-1.7 7.2 0" />
      <path d="M17.5 27.5c3.8-2.9 9.2-2.9 13 0" />
      <path d="M21 34c2-1.3 4-1.3 6 0" />
    </svg>
  );
}

function BurnoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M25.5 5.8c1.1 6-4.6 8.7-4.6 14.2 0 2.3 1.4 4.2 3.6 4.2 3.1 0 5.2-3.4 4.1-7.3 5.3 3.3 8.5 8.2 8.5 14 0 6.1-5.5 11.3-13.1 11.3S10.9 37.1 10.9 31c0-5.3 3.1-9.3 7.5-13.4 3.1-2.9 5.9-6.1 7.1-11.8Z" />
      <path d="M20.2 34.7c0 2.1 1.7 3.8 3.8 3.8s3.8-1.7 3.8-3.8c0-2.8-2.6-4.2-3.8-6.4-1.2 2.2-3.8 3.6-3.8 6.4Z" />
    </svg>
  );
}

function DepressionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M34 30.5a10 10 0 1 0-18.5 0" />
      <path d="M13.5 24.2c-3.3.6-5.8 3.5-5.8 7 0 3.9 3.2 7.1 7.1 7.1h18.4c3.9 0 7.1-3.2 7.1-7.1 0-3.5-2.5-6.4-5.8-7" />
      <path d="M18 16.2 15.5 12" />
      <path d="M24 14.5V9.8" />
      <path d="M30 16.2l2.5-4.2" />
      <path d="M19.8 30.5h8.4" />
    </svg>
  );
}

function WellbeingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M24 40s-14-7.9-14-19.1c0-4.5 3.6-8.2 8.1-8.2 2.6 0 4.8 1.2 5.9 3.1 1.1-1.9 3.3-3.1 5.9-3.1 4.5 0 8.1 3.7 8.1 8.2C38 32.1 24 40 24 40Z" />
      <path d="M16.5 25h5l2-4.2 3.1 8.4 2-4.2h3" />
    </svg>
  );
}

type SvcKey = "anxiety" | "burnout" | "relationships" | "wellbeing";

const SERVICES: { key: SvcKey; Icon: (p: SVGProps<SVGSVGElement>) => React.ReactElement }[] = [
  { key: "anxiety", Icon: AnxietyIcon },
  { key: "burnout", Icon: BurnoutIcon },
  { key: "relationships", Icon: DepressionIcon },
  { key: "wellbeing", Icon: WellbeingIcon },
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
          const Icon = s.Icon;
          const item = STRINGS.serviceItems[s.key];
          return (
            <div
              key={s.key}
              className="group rounded-2xl bg-card border border-border p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-4">
                <Icon aria-hidden="true" className="h-10 w-10 text-primary" />
              </div>
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
