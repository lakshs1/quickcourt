import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../../components/layout/BottomNav';
import styles from './MessagesPage.module.css';

interface RequestItem {
  id: string;
  name: string;
  avatar: string;
  degree: string;
  year: string;
}

const INITIAL_RECEIVED: RequestItem[] = [
  {
    id: 'karan-singh',
    name: 'Karan Singh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    degree: 'BTech (IT)',
    year: '2nd Year'
  },
  {
    id: 'neha-yadav',
    name: 'Neha Yadav',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    degree: 'BTech (CSE)',
    year: '3rd Year'
  }
];

const INITIAL_SENT: RequestItem[] = [
  {
    id: 'vivek-mishra',
    name: 'Vivek Mishra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    degree: 'BCA',
    year: '2nd Year'
  },
  {
    id: 'isha-patel',
    name: 'Isha Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    degree: 'BCom',
    year: '3rd Year'
  }
];

export default function MessagesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'connections' | 'bookmarks'>('requests');

  const [received, setReceived] = useState<RequestItem[]>(INITIAL_RECEIVED);
  const [acceptedCount, setAcceptedCount] = useState(6);

  const handleAccept = (id: string) => {
    setReceived(received.filter((r) => r.id !== id));
    setAcceptedCount((prev) => prev + 1);
  };

  const handleDecline = (id: string) => {
    setReceived(received.filter((r) => r.id !== id));
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
      </header>

      {/* Tab Switcher */}
      <nav className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'requests' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests <span className={styles.countBadge}>{received.length}</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'connections' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('connections')}
        >
          Connections <span className={styles.countBadge}>{acceptedCount}</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'bookmarks' ? styles.activeTab : ''}`}
          onClick={() => navigate('/bookmarks')}
        >
          Bookmarks <span className={styles.countBadge}>5</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className={styles.content}>
        {activeTab === 'requests' && (
          <div className={styles.sectionStack}>
            {/* Received Requests */}
            <section className={styles.section}>
              <h2 className={styles.sectionHeader}>Received Requests</h2>
              {received.length === 0 ? (
                <div className={styles.emptyCard}>No pending requests</div>
              ) : (
                <div className={styles.list}>
                  {received.map((item) => (
                    <div key={item.id} className={styles.requestCard}>
                      <img src={item.avatar} alt={item.name} className={styles.avatar} />
                      <div className={styles.info}>
                        <h3 className={styles.name}>{item.name}</h3>
                        <p className={styles.meta}>{item.degree}, {item.year}</p>
                      </div>
                      <div className={styles.actions}>
                        <button className={styles.acceptBtn} onClick={() => handleAccept(item.id)}>
                          Accept
                        </button>
                        <button className={styles.declineBtn} onClick={() => handleDecline(item.id)}>
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
              <div className={styles.list}>
                {INITIAL_SENT.map((item) => (
                  <div key={item.id} className={styles.requestCard}>
                    <img src={item.avatar} alt={item.name} className={styles.avatar} />
                    <div className={styles.info}>
                      <h3 className={styles.name}>{item.name}</h3>
                      <p className={styles.meta}>{item.degree}, {item.year}</p>
                    </div>
                    <span className={styles.pendingBadge}>Pending</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'connections' && (
          <div className={styles.connectionsList}>
            <p className={styles.infoNote}>Connected students will appear here.</p>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
