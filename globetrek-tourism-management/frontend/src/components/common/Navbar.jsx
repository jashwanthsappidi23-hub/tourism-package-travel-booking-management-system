import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Globe2, Compass, User, ShieldCheck, MapPin, Calendar, 
  LogOut, LogIn, ChevronDown, Sparkles, BookOpen, 
  Menu, X, PhoneCall, Database, Heart, Palmtree, Mountain, Users
} from 'lucide-react';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, isAuthenticated, role, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleSwitch = async (targetRole) => {
    try {
      await demoLogin(targetRole);
      if (targetRole === 'admin') onNavigate('admin-dashboard');
      else if (targetRole === 'guide') onNavigate('guide-dashboard');
      else onNavigate('customer-dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-brand-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              GlobeTrek — Worldwide Tourism Package & Travel Booking Platform (MMT Reference Edition)
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <PhoneCall className="w-3 h-3 text-coral-500" /> 24x7 Global Travel Concierge: 1800-GLOBE-TREK
            </span>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Demo Profile:</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleRoleSwitch('customer')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${role === 'Customer' ? 'bg-coral-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Customer
              </button>
              <button 
                onClick={() => handleRoleSwitch('guide')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${role === 'Guide' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Tour Guide
              </button>
              <button 
                onClick={() => handleRoleSwitch('admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${role === 'Administrator' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Admin (DBA)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo: GlobeTrek */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }} 
          className="flex items-center gap-3 cursor-pointer group select-none no-underline"
          title="GlobeTrek Holidays Home"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-900 via-brand-700 to-coral-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Globe2 className="w-6 h-6 text-amber-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-brand-900">
                Globe<span className="text-coral-500">Trek</span>
              </span>
              <span className="bg-coral-50 border border-coral-200 text-coral-600 text-[10px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider">
                Holidays
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold -mt-1 tracking-wide">
              Worldwide Tourism & Travel Booking Platform
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1" aria-label="Primary Navigation">
          <a 
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className={`px-2.5 py-2 rounded-lg text-xs font-bold transition ${currentPage === 'home' ? 'text-coral-500 bg-coral-50' : 'text-slate-700 hover:text-brand-700 hover:bg-slate-100'}`}
          >
            Home
          </a>
          
          <a 
            href="/packages"
            onClick={(e) => { e.preventDefault(); onNavigate('packages'); }}
            className={`px-2.5 py-2 rounded-lg text-xs font-bold transition ${currentPage === 'packages' ? 'text-coral-500 bg-coral-50' : 'text-slate-700 hover:text-brand-700 hover:bg-slate-100'}`}
          >
            Holiday Packages
          </a>

          <a 
            href="/destinations"
            onClick={(e) => { e.preventDefault(); onNavigate('destinations'); }}
            className={`px-2.5 py-2 rounded-lg text-xs font-bold transition ${currentPage === 'destinations' ? 'text-coral-500 bg-coral-50' : 'text-slate-700 hover:text-brand-700 hover:bg-slate-100'}`}
          >
            Destinations
          </a>

          {/* Quick Segment Filter Navigation: Domestic & International Tours */}
          <a 
            href="/packages?type=domestic"
            onClick={(e) => { e.preventDefault(); onNavigate('packages', { is_domestic: true }); }}
            className="px-2.5 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-brand-700 hover:bg-slate-100 transition"
          >
            Domestic Tours
          </a>

          <a 
            href="/packages?type=international"
            onClick={(e) => { e.preventDefault(); onNavigate('packages', { is_domestic: false }); }}
            className="px-2.5 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-brand-700 hover:bg-slate-100 transition"
          >
            International Tours
          </a>

          {/* Thematic Tour Categories */}
          <a 
            href="/packages?category=Honeymoon"
            onClick={(e) => { e.preventDefault(); onNavigate('packages', { category: 'Honeymoon' }); }}
            className="px-2.5 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-brand-700 hover:bg-slate-100 transition flex items-center gap-1"
          >
            <Heart className="w-3 h-3 text-coral-500" /> Honeymoon
          </a>

          <a 
            href="/packages?category=Family"
            onClick={(e) => { e.preventDefault(); onNavigate('packages', { category: 'Family' }); }}
            className="px-2.5 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-brand-700 hover:bg-slate-100 transition flex items-center gap-1"
          >
            <Users className="w-3 h-3 text-brand-600" /> Family Trips
          </a>

          <a 
            href="/packages?category=Adventure"
            onClick={(e) => { e.preventDefault(); onNavigate('packages', { category: 'Adventure' }); }}
            className="px-2.5 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-brand-700 hover:bg-slate-100 transition flex items-center gap-1"
          >
            <Mountain className="w-3 h-3 text-emerald-600" /> Adventure
          </a>

          <a 
            href="/about"
            onClick={(e) => { e.preventDefault(); onNavigate('about'); }}
            className={`px-2.5 py-2 rounded-lg text-xs font-bold transition ${currentPage === 'about' ? 'text-coral-500 bg-coral-50' : 'text-slate-700 hover:text-brand-700 hover:bg-slate-100'}`}
          >
            About Us
          </a>

          <a 
            href="/contact"
            onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
            className={`px-2.5 py-2 rounded-lg text-xs font-bold transition ${currentPage === 'contact' ? 'text-coral-500 bg-coral-50' : 'text-slate-700 hover:text-brand-700 hover:bg-slate-100'}`}
          >
            Contact
          </a>

          {/* Conditional Role Portals */}
          {role === 'Administrator' && (
            <a 
              href="/admin-dashboard"
              onClick={(e) => { e.preventDefault(); onNavigate('admin-dashboard'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${currentPage.startsWith('admin') ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
            </a>
          )}

          {role === 'Guide' && (
            <a 
              href="/guide-dashboard"
              onClick={(e) => { e.preventDefault(); onNavigate('guide-dashboard'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${currentPage === 'guide-dashboard' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Guide Roster
            </a>
          )}

          {/* Live SQL Reports strictly for Administrator role */}
          {role === 'Administrator' && (
            <a 
              href="/reports"
              onClick={(e) => { e.preventDefault(); onNavigate('reports-analytics'); }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${currentPage === 'reports-analytics' ? 'bg-amber-500 text-slate-900' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'}`}
            >
              <Database className="w-3.5 h-3.5 text-amber-600" />
              SQL Reports
            </a>
          )}
        </nav>

        {/* Right Authentication / Profile Section */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <a
                href="/my-bookings"
                onClick={(e) => { e.preventDefault(); onNavigate('my-bookings'); }}
                className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-coral-500 hover:bg-slate-100 rounded-xl transition"
              >
                My Bookings
              </a>

              <div 
                onClick={() => {
                  if (role === 'Administrator') onNavigate('admin-dashboard');
                  else if (role === 'Guide') onNavigate('guide-dashboard');
                  else onNavigate('customer-dashboard');
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer transition border border-slate-200"
              >
                <div className="w-7 h-7 rounded-full bg-brand-700 text-white font-black text-xs flex items-center justify-center">
                  {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                    {user?.full_name || user?.email}
                  </div>
                  <div className="text-[10px] font-semibold text-coral-600 leading-none">{role}</div>
                </div>
              </div>

              <button 
                onClick={logout}
                title="Sign out"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a 
                href="/login"
                onClick={(e) => { e.preventDefault(); onNavigate('login'); }}
                className="px-4 py-2 text-xs font-bold text-brand-800 hover:bg-slate-100 rounded-xl transition"
              >
                Login
              </a>
              <a 
                href="/register"
                onClick={(e) => { e.preventDefault(); onNavigate('register'); }}
                className="px-4 py-2 text-xs font-extrabold bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white rounded-xl shadow-sm hover:shadow transition"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); setMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-100 rounded">Home</a>
            <a href="/packages" onClick={(e) => { e.preventDefault(); onNavigate('packages'); setMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-100 rounded">Holiday Packages</a>
            <a href="/destinations" onClick={(e) => { e.preventDefault(); onNavigate('destinations'); setMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-100 rounded">Destinations</a>
            <a href="/packages?type=domestic" onClick={(e) => { e.preventDefault(); onNavigate('packages', { is_domestic: true }); setMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-100 rounded">Domestic Tours</a>
            <a href="/packages?type=international" onClick={(e) => { e.preventDefault(); onNavigate('packages', { is_domestic: false }); setMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-100 rounded">International Tours</a>
            <a href="/packages?category=Honeymoon" onClick={(e) => { e.preventDefault(); onNavigate('packages', { category: 'Honeymoon' }); setMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-100 rounded">Honeymoon</a>
            <a href="/packages?category=Family" onClick={(e) => { e.preventDefault(); onNavigate('packages', { category: 'Family' }); setMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-100 rounded">Family Trips</a>
            <a href="/packages?category=Adventure" onClick={(e) => { e.preventDefault(); onNavigate('packages', { category: 'Adventure' }); setMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-100 rounded">Adventure</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); setMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-100 rounded">About Us</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); setMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-100 rounded">Contact</a>
            {role === 'Customer' && (
              <a href="/my-bookings" onClick={(e) => { e.preventDefault(); onNavigate('my-bookings'); setMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-100 rounded text-coral-600">My Bookings</a>
            )}
            {role === 'Administrator' && (
              <a href="/admin-dashboard" onClick={(e) => { e.preventDefault(); onNavigate('admin-dashboard'); setMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-100 rounded text-indigo-700">Admin Portal</a>
            )}
          </div>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            {isAuthenticated ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-slate-600 font-medium">{user?.email} ({role})</span>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-xs text-red-600 font-bold">Sign Out</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <a href="/login" onClick={(e) => { e.preventDefault(); onNavigate('login'); setMobileMenuOpen(false); }} className="flex-1 py-2 text-xs font-bold text-center border rounded-lg">Login</a>
                <a href="/register" onClick={(e) => { e.preventDefault(); onNavigate('register'); setMobileMenuOpen(false); }} className="flex-1 py-2 text-xs font-bold text-center bg-coral-500 text-white rounded-lg">Sign Up</a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
