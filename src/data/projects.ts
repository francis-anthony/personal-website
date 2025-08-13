export type Project = {
  title: string;
  description: string;
  tech: string[];
  link: string;
};

export const projects: Project[] = [
  {
    title: "Real-time ETL Pipeline",
    description: "Streaming ingestion with CDC, transforms, and warehouse sync.",
    tech: ["Kafka", "Flink", "dbt", "Postgres"],
    link: "https://github.com/yourname/etl-pipeline"
  },
  {
    title: "Data Viz Dashboard",
    description: "Interactive charts and KPIs with responsive drill-downs.",
    tech: ["React", "D3", "Supabase"],
    link: "https://github.com/yourname/data-viz"
  },
  {
    title: "Batch Orchestrations",
    description: "Reliable batch jobs with lineage and retries.",
    tech: ["Airflow", "Python", "S3"],
    link: "https://github.com/yourname/batch-orchestration"
  }
];
