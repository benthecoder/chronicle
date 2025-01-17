'use client';

import { motion } from 'framer-motion';

export function LoadingIntro({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
      transition={{ duration: 1 }}
    >
      <div className="text-center">
        <motion.h1
          className="text-4xl font-bold tracking-tight mb-2 stripe-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Chronicle
        </motion.h1>
        <motion.p
          className="text-[var(--muted)] text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Today&apos;s Stories, Thoughtfully Curated
        </motion.p>
      </div>
    </motion.div>
  );
}
