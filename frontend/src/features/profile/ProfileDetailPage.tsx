import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { BottomNav } from '../../components/layout/BottomNav';
import styles from './ProfileDetailPage.module.css';

export default function ProfileDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPublicProfile() {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await api.get(`/users/${id}`);
        if (res.data.success) {
          setProfile(res.data.data);
        }
      } catch (err: any) {
        console.error('Failed to load profile:', err);
        toast.error('Student profile not found');
      } finally {
        setIsLoading(false);
      }
    }
    fetchPublicProfile();
  }, [id]);

  const handleConnect = async () => {
    if (!id) return;
    try {
      const res = await api.post('/connections', { receiverId: id });
      if (res.data.success) {
        toast.success('Connection request sent!');
        setProfile((prev: any) => ({ ...prev, connectionStatus: 'pending' }));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not send request');
    }
  };

  const handleBookmark = async () => {
    if (!id) return;
    const isCurrentlyBookmarked = profile?.isBookmarked;
    try {
      if (isCurrentlyBookmarked) {
        await api.delete(`/bookmarks/${id}`);
        toast.success('Bookmark removed');
      } else {
        await api.post('/bookmarks', { bookmarkedUserId: id });
        toast.success('Profile bookmarked!');
      }
      setProfile((prev: any) => ({ ...prev, isBookmarked: !isCurrentlyBookmarked }));
    } catch (err: any) {
      toast.error('Bookmark update failed');
    }
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
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
            Loading student profile...
          </div>
        ) : !profile ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748B' }}>
            Student profile not found.
          </div>
        ) : (
          <>
            {/* Profile Hero Block */}
            <section className={styles.heroBlock}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#047857',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '24px',
                margin: '0 auto 12px'
              }}>
                {profile.name?.[0] || 'S'}
              </div>
              
              <div className={styles.nameGroup}>
                <h1 className={styles.name}>{profile.name}</h1>
                <p className={styles.degreeMeta}>
                  {profile.degree || 'Student'}, {profile.year || 'Amity'} • Amity University
                </p>
              </div>

              <div className={styles.metaRow}>
                <span>📍 {profile.location || 'Noida, India'}</span>
                <span>•</span>
                <span>📅 Available: {profile.availability || 'Evenings'}</span>
              </div>

              {profile.bio && (
                <p className={styles.tagline}>
                  "{profile.bio}"
                </p>
              )}

              {/* Action Buttons */}
              <div className={styles.heroActions}>
                <button
                  className={`${styles.connectBtn} ${
                    profile.connectionStatus === 'pending' ? styles.pendingBtn : ''
                  }`}
                  onClick={handleConnect}
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
            {profile.skills && profile.skills.length > 0 && (
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>Skills</h2>
                <div className={styles.chipRow}>
                  {profile.skills.map((skill: any) => (
                    <span key={skill.id || skill.name || skill} className={styles.skillChip}>
                      {skill.name || skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

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
            {profile.interests && profile.interests.length > 0 && (
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>Interests (Hobbies)</h2>
                <div className={styles.chipRow}>
                  {profile.interests.map((interest: any) => (
                    <span key={interest.id || interest.name || interest} className={styles.interestChip}>
                      {interest.name || interest}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* About Me Section */}
            {profile.about && (
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>About Me</h2>
                <p className={styles.aboutText}>
                  {profile.about}
                </p>
              </section>
            )}
          </>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
