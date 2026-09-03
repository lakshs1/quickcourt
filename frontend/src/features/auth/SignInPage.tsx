import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../stores/authStore';
import styles from './SignInPage.module.css';

export default function SignInPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmailDomain = (inputEmail: string) => {
    return inputEmail.trim().toLowerCase().endsWith('@s.amity.edu');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast.error('Please enter your Amity email address.');
      return;
    }

    if (!validateEmailDomain(cleanEmail)) {
      toast.error('Only verified Amity email addresses (@s.amity.edu) are allowed.');
      return;
    }

    if (!password) {
      toast.error('Please enter a password.');
      return;
    }

    setIsLoading(true);
    try {
      if (isRegisterMode) {
        if (!name.trim()) {
          toast.error('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        const res = await api.post('/auth/register', {
          email: cleanEmail,
          password,
          name: name.trim(),
        });
        const { user, accessToken } = res.data.data;
        setAuth(user, accessToken);
        toast.success('Account created successfully!');
        navigate('/onboarding');
      } else {
        const res = await api.post('/auth/login', {
          email: cleanEmail,
          password,
        });
        const { user, accessToken } = res.data.data;
        setAuth(user, accessToken);
        toast.success('Logged in successfully!');
        if (!user.hasOnboarded) {
          navigate('/onboarding');
        } else {
          navigate('/connect');
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('amity123');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', {
        email: demoEmail,
        password: 'amity123',
      });
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success(`Signed in as ${user.name}`);
      if (!user.hasOnboarded) {
        navigate('/onboarding');
      } else {
        navigate('/connect');
      }
    } catch (err: any) {
      toast.error('Demo login failed. Make sure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.cardContainer}>
        {/* Brand Header */}
        <div className={styles.brandRow}>
          <div className={styles.logoBadge}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1 className={styles.brandTitle}>AmiConnect</h1>
        </div>

        {/* Headings */}
        <div className={styles.textGroup}>
          <h2 className={styles.heading}>{isRegisterMode ? 'Create Student Account' : 'Welcome back!'}</h2>
          <p className={styles.subheading}>
            Sign in with your verified <strong>@s.amity.edu</strong> email to continue.
          </p>
        </div>

        {/* Quick Demo Fill */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '12px 0' }}>
          <button
            type="button"
            style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer' }}
            onClick={() => handleQuickDemo('rohan.verma@s.amity.edu')}
          >
            👤 Demo: Rohan
          </button>
          <button
            type="button"
            style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer' }}
            onClick={() => handleQuickDemo('ananya.sharma@s.amity.edu')}
          >
            👤 Demo: Ananya
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          {isRegisterMode && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
              required
            />
          )}
          <input
            type="email"
            placeholder="student@s.amity.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={styles.msButton}
            style={{ background: '#047857', color: '#fff', fontWeight: 600, justifyContent: 'center' }}
          >
            {isLoading ? 'Processing...' : isRegisterMode ? 'Register Student Profile' : 'Sign In with Amity SSO'}
          </button>
        </form>

        <div style={{ marginTop: '14px', fontSize: '13px', textAlign: 'center', color: '#64748B' }}>
          {isRegisterMode ? (
            <span>Already registered? <button type="button" onClick={() => setIsRegisterMode(false)} style={{ color: '#047857', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Sign In</button></span>
          ) : (
            <span>New student? <button type="button" onClick={() => setIsRegisterMode(true)} style={{ color: '#047857', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Create Account</button></span>
          )}
        </div>

        {/* Footer info */}
        <div className={styles.footerInfo} style={{ marginTop: '16px' }}>
          <p className={styles.privacyNote}>We only connect verified Amity University students.</p>
          <p className={styles.domainNote}>
            Only <strong>@s.amity.edu</strong> email addresses are allowed.
          </p>
        </div>
      </div>
    </div>
  );
}
