import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../../../../backend/src/config/firebase.js';
import '../../styles/tokens.css';
import './Login.css';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('arise_remember_session') !== 'false');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetFeedback = () => {
    setError('');
    setNotice('');
  };

  const getAuthError = (authError) => {
    const messages = {
      'auth/email-already-in-use': 'An account already exists for this email.',
      'auth/invalid-credential': 'The email or password is incorrect.',
      'auth/invalid-email': 'Enter a valid email address.',
      'auth/popup-closed-by-user': 'The sign-in window was closed before completion.',
      'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow popups and try again.',
      'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
      'auth/weak-password': 'Use a stronger password with at least six characters.',
      'auth/operation-not-allowed': 'This sign-in provider is not enabled in Firebase yet.',
      'auth/unauthorized-domain': 'This localhost domain is not authorized in Firebase.',
      'auth/account-exists-with-different-credential': 'Use the provider linked to this email address.'
    };

    return messages[authError.code] || 'Unable to complete authentication. Please try again.';
  };

  const runProviderLogin = async (provider) => {
    resetFeedback();
    setSubmitting(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithPopup(auth, provider);
    } catch (authError) {
      setError(getAuthError(authError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    resetFeedback();
    setSubmitting(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      localStorage.setItem('arise_remember_session', String(rememberMe));
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (authError) {
      setError(getAuthError(authError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    resetFeedback();
    if (!email) {
      setError('Enter your email first so we know where to send the reset link.');
      return;
    }

    setSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setNotice('Password reset link sent. Check your inbox.');
    } catch (authError) {
      setError(getAuthError(authError));
    } finally {
      setSubmitting(false);
    }
  };

  const isSignup = mode === 'signup';

  return (
    <main className="auth-screen">
      <section className="auth-shell" aria-labelledby="auth-title">
        <div className="auth-brand">
          <div className="auth-brand-mark">✦</div>
          <h1 id="auth-title">ARISE</h1>
          <p>Enter the system. Build your legend.</p>
        </div>

        <div className="auth-card arise-card">
          <div className="auth-card-header">
            <div>
              <h2>{isSignup ? 'Create your account' : 'Welcome back, hunter'}</h2>
              <p>{isSignup ? 'Begin your ascent.' : 'Resume your progression.'}</p>
            </div>
            <span className="auth-mode">{isSignup ? 'New awakening' : 'Secure access'}</span>
          </div>

          <div className="auth-socials">
            <button
              type="button"
              className="auth-social-button"
              onClick={() => runProviderLogin(new GoogleAuthProvider())}
              disabled={submitting}
            >
              <span className="auth-social-icon">G</span>
              Continue with Google
            </button>
            <button
              type="button"
              className="auth-social-button"
              onClick={() => runProviderLogin(new GithubAuthProvider())}
              disabled={submitting}
            >
              <span className="auth-social-icon">◆</span>
              Continue with GitHub
            </button>
          </div>

          <div className="auth-divider"><span>or use email</span></div>

          <form className="auth-form" onSubmit={handleEmailAuth}>
            <div className="auth-field">
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hunter@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                minLength="6"
                required
              />
            </div>

            <div className="auth-options">
              <label className="auth-check">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    setRememberMe(e.target.checked);
                    localStorage.setItem('arise_remember_session', String(e.target.checked));
                  }}
                />
                <span>Keep me signed in</span>
              </label>
              <button
                type="button"
                className="auth-show-password"
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? 'Hide password' : 'Show password'}
              </button>
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}
            {notice && <p className="auth-error" role="status">{notice}</p>}

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Connecting...' : 'Awaken System'}
            </button>
          </form>

          {!isSignup && (
            <button className="auth-secondary-button" type="button" onClick={handleResetPassword} disabled={submitting}>
              Forgot your password?
            </button>
          )}

          <p className="auth-footer">
            {isSignup ? 'Already awakened?' : 'New to the system?'}{' '}
            <button type="button" onClick={() => { resetFeedback(); setMode(isSignup ? 'login' : 'signup'); }}>
              {isSignup ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </div>

        <p className="auth-legal">Your progression is secured by Firebase Authentication.</p>
      </section>
    </main>
  );
}
