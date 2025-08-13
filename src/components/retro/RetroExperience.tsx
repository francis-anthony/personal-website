import { experience } from "@/data/experience";

export default function RetroExperience() {
  return (
    <section id="experience" className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-press mb-8 text-center">
        Experience Timeline
      </h2>

      <div className="relative max-w-6xl mx-auto">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary via-accent to-muted-foreground h-full rounded-full opacity-60 shadow-lg shadow-primary/20"></div>

        {/* Timeline Items */}
        <div className="space-y-16">
          {experience.map((exp, index) => (
            <div key={exp.company} className="relative">
              {/* Timeline Node */}
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-primary rounded-full border-2 border-background shadow-lg z-10 ${
                  index % 2 === 0 ? "animate-pulse" : "animate-bounce"
                } shadow-primary/50`}
              ></div>

              {/* Card Container */}
              <div
                className={`flex ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div className="w-5/12">
                  <article className="pixel-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer group bg-background/80 backdrop-blur-sm">
                    {/* Company & Role */}
                    <header className="mb-4">
                      <h3 className="font-press text-lg text-primary group-hover:text-accent transition-colors duration-300 group-hover:animate-pulse">
                        {exp.role}
                      </h3>
                      <p className="font-press text-sm text-muted-foreground mt-1 group-hover:text-foreground transition-colors duration-300">
                        {exp.company}
                      </p>
                    </header>

                    {/* Period Badge */}
                    <div className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-md mb-4 border border-accent/30 group-hover:bg-accent/30 transition-all duration-300">
                      <span className="font-press text-xs">{exp.period}</span>
                    </div>

                    {/* Details */}
                    <p className="font-vt text-sm text-muted-foreground leading-relaxed mb-4 group-hover:text-foreground transition-colors duration-300">
                      {exp.details}
                    </p>

                    {/* Technologies */}
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-mono border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Hover Effect Line */}
                    <div
                      className={`absolute top-0 h-1 bg-gradient-to-r from-primary to-accent rounded-t-md transition-all duration-500 ${
                        index % 2 === 0 ? "left-0" : "right-0"
                      } w-0 group-hover:w-full shadow-lg shadow-primary/50`}
                    ></div>

                    {/* Corner Glow Effect */}
                    <div
                      className={`absolute top-0 w-2 h-2 bg-primary/30 rounded-full transition-all duration-300 ${
                        index % 2 === 0 ? "right-2" : "left-2"
                      } opacity-0 group-hover:opacity-100 group-hover:scale-150`}
                    ></div>
                  </article>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Timeline End */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-4 h-4 bg-accent rounded-full border-2 border-background shadow-lg animate-pulse shadow-accent/50"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse ${
                i % 2 === 0 ? "left-1/4" : "right-1/4"
              }`}
              style={{
                top: `${20 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
