import { useEffect, useState } from 'react';
import { animate, AnimatePresence, motion } from 'framer-motion';
import type { PreloaderData } from '../lib/sanity.types';

/** Luxury exit easing used across the reveal. */
const EASE_LUXE = [0.76, 0, 0.24, 1] as const;

const DEFAULT_WORDS = ['3D Modeling', 'Rendering', 'Motion Design', 'Jack'];
const DEFAULT_WORD_MS = 600;
const DEFAULT_BG = '#0C0C0C';
const DEFAULT_TEXT = '#D7E2EA';

interface PreloaderProps {
  data?: PreloaderData;
  /** Fired once the counter reaches 100% (parent then unmounts via AnimatePresence). */
  onComplete: () => void;
}

export default function Preloader({ data, onComplete }: PreloaderProps) {
  const words =
    data?.loadingWords && data.loadingWords.length > 0
      ? data.loadingWords
      : DEFAULT_WORDS;
  const wordMs = data?.animationDuration ?? DEFAULT_WORD_MS;
  const bg = data?.preloaderBgColor || DEFAULT_BG;
  const text = data?.preloaderTextColor || DEFAULT_TEXT;

  const [count, setCount] = useState(0);

  // Lock scrolling while the preloader is mounted. Because AnimatePresence keeps
  // this component mounted until its exit animation finishes, the cleanup (which
  // restores scrolling) runs exactly when the reveal into the page completes.
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      html.style.overflow = prevOverflow;
    };
  }, []);

  // Total run time is derived from the word list × per-word duration, so the
  // counter and the word sequence always finish together (simulated loading).
  useEffect(() => {
    const totalMs = words.length * wordMs;
    const controls = animate(0, 100, {
      duration: totalMs / 1000,
      ease: 'linear',
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        // Small beat on "100%" before the curtain lifts.
        const t = setTimeout(onComplete, 350);
        return () => clearTimeout(t);
      },
    });
    return () => controls.stop();
    // Re-run only if the timing inputs change.
  }, [words.length, wordMs, onComplete]);

  // Which word to show, driven by the counter's progress.
  const wordIndex = Math.min(
    words.length - 1,
    Math.floor((count / 100) * words.length)
  );
  const currentWord = words[wordIndex];

  const glow = `0 0 24px ${hexToRgba(text, 0.28)}, 0 0 2px ${hexToRgba(text, 0.5)}`;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: bg }}
      initial={{ y: 0 }}
      exit={{
        y: '-100%',
        borderBottomLeftRadius: '42% 12%',
        borderBottomRightRadius: '42% 12%',
      }}
      transition={{ duration: 1.1, ease: EASE_LUXE }}
    >
      {/* Word morphing */}
      <div className="relative overflow-hidden px-6">
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentWord}
            className="preloader-word text-center font-black uppercase tracking-tight leading-none text-[12vw] sm:text-[9vw] md:text-[7vw]"
            style={{ color: text, textShadow: glow }}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-110%', opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_LUXE }}
          >
            {currentWord}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Counter */}
      <motion.span
        className="mt-6 font-light tabular-nums tracking-[0.35em] text-sm sm:text-base"
        style={{ color: hexToRgba(text, 0.65) }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {String(count).padStart(2, '0')}%
      </motion.span>

      {/* Thin progress line */}
      <div
        className="absolute bottom-0 left-0 h-[2px]"
        style={{
          width: `${count}%`,
          background: `linear-gradient(90deg, transparent, ${text})`,
        }}
      />
    </motion.div>
  );
}

/** Convert #RGB / #RRGGBB to an rgba() string; falls back to the input on parse fail. */
function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
