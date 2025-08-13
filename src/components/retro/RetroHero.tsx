import React, { useEffect } from "react";

export default function RetroHero() {
  useEffect(() => {
    document.body.classList.add("cursor-ship");
    return () => document.body.classList.remove("cursor-ship");
  }, []);

  return (
    <section id="home" className="min-h-[80vh] grid place-items-center text-center px-6">
      <div className="animate-enter">
        <h1 className="text-3xl md:text-4xl font-press mb-6">
          Data Engineering Portfolio
        </h1>
        <p className="font-vt text-xl md:text-2xl text-muted-foreground mb-8">
          Monash Graduate • ETL • Data Viz • Pipelines
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="#about" className="font-press text-xs px-4 py-3 rounded-sm pixel-border hover-scale" aria-label="Enter portfolio">
            PRESS START
          </a>
          <a href="#projects" className="font-press text-xs px-4 py-3 rounded-sm border border-border hover-scale">
            VIEW PROJECTS
          </a>
        </div>
        <p className="mt-6 font-vt text-base opacity-80 animate-pulse">Use the spaceship cursor to explore</p>
      </div>
    </section>
  );
}
