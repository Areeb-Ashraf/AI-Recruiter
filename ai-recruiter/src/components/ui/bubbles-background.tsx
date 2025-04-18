"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

export function BubblesBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  
  useEffect(() => {
    // Generate random bubbles
    const newBubbles: Bubble[] = [];
    const colorOptions = [
      "from-blue-100/30 to-indigo-200/30", // Light
      "from-blue-200/40 to-indigo-300/40", // Medium
      "from-blue-300/50 to-indigo-400/50", // Darker
      "from-indigo-100/30 to-purple-200/30", // Light purple
      "from-indigo-200/40 to-purple-300/40", // Medium purple
    ];
    
    for (let i = 0; i < 20; i++) {
      const colorIndex = Math.floor(Math.random() * colorOptions.length);
      const baseOpacity = Math.random() * 0.3 + 0.2; // Random opacity between 0.2 and 0.5
      
      newBubbles.push({
        id: i,
        x: Math.random() * 100, // percentage across the screen
        y: Math.random() * 100, // percentage down the screen
        size: Math.random() * 60 + 20, // size in pixels
        duration: Math.random() * 20 + 10, // animation duration in seconds
        delay: Math.random() * 5, // delay in seconds
        color: colorOptions[colorIndex],
        opacity: baseOpacity,
      });
    }
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className={`absolute rounded-full bg-gradient-to-br ${bubble.color} backdrop-blur-sm`}
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.1, 1],
            opacity: [bubble.opacity, bubble.opacity + 0.2, bubble.opacity],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
} 