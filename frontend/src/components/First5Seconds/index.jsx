import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./index.scss";

const EASE = [0.16, 1, 0.3, 1];
const BRAND_TRANSITION = {
  type: "spring",
  stiffness: 115,
  damping: 24,
  mass: 0.9,
};

const First5Seconds = memo(({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const helloTimer = window.setTimeout(() => setStep(1), 900);
    const taglineTimer = window.setTimeout(() => setStep(2), 2000);
    const completeTimer = window.setTimeout(onComplete, 3000);

    return () => {
      window.clearTimeout(helloTimer);
      window.clearTimeout(taglineTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

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
        <AnimatePresence>
          {step === 0 && (
            <motion.h2
              key="hello"
              className="splash-hello"
              initial={{ opacity: 0, y: 15, scale: 0.94, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(4px)" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              Hello.
            </motion.h2>
          )}
        </AnimatePresence>

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
