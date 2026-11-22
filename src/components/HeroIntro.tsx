"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function HeroIntro({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}
