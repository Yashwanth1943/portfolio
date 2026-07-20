import { memo, useState, useEffect, useCallback, lazy, Suspense } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Header from "./components/Header";
import AsideBar from "./components/AsideBar";
import First5Seconds from "./components/First5Seconds";
import SideRays from "./components/SideRays/SideRays";
import useFadeUpOnScroll from "./hooks/useFadeUpOnScroll";
import WritingLoader from "./components/Loader";
import "./App.scss";

const Home = lazy(() => import("./components/Home"));
const About = lazy(() => import("./components/About"));
const Skills = lazy(() => import("./components/Skills"));
const Education = lazy(() => import("./components/Education"));
const Projects = lazy(() => import("./components/Projects"));
const Certificates = lazy(() => import("./components/Certificates"));
const Achievements = lazy(() => import("./components/Achievements"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

const BackgroundEffects = memo(({ showRays }) => (
  <>
    {showRays && (
      <div className="app-side-rays" aria-hidden="true">
        <SideRays
          speed={1.6}
          rayColor1="#a78bfa"
          rayColor2="#38bdf8"
          intensity={2}
          spread={2.4}
          origin="top-right"
          tilt={-8}
          saturation={1.5}
          blend={0.6}
          falloff={1.6}
          opacity={0.75}
        />
      </div>
    )}
    <div className="energy-glow blob-1" aria-hidden="true" />
    <div className="energy-glow blob-2" aria-hidden="true" />
    <div className="energy-glow blob-3" aria-hidden="true" />
  </>
));

BackgroundEffects.displayName = "BackgroundEffects";

const PortfolioContent = memo(({ scrollToSection, isTabView, activeSection }) => (
  <div className={`app-main-layout ${isTabView ? "tab-view-mode" : "scroll-view-mode"}`}>
    <Suspense fallback={<WritingLoader />}>
      <main className="app-main">
        <AnimatePresence mode="wait">
          {isTabView ? (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="tab-motion-wrapper"
            >
              {activeSection === "hero" && <Home />}
              {activeSection === "about" && <About />}
              {activeSection === "skills" && <Skills />}
              {activeSection === "education" && <Education />}
              {activeSection === "projects" && <Projects />}
              {activeSection === "certifications" && <Certificates />}
              {activeSection === "achievements" && <Achievements />}
              {activeSection === "contact" && <Contact />}
            </motion.div>
          ) : (
            <>
              <section id="hero"><Home /></section>
              <section id="about" className="fade-up"><About /></section>
              <section id="skills" className="fade-up"><Skills /></section>
              <section id="education" className="fade-up"><Education /></section>
              <section id="projects" className="fade-up"><Projects /></section>
              <section id="certifications" className="fade-up"><Certificates /></section>
              <section id="achievements" className="fade-up"><Achievements /></section>
              <section id="contact" className="fade-up"><Contact /></section>
            </>
          )}
        </AnimatePresence>
      </main>
      <Footer scrollToSection={scrollToSection} />
    </Suspense>
  </div>
));

PortfolioContent.displayName = "PortfolioContent";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [revealContent, setRevealContent] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isTabView, setIsTabView] = useState(false);

  useFadeUpOnScroll("main", revealContent && !isTabView);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    setTimeout(() => {
      setRevealContent(true);
    }, 850);
  }, []);

  const handleBrandTransitionComplete = useCallback(() => {
    setRevealContent(true);
  }, []);

  useEffect(() => {
    if (!revealContent || isTabView) return undefined;

    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection((current) =>
            current === entry.target.id ? current : entry.target.id
          );
        }
      });
    }, observerOptions);

    const observed = new Set();

    const observeAll = () => {
      document.querySelectorAll("section[id]").forEach((section) => {
        if (!observed.has(section)) {
          observer.observe(section);
          observed.add(section);
        }
      });
    };

    observeAll();

    const mutObserver = new MutationObserver(observeAll);
    mutObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutObserver.disconnect();
    };
  }, [revealContent, isTabView]);

  const handleNavigation = useCallback((id) => {
    setActiveSection(id);
    if (isTabView) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isTabView]);

  return (
    <LayoutGroup id="brand-transition">
      <div className="app-container">
        <AnimatePresence>
          {showSplash && (
            <First5Seconds key="splash" onComplete={handleSplashComplete} />
          )}
        </AnimatePresence>

        <Header
          activeSection={activeSection}
          scrollToSection={handleNavigation}
          showBrand={!showSplash}
          revealContent={revealContent}
          onBrandTransitionComplete={handleBrandTransitionComplete}
        />

        {!showSplash && (
          <BackgroundEffects
            showRays={true}
          />
        )}

        {revealContent && (
          <div className="app-content-reveal">
            <AsideBar
              activeSection={activeSection}
              scrollToSection={handleNavigation}
            />

            <PortfolioContent 
              scrollToSection={handleNavigation} 
              isTabView={isTabView}
              activeSection={activeSection}
            />

            {/* Premium Sliding View Mode Toggle Switch */}
            <div className="view-toggle-container">
              <div 
                className="view-toggle-pill" 
                style={{
                  transform: `translateX(${isTabView ? "100%" : "0%"})`
                }}
              />
              <button 
                className={`view-toggle-btn ${!isTabView ? "active" : ""}`}
                onClick={() => setIsTabView(false)}
                aria-label="Switch to scrolling single-page view"
              >
                Scroll
              </button>
              <button 
                className={`view-toggle-btn ${isTabView ? "active" : ""}`}
                onClick={() => setIsTabView(true)}
                aria-label="Switch to tabbed sections view"
              >
                Tabs
              </button>
            </div>
          </div>
        )}
      </div>
    </LayoutGroup>
  );
};

export default App;
