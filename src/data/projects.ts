export type Project = {
  title: string;
  description: string;
  tech: string[];
  link: string;
};

export const projects: Project[] = [
  {
    title: "PostHoc",
    description:
      "A research project on path-finding algorithms that I manage to help develop during summer of 2023d",
    tech: ["React", "UI/UX", "Path-Finding Algorithms"],
    link: "https://posthoc.pathfinding.ai/docs/overview",
  },
  {
    title: "AI and Analytics for Assessments Research",
    description:
      "Conducted statistical and machine learning analyses on SWAN (Students With Additional Needs) assessment data to investigate literacy and thinking skills for students with and without autism.",
    tech: ["R", "RStudio", "Statistical Analysis", "Machine Learning"],
    link: "-",
  },
  {
    title: "MMLA and Dashboard on Student Collaboration Data Research",
    description:
      "Design and implement an end-to-end Multimodal Learning Analytics (MMLA) pipeline that preprocesses and analyses classroom data using machine learning, and delivers actionable collaboration insights through interactive dashboards.",
    tech: [
      "Python",
      "S3",
      "PowerBI",
      "google data studio",
      "Pythorch",
      "Numpy",
      "Pandas",
      "Scikit-learn",
    ],
    link: "-",
  },
  {
    title: "UniHack 2025 – Verum Bias Detection Tool",
    description:
      "Built Verum, a Chrome extension that detects and explains bias in online news using an NLP model (roBERTa-base) and GPT-4 Turbo API. Trained on 20K+ labeled articles, the tool provides real-time bias detection and reasoning. Developed as part of UniHack 2025.",
    tech: [
      "Python",
      "Javascript",
      "GPT-4",
      "roBERTa",
      "WebScrapping",
      "Prompt Engineering",
      "Chrome Extension Development",
    ],
    link: "https://devpost.com/software/verum-54lw1z",
  },
];
