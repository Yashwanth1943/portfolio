import React from "react";
import "./index.scss";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { HiOutlineChevronDoubleUp } from "react-icons/hi2";

const Footer = ({ scrollToSection }) => {
  return (
    <footer className="footer-container">
      <div className="footer-logo-wrapper" onClick={() => scrollToSection("hero")}>
        <img
          className="footer-logo-img"
          src={import.meta.env.BASE_URL + "yashwanth logo.png"}
          alt="Yashwanth Logo"
        />
      </div>

      <nav className="footer-nav" aria-label="Footer navigation">
        <button onClick={() => scrollToSection("hero")}>Home</button>
        <button onClick={() => scrollToSection("about")}>About</button>
        <button onClick={() => scrollToSection("skills")}>Skills</button>
        <button onClick={() => scrollToSection("education")}>Education</button>
        <button onClick={() => scrollToSection("projects")}>Projects</button>
        <button onClick={() => scrollToSection("certifications")}>Certificates</button>
        <button onClick={() => scrollToSection("contact")}>Connect</button>
      </nav>

      <div className="footer-socials">
        <a
          href="https://www.linkedin.com/in/yasvanth-kosuri-007722195"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>

        <a
          href="https://github.com/Yashwanth1943"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
      </div>

      <button
        className="scroll-to-top"
        onClick={() => scrollToSection("hero")}
        aria-label="Scroll to top"
      >
        <HiOutlineChevronDoubleUp />
      </button>
    </footer>
  );
};

export default React.memo(Footer);