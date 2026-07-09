import type { ClientLogo } from '@/types/content';

const PARTNER_LOGOS = [
  'DHL', 'Maersk', 'COSCO', 'DP World', 'Kuehne+Nagel', 'DB Schenker', 'FedEx', 'Amazon',
];

export function TrustedLogos({ clients }: { clients: ClientLogo[] }) {
  const names =
    clients.length >= 8
      ? [...clients.map((c) => c.name), ...clients.map((c) => c.name)]
      : [...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <section className="border-b border-border bg-section-gray py-7">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
          Trusted by 200+ Global Companies
        </p>
        <div className="relative mt-5 overflow-hidden">
          <div className="flex animate-marquee gap-16 whitespace-nowrap">
            {names.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="text-xl font-bold uppercase tracking-wider text-foreground/20"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
