// Single source of truth for VIRAAS WhatsApp support links.
//
// Every CTA in the product (floating button, inline help bars, contact page) must open a DIRECT
// chat with the VIRAAS business number. `https://wa.me/<number>?text=...` does that; the
// numberless `https://wa.me/?text=...` form drops the visitor on WhatsApp's contact-picker /
// share sheet instead, which is wrong for a support CTA.
//
// The look-sharing action is deliberately NOT part of this module: sharing a saved look is meant
// to go to whoever the visitor chooses (see `whatsappUrl` in `src/lib/saved.ts`).
export const VIRAAS_WHATSAPP_NUMBER = '919644424865'; // +91 96444 24865
export const VIRAAS_WHATSAPP_DISPLAY = '+91 96444 24865';

export type WhatsAppTopic = 'general' | 'women' | 'men' | 'couple';

/** Prefilled first message per entry point, so the visitor lands in a chat that already makes sense. */
export const WHATSAPP_MESSAGES: Record<WhatsAppTopic, string> = {
  general: 'Hi VIRAAS, I need help finding a festive look.',
  women: 'Hi VIRAAS, I need help choosing a women’s festive outfit — lehenga, chaniya choli or saree.',
  men: 'Hi VIRAAS, I need help choosing a men’s festive outfit — kurta set, ethnic shirt or festive separates.',
  couple: 'Hi VIRAAS, I need help styling a couple festive look for the same occasion.',
};

/** Direct chat link to +91 96444 24865 with a relevant prefilled message. */
export const whatsappChatUrl = (topic: WhatsAppTopic = 'general'): string =>
  `https://wa.me/${VIRAAS_WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES[topic])}`;

/**
 * Maps a pathname onto the most relevant support topic, used by the site-wide floating button so
 * `/women`, `/men` and the Couple Edit get their own prefilled message instead of the generic one.
 */
export const whatsAppTopicForPath = (pathname: string): WhatsAppTopic => {
  if (/^\/women(-look)?(\/|$)/.test(pathname)) return 'women';
  if (/^\/men(-look)?(\/|$)/.test(pathname)) return 'men';
  if (/^\/couple-edit(\/|$)/.test(pathname)) return 'couple';
  return 'general';
};
