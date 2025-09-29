import React, { useEffect } from 'react'
import "./Styles/ImageSlider.css"

const images = [
  "./images/banner1.jpg",
  "./images/banner7.jpg",
  "./images/banner2.jpg",
  "./images/banner3.jpg",
  "./images/banner6.png",
  "./images/banner8.jpg",
  "./images/banner4.png",
  "./images/banner5.png"
]

function ImageSlider() {

  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='image-slider-container'>
      <div className="slider-images" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div className="slider-item" key={index}>
            <img src={image} alt={`Banner ${index + 1}`} />
          </div>
        ))}
      </div>

      <div className="slider-dots">
        {images.map((_, index) => (
          <span className={`dot ${index === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(index)} key={index} />
        ))}
      </div>
    </div>
  )
}

export default ImageSlider
