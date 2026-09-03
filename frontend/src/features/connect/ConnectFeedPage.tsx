import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { BottomNav } from '../../components/layout/BottomNav';
import styles from './ConnectFeedPage.module.css';

const FEED_SUB_TABS = ['For You', 'Build Together', 'Learn From', 'Same Interests'];

export default function ConnectFeedPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('For You');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeed = async (pageNumber = 1) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/feed?page=${pageNumber}&limit=5`);
      if (res.data.success) {
        setProfiles(res.data.data.profiles || []);
        setPage(res.data.data.pagination.page);
        setTotalPages(res.data.data.pagination.totalPages);
      }
    } catch (err: any) {
      console.error('Failed to load feed:', err);
      toast.error('Could not fetch feed. Check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(page);
  }, [page]);

  const handleConnect = async (receiverId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.post('/connections', { receiverId });
      if (res.data.success) {
        toast.success('Connection request sent!');
        setProfiles((prev) =>
          prev.map((p) =>
            p.id === receiverId ? { ...p, connectionStatus: 'pending' } : p
          )
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
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
            Loading student profiles...
          </div>
        ) : profiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748B' }}>
            No student matches found. Try broadening your filters or onboarding your profile!
          </div>
        ) : (
          profiles.map((profile) => (
            <article
              key={profile.id}
              className={styles.profileCard}
              onClick={() => navigate(`/profile/${profile.id}`)}
            >
              {/* Header: Avatar, Name, Degree */}
              <div className={styles.cardTop}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#047857',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '18px'
                }}>
                  {profile.name?.[0] || 'S'}
                </div>
                <div className={styles.headerInfo}>
                  <h2 className={styles.name}>{profile.name}</h2>
                  <p className={styles.degreeMeta}>
                    {profile.degree || 'Student'}, {profile.year || 'Amity'}
                  </p>
                </div>
              </div>

              {/* Skill badges */}
              {profile.skills && profile.skills.length > 0 && (
                <div className={styles.skillsRow}>
                  {profile.skills.slice(0, 4).map((s: any) => (
                    <span key={s.id || s.name} className={styles.skillTag}>
                      {s.name || s}
                    </span>
                  ))}
                </div>
              )}

              {/* Looking For Section */}
              {profile.lookingFor && (
                <div className={styles.lookingForSection}>
                  <span className={styles.lookingForLabel}>🎯 Looking For</span>
                  <div className={styles.lookingForBadge}>
                    {profile.lookingFor}
                  </div>
                </div>
              )}

              {/* Bio quote */}
              {profile.bio && (
                <div className={styles.aboutSection}>
                  <span className={styles.aboutLabel}>About</span>
                  <p className={styles.aboutText}>{profile.bio}</p>
                </div>
              )}

              {/* Action Row: Connect CTA + Bookmark */}
              <div className={styles.cardActions}>
                <button
                  className={`${styles.connectBtn} ${
                    profile.connectionStatus === 'pending' ? styles.pendingBtn : ''
                  } ${profile.connectionStatus === 'accepted' ? styles.connectedBtn : ''}`}
                  onClick={(e) => handleConnect(profile.id, e)}
                  disabled={profile.connectionStatus === 'pending' || profile.connectionStatus === 'accepted'}
                >
                  {profile.connectionStatus === 'pending'
                    ? 'Pending'
                    : profile.connectionStatus === 'accepted'
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
          ))
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', padding: '16px 0' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', cursor: 'pointer' }}
            >
              ← Prev
            </button>
            <span style={{ fontSize: '14px', alignSelf: 'center', color: '#64748B' }}>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', cursor: 'pointer' }}
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
