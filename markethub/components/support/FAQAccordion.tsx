'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ } from '@/types';
import styles from './FAQAccordion.module.css';

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) {
    return <p className="text-secondary text-center py-8">No FAQs available at this time.</p>;
  }

  return (
    <div className={styles.accordionContainer}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className={`surface-elevated ${styles.faqItem}`}
            data-state={isOpen ? 'open' : 'closed'}
          >
            <button
              className={styles.faqTrigger}
              onClick={() => toggleFAQ(index)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <span>{faq.question}</span>
              <div className={styles.iconWrapper}>
                <ChevronDown size={20} strokeWidth={2} />
              </div>
            </button>
            <div 
              id={`faq-answer-${index}`}
              className={styles.faqContent}
              aria-hidden={!isOpen}
              role="region"
            >
              <div className={styles.faqContentInner}>
                <p className={styles.answerText}>{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
