'use client';

import { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="px-2 py-1 text-sm border rounded"
    >
      {theme === 'light' ? 'Dark mode' : 'Light mode'}
    </button>
  );
};

export default ThemeToggle;
