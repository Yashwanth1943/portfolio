import { useState, useEffect, useRef, memo, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiAward, FiEye } from "react-icons/fi";
import "./index.scss";

const withPublicUrl = (src) => {
  if (!src || /^https?:\/\//i.test(src)) {
    return src;
  }

  const base = (import.meta.env.BASE_URL || "").replace(/\/$/, "");
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${base}${path}`;
};

const certificatesData = [
  {
    src: "https://res.cloudinary.com/dn27v5rhi/image/upload/v1773319718/Skyscanner_Certificate_page-0001_xufd2r.jpg",
    title: "Skyscanner Software Engineering Job Simulation Certificate",
    issuer: "Skyscanner",
  },
  {
    src: "https://res.cloudinary.com/dn27v5rhi/image/upload/v1773246485/Deloitte_Data_Analytics_Certification_hirxt8.jpg",
    title: "Deloitte Data Analytics Certification",
    issuer: "Deloitte",
  },
  {
    src: "https://res.cloudinary.com/dn27v5rhi/image/upload/v1755440615/IMFKDOAF37_page-0001_xrrfqt.jpg",
    title: "Industry Ready Certificate",
    issuer: "NXT Wave",
  },
  {
    src: "https://res.cloudinary.com/dn27v5rhi/image/upload/v1752753757/Python_Cirtificate_hmxhfy.png",
    title: "Python Programming",
    issuer: "NXT Wave",
  },
  {
    src: "https://res.cloudinary.com/dn27v5rhi/image/upload/v1752753975/SQL_Cirtificate_tjaxgp.png",
    title: "SQLITE Database Administration",
    issuer: "NXT Wave",
  },
  {
    src: "https://res.cloudinary.com/dn27v5rhi/image/upload/v1752754104/React_Js_Cirtificate_is6fel.png",
    title: "React JS Frontend Web Development",
    issuer: "NXT Wave",
  },
  {
    src: "https://res.cloudinary.com/dn27v5rhi/image/upload/v1752754049/Node_Js_Cirtificate_iondqz.png",
    title: "Node JS Backend Web Development",
    issuer: "NXT Wave",
  },
  {
    src: "https://res.cloudinary.com/dn27v5rhi/image/upload/v1752753055/Build_your_own_static_website_Cirtificate_mazv9e.png",
    title: "Build Your Own Static Website (HTML, CSS, Bootstrap)",
    issuer: "NXT Wave",
  },
  {
    src: "https://res.cloudinary.com/dn27v5rhi/image/upload/v1752753737/Build_your_responsive_website_t3n5qd.png",
    title: "Build Your Own Responsive Website",
    issuer: "NXT Wave",
  },
  {
    src: "https://res.cloudinary.com/dn27v5rhi/image/upload/v1752754016/JavaScript_Cirtificate_j4hhqu.png",
    title: "JavaScript Essentials",
    issuer: "NXT Wave",
  },
  {
    src: "https://res.cloudinary.com/dn27v5rhi/image/upload/v1752754034/Flexbox_Cirtificate_gafzx1.png",
    title: "Responsive Web Design Using Flexbox Layouts",
    issuer: "NXT Wave",
  },
];

const Certificates = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertIndex, setSelectedCertIndex] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [isViewerImageLoaded, setIsViewerImageLoaded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setIsViewerImageLoaded(false);
  }, [selectedCertIndex]);

  const touchStart = useRef(0);
  const touchDistanceRef = useRef(0);
  const viewerRef = useRef(null);

  const N = certificatesData.length;

  const handleCertificateClick = (index) => {
    setSelectedCertIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertIndex(null);
    setZoomScale(1);
  };

  const handlePrevCert = useCallback(() => {
    setSelectedCertIndex((prev) => (prev - 1 + N) % N);
    setZoomScale(1);
  }, [N]);

  const handleNextCert = useCallback(() => {
    setSelectedCertIndex((prev) => (prev + 1) % N);
    setZoomScale(1);
  }, [N]);

  // Preload adjacent images
  useEffect(() => {
    if (selectedCertIndex === null) return;
    const nextIdx = (selectedCertIndex + 1) % N;
    const prevIdx = (selectedCertIndex - 1 + N) % N;

    const imgNext = new Image();
    imgNext.src = withPublicUrl(certificatesData[nextIdx].src);

    const imgPrev = new Image();
    imgPrev.src = withPublicUrl(certificatesData[prevIdx].src);
  }, [selectedCertIndex, N]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isModalOpen || selectedCertIndex === null) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      } else if (e.key === "ArrowRight") {
        handleNextCert();
      } else if (e.key === "ArrowLeft") {
        handlePrevCert();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, selectedCertIndex, handleNextCert, handlePrevCert]);

  // Mouse wheel zoom
  useEffect(() => {
    if (!isModalOpen) return undefined;
    const el = viewerRef.current;
    if (!el) return undefined;

    const handleWheel = (e) => {
      e.preventDefault();
      setZoomScale((prev) => {
        const next = prev + (e.deltaY < 0 ? 0.25 : -0.25);
        return Math.max(1, Math.min(3.5, next));
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isModalOpen, selectedCertIndex]);

  const handleDoubleClick = () => {
    setZoomScale((prev) => (prev > 1 ? 1 : 2.5));
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStart.current = e.touches[0].clientX;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (touchDistanceRef.current > 0) {
        const factor = dist / touchDistanceRef.current;
        setZoomScale((prev) => Math.max(1, Math.min(3.5, prev * factor)));
      }
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchEnd = (e) => {
    touchDistanceRef.current = 0;
    if (e.changedTouches.length === 1 && e.touches.length === 0) {
      if (zoomScale > 1) return;
      const diff = touchStart.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) {
          handleNextCert();
        } else {
          handlePrevCert();
        }
      }
    }
  };

  const visibleCertificates = showAll ? certificatesData : certificatesData.slice(0, 5);

  return (
    <>
      <section className="certificate-section">
        <h1 className="certificate-heading">Certificates</h1>

        <div className="certificates-timeline-container">
          <div className="certificates-timeline-line" />
          
          <div className="certificates-list-flow">
            {visibleCertificates.map((cert, index) => (
              <motion.div
                key={index}
                className="certificate-timeline-row"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => handleCertificateClick(index)}
              >
                <div className="timeline-node">
                  <div className="node-dot" />
                  <span className="node-index">{(index + 1).toString().padStart(2, "0")}</span>
                </div>
                
                <div className="certificate-row-content">
                  <div className="cert-meta">
                    <span className="cert-issuer">{cert.issuer}</span>
                    <span className="cert-award-icon"><FiAward /></span>
                  </div>
                  <h3 className="cert-row-title">{cert.title}</h3>
                </div>

                <div className="certificate-row-action">
                  <button className="cert-row-btn" aria-label="Open viewer">
                    <FiEye className="btn-icon" />
                    <span>View</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="certificates-toggle-row">
            <button 
              className="certificates-toggle-btn"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "View All Certificates"}
            </button>
          </div>
        </div>
      </section>

      {createPortal(
        <AnimatePresence>
          {isModalOpen && selectedCertIndex !== null && (
            <motion.div
              className="document-viewer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            >
              <motion.div
                className="document-viewer-card"
                initial={{ scale: 0.95, y: 16, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 16, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* FIXED HEADER */}
                <header className="viewer-header">
                  <div className="viewer-header-left">
                    <span className="viewer-badge">Certificate Preview</span>
                    <span className="viewer-title">{certificatesData[selectedCertIndex].title}</span>
                  </div>
                  <div className="viewer-header-right">
                    <a
                      href={withPublicUrl(certificatesData[selectedCertIndex].src)}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="viewer-btn"
                    >
                      Download
                    </a>
                    <a
                      href={withPublicUrl(certificatesData[selectedCertIndex].src)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="viewer-btn"
                    >
                      Open Original
                    </a>
                    <button className="viewer-btn close-btn" onClick={handleCloseModal} aria-label="Close">
                      ✕
                    </button>
                  </div>
                </header>

                {/* MAIN CONTENT VIEWPORT */}
                <div
                  className="viewer-viewport"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  ref={viewerRef}
                >
                  <div className="viewer-surface">
                    {!isViewerImageLoaded && (
                      <div className="viewer-image-loader">
                        <div className="viewer-spinner" />
                        <span className="viewer-loading-text">Loading Certificate...</span>
                      </div>
                    )}
                    <motion.img
                      key={selectedCertIndex}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={isViewerImageLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25 }}
                      src={withPublicUrl(certificatesData[selectedCertIndex].src)}
                      alt={certificatesData[selectedCertIndex].title}
                      className="viewer-img"
                      style={{
                        transform: `scale(${zoomScale})`,
                        cursor: zoomScale > 1 ? "grab" : "zoom-in",
                        visibility: isViewerImageLoaded ? "visible" : "hidden",
                        position: isViewerImageLoaded ? "relative" : "absolute"
                      }}
                      onLoad={() => setIsViewerImageLoaded(true)}
                      onDoubleClick={handleDoubleClick}
                      drag={zoomScale > 1}
                      dragConstraints={{ left: -300, right: 300, top: -250, bottom: 250 }}
                      dragElastic={0.15}
                    />
                  </div>

                  {/* Reset Zoom Button float overlay */}
                  {zoomScale > 1 && (
                    <button className="reset-zoom-btn" onClick={() => setZoomScale(1)}>
                      Reset Zoom
                    </button>
                  )}
                </div>

                {/* FIXED FOOTER CONTROLS */}
                {N > 1 && (
                  <footer className="viewer-footer">
                    <button className="nav-btn" onClick={handlePrevCert}>
                      Previous
                    </button>
                    <span className="pagination">
                      {selectedCertIndex + 1} / {N}
                    </span>
                    <button className="nav-btn" onClick={handleNextCert}>
                      Next
                    </button>
                  </footer>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Certificates;
