import { useState, useEffect, useRef } from 'react';
import './index.scss';

const educationData = [
  {
    title: "Frontend Developer Intern",
    institution: "Arah Infotech",
    period: "2026 Jun",
    description: "Worked as a Frontend Developer Intern, designing responsive user interfaces, modularizing components, and implementing clean styling patterns across web layouts."
  },
  {
    title: "BSc in Computer Science",
    institution: "Ravulapalem",
    period: "2021 - 2024",
    description: "Completed undergraduate degree with a strong foundation in database systems, internet technologies, software design principles, and object-oriented programming."
  },
  {
    title: "Intermediate Education (MPC)",
    institution: "Siddartha Junior College",
    period: "2019 - 2021",
    description: "Completed higher secondary curriculum with specialization in Mathematics, Physics, and Chemistry."
  },
  {
    title: "Secondary School Certificate",
    institution: "ZP High School",
    period: "2019",
    description: "Successfully graduated secondary school education with high marks."
  }
];

const Education = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-28% 0px -40% 0px", // triggers when item is roughly in the center viewport
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'), 10);
          setActiveIndex(index);
        }
      });
    }, observerOptions);

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="education-container">
      <h1 className="education-title">Education & Experience</h1>
      <div className="timeline">
        {educationData.map((item, index) => (
          <div
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            data-index={index}
            className={`timeline-item ${activeIndex === index ? 'active' : ''}`}
          >
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-period">{item.period}</span>
              <h2 className="timeline-heading">{item.title}</h2>
              <h3 className="timeline-institution">{item.institution}</h3>
              <p className="timeline-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
