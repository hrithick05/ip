"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

type AnimatedCounterProps = {
  to: number;
  suffix?: string;
};

export function AnimatedCounter({ to, suffix = "" }: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    const controls = animate(count, to, { duration: 1.2, ease: "easeOut" });
    return () => controls.stop();
  }, [count, to]);

  return (
    <motion.span>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}
