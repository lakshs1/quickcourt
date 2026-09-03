import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../stores/authStore';
import { BottomNav } from '../../components/layout/BottomNav';
import styles from './MyProfilePage.module.css';

export default function MyProfilePage() {
  const { logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('');
  const [location, setLocation] = useState('Noida, India');
  const [availability, setAvailability] = useState('Evenings');
  const [lookingFor, setLookingFor] = useState('');
  const [about, setAbout] = useState('');

  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/users/me');
      if (res.data.success) {
        const p = res.data.data;
        setName(p.name || '');
        setDegree(p.degree || '');
        setYear(p.year || '');
        setLocation(p.location || 'Noida, India');
        setAvailability(p.availability || 'Evenings');
        setLookingFor(p.lookingFor || '');
        setAbout(p.about || p.bio || '');

        setSkills((p.skills || []).map((s: any) => (typeof s === 'string' ? s : s.name)));
        setInterests((p.interests || []).map((i: any) => (typeof i === 'string' ? i : i.name)));
      }
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      toast.error('Could not load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleSave = async () => {
    try {
      const res = await api.put('/users/me', {
        name,
        degree,
        year,
        location,
        availability,
        lookingFor,
        about,
        skills,
        interests,
      });
      if (res.data.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        fetchProfile();
      }
    } catch (err: any) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>My Profile</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={styles.editToggleBtn}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          <button
            style={{ fontSize: '13px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.content}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
            Loading your profile...
          </div>
        ) : (
          <>
            {/* Profile Hero Card */}
            <section className={styles.heroCard}>
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
                fontSize: '24px'
              }}>
                {name?.[0] || 'S'}
              </div>

              <div className={styles.heroText}>
                <h2 className={styles.name}>{name}</h2>
                <p className={styles.degreeMeta}>{degree}, {year} • Amity University</p>
                <p className={styles.locationMeta}>📍 {location} • 📅 Available: {availability}</p>
              </div>
            </section>

            {isEditing ? (
              /* EDIT FORM MODE */
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className={styles.editForm}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Degree Program</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Academic Year</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Looking For</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                  />
                </div>

                {/* Skills Edit */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Skills</label>
                  <div className={styles.addInputRow}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Add skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <button type="button" className={styles.addBtn} onClick={handleAddSkill}>
                      Add
                    </button>
                  </div>
                  <div className={styles.chipRow}>
                    {skills.map((skill) => (
                      <span key={skill} className={styles.skillChip}>
                        {skill}
                        <button type="button" className={styles.removeBtn} onClick={() => handleRemoveSkill(skill)}>✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests Edit */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Interests (Hobbies)</label>
                  <div className={styles.addInputRow}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Add interest..."
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                    />
                    <button type="button" className={styles.addBtn} onClick={handleAddInterest}>
                      Add
                    </button>
                  </div>
                  <div className={styles.chipRow}>
                    {interests.map((interest) => (
                      <span key={interest} className={styles.interestChip}>
                        {interest}
                        <button type="button" className={styles.removeBtn} onClick={() => handleRemoveInterest(interest)}>✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* About Edit */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>About Me</label>
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </div>

                <button type="submit" className={styles.saveBtn}>
                  Save Profile Changes
                </button>
              </form>
            ) : (
              /* VIEW DISPLAY MODE */
              <div className={styles.displayStack}>
                {/* Skills */}
                <section className={styles.sectionBlock}>
                  <h3 className={styles.sectionTitle}>Skills</h3>
                  <div className={styles.chipRow}>
                    {skills.map((skill) => (
                      <span key={skill} className={styles.skillChip}>{skill}</span>
                    ))}
                  </div>
                </section>

                {/* Looking For */}
                <section className={styles.sectionBlock}>
                  <h3 className={styles.sectionTitle}>Looking For</h3>
                  <div className={styles.lookingForBadge}>{lookingFor || 'Not specified'}</div>
                </section>

                {/* Interests */}
                <section className={styles.sectionBlock}>
                  <h3 className={styles.sectionTitle}>Interests (Hobbies)</h3>
                  <div className={styles.chipRow}>
                    {interests.map((interest) => (
                      <span key={interest} className={styles.interestChip}>{interest}</span>
                    ))}
                  </div>
                </section>

                {/* About Me */}
                {about && (
                  <section className={styles.sectionBlock}>
                    <h3 className={styles.sectionTitle}>About Me</h3>
                    <p className={styles.aboutBox}>{about}</p>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
