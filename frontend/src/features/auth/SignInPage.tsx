import { useNavigate } from 'react-router-dom';
import styles from './SignInPage.module.css';

export default function SignInPage() {
  const navigate = useNavigate();

  const handleMicrosoftSignIn = () => {
    // Navigate to onboarding screen after auth simulation
    navigate('/onboarding');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.cardContainer}>
        {/* Brand Header */}
        <div className={styles.brandRow}>
          <div className={styles.logoBadge}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1 className={styles.brandTitle}>AmiConnect</h1>
        </div>

        {/* Shield Illustration */}
        <div className={styles.illustrationWrapper}>
          <div className={styles.shieldCircle}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <rect x="9" y="11" width="6" height="5" rx="1" />
              <path d="M10 11V9a2 2 0 0 1 4 0v2" />
            </svg>
          </div>
        </div>

        {/* Headings */}
        <div className={styles.textGroup}>
          <h2 className={styles.heading}>Welcome back!</h2>
          <p className={styles.subheading}>
            Sign in with your Amity Microsoft account to continue.
          </p>
        </div>

        {/* Microsoft SSO CTA */}
        <div className={styles.actionGroup}>
          <button className={styles.msButton} onClick={handleMicrosoftSignIn}>
            {/* Microsoft 4-Color Logo */}
            <svg width="20" height="20" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            <span>Continue with Microsoft</span>
          </button>
        </div>

        {/* Footer info */}
        <div className={styles.footerInfo}>
          <p className={styles.privacyNote}>We'll only use your name and email.</p>
          <p className={styles.domainNote}>
            Only <strong>@s.amity.edu</strong> email addresses are allowed.
          </p>
        </div>
      </div>
    </div>
  );
}
