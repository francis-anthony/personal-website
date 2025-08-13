import { projects } from "@/data/projects";
import { useRef } from "react";

export default function RetroProjects() {
  return (
    <section id="projects" className="container mx-auto px-6 py-12">
      <h2 className="text-2xl font-press mb-6">Projects</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-magnify">
        {projects.map((p) => (
          <TiltCard key={p.title}>
            <a href={p.link} target="_blank" rel="noopener noreferrer" className="block p-4">
              <h3 className="font-press text-sm mb-2">{p.title}</h3>
              <p className="font-vt text-base text-muted-foreground mb-3">{p.description}</p>
              <ul className="flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <li key={t} className="text-xs font-press px-2 py-1 border border-border rounded-sm">{t}</li>
                ))}
              </ul>
            </a>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="pixel-card will-change-transform"
      onMouseMove={(e) => {
        const el = ref.current; if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 6; // subtle tilt
        const rotateY = (x - 0.5) * 6;
        el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      }}
      onMouseLeave={() => {
        const el = ref.current; if (!el) return;
        el.style.transform = "translateY(0)";
      }}
    >
      {children}
    </div>
  );
}
