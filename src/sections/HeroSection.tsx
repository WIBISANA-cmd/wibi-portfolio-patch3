import { imageUrl } from '../lib/sanity.client';
import type { HeroData } from '../lib/sanity.types';

export default function HeroSection({ data }: { data: HeroData }) {
  const eyebrow = data.eyebrow ?? '"With Steno, build a legacy, not a bot." — Tony Robbins';
  const heading = data.headline ?? 'Influence\neverywhere.\nAll at once.';
  const subheadline = data.subheadline ?? 'We create AI Twins that turn personal brands into personal relationships, at infinite scale.';
  const bgUrl = data.backgroundImage ? imageUrl(data.backgroundImage, 1200) : 'IMG_8382 2.JPG';
  const bgAlt = data.backgroundImage?.alt || 'AI Twin Subject';
  const ctaLabel = data.ctaLabel ?? 'Start a Demo';
  const rawCtaHref = data.ctaHref ?? '#contact';
  const ctaHref = rawCtaHref.startsWith('#') || rawCtaHref.startsWith('http') || rawCtaHref.startsWith('/')
    ? rawCtaHref
    : `#${rawCtaHref}`;

  return (
    <section className="bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden pt-24 min-h-[calc(100vh-80px)]">
      {/* Main Content Area */}
      <div className="flex-grow flex flex-col lg:flex-row items-center justify-between px-6 md:px-8 lg:px-16 py-8 md:py-12 max-w-[1440px] mx-auto w-full gap-12 lg:gap-8">
        
        {/* Left Column: Text Content */}
        <div className="w-full lg:w-[45%] flex flex-col items-start space-y-6 md:space-y-8 z-10 pt-4 lg:pt-0" data-speed="1.1">
          
          {/* Testimonial/Quote Pill */}
          {eyebrow && (
            <div className="inline-flex items-center bg-[#F3F4F0] border border-gray-200 rounded-full py-1.5 px-3 md:py-2 md:px-4 shadow-sm" data-lag="0.2">
              <div className="bg-[#D3F9B5] rounded-full p-1 md:p-1.5 mr-2 md:mr-3 flex items-center justify-center">
                 <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="md:w-3 md:h-3">
                  <path d="M5 3L19 12L5 21V3Z" />
                </svg>
              </div>
              <p className="text-xs md:text-sm text-gray-800 italic">
                {eyebrow}
              </p>
            </div>
          )}

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[1.05] font-serif text-[#1A1A1A] tracking-tight whitespace-pre-line">
            {heading}
          </h1>

          {/* Subheadline */}
          {subheadline && (
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-md md:max-w-lg font-normal leading-relaxed">
              {subheadline}
            </p>
          )}

          {/* CTA Button */}
          {ctaLabel && ctaHref && (
            <a href={ctaHref} className="bg-[#2A2A2A] text-white px-6 md:px-8 py-3 md:py-3.5 rounded-lg text-sm md:text-base font-medium hover:bg-black transition-colors shadow-md mt-2 md:mt-4">
              {ctaLabel}
            </a>
          )}
        </div>

        {/* Right Column: Image with visual effect */}
        <div className="w-full lg:w-[55%] relative flex justify-center lg:justify-end mt-8 lg:mt-0 pb-8 lg:pb-0" data-speed="0.95">
          
          {/* Container for the image and decorative frames to maintain aspect ratio and alignment */}
          <div className="relative w-full max-w-[500px] lg:max-w-[700px] aspect-[4/3] md:aspect-[16/11] lg:aspect-[4/3] xl:aspect-[16/11]">
              
              {/* Decorative outline frames mimicking the stacked card effect - hidden on smaller screens for simplicity */}
              <div className="absolute top-[-3%] right-[-3%] w-full h-full border border-gray-300 rounded-3xl transform rotate-[3deg] -z-30 hidden lg:block"></div>
              <div className="absolute top-[-1.5%] right-[-1.5%] w-full h-full border border-gray-400 rounded-3xl transform rotate-[1.5deg] -z-20 hidden lg:block"></div>
              
              {/* Main Image Container */}
              <div className="absolute inset-0 w-full h-full rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-2xl bg-gray-200">
                <img 
                  src={bgUrl} 
                  alt={bgAlt} 
                  className="w-full h-full object-cover object-top lg:object-center transform scale-105"
                />
              </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
