'use client';

import { clsx } from "clsx";
import styles from "./ChatWidget.module.css";

interface TypingIndicatorProps {
  className?: string;
}

export default function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={clsx(styles.typingIndicator, className)}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
}
