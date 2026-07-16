import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiBookOpen } from 'react-icons/fi';
import './index.scss';

const achievementsData = [
  {
    title: "Skyscanner Software Engineering Simulation",
    issuer: "Skyscanner",
    description: "Completed tasks covering system architecture design Microservices structures and micro frontend building blocks.",
    type: "simulation"
  },
  {
    title: "Deloitte Data Analytics Simulation",
    issuer: "Deloitte",
    description: "Prepared analytical models, customized dashboard displays, and derived strategic business insights.",
    type: "simulation"
  },
  {
    title: "Industry-Ready Certification",
    issuer: "NxtWave",
    description: "Certified for demonstrating job-ready competency in modern UI development, database optimization, and API scripting.",
    type: "certification"
  },
  {
    title: "Web Development & React.js Certification",
    issuer: "NxtWave CCBP Academy",
    description: "Demonstrated skills in React architecture design, context API state modeling, and responsive styles.",
    type: "certification"
  },
  {
    title: "Python & SQL Certification",
    issuer: "NxtWave CCBP Academy",
    description: "Completed courses in relational database query construction, indexing, and Python backend automation scripting.",
    type: "certification"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const Achievements = () => {
  return (
    <div className="achievements-container">
      <h1 className="achievements-title">Achievements</h1>
      <motion.div 
        className="achievements-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {achievementsData.map((item, index) => (
          <motion.div 
            key={index} 
            variants={cardVariants}
            className="achievement-card"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <span className="achievement-watermark">{`0${index + 1}`}</span>

            <div className="achievement-card-header">
              <span className="achievement-badge">{item.issuer}</span>
              <span className="achievement-icon-wrapper">
                {item.type === 'simulation' ? (
                  <FiAward className="achievement-icon" />
                ) : (
                  <FiBookOpen className="achievement-icon" />
                )}
              </span>
            </div>

            <h2 className="achievement-card-title">{item.title}</h2>
            <p className="achievement-card-desc">{item.description}</p>
            <div className="achievement-glow-bar" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Achievements;
