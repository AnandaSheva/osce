document.addEventListener('DOMContentLoaded', function() {
  const typewriterElements = document.querySelectorAll('.dynamic-text');
  let currentIndex = 0;
  
  // Handle background music
  const backgroundMusic = document.getElementById('background-music');
  let musicStarted = false; // Add flag to prevent multiple plays
  
  // Try to play music immediately
  playBackgroundMusic();
  
  // Add click listener to start music on user interaction (for browsers that block autoplay)
  document.addEventListener('click', playBackgroundMusic);
  document.addEventListener('touchstart', playBackgroundMusic);
  document.addEventListener('keydown', playBackgroundMusic);
  
  function playBackgroundMusic() {
    if (backgroundMusic && !musicStarted) { // Check if music hasn't started yet
      backgroundMusic.volume = 0.3; // Set volume to 30%
      backgroundMusic.play().then(() => {
        musicStarted = true; // Set flag to true after successful play
        console.log('Music started successfully');
      }).catch(error => {
        console.log('Autoplay prevented:', error);
        // Music will start on first user interaction
      });
    }
  }
  
  // Remove the { once: true } from event listeners to prevent re-adding
  // But add the musicStarted flag check to prevent multiple plays
  
  // Start with the first text
  if (typewriterElements.length > 0) {
    startTypewriterSequence();
  }
  
  // Also handle the main title
  const mainTitle = document.querySelector('.main-text');
  if (mainTitle) {
    const text = mainTitle.getAttribute('data-text');
    typeText(mainTitle, text, false); // Don't auto-hide title
  }
  
  function startTypewriterSequence() {
    if (currentIndex < typewriterElements.length) {
      const element = typewriterElements[currentIndex];
      const text = element.getAttribute('data-text');
      const baseDelay = currentIndex === 0 ? 2000 : 500; // First text starts after 2s, others after 500ms
      
      // Hide previous text first
      if (currentIndex > 0) {
        const prevElement = typewriterElements[currentIndex - 1];
        hideText(prevElement);
      }
      
      // Wait for hide animation then show current text
      setTimeout(() => {
        typeText(element, text, true, () => {
          currentIndex++;
          setTimeout(() => {
            if (currentIndex < typewriterElements.length) {
              startTypewriterSequence();
            } else {
              // All typewriter texts are done, show carousel
              showImageCarousel();
            }
          }, 2500); // Wait 2.5 seconds before next text
        });
      }, baseDelay);
    }
  }
  
  function showImageCarousel() {
    // Wait a bit then hide typewriter container and show carousel
    setTimeout(() => {
      const typewriterContainer = document.querySelector('.typewriter-container');
      const imageCarousel = document.querySelector('.image-carousel');
      
      // Fade out typewriter container
      typewriterContainer.classList.add('fade-out');
      
      // After fade out, hide typewriter and show carousel
      setTimeout(() => {
        typewriterContainer.style.display = 'none';
        imageCarousel.style.display = 'block';
        imageCarousel.classList.add('show');
      }, 1000);
    }, 2000); // Wait 2 seconds after last text
  }
});

function typeText(element, text, autoHide = true, callback = null) {
  element.style.opacity = '1';
  element.classList.add('typing');
  element.classList.remove('hidden');
  
  // Create a span for the text and cursor
  element.innerHTML = '<span class="text-content"></span><span class="cursor">|</span>';
  const textSpan = element.querySelector('.text-content');
  const cursor = element.querySelector('.cursor');
  
  let charIndex = 0;
  const typingSpeed = 60; // Typing speed
  
  function addChar() {
    if (charIndex < text.length) {
      textSpan.textContent = text.slice(0, charIndex + 1);
      charIndex++;
      setTimeout(addChar, typingSpeed);
    } else {
      // Finished typing, remove cursor after a delay
      setTimeout(() => {
        cursor.style.display = 'none';
        element.classList.add('finished');
        if (callback) callback();
      }, 800);
    }
  }
  
  addChar();
}

function hideText(element) {
  element.classList.add('hidden');
  setTimeout(() => {
    element.style.opacity = '0';
    element.innerHTML = '';
    element.classList.remove('typing', 'finished', 'hidden');
  }, 400);
}

// Enhanced sparkle effects
function createSparkle() {
  const sparkles = ['✨', '💫', '⭐', '🌟'];
  const sparkle = document.createElement('div');
  sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
  sparkle.style.position = 'fixed';
  sparkle.style.fontSize = Math.random() * 10 + 15 + 'px';
  sparkle.style.pointerEvents = 'none';
  sparkle.style.zIndex = '1000';
  sparkle.style.left = Math.random() * window.innerWidth + 'px';
  sparkle.style.top = Math.random() * window.innerHeight + 'px';
  sparkle.style.animation = 'sparkleFloat 4s ease-out forwards';
  
  document.body.appendChild(sparkle);
  
  setTimeout(() => {
    if (sparkle.parentNode) {
      sparkle.remove();
    }
  }, 4000);
}

// Add enhanced sparkle animation CSS
const sparkleCSS = `
@keyframes sparkleFloat {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-50px) scale(1.2) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-120px) scale(0.3) rotate(360deg);
  }
}

.cursor {
  animation: cursorBlink 1s infinite;
  color: #ffd700;
  font-weight: bold;
}

@keyframes cursorBlink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
`;

const style = document.createElement('style');
style.textContent = sparkleCSS;
document.head.appendChild(style);

// Create sparkles less frequently to avoid clutter
setInterval(createSparkle, 3000);