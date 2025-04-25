import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './LoadingPage.css';

const LoadingPage = () => {
  const navigate = useNavigate();
  const [videoEnded, setVideoEnded] = useState(false);
  
  // Automatically redirect after video ends, or after a timeout if the video doesn't trigger onEnded event
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!videoEnded) {
        navigate('/home');
      }
    }, 15000); // 15 seconds timeout (in case video doesn't trigger onEnded event)
    
    return () => clearTimeout(timer);
  }, [navigate, videoEnded]);
  
  const handleVideoEnded = () => {
    setVideoEnded(true);
    navigate('/home');
  };
  
  const handleGetStarted = () => {
    navigate('/home');
  };
  
  return (
    <div className="loading-container">
      {/* Full screen video container */}
      <div className="video-container">
        <video 
          autoPlay 
          muted 
          className="full-video"
          onEnded={handleVideoEnded}
          onError={(e) => console.error("Video error:", e)}
        >
          <source src="/560_FinalProj_TitleVideo.mp4" type="video/mp4" />
          <source src="/560_FinalProj_TitleVideo.webm" type="video/webm" />
          Your browser does not support the video tag or the video file cannot be loaded.
        </video>
      </div>
    
      
      <button 
        onClick={handleGetStarted}
        className="start-button"
      >
        Let's get started! <ArrowRight />
      </button>
    </div>
  );
};

export default LoadingPage;