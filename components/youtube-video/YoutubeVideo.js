import React, { useState, useEffect } from "react";

function YoutubeVideo({ setOpen }) {
  function getWindowDimensions() {
    const { innerWidth: width } = window;
    return {
      width,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
//   const [offset, setOffset] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    const onScroll = () => window.pageYOffset > 100 && setOpen(false);
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleClick = () => {
    setOpen(false);
  };
  return (
    <div className="position-relative">
      <iframe
        width={windowDimensions.width}
        height="500"
        src="https://www.youtube.com/embed/-SqGLNUkM30"
        title="Manifest"
        frameborder="0"
        allow="accelerometer; autoplay: 1; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
      <div
        style={{ right: "20px", top: "10px" }}
        className="rounded-circle radius-5 position-absolute p-3 mb-2 bg-secondary text-white"
      >
        <button
          onClick={handleClick}
          type="button"
          className="btn-close btn-close-white"
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
}

export default YoutubeVideo;
