import { useState } from 'react';
import { downloadCV } from '../lib/generateCV';
import type { LandingPage } from '../lib/sanity.types';

interface DownloadCVButtonProps {
  data: LandingPage;
  className?: string;
}

export default function DownloadCVButton({ data, className = '' }: DownloadCVButtonProps) {
  const [generating, setGenerating] = useState(false);

  const handleClick = () => {
    setGenerating(true);
    try {
      downloadCV(data);
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
        bg-ink text-bg px-6 py-3 rounded-lg text-sm font-medium
        hover:bg-ink-strong transition-all duration-300
        disabled:opacity-60 disabled:cursor-wait
        shadow-sm hover:shadow-md
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
      <span>{generating ? 'Generating…' : 'Download CV'}</span>
    </button>
  );
}
