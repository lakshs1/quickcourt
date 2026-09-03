import { useState } from 'react';
import { BottomNav } from '../../components/layout/BottomNav';
import styles from './MyProfilePage.module.css';

export default function MyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('Mawiya Manzar');
  const [degree, setDegree] = useState('BCA');
  const [year, setYear] = useState('3rd Year');
  const [location, setLocation] = useState('Noida, India');
  const [availability, setAvailability] = useState('Evenings');
  const [lookingFor, setLookingFor] = useState('Project Collaborator');
  const [about, setAbout] = useState(
    'I love building products and exploring AI applications that solve real-life problems.'
  );

  const [skills, setSkills] = useState(['Python', 'FastAPI', 'SQL', 'LangGraph', 'AI/ML']);
  const [interests, setInterests] = useState(['Football', 'Music', 'Photography', 'Gaming', 'Reading']);

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

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

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
        <button
          className={styles.editToggleBtn}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </header>

      {/* Main Content */}
      <main className={styles.content}>
        {/* Profile Hero Card */}
        <section className={styles.heroCard}>
          <div className={styles.avatarWrapper}>
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
              alt={name}
              className={styles.avatarImg}
            />
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
              <label className={styles.label}>Degree</label>
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
              <div className={styles.lookingForBadge}>{lookingFor}</div>
            </section>

            {/* Interests */}
            <section className={styles.sectionBlock}>
              <h3 className={styles.sectionTitle}>Interests (Hobbies)</h3>
              <div className={styles.chipRow}>
                {interests.map((interest) => (
                  <span key={interest} className={styles.interestChip}>{interest}</span>
                ))}
                <span className={styles.moreChip}>+2 more</span>
              </div>
            </section>

            {/* About Me */}
            <section className={styles.sectionBlock}>
              <h3 className={styles.sectionTitle}>About Me</h3>
              <p className={styles.aboutBox}>{about}</p>
            </section>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
