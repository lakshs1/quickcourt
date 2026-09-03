import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [previewProfiles, setPreviewProfiles] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPreview() {
      try {
        const res = await api.get('/preview/profiles');
        if (res.data.success && res.data.data?.length > 0) {
          setPreviewProfiles(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load preview profiles:', err);
      }
    }
    fetchPreview();
  }, []);

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoBadge}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className={styles.brandName}>AmiConnect</span>
        </div>
        <button className={styles.menuBtn} aria-label="Menu" onClick={() => navigate('/login')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Hero Section */}
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.heroHeader}>
            <span className={styles.tagline}>For Amity Students Only</span>
            <h1 className={styles.headline}>
              Find the right people at Amity to <span className={styles.accent}>work</span>, <span className={styles.accent}>build</span> and <span className={styles.accent}>grow</span> together.
            </h1>
            <p className={styles.subtext}>
              Easier to use than LinkedIn and Instagram for finding the right person at Amity.
            </p>
          </div>

          <div className={styles.ctaWrapper}>
            <button className={styles.primaryCta} onClick={() => navigate('/login')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Sign in to unlock</span>
            </button>
            <span className={styles.ctaNote}>Only for Amity University students (@s.amity.edu)</span>
          </div>
        </section>

        {/* Preview of Connect Feed Card */}
        <section className={styles.previewSection}>
          <div className={styles.previewCardHeader}>
            <div>
              <h3 className={styles.previewTitle}>Preview of Connect Feed</h3>
              <p className={styles.previewSub}>Real profiles. Locked actions.</p>
            </div>
            <span className={styles.lockBadge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Locked
            </span>
          </div>

          {/* Locked Profile Card Slide */}
          <div className={styles.slideContainer}>
            {previewProfiles.map((profile, idx) => (
              <div
                key={profile.id}
                className={`${styles.profilePreviewCard} ${idx === activeSlide ? styles.activeSlide : styles.hiddenSlide}`}
              >
                <div className={styles.cardHeader}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#047857',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '16px'
                  }}>
                    {profile.name?.[0] || 'S'}
                  </div>
                  <div className={styles.profileInfo}>
                    <h4 className={styles.profileName}>{profile.name}</h4>
                    <p className={styles.profileMeta}>{profile.degree}, {profile.year}</p>
                    <p className={styles.universityName}>Amity University</p>
                  </div>
                </div>

                {profile.skills && profile.skills.length > 0 && (
                  <div className={styles.skillsRow}>
                    {profile.skills.map((skill: any) => (
                      <span key={skill.id || skill.name} className={styles.skillChip}>{skill.name || skill}</span>
                    ))}
                  </div>
                )}

                <div className={styles.lockedOverlayBanner} onClick={() => navigate('/login')}>
                  <span>Sign in with Amity SSO to connect</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {previewProfiles.length > 1 && (
            <div className={styles.dotsRow}>
              {previewProfiles.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === activeSlide ? styles.activeDot : ''}`}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
