"use client";

import { useState } from 'react';
import { Mail, User, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill out all fields.');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setError('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save to local storage conceptually
    try {
      const past = JSON.parse(localStorage.getItem('mh_contact_submissions') || '[]');
      localStorage.setItem('mh_contact_submissions', JSON.stringify([
        ...past, 
        { ...formData, id: Date.now(), date: new Date().toISOString() }
      ]));
    } catch (e) {
      // Ignored for graceful degradation
    }

    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Reset after a few seconds
    setTimeout(() => {
      setStatus('idle');
    }, 4000);
  };

  if (status === 'success') {
    return (
      <div className={`surface-elevated ${styles.successContainer} animate-scale-in`}>
        <div className={styles.successIconWrapper}>
          <CheckCircle2 size={48} className={styles.successIcon} strokeWidth={1.5} />
        </div>
        <h3 className={styles.successTitle}>Message Sent!</h3>
        <p className={styles.successText}>
          Thank you for reaching out. We have received your message and will get back to you shortly.
        </p>
        <button 
          onClick={() => setStatus('idle')} 
          className="btn btn-secondary mt-6"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`surface-elevated ${styles.formContainer} animate-fade-in`}>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>Contact Us</h3>
        <p className={styles.formSubtitle}>Have a question? We're here to help.</p>
      </div>

      {error && (
        <div className={`${styles.errorAlert} animate-slide-down`}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <User size={18} className={styles.inputIcon} />
          <input
            type="text"
            id="name"
            name="name"
            className={`input ${styles.inputWithIcon}`}
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            disabled={status === 'submitting'}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <Mail size={18} className={styles.inputIcon} />
          <input
            type="email"
            id="email"
            name="email"
            className={`input ${styles.inputWithIcon}`}
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            disabled={status === 'submitting'}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <MessageSquare size={18} className={styles.inputIcon} />
          <input
            type="text"
            id="subject"
            name="subject"
            className={`input ${styles.inputWithIcon}`}
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={status === 'submitting'}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <textarea
          id="message"
          name="message"
          className={`input ${styles.textarea}`}
          placeholder="How can we help you?"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          disabled={status === 'submitting'}
        />
      </div>

      <button 
        type="submit" 
        className={`btn btn-primary ${styles.submitBtn} ${status === 'submitting' ? styles.loading : ''}`}
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <span className={styles.loader}></span>
        ) : (
          <>
            <span>Send Message</span>
            <Send size={18} strokeWidth={2} className={styles.submitIcon} />
          </>
        )}
      </button>
    </form>
  );
}
