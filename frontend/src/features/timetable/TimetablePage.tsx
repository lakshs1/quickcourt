import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { BottomNav } from '../../components/layout/BottomNav';
import styles from './TimetablePage.module.css';

export default function TimetablePage() {
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      setIsLoading(true);
      try {
        const res = await api.get('/roadmaps/me');
        if (res.data.success) {
          setRoadmapData(res.data.data);
        }
      } catch (err: any) {
        console.error('Failed to load roadmaps:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoadmap();
  }, []);

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Career Roadmaps</h1>
        <span className={styles.v2Badge} style={{ background: '#E0E7FF', color: '#3730A3' }}>
          Personalized
        </span>
      </header>

      {/* Main Content */}
      <main className={styles.content}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
            Loading your skill roadmap...
          </div>
        ) : (
          <div className={styles.previewCard} style={{ textAlign: 'left', alignItems: 'stretch' }}>
            {/* Goal Banner */}
            <div style={{ background: '#F1F5F9', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#475569' }}>Your Current Goal</span>
              <p style={{ margin: '6px 0 0', fontWeight: 600, fontSize: '15px', color: '#0F172A' }}>
                🎯 {roadmapData?.goal || 'Set your goal in your profile'}
              </p>
            </div>

            <h2 className={styles.heading} style={{ textAlign: 'left', fontSize: '18px', margin: '0 0 12px' }}>
              Suggested Skills to Learn
            </h2>

            {roadmapData?.suggestions?.map((item: any, idx: number) => (
              <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', marginBottom: '14px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '16px', color: '#047857' }}>{item.suggestedSkill}</span>
                  <span style={{ fontSize: '12px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                    Matches: {item.currentSkill}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#475569', margin: '8px 0 12px' }}>{item.reason}</p>

                {item.resources && item.resources.length > 0 && (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Curated Resources:</span>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '18px', fontSize: '13px' }}>
                      {item.resources.map((res: any, rIdx: number) => (
                        <li key={rIdx} style={{ marginBottom: '4px' }}>
                          <a href={res.url} target="_blank" rel="noreferrer" style={{ color: '#2563EB', fontWeight: 500, textDecoration: 'underline' }}>
                            {res.title} ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
