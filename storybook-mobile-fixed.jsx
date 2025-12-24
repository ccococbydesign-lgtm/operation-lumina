import React, { useState, useEffect } from 'react';

const InteractiveStorybook = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);

  // Minimum swipe distance for page turn
  const minSwipeDistance = 50;

  const story = [
    {
      title: "The Ocean Guardian",
      content: "For centuries, Aurora protected the ocean and its creatures with her water magic. She was Marina Lumina, guardian of the deep waters.",
      image: "🌊"
    },
    {
      title: "The Watcher",
      content: "At the North Pole, Aurora became Head of Security. She watched children from afar, making lists of who was naughty and nice. But something felt wrong.",
      image: "👁️"
    },
    {
      title: "The Day Everything Changed",
      content: "One day, a seven-year-old boy named Leo was drowning in the ocean. Aurora had been watching from afar. She dove in and saved him.",
      image: "🆘"
    },
    {
      title: "The Question",
      content: "After Leo stopped coughing, he looked at Aurora and asked: 'Why were you watching instead of helping?' That simple question changed everything.",
      image: "💭"
    },
    {
      title: "Operation Lumina Begins",
      content: "Aurora realized children don't need to be watched and judged. They need to be seen, understood, and helped to grow. Leo became Founding Agent #001.",
      image: "⭐"
    },
    {
      title: "Your Journey Begins",
      content: "Now Aurora needs YOU. Will you join Leo and become a Founding Agent? Your adventure awaits, and your intent is what matters most!",
      image: "🌟"
    }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const goToNextPage = () => {
    if (currentPage < story.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Handle audio ended
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  // Touch handlers for swipe gestures
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextPage();
    }
    if (isRightSwipe) {
      goToPrevPage();
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Georgia', serif",
      background: '#0a0a0a',
      overflow: 'hidden'
    }}>
      {/* Book Container */}
      <div 
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: isMobile ? '0' : '20px',
          boxShadow: isMobile ? 'none' : '0 20px 60px rgba(0,0,0,0.5)',
          width: isMobile ? '100%' : 'min(90vw, 800px)',
          height: isMobile ? '100%' : 'min(90vh, 600px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Decorative Stars Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(255,215,0,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,215,0,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        {/* Audio Narration Button */}
        <button
          onClick={toggleAudio}
          style={{
            position: 'absolute',
            top: isMobile ? '15px' : '20px',
            right: isMobile ? '15px' : '20px',
            width: isMobile ? '50px' : '60px',
            height: isMobile ? '50px' : '60px',
            borderRadius: '50%',
            background: isPlaying 
              ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' 
              : 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
          }}
          aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
        >
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src="aurora-story-narration.mp3" preload="auto" />

        {/* Page Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '20px' : '40px 30px',
          position: 'relative',
          zIndex: 1,
          opacity: isFlipping ? 0 : 1,
          transform: isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
          transition: 'all 0.3s ease',
          transformStyle: 'preserve-3d'
        }}>
          {/* Emoji Icon */}
          <div style={{
            fontSize: isMobile ? 'clamp(60px, 15vw, 100px)' : '80px',
            marginBottom: isMobile ? '20px' : '30px',
            animation: 'float 3s ease-in-out infinite'
          }}>
            {story[currentPage].image}
          </div>

          {/* Title */}
          <h2 style={{
            color: '#ffd700',
            fontSize: isMobile ? 'clamp(20px, 6vw, 32px)' : 'clamp(24px, 5vw, 36px)',
            marginBottom: isMobile ? '15px' : '20px',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            padding: '0 10px'
          }}>
            {story[currentPage].title}
          </h2>

          {/* Story Text */}
          <p style={{
            color: '#e0e0e0',
            fontSize: isMobile ? 'clamp(14px, 4vw, 18px)' : 'clamp(16px, 3.5vw, 20px)',
            lineHeight: '1.8',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            {story[currentPage].content}
          </p>
        </div>

        {/* Navigation Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMobile ? '15px 20px' : '20px 30px',
          background: 'rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 2,
          flexShrink: 0
        }}>
          {/* Previous Button */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0 || isFlipping}
            style={{
              background: currentPage === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,215,0,0.2)',
              border: '2px solid rgba(255,215,0,0.5)',
              color: currentPage === 0 ? '#666' : '#ffd700',
              padding: isMobile ? '10px 15px' : '12px 24px',
              borderRadius: '10px',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: 'bold',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              minWidth: isMobile ? '70px' : '100px',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            ← {isMobile ? '' : 'Previous'}
          </button>

          {/* Page Indicator */}
          <div style={{
            display: 'flex',
            gap: isMobile ? '6px' : '8px',
            alignItems: 'center'
          }}>
            {story.map((_, index) => (
              <div
                key={index}
                style={{
                  width: index === currentPage ? (isMobile ? '20px' : '30px') : (isMobile ? '8px' : '10px'),
                  height: isMobile ? '8px' : '10px',
                  borderRadius: '5px',
                  background: index === currentPage ? '#ffd700' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  touchAction: 'manipulation'
                }}
                onClick={() => {
                  if (!isFlipping && index !== currentPage) {
                    setIsFlipping(true);
                    setTimeout(() => {
                      setCurrentPage(index);
                      setIsFlipping(false);
                    }, 300);
                  }
                }}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === story.length - 1 || isFlipping}
            style={{
              background: currentPage === story.length - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,215,0,0.2)',
              border: '2px solid rgba(255,215,0,0.5)',
              color: currentPage === story.length - 1 ? '#666' : '#ffd700',
              padding: isMobile ? '10px 15px' : '12px 24px',
              borderRadius: '10px',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: 'bold',
              cursor: currentPage === story.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              minWidth: isMobile ? '70px' : '100px',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            {isMobile ? '' : 'Next'} →
          </button>
        </div>

        {/* Swipe Hint (Mobile Only) */}
        {isMobile && (
          <div style={{
            position: 'absolute',
            bottom: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,215,0,0.6)',
            fontSize: '12px',
            textAlign: 'center',
            pointerEvents: 'none',
            animation: 'fadeInOut 3s ease-in-out infinite'
          }}>
            ← Swipe to turn pages →
          </div>
        )}

        {/* Narration Label */}
        <div style={{
          position: 'absolute',
          top: isMobile ? '72px' : '85px',
          right: isMobile ? '15px' : '20px',
          color: isPlaying ? '#ff6b6b' : '#60a5fa',
          fontSize: isMobile ? '10px' : '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          pointerEvents: 'none',
          textAlign: 'center',
          zIndex: 10
        }}>
          {isPlaying ? '🎵 Playing' : '🎧 Narration'}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }

        button {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          width: 100%;
          height: 100%;
          position: fixed;
        }
      `}</style>
    </div>
  );
};

export default InteractiveStorybook;
