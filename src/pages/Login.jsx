import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  PieChart,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, signup, loginWithDemo, loginWithProvider, resetPassword } = useAuth();
  const { showToast, setUserProfile } = useExpense();

  const destination = location.state?.from?.pathname || '/';

  // Automatically redirect if already signed in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, destination, navigate]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ error: '', success: '' });
  const [isResetting, setIsResetting] = useState(false);

  // Handle successful login redirect
  const handleAuthSuccess = (userData, message) => {
    if (userData?.name) {
      setUserProfile((prev) => ({
        ...prev,
        name: userData.name,
        email: userData.email,
        jobTitle: userData.role || prev.jobTitle,
      }));
    }
    showToast(message || `Welcome back, ${userData?.name?.split(' ')[0] || 'User'}!`, 'success');
    navigate(destination, { replace: true });
  };

  // Sign In / Sign Up Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('You must agree to the Terms of Service & Privacy Policy.');
        return;
      }

      setIsSubmitting(true);
      const res = await signup(name, email, password);
      setIsSubmitting(false);

      if (res.success) {
        handleAuthSuccess(res.user, 'Account created successfully! Welcome to SpendWise.');
      } else {
        setErrorMessage(res.message);
      }
    } else {
      setIsSubmitting(true);
      const res = await login(email, password, rememberMe);
      setIsSubmitting(false);

      if (res.success) {
        handleAuthSuccess(res.user);
      } else {
        setErrorMessage(res.message);
      }
    }
  };

  // Demo Login Handler
  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    const res = await loginWithDemo();
    setIsSubmitting(false);
    if (res.success) {
      handleAuthSuccess(res.user, 'Signed in with Demo Account!');
    }
  };

  // Social Login Handler
  const handleSocialLogin = async (provider) => {
    setIsSubmitting(true);
    setErrorMessage('');
    const res = await loginWithProvider(provider);
    setIsSubmitting(false);
    if (res.success) {
      handleAuthSuccess(res.user, `Signed in with ${provider === 'google' ? 'Google' : 'GitHub'}!`);
    }
  };

  // Quick fill helper for demo credentials
  const fillCredentials = (fillEmail, fillPass) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setIsSignUp(false);
    setErrorMessage('');
  };

  // Forgot Password Submit
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotStatus({ error: '', success: '' });

    if (!forgotEmail || !newPassword) {
      setForgotStatus({ error: 'Please enter both your email and a new password.', success: '' });
      return;
    }

    if (newPassword.length < 6) {
      setForgotStatus({ error: 'New password must be at least 6 characters.', success: '' });
      return;
    }

    setIsResetting(true);
    const res = await resetPassword(forgotEmail, newPassword);
    setIsResetting(false);

    if (res.success) {
      setForgotStatus({ error: '', success: res.message });
      setEmail(forgotEmail);
      setPassword(newPassword);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotStatus({ error: '', success: '' });
        showToast('Password changed! You can now sign in.', 'success');
      }, 1500);
    } else {
      setForgotStatus({ error: res.message, success: '' });
    }
  };

  // Password strength helper for sign up
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', color: 'bg-slate-700', width: '0%' };
    if (pass.length < 6) return { label: 'Weak', color: 'bg-rose-500', width: '25%' };
    if (pass.length < 10) return { label: 'Medium', color: 'bg-amber-500', width: '60%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-5xl bg-[#111827]/90 backdrop-blur-xl border border-[#273449] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Column: Visual Showcase & Brand Intro (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-gradient-to-br from-[#172033]/90 to-[#0F172A]/90 border-r border-[#273449] relative">
          <div className="relative z-10 space-y-8">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
                <Wallet className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-[#F8FAFC]">
                  Spend<span className="text-emerald-400">Wise</span>
                </span>
                <span className="block text-[11px] font-bold tracking-widest text-emerald-400/90 uppercase">
                  Financial OS
                </span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <h2 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight leading-snug">
                Take complete control of your financial destiny.
              </h2>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Effortless tracking, proactive monthly budgeting, and intelligent cashflow analytics in one privacy-first workspace.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC]">Live Cashflow Analytics</h4>
                  <p className="text-[11px] text-[#94A3B8]">Comprehensive monthly trends, daily spending patterns, and category charts.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC]">Proactive Budget Caps</h4>
                  <p className="text-[11px] text-[#94A3B8]">Smart visual alerts when you approach or cross category spending limits.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC]">100% Client-Side Privacy</h4>
                  <p className="text-[11px] text-[#94A3B8]">Your financial records remain local and completely private to your device.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Interactive Preview Card */}
          <div className="relative z-10 mt-8 p-4 rounded-2xl bg-[#0B1120]/80 border border-[#273449] shadow-lg">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#273449]/70">
              <span className="text-[#94A3B8] font-medium flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> October Snapshot
              </span>
              <span className="text-emerald-400 font-bold font-mono">+₹84,800 Net</span>
            </div>
            <div className="pt-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Total Income</span>
                <span className="text-sm font-extrabold text-[#F8FAFC] font-mono">₹1,83,000</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Total Expenses</span>
                <span className="text-sm font-extrabold text-rose-400 font-mono">₹98,200</span>
              </div>
            </div>
            <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '64%' }} />
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Mobile Header */}
          <div className="flex lg:hidden items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-[#F8FAFC]">
                Spend<span className="text-emerald-400">Wise</span>
              </span>
              <span className="block text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                Financial OS
              </span>
            </div>
          </div>

          {/* Quick Demo Login Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">Exploring SpendWise?</p>
                <p className="text-[11px] text-[#94A3B8]">Test drive all features with realistic demo data.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="py-1.5 px-3.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap self-start sm:self-auto"
            >
              <span>Instant Demo Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab Selector: Sign In / Create Account */}
          <div className="flex p-1 bg-[#1E293B] rounded-2xl border border-[#273449] mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                !isSignUp
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isSignUp
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
              {isSignUp ? 'Create your SpendWise account' : 'Welcome back'}
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              {isSignUp
                ? 'Start tracking your expenses and mastering your budget today.'
                : 'Enter your credentials to access your financial dashboard.'}
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start space-x-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nikhil Pathak"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setIsForgotModalOpen(true);
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 pl-10 pr-10 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter during Sign Up */}
              {isSignUp && password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#94A3B8]">Strength:</span>
                    <span className="font-semibold text-[#F8FAFC]">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 pl-10 pr-10 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Checkbox Options */}
            <div className="pt-1">
              {!isSignUp ? (
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#1E293B] border-[#273449] text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 focus:ring-1"
                  />
                  <span className="text-xs text-[#94A3B8]">Remember me on this browser</span>
                </label>
              ) : (
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#1E293B] border-[#273449] text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 focus:ring-1"
                  />
                  <span className="text-xs text-[#94A3B8]">
                    I agree to the Terms of Service & Privacy Policy
                  </span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create My Account' : 'Sign In to SpendWise'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Sign In Divider */}
          <div className="my-6 flex items-center space-x-3">
            <div className="flex-1 h-px bg-[#273449]" />
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
              or continue with
            </span>
            <div className="flex-1 h-px bg-[#273449]" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#1E293B] hover:bg-[#273449] border border-[#273449] text-xs font-semibold text-[#F8FAFC] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.2 7.5 23 12 23z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#1E293B] hover:bg-[#273449] border border-[#273449] text-xs font-semibold text-[#F8FAFC] transition-colors"
            >
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          {/* Quick Demo Credentials Preset Card */}
          <div className="mt-6 pt-4 border-t border-[#273449]/70">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Preset Demo Credentials (click to fill):
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('nikhil@spendwise.app', 'password123')}
                className="py-1.5 px-2.5 rounded-lg bg-[#1E293B] hover:bg-[#273449] border border-[#273449] text-[11px] text-emerald-400 font-mono transition-colors"
              >
                nikhil@spendwise.app
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('demo@spendwise.app', 'password123')}
                className="py-1.5 px-2.5 rounded-lg bg-[#1E293B] hover:bg-[#273449] border border-[#273449] text-[11px] text-purple-400 font-mono transition-colors"
              >
                demo@spendwise.app
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#172033] border border-[#273449] rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotStatus({ error: '', success: '' });
              }}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-lg hover:bg-[#1E293B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F8FAFC]">Reset Password</h3>
                <p className="text-xs text-[#94A3B8]">Set a new password for your account</p>
              </div>
            </div>

            {forgotStatus.error && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{forgotStatus.error}</span>
              </div>
            )}

            {forgotStatus.success && (
              <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{forgotStatus.success}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  Account Email
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-[#94A3B8] hover:bg-[#1E293B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isResetting ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
