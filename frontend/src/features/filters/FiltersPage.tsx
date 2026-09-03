import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FiltersPage.module.css';

const DEGREES = ['All', 'BCA', 'BTech (CSE)', 'BTech (IT)', 'BTech (ECE)', 'BBA', 'MBA', 'MCA'];
const YEARS = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'];
const LOOKING_FOR_OPTIONS = ['Project Collaborator', 'Hackathon Teammate', 'Research Partner', 'Frontend Developer', 'Backend Developer'];

export default function FiltersPage() {
  const navigate = useNavigate();

  const [degree, setDegree] = useState('All');
  const [year, setYear] = useState('All');
  const [skills, setSkills] = useState(['Python', 'FastAPI', 'SQL']);
  const [interests, setInterests] = useState(['Football', 'Music']);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>(['Project Collaborator']);

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const toggleLookingFor = (option: string) => {
    if (selectedLookingFor.includes(option)) {
      setSelectedLookingFor(selectedLookingFor.filter((item) => item !== option));
    } else {
      setSelectedLookingFor([...selectedLookingFor, option]);
    }
  };

  const handleReset = () => {
    setDegree('All');
    setYear('All');
    setSkills([]);
    setInterests([]);
    setSelectedLookingFor([]);
  };

  const handleApply = () => {
    // Navigate back to connect feed with applied filters
    navigate('/connect');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Filters</h1>
        <button className={styles.resetBtn} onClick={handleReset}>
          Reset
        </button>
      </header>

      {/* Main Content */}
      <main className={styles.content}>
        {/* Degree */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Degree</label>
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

        {/* Skills */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Skills</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.input}
              placeholder="Select skills..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            />
            {skillInput && (
              <button className={styles.inlineAddBtn} onClick={handleAddSkill}>
                Add
              </button>
            )}
          </div>

          <div className={styles.chipRow}>
            {skills.map((skill) => (
              <span key={skill} className={styles.skillChip}>
                {skill}
                <button className={styles.removeBtn} onClick={() => handleRemoveSkill(skill)}>✕</button>
              </span>
            ))}
          </div>
        </div>

        {/* Interests (Hobbies) */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Interests (Hobbies)</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.input}
              placeholder="Select interests..."
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
            />
            {interestInput && (
              <button className={styles.inlineAddBtn} onClick={handleAddInterest}>
                Add
              </button>
            )}
          </div>

          <div className={styles.chipRow}>
            {interests.map((interest) => (
              <span key={interest} className={styles.interestChip}>
                {interest}
                <button className={styles.removeBtn} onClick={() => handleRemoveInterest(interest)}>✕</button>
              </span>
            ))}
          </div>
        </div>

        {/* Looking For Multi-select */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Looking For</label>
          <div className={styles.checkboxList}>
            {LOOKING_FOR_OPTIONS.map((option) => {
              const isChecked = selectedLookingFor.includes(option);
              return (
                <label key={option} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={isChecked}
                    onChange={() => toggleLookingFor(option)}
                  />
                  <span className={styles.checkboxLabel}>{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer Action Buttons */}
      <footer className={styles.footerActions}>
        <button className={styles.cancelBtn} onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button className={styles.applyBtn} onClick={handleApply}>
          Apply Filters
        </button>
      </footer>
    </div>
  );
}
