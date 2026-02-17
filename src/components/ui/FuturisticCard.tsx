"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function FuturisticCard({ children }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-150, 150], [-15, 15]);

  const lightX = useTransform(x, [-150, 150], [0, 100]);
  const lightY = useTransform(y, [-150, 150], [0, 100]);

  const glare = useMotionTemplate`
    radial-gradient(
      300px circle at ${lightX}% ${lightY}%,
      rgba(255,255,255,0.25),
      transparent 60%
    )
  `;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative rounded-3xl p-10 cursor-pointer"
    >
      {/* Glass Layer */}
      <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl" />

      {/* Dynamic Glare */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ background: glare }}
      />

      {/* Gradient Edge Glow */}
      <div className="absolute inset-0 rounded-3xl border border-emerald-400/20 group-hover:border-emerald-400/40 transition duration-500" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
