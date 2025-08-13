import { skills } from "@/data/skills";

export default function RetroSkills() {
  return (
    <section id="skills" className="container mx-auto px-6 py-12">
      <h2 className="text-2xl font-press mb-6">Skills</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((s) => (
          <div key={s.name} className="pixel-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-press text-xs">{s.name}</span>
              <span className="font-press text-xs">LV {s.level}</span>
            </div>
            <div className="h-3 bg-muted rounded-sm overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${s.level}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
