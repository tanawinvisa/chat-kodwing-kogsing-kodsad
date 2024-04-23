'use client'
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useEffect, useState } from 'react';

const ThemeButton = () => {
  const [theme, setTheme] = useState('light');

  // Apply the theme class on initial render and when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Toggle the theme state
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div onClick={toggleTheme} className="cursor-pointer rounded-full flex justify-center items-center w-[30px] h-[30px] border-black border-[2px]">
        {   
        theme === 'light' ?
          <LightModeIcon className="text-[20px]"/>
        : 
          <DarkModeIcon className="text-[20px]"/>
        }
    </div>

  );
};

export default ThemeButton;
