import type { Metadata } from 'next';
import { HelpCircle, MessageSquareText } from 'lucide-react';
import { getFAQs } from '@/lib/data/support';
import FAQAccordion from '@/components/support/FAQAccordion';
import ContactForm from '@/components/support/ContactForm';
import styles from './SupportPage.module.css';

export const metadata: Metadata = {
  title: 'Help & Support | MarketHub',
  description: 'Frequently asked questions and contact information for MarketHub.',
};

export default function SupportPage() {
  const faqs = getFAQs();

  return (
    <div className={`container animate-fade-in ${styles.pageWrapper}`}>
      {/* Page Header */}
      <header className={styles.header}>
        <div className={styles.iconCircle}>
          <HelpCircle size={32} strokeWidth={1.5} />
        </div>
        <h1 className={styles.title}>Help & Support</h1>
        <p className={styles.subtitle}>
          Find answers to your questions or get in touch with our team.
        </p>
      </header>

      {/* Two Column Layout for Desktop */}
      <div className={styles.grid}>
        
        {/* Left Column: FAQs */}
        <section className="animate-slide-up delay-100">
          <div className={styles.sectionHeader}>
            <MessageSquareText className={styles.sectionIcon} size={24} />
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>
          <FAQAccordion faqs={faqs} />
        </section>

        {/* Right Column: Contact Form */}
        <section className="animate-slide-up delay-200">
          <div className={styles.stickySide}>
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
