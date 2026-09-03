import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { BottomNav } from '../../components/layout/BottomNav';
import styles from './SearchResultsPage.module.css';

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSearchResults = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/feed/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.data.success) {
        setProfiles(res.data.data.profiles || []);
      }
    } catch (err: any) {
      console.error('Failed to search profiles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(query);
  }, [query]);

  const handleConnect = async (receiverId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.post('/connections', { receiverId });
      if (res.data.success) {
        toast.success('Connection request sent!');
        setProfiles((prev) =>
          prev.map((p) => (p.id === receiverId ? { ...p, connectionStatus: 'pending' } : p))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not send request');
    }
  };

  const handleToggleBookmark = async (targetUserId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlyBookmarked = profiles.find((p) => p.id === targetUserId)?.isBookmarked;
    try {
      if (isCurrentlyBookmarked) {
        await api.delete(`/bookmarks/${targetUserId}`);
        toast.success('Bookmark removed');
      } else {
        await api.post('/bookmarks', { bookmarkedUserId: targetUserId });
        toast.success('Profile bookmarked!');
      }
      setProfiles((prev) =>
        prev.map((p) => (p.id === targetUserId ? { ...p, isBookmarked: !isCurrentlyBookmarked } : p))
      );
    } catch (err: any) {
      toast.error('Bookmark update failed');
    }
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
          {profiles.length} {profiles.length === 1 ? 'result' : 'results'} found
        </span>
      </div>

      {/* Results List */}
      <main className={styles.resultsList}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
            Searching student profiles...
          </div>
        ) : profiles.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>No matching results</h3>
            <p>Try searching for skills like "Python", "React", or "FastAPI".</p>
          </div>
        ) : (
          profiles.map((profile) => (
            <article
              key={profile.id}
              className={styles.compactCard}
              onClick={() => navigate(`/profile/${profile.id}`)}
            >
              <div className={styles.cardHeader}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#047857',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px'
                }}>
                  {profile.name?.[0] || 'S'}
                </div>
                <div className={styles.info}>
                  <h3 className={styles.name}>{profile.name}</h3>
                  <p className={styles.subtext}>
                    {profile.degree || 'Student'}, {profile.year || 'Amity'}
                  </p>
                </div>
              </div>

              {/* Skill Badges */}
              {profile.skills && profile.skills.length > 0 && (
                <div className={styles.skillsRow}>
                  {profile.skills.slice(0, 4).map((skill: any) => (
                    <span key={skill.id || skill.name || skill} className={styles.skillTag}>
                      {skill.name || skill}
                    </span>
                  ))}
                </div>
              )}

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
                  disabled={profile.connectionStatus === 'pending' || profile.connectionStatus === 'accepted'}
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
