'use client';

import React from 'react';
import { Sun, Moon, Sunset, Palette } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import styles from './ThemeToggle.module.css';

const themes = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'sunset', label: 'Sunset', icon: Sunset },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <div className={styles.container}>
      <button 
        className={styles.toggleBtn} 
        onClick={() => setOpen(!open)}
        aria-label="Change theme"
      >
        <currentTheme.icon size={18} />
        <span className={styles.label}>{currentTheme.label}</span>
      </button>

      {open && (
        <>
          <div className={styles.overlay} onClick={() => setOpen(false)} />
          <div className={styles.dropdown}>
            {themes.map((t) => (
              <button
                key={t.id}
                className={`${styles.item} ${theme === t.id ? styles.active : ''}`}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
              >
                <t.icon size={16} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
