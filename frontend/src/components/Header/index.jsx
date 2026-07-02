import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaUser,
  FaCode,
  FaGraduationCap,
  FaLaptopCode,
  FaCertificate,
  FaTrophy,
  FaEnvelope,
} from "react-icons/fa";
import "./index.scss";

/* ─── static data ──────────────────────────────────────────── */
const navItems = [
  { id: "hero",          label: "Home",         icon: <FaHome /> },
  { id: "about",         label: "About",        icon: <FaUser /> },
  { id: "skills",        label: "Skills",       icon: <FaCode /> },
  { id: "education",     label: "Education",    icon: <FaGraduationCap /> },
  { id: "projects",      label: "Projects",     icon: <FaLaptopCode /> },
  { id: "certifications",label: "Certificates", icon: <FaCertificate /> },
  { id: "achievements",  label: "Achievements", icon: <FaTrophy /> },
  { id: "contact",       label: "Connect",      icon: <FaEnvelope /> },
];

const sectionColors = {
  hero:           "#a78bfa",
  about:          "#38bdf8",
  skills:         "#34d399",
  education:      "#fb7185",
  projects:       "#f59e0b",
  certifications: "#c084fc",
  achievements:   "#ec4899",
  contact:        "#22d3ee",
};

const BRAND_TRANSITION = {
  type: "spring",
  stiffness: 115,
  damping: 24,
  mass: 0.9,
};

/*
 * All variant objects are MODULE-LEVEL constants.
 * Defining them inside the component creates new object references
 * on every render, forcing Framer Motion to re-parse them needlessly.
 */
const OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.26 } },
  exit:   { opacity: 0, transition: { duration: 0.20 } },
};

const PANEL_VARIANTS = {
  hidden: { y: 44, scale: 0.93, opacity: 0 },
  show: {
    y: 0, scale: 1, opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 30, mass: 0.80 },
  },
  exit: {
    y: 32, scale: 0.93, opacity: 0,
    transition: { duration: 0.20, ease: [0.4, 0, 1, 1] },
  },
};

const LIST_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.032, delayChildren: 0.055 } },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 360, damping: 26 },
  },
};

/* Gooey filter is a static SVG — extracted as a constant to avoid JSX parsing overhead */
const GOOEY_SVG = (
  <svg
    style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <filter id="mobile-gooey" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
          result="goo"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
);

/* ─── liquid active glow pill ──────────────────────────────── */
/**
 * Renders the animated accent pill that slides between nav items.
 * Uses Framer Motion layoutId so it morphs position instead of jumping.
 */
const MobileActiveGlow = memo(({ activeSection }) => {
  const [squish, setSquish] = useState(false);

  useEffect(() => {
    // Squish on section change, then settle
    setSquish(true);
    const t = setTimeout(() => setSquish(false), 320);
    return () => clearTimeout(t);
  }, [activeSection]);

  return (
    <motion.span
      layoutId="mobileActiveAccent"
      className="mobile-nav-glow-accent"
      animate={squish
        ? { scaleY: 1.25, scaleX: 0.82 }
        : { scaleY: 1,    scaleX: 1 }
      }
      transition={{
        layout:  { type: "spring", stiffness: 260, damping: 22, mass: 1.2 },
        scaleY:  { type: "spring", stiffness: 200, damping: 14 },
        scaleX:  { type: "spring", stiffness: 200, damping: 14 },
      }}
      style={{ transformOrigin: "center" }}
    />
  );
});
MobileActiveGlow.displayName = "MobileActiveGlow";

/* ─── main Header component ────────────────────────────────── */
const Header = ({
  activeSection,
  scrollToSection,
  showBrand,
  revealContent,
  onBrandTransitionComplete,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* handlers */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleNavClick = useCallback(
    (sectionId) => {
      scrollToSection(sectionId);
      closeMobileMenu();
    },
    [scrollToSection, closeMobileMenu]
  );

  const handleBrandClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMobileMenu();
  }, [closeMobileMenu]);

  const handlePanelDragEnd = useCallback(
    (_, info) => {
      if (info.offset.y > 100) closeMobileMenu();
    },
    [closeMobileMenu]
  );

  /* scroll state — throttled with rAF to avoid 60fps setState */
  const rafRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        rafRef.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  /* keyboard close */
  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const onKey = (e) => { if (e.key === "Escape") closeMobileMenu(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen, closeMobileMenu]);

  /* animation variants */
  const overlayVariants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { duration: 0.28 } },
    exit:   { opacity: 0, transition: { duration: 0.22 } },
  };

  const panelVariants = {
    hidden: { y: 40, scale: 0.92, opacity: 0 },
    show: {
      y: 0, scale: 1, opacity: 1,
      transition: { type: "spring", stiffness: 380, damping: 28, mass: 0.85 },
    },
    exit: {
      y: 36, scale: 0.92, opacity: 0,
      transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
    },
  };

  const listVariants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.035, delayChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1, y: 0,
      transition: { type: "spring", stiffness: 340, damping: 24 },
    },
  };

  /* Memoize activeColor so string concat only runs when activeSection changes */
  const activeColor = useMemo(
    () => sectionColors[activeSection] || "#a78bfa",
    [activeSection]
  );

  /* Memoize the CSS vars object — new object ref every render breaks React bailout */
  const cssVars = useMemo(
    () => ({
      "--active-color":        activeColor,
      "--active-color-shadow": `${activeColor}40`,
      "--active-color-alpha":  `${activeColor}15`,
    }),
    [activeColor]
  );

  return (
    <>
      {/* ── Desktop / tablet top bar ── */}
      <header
        className={`header-container${scrolled ? " scrolled" : ""}`}
        style={cssVars}
      >
        <div
          className={`brand-wrapper${revealContent ? "" : " brand-wrapper--transitioning"}`}
          aria-hidden={!showBrand}
        >
          <button onClick={handleBrandClick} className="brand-btn" aria-label="Scroll to top">
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

        {/* Morphing hamburger — mobile only */}
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <motion.path
                stroke="#e2e8f0"
                strokeWidth="2.2"
                strokeLinecap="round"
                variants={{
                  menu:  { d: "M 4 8 L 20 8" },
                  hover: { d: "M 4 8 L 20 8" },
                  open:  { d: "M 5 5 L 19 19" },
                }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              />
              <motion.path
                stroke="#e2e8f0"
                strokeWidth="2.2"
                strokeLinecap="round"
                variants={{
                  menu:  { d: "M 4 16 L 13 16" },
                  hover: { d: "M 4 16 L 17 16" },
                  open:  { d: "M 5 19 L 19 5" },
                }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              />
            </svg>
          </motion.button>
        </motion.div>
      </header>

      {/* ── Mobile navigation overlay ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-nav-overlay"
            variants={OVERLAY_VARIANTS}
            initial="hidden"
            animate="show"
            exit="exit"
            style={cssVars}
          >
            {/* Tap-outside closer */}
            <div
              className="mobile-nav-closer-bg"
              onClick={closeMobileMenu}
              role="button"
              aria-label="Close navigation"
              tabIndex={-1}
            />

            {/* Ambient depth blobs — behind the sheet */}
            <div className="mobile-nav-bg-blob1" aria-hidden="true" />
            <div className="mobile-nav-bg-blob2" aria-hidden="true" />

            {/* ── Glass Sheet ── */}
            <motion.div
              className="mobile-nav-panel"
              variants={PANEL_VARIANTS}
              drag="y"
              dragConstraints={{ top: 0, bottom: 250 }}
              dragElastic={{ top: 0, bottom: 0.25 }}
              onDragEnd={handlePanelDragEnd}
            >
              {/* ── Premium Sheet Header ── */}
              <div className="mob-sheet-header" aria-hidden="true">
                <div className="mob-drag-handle" />
                <p className="mob-sheet-title">Navigation</p>
                <p className="mob-sheet-sub">Quick access to every section</p>
              </div>

              {/* Static gooey filter — module-level constant, zero re-parse cost */}
              {GOOEY_SVG}

              {/* ── Gooey + Nav Links ── */}
              <div className="mobile-gooey-wrapper">
                {/* Gooey layer — positioned absolute behind buttons */}
                <div
                  className="mobile-gooey-container"
                  style={{ filter: "url(#mobile-gooey)" }}
                  aria-hidden="true"
                >
                  {navItems.map((item) => (
                    <div key={`gooey-${item.id}`} className="mobile-gooey-cell">
                      <div className="mobile-gooey-anchor" />
                      {activeSection === item.id && (
                        <MobileActiveGlow activeSection={activeSection} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Clickable nav buttons */}
                <motion.nav
                  className="mobile-nav-content"
                  variants={LIST_VARIANTS}
                  aria-label="Mobile navigation"
                  style={{ position: "relative", zIndex: 5 }}
                >
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        className={`mobile-nav-link${isActive ? " active" : ""}`}
                        onClick={() => handleNavClick(item.id)}
                        variants={ITEM_VARIANTS}
                        whileTap={{ scale: 0.97, transition: { duration: 0.12 } }}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="mobile-nav-icon" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span className="mobile-nav-text">{item.label}</span>
                      </motion.button>
                    );
                  })}
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
