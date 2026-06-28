import { createFileRoute } from "@tanstack/react-router";

import iconAnxiety from "@/assets/icon-anxiety.png.asset.json";
import iconBurnout from "@/assets/icon-burnout.png.asset.json";
import iconDepression from "@/assets/icon-depression.png.asset.json";
import iconWellbeing from "@/assets/icon-wellbeing.png.asset.json";
import { EditableText } from "@/components/admin/EditableText";
import { EditableImage } from "@/components/admin/EditableImage";
import { EducationList } from "@/components/admin/EducationList";
import { useAdmin } from "@/components/admin/AdminContext";
import { useSiteContent } from "@/components/admin/SiteContentContext";
import { CollapsibleText } from "@/components/CollapsibleText";
import { FaqSection } from "@/components/FaqSection";
import { Header, BookingLink, Contact, Footer } from "@/components/site/SiteSections";

export const Route = createFileRoute("/")({
  component: Onepager,
});

function Onepager() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <About />
      <Services />
      <FaqSection />
      <Contact />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="order-2 md:order-1">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            <EditableText
              contentKey="hero.title"
              defaultValue="Pomáhám lidem zvládat úzkosti a krizové situace"
              multiline
            />
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            <EditableText
              contentKey="hero.subtitle"
              defaultValue="Psychologické poradenství v Praze"
            />
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookingLink className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 shadow-sm">
              <EditableText contentKey="hero.cta" defaultValue="Objednat se" />
            </BookingLink>
            <a
              href="#o-mne"
              className="inline-flex items-center px-6 py-3 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Více o mně
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <EditableImage
            contentKey="hero.photo"
            alt="Mgr. Jana Dvořáková"
            loading="eager"
            aspect={4 / 5}
            className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl"
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
                <EditableText contentKey="about.name" defaultValue="Mgr. Jana Dvořáková" />
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                <EditableText contentKey="about.role" defaultValue="Psycholog" />
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <AboutBlock
              titleKey="about.intro.title"
              titleDefault="Představení"
              bodyKey="about.intro.body"
              bodyDefault="V poradně se věnuji dospělým klientům. Pomáhám zvládat náročné životní situace, úzkosti, vyhoření i vztahové potíže."
            />
            <AboutBlock
              titleKey="about.approach.title"
              titleDefault="Můj přístup"
              bodyKey="about.approach.body"
              bodyDefault="Vycházím z principů KBT, pracuji s úzkostmi a stresem v bezpečném, respektujícím prostředí. Důraz kladu na konkrétní kroky a porozumění."
            />
            <div>
              <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-primary mb-2">
                <EditableText contentKey="about.edu.title" defaultValue="Mé vzdělání" />
              </h3>
              <EducationList />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutBlock({
  titleKey, titleDefault, bodyKey, bodyDefault,
}: { titleKey: string; titleDefault: string; bodyKey: string; bodyDefault: string }) {
  const { isAdmin, editMode } = useAdmin();
  const { content } = useSiteContent();
  const body = content[bodyKey] ?? bodyDefault;
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-primary mb-2">
        <EditableText contentKey={titleKey} defaultValue={titleDefault} />
      </h3>
      {isAdmin && editMode ? (
        <p className="text-foreground/80 leading-relaxed">
          <EditableText contentKey={bodyKey} defaultValue={bodyDefault} multiline />
        </p>
      ) : (
        <CollapsibleText text={body} />
      )}
    </div>
  );
}

const SERVICES = [
  { key: "anxiety", icon: iconAnxiety.url, titleDefault: "Úzkostné stavy", bodyDefault: "Práce s úzkostí, panickými atakami a fobiemi." },
  { key: "burnout", icon: iconBurnout.url, titleDefault: "Vyhoření a stres", bodyDefault: "Pomoc při chronickém stresu a syndromu vyhoření." },
  { key: "relationships", icon: iconDepression.url, titleDefault: "Vztahové problémy", bodyDefault: "Podpora při krizích v partnerských i rodinných vztazích." },
  { key: "price", icon: iconWellbeing.url, titleDefault: "Ceník", bodyDefault: "1 200 Kč / 50 minut" },
];

function Services() {
  return (
    <section id="sluzby" className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          <EditableText contentKey="services.title" defaultValue="S čím vám mohu pomoci" />
        </h2>
        <p className="mt-3 text-muted-foreground">
          <EditableText
            contentKey="services.subtitle"
            defaultValue="Bezpečný prostor pro práci s tématy, která vás zatěžují."
          />
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SERVICES.map((s) => (
          <div
            key={s.key}
            className="group rounded-2xl bg-card border border-border p-6 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-4">
              <img src={s.icon} alt="" loading="lazy" width={1024} height={1024} className="w-10 h-10 object-contain" />
            </div>
            <h3 className="font-display text-lg font-semibold">
              <EditableText contentKey={`services.${s.key}.title`} defaultValue={s.titleDefault} />
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              <EditableText
                contentKey={`services.${s.key}.body`}
                defaultValue={s.bodyDefault}
                multiline
              />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
