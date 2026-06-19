import { createFileRoute } from "@tanstack/react-router";
import { Brain, Sparkles, Heart, Wallet, Phone, Mail, MapPin } from "lucide-react";
import { EditableText } from "@/components/admin/EditableText";
import { EditableImage } from "@/components/admin/EditableImage";
import { useSiteContent } from "@/components/admin/SiteContentContext";
import { useAdmin } from "@/components/admin/AdminContext";
import { FaqSection } from "@/components/FaqSection";
import { ObfuscatedContact } from "@/components/ObfuscatedContact";
import { PrivacySection } from "@/components/PrivacySection";
import heroImg from "@/assets/hero-therapist.jpg";
import portraitImg from "@/assets/about-portrait.jpg";

export const Route = createFileRoute("/")({
  component: Onepager,
});

const NAV = [
  { id: "o-mne", label: "O mně" },
  { id: "sluzby", label: "Služby" },
  { id: "faq", label: "FAQ" },
  { id: "kontakt", label: "Kontakt" },
];

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

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border/60">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight">
          <EditableText contentKey="brand.name" defaultValue="Mgr. Jana Dvořáková" />
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="text-muted-foreground hover:text-foreground transition-colors">
              {n.label}
            </a>
          ))}
          <a
            href="#kontakt"
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            <EditableText contentKey="nav.cta" defaultValue="Rezervace" />
          </a>
        </div>
      </nav>
    </header>
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
            <BookingButton />
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
            defaultSrc={heroImg}
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

function BookingButton() {
  // Reads booking.url from site_content; falls back to scroll anchor when empty.
  return (
    <BookingLink
      className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 shadow-sm"
    >
      <EditableText contentKey="hero.cta" defaultValue="Objednat se" />
    </BookingLink>
  );
}

function BookingLink({ children, className }: { children: React.ReactNode; className?: string }) {
  const { content } = useSiteContent();
  const url = content["booking.url"] || "#kontakt";
  const external = /^https?:\/\//i.test(url);
  return (
    <a
      href={url}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {children}
    </a>
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
              defaultSrc={portraitImg}
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
              titleKey="about.edu.title"
              titleDefault="Mé vzdělání"
              bodyKey="about.edu.body"
              bodyDefault="Univerzita Karlova v Praze, jednooborová psychologie. Postgraduální výcvik v kognitivně-behaviorální terapii."
            />
            <AboutBlock
              titleKey="about.approach.title"
              titleDefault="Můj přístup"
              bodyKey="about.approach.body"
              bodyDefault="Vycházím z principů KBT, pracuji s úzkostmi a stresem v bezpečném, respektujícím prostředí. Důraz kladu na konkrétní kroky a porozumění."
            />
            <AboutBlock
              titleKey="about.intro.title"
              titleDefault="Představení"
              bodyKey="about.intro.body"
              bodyDefault="V poradně se věnuji dospělým klientům. Pomáhám zvládat náročné životní situace, úzkosti, vyhoření i vztahové potíže."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutBlock({
  titleKey, titleDefault, bodyKey, bodyDefault,
}: { titleKey: string; titleDefault: string; bodyKey: string; bodyDefault: string }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-primary mb-2">
        <EditableText contentKey={titleKey} defaultValue={titleDefault} />
      </h3>
      <p className="text-foreground/80 leading-relaxed">
        <EditableText contentKey={bodyKey} defaultValue={bodyDefault} multiline />
      </p>
    </div>
  );
}

const SERVICES = [
  { key: "anxiety", icon: Brain, titleDefault: "Úzkostné stavy", bodyDefault: "Práce s úzkostí, panickými atakami a fobiemi." },
  { key: "burnout", icon: Sparkles, titleDefault: "Vyhoření a stres", bodyDefault: "Pomoc při chronickém stresu a syndromu vyhoření." },
  { key: "relationships", icon: Heart, titleDefault: "Vztahové problémy", bodyDefault: "Podpora při krizích v partnerských i rodinných vztazích." },
  { key: "price", icon: Wallet, titleDefault: "Ceník", bodyDefault: "1 200 Kč / 50 minut" },
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
            <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-primary mb-4">
              <s.icon className="w-5 h-5" strokeWidth={1.6} />
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


function Contact() {
  return (
    <section id="kontakt" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            <EditableText contentKey="contact.title" defaultValue="Kontakt" />
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            <EditableText
              contentKey="contact.subtitle"
              defaultValue="Ozvěte se telefonicky, e-mailem nebo se objednejte přímo online."
            />
          </p>
          <ul className="mt-8 space-y-4 text-base">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary" />
              <ProtectedContact contentKey="contact.phone" defaultValue="+420 777 123 456" type="phone" />
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary" />
              <ProtectedContact contentKey="contact.email" defaultValue="info@example.cz" type="email" />
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary mt-1" />
              <span>
                <EditableText
                  contentKey="contact.address"
                  defaultValue="Ordinace: Ulice 123, Praha 1"
                />
                <br />
                <span className="text-sm text-muted-foreground">
                  <EditableText
                    contentKey="contact.address.note"
                    defaultValue="Parkování v modré zóně, MHD zastávka 5 min."
                  />
                </span>
              </span>
            </li>
          </ul>
          <div className="mt-8">
            <BookingLink className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 shadow-sm">
              <EditableText contentKey="contact.cta" defaultValue="Rezervovat online" />
            </BookingLink>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border bg-card aspect-[4/3]">
          <BookingMap />
        </div>
      </div>
    </section>
  );
}

function BookingMap() {
  const { content } = useSiteContent();
  const query = content["contact.address"] || "Praha 1";
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <iframe
      title="Mapa ordinace"
      src={src}
      className="w-full h-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            © {new Date().getFullYear()}{" "}
            <EditableText contentKey="footer.brand" defaultValue="Mgr. Jana Dvořáková" />
          </span>
          <span>
            <EditableText contentKey="footer.note" defaultValue="Psychologické poradenství" />
          </span>
        </div>
        <PrivacySection />
      </div>
    </footer>
  );
}

function ProtectedContact({
  contentKey,
  defaultValue,
  type,
}: {
  contentKey: string;
  defaultValue: string;
  type: "email" | "phone";
}) {
  const { content } = useSiteContent();
  const { isAdmin, editMode } = useAdmin();
  const value = content[contentKey] ?? defaultValue;

  // V edit módu admin vidí klasický EditableText (může upravit hodnotu).
  if (isAdmin && editMode) {
    return <EditableText contentKey={contentKey} defaultValue={defaultValue} />;
  }
  return <ObfuscatedContact value={value} type={type} />;
}
