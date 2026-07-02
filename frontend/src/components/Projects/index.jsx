import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    title: "Personal Portfolio Website",
    desc: "A responsive portfolio website built with React, showcasing projects, skills, and contact information with smooth animations and modern design.",
    tech: ["React", "GSAP", "SCSS"],
    demo: "https://portofolio-neon-six.vercel.app",
    code: "https://github.com/Yashwanth1943/Portofolio.git",
    themeClass: "theme-purple-blue",
    hoverColors: ["rgba(167, 139, 250, 0.4)", "rgba(56, 189, 248, 0.2)"],
    icon: FaReact,
    iconColor: "#61dafb",
    imageHeight: "220px",
  },
  {
    id: "expense-tracker",
    title: "Expense Tracker App",
    desc: "A user-friendly expense tracker with features to add, edit, and delete expenses, along with real-time data visualization.",
    tech: ["React", "LocalStorage", "CSS"],
    demo: "https://bellcorp-expense-tracker-frontend.vercel.app/",
    code: "https://github.com/Yashwanth1943/bellcorp-expense-tracker-frontend.git",
    themeClass: "theme-emerald-cyan",
    hoverColors: ["rgba(52, 211, 153, 0.4)", "rgba(6, 182, 212, 0.2)"],
    icon: FaWallet,
    iconColor: "#34d399",
    imageHeight: "280px",
  },
  {
    id: "todo-app-codex",
    title: "Todo Application",
    desc: "Built with Codex – full CRUD operations, localStorage persistence, and a faster AI-assisted development workflow.",
    tech: ["Codex", "React", "LocalStorage", "CSS"],
    demo: "https://todo-three-cyan-30.vercel.app/",
    code: "https://github.com/Yashwanth1943/todo.git",
    themeClass: "theme-orange-red",
    hoverColors: ["rgba(249, 115, 22, 0.4)", "rgba(244, 63, 94, 0.2)"],
    icon: FaClipboardList,
    iconColor: "#f43f5e",
    imageHeight: "200px",
  },
  {
    id: "nirog-gyan",
    title: "Nirog Gyan – Health Platform",
    desc: "React-based health information platform providing health resources and awareness content with clean UI and responsive design.",
    tech: ["React", "REST API"],
    demo: "https://nirog-gyan-alpha.vercel.app/",
    code: "https://github.com/Yashwanth1943/nirogGyan.git",
    themeClass: "theme-pink-violet",
    hoverColors: ["rgba(236, 72, 153, 0.4)", "rgba(167, 139, 250, 0.2)"],
    icon: FaHeartbeat,
    iconColor: "#ec4899",
    imageHeight: "260px",
  },
  {
    id: "jobby-app",
    title: "Jobby App",
    desc: "A full-featured job search application with JWT authentication, job listings, search filters, and detailed job descriptions.",
    tech: ["React", "React Router", "REST API", "CSS"],
    demo: "https://jobbyapp1234.ccbp.tech/",
    code: "https://github.com/Yashwanth1943/jobby-app.git",
    themeClass: "theme-teal-blue",
    hoverColors: ["rgba(20, 184, 166, 0.4)", "rgba(59, 130, 246, 0.2)"],
    icon: FaBriefcase,
    iconColor: "#22d3ee",
    imageHeight: "240px",
  },
  {
    id: "nxt-trendz",
    title: "Nxt Trendz – E-commerce",
    desc: "An e-commerce website clone with login authentication, product listings, cart management, and a fully responsive UI.",
    tech: ["React", "React Router", "JWT Auth", "CSS"],
    demo: "https://yashnexttrendz.ccbp.tech/login",
    code: "https://github.com/Yashwanth1943/Nxt-Trendz.git",
    themeClass: "theme-gold-orange",
    hoverColors: ["rgba(245, 158, 11, 0.4)", "rgba(234, 88, 12, 0.2)"],
    icon: FaShoppingCart,
    iconColor: "#fbbf24",
    imageHeight: "275px",
  },
  {
    id: "covid-dashboard",
    title: "COVID-19 Dashboard",
    desc: "Interactive dashboard to track COVID-19 statistics with dynamic charts, state-wise data breakdown, and live API integration.",
    tech: ["React", "REST API", "CSS"],
    demo: "https://dashbordcovid.ccbp.tech/",
    code: "https://github.com/Yashwanth1943/covid-dashboard.git",
    themeClass: "theme-blue-indigo",
    hoverColors: ["rgba(59, 130, 246, 0.4)", "rgba(99, 102, 241, 0.2)"],
    icon: FaChartBar,
    iconColor: "#818cf8",
    imageHeight: "220px",
  },
  {
    id: "uno-restaurant",
    title: "UNO Restaurant Website",
    desc: "A responsive restaurant website featuring a stylish menu layout, daily specials, and contact details with an attractive design.",
    tech: ["HTML", "CSS", "JavaScript"],
    demo: "https://yashrestaurant.ccbp.tech/",
    code: "https://github.com/Yashwanth1943/Restaurant-App.git",
    themeClass: "theme-red-amber",
    hoverColors: ["rgba(239, 68, 68, 0.4)", "rgba(245, 158, 11, 0.2)"],
    icon: FaUtensils,
    iconColor: "#f59e0b",
    imageHeight: "290px",
  },
];

const ProjectCard = ({ project }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }
  };

  const IconComponent = project.icon;

  return (
    <motion.div
      className="proj-card"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      whileHover={{
        scale: 1.03,
        y: -6,
        transition: { type: "spring", stiffness: 350, damping: 22 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { type: "spring", stiffness: 450, damping: 18 }
      }}
      style={{
        "--mouse-x": `${mousePos.x}px`,
        "--mouse-y": `${mousePos.y}px`,
        "--hover-color1": project.hoverColors[0],
        "--hover-color2": project.hoverColors[1],
      }}
    >
      <div className={`proj-card__preview ${project.themeClass}`} style={{ height: project.imageHeight }}>
        {/* Continuous organic moving mesh background */}
        <div className="proj-card__mesh-bg" />
        {/* Dynamic cursor-following liquid ink ripple glow */}
        <div className="proj-card__hover-glow" />
        
        {/* Centered Floating Tech Badge */}
        <div className="proj-card__logo-container">
          <div className="proj-card__logo-badge">
            <IconComponent className="proj-card__logo-icon" style={{ color: project.iconColor }} />
          </div>
        </div>
      </div>

      <div className="proj-card__content">
        <h2 className="proj-card__title">{project.title}</h2>
        <p className="proj-card__desc">{project.desc}</p>
        
        <div className="proj-card__pills">
          {project.tech.map((t) => (
            <span key={t} className="tech-pill">
              {t}
            </span>
          ))}
        </div>

        <div className="proj-card__links">
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Live Demo
          </a>
          <a
            href={project.code}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            GitHub
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const [columnsCount, setColumnsCount] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setColumnsCount(1);
      } else if (w < 1024) {
        setColumnsCount(2);
      } else if (w < 1440) {
        setColumnsCount(3);
      } else {
        setColumnsCount(4);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Split project items into column arrays
  const columns = Array.from({ length: columnsCount }, () => []);
  projects.forEach((project, idx) => {
    columns[idx % columnsCount].push(project);
  });

  return (
    <div className="projects-section-wrapper">
      <h1 className="projects-heading">My Work</h1>

      <div className="projects-marquee-container">
        <div className="projects-marquee-grid">
          {columns.map((column, colIdx) => {
            // Duplicate columns to ensure seamless infinite loops
            const loopItems = [...column, ...column];
            return (
              <div key={colIdx} className={`marquee-column col-${colIdx}`}>
                <div className="marquee-column-inner">
                  {loopItems.map((project, itemIdx) => (
                    <ProjectCard key={`${project.id}-${itemIdx}`} project={project} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
