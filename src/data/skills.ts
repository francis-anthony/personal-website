export type Skill = {
  name: string;
  capabilities: string;
};

export const skills: Skill[] = [
  {
    name: "Programming Languages",
    capabilities: "Python, Java, Javascript, Typescript, C, R, HTML, CSS",
  },
  {
    name: "ETL/ELT (Extract, Transform, Load)",
    capabilities:
      " PostgreSQL, SQL, Datawarehouse, Amazon Redshift, Amazon S3, Matillion, GCP",
  },
  {
    name: "Data Visualization",
    capabilities: "Tableau, Power BI, Excel, Powerpoint, Google Sheets",
  },
  {
    name: "Web Development",
    capabilities:
      "MEAN stack (MongoDB, Express, Angular, Node.js), React, Vite, Tailwind CSS, Shadcn UI, Framer Motion, Framer",
  },
  {
    name: "Version Control",
    capabilities: "Github, Gitlab, BitBucket",
  },
];
