import { memo, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";
import "@fontsource/pacifico";
import "@fontsource/dancing-script/400.css";
import "@fontsource/dancing-script/600.css";
import "@fontsource/great-vibes";
import "@fontsource/sacramento";
import "@fontsource/petemoss";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/700.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/700-italic.css";
import "./index.scss";

const EASE = [0.16, 1, 0.3, 1];
const BRAND_TRANSITION = {
  type: "spring",
  stiffness: 115,
  damping: 24,
  mass: 0.9,
};

const TYPOGRAPHY_STYLES = [
  // Classic serif (available on Windows and most desktop systems)
  { fontFamily: "'Times New Roman', serif", fontWeight: "400", fontStyle: "normal" },

  // Modern Sans
  { fontFamily: "'Inter', 'Helvetica Neue', sans-serif", fontWeight: "900", fontStyle: "normal" },

  // Brush Script (Web first)
  { fontFamily: "'Pacifico', 'Brush Script MT', cursive", fontWeight: "400", fontStyle: "normal" },

  // Formal calligraphy
  { fontFamily: "'Great Vibes', cursive", fontWeight: "400", fontStyle: "normal" },

  // Light signature script
  { fontFamily: "'Sacramento', cursive", fontWeight: "400", fontStyle: "normal" },

  // Expressive handwritten script
  { fontFamily: "'Petemoss', cursive", fontWeight: "400", fontStyle: "normal" },

  // Display serif
  { fontFamily: "'Playfair Display', serif", fontWeight: "400", fontStyle: "normal" },

  // Handwritten italic
  { fontFamily: "'Dancing Script', cursive", fontWeight: "400", fontStyle: "italic" },

  // Handwritten
  { fontFamily: "'Dancing Script', cursive", fontWeight: "600", fontStyle: "normal" },

  // Casual handwriting
  { fontFamily: "'Caveat', cursive", fontWeight: "700", fontStyle: "normal" },

  // Segoe Script (Web first)
  { fontFamily: "'Dancing Script', 'Segoe Script', cursive", fontWeight: "400", fontStyle: "normal" },

  // Rounded sans
  { fontFamily: "'Inter', sans-serif", fontWeight: "700", fontStyle: "normal" },

  // Georgia
  { fontFamily: "'Georgia', serif", fontWeight: "700", fontStyle: "italic" },

  // Editorial serif
  { fontFamily: "'Playfair Display', serif", fontWeight: "600", fontStyle: "normal" },

  // Editorial serif italic
  { fontFamily: "'Playfair Display', serif", fontWeight: "700", fontStyle: "italic" },

  // High-contrast serif
  { fontFamily: "'Playfair Display', serif", fontWeight: "400", fontStyle: "normal" },

  // Geometric sans
  { fontFamily: "'Inter', sans-serif", fontWeight: "700", fontStyle: "normal" },

  // Geometric sans heavy
  { fontFamily: "'Inter', sans-serif", fontWeight: "900", fontStyle: "italic" },

  // Humanist sans
  { fontFamily: "'Inter', sans-serif", fontWeight: "700", fontStyle: "italic" },

  // Trebuchet
  { fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "700", fontStyle: "normal" },

  // Verdana
  { fontFamily: "'Verdana', sans-serif", fontWeight: "900", fontStyle: "italic" },

  // Impact
  { fontFamily: "'Impact', sans-serif", fontWeight: "900", fontStyle: "normal" },

  // Decorative serif
  { fontFamily: "'Playfair Display', serif", fontWeight: "700", fontStyle: "italic" },

  // Papyrus
  { fontFamily: "'Papyrus', fantasy", fontWeight: "400", fontStyle: "normal" },

  // Brush + Bold Finish (Web first)
  { fontFamily: "'Pacifico', 'Brush Script MT', cursive", fontWeight: "700", fontStyle: "italic" },

  // Custom-style script replacement
  { fontFamily: "'Dancing Script', cursive", fontWeight: "400", fontStyle: "normal" },

  // Custom-style sans replacement
  { fontFamily: "'Inter', sans-serif", fontWeight: "400", fontStyle: "italic" },

  // Custom-style sans replacement
  { fontFamily: "'Inter', sans-serif", fontWeight: "700", fontStyle: "normal" },
];

const First5Seconds = memo(({ onComplete }) => {
  const [step, setStep] = useState(0);
  const helloRef = useRef(null);

  useEffect(() => {
    // 2.7s for typography sequence to finish, then reveal I'm YASHWANTH (step 1)
    const helloTimer = window.setTimeout(() => setStep(1), 2700);
    const taglineTimer = window.setTimeout(() => setStep(2), 3800);
    const completeTimer = window.setTimeout(onComplete, 4800);

    return () => {
      window.clearTimeout(helloTimer);
      window.clearTimeout(taglineTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // GSAP style-shifting timeline
  useEffect(() => {
    const helloEl = helloRef.current;
    if (!helloEl) return undefined;

    const tl = gsap.timeline();

    // 1. Initial fade-in and slide-up entrance
    tl.fromTo(helloEl,
      { opacity: 0, y: 15, filter: "blur(6px)", scale: 0.94 },
      { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 0.4, ease: "power4.out" }
    );

    // 2. Rapid typography shifting sequence
    TYPOGRAPHY_STYLES.forEach((style, index) => {
      const startTime = 0.4 + index * 0.10; // shift every 100ms

      if (index === 0) {
        tl.set(helloEl, {
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
          textTransform: style.textTransform,
          letterSpacing: style.letterSpacing
        }, 0.4);
      } else {
        // Smooth transition out
        tl.to(helloEl, {
          opacity: 0,
          filter: "blur(5px)",
          duration: 0.04,
          ease: "power1.in"
        }, startTime - 0.04);

        // Apply new style
        tl.set(helloEl, {
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
          textTransform: style.textTransform,
          letterSpacing: style.letterSpacing
        }, startTime);

        // Smooth transition in
        tl.to(helloEl, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.06,
          ease: "power1.out"
        }, startTime);
      }
    });

    // 3. Smooth exit transition
    const exitTime = 0.4 + TYPOGRAPHY_STYLES.length * 0.10; // 2.40s
    tl.to(helloEl, {
      opacity: 0,
      y: -20,
      scale: 0.95,
      filter: "blur(4px)",
      duration: 0.30,
      ease: "power2.inOut"
    }, exitTime);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <motion.div
      className="splash-overlay"
      initial={{ backgroundColor: "#060608" }}
      exit={{ backgroundColor: "rgba(6, 6, 8, 0)", transition: { duration: 0.55, ease: "easeInOut" } }}
    >
      <motion.div
        className="splash-ambient-bg"
        exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
      />

      {step === 0 && (
        <div className="splash-rings-container">
          <motion.div
            className="splash-center-dot"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
          <motion.div
            className="splash-ring ring-1"
            initial={{ scale: 0.1, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          />
          <motion.div
            className="splash-ring ring-2"
            initial={{ scale: 0.1, opacity: 0.4 }}
            animate={{ scale: 3.8, opacity: 0 }}
            transition={{ duration: 1.05, ease: "easeOut", delay: 0.15 }}
          />
        </div>
      )}

      <div className="splash-content-container">
        {step === 0 && (
          <h2
            ref={helloRef}
            className="splash-hello"
            style={{ opacity: 0 }}
          >
            Hello
          </h2>
        )}

        {step >= 1 && (
          <div className="splash-brand-container">
            <motion.div
              className="splash-name-group"
              initial={{ opacity: 0, y: 12, scale: 0.96, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <motion.span
                className="splash-im-label"
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                I&apos;m
              </motion.span>
              <motion.span
                className="splash-brand-name"
                layoutId="portfolio-brand-name"
                transition={{ layout: BRAND_TRANSITION }}
              >
                YASHWANTH
              </motion.span>
            </motion.div>

            <motion.div
              className="splash-subtitle-container"
              exit={{ opacity: 0, transition: { duration: 0.35 } }}
            >
              <motion.p
                className="splash-tagline"
                initial={{ opacity: 0, y: 8 }}
                animate={step === 2 ? { opacity: 0.45, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.5, ease: EASE, delay: step === 2 ? 0.1 : 0 }}
                style={{ pointerEvents: step === 2 ? "auto" : "none" }}
              >
                Crafting Modern Digital Experiences
              </motion.p>

              <div className="splash-progress-wrapper">
                <motion.div
                  className="splash-progress-line"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.0, ease: "linear" }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

First5Seconds.displayName = "First5Seconds";

export default First5Seconds;
