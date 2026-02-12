import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { authAPI } from '../../services/api';
import './AuthSplit.css';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const result = mode === 'login'
      ? await login(formData.email, formData.password)
      : await register(formData.name, formData.email, formData.password);

    if (result.success) {
      addToast(mode === 'login' ? 'Login successful!' : 'Account created!', 'success');
      navigate('/dashboard');
    } else {
      const message = result.error || 'Something went wrong. Please try again.';
      setError(message);
      addToast(message, 'error');
    }

    setLoading(false);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setError('');

    if (!resetEmail.trim()) {
      setError('Email is required.');
      setResetLoading(false);
      return;
    }

    try {
      const response = await authAPI.forgotPassword(resetEmail.trim());
      addToast(response?.message || 'If an account exists, a reset link has been sent.', 'info');
      setShowReset(false);
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to send reset email.';
      setError(message);
      addToast(message, 'error');
    }

    setResetLoading(false);
  };

  const isLogin = mode === 'login';

  return (
    <div className="auth-page">
      <section className="auth-visual" aria-hidden="true">
        <div className="auth-visual-content">
          <h1>Summarize News in Seconds</h1>
          <p className="auth-visual-subtext">
            Paste any news article and get a clear, concise summary instantly.
          </p>
        </div>
      </section>

      <section className="auth-form">
        <div className="auth-form-inner">
          {!showReset && (
            <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                role="tab"
                aria-selected={isLogin}
                className={isLogin ? 'auth-toggle-btn active' : 'auth-toggle-btn'}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!isLogin}
                className={!isLogin ? 'auth-toggle-btn active' : 'auth-toggle-btn'}
                onClick={() => setMode('signup')}
              >
                Signup
              </button>
            </div>
          )}

          {!showReset ? (
            <>
              <div className="auth-header">
                <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
                <p>
                  {isLogin
                    ? 'Log in to access your latest summaries.'
                    : 'Start summarizing the news with a fresh account.'}
                </p>
              </div>

              <form className="auth-fields" onSubmit={handleSubmit}>
                {!isLogin && (
                  <label className="auth-field">
                    <span>Name</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Jamie Rivera"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </label>
                )}

                <label className="auth-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="auth-field">
                  <span>Password</span>
                  <div className="auth-password">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                {isLogin && (
                  <button
                    type="button"
                    className="auth-forgot-link"
                    onClick={() => {
                      setResetEmail(formData.email);
                      setShowReset(true);
                      setError('');
                    }}
                  >
                    Forgot password?
                  </button>
                )}

                {!isLogin && (
                  <label className="auth-field">
                    <span>Confirm Password</span>
                    <div className="auth-password">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </label>
                )}

                {error && <p className="auth-error" role="alert">{error}</p>}

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign up'}
                </button>
              </form>

              <p className="auth-switch">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => setMode(isLogin ? 'signup' : 'login')}
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="auth-header">
                <h2>Reset your password</h2>
                <p>We will send a secure reset link to your email.</p>
              </div>

              <form className="auth-fields" onSubmit={handleResetSubmit}>
                <label className="auth-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="resetEmail"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </label>

                {error && <p className="auth-error" role="alert">{error}</p>}

                <button type="submit" className="auth-submit" disabled={resetLoading}>
                  {resetLoading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <button
                type="button"
                className="auth-back-link"
                onClick={() => setShowReset(false)}
              >
                Back to login
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Login;
