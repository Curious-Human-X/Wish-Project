'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { toJpeg } from 'html-to-image';
import axios from 'axios';
import Image from 'next/image';
import { boothStyles as styles } from '../utils/styles';

const FILTERS = [
  { name: 'Natural', style: '' },
  { name: 'B&W', style: 'grayscale(1) contrast(1.1)' },
  { name: 'Vintage', style: 'sepia(0.8) contrast(1.2) brightness(0.9)' },
  { name: 'Glam', style: 'saturate(1.5) brightness(1.1)' },
];

export default function Photobooth() {
  const webcamRef = useRef(null);
  const stripRef = useRef(null);
  const shutterSound = useRef(null); 
  const [images, setImages] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [status, setStatus] = useState('idle'); 
  const [finalStripUrl, setFinalStripUrl] = useState(null);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].style); 
  const [flashActive, setFlashActive] = useState(false); 

  useEffect(() => {
    shutterSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3');
    shutterSound.current.volume = 0.6;
  }, []);
  const videoConstraints = { width: 720, height: 720, facingMode: "user" };

  const startPhotobooth = useCallback(() => {
    setIsCapturing(true); setStatus('capturing'); setImages([]); setFinalStripUrl(null);
    let count = 0;
    const takeShot = () => {
      if (count >= 3) { setIsCapturing(false); setStatus('reviewing'); return; }
      let timer = 3; setCountdown(timer);
      const interval = setInterval(() => {
        timer--; setCountdown(timer);
        if (timer === 0) {
          clearInterval(interval);
          if (shutterSound.current) shutterSound.current.play();
          setFlashActive(true); setTimeout(() => setFlashActive(false), 150);
          setTimeout(() => {
             const imageSrc = webcamRef.current.getScreenshot();
             setImages(prev => [...prev, imageSrc]); count++;
             if (count < 3) { setTimeout(takeShot, 1500); } else { setIsCapturing(false); setStatus('reviewing'); }
          }, 200); 
        }
      }, 1000);
    };
    takeShot();
  }, []);

  useEffect(() => {
    if (status === 'reviewing' && stripRef.current && images.length === 3) {
      const autoSaveAndGenerate = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 800)); 
          const generatedImage = await toJpeg(stripRef.current, { quality: 0.8, backgroundColor: '#fdf2f8' }); 
          setFinalStripUrl(generatedImage);
          await axios.post('http://localhost:5000/api/save-memory', { image: generatedImage });
          setStatus('saved');
        } catch (error) { console.error("Auto-save failed", error); }
      };
      autoSaveAndGenerate();
    }
  }, [status, images]);

  const downloadStrip = () => {
    if (finalStripUrl) { const link = document.createElement('a'); link.download = `bday-memory-${Date.now()}.jpg`; link.href = finalStripUrl; link.click(); }
  };
  const createNew = () => { setImages([]); setFinalStripUrl(null); setStatus('idle'); };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>MEMORIES BOOTH</h2>
      {status === 'idle' || status === 'capturing' ? (
        <div className={styles.controlsContainer}>
          {!isCapturing && (<div className={styles.filterContainer}>{FILTERS.map((f) => (<button key={f.name} onClick={() => setActiveFilter(f.style)} className={styles.filterButton(activeFilter === f.style)}>{f.name}</button>))}</div>)}
          <div className={styles.cameraWrapper}>
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} style={{ filter: activeFilter }} className={styles.webcam} />
            <div className={styles.flashOverlay(flashActive)}></div>
            {countdown > 0 && (<div className={styles.countdownOverlay}><span className={styles.countdownText}>{countdown}</span></div>)}
            {!isCapturing && (<button onClick={startPhotobooth} className={styles.startButton}>START SESSION 📸</button>)}
          </div>
        </div>
      ) : null}
      {status !== 'idle' && status !== 'capturing' && (
        <div className={styles.reviewContainer}>
          <div ref={stripRef} className={styles.stripWrapper} style={{ minWidth: '340px' }}>
             <h3 className={styles.stripHeader}>HAPPY BIRTHDAY!</h3>
            <div className={styles.stripImages}>{images.map((img, idx) => (<Image key={idx} src={img} alt="snap" width={300} height={300} unoptimized style={{ filter: activeFilter }} className={styles.stripImage} />))}</div>
            <div className={styles.stripFooter}><p className={styles.footerTitle}>Forever Memories</p><p className={styles.footerDate}>{new Date().toLocaleDateString()}</p></div>
          </div>
          <div className={styles.actionsContainer}>
             {status === 'saving' && (<p className={styles.savingText}>Creating your masterpiece...</p>)}
             {status === 'saved' && (<><div className={styles.savedText}>✨ Saved to Eternity! ✨</div><div className={styles.buttonGroup}><button onClick={createNew} className={styles.btnNew}>New Image 🔄</button><button onClick={downloadStrip} className={styles.btnDownload}>Keep This Forever 💖</button></div></>)}
          </div>
        </div>
      )}
    </div>
  );
}