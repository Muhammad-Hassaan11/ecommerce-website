import styles from './BlobBackground.module.css'

export default function BlobBackground() {
  return (
    <div className={styles.container} aria-hidden="true">
      <div className={`${styles.blob} ${styles.blob1}`}></div>
      <div className={`${styles.blob} ${styles.blob2}`}></div>
      <div className={`${styles.blob} ${styles.blob3}`}></div>
      <div className={`${styles.blob} ${styles.blob4}`}></div>
    </div>
  )
}
