import React, { useState } from "react";

const Carousel = ({ images }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <img
        src={images[current]}
        alt={`slide-${current}`}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          cursor: "pointer",
          fontSize: "24px",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      > &#10094;
      </button>
      <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "40px", 
          height: "40px", 
          cursor: "pointer",
          fontSize: "24px", 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
