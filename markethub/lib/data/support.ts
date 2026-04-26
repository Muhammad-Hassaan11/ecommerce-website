import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { FAQ } from '@/types';

const faqPath = path.join(process.cwd(), 'data/support/faq.md');

export function getFAQs(): FAQ[] {
  try {
    const fileContents = fs.readFileSync(faqPath, 'utf8');
    const { data } = matter(fileContents);
    
    if (data.faqs && Array.isArray(data.faqs)) {
      return data.faqs as FAQ[];
    }
    
    return [];
  } catch (error) {
    console.warn(`Failed to read FAQ data: ${error}`);
    return [];
  }
}
