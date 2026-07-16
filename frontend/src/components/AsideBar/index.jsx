import React, { memo, useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import "./index.scss";
import {
  FaHome,
  FaUser,
  FaCode,
  FaGraduationCap,
  FaLaptopCode,
  FaCertificate,
  FaTrophy,
  FaEnvelope,
  FaLinkedin,
  FaGithub
} from "react-icons/fa";

const navItems = [
  { id: "hero", label: "Home", icon: <FaHome /> },
  { id: "about", label: "About", icon: <FaUser /> },
  { id: "skills", label: "Skills", icon: <FaCode /> },
  { id: "education", label: "Education", icon: <FaGraduationCap /> },
  { id: "projects", label: "Projects", icon: <FaLaptopCode /> },
  { id: "certifications", label: "Certificates", icon: <FaCertificate /> },
  { id: "achievements", label: "Achievements", icon: <FaTrophy /> },
  { id: "contact", label: "Contact", icon: <FaEnvelope /> },
];

const sectionColors = {
  hero: "#a78bfa",
  about: "#38bdf8",
  skills: "#34d399",
  education: "#fb7185",
  projects: "#f59e0b",
  certifications: "#c084fc",
  achievements: "#ec4899",
  contact: "#22d3ee",
};

const BUTTON_SPRING_CONFIG = { damping: 25, stiffness: 220, mass: 0.6 };
const BAR_SPRING_CONFIG = { damping: 30, stiffness: 180, mass: 0.8 };

const LiquidActiveGlow = memo(({ activeSection, activeColor }) => {
  const [animating, setAnimating] = useState(false);
  const [wobble, setWobble] = useState(false);

  useEffect(() => {
    setAnimating(true);
    setWobble(false);
    const timer = setTimeout(() => setAnimating(false), 350);
    return () => clearTimeout(timer);
  }, [activeSection]);

  return (
    <motion.div
      layoutId="asideActiveGlow"
      className="aside-active-glow"
      onLayoutAnimationComplete={() => {
        setWobble(true);
      }}
      animate={
        wobble
          ? { scale: [1, 1.18, 0.92, 1.06, 0.98, 1], scaleY: 1, scaleX: 1 }
          : animating
            ? { scaleY: 1.45, scaleX: 0.72 }
            : { scaleY: 1, scaleX: 1 }
      }
      transition={{
        layout: { type: "spring", stiffness: 220, damping: 15, mass: 1.4 },
        scaleY: { type: "spring", stiffness: 180, damping: 12 },
        scaleX: { type: "spring", stiffness: 180, damping: 12 },
        scale: { duration: 0.5, ease: "easeInOut" }
      }}
      style={{
        transformOrigin: "center",
      }}
    />
  );
});
LiquidActiveGlow.displayName = "LiquidActiveGlow";

const AsideIconButton = memo(({ item, isActive, scrollToSection }) => {
  const buttonRef = useRef(null);
  const iconX = useMotionValue(0);
  const iconY = useMotionValue(0);

  const iconSpringX = useSpring(iconX, BUTTON_SPRING_CONFIG);
  const iconSpringY = useSpring(iconY, BUTTON_SPRING_CONFIG);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const handleMouseMove = (e) => {
      // Early exit if mouse is far from sidebar horizontally
      if (e.clientX > 150) {
        iconX.set(0);
        iconY.set(0);
        return;
      }
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - btnCenterX;
      const dy = e.clientY - btnCenterY;
      const distance = Math.hypot(dx, dy);

      // Inner attraction radius of 80px for individual icon magnetic response
      const localRadius = 80;
      if (distance < localRadius) {
        const strength = (localRadius - distance) / localRadius; // 0 to 1
        const targetX = (dx / distance) * strength * 6; // max 6px shift
        const targetY = (dy / distance) * strength * 6;

        iconX.set(targetX);
        iconY.set(targetY);
      } else {
        iconX.set(0);
        iconY.set(0);
      }
    };

    const handleMouseLeave = () => {
      iconX.set(0);
      iconY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    btn.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [iconX, iconY]);

  return (
    <motion.button
      ref={buttonRef}
      onClick={() => scrollToSection(item.id)}
      className={`aside-nav-btn ${isActive ? "active" : ""}`}
      aria-label={`Scroll to ${item.label}`}
      style={{
        x: iconSpringX,
        y: iconSpringY,
        position: "relative",
        zIndex: 2,
      }}
    >
      <span className="tooltip">{item.label}</span>
      <span className={`aside-icon-container ${isActive ? "active-levitate" : ""}`}>
        {item.icon}
      </span>
    </motion.button>
  );
});
AsideIconButton.displayName = "AsideIconButton";

const AsideBar = ({ activeSection, scrollToSection }) => {
  const containerRef = useRef(null);
  const containerX = useMotionValue(0);
  const containerY = useMotionValue(0);

  const containerSpringX = useSpring(containerX, BAR_SPRING_CONFIG);
  const containerSpringY = useSpring(containerY, BAR_SPRING_CONFIG);

  const activeColor = React.useMemo(
    () => sectionColors[activeSection] || "#a78bfa",
    [activeSection]
  );

  useEffect(() => {
    const asideEl = containerRef.current;
    if (!asideEl) return;

    const handleMouseMove = (e) => {
      // Early exit if mouse is far from sidebar horizontally
      if (e.clientX > 320) {
        containerX.set(0);
        containerY.set(0);
        return;
      }
      const rect = asideEl.getBoundingClientRect();
      const asideCenterX = rect.left + rect.width / 2;
      const asideCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - asideCenterX;
      const dy = e.clientY - asideCenterY;
      const distance = Math.hypot(dx, dy);

      // We attract the whole container if mouse is within 250px
      const attractionRadius = 250;
      if (distance < attractionRadius) {
        const strength = (attractionRadius - distance) / attractionRadius; // 0 to 1
        const targetX = (dx / distance) * strength * 8; // max 8px shift
        const targetY = (dy / distance) * strength * 10;

        containerX.set(targetX);
        containerY.set(targetY);
      } else {
        containerX.set(0);
        containerY.set(0);
      }
    };

    const handleMouseLeave = () => {
      containerX.set(0);
      containerY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    asideEl.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      asideEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerX, containerY]);

  return (
    <div className="aside-float-wrapper">
      <motion.aside
        ref={containerRef}
        className="aside-bar"
        aria-label="Section shortcuts"
        style={{
          "--active-color": activeColor,
          "--active-color-shadow": `${activeColor}60`,
          "--active-color-alpha": `${activeColor}15`,
          x: containerSpringX,
          y: containerSpringY,
        }}
      >
        <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true">
          <defs>
            <filter id="aside-gooey">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

        <div className="aside-nav-wrapper" style={{ position: "relative", width: 34 }}>
          <div className="aside-gooey-container" style={{ filter: "url(#aside-gooey)" }}>
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <div key={`gooey-aside-${item.id}`} className="aside-gooey-cell">
                  <div className="aside-gooey-anchor" />
                  {isActive && (
                    <LiquidActiveGlow
                      activeSection={activeSection}
                      activeColor={activeColor}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <nav className="aside-nav" aria-label="Sidebar shortcuts" style={{ position: "relative", zIndex: 5 }}>
            <ul>
              {navItems.map((item) => (
                <li key={item.id} style={{ position: "relative", width: 34, height: 34 }}>
                  <AsideIconButton
                    item={item}
                    isActive={activeSection === item.id}
                    scrollToSection={scrollToSection}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="aside-divider" aria-hidden="true" />

        <ul className="aside-socials">
          <li>
            <a
              href="https://www.linkedin.com/in/yasvanth-kosuri-007722195"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="icon linkedin-icon" />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Yashwanth1943"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub className="icon github-icon" />
            </a>
          </li>
        </ul>
      </motion.aside>
    </div>
  );
};

export default memo(AsideBar);