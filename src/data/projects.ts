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
    title: "Data Viz Dashboard",
    description: "Interactive charts and KPIs with responsive drill-downs.",
    tech: ["React", "D3", "Supabase"],
    link: "https://github.com/yourname/data-viz",
  },
  {
    title: "Batch Orchestrations",
    description: "Reliable batch jobs with lineage and retries.",
    tech: ["Airflow", "Python", "S3"],
    link: "https://github.com/yourname/batch-orchestration",
  },
];
