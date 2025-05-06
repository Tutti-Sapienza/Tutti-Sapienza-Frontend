import React from 'react';
import tuttiGirlImage from '../assets/images/tutti girl with headset.jpg';

function Hero() {
  return (
    <div className="hero-section">
      <img src={tuttiGirlImage} alt="Tutti Sapienza girl with headset" />
      <h1>Welcome to Tutti Sapienza</h1>
    </div>
  );
}

export default Hero;
