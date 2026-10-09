import { VIRAAS_WHATSAPP_DISPLAY, whatsappChatUrl, type WhatsAppTopic } from '../lib/whatsapp';

const DEFAULTS: Record<WhatsAppTopic, { title: string; copy: string }> = {
  general: { title: 'Stuck between two looks?', copy: 'Message us on WhatsApp for free styling help.' },
  women: { title: 'Need help choosing her outfit?', copy: 'Message us on WhatsApp and we’ll shortlist women’s festive looks with you.' },
  men: { title: 'Need help choosing his outfit?', copy: 'Message us on WhatsApp and we’ll shortlist men’s festive looks with you.' },
  couple: { title: 'Planning a couple look?', copy: 'Message us on WhatsApp and we’ll coordinate both sides of the look with you.' },
};

/**
 * Inline WhatsApp support CTA. Always a direct chat to the VIRAAS number with a prefilled message
 * — never the contact-picker/share screen.
 */
export default function WhatsAppHelp({ topic, title, copy, className }: {
  topic: WhatsAppTopic;
  title?: string;
  copy?: string;
  className?: string;
}) {
  const d = DEFAULTS[topic];
  return (
    <section className={`wa-band wa-band-inline${className ? ` ${className}` : ''}`} data-whatsapp-help={topic}>
      <div>
        <h2>{title ?? d.title}</h2>
        <p>{copy ?? d.copy}</p>
      </div>
      <a
        className="btn btn-light"
        href={whatsappChatUrl(topic)}
        target="_blank"
        rel="noopener noreferrer"
        data-whatsapp-topic={topic}
      >
        Chat on WhatsApp · {VIRAAS_WHATSAPP_DISPLAY}
      </a>
    </section>
  );
}
