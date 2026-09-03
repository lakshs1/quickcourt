import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BottomNav } from '../../components/layout/BottomNav';
import { MOCK_PROFILES } from '../../data/mockProfiles';
import type { Profile } from '../../types/amiConnect';
import styles from './ProfileDetailPage.module.css';

export default function ProfileDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const targetProfile = MOCK_PROFILES.find((p) => p.id === id) || MOCK_PROFILES[0];
  const [profile, setProfile] = useState<Profile>(targetProfile);

  const handleConnect = () => {
    setProfile((prev) => ({
      ...prev,
      connectionStatus: prev.connectionStatus === 'pending' ? 'none' : 'pending'
    }));
  };

  const handleBookmark = () => {
    setProfile((prev) => ({
      ...prev,
      isBookmarked: !prev.isBookmarked
    }));
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Go Back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <button className={styles.moreBtn} aria-label="More options">
          ⋮
        </button>
      </header>

      {/* Main Content */}
      <main className={styles.content}>
        {/* Profile Hero Block */}
        <section className={styles.heroBlock}>
          <img src={profile.avatar} alt={profile.name} className={styles.avatarImg} />
          
          <div className={styles.nameGroup}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.degreeMeta}>
              {profile.degree}, {profile.year} • {profile.university}
            </p>
          </div>

          <div className={styles.metaRow}>
            <span>📍 {profile.location}</span>
            <span>•</span>
            <span>📅 Available: {profile.availability}</span>
          </div>

          {profile.about && (
            <p className={styles.tagline}>
              "{profile.about}"
            </p>
          )}

          {/* Action Buttons */}
          <div className={styles.heroActions}>
            <button
              className={`${styles.connectBtn} ${
                profile.connectionStatus === 'pending' ? styles.pendingBtn : ''
              }`}
              onClick={handleConnect}
            >
              {profile.connectionStatus === 'pending' ? 'Request Sent' : 'Connect'}
            </button>

            <button
              className={`${styles.bookmarkBtn} ${profile.isBookmarked ? styles.bookmarked : ''}`}
              onClick={handleBookmark}
              aria-label="Bookmark"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={profile.isBookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </section>

        {/* Skills Section */}
        <section className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className={styles.chipRow}>
            {profile.skills.map((skill) => (
              <span key={skill} className={styles.skillChip}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Looking For Section */}
        {profile.lookingFor && (
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Looking For</h2>
            <div className={styles.lookingForBadge}>
              {profile.lookingFor}
            </div>
          </section>
        )}

        {/* Interests (Hobbies) Section */}
        {profile.interests && (
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Interests (Hobbies)</h2>
            <div className={styles.chipRow}>
              {profile.interests.map((interest) => (
                <span key={interest} className={styles.interestChip}>
                  {interest}
                </span>
              ))}
              <span className={styles.moreChip}>+3 more</span>
            </div>
          </section>
        )}

        {/* Common Ground Section */}
        {profile.commonGround && (
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Common Ground</h2>
            <div className={styles.commonGroundBox}>
              {profile.commonGround.skills?.map((s) => (
                <span key={s} className={styles.cgPill}>
                  📍 {s}
                </span>
              ))}
              {profile.commonGround.interests?.map((i) => (
                <span key={i} className={styles.cgPill}>
                  {i === 'Football' ? '⚽' : i === 'Music' ? '🎵' : '✨'} {i}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* About Me Section */}
        <section className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>About Me</h2>
          <p className={styles.aboutText}>
            Passionate about AI and using tech to solve meaningful problems that create real impact.
          </p>
        </section>
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
