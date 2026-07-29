"use client";

import { useState, useEffect, useCallback } from "react";

const images = [
  "/images/slider/image1.JPG",
  "/images/slider/image2.jpg",
  "/images/slider/image3.jpg",
  "/images/slider/image4.JPG",
];

export function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  return (
    <section className="slider-section" style={{ padding: '60px 0', background: 'var(--bg-primary)', width: '100%', overflow: 'hidden' }}>
      <div 
        className="slider-container" 
        style={{ 
          width: '100%', 
          maxWidth: '1600px', 
          margin: '0 auto', 
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          aspectRatio: '21/9',
          minHeight: '400px',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {images.map((src, index) => (
          <div
            key={src}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentIndex ? 1 : 0,
              transform: `scale(${index === currentIndex ? 1 : 1.05})`,
              transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }}
            />
          </div>
        ))}

        {/* Overlay gradient for better button visibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0.7,
          transition: 'opacity 0.3s ease'
        }} />
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: isHovered ? 1 : 0,
            transition: 'all 0.3s ease',
            color: 'white',
            zIndex: 10
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: isHovered ? 1 : 0,
            transition: 'all 0.3s ease',
            color: 'white',
            zIndex: 10
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

      </div>
    </section>
  );
}
