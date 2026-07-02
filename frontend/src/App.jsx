import { memo, useState, useEffect, useCallback, lazy, Suspense } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
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

const BackgroundEffects = memo(() => (
  <>
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
    <div className="energy-glow blob-1" aria-hidden="true" />
    <div className="energy-glow blob-2" aria-hidden="true" />
    <div className="energy-glow blob-3" aria-hidden="true" />
  </>
));

BackgroundEffects.displayName = "BackgroundEffects";

const PortfolioContent = memo(({ scrollToSection }) => (
  <div className="app-main-layout">
    <Suspense fallback={<WritingLoader />}>
      <main className="app-main">
        <section id="hero"><Home /></section>
        <section id="about" className="fade-up"><About /></section>
        <section id="skills" className="fade-up"><Skills /></section>
        <section id="education" className="fade-up"><Education /></section>
        <section id="projects" className="fade-up"><Projects /></section>
        <section id="certifications" className="fade-up"><Certificates /></section>
        <section id="achievements" className="fade-up"><Achievements /></section>
        <section id="contact" className="fade-up"><Contact /></section>
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

  useFadeUpOnScroll("main", revealContent);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    // Fallback: Ensure content is revealed even if layout animation callback fails
    setTimeout(() => {
      setRevealContent(true);
    }, 850);
  }, []);

  const handleBrandTransitionComplete = useCallback(() => {
    setRevealContent(true);
  }, []);

  useEffect(() => {
    if (!revealContent) return undefined;

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

    // Re-observe when lazy sections mount under Suspense
    const mutObserver = new MutationObserver(observeAll);
    mutObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutObserver.disconnect();
    };
  }, [revealContent]);

  const scrollToSection = useCallback((id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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
          scrollToSection={scrollToSection}
          showBrand={!showSplash}
          revealContent={revealContent}
          onBrandTransitionComplete={handleBrandTransitionComplete}
        />

        {!showSplash && <BackgroundEffects />}

        {revealContent && (
          <div className="app-content-reveal">
            <AsideBar
              activeSection={activeSection}
              scrollToSection={scrollToSection}
            />

            <PortfolioContent scrollToSection={scrollToSection} />
          </div>
        )}
      </div>
    </LayoutGroup>
  );
};

export default App;
