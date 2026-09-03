import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../../components/layout/BottomNav';
import { Pagination } from '../../components/ui/Pagination';
import { MOCK_PROFILES } from '../../data/mockProfiles';
import type { Profile } from '../../types/amiConnect';
import styles from './BookmarksPage.module.css';

export default function BookmarksPage() {
  const navigate = useNavigate();
  // Filter bookmarked profiles
  const [bookmarkedProfiles, setBookmarkedProfiles] = useState<Profile[]>(
    MOCK_PROFILES.filter((p) => p.isBookmarked || ['sneha-sharma', 'aman-gupta', 'karan-singh', 'neha-yadav', 'rohan-verma'].includes(p.id))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(bookmarkedProfiles.length / itemsPerPage);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const paginatedProfiles = bookmarkedProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Bookmarks</h1>
          <p className={styles.subtitle}>{bookmarkedProfiles.length} saved profiles</p>
        </div>
      </header>

      {/* Bookmarks List */}
      <main className={styles.content}>
        {bookmarkedProfiles.length === 0 ? (
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
            {paginatedProfiles.map((profile) => (
              <article
                key={profile.id}
                className={styles.bookmarkCard}
                onClick={() => navigate(`/profile/${profile.id}`)}
              >
                <img src={profile.avatar} alt={profile.name} className={styles.avatar} />
                <div className={styles.info}>
                  <h3 className={styles.name}>{profile.name}</h3>
                  <p className={styles.meta}>
                    {profile.degree}, {profile.year} • {profile.university}
                  </p>
                </div>

                <button
                  className={styles.bookmarkBtn}
                  onClick={(e) => handleToggleBookmark(profile.id, e)}
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
            ))}

            {/* reui.io / shadcn Pagination */}
            <div className={styles.paginationWrapper}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages || 1}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
