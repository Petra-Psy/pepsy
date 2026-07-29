import { useState } from "react";
import { Shield, ChevronDown } from "lucide-react";
import { EditableText } from "@/components/admin/EditableText";
import { useCookieConsent, setConsent, clearConsent, type CookieConsent } from "@/lib/cookie-consent";
import { useLang } from "@/components/i18n/LanguageContext";
import { STRINGS } from "@/i18n/strings";

const P = STRINGS.privacy;

export function PrivacySection() {
  const [open, setOpen] = useState(false);
  const consent = useCookieConsent();
  const { lang } = useLang();

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm"
      >
        <Shield className="w-3.5 h-3.5" />
        <EditableText
          contentKey="privacy.toggle"
          defaultValue={P.toggle.cs}
          defaultValueEn={P.toggle.en}
        />
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-4 p-4 sm:p-6 bg-background rounded-xl border border-border text-xs sm:text-sm space-y-5 max-h-[70vh] overflow-y-auto">
          <h3 className="font-display text-base sm:text-lg font-semibold">
            <EditableText
              contentKey="privacy.title"
              defaultValue={P.title.cs}
              defaultValueEn={P.title.en}
            />
          </h3>

          <Block
            titleKey="privacy.s1.title"
            titleDefault={P.s1.title.cs}
            titleDefaultEn={P.s1.title.en}
            bodyKey="privacy.s1.body"
            bodyDefault={P.s1.body.cs}
            bodyDefaultEn={P.s1.body.en}
          />

          <div>
            <h4 className="font-semibold mb-2">
              <EditableText
                contentKey="privacy.s2.title"
                defaultValue={P.s2.title.cs}
                defaultValueEn={P.s2.title.en}
              />
            </h4>
            <p className="text-muted-foreground">
              <EditableText
                contentKey="privacy.s2.intro"
                defaultValue={P.s2.intro.cs}
                defaultValueEn={P.s2.intro.en}
                multiline
              />
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2 mt-2">
              <li><EditableText contentKey="privacy.s2.item1" defaultValue={P.s2.item1.cs} defaultValueEn={P.s2.item1.en} /></li>
              <li><EditableText contentKey="privacy.s2.item2" defaultValue={P.s2.item2.cs} defaultValueEn={P.s2.item2.en} /></li>
              <li><EditableText contentKey="privacy.s2.item3" defaultValue={P.s2.item3.cs} defaultValueEn={P.s2.item3.en} /></li>
              <li><EditableText contentKey="privacy.s2.item4" defaultValue={P.s2.item4.cs} defaultValueEn={P.s2.item4.en} /></li>
            </ul>
            <p className="text-muted-foreground mt-2">
              <EditableText
                contentKey="privacy.s2.outro"
                defaultValue={P.s2.outro.cs}
                defaultValueEn={P.s2.outro.en}
                multiline
              />
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              <EditableText
                contentKey="privacy.s3.title"
                defaultValue={P.s3.title.cs}
                defaultValueEn={P.s3.title.en}
              />
            </h4>
            <p className="text-muted-foreground mb-2">
              <EditableText
                contentKey="privacy.s3.intro"
                defaultValue={P.s3.intro.cs}
                defaultValueEn={P.s3.intro.en}
                multiline
              />
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>
                <strong className="text-foreground">
                  <EditableText contentKey="privacy.s3.i1.title" defaultValue={P.s3.i1.title.cs} defaultValueEn={P.s3.i1.title.en} />
                </strong>{" "}
                <EditableText contentKey="privacy.s3.i1.body" defaultValue={P.s3.i1.body.cs} defaultValueEn={P.s3.i1.body.en} />
              </li>
              <li>
                <strong className="text-foreground">
                  <EditableText contentKey="privacy.s3.i2.title" defaultValue={P.s3.i2.title.cs} defaultValueEn={P.s3.i2.title.en} />
                </strong>{" "}
                <EditableText contentKey="privacy.s3.i2.body" defaultValue={P.s3.i2.body.cs} defaultValueEn={P.s3.i2.body.en} />
              </li>
              <li>
                <strong className="text-foreground">
                  <EditableText contentKey="privacy.s3.i3.title" defaultValue={P.s3.i3.title.cs} defaultValueEn={P.s3.i3.title.en} />
                </strong>{" "}
                <EditableText contentKey="privacy.s3.i3.body" defaultValue={P.s3.i3.body.cs} defaultValueEn={P.s3.i3.body.en} />
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              <EditableText contentKey="privacy.s4.title" defaultValue={P.s4.title.cs} defaultValueEn={P.s4.title.en} />
            </h4>
            <p className="text-muted-foreground mb-2">
              <EditableText
                contentKey="privacy.s4.intro"
                defaultValue={P.s4.intro.cs}
                defaultValueEn={P.s4.intro.en}
              />
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>
                <strong className="text-foreground">
                  <EditableText contentKey="privacy.s4.i1.title" defaultValue={P.s4.i1.title.cs} defaultValueEn={P.s4.i1.title.en} />
                </strong>{" "}
                <EditableText contentKey="privacy.s4.i1.body" defaultValue={P.s4.i1.body.cs} defaultValueEn={P.s4.i1.body.en} />
              </li>
              <li>
                <strong className="text-foreground">
                  <EditableText contentKey="privacy.s4.i2.title" defaultValue={P.s4.i2.title.cs} defaultValueEn={P.s4.i2.title.en} />
                </strong>{" "}
                <EditableText
                  contentKey="privacy.s4.i2.body"
                  defaultValue={P.s4.i2.body.cs}
                  defaultValueEn={P.s4.i2.body.en}
                  multiline
                />
              </li>
            </ul>
            <CookieConsentControls consent={consent} lang={lang} />
          </div>

          <Block
            titleKey="privacy.s5.title"
            titleDefault={P.s5.title.cs}
            titleDefaultEn={P.s5.title.en}
            bodyKey="privacy.s5.body"
            bodyDefault={P.s5.body.cs}
            bodyDefaultEn={P.s5.body.en}
          />

          <Block
            titleKey="privacy.s6.title"
            titleDefault={P.s6.title.cs}
            titleDefaultEn={P.s6.title.en}
            bodyKey="privacy.s6.body"
            bodyDefault={P.s6.body.cs}
            bodyDefaultEn={P.s6.body.en}
          />
        </div>
      )}
    </div>
  );
}

function Block({
  titleKey,
  titleDefault,
  titleDefaultEn,
  bodyKey,
  bodyDefault,
  bodyDefaultEn,
}: {
  titleKey: string;
  titleDefault: string;
  titleDefaultEn: string;
  bodyKey: string;
  bodyDefault: string;
  bodyDefaultEn: string;
}) {
  return (
    <div>
      <h4 className="font-semibold mb-2">
        <EditableText contentKey={titleKey} defaultValue={titleDefault} defaultValueEn={titleDefaultEn} />
      </h4>
      <p className="text-muted-foreground">
        <EditableText contentKey={bodyKey} defaultValue={bodyDefault} defaultValueEn={bodyDefaultEn} multiline />
      </p>
    </div>
  );
}

function CookieConsentControls({
  consent,
  lang,
}: {
  consent: CookieConsent;
  lang: "cs" | "en";
}) {
  const t = {
    status: lang === "en" ? "Your current choice:" : "Vaše aktuální volba:",
    accepted: lang === "en" ? "All cookies accepted" : "Přijaty všechny cookies",
    rejected: lang === "en" ? "Only essential cookies" : "Jen nezbytné cookies",
    unset: lang === "en" ? "Not set yet" : "Zatím nenastaveno",
    accept: lang === "en" ? "Accept all" : "Přijmout vše",
    reject: lang === "en" ? "Only essential" : "Jen nezbytné",
    reset: lang === "en" ? "Reset choice" : "Zrušit volbu",
  };
  const label =
    consent === "accepted" ? t.accepted : consent === "rejected" ? t.rejected : t.unset;
  return (
    <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border/60">
      <div className="text-foreground text-xs sm:text-sm">
        <span className="text-muted-foreground">{t.status} </span>
        <strong>{label}</strong>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setConsent("accepted")}
          className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs hover:opacity-90"
        >
          {t.accept}
        </button>
        <button
          type="button"
          onClick={() => setConsent("rejected")}
          className="px-3 py-1.5 rounded-full border border-input text-xs hover:bg-accent"
        >
          {t.reject}
        </button>
        {consent !== null && (
          <button
            type="button"
            onClick={() => clearConsent()}
            className="px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground"
          >
            {t.reset}
          </button>
        )}
      </div>
    </div>
  );
}
