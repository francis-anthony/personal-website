import { experience } from "@/data/experience";

export default function RetroExperience() {
  return (
    <section id="experience" className="container mx-auto px-6 py-12">
      <h2 className="text-2xl font-press mb-6">Experience</h2>
      <div className="space-y-4">
        {experience.map((e) => (
          <article key={e.company} className="pixel-card p-4">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
              <h3 className="font-press text-sm">{e.role} — {e.company}</h3>
              <span className="font-press text-xs text-muted-foreground">{e.period}</span>
            </header>
            <p className="font-vt text-base text-muted-foreground">{e.details}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
