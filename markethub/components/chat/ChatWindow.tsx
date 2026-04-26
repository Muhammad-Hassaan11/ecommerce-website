'use client';

import React, { useRef, useEffect, useState } from "react";
import { Send, X, Trash2 } from "lucide-react";
import styles from "./ChatWidget.module.css";
import ChatMessage, { MessageProps } from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

interface ChatWindowProps {
  onClose: () => void;
  messages: MessageProps[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
}

export default function ChatWindow({ 
  onClose, 
  messages, 
  isTyping, 
  onSendMessage,
  onClearHistory
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className={styles.chatWindow}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h3>MarketHub Support 💬</h3>
          <p>Typically replies instantly</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={onClearHistory} className={styles.iconBtn} aria-label="Clear Chat" title="Clear Chat">
            <Trash2 size={18} />
          </button>
          <button onClick={onClose} className={styles.iconBtn} aria-label="Close Chat">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className={styles.messageList}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.85rem', marginTop: 'auto', marginBottom: 'auto' }}>
            Send a message to start chatting!
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Apna sawal likhein..."
          className={styles.input}
          disabled={isTyping}
        />
        <button type="submit" className={styles.sendBtn} disabled={!inputValue.trim() || isTyping}>
          <Send size={18} style={{ transform: 'translateX(-1px) translateY(1px)' }} />
        </button>
      </form>
    </div>
  );
}
