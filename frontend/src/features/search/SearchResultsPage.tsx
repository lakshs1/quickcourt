import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BottomNav } from '../../components/layout/BottomNav';
import { MOCK_PROFILES } from '../../data/mockProfiles';
import type { Profile } from '../../types/amiConnect';
import styles from './SearchResultsPage.module.css';

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || 'python fastapi';

  const [query, setQuery] = useState(initialQuery);
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);

  const filteredProfiles = profiles.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.degree.toLowerCase().includes(q) ||
      p.lookingFor.toLowerCase().includes(q) ||
      p.skills.some((s) => s.toLowerCase().includes(q)) ||
      p.interests.some((i) => i.toLowerCase().includes(q))
    );
  });

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
      {/* Header Search Bar */}
      <header className={styles.header}>
        <div className={styles.searchShell}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search people, skills, interests"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <button
          className={styles.filterBtn}
          onClick={() => navigate('/filters')}
          aria-label="Filters"
          title="Open Filters"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
        </button>
      </header>

      {/* Results Header */}
      <div className={styles.metaRow}>
        <span className={styles.resultsCount}>
          {filteredProfiles.length} {filteredProfiles.length === 1 ? 'result' : 'results'} found
        </span>
      </div>

      {/* Results List */}
      <main className={styles.resultsList}>
        {filteredProfiles.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>No matching results</h3>
            <p>Try searching for skills like "Python", "React", or "UI/UX".</p>
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <article
              key={profile.id}
              className={styles.compactCard}
              onClick={() => navigate(`/profile/${profile.id}`)}
            >
              <div className={styles.cardHeader}>
                <img src={profile.avatar} alt={profile.name} className={styles.avatar} />
                <div className={styles.info}>
                  <h3 className={styles.name}>{profile.name}</h3>
                  <p className={styles.subtext}>
                    {profile.degree}, {profile.year} • {profile.university}
                  </p>
                </div>
              </div>

              {/* Skill Badges */}
              <div className={styles.skillsRow}>
                {profile.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>

              {/* Looking For */}
              {profile.lookingFor && (
                <div className={styles.lookingForBox}>
                  <span className={styles.lfLabel}>Looking For</span>
                  <span className={styles.lfBadge}>{profile.lookingFor}</span>
                </div>
              )}

              {/* Actions */}
              <div className={styles.actionRow}>
                <button
                  className={`${styles.connectBtn} ${
                    profile.connectionStatus === 'pending' ? styles.pendingBtn : ''
                  }`}
                  onClick={(e) => handleConnect(profile.id, e)}
                >
                  {profile.connectionStatus === 'pending' ? 'Pending' : 'Connect'}
                </button>

                <button
                  className={`${styles.bookmarkBtn} ${profile.isBookmarked ? styles.bookmarked : ''}`}
                  onClick={(e) => handleToggleBookmark(profile.id, e)}
                  aria-label="Bookmark"
                >
                  <svg
                    width="18"
                    height="18"
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
          ))
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
