import { skills } from "@/data/skills";
import { useEffect, useRef, useState } from "react";

export default function RetroSkills() {
  const [typedSkills, setTypedSkills] = useState<string[]>([]);
  const [typedCapabilities, setTypedCapabilities] = useState<string[]>([]);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentCapabilityIndex, setCurrentCapabilityIndex] = useState(0);
  const [currentCapabilityCharIndex, setCurrentCapabilityCharIndex] =
    useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isTypingCapability, setIsTypingCapability] = useState(false);
  const spaceshipRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Hover typing states
  const [hoverTypingStates, setHoverTypingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [hoverTypedText, setHoverTypedText] = useState<{
    [key: string]: string;
  }>({});
  const [hoverTypingIndex, setHoverTypingIndex] = useState<{
    [key: string]: number;
  }>({});

  // Console typing effect for skill names
  useEffect(() => {
    if (!isTyping || currentSkillIndex >= skills.length) return;

    const skill = skills[currentSkillIndex];
    if (currentCharIndex < skill.name.length) {
      const timer = setTimeout(() => {
        setTypedSkills((prev) => {
          const newSkills = [...prev];
          if (!newSkills[currentSkillIndex]) {
            newSkills[currentSkillIndex] = "";
          }
          newSkills[currentSkillIndex] = skill.name.slice(
            0,
            currentCharIndex + 1
          );
          return newSkills;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, 100); // Typing speed

      return () => clearTimeout(timer);
    } else {
      // Move to next skill
      setTimeout(() => {
        setCurrentSkillIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 300); // Pause between skills
    }
  }, [currentSkillIndex, currentCharIndex, isTyping]);

  // Stop typing when all skills are done
  useEffect(() => {
    if (currentSkillIndex >= skills.length) {
      setIsTyping(false);
    }
  }, [currentSkillIndex]);

  // Console typing effect for capabilities
  useEffect(() => {
    if (!isTypingCapability || currentCapabilityIndex >= skills.length) return;

    const skill = skills[currentCapabilityIndex];
    const capabilityText = getCapabilityText(skill.name);

    if (currentCapabilityCharIndex < capabilityText.length) {
      const timer = setTimeout(() => {
        setTypedCapabilities((prev) => {
          const newCapabilities = [...prev];
          if (!newCapabilities[currentCapabilityIndex]) {
            newCapabilities[currentCapabilityIndex] = "";
          }
          newCapabilities[currentCapabilityIndex] = capabilityText.slice(
            0,
            currentCapabilityCharIndex + 1
          );
          return newCapabilities;
        });
        setCurrentCapabilityCharIndex((prev) => prev + 1);
      }, 50); // Faster typing for capabilities

      return () => clearTimeout(timer);
    } else {
      // Move to next capability
      setTimeout(() => {
        setCurrentCapabilityIndex((prev) => prev + 1);
        setCurrentCapabilityCharIndex(0);
      }, 200); // Shorter pause between capabilities
    }
  }, [currentCapabilityIndex, currentCapabilityCharIndex, isTypingCapability]);

  // Start typing capabilities after skills are done
  useEffect(() => {
    if (!isTyping && !isTypingCapability) {
      setIsTypingCapability(true);
    }
  }, [isTyping, isTypingCapability]);

  // Stop typing capabilities when all are done
  useEffect(() => {
    if (currentCapabilityIndex >= skills.length) {
      setIsTypingCapability(false);
    }
  }, [currentCapabilityIndex]);

  // Fast hover typing effect
  useEffect(() => {
    Object.keys(hoverTypingStates).forEach((skillName) => {
      if (hoverTypingStates[skillName]) {
        const capabilityText = getCapabilityText(skillName);
        const currentIndex = hoverTypingIndex[skillName] || 0;

        if (currentIndex < capabilityText.length) {
          const timer = setTimeout(() => {
            setHoverTypedText((prev) => ({
              ...prev,
              [skillName]: capabilityText.slice(0, currentIndex + 1),
            }));
            setHoverTypingIndex((prev) => ({
              ...prev,
              [skillName]: currentIndex + 1,
            }));
          }, 25); // Very fast typing for hover effect

          return () => clearTimeout(timer);
        } else {
          // Stop typing for this skill
          setHoverTypingStates((prev) => ({
            ...prev,
            [skillName]: false,
          }));
        }
      }
    });
  }, [hoverTypingStates, hoverTypingIndex]);

  // Get capability text for each skill
  const getCapabilityText = (skillName: string): string => {
    const skill = skills.find((s) => s.name === skillName);
    return skill ? skill.capabilities : "";
  };

  // Sound effect for hover
  const playHoverSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      const audioCtx = audioContextRef.current;

      // Resume audio context if suspended
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      const t = audioCtx.currentTime;
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, t);
      oscillator.frequency.exponentialRampToValueAtTime(600, t + 0.1);

      gainNode.gain.setValueAtTime(0.15, t); // Increased volume slightly
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      oscillator.connect(gainNode).connect(audioCtx.destination);
      oscillator.start(t);
      oscillator.stop(t + 0.16);
    } catch (error) {
      // Silently fail if audio context is not available
      console.log("Audio context error:", error);
    }
  };

  // Spaceship hover effect with fast typing
  const handleSkillHover = (skillName: string, event: React.MouseEvent) => {
    setHoveredSkill(skillName);
    playHoverSound();

    // Start fast hover typing
    setHoverTypingStates((prev) => ({ ...prev, [skillName]: true }));
    setHoverTypedText((prev) => ({ ...prev, [skillName]: "" }));
    setHoverTypingIndex((prev) => ({ ...prev, [skillName]: 0 }));

    if (spaceshipRef.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      spaceshipRef.current.style.left = `${x}px`;
      spaceshipRef.current.style.top = `${y}px`;
      spaceshipRef.current.style.opacity = "1";
      spaceshipRef.current.style.transform = "translate(-50%, -50%) scale(1)";
    }
  };

  const handleSkillLeave = () => {
    setHoveredSkill(null);

    // Stop hover typing
    if (hoveredSkill) {
      setHoverTypingStates((prev) => ({ ...prev, [hoveredSkill]: false }));
    }

    if (spaceshipRef.current) {
      spaceshipRef.current.style.opacity = "0";
      spaceshipRef.current.style.transform = "translate(-50%, -50%) scale(0.8)";
    }
  };

  return (
    <section id="skills" className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-press mb-8">Skills</h2>

      {/* Spaceship cursor */}
      <div
        ref={spaceshipRef}
        className="fixed w-8 h-8 z-[9999] pointer-events-none transition-all duration-300 ease-out opacity-0 transform -translate-x-1/2 -translate-y-1/2 scale-75"
        style={{
          backgroundImage: "url('/src/assets/spaceship-cursor.png')",
          backgroundSize: "32px 32px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      <div className="grid md:grid-cols-2 gap-8">
        {skills.map((s, index) => (
          <div
            key={s.name}
            className={`pixel-card p-6 transition-all duration-300 cursor-pointer ${
              hoveredSkill === s.name
                ? "scale-105 shadow-lg border-primary"
                : "hover:scale-102"
            }`}
            onMouseEnter={(e) => handleSkillHover(s.name, e)}
            onMouseLeave={handleSkillLeave}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-press text-base font-mono">
                {typedSkills[index] || ""}
                {isTyping &&
                  currentSkillIndex === index &&
                  currentCharIndex < s.name.length && (
                    <span className="animate-pulse">|</span>
                  )}
              </span>
              <span className="font-press text-sm text-muted-foreground">
                {hoveredSkill === s.name ? "ACTIVE" : "READY"}
              </span>
            </div>

            {/* Skill description with fast hover typing effect */}
            <div className="text-sm text-muted-foreground font-vt leading-relaxed min-h-[3rem]">
              {hoveredSkill === s.name ? (
                <span className="text-primary font-mono">
                  {hoverTypedText[s.name] || ""}
                  {hoverTypingStates[s.name] && (
                    <span className="animate-pulse">|</span>
                  )}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  {typedCapabilities[index] || "Hover to explore capabilities"}
                  {isTypingCapability &&
                    currentCapabilityIndex === index &&
                    currentCapabilityCharIndex <
                      getCapabilityText(s.name).length && (
                      <span className="animate-pulse">|</span>
                    )}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
