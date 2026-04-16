import React from 'react';
import { useTheme } from 'next-themes';

export const Default = () => {
  const { setTheme } = useTheme();

  return (
    <div className="hidden">
      <button
        aria-label="Theme switcher disabled"
        onClick={() => setTheme('light')}
        className={`bg-foreground dark:bg-foreground-dark h-6 w-12 rounded-full p-0.5 text-left transition-colors duration-300`}
      >
        <span
          className={`bg-background dark:bg-background-dark inline-block h-5 w-5 rounded-full transition-all duration-300 dark:translate-x-6`}
        />
      </button>
    </div>
  );
};
