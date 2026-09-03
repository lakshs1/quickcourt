import { BottomNav } from '../../components/layout/BottomNav';
import styles from './TimetablePage.module.css';

export default function TimetablePage() {
  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Timetable</h1>
        <span className={styles.v2Badge}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Coming in V2
        </span>
      </header>

      {/* Main Preview */}
      <main className={styles.content}>
        <div className={styles.previewCard}>
          <div className={styles.illustrationWrapper}>
            <div className={styles.calendarIllustration}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div className={styles.clockBadge}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
          </div>

          <h2 className={styles.heading}>See your class schedule here.</h2>
          <p className={styles.subheading}>
            We'll show your Amity timetable once you connect your account.
          </p>

          <button className={styles.learnBtn}>
            Learn more in V2
          </button>
        </div>
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
