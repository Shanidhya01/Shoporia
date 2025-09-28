import React from 'react'
import "./Styles/Rating.css"

function Rating({value, onRatingChange, disabled}) {
  const [hoverRating, setHoverRating] = React.useState(0);
  const [selectedRating, setSelectedRating] = React.useState(value || 0);

  // handle star hover
  const handleMouseEnter= (rating) => {
    if(!disabled){
      setHoverRating(rating);
    }
  }

  //mouse leave
  const handleMouseLeave = () => {
    if(!disabled){
      setHoverRating(0);
    }
  }

  // handle star click
  const handleClick = (rating) => {
    if(!disabled){
      setSelectedRating(rating);
      if(onRatingChange) onRatingChange(rating);
    }
  }

  // function to generate stars
  const generateStars = () => {
    const stars = [];
    for(let i=1; i<=5; i++){
      const isFilled = i <= (hoverRating || selectedRating);
      stars.push(
        <span 
          key={i} 
          className={`star ${isFilled ? 'filled' : 'empty'}`} 
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          style={{PointerEvents : disabled ? 'none' : 'auto'}}
        >
          &#9733;
        </span>
      )
    }
    return stars;
  }

  return (
    <div>
      <div className="rating">
        {generateStars()}
      </div>
    </div>
  )
}

export default Rating
