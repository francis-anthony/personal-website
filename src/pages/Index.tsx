import RetroHeader from "@/components/retro/RetroHeader";
import RetroHero from "@/components/retro/RetroHero";
import RetroAbout from "@/components/retro/RetroAbout";
import RetroSkills from "@/components/retro/RetroSkills";
import RetroProjects from "@/components/retro/RetroProjects";
import RetroExperience from "@/components/retro/RetroExperience";
import RetroContact from "@/components/retro/RetroContact";
import PixelDivider from "@/components/retro/PixelDivider";
import Starfield from "@/components/effects/Starfield";
import LaserFX from "@/components/effects/LaserFX";
import GalacticaCursor from "@/components/effects/GalacticaCursor";

const Index = () => {
  return (
    <div className="relative min-h-screen text-foreground">
      <Starfield />
      <LaserFX />
      <GalacticaCursor />
      <RetroHeader />
      <main>
        <RetroHero />
        <PixelDivider />
        <RetroAbout />
        <RetroExperience />
        <RetroSkills />
        <RetroProjects />
        <RetroContact />
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p className="font-press">
          © {new Date().getFullYear()} Francis Anthony - Portofolio
        </p>
      </footer>
    </div>
  );
};

export default Index;
