import { Mail, Github, Linkedin } from "lucide-react";

export default function RetroContact() {
  return (
    <section id="contact" className="container mx-auto px-6 py-16">
      <h2 className="text-2xl font-press mb-6">Contact</h2>
      <div className="pixel-card p-6 max-w-2xl">
        <p className="font-vt text-lg mb-4">Open to roles in data engineering, analytics engineering, and visualization.</p>
        <div className="flex flex-wrap items-center gap-4">
          <a href="mailto:you@example.com" className="font-press text-xs inline-flex items-center gap-2 px-3 py-2 border border-border rounded-sm hover-scale">
            <Mail size={16} /> EMAIL
          </a>
          <a href="https://github.com/yourname" target="_blank" rel="noreferrer" className="font-press text-xs inline-flex items-center gap-2 px-3 py-2 border border-border rounded-sm hover-scale">
            <Github size={16} /> GITHUB
          </a>
          <a href="https://linkedin.com/in/yourname" target="_blank" rel="noreferrer" className="font-press text-xs inline-flex items-center gap-2 px-3 py-2 border border-border rounded-sm hover-scale">
            <Linkedin size={16} /> LINKEDIN
          </a>
        </div>
      </div>
    </section>
  );
}
