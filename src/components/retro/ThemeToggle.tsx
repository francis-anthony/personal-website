import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-press tracking-tight hover-scale pixel-border"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span>{isDark ? "LIGHT" : "DARK"}</span>
    </button>
  );
}
