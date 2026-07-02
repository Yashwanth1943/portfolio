import React from "react";
import "./index.scss";

const About = () => {
  return (
    <section className="about-page">
      <div className="about-shell">
        <header className="about-intro">
          <h1 className="about-heading fade-up">About Me</h1>
          <p className="about-text fade-up">
            I&apos;m <strong>Yashwanth</strong>, a passionate <strong>Full Stack Developer </strong>
            who loves building scalable, modern, and visually appealing web
            applications. I work with technologies like <strong>React, Node.js, MongoDB,</strong>
            <strong> SQLite,</strong> and <strong>Python</strong> to create clean,
            functional, and efficient solutions.
          </p>
        </header>
      </div>
      <div className="resume-wrapper fade-up">
        <button
          className="resume-btn"
          onClick={() => window.open("https://docs.google.com/document/d/1PX_f7s5vBFJtN2gB9mT3pO59m1vrjbRS/edit?usp=sharing&ouid=108083425254803010176&rtpof=true&sd=true", "_blank")}
        >
          Download Resume
        </button>
      </div>
      <div className="signature-wrapper fade-up">
        <span className="signature-prefix">—</span>
        <svg viewBox="0 0 350 100" className="about-signature-svg">
          <text
            x="10"
            y="65"
            className="about-signature-text"
          >
            Yashwanth K..
          </text>
        </svg>
      </div>
    </section>
  );
};

export default About;
