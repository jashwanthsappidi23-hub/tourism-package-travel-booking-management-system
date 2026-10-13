import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, Eye, EyeOff, Lock, Mail, ArrowRight, 
  AlertCircle, Loader2, Sparkles, ShieldCheck 
} from 'lucide-react';

export default function Login({ onNavigate }) {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await login({ email: email.trim(), password });
      if (user.role === 'Administrator') onNavigate('admin-dashboard');
      else if (user.role === 'Guide') onNavigate('guide-dashboard');
      else onNavigate('customer-dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const user = await demoLogin(role);
      if (user.role === 'Administrator') onNavigate('admin-dashboard');
      else if (user.role === 'Guide') onNavigate('guide-dashboard');
      else onNavigate('customer-dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div 
            onClick={() => onNavigate('home')} 
            className="inline-flex items-center gap-2 cursor-pointer mb-2"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center">
              <Compass className="w-6 h-6 text-coral-500" />
            </div>
            <span className="text-2xl font-black text-brand-900">Bharat<span className="text-coral-500">Yatra</span></span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to Your Account</h1>
          <p className="text-xs text-slate-500">Access your tour packages, reservations, and travel itineraries</p>
        </div>

        {/* Instant Demo Role Quick Login Pills */}
        <div className="p-3.5 bg-brand-50 rounded-2xl border border-brand-200 text-center">
          <span className="text-[11px] font-bold text-brand-800 flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-coral-500" /> Instant 1-Click Evaluation Login
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-1.5 px-2 bg-white hover:bg-slate-100 text-brand-900 text-[11px] font-bold rounded-lg border border-brand-200 transition"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('guide')}
              className="py-1.5 px-2 bg-white hover:bg-slate-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-brand-200 transition"
            >
              Tour Guide
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 bg-white hover:bg-slate-100 text-indigo-800 text-[11px] font-bold rounded-lg border border-brand-200 transition"
            >
              Admin (DBA)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email or Mobile Number</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. arjun.sharma@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-[11px] font-bold text-coral-600 hover:text-coral-700"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-coral-500"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Mock Google Login Button */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <div className="relative flex justify-center text-[11px]"><span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span></div>
        </div>

        <button
          type="button"
          onClick={() => handleQuickDemo('customer')}
          className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Google Sign-In (Demo Connect)
        </button>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="font-extrabold text-coral-600 hover:text-coral-700"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
