import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaHtml5,
  FaCss3Alt,
  FaBootstrap,
  FaGitAlt,
} from 'react-icons/fa';
import {
  SiJavascript,
  SiMongodb,
  SiSqlite,
  SiExpress,
  SiTailwindcss,
} from 'react-icons/si';
import './index.scss';

gsap.registerPlugin(ScrollTrigger);

const skillsList = [
  { name: "React", category: "Frontend", level: "Advanced", icon: <FaReact />, desc: "A JavaScript library for building component-based user interfaces." },
  { name: "JavaScript", category: "Languages", level: "Advanced", icon: <SiJavascript />, desc: "Lightweight, interpreted programming language for dynamic web interactivity." },
  { name: "Node.js", category: "Backend", level: "Advanced", icon: <FaNodeJs />, desc: "JavaScript runtime environment built on Chrome's V8 engine." },
  { name: "Express", category: "Backend", level: "Advanced", icon: <SiExpress />, desc: "Minimalist and flexible web application framework for Node.js backends." },
  { name: "MongoDB", category: "Database", level: "Intermediate", icon: <SiMongodb />, desc: "NoSQL document database storing application data in JSON-like format." },
  { name: "SQLite", category: "Database", level: "Intermediate", icon: <SiSqlite />, desc: "Self-contained, serverless, zero-configuration SQL database engine." },
  { name: "Python", category: "Languages", level: "Intermediate", icon: <FaPython />, desc: "Versatile, high-level programming language known for readability and clean syntax." },
  { name: "HTML5", category: "Frontend", level: "Advanced", icon: <FaHtml5 />, desc: "The core structure and markup language of the World Wide Web." },
  { name: "CSS3", category: "Frontend", level: "Advanced", icon: <FaCss3Alt />, desc: "Cascading stylesheets used to create modern visual design and presentation." },
  { name: "Bootstrap", category: "Frontend", level: "Advanced", icon: <FaBootstrap />, desc: "Popular responsive CSS framework for mobile-first web designs." },
  { name: "Tailwind CSS", category: "Frontend", level: "Advanced", icon: <SiTailwindcss />, desc: "Utility-first CSS framework for rapid and responsive UI layouts." },
  { name: "Git", category: "Tools", level: "Advanced", icon: <FaGitAlt />, desc: "Distributed version control system to track changes in source code." },
];

const categories = ["All", "Languages", "Frontend", "Backend", "Database", "Tools"];

const categoryColors = {
  Languages: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.22)",
    shadow: "rgba(245, 158, 11, 0.15)",
  },
  Frontend: {
    color: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.08)",
    border: "rgba(56, 189, 248, 0.22)",
    shadow: "rgba(56, 189, 248, 0.15)",
  },
  Backend: {
    color: "#34d399",
    bg: "rgba(52, 211, 153, 0.08)",
    border: "rgba(52, 211, 153, 0.22)",
    shadow: "rgba(52, 211, 153, 0.15)",
  },
  Database: {
    color: "#fb7185",
    bg: "rgba(251, 113, 133, 0.08)",
    border: "rgba(251, 113, 133, 0.22)",
    shadow: "rgba(251, 113, 133, 0.15)",
  },
  Tools: {
    color: "#c084fc",
    bg: "rgba(192, 132, 252, 0.08)",
    border: "rgba(192, 132, 252, 0.22)",
    shadow: "rgba(192, 132, 252, 0.15)",
  },
};

const SkillCard = memo(({ skill, isExpanded, onClick, alwaysShowDesc }) => {
  const colors = categoryColors[skill.category] || categoryColors.Tools;
  const [isHovered, setIsHovered] = useState(false);

  const showDetails = alwaysShowDesc || isExpanded || isHovered;

  const handleClick = () => {
    if (!alwaysShowDesc) {
      onClick(skill.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ 
        y: -6,
        scale: 1.03,
        borderColor: colors.color,
        boxShadow: `0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${colors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
      }}
      transition={{
        layout: { type: "spring", stiffness: 200, damping: 20 },
        scale: { duration: 0.2, ease: "easeOut" },
        y: { duration: 0.2, ease: "easeOut" },
        borderColor: { duration: 0.2 },
        boxShadow: { duration: 0.2 }
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`skill-card-new ${showDetails ? 'expanded' : ''}`}
      style={{
        "--accent-color": colors.color,
        "--accent-bg": colors.bg,
        "--accent-border": colors.border,
        cursor: alwaysShowDesc ? "default" : "pointer"
      }}
    >
      <div 
        className="card-bg-glow" 
        style={{ background: `radial-gradient(circle, ${colors.shadow} 0%, transparent 70%)` }} 
      />

      <div className="card-header-new">
        <span className="card-icon-new" style={{ color: colors.color }}>
          {skill.icon}
        </span>
        <div className="card-title-group">
          <h3 className="card-name-new">{skill.name}</h3>
          
          <AnimatePresence initial={false}>
            {showDetails && (
              <motion.span 
                initial={{ opacity: 0, height: 0, scale: 0.8 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="card-level-tag" 
                style={{ 
                  color: colors.color, 
                  backgroundColor: colors.bg, 
                  borderColor: colors.border 
                }}
              >
                {skill.level}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <motion.div 
        layout="position"
        style={{ overflow: "hidden" }}
        animate={{ height: showDetails ? "auto" : 0, opacity: showDetails ? 1 : 0 }}
        initial={{ height: alwaysShowDesc ? "auto" : 0, opacity: alwaysShowDesc ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="card-divider-new" />
        <p className="card-desc-new">{skill.desc}</p>
      </motion.div>
    </motion.div>
  );
});

SkillCard.displayName = "SkillCard";

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const skillsRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setExpandedId(null);
  }, []);

  const handleCardClick = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const filteredSkills = useMemo(() => {
    return skillsList.filter(
      (skill) => activeCategory === "All" || skill.category === activeCategory
    );
  }, [activeCategory]);

  useEffect(() => {
    const section = skillsRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        }
      });

      tl.from(section.querySelector(".skills-title"), {
        opacity: 0,
        y: 35,
        duration: 0.8,
        ease: "power3.out"
      });

      tl.from(section.querySelector(".skills-tabs"), {
        opacity: 0,
        y: 15,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4");

      const grid = section.querySelector(".skills-grid");
      if (grid) {
        tl.from(grid, {
          opacity: 0,
          scale: 0.96,
          duration: 0.9,
          ease: "power3.out"
        }, "-=0.4");
      }
    }, skillsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="skills-container" ref={skillsRef}>
      <h1 className="skills-title">My Skills</h1>

      <div className="skills-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`skills-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div 
        className="skills-grid"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              isExpanded={expandedId === skill.id}
              onClick={handleCardClick}
              alwaysShowDesc={!isMobile}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Skills;
