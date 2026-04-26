'use client';

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import styles from "./ChatWidget.module.css";
import ChatWindow from "./ChatWindow";
import { MessageProps } from "./ChatMessage";

const STORAGE_KEY = "markethub-chat-history-v2";

const INITIAL_MESSAGE: MessageProps = {
  id: "welcome-msg",
  role: "bot",
  content: "Hello! 👋 I am the MarketHub support assistant. You can ask me about products, orders, returns, or anything else!",
  timestamp: new Date().toISOString(),
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages([INITIAL_MESSAGE]);
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
      setMessages([INITIAL_MESSAGE]);
    }
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear chat history?")) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSendMessage = async (text: string) => {
    const newUserMsg: MessageProps = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      // Map existing history to the format expected by our API route
      const apiHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: apiHistory
        })
      });

      const data = await response.json();

      const newBotMsg: MessageProps = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: data.success ? data.reply : "Sorry, the response could not be processed right now.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newBotMsg]);

      // If they closed the widget while bot was typing
      if (!isOpen) {
        setHasUnread(true);
      }

    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        role: "bot",
        content: "Sorry, there is a connection issue. Please check your internet.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.widgetContainer}>
      {isOpen && (
        <ChatWindow 
          onClose={toggleWidget}
          messages={messages}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
          onClearHistory={clearHistory}
        />
      )}
      
      <button 
        className={styles.floatingBtn}
        onClick={toggleWidget}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && hasUnread && <span className={styles.unreadBadge}></span>}
      </button>
    </div>
  );
}
