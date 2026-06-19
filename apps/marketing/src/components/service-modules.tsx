import { ScrollReveal } from './scroll-reveal';

interface ServiceModulesProps {
  modules: { number: string; title: string; body: string }[];
}

export function ServiceModules({ modules }: ServiceModulesProps) {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        {modules.map((mod, i) => (
          <ScrollReveal key={mod.number} delay={i * 0.1}>
            <div className="mb-16 border-t border-border pt-12 last:mb-0">
              <p className="text-sm font-medium uppercase tracking-widest text-brand">
                Module {mod.number}
              </p>
              <h3 className="mt-4 text-3xl font-medium tracking-tight text-foreground">{mod.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-muted">{mod.body}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
