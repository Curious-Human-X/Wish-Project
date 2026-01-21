'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { memoryStyles as styles } from '../utils/styles';

gsap.registerPlugin(ScrollTrigger);

// EDIT THIS ARRAY WITH REAL DATA
const memories = [
  { id: 1, title: "The First Meeting", date: "August 2023", description: "Do you remember that coffee shop? It was raining, and we talked for 3 hours straight.", image: "https://picsum.photos/id/1011/600/400" },
  { id: 2, title: "That Crazy Roadtrip", date: "December 2023", description: "We got lost, the music stopped working, but it was the best drive ever.", image: "https://picsum.photos/id/1015/600/400" },
  { id: 3, title: "Graduation Day", date: "May 2024", description: "We made it! Seeing you smile that day was a highlight.", image: "https://picsum.photos/id/1025/600/400" },
];

export default function MemoryPath() {
  const containerRef = useRef();
  useGSAP(() => {
    const sections = gsap.utils.toArray('.memory-section');
    sections.forEach((section, index) => {
      const xStart = index % 2 === 0 ? -100 : 100;
      gsap.fromTo(section, { opacity: 0, x: xStart }, { opacity: 1, x: 0, duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse" } });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={styles.container}>
      <h2 className={styles.header}>Our Journey</h2>
      <div className={styles.grid}>
        {memories.map((memory, index) => (
          <div key={memory.id} className={styles.section(index)}>
            <div className={styles.imgWrapper}><div className={styles.imgContainer}><Image src={memory.image} alt={memory.title} width={600} height={400} className={styles.img} /></div></div>
            <div className={styles.textWrapper}><div className={styles.dateTag}>{memory.date}</div><h3 className={styles.title}>{memory.title}</h3><p className={styles.description}>{memory.description}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}