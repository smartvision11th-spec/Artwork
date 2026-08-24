export const SOCIAL_LINKS = {
  whatsapp: "https://wa.me/15551234567",
  instagram: "https://instagram.com/artsell.gallery",
  facebook: "https://facebook.com/artsell.gallery",
  x: "https://x.com/artsell_gallery",
} as const;

export type SocialKey = keyof typeof SOCIAL_LINKS;
