import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.scss';

gsap.registerPlugin(ScrollTrigger);

const skillsList = [
  { name: "React", category: "Frontend", desc: "A JavaScript library for building component-based user interfaces." },
  { name: "JavaScript", category: "Languages", desc: "Lightweight, interpreted programming language for dynamic web interactivity." },
  { name: "Node.js", category: "Backend", desc: "JavaScript runtime environment built on Chrome's V8 engine." },
  { name: "Express", category: "Backend", desc: "Minimalist and flexible web application framework for Node.js backends." },
  { name: "MongoDB", category: "Database", desc: "NoSQL document database storing application data in JSON-like format." },
  { name: "SQLite", category: "Database", desc: "Self-contained, serverless, zero-configuration SQL database engine." },
  { name: "Python", category: "Languages", desc: "Versatile, high-level programming language known for readability and clean syntax." },
  { name: "HTML5", category: "Frontend", desc: "The core structure and markup language of the World Wide Web." },
  { name: "CSS3", category: "Frontend", desc: "Cascading stylesheets used to create modern visual design and presentation." },
  { name: "Bootstrap", category: "Frontend", desc: "Popular responsive CSS framework for mobile-first web designs." },
  { name: "Tailwind CSS", category: "Frontend", desc: "Utility-first CSS framework for rapid and responsive UI layouts." },
  { name: "Git", category: "Tools", desc: "Distributed version control system to track changes in source code." },
];

const categories = ["All", "Languages", "Frontend", "Backend", "Database", "Tools"];

const SkillCard = memo(({
  skill,
  index,
  cardStatus,
  isMobile,
  expandUp,
  isHovered,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div
      className={`card-physics-wrapper ${cardStatus}`}
      style={{
        position: "absolute",
        left: `${skill.restingX}px`,
        top: `${skill.restingY}px`,
        width: isMobile ? 110 : 150,
        height: isMobile ? 40 : 52,
        pointerEvents: "none",
        zIndex: cardStatus === "hovered" ? 10 : (cardStatus === "dimmed" ? 0 : 1),
        willChange: "transform",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        "--float-dur-y": `${skill.floatDurationY}s`,
        "--float-dur-x": `${skill.floatDurationX}s`,
        "--float-delay": `${-skill.floatDelay}s`, // Negative delay makes animations start immediately at different points!
      }}
    >
      <motion.div
        className={`floating-card ${cardStatus}`}
        style={{
          pointerEvents: "auto",
        }}
        animate={
          cardStatus === "hovered"
            ? {
              y: expandUp ? (isMobile ? -119.3 : -142.7) : -6,
              scale: 1.15,
              rotate: 0,
              opacity: 1,
            }
            : cardStatus === "dimmed"
              ? {
                y: 0,
                scale: 0.96,
                rotate: 0,
                opacity: 0.5,
              }
              : cardStatus === "filtered"
                ? {
                  y: 0,
                  scale: 0.85,
                  rotate: 0,
                  opacity: 0.12,
                }
                : {
                  y: 0,
                  x: 0,
                  rotate: 0,
                  scale: 1,
                  opacity: 1,
                }
        }
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.8,
        }}
        onMouseEnter={() => onMouseEnter(index)}
        onMouseLeave={onMouseLeave}
      >
        {/* Backglow element (blurred behind card) */}
        <div className="card-ambient-glow" />
 
        {/* Masked gradient border */}
        <div className="card-glow" />
 
        <div className="card-content">
          {expandUp && (
            <motion.div
              className="card-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isHovered ? "auto" : 0,
                opacity: isHovered ? 1 : 0
              }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 18
              }}
            >
              <p className="card-desc">{skill.desc}</p>
              <div className="card-divider" />
            </motion.div>
          )}
 
          <h3 className="card-title">{skill.name}</h3>
 
          {!expandUp && (
            <motion.div
              className="card-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isHovered ? "auto" : 0,
                opacity: isHovered ? 1 : 0
              }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 18
              }}
            >
              <div className="card-divider" />
              <p className="card-desc">{skill.desc}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
});

SkillCard.displayName = "SkillCard";

const MobileSkillCard = memo(({
  skill,
  index,
  isActive,
  onTap
}) => {
  return (
    <motion.div
      className="mobile-skill-card-wrapper"
      initial={{ opacity: 0, y: 25, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        delay: (index % 2) * 0.08,
        duration: 0.45,
        ease: "easeOut"
      }}
    >
      <div
        className={`mobile-skill-card ${isActive ? 'active' : ''}`}
        onClick={onTap}
      >
        <div className="card-ambient-glow" style={{ opacity: isActive ? 1 : 0 }} />
        <div className="card-glow" style={{ opacity: isActive ? 1 : 0 }} />

        <div className="mobile-card-content">
          <h3 className="mobile-card-title">{skill.name}</h3>

          <motion.div
            className="mobile-card-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isActive ? "auto" : 0,
              opacity: isActive ? 1 : 0
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 22
            }}
          >
            <div className="mobile-card-divider" />
            <p className="mobile-card-desc">{skill.desc}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

MobileSkillCard.displayName = "MobileSkillCard";

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState(null);
  const [activeMobileCardId, setActiveMobileCardId] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 500 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const skillsRef = useRef(null);
  const containerRef = useRef(null);

  // Monitor container sizing dynamically (only triggers re-renders on dimension updates)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      setDimensions({
        width: rect.width || 1000,
        height: rect.height || 500,
      });
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(container);

    return () => ro.disconnect();
  }, []);

  // Reset expanded card state when filter category is changed
  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setActiveMobileCardId(null);
  }, []);

  // Compute fixed card resting coordinates once per size change (Desktop only)
  const cards = useMemo(() => {
    const { width, height } = dimensions;
    const cardW = isMobile ? 110 : 150;
    const cardH = isMobile ? 40 : 52;
    const numCards = skillsList.length;
    const centerX = width / 2;
    const centerY = height / 2;

    // Spread cards out in a ring relative to container dimensions
    const radiusX = Math.max(50, centerX - cardW - 30);
    const radiusY = Math.max(50, centerY - cardH - 30);

    return skillsList.map((skill, index) => {
      const angle = (index / numCards) * Math.PI * 2;
      const rX = radiusX * (0.45 + (index % 3) * 0.15);
      const rY = radiusY * (0.45 + (index % 3) * 0.15);

      const restingX = centerX + Math.cos(angle) * rX - cardW / 2;
      const restingY = centerY + Math.sin(angle) * rY - cardH / 2;

      // Expand direction based on resting position near container bottom
      const hoveredHeight = (isMobile ? 135 : 165) * 1.18;
      const expandUp = restingY + hoveredHeight > height - 15;

      // Unique deterministic delay and duration for the float animation
      const floatDelay = (index * 0.47) % 3.0; // delay up to 3s
      const floatDurationY = 6.0 + (index * 0.73) % 4.0; // Y duration 6s - 10s
      const floatDurationX = 5.5 + (index * 0.91) % 3.5; // X duration 5.5s - 9s
      const floatDurationRotate = 7.0 + (index * 0.57) % 3.0; // Rotate duration 7s - 10s
      const floatDurationScale = 8.0 + (index * 0.83) % 4.0; // Scale duration 8s - 12s

      return {
        ...skill,
        id: index,
        restingX,
        restingY,
        expandUp,
        floatDelay,
        floatDurationY,
        floatDurationX,
        floatDurationRotate,
        floatDurationScale,
      };
    });
  }, [dimensions, isMobile]);

  // Filter skills for mobile grid flow layout
  const filteredMobileSkills = useMemo(() => {
    return skillsList
      .map((skill, index) => ({ ...skill, id: index }))
      .filter((skill) => activeCategory === "All" || skill.category === activeCategory);
  }, [activeCategory]);

  // Scroll introduction animations via GSAP
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

      const showcase = section.querySelector(".skills-showcase-container");
      const grid = section.querySelector(".skills-mobile-grid");
      const targetElement = showcase || grid;

      if (targetElement) {
        tl.from(targetElement, {
          opacity: 0,
          scale: 0.96,
          duration: 0.9,
          ease: "power3.out"
        }, "-=0.4");
      }
    }, skillsRef);

    return () => ctx.revert();
  }, [isMobile]);

  // Callback handlers memoized to avoid triggering re-renders on sibling components
  const handleMouseEnter = useCallback((id) => {
    setHoveredId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  const handleMobileCardTap = useCallback((id) => {
    setActiveMobileCardId((prev) => (prev === id ? null : id));
  }, []);

  const getCardStatus = useCallback((cardId, category) => {
    const matchesFilter = activeCategory === "All" || category === activeCategory;
    if (!matchesFilter) return "filtered";
    if (hoveredId === cardId) return "hovered";
    if (hoveredId !== null) return "dimmed";
    return "active";
  }, [activeCategory, hoveredId]);

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

      {isMobile ? (
        <div className="skills-mobile-grid">
          {filteredMobileSkills.map((skill, index) => (
            <MobileSkillCard
              key={skill.name}
              skill={skill}
              index={index}
              isActive={activeMobileCardId === skill.id}
              onTap={() => handleMobileCardTap(skill.id)}
            />
          ))}
        </div>
      ) : (
        <div
          className="skills-showcase-container"
          ref={containerRef}
        >
          {cards.map((card, index) => {
            const cardStatus = getCardStatus(card.id, card.category);

            return (
              <SkillCard
                key={card.name}
                skill={card}
                index={index}
                cardStatus={cardStatus}
                isMobile={false}
                expandUp={card.expandUp}
                isHovered={hoveredId === card.id}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Skills;
