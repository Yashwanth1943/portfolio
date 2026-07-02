import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaUser,
  FaCode,
  FaGraduationCap,
  FaLaptopCode,
  FaCertificate,
  FaTrophy,
  FaEnvelope
} from "react-icons/fa";
import "./index.scss";

const navItems = [
  { id: "hero", label: "Home", icon: <FaHome /> },
  { id: "about", label: "About", icon: <FaUser /> },
  { id: "skills", label: "Skills", icon: <FaCode /> },
  { id: "education", label: "Education", icon: <FaGraduationCap /> },
  { id: "projects", label: "Projects", icon: <FaLaptopCode /> },
  { id: "certifications", label: "Certificates", icon: <FaCertificate /> },
  { id: "achievements", label: "Achievements", icon: <FaTrophy /> },
  { id: "contact", label: "Connect", icon: <FaEnvelope /> },
];

const BRAND_TRANSITION = {
  type: "spring",
  stiffness: 115,
  damping: 24,
  mass: 0.9,
};

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

const MobileActiveGlow = ({ activeSection, activeColor }) => {
  const [animating, setAnimating] = useState(false);
  const [wobble, setWobble] = useState(false);

  useEffect(() => {
    setAnimating(true);
    setWobble(false);
    const timer = setTimeout(() => setAnimating(false), 350);
    return () => clearTimeout(timer);
  }, [activeSection]);

  return (
    <motion.span
      layoutId="activeAccent"
      className="mobile-nav-glow-accent"
      onLayoutAnimationComplete={() => {
        setWobble(true);
      }}
      animate={
        wobble
          ? { scale: [1, 1.12, 0.94, 1.05, 0.98, 1], scaleY: 1, scaleX: 1 }
          : animating
            ? { scaleY: 1.35, scaleX: 0.78 }
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
};

const Header = ({
  activeSection,
  scrollToSection,
  showBrand,
  revealContent,
  onBrandTransitionComplete,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleNavClick = useCallback((sectionId) => {
    scrollToSection(sectionId);
    closeMobileMenu();
  }, [scrollToSection, closeMobileMenu]);

  const handleBrandClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMobileMenu();
  }, [closeMobileMenu]);

  const handlePanelDragEnd = useCallback((_, info) => {
    if (info.offset.y > 120) {
      closeMobileMenu();
    }
  }, [closeMobileMenu]);

  // Scroll listener to toggle glassmorphic header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll when mobile navigation overlay is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  // Stagger configurations
  const overlayVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.35 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const panelVariants = {
    hidden: { scale: 0.9, y: 35, opacity: 0 },
    show: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 350, damping: 25, mass: 0.9 }
    },
    exit: {
      scale: 0.9,
      y: 35,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeInOut" }
    }
  };

  const listVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.04, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 22 }
    }
  };

  const activeColor = sectionColors[activeSection] || "#a78bfa";

  return (
    <>
      <header
        className={`header-container ${scrolled ? 'scrolled' : ''}`}
        style={{
          "--active-color": activeColor,
          "--active-color-shadow": `${activeColor}40`,
          "--active-color-alpha": `${activeColor}15`,
        }}
      >
        {/* Shared brand target; the splash source uses the same layoutId. */}
        <div
          className={`brand-wrapper ${revealContent ? "" : "brand-wrapper--transitioning"}`}
          aria-hidden={!showBrand}
        >
          <button onClick={handleBrandClick} className="brand-btn" aria-label="Brand Logo">
            {showBrand && (
              <motion.span
                className="brand-badge-text"
                layoutId="portfolio-brand-name"
                transition={{ layout: BRAND_TRANSITION }}
                onLayoutAnimationComplete={onBrandTransitionComplete}
              >
                YASHWANTH
              </motion.span>
            )}
          </button>
        </div>

        {/* Morphing SVG Hamburger Button - Mobile only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={revealContent ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.25 }}
        >
          <motion.button
            className="hamburger"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            type="button"
            initial="menu"
            animate={isMobileMenuOpen ? "open" : "menu"}
            whileHover="hover"
            whileTap="tap"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <motion.path
                stroke="#e2e8f0"
                strokeWidth="2.2"
                strokeLinecap="round"
                variants={{
                  menu: { d: "M 4 8 L 20 8" },
                  hover: { d: "M 4 8 L 20 8" },
                  open: { d: "M 5 5 L 19 19" }
                }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              />
              <motion.path
                stroke="#e2e8f0"
                strokeWidth="2.2"
                strokeLinecap="round"
                variants={{
                  menu: { d: "M 4 16 L 13 16" },
                  hover: { d: "M 4 16 L 17 16" },
                  open: { d: "M 5 19 L 19 5" }
                }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              />
            </svg>
          </motion.button>
        </motion.div>
      </header>

      {/* Luxurious Overlay Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-nav-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{
              "--active-color": activeColor,
              "--active-color-shadow": `${activeColor}40`,
              "--active-color-alpha": `${activeColor}15`,
            }}
          >
            {/* Backdrop Blur Closer */}
            <div className="mobile-nav-closer-bg" onClick={closeMobileMenu} />

            {/* Floating Background Gradient Blob */}
            <div className="mobile-nav-bg-blob1" />
            <div className="mobile-nav-bg-blob2" />

            {/* Center Floating Glass Panel */}
            <motion.div
              className="mobile-nav-panel"
              variants={panelVariants}
              drag="y"
              dragConstraints={{ top: 0, bottom: 250 }}
              onDragEnd={handlePanelDragEnd}
            >
              {/* Drag indicator bar for iOS feel */}
              <div className="swipe-indicator-bar" />

              <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true">
                <defs>
                  <filter id="mobile-gooey">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" result="goo" />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                  </filter>
                </defs>
              </svg>

              <div className="mobile-gooey-wrapper" style={{ position: "relative", width: "100%" }}>
                <div className="mobile-gooey-container" style={{ filter: "url(#mobile-gooey)" }}>
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <div key={`gooey-mobile-${item.id}`} className="mobile-gooey-cell">
                        <div className="mobile-gooey-anchor" />
                        {isActive && (
                          <MobileActiveGlow
                            activeSection={activeSection}
                            activeColor={activeColor}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <motion.nav
                  className="mobile-nav-content"
                  variants={listVariants}
                  aria-label="Mobile navigation links"
                  style={{ position: "relative", zIndex: 5 }}
                >
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                      variants={itemVariants}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="mobile-nav-icon">{item.icon}</span>
                      <span className="mobile-nav-text">{item.label}</span>
                    </motion.button>
                  ))}
                </motion.nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Header);
