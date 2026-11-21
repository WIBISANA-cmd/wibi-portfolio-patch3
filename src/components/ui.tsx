import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

/** Turn a CMS link value into a usable href ("about" → "#about"). */
export function normalizeHref(raw?: string): string {
  if (!raw) return '#';
  if (/^(#|\/|https?:|mailto:|tel:)/.test(raw)) return raw;
  return `#${raw}`;
}

export function isExternal(href: string) {
  return /^https?:/.test(href);
}

/** Four-point star used as the design's accent mark. */
export function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 0C12.6 6.4 17.6 11.4 24 12C17.6 12.6 12.6 17.6 12 24C11.4 17.6 6.4 12.6 0 12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

/** Outlined circle holding an icon (contact rows, process steps, CTAs). */
export function IconCircle({
  children,
  size = 'md',
  className = '',
}: {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = { sm: 'w-9 h-9', md: 'w-11 h-11', lg: 'w-14 h-14' };
  return (
    <span
      className={`${sizes[size]} shrink-0 inline-flex items-center justify-center rounded-full border border-accent-line text-ink bg-bg transition-colors ${className}`}
    >
      {children}
    </span>
  );
}

/** Uppercase section title followed by a hairline and an optional action. */
export function SectionHeader({ title, action, id }: { title?: string; action?: ReactNode; id?: string }) {
  if (!title && !action) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1 mb-8 sm:mb-10">
      {title && (
        <h2 id={id} className="font-section-title font-bold uppercase tracking-tight text-ink text-xl sm:text-2xl lg:text-[1.75rem] leading-none shrink-0">
          {title}
        </h2>
      )}
      <span aria-hidden="true" className="h-px flex-1 bg-accent-line min-w-6" />
      {action}
    </div>
  );
}

/** Small uppercase label with a trailing arrow — "VIEW ALL PROJECTS →". */
export function ArrowAction({
  label,
  onClick,
  href,
  expanded,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  expanded?: boolean;
}) {
  const className =
    'group shrink-0 inline-flex items-center gap-3 font-buttons text-[11px] sm:text-xs font-medium uppercase tracking-[0.12em] text-ink-2 hover:text-accent-text transition-colors py-2';
  const content = (
    <>
      {label}
      <ArrowRight
        aria-hidden="true"
        className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${expanded ? 'rotate-[-90deg]' : 'group-hover:translate-x-1'}`}
        strokeWidth={1.25}
      />
    </>
  );
  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-expanded={expanded} className={className}>
      {content}
    </button>
  );
}

/** Page container with the design's side gutters. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-page mx-auto px-4 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}
