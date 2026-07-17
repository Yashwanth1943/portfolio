import React from "react";
import "./index.scss";

const About = () => {
  return (
    <div className="about-section-wrapper">
      <div className="about-layout-new">
        
        {/* Left Side Panel: Heading, Intro, and Resume Download Button */}
        <div className="about-info-left">
          <h1 className="about-heading fade-up">About Me</h1>
          <p className="about-text fade-up">
            I&apos;m <strong>Yashwanth</strong>, a passionate <strong>Full Stack Developer</strong> who loves building scalable, modern, and visually appealing web applications. I leverage technologies like <strong>React, Node.js, MongoDB, SQLite,</strong> and <strong>Python</strong> to create clean, functional, and efficient solutions.
          </p>

          <div className="about-action-row fade-up">
            <button
              className="about-resume-btn"
              onClick={() => window.open("https://docs.google.com/document/d/1PX_f7s5vBFJtN2gB9mT3pO59m1vrjbRS/edit?usp=sharing&ouid=108083425254803010176&rtpof=true&sd=true", "_blank")}
            >
              Download Resume
            </button>

            <div className="about-signature-wrapper">
              <span className="sig-prefix">—</span>
              <span className="sig-text">Yashwanth K..</span>
            </div>
          </div>
        </div>

        {/* Right Side Panel: Flat Metric Highlights List */}
        <div className="about-info-right fade-up">
          <div className="about-highlights-list">
            
            <div className="about-highlight-item">
              <span className="item-title">Experience</span>
              <h3 className="item-value">Fresher / Builder</h3>
              <p className="item-desc">Specialized in full-stack web architectures.</p>
            </div>

            <div className="about-highlight-item">
              <span className="item-title">Projects</span>
              <h3 className="item-value">8+ Completed</h3>
              <p className="item-desc">Simulations, trackers, and full-featured clones.</p>
            </div>

            <div className="about-highlight-item">
              <span className="item-title">Tech Stack</span>
              <h3 className="item-value">MERN + Python</h3>
              <p className="item-desc">Proficient in database design, UI, and scripting.</p>
            </div>

            <div className="about-highlight-item">
              <span className="item-title">Location</span>
              <h3 className="item-value">India</h3>
              <p className="item-desc">Andhra Pradesh. Available for remote tasks.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
