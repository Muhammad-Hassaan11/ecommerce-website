import { Flame } from 'lucide-react';
import styles from './BestSellerBadge.module.css';

interface BestSellerBadgeProps {
  className?: string;
}

export default function BestSellerBadge({ className = '' }: BestSellerBadgeProps) {
  return (
    <div className={`${styles.badge} ${className}`}>
      <Flame size={14} strokeWidth={2.5} className={styles.icon} />
      <span>Best Seller</span>
    </div>
  );
}
