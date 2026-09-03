import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../../components/layout/BottomNav';
import styles from './OnboardingPage.module.css';

const DEGREES = ['BCA', 'BTech (CSE)', 'BTech (IT)', 'BTech (ECE)', 'BBA', 'MBA', 'MCA', 'B.Des', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'];

export default function OnboardingPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('Mawiya Manzar');
  const [degree, setDegree] = useState('BCA');
  const [year, setYear] = useState('3rd Year');

  const [skills, setSkills] = useState(['Python', 'FastAPI', 'SQL']);
  const [newSkill, setNewSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);

  const [interests, setInterests] = useState(['Football', 'Music', 'Photography', 'Gaming', 'Reading']);
  const [newInterest, setNewInterest] = useState('');
  const [showInterestInput, setShowInterestInput] = useState(false);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to connect feed
    navigate('/connect');
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
          <p className={styles.subtitle}>This helps students find you.</p>
        </div>

        <form onSubmit={handleSave} className={styles.form}>
          {/* Avatar Upload */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarCircle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <div className={styles.cameraPlus}>+</div>
            </div>
            <span className={styles.avatarLabel}>Add Photo</span>
          </div>

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
            <button type="submit" className={styles.submitBtn}>
              Save & Continue
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
