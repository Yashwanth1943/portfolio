import React, { useEffect, useRef } from 'react';
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
  { name: "React", category: "Frontend", level: "Advanced", icon: <FaReact /> },
  { name: "JavaScript", category: "Languages", level: "Advanced", icon: <SiJavascript /> },
  { name: "Node.js", category: "Backend", level: "Advanced", icon: <FaNodeJs /> },
  { name: "Express", category: "Backend", level: "Advanced", icon: <SiExpress /> },
  { name: "MongoDB", category: "Database", level: "Intermediate", icon: <SiMongodb /> },
  { name: "SQLite", category: "Database", level: "Intermediate", icon: <SiSqlite /> },
  { name: "Python", category: "Languages", level: "Intermediate", icon: <FaPython /> },
  { name: "HTML5", category: "Frontend", level: "Advanced", icon: <FaHtml5 /> },
  { name: "CSS3", category: "Frontend", level: "Advanced", icon: <FaCss3Alt /> },
  { name: "Bootstrap", category: "Frontend", level: "Advanced", icon: <FaBootstrap /> },
  { name: "Tailwind CSS", category: "Frontend", level: "Advanced", icon: <SiTailwindcss /> },
  { name: "Git", category: "Tools", level: "Advanced", icon: <FaGitAlt /> },
];

const categoryColors = {
  Languages: "#f59e0b",
  Frontend: "#38bdf8",
  Backend: "#34d399",
  Database: "#fb7185",
  Tools: "#c084fc",
};

const Skills = () => {
  const skillsRef = useRef(null);

  // Group skills by category
  const groupedSkills = React.useMemo(() => {
    const groups = {};
    skillsList.forEach((skill) => {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }
      groups[skill.category].push(skill);
    });
    return groups;
  }, []);

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
        y: 25,
        duration: 0.7,
        ease: "power3.out"
      });

      tl.from(section.querySelectorAll(".skills-category-group"), {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3");
    }, skillsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="skills-container" ref={skillsRef}>
      <h1 className="skills-title">My Skills</h1>

      {/* Desktop view (>= 768px) */}
      <div className="skills-categories-layout skills-desktop-view">
        {Object.entries(groupedSkills).map(([category, items]) => {
          const accentColor = categoryColors[category] || "#a78bfa";
          return (
            <div key={category} className="skills-category-group">
              <h2 className="category-heading" style={{ color: accentColor }}>
                <span className="category-line" style={{ backgroundColor: accentColor }} />
                {category}
              </h2>

              <div className="skills-pills-row">
                {items.map((skill) => (
                  <div
                    key={skill.name}
                    className="skill-pill"
                    style={{ "--accent-color": accentColor }}
                  >
                    <span className="pill-icon">{skill.icon}</span>
                    <span className="pill-name">{skill.name}</span>
                    <span className="pill-level">{skill.level}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile view (< 768px) */}
      <div className="skills-categories-layout skills-mobile-view">
        {Object.entries(groupedSkills).map(([category, items]) => {
          const accentColor = categoryColors[category] || "#a78bfa";
          return (
            <div key={category} className="skills-category-group">
              <h2 className="category-heading" style={{ color: accentColor }}>
                <span className="category-line" style={{ backgroundColor: accentColor }} />
                {category}
              </h2>

              <div className="skills-mobile-grid">
                {items.map((skill) => (
                  <div
                    key={skill.name}
                    className="skill-mobile-pill"
                    style={{ "--accent-color": accentColor }}
                  >
                    <span className="pill-icon">{skill.icon}</span>
                    <span className="pill-name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Skills;
