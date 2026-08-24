import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS } from "@/lib/social";
import { MessageCircle } from "lucide-react";

export default function ArtistSection() {
  return (
    <section id="about" className="border-t bg-card" data-ocid="artist.section">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-24">
        <div className="order-2 md:order-1">
          <div className="overflow-hidden rounded-none border bg-background">
            <img
              src="/assets/generated/artist-portrait.dim_800x800.jpg"
              alt="Portrait of the artist in their studio"
              className="aspect-square w-full object-cover"
              data-ocid="artist.image"
            />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            About the Artist
          </p>
          <h2 className="mt-5 font-display text-3xl font-medium leading-tight text-balance text-foreground sm:text-4xl">
            A studio practice rooted in light, texture, and quiet emotion.
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              ArtSell began as a single studio and a belief that great art
              should be accessible — not hidden behind gallery doors. Today we
              represent a small, hand-picked circle of contemporary artists
              whose work speaks to the way we live now.
            </p>
            <p>
              Every piece we offer is original, authenticated, and priced
              transparently. We work directly with our artists so collectors
              know exactly where their work comes from and where their support
              goes.
            </p>
          </div>
          <div className="mt-8">
            <Button
              asChild
              variant="outline"
              data-ocid="artist.whatsapp_button"
            >
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" />
                Chat with us on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
