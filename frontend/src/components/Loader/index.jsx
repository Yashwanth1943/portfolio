import React from "react";
import "./index.scss";

const WritingLoader = () => {
  return (
    <div className="writing-loader-container" aria-label="Loading page...">
      <div className="writing-loader-content">
        <svg viewBox="0 0 800 200" className="writing-svg">
          <defs>
            <linearGradient id="writing-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            className="writing-text"
          >
            Yashwanth
          </text>
        </svg>
      </div>
    </div>
  );
};

export default React.memo(WritingLoader);
