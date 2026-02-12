import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { authAPI } from '../../services/api';
import './AuthSplit.css';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword(resetToken, password);
      addToast(response?.message || 'Password updated successfully.', 'success');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to reset password.';
      setError(message);
      addToast(message, 'error');
    }
    setLoading(false);
  };

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
          <div className="auth-header">
            <h2>Create a new password</h2>
            <p>Pick a strong password you have not used before.</p>
          </div>

          <form className="auth-fields" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>New Password</span>
              <div className="auth-password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  placeholder="Enter a new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <label className="auth-field">
              <span>Confirm Password</span>
              <div className="auth-password">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ResetPassword;
