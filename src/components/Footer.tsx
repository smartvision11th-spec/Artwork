import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS } from "@/lib/social";
import { MessageCircle } from "lucide-react";
import { SiFacebook, SiInstagram, SiWhatsapp, SiX } from "react-icons/si";

const SOCIAL_ICONS = [
  { key: "instagram", label: "Instagram", Icon: SiInstagram },
  { key: "facebook", label: "Facebook", Icon: SiFacebook },
  { key: "x", label: "X", Icon: SiX },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-display text-xl font-semibold text-foreground">
              ArtSell
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Curated contemporary art, collected with care.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <Button
              asChild
              variant="outline"
              data-ocid="footer.whatsapp_button"
            >
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" />
                Chat on WhatsApp
              </a>
            </Button>

            <div className="flex items-center gap-3">
              {SOCIAL_ICONS.map(({ key, label, Icon }) => (
                <a
                  key={key}
                  href={SOCIAL_LINKS[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  data-ocid={`footer.social_${key}`}
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t pt-6 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>© {year}. Built for collectors and artists.</p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            data-ocid="footer.attribution_link"
          >
            ArtSell
          </a>
        </div>
      </div>
    </footer>
  );
}
