import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../../components/layout/BottomNav';
import { MOCK_PROFILES } from '../../data/mockProfiles';
import type { Profile } from '../../types/amiConnect';
import styles from './ConnectFeedPage.module.css';

const FEED_SUB_TABS = ['For You', 'Build Together', 'Learn From', 'Same Interests'];

export default function ConnectFeedPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('For You');
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);

  const handleConnect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              connectionStatus: p.connectionStatus === 'pending' ? 'none' : 'pending'
            }
          : p
      )
    );
  };

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );
  };

  return (
    <div className={styles.pageContainer}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.brandRow}>
          <div className={styles.logoBadge}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className={styles.brandTitle}>AmiConnect</span>
        </div>

        {/* Action icons */}
        <div className={styles.headerActions}>
          <button
            className={styles.iconBtn}
            onClick={() => navigate('/search')}
            aria-label="Search"
            title="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button
            className={styles.iconBtn}
            onClick={() => navigate('/filters')}
            aria-label="Filters"
            title="Filter Feed"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Sub-tabs Navigation */}
      <nav className={styles.subTabsNav}>
        {FEED_SUB_TABS.map((tab) => (
          <button
            key={tab}
            className={`${styles.subTab} ${activeTab === tab ? styles.activeSubTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Feed List */}
      <main className={styles.feedContent}>
        {profiles.slice(0, 5).map((profile) => (
          <article
            key={profile.id}
            className={styles.profileCard}
            onClick={() => navigate(`/profile/${profile.id}`)}
          >
            {/* Header: Avatar, Name, Degree */}
            <div className={styles.cardTop}>
              <img src={profile.avatar} alt={profile.name} className={styles.avatarImg} />
              <div className={styles.headerInfo}>
                <h2 className={styles.name}>{profile.name}</h2>
                <p className={styles.degreeMeta}>
                  {profile.degree}, {profile.year} • {profile.university}
                </p>
              </div>
              <button
                className={styles.moreBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${profile.id}`);
                }}
                aria-label="More options"
              >
                ⋮
              </button>
            </div>

            {/* Skill badges */}
            <div className={styles.skillsRow}>
              {profile.skills.slice(0, 4).map((skill) => (
                <span key={skill} className={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>

            {/* Looking For Section */}
            {profile.lookingFor && (
              <div className={styles.lookingForSection}>
                <span className={styles.lookingForLabel}>Looking For</span>
                <div className={styles.lookingForBadge}>
                  {profile.lookingFor}
                </div>
              </div>
            )}

            {/* Common Ground Section */}
            {profile.commonGround && (
              <div className={styles.commonGroundSection}>
                <span className={styles.commonGroundLabel}>Common Ground</span>
                <div className={styles.commonGroundPills}>
                  {profile.commonGround.skills?.map((s) => (
                    <span key={s} className={styles.cgPill}>
                      📍 {s}
                    </span>
                  ))}
                  {profile.commonGround.interests?.map((i) => (
                    <span key={i} className={styles.cgPill}>
                      {i === 'Football' ? '⚽' : i === 'Music' ? '🎵' : i === 'Reading' ? '📖' : i === 'Traveling' ? '✈️' : '✨'} {i}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About quote */}
            {profile.about && (
              <div className={styles.aboutSection}>
                <span className={styles.aboutLabel}>About</span>
                <p className={styles.aboutText}>{profile.about}</p>
              </div>
            )}

            {/* Action Row: Connect CTA + Bookmark */}
            <div className={styles.cardActions}>
              <button
                className={`${styles.connectBtn} ${
                  profile.connectionStatus === 'pending' ? styles.pendingBtn : ''
                } ${profile.connectionStatus === 'connected' ? styles.connectedBtn : ''}`}
                onClick={(e) => handleConnect(profile.id, e)}
              >
                {profile.connectionStatus === 'pending'
                  ? 'Request Sent'
                  : profile.connectionStatus === 'connected'
                  ? 'Connected ✓'
                  : 'Connect'}
              </button>

              <button
                className={`${styles.bookmarkBtn} ${profile.isBookmarked ? styles.bookmarked : ''}`}
                onClick={(e) => handleToggleBookmark(profile.id, e)}
                aria-label="Bookmark Profile"
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
          </article>
        ))}
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
