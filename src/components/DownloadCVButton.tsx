import { useState } from 'react';
import { downloadCV } from '../lib/generateCV';
import { useLanguage } from '../lib/i18n';
import type { LandingPage } from '../lib/sanity.types';

interface DownloadCVButtonProps {
  data: LandingPage;
  className?: string;
}

export default function DownloadCVButton({ data, className = '' }: DownloadCVButtonProps) {
  const [generating, setGenerating] = useState(false);
  const { t, lang } = useLanguage();

  const handleClick = () => {
    setGenerating(true);
    try {
      downloadCV(data, { t, lang });
    } finally {
      // Reset after a brief delay
      setTimeout(() => setGenerating(false), 1500);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={generating}
      className={`
        group relative inline-flex items-center gap-2.5
        bg-accent text-on-accent px-5 h-11 rounded-full font-buttons
        text-xs font-semibold uppercase tracking-[0.1em]
        hover:bg-accent-strong transition-colors duration-300
        disabled:opacity-60 disabled:cursor-wait
        ${className}
      `}
    >
      {/* Download Icon */}
      <svg
        className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16"
        />
      </svg>
      <span>{generating ? t('Generating…') : data.cv?.buttonLabel || t('Download CV')}</span>
    </button>
  );
}
