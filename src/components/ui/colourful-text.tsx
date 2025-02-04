"use client";
import React from "react";
import { motion } from "motion/react";

export default function ColourfulText({ text }: { text: string }) {
  const colors = [
    "rgb(100, 149, 237)", // Cornflower Blue
    "rgb(65, 105, 225)", // Royal Blue
    "rgb(106, 90, 205)", // Slate Blue
    "rgb(147, 112, 219)", // Medium Purple
    "rgb(138, 43, 226)", // Blue Violet
    "rgb(75, 0, 130)", // Indigo
    "rgb(72, 209, 204)", // Medium Turquoise
    "rgb(0, 139, 139)", // Dark Cyan
    "rgb(32, 178, 170)", // Light Sea Green
    "rgb(95, 158, 160)", // Cadet Blue
  ];

  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return text.split("").map((char, index) => (
    <motion.span
      key={`${char}-${count}-${index}`}
      initial={{
        y: 0,
      }}
      animate={{
        color: currentColors[index % currentColors.length],
        y: [0, -3, 0],
        scale: [1, 1.01, 1],
        filter: ["blur(0px)", `blur(5px)`, "blur(0px)"],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
      }}
      className="inline-block whitespace-pre font-sans tracking-tight"
    >
      {char}
    </motion.span>
  ));
}
