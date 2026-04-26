'use client';

import { clsx } from "clsx";
import styles from "./ChatWidget.module.css";

export interface MessageProps {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

export default function ChatMessage({ role, content, timestamp }: MessageProps) {
  const isUser = role === "user";

  return (
    <div className={clsx(styles.messageWrapper, isUser ? styles.userMessageWrapper : styles.botMessageWrapper)} style={{ alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
      <div className={isUser ? styles.userMessage : styles.botMessage}>
        {content}
      </div>
      <span className={styles.timestamp}>
        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
