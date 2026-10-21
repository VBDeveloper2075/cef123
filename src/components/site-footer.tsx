import { REDES } from "@/lib/constants";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4V10c0-.6.4-1 1-1Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
      <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM9.8 15.5V8.9l6.2 3.3-6.2 3.3Z" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
      <path d="M12.04 2C6.5 2 2 6.4 2 11.85c0 1.9.55 3.7 1.5 5.25L2 22l5.05-1.45A10.1 10.1 0 0 0 12.04 22C17.58 22 22 17.55 22 12.1 22 6.4 17.58 2 12.04 2Zm5.8 14.35c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.13.1-1.83-.11-.42-.13-.97-.32-1.67-.62-2.94-1.27-4.85-4.22-5-4.41-.14-.2-1.17-1.56-1.17-2.97 0-1.4.73-2.09 1-2.37.24-.26.64-.38.86-.38h.62c.2 0 .47-.08.73.55.27.68.9 2.35.98 2.52.08.17.13.37.02.6-.1.22-.16.36-.32.55-.16.2-.33.44-.47.59-.16.17-.32.35-.14.68.18.32.8 1.32 1.72 2.14 1.18 1.05 2.17 1.38 2.5 1.54.32.16.51.13.7-.08.18-.22.8-.93 1.02-1.25.21-.32.43-.26.73-.16.3.1 1.9.9 2.23 1.06.32.16.54.24.62.38.08.13.08.77-.16 1.45Z" />
    </svg>
  );
}

const ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  whatsapp: WhatsappIcon,
};

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#1A3D8F]/15 bg-[#1A3D8F] text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
        <p className="text-center text-sm text-white/80">
          CEF N.º 123 Caseros — Inscripción digital
        </p>
        <nav aria-label="Redes sociales" className="flex items-center gap-3">
          {REDES.map((red) => {
            const Icon = ICONS[red.id];
            return (
              <a
                key={red.id}
                href={red.href}
                target={red.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={red.label}
                className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#C8102E]"
              >
                <Icon />
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
