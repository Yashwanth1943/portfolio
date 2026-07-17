import React, { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import "./index.scss";

const REQUEST_TIMEOUT_MS = 25000;
const HEALTH_TIMEOUT_MS = 15000;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverState, setServerState] = useState("checking");

  useEffect(() => {
    if (status.text && status.type !== "info") {
      const timer = setTimeout(() => {
        setStatus({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const API_BASE = (
    import.meta.env.VITE_API_BASE ||
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://portofolio-1-1kys.onrender.com")
  ).replace(/\/+$/, "");

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/health`, {
          method: "GET",
          signal: controller.signal,
        });

        if (res.ok || res.status === 404) {
          setServerState("ready");
        } else if (res.status === 503 || res.status === 502) {
          setServerState("waking");
        } else {
          setServerState("down");
        }
      } catch (err) {
        setServerState("down");
      } finally {
        clearTimeout(timeoutId);
      }
    };

    checkHealth();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [API_BASE]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (status.text) {
      setStatus({ text: "", type: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (serverState === "waking" || serverState === "down") {
      setStatus({ text: "Trying to send message...", type: "info" });
    }

    setIsSubmitting(true);
    setStatus({ text: "Sending...", type: "info" });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      let payload = null;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        payload = await response.json();
      }

      if (response.ok) {
        setServerState("ready");
        setStatus({ text: payload?.message || "Message sent successfully.", type: "success" });
        setFormData({ name: "", email: "", message: "" });
      } else if (response.status === 400) {
        setStatus({ text: payload?.error || "Please fill in the required fields.", type: "error" });
      } else if (response.status === 503) {
        setServerState("waking");
        setStatus({
          text: payload?.error || "Server is waking up. Please try again in a few seconds.",
          type: "warning"
        });
      } else if (response.status >= 500) {
        setStatus({ text: payload?.error || "Server error. Please try again later.", type: "error" });
      } else {
        setStatus({ text: payload?.error || "Request failed. Please try again.", type: "error" });
      }
    } catch (err) {
      setServerState("down");
      if (err.name === "AbortError") {
        setStatus({ text: "Server is taking longer than expected. Please try again shortly.", type: "warning" });
      } else if (err instanceof TypeError) {
        setStatus({ text: "Unable to reach server. Check your connection and try again.", type: "error" });
      } else {
        setStatus({ text: "Server error. Please try again.", type: "error" });
      }
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-section">
      <div className="contact-layout">

        {/* Left Side Panel: Heading and Intro Summary */}
        <div className="contact-info-panel">
          <h1 className="contact-title">Let's Connect</h1>
          <p className="contact-summary">
            I'm currently open to full-time opportunities, freelance projects, and meaningful collaborations. If you have a role, project, or idea in mind, let's work together to create something impactful. Send me a message below or connect with me on <a href="https://www.linkedin.com/in/yasvanth-kosuri-007722195" target="_blank" rel="noopener noreferrer" className="contact-linkedin-link">LinkedIn <FiArrowUpRight className="link-arrow" /></a>.
          </p>

          <div className="contact-badge-status">
            <span className="status-dot"></span>
            Available for new opportunities
          </div>
        </div>

        {/* Right Side Panel: Contact Form (Cardless layout) */}
        <div className="contact-form-container">
          <form className="modern-contact-form" onSubmit={handleSubmit}>
            <div className="form-group-modern">
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
              />
              <label htmlFor="contact-name">Your Name</label>
            </div>

            <div className="form-group-modern">
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
              />
              <label htmlFor="contact-email">Your Email</label>
            </div>

            <div className="form-group-modern">
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder=" "
              ></textarea>
              <label htmlFor="contact-message">Your Message</label>
            </div>

            <button className={`modern-submit-btn ${status.type || ""}`} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : status.type === "success" ? "Message Sent" : status.type === "error" ? "Error Sending" : "Send Message"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
