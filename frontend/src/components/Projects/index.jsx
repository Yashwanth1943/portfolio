import React, { memo, useState, useCallback } from "react";
import {
  FaReact,
  FaWallet,
  FaClipboardList,
  FaHeartbeat,
  FaBriefcase,
  FaShoppingCart,
  FaChartBar,
  FaUtensils
} from "react-icons/fa";
import "./index.scss";

const projects = [
  {
    id: "portfolio-website",
    num: "01",
    title: "Personal Portfolio Website",
    desc: "A responsive portfolio website built with React, showcasing projects, skills, and contact information with smooth animations and modern design.",
    tech: ["React", "GSAP", "SCSS"],
    demo: "https://yashwanthkosuri.in",
    code: "https://github.com/Yashwanth1943/portfolio.git",
    themeClass: "theme-purple-blue",
    icon: FaReact,
    iconColor: "#a78bfa",
  },
  {
    id: "expense-tracker",
    num: "02",
    title: "Expense Tracker App",
    desc: "A user-friendly expense tracker with features to add, edit, and delete expenses, along with real-time data visualization.",
    tech: ["React", "LocalStorage", "CSS"],
    demo: "https://bellcorp-expense-tracker-frontend.vercel.app/",
    code: "https://github.com/Yashwanth1943/bellcorp-expense-tracker-frontend.git",
    themeClass: "theme-emerald-cyan",
    icon: FaWallet,
    iconColor: "#34d399",
  },
  {
    id: "todo-app-codex",
    num: "03",
    title: "Todo Application",
    desc: "Built with Codex – full CRUD operations, localStorage persistence, and a faster AI-assisted development workflow.",
    tech: ["Codex", "React", "LocalStorage", "CSS"],
    demo: "https://todo-three-cyan-30.vercel.app/",
    code: "https://github.com/Yashwanth1943/todo.git",
    themeClass: "theme-orange-red",
    icon: FaClipboardList,
    iconColor: "#f43f5e",
  },
  {
    id: "nirog-gyan",
    num: "04",
    title: "Nirog Gyan – Health Platform",
    desc: "React-based health information platform providing health resources and awareness content with clean UI and responsive design.",
    tech: ["React", "REST API"],
    demo: "https://nirog-gyan-alpha.vercel.app/",
    code: "https://github.com/Yashwanth1943/nirogGyan.git",
    themeClass: "theme-pink-violet",
    icon: FaHeartbeat,
    iconColor: "#ec4899",
  },
  {
    id: "jobby-app",
    num: "05",
    title: "Jobby App",
    desc: "A full-featured job search application with JWT authentication, job listings, search filters, and detailed job descriptions.",
    tech: ["React", "React Router", "REST API", "CSS"],
    demo: "https://jobbyapp1234.ccbp.tech/",
    code: "https://github.com/Yashwanth1943/jobby-app.git",
    themeClass: "theme-teal-blue",
    icon: FaBriefcase,
    iconColor: "#22d3ee",
  },
  {
    id: "nxt-trendz",
    num: "06",
    title: "Nxt Trendz – E-commerce",
    desc: "An e-commerce website clone with login authentication, product listings, cart management, and a fully responsive UI.",
    tech: ["React", "React Router", "JWT Auth", "CSS"],
    demo: "https://yashnexttrendz.ccbp.tech/login",
    code: "https://github.com/Yashwanth1943/Nxt-Trendz.git",
    themeClass: "theme-gold-orange",
    icon: FaShoppingCart,
    iconColor: "#fbbf24",
  },
  {
    id: "covid-dashboard",
    num: "07",
    title: "COVID-19 Dashboard",
    desc: "Interactive dashboard to track COVID-19 statistics with dynamic charts, state-wise data breakdown, and live API integration.",
    tech: ["React", "REST API", "CSS"],
    demo: "https://dashbordcovid.ccbp.tech/",
    code: "https://github.com/Yashwanth1943/covid-dashboard.git",
    themeClass: "theme-blue-indigo",
    icon: FaChartBar,
    iconColor: "#818cf8",
  },
  {
    id: "uno-restaurant",
    num: "08",
    title: "UNO Restaurant Website",
    desc: "A responsive restaurant website featuring a stylish menu layout, daily specials, and contact details with an attractive design.",
    tech: ["HTML", "CSS", "JavaScript"],
    demo: "https://yashrestaurant.ccbp.tech/",
    code: "https://github.com/Yashwanth1943/Restaurant-App.git",
    themeClass: "theme-red-amber",
    icon: FaUtensils,
    iconColor: "#f59e0b",
  },
];

const ProjectRow = memo(({ project, isExpanded, onToggle }) => {
  const IconComponent = project.icon;

  return (
    <div
      className={`project-list-row ${project.themeClass} ${isExpanded ? "is-expanded" : ""}`}
      onClick={() => onToggle(project.id)}
    >
      <div className="project-row-header">
        <div className="project-row-left">
          <span className="project-row-num">{project.num}</span>
          <div className="project-row-icon-wrapper" style={{ color: project.iconColor }}>
            <IconComponent className="project-row-icon" />
          </div>
          <h3 className="project-row-title">{project.title}</h3>
        </div>
        
        <div className="project-row-right">
          <div className="project-row-tech">
            {project.tech.map((t) => (
              <span key={t} className="tech-pill-small">
                {t}
              </span>
            ))}
          </div>
          <span className="project-row-arrow">→</span>
        </div>
      </div>

      <div className="project-list-row-details">
        <div className="project-details-inner">
          <p className="project-row-desc">{project.desc}</p>
          <div className="project-row-actions" onClick={(e) => e.stopPropagation()}>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="compact-btn btn-primary"
            >
              Live Demo
            </a>
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="compact-btn btn-secondary"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectRow.displayName = "ProjectRow";

export default function Projects() {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="projects-minimal-wrapper">
      <h1 className="projects-minimal-heading">My Work</h1>

      <div className="projects-list-container">
        {projects.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            isExpanded={expandedId === project.id}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}
