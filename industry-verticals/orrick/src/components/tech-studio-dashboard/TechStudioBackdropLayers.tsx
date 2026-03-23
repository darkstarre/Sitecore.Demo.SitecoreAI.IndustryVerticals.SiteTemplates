'use client';

import styles from './tech-studio-experience.module.css';

/**
 * Background stack: CSS aurora drift + optional looping GIF (`/public/tech-studio-loop.gif`)
 * + mesh/grid. GIF is hidden on load error or when `prefers-reduced-motion` is set (CSS).
 */
export function TechStudioBackdropLayers() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className={styles.auroraMesh} />
      {/* Animated GIF — replace `tech-studio-loop.gif` with a licensed asset for production if needed */}
      {/* eslint-disable-next-line @next/next/no-img-element -- native img preserves GIF animation */}
      <img
        src="/tech-studio-loop.gif"
        alt=""
        className={styles.gifBackdrop}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="absolute -top-[40%] left-1/2 h-[min(100rem,120vh)] w-[min(100rem,120vw)] -translate-x-1/2 rounded-[100%] bg-gradient-to-b from-cyan-400/25 via-blue-600/15 to-transparent blur-3xl dark:from-cyan-500/20 dark:via-blue-500/10" />
      <div className="absolute top-[20%] -right-[10%] h-[28rem] w-[28rem] rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-500/25" />
      <div className="absolute bottom-0 left-[-20%] h-[24rem] w-[24rem] rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-400/15" />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.07)_1px,transparent_1px)] bg-[size:44px_44px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)]"
        style={{ maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)' }}
      />
    </div>
  );
}
