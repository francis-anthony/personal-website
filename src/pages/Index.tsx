import RetroHeader from "@/components/retro/RetroHeader";
import RetroHero from "@/components/retro/RetroHero";
import RetroAbout from "@/components/retro/RetroAbout";
import RetroSkills from "@/components/retro/RetroSkills";
import RetroProjects from "@/components/retro/RetroProjects";
import RetroExperience from "@/components/retro/RetroExperience";
import RetroContact from "@/components/retro/RetroContact";
import PixelDivider from "@/components/retro/PixelDivider";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <RetroHeader />
      <main>
        <RetroHero />
        <PixelDivider />
        <RetroAbout />
        <RetroSkills />
        <RetroProjects />
        <RetroExperience />
        <RetroContact />
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p className="font-press">© {new Date().getFullYear()} Monash Data Engineering Graduate</p>
      </footer>
    </div>
  );
};

export default Index;
