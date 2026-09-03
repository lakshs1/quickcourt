import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../stores/authStore';
import { BottomNav } from '../../components/layout/BottomNav';
import styles from './OnboardingPage.module.css';

const DEGREES = ['BCA', 'BTech (CSE)', 'BTech (IT)', 'BTech (ECE)', 'BTech (ME)', 'BBA', 'MBA', 'MCA', 'B.Des', 'MSc', 'MA', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const [fullName, setFullName] = useState(user?.name || '');
  const [degree, setDegree] = useState('BCA');
  const [year, setYear] = useState('2nd Year');
  const [bio, setBio] = useState('');
  const [lookingFor, setLookingFor] = useState('');

  const [skills, setSkills] = useState<string[]>(['Python', 'FastAPI', 'PostgreSQL']);
  const [newSkill, setNewSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);

  const [interests, setInterests] = useState<string[]>(['Cricket', 'Photography', 'Gaming']);
  const [newInterest, setNewInterest] = useState('');
  const [showInterestInput, setShowInterestInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.name) setFullName(user.name);
  }, [user]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      setShowSkillInput(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
      setShowInterestInput(false);
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((i) => i !== interestToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lookingFor.trim()) {
      toast.error('Please specify what kind of collaborator you are looking for.');
      return;
    }

    if (skills.length === 0) {
      toast.error('Please add at least 1 skill tag.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/users/onboard', {
        degree,
        year,
        bio: bio.trim() || undefined,
        lookingFor: lookingFor.trim(),
        skills,
        interests,
      });

      if (res.data.success) {
        toast.success('Profile onboarded successfully!');
        if (user) {
          setUser({ ...user, ...res.data.data });
        }
        navigate('/connect');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Onboarding failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Top Bar */}
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
      </header>

      {/* Main Content */}
      <main className={styles.content}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Complete your profile</h1>
          <p className={styles.subtitle}>This helps students at Amity find and connect with you.</p>
        </div>

        <form onSubmit={handleSave} className={styles.form}>
          {/* Full Name */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              className={styles.input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Degree Program */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Degree Program</label>
            <select
              className={styles.select}
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            >
              {DEGREES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Academic Year */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Academic Year</label>
            <select
              className={styles.select}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Looking For */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>What are you looking for?</label>
            <textarea
              className={styles.input}
              style={{ minHeight: '60px', resize: 'vertical' }}
              placeholder="e.g. Backend dev for an AI legal assistant project"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              required
            />
          </div>

          {/* Bio / Tagline */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Short Bio / Tagline</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Building AI solutions that solve real world problems."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Skills (Select or add) */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Skills (Select or add)</label>
            <div className={styles.chipGrid}>
              {skills.map((skill) => (
                <span key={skill} className={styles.skillTag}>
                  {skill}
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => handleRemoveSkill(skill)}
                    aria-label={`Remove ${skill}`}
                  >
                    ✕
                  </button>
                </span>
              ))}

              {showSkillInput ? (
                <div className={styles.addInputRow}>
                  <input
                    type="text"
                    className={styles.chipInput}
                    placeholder="Enter skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    autoFocus
                  />
                  <button type="button" className={styles.addConfirmBtn} onClick={handleAddSkill}>
                    Add
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.addTagBtn}
                  onClick={() => setShowSkillInput(true)}
                >
                  + Add skill
                </button>
              )}
            </div>
          </div>

          {/* Interests (Hobbies) */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Interests (Hobbies)</label>
            <div className={styles.chipGrid}>
              {interests.map((interest) => (
                <span key={interest} className={styles.interestTag}>
                  {interest}
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => handleRemoveInterest(interest)}
                    aria-label={`Remove ${interest}`}
                  >
                    ✕
                  </button>
                </span>
              ))}

              {showInterestInput ? (
                <div className={styles.addInputRow}>
                  <input
                    type="text"
                    className={styles.chipInput}
                    placeholder="Enter interest..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                    autoFocus
                  />
                  <button type="button" className={styles.addConfirmBtn} onClick={handleAddInterest}>
                    Add
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.addTagBtn}
                  onClick={() => setShowInterestInput(true)}
                >
                  + Add interest
                </button>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className={styles.submitWrapper}>
            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? 'Saving...' : 'Save & Start Connecting'}
            </button>
            <span className={styles.editNote}>You can edit everything later</span>
          </div>
        </form>
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
