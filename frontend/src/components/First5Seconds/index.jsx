import { memo, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import "@fontsource/inter/400.css";
import "@fontsource/inter/400-italic.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/700-italic.css";
import "@fontsource/inter/900.css";
import "@fontsource/inter/900-italic.css";
import "@fontsource/pacifico";
import "@fontsource/dancing-script/400.css";
import "@fontsource/dancing-script/600.css";
import "@fontsource/dancing-script/700.css";
import "@fontsource/great-vibes";
import "@fontsource/sacramento";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/700.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/700-italic.css";
import "@fontsource/allura";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/lora/600-italic.css";
import "@fontsource/merriweather/700.css";
import "@fontsource/cinzel-decorative";
import "@fontsource/bebas-neue";
import "@fontsource/permanent-marker";
import "@fontsource/amatic-sc/700.css";
import "@fontsource/parisienne";
import "@fontsource/marck-script";
import "@fontsource/dm-serif-display";
import "@fontsource/bonheur-royale";
import "./index.scss";

const EASE = [0.16, 1, 0.3, 1];
const BRAND_TRANSITION = {
  type: "spring",
  stiffness: 115,
  damping: 24,
  mass: 0.9,
};

const TYPOGRAPHY_STYLES = [
  { fontFamily: "'Times New Roman', serif", fontWeight: "400", fontStyle: "normal" },
  { fontFamily: "'Pacifico', cursive", fontWeight: "400", fontStyle: "normal" },
  { fontFamily: "'Inter', sans-serif", fontWeight: "900", fontStyle: "normal" },
  { fontFamily: "'Cormorant Garamond', serif", fontWeight: "700", fontStyle: "normal" },
  { fontFamily: "'Great Vibes', cursive", fontWeight: "400", fontStyle: "normal" },
  { fontFamily: "'Bebas Neue', sans-serif", fontWeight: "400", fontStyle: "normal" },
  { fontFamily: "'Playfair Display', serif", fontWeight: "700", fontStyle: "normal" },
  { fontFamily: "'Allura', cursive", fontWeight: "400", fontStyle: "normal" },
  { fontFamily: "'Merriweather', serif", fontWeight: "700", fontStyle: "normal" },
  { fontFamily: "'Permanent Marker', cursive", fontWeight: "400", fontStyle: "normal" },
  { fontFamily: "'Georgia', serif", fontWeight: "700", fontStyle: "italic" },
  { fontFamily: "'Dancing Script', cursive", fontWeight: "700", fontStyle: "normal" },
  { fontFamily: "'DM Serif Display', serif", fontWeight: "400", fontStyle: "normal" },
  { fontFamily: "'Amatic SC', cursive", fontWeight: "700", fontStyle: "normal" },
  { fontFamily: "'Cinzel Decorative', serif", fontWeight: "400", fontStyle: "normal" },
  { fontFamily: "'Caveat', cursive", fontWeight: "700", fontStyle: "normal" },
  { fontFamily: "'Lora', serif", fontWeight: "600", fontStyle: "italic" },
  { fontFamily: "'Marck Script', cursive", fontWeight: "400", fontStyle: "normal" },
  { fontFamily: "'Sacramento', cursive", fontWeight: "400", fontStyle: "normal" },
  { fontFamily: "'Bonheur Royale', cursive", fontWeight: "400", fontStyle: "normal" },
  { fontFamily: "'Parisienne', cursive", fontWeight: "400", fontStyle: "normal" },
];

const First5Seconds = memo(({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const helloRef = useRef(null);

  // 1. Programmatically load web fonts with a safety timeout fallback
  useEffect(() => {
    const webFonts = [
      // Inter
      "400 16px 'Inter'",
      "700 16px 'Inter'",
      "900 16px 'Inter'",
      "italic 400 16px 'Inter'",
      "italic 700 16px 'Inter'",
      "italic 900 16px 'Inter'",

      // Pacifico
      "400 16px 'Pacifico'",

      // Great Vibes
      "400 16px 'Great Vibes'",

      // Sacramento
      "400 16px 'Sacramento'",

      // Playfair Display
      "400 16px 'Playfair Display'",
      "600 16px 'Playfair Display'",
      "700 16px 'Playfair Display'",
      "italic 400 16px 'Playfair Display'",
      "italic 700 16px 'Playfair Display'",

      // Dancing Script
      "400 16px 'Dancing Script'",
      "600 16px 'Dancing Script'",
      "700 16px 'Dancing Script'",

      // Caveat
      "400 16px 'Caveat'",
      "700 16px 'Caveat'",

      // New Web Fonts
      "400 16px 'Allura'",
      "700 16px 'Cormorant Garamond'",
      "italic 600 16px 'Lora'",
      "700 16px 'Merriweather'",
      "400 16px 'Cinzel Decorative'",
      "400 16px 'Bebas Neue'",
      "400 16px 'Permanent Marker'",
      "700 16px 'Amatic SC'",
      "400 16px 'Parisienne'",
      "400 16px 'Marck Script'",
      "400 16px 'DM Serif Display'",
      "400 16px 'Bonheur Royale'",
    ];

    let active = true;

    // Load each web font spec using the FontFaceSet API
    const fontPromises = webFonts.map(spec =>
      document.fonts.load(spec).catch(err => {
        console.warn(`Font load failed or bypassed for: ${spec}`, err);
        return [];
      })
    );

    // Timeout fallback of 1200ms to make sure the app works even offline or on extremely slow networks
    const safetyTimeout = window.setTimeout(() => {
      if (active) {
        console.warn("Font loading safety timeout reached. Proceeding with fallback fonts.");
        setFontsReady(true);
      }
    }, 1200);

    Promise.all(fontPromises).then(() => {
      if (active) {
        window.clearTimeout(safetyTimeout);
        setFontsReady(true);
      }
    });

    return () => {
      active = false;
      window.clearTimeout(safetyTimeout);
    };
  }, []);

  // 2. Start steps timers once fonts are ready
  useEffect(() => {
    if (!fontsReady) return undefined;

    // 2.7s for typography sequence to finish, then reveal I'm YASHWANTH (step 1)
    const helloTimer = window.setTimeout(() => setStep(1), 2700);
    const taglineTimer = window.setTimeout(() => setStep(2), 3800);
    const completeTimer = window.setTimeout(onComplete, 4800);

    return () => {
      window.clearTimeout(helloTimer);
      window.clearTimeout(taglineTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, fontsReady]);

  // 3. GSAP style-shifting timeline (runs only when fonts are ready)
  useEffect(() => {
    if (!fontsReady) return undefined;

    const helloEl = helloRef.current;
    if (!helloEl) return undefined;

    const tl = gsap.timeline();

    // Initial fade-in and slide-up entrance
    tl.fromTo(helloEl,
      { opacity: 0, y: 15, filter: "blur(6px)", scale: 0.94 },
      { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 0.4, ease: "power4.out" }
    );

    // Rapid typography shifting sequence
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

    // Smooth exit transition
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
  }, [fontsReady]);

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

      {/* Hidden container to force browser to cache and initialize all font styles immediately */}
      <div
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -9999,
          height: 0,
          width: 0,
          overflow: "hidden",
          whiteSpace: "nowrap"
        }}
      >
        {TYPOGRAPHY_STYLES.map((style, idx) => (
          <span
            key={idx}
            style={{
              fontFamily: style.fontFamily,
              fontWeight: style.fontWeight,
              fontStyle: style.fontStyle,
            }}
          >
            Hello
          </span>
        ))}
      </div>
    </motion.div>
  );
});

First5Seconds.displayName = "First5Seconds";

export default First5Seconds;
