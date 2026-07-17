import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiBookOpen } from 'react-icons/fi';
import './index.scss';

const achievementsData = [
  {
    title: "Skyscanner Software Engineering Simulation",
    issuer: "Skyscanner",
    description: "Completed tasks covering system architecture design, Microservices structures, and micro frontend building blocks.",
    type: "simulation"
  },
  {
    title: "Deloitte Data Analytics Simulation",
    issuer: "Deloitte",
    description: "Prepared analytical models, customized dashboard displays, and strategic business insights.",
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
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const Achievements = () => {
  return (
    <div className="achievements-container">
      <h1 className="achievements-title">Achievements</h1>
      
      <motion.div 
        className="achievements-highlight-list"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {achievementsData.map((item, index) => {
          const isSkyscanner = index === 0;
          return (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className={`achievement-highlight-item ${isSkyscanner ? 'featured-achievement' : ''}`}
            >
              <div className="achievement-stat-number">
                {`0${index + 1}`}
              </div>
              
              <div className="achievement-details">
                <div className="achievement-header-info">
                  <span className="achievement-tag-issuer">{item.issuer}</span>
                  <span className="achievement-badge-type">
                    <span className="type-icon">
                      {item.type === 'simulation' ? <FiAward /> : <FiBookOpen />}
                    </span>
                    {item.type}
                  </span>
                </div>
                <h2 className="achievement-title-text">{item.title}</h2>
                <p className="achievement-desc-text">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Achievements;
