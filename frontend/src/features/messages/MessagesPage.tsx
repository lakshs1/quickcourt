import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { BottomNav } from '../../components/layout/BottomNav';
import styles from './MessagesPage.module.css';

export default function MessagesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'connections'>('requests');

  const [pendingReceived, setPendingReceived] = useState<any[]>([]);
  const [pendingSent, setPendingSent] = useState<any[]>([]);
  const [acceptedConnections, setAcceptedConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConnections = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/connections');
      if (res.data.success) {
        setPendingReceived(res.data.data.pendingReceived || []);
        setPendingSent(res.data.data.pendingSent || []);
        setAcceptedConnections(res.data.data.accepted || []);
      }
    } catch (err: any) {
      console.error('Failed to load connections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleUpdateStatus = async (connectionId: number, status: 'accepted' | 'rejected') => {
    try {
      const res = await api.patch(`/connections/${connectionId}`, { status });
      if (res.data.success) {
        toast.success(`Connection ${status}!`);
        fetchConnections();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to update status`);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Messages & Connections</h1>
      </header>

      {/* Tab Switcher */}
      <nav className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'requests' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests <span className={styles.countBadge}>{pendingReceived.length}</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'connections' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('connections')}
        >
          My Network <span className={styles.countBadge}>{acceptedConnections.length}</span>
        </button>

        <button
          className={styles.tabBtn}
          onClick={() => navigate('/bookmarks')}
        >
          Bookmarks
        </button>
      </nav>

      {/* Main Content */}
      <main className={styles.content}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
            Loading connections...
          </div>
        ) : activeTab === 'requests' ? (
          <div className={styles.sectionStack}>
            {/* Received Requests */}
            <section className={styles.section}>
              <h2 className={styles.sectionHeader}>Received Requests</h2>
              {pendingReceived.length === 0 ? (
                <div className={styles.emptyCard}>No pending incoming requests</div>
              ) : (
                <div className={styles.list}>
                  {pendingReceived.map((item) => (
                    <div key={item.connectionId} className={styles.requestCard} onClick={() => navigate(`/profile/${item.profile.id}`)}>
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
                        {item.profile.name?.[0] || 'S'}
                      </div>
                      <div className={styles.info}>
                        <h3 className={styles.name}>{item.profile.name}</h3>
                        <p className={styles.meta}>{item.profile.degree}, {item.profile.year}</p>
                      </div>
                      <div className={styles.actions}>
                        <button
                          className={styles.acceptBtn}
                          onClick={(e) => { e.stopPropagation(); handleUpdateStatus(item.connectionId, 'accepted'); }}
                        >
                          Accept
                        </button>
                        <button
                          className={styles.declineBtn}
                          onClick={(e) => { e.stopPropagation(); handleUpdateStatus(item.connectionId, 'rejected'); }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Sent Requests */}
            <section className={styles.section}>
              <h2 className={styles.sectionHeader}>Sent Requests</h2>
              {pendingSent.length === 0 ? (
                <div className={styles.emptyCard}>No sent requests</div>
              ) : (
                <div className={styles.list}>
                  {pendingSent.map((item) => (
                    <div key={item.connectionId} className={styles.requestCard} onClick={() => navigate(`/profile/${item.profile.id}`)}>
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
                        {item.profile.name?.[0] || 'S'}
                      </div>
                      <div className={styles.info}>
                        <h3 className={styles.name}>{item.profile.name}</h3>
                        <p className={styles.meta}>{item.profile.degree}, {item.profile.year}</p>
                      </div>
                      <span className={styles.pendingBadge}>Pending</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className={styles.section}>
            <h2 className={styles.sectionHeader}>Connected Students ({acceptedConnections.length})</h2>
            {acceptedConnections.length === 0 ? (
              <div className={styles.emptyCard}>No connected students yet.</div>
            ) : (
              <div className={styles.list}>
                {acceptedConnections.map((item) => (
                  <div key={item.connectionId} className={styles.requestCard} onClick={() => navigate(`/profile/${item.profile.id}`)}>
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
                      {item.profile.name?.[0] || 'S'}
                    </div>
                    <div className={styles.info}>
                      <h3 className={styles.name}>{item.profile.name}</h3>
                      <p className={styles.meta}>{item.profile.degree}, {item.profile.year}</p>
                    </div>
                    <span style={{ fontSize: '12px', background: '#DCFCE7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
                      Connected ✓
                    </span>
                  </div>
                ))}
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
