import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavLink } from 'react-router-dom';
import ProfileCard from "./ProfileCard";
import './index.scss';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const heroRef = useRef(null);
  const heroPhotoRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(heroRef.current, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      gsap.set(heroRef.current, { opacity: 1 });

      tl.from(".hero-kicker", { opacity: 0, y: 15, duration: 0.6, ease: "power3.out" })
        .from(".hero-heading", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, "-=0.45")
        .from(".hero-subtitle", { opacity: 0, y: 15, duration: 0.6, ease: "power3.out" }, "-=0.55")
        .from(".hero-highlights li", { opacity: 0, y: 10, stagger: 0.08, duration: 0.5, ease: "power2.out" }, "-=0.35")
        .from(".hero-buttons .btn", { opacity: 0, y: 12, stagger: 0.1, duration: 0.5, ease: "power2.out" }, "-=0.35")
        .from(heroPhotoRef.current, { opacity: 0, scale: 0.93, y: 15, duration: 1.0, ease: "back.out(1.2)" }, "-=0.6");
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="home-container">
      <div className="home-sections">
        <section ref={heroRef} className="hero-section">

          {/* Hero content */}
          <div className="hero-layout">
            <div className="hero-copy">
              <p className="hero-kicker">FULL-STACK DEVELOPER</p>

              <h1 className="hero-heading" aria-label="Hi, I'm Yashwanth">
                <span className="hero-heading-prefix">Hi, I&apos;m</span>
                <span className="hero-heading-name">Yashwanth</span>
              </h1>

              <p className="hero-subtitle">
                I build clean, fast, and user-friendly web applications with a
                strong focus on performance, responsiveness, and maintainable architecture.
              </p>

              <ul className="hero-highlights" aria-label="Core strengths">
                <li>Modern responsive UI</li>
                <li>Scalable backend APIs</li>
                <li>Performance-focused builds</li>
              </ul>

              <div className="hero-buttons">
                <NavLink className="btn btn-primary" to="/contact" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}>Get in Touch</NavLink>
                <NavLink className="btn btn-secondary" to="/projects" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}>View My Work</NavLink>
              </div>
            </div>

            <div
              ref={heroPhotoRef}
              className="hero-photo-container"
            >
              <ProfileCard
                name="Yashwanth"
                title="Full Stack Developer"
                handle="yashwanth_kosuri"
                status="Available for Work"
                contactText="Contact Me"
                avatarUrl={import.meta.env.BASE_URL + "profile.png"}
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                onContactClick={() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                behindGlowEnabled={false}
                innerGradient="linear-gradient(180deg, #0d0d12 0%, #0B0B0F 100%)"
              />
            </div>
          </div>

        </section>
      </div>
    </div>
  );
};


export default HomePage;