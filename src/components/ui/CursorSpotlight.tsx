"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { useEffect } from "react";

export default function CursorSpotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const background = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      rgba(16,185,129,0.15),
      transparent 70%
    )
  `;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background }}
    />
  );
}
