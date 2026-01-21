'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import { memoryStyles as styles } from '../utils/styles';

// --- YOUR MEMORIES (All .webp now) ---
const memories = [
  { 
    id: 1, 
    title: "Memory One", 
    description: "The start of something special.", 
    image: "/photos/1.webp" 
  },
  { 
    id: 2, 
    title: "Memory Two", 
    description: "A beautiful moment captured in time.", 
    image: "/photos/2.webp" 
  },
  { 
    id: 3, 
    title: "Memory Three", 
    description: "Watch this moment come alive.", 
    image: "/photos/3.webp" 
  },
  { 
    id: 4, 
    title: "Memory Four", 
    description: "Adventures and smiles.", 
    image: "/photos/4.webp" 
  },
  { 
    id: 5, 
    title: "Memory Five", 
    description: "One of our favorite clips.", 
    image: "/photos/5.webp" 
  },
  { 
    id: 6, 
    title: "Memory Six", 
    description: "Unforgettable times.", 
    image: "/photos/6.webp" 
  },
  { 
    id: 7, 
    title: "Memory Seven", 
    description: "Just being us.", 
    image: "/photos/7.webp" 
  },
  { 
    id: 8, 
    title: "Memory Eight", 
    description: "Looking forward to more days like this.", 
    image: "/photos/8.webp" // <--- Fixed! Now .webp
  },
  { 
    id: 9, 
    title: "Memory Nine", 
    description: "Closing this chapter with a great memory.", 
    image: "/photos/9.webp" // <--- Fixed! Now .webp
  },
];

export default function MemoryPath() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBlocking, setIsBlocking] = useState(false); 
  
  // --- TOUCH STATE ---
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  // Total slides = 9 Memories + 1 Button Slide = 10 Total
  const totalSlides = memories.length + 1; 

  const handleSlide = (direction) => {
    if (isBlocking) return;
    
    let changed = false;
    if (direction === 'next') {
      if (currentIndex < totalSlides - 1) {
        setCurrentIndex(prev => prev + 1);
        changed = true;
      }
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        changed = true;
      }
    }

    if (changed) {
      setIsBlocking(true);
      setTimeout(() => setIsBlocking(false), 500); 
    }
  };

  const handleWheel = (e) => {
    if (isBlocking) return;
    if (e.deltaY > 30) handleSlide('next');
    else if (e.deltaY < -30) handleSlide('prev');
  };

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

    if (isLeftSwipe) handleSlide('next');
    if (isRightSwipe) handleSlide('prev');
  };

  const isLastSlide = currentIndex === memories.length; 
  const currentMemory = memories[currentIndex];

  return (
    <div 
      className={styles.container}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={handleWheel} 
    >
      
      {/* Left Arrow */}
      <button 
        onClick={() => handleSlide('prev')} 
        className={`${styles.navButtonLeft} ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        ←
      </button>

      {/* Right Arrow */}
      <button 
        onClick={() => handleSlide('next')} 
        className={`${styles.navButtonRight} ${currentIndex === totalSlides - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        →
      </button>

      {/* The Slide Card */}
      <div className={styles.card}>
        
        {isLastSlide ? (
          // --- SLIDE 10: THE BUTTON (Action Slide) ---
          <div className="w-full h-full flex flex-col items-center justify-center bg-pink-50 p-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-pink-600 mb-8 font-serif">
              Ready to Make a New Memory?
            </h2>
            <button 
              onClick={() => router.push('/booth')}
              className="bg-stone-800 hover:bg-stone-700 text-white text-xl md:text-2xl font-bold py-6 px-12 rounded-full shadow-2xl transform transition hover:scale-105"
            >
              Let&apos;s Go to the Photobooth 📸
            </button>
          </div>
        ) : (
          // --- SLIDES 1-9: CONTENT ---
          <>
            <div className={styles.imageSection}>
               <Image 
                 src={currentMemory.image} 
                 alt={currentMemory.title}
                 fill
                 className={styles.image}
                 priority={currentIndex === 0} 
               />
            </div>

            <div className={styles.contentSection}>
               <h2 className={styles.title}>
                 {currentMemory.title}
               </h2>
               
               <p className={styles.description}>
                 "{currentMemory.description}"
               </p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}