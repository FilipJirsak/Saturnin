import { useEffect, useState } from 'react';

export const Logo = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <img
      src={isDarkMode ? '/logo-dark.svg' : '/logo-light.svg'}
      alt="Logo"
      className="h-8 w-auto"
    />
  );
};
