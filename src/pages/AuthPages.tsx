import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { validatePakistaniPhone } from '../data/pakistan.ts';

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

// ============================================================
// LOGIN PAGE
// ============================================================
export const LoginPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { login, loginAsAdmin, loginAsDemoUser, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleDemoCustomer = async () => {
    await loginAsDemoUser();
    onNavigate('dashboard');
  };

  const handleDemoAdmin = async () => {
    await loginAsAdmin();
    onNavigate('admin');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-[#121212] border border-[#242424] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Member Privileges
          </span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Sign In to Zikala</h1>
          <p className="text-xs text-gray-400 mt-1">
            Access your order history, delivery addresses, and VIP concierge.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-red-300 text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#181818] border border-[#2B2B2B] pl-9 pr-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-300">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-gray-400 hover:text-[#D4AF37] text-[11px]"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#181818] border border-[#2B2B2B] pl-9 pr-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full gold-button py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="pt-3 border-t border-[#202020] space-y-2">
          <span className="block text-center text-[11px] text-gray-500 uppercase tracking-wider">
            Quick One-Click Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDemoCustomer}
              className="w-full py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2F2F2F] hover:border-[#D4AF37] rounded-lg text-[11px] text-gray-300 hover:text-white transition-colors"
            >
              Demo Customer
            </button>
            <button
              onClick={handleDemoAdmin}
              className="w-full py-2 bg-[#221B0C] hover:bg-[#2D230F] border border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-lg text-[11px] text-[#D4AF37] font-semibold transition-colors"
            >
              Admin Panel
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 pt-2">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-[#D4AF37] font-semibold hover:underline"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// REGISTER PAGE
// ============================================================
export const RegisterPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePakistaniPhone(phone)) {
      setError('Please provide a valid Pakistani mobile number (e.g. 03001234567).');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register(name, email, phone, password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-[#121212] border border-[#242424] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Become a Patron
          </span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Create Zikala Account</h1>
          <p className="text-xs text-gray-400 mt-1">
            Join Pakistan's premier horological community for exclusive benefits.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-red-300 text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shahzaib Ahmed"
                className="w-full bg-[#181818] border border-[#2B2B2B] pl-9 pr-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#181818] border border-[#2B2B2B] pl-9 pr-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Pakistani Mobile Number *</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full bg-[#181818] border border-[#2B2B2B] pl-9 pr-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#181818] border border-[#2B2B2B] pl-9 pr-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Confirm Password *</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-[#181818] border border-[#2B2B2B] pl-9 pr-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full gold-button py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-[#D4AF37] font-semibold hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// FORGOT PASSWORD PAGE
// ============================================================
export const ForgotPasswordPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-[#121212] border border-[#242424] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Password Recovery
          </span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Reset Your Password</h1>
          <p className="text-xs text-gray-400 mt-1">
            Enter your registered email address to receive secure reset credentials.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-4 rounded-xl bg-[#142217] border border-emerald-800/60 text-emerald-300 text-xs space-y-3 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
            <p className="font-semibold text-white">Reset Instructions Sent!</p>
            <p className="text-gray-300">
              We have dispatched password recovery instructions to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="gold-button px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 mb-1">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#181818] border border-[#2B2B2B] pl-9 pr-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full gold-button py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg"
            >
              Send Recovery Link
            </button>

            <div className="text-center text-xs text-gray-400 pt-2">
              Remember your password?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-[#D4AF37] font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
