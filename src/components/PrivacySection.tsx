import { useState } from "react";
import { Shield, ChevronDown } from "lucide-react";
import { EditableText } from "@/components/admin/EditableText";

export function PrivacySection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm"
      >
        <Shield className="w-3.5 h-3.5" />
        <EditableText contentKey="privacy.toggle" defaultValue="Ochrana osobních údajů" />
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-4 p-4 sm:p-6 bg-background rounded-xl border border-border text-xs sm:text-sm space-y-5 max-h-[70vh] overflow-y-auto">
          <h3 className="font-display text-base sm:text-lg font-semibold">
            <EditableText
              contentKey="privacy.title"
              defaultValue="Zásady ochrany osobních údajů"
            />
          </h3>

          <Block
            titleKey="privacy.s1.title"
            titleDefault="1. Kdo web provozuje (Správce údajů)"
            bodyKey="privacy.s1.body"
            bodyDefault="Provozovatelem webu a správcem vašich osobních údajů je: Mgr. Jana Dvořáková, IČO: 00000000, sídlo: Ulice 123, Praha 1, kontakt: info@example.cz"
          />

          <div>
            <h4 className="font-semibold mb-2">
              <EditableText
                contentKey="privacy.s2.title"
                defaultValue="2. Jaké údaje sbírám a proč?"
              />
            </h4>
            <p className="text-muted-foreground">
              <EditableText
                contentKey="privacy.s2.intro"
                defaultValue="Pokud mě kontaktujete prostřednictvím e-mailu nebo telefonu, zpracovávám údaje, které mi sami poskytnete. Jde o:"
                multiline
              />
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2 mt-2">
              <li><EditableText contentKey="privacy.s2.item1" defaultValue="Jméno a příjmení" /></li>
              <li><EditableText contentKey="privacy.s2.item2" defaultValue="E-mailovou adresu" /></li>
              <li><EditableText contentKey="privacy.s2.item3" defaultValue="Telefonní číslo (pokud ho uvedete)" /></li>
              <li><EditableText contentKey="privacy.s2.item4" defaultValue="Obsah vaší zprávy" /></li>
            </ul>
            <p className="text-muted-foreground mt-2">
              <EditableText
                contentKey="privacy.s2.outro"
                defaultValue="Tyto údaje používám výhradně k tomu, abych vám mohla odpovědět a domluvit termín konzultace (plnění smlouvy nebo předsmluvní jednání)."
                multiline
              />
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              <EditableText
                contentKey="privacy.s3.title"
                defaultValue="3. Komu data předávám (Nástroje třetích stran)"
              />
            </h4>
            <p className="text-muted-foreground mb-2">
              <EditableText
                contentKey="privacy.s3.intro"
                defaultValue="Vaše osobní údaje neprodávám. Pro chod webu však využívám ověřené nástroje třetích stran, které mohou mít k některým datům přístup:"
                multiline
              />
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>
                <strong className="text-foreground">
                  <EditableText contentKey="privacy.s3.i1.title" defaultValue="Hosting a technologie webu:" />
                </strong>{" "}
                <EditableText contentKey="privacy.s3.i1.body" defaultValue="Poskytovatelé serverové infrastruktury (zajištění chodu webu)." />
              </li>
              <li>
                <strong className="text-foreground">
                  <EditableText contentKey="privacy.s3.i2.title" defaultValue="Rezervační systém:" />
                </strong>{" "}
                <EditableText contentKey="privacy.s3.i2.body" defaultValue="Pro správu objednaných termínů konzultací." />
              </li>
              <li>
                <strong className="text-foreground">
                  <EditableText contentKey="privacy.s3.i3.title" defaultValue="Google Mapy:" />
                </strong>{" "}
                <EditableText contentKey="privacy.s3.i3.body" defaultValue="Pro zobrazení adresy ordinace na webu." />
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              <EditableText contentKey="privacy.s4.title" defaultValue="4. Cookies" />
            </h4>
            <p className="text-muted-foreground mb-2">
              <EditableText
                contentKey="privacy.s4.intro"
                defaultValue="Tento web používá soubory cookies:"
              />
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>
                <strong className="text-foreground">
                  <EditableText contentKey="privacy.s4.i1.title" defaultValue="Nezbytné:" />
                </strong>{" "}
                <EditableText contentKey="privacy.s4.i1.body" defaultValue="Pro technický chod stránek." />
              </li>
              <li>
                <strong className="text-foreground">
                  <EditableText contentKey="privacy.s4.i2.title" defaultValue="Analytické a marketingové:" />
                </strong>{" "}
                <EditableText
                  contentKey="privacy.s4.i2.body"
                  defaultValue="Tyto cookies se spouští pouze v případě, že jste k tomu udělili souhlas. Souhlas můžete kdykoliv změnit."
                  multiline
                />
              </li>
            </ul>
          </div>

          <Block
            titleKey="privacy.s5.title"
            titleDefault="5. Jak dlouho údaje uchovávám?"
            bodyKey="privacy.s5.body"
            bodyDefault="Údaje uchovávám pouze po dobu nezbytnou pro vyřízení vaší poptávky a případnou následnou spolupráci, nebo jak mi ukládá zákon (např. pro účetnictví)."
          />

          <Block
            titleKey="privacy.s6.title"
            titleDefault="6. Vaše práva"
            bodyKey="privacy.s6.body"
            bodyDefault="Podle GDPR máte právo kdykoliv požádat o informaci, jaké vaše údaje zpracovávám, vyžádat si jejich opravu nebo výmaz. Stačí mi napsat na e-mail uvedený v kontaktech."
          />
        </div>
      )}
    </div>
  );
}

function Block({
  titleKey,
  titleDefault,
  bodyKey,
  bodyDefault,
}: {
  titleKey: string;
  titleDefault: string;
  bodyKey: string;
  bodyDefault: string;
}) {
  return (
    <div>
      <h4 className="font-semibold mb-2">
        <EditableText contentKey={titleKey} defaultValue={titleDefault} />
      </h4>
      <p className="text-muted-foreground">
        <EditableText contentKey={bodyKey} defaultValue={bodyDefault} multiline />
      </p>
    </div>
  );
}
