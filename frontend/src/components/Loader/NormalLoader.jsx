import React from "react";
import "./NormalLoader.scss";

const NormalLoader = () => {
  return (
    <div className="normal-loader-container" aria-label="Loading section...">
      <div className="normal-spinner" />
    </div>
  );
};

export default React.memo(NormalLoader);
