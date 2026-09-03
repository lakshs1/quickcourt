import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { BottomNav } from '../../components/layout/BottomNav';
import { Pagination } from '../../components/ui/Pagination';
import styles from './BookmarksPage.module.css';

export default function BookmarksPage() {
  const navigate = useNavigate();
  const [bookmarkedItems, setBookmarkedItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 5;

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/bookmarks');
      if (res.data.success) {
        setBookmarkedItems(res.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch bookmarks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (targetUserId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/bookmarks/${targetUserId}`);
      toast.success('Bookmark removed');
      setBookmarkedItems((prev) => prev.filter((item) => item.profile.id !== targetUserId));
    } catch (err: any) {
      toast.error('Failed to remove bookmark');
    }
  };

  const totalPages = Math.ceil(bookmarkedItems.length / itemsPerPage);
  const paginatedItems = bookmarkedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Bookmarks</h1>
          <p className={styles.subtitle}>{bookmarkedItems.length} saved profiles</p>
        </div>
      </header>

      {/* Bookmarks List */}
      <main className={styles.content}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
            Loading bookmarks...
          </div>
        ) : bookmarkedItems.length === 0 ? (
          <div className={styles.emptyCard}>
            <div className={styles.emptyIcon}>🔖</div>
            <h3>No saved profiles yet</h3>
            <p>Tap the bookmark icon on any card in the Connect Feed to save profiles here.</p>
            <button className={styles.browseBtn} onClick={() => navigate('/connect')}>
              Browse Connect Feed
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            {paginatedItems.map((item) => {
              const profile = item.profile;
              return (
                <article
                  key={profile.id}
                  className={styles.bookmarkCard}
                  onClick={() => navigate(`/profile/${profile.id}`)}
                >
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

                  <div className={styles.info}>
                    <h3 className={styles.name}>{profile.name}</h3>
                    <p className={styles.meta}>
                      {profile.degree || 'Student'}, {profile.year || 'Amity'}
                    </p>
                  </div>

                  <button
                    className={styles.bookmarkBtn}
                    onClick={(e) => handleRemoveBookmark(profile.id, e)}
                    aria-label="Remove from bookmarks"
                    title="Remove Bookmark"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </article>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.paginationWrapper}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => setCurrentPage(p)}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
