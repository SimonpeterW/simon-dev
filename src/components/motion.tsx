"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number };

/** Fades and lifts its children into view once, when scrolled into the viewport. */
export function Reveal({ delay = 0, children, ...props }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.7, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Staggers the reveal of direct <RevealItem> children. */
export function RevealGroup({ children, ...props }: HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.7, 0.2, 1] } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
