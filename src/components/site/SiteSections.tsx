import { Phone, Mail, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { EditableText } from "@/components/admin/EditableText";
import { useSiteContent } from "@/components/admin/SiteContentContext";
import { useAdmin } from "@/components/admin/AdminContext";
import { ObfuscatedContact } from "@/components/ObfuscatedContact";
import { PrivacySection } from "@/components/PrivacySection";
import { ReenioWidget } from "@/components/ReenioWidget";

export const NAV = [
  { id: "o-mne", label: "O mně" },
  { id: "sluzby", label: "Služby" },
  { id: "faq", label: "FAQ" },
  { id: "kontakt", label: "Kontakt" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border/60">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-lg font-semibold tracking-tight">
          <EditableText contentKey="brand.name" defaultValue="Petra Svobodová, MSc." />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          {NAV.map((n) => (
            <HomeAnchor key={n.id} id={n.id} className="text-muted-foreground hover:text-foreground transition-colors">
              {n.label}
            </HomeAnchor>
          ))}
          <BookingLink className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            <EditableText contentKey="nav.cta" defaultValue="Rezervace" />
          </BookingLink>
        </div>
      </nav>
    </header>
  );
}

function HomeAnchor({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
  // On home: smooth-scroll to section. On other routes: navigate to /#id.
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    if (window.location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      }
    }
    // else: let browser navigate to /#id
  };
  return (
    <a href={`/#${id}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export function BookingLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isAdmin, editMode } = useAdmin();
  if (isAdmin && editMode) {
    // In edit mode keep as inert button so EditableText inside is editable.
    return <span className={className}>{children}</span>;
  }
  return (
    <Link to="/rezervace" className={className}>
      {children}
    </Link>
  );
}

export function Reservation() {
  return (
    <section className="bg-card/60 border-y border-border/60">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            <EditableText contentKey="booking.title" defaultValue="Online rezervace" />
          </h2>
          <p className="mt-3 text-muted-foreground">
            <EditableText
              contentKey="booking.intro"
              defaultValue="Vyberte si volný termín přímo zde. Po potvrzení vám přijde e-mail s detaily."
              multiline
            />
          </p>
        </div>
        <div className="mt-10 rounded-2xl bg-background border border-border p-2 sm:p-4 shadow-sm">
          <ReenioWidget />
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
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

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            © {new Date().getFullYear()}{" "}
            <EditableText contentKey="footer.brand" defaultValue="Petra Svobodová, MSc." />
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
  if (isAdmin && editMode) {
    return <EditableText contentKey={contentKey} defaultValue={defaultValue} />;
  }
  return <ObfuscatedContact value={value} type={type} />;
}
