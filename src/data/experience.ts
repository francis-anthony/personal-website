export type Experience = {
  company: string;
  role: string;
  period: string;
  details: string;
  technologies?: string[];
};

export const experience: Experience[] = [
  {
    company: "University Projects",
    role: "Data analyst and Research Coursework",
    period: "Feb 2024 - July 2025",
    details:
      "Completed a series of advanced units in data science, analytics, and research, involving end-to-end data processing, analysis, and modelling using Python and R. Gained hands-on experience in data wrangling, exploratory analysis, machine learning, and domain-specific research.",
    technologies: [
      "Python",
      "Pandas",
      "Jupyter",
      "R",
      "ggplot2",
      "dplyr",
      "scikit-learn",
      "NLP techniques",
      "ML-Algorithms",
    ],
  },
  {
    company: "Origin Energy",
    role: "ETL Developer",
    period: "June 2024 - December 2024",
    details:
      "responsible for designing and implementing efficient ETL processes and collaborated closely with business teams to gather requirements, translate them into technical solutions, and deliver accurate reports and insights.",
    technologies: [
      "Python",
      "PostgreSQL",
      "SQL",
      "Tableau",
      "AWS S3",
      "Redshift",
      "In-houseData Engineering Pipelines",
      "Matillion",
      "Excel",
    ],
  },
  {
    company: "PPIA Monash",
    role: "Head of Webmaster",
    period: "Feb 2024 - Oct 2024",
    details:
      "Recruited, Manage and Lead a team to design, develop and maintain a website for PPIA Monash 2023-2024.",
    technologies: ["Figma", "Wordpress", "Hostinger"],
  },
  {
    company: "Monash University",
    role: "Summer Research Associate",
    period: "Nov 2023 - Feb 2024",
    details:
      "Helped develop a web tool for visualizing sequential decision-making algorithms, including various search algorithms. Focused on enhancing the user experience by designing and implementing intuitive UI improvements and documentation.",
    technologies: [
      "React",
      "UI/UX",
      "Path-Finding Algorithms",
      "JSON",
      "Data-Parsing",
      "CSS",
      "HTML",
    ],
  },
];
