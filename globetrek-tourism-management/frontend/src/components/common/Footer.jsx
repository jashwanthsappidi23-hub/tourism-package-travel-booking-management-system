import React from 'react';
import { Globe2, ShieldCheck, CreditCard, Award, Heart, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-brand-900 text-slate-300 pt-16 pb-12 border-t border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-brand-800">
          
          {/* Col 1: Brand & Academic Statement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-coral-500 flex items-center justify-center text-white font-black shadow-md">
                <Globe2 className="w-6 h-6 text-amber-300" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Globe<span className="text-coral-500">Trek</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Worldwide Tourism Package and Travel Booking Platform. Curated international and domestic holiday tours, verified 4-star & 5-star hotel partners, guaranteed departures, and seamless online booking.
            </p>
            <div className="bg-brand-800/60 p-3 rounded-xl border border-brand-700 text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">Verified Travel Network</span>
              50+ destinations worldwide, certified local guides, and 100% refundable cancellation protection.
            </div>
          </div>

          {/* Col 2: Domestic & International Holiday Routes */}
          <div>
            <h4 className="text-white font-black text-xs tracking-wider uppercase mb-4">
              Trending Holiday Routes
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/packages?destination=Kashmir" onClick={(e) => { e.preventDefault(); onNavigate('packages', { destination: 'Kashmir' }); }} className="hover:text-coral-400 transition cursor-pointer">🏔️ Kashmir Valley & Dal Lake Tour</a></li>
              <li><a href="/packages?destination=Goa" onClick={(e) => { e.preventDefault(); onNavigate('packages', { destination: 'Goa' }); }} className="hover:text-coral-400 transition cursor-pointer">🏖️ Goa Beach Holidays & Cruises</a></li>
              <li><a href="/packages?destination=Kerala" onClick={(e) => { e.preventDefault(); onNavigate('packages', { destination: 'Kerala' }); }} className="hover:text-coral-400 transition cursor-pointer">🌿 Kerala Backwaters & Munnar</a></li>
              <li><a href="/packages?destination=Paris" onClick={(e) => { e.preventDefault(); onNavigate('packages', { destination: 'Paris' }); }} className="hover:text-coral-400 transition cursor-pointer">🇫🇷 Paris Romantic Getaway Package</a></li>
              <li><a href="/packages?destination=Swiss%20Alps" onClick={(e) => { e.preventDefault(); onNavigate('packages', { destination: 'Swiss Alps' }); }} className="hover:text-coral-400 transition cursor-pointer">🇨🇭 Swiss Alps Adventure Tour</a></li>
              <li><a href="/packages?destination=Bali" onClick={(e) => { e.preventDefault(); onNavigate('packages', { destination: 'Bali' }); }} className="hover:text-coral-400 transition cursor-pointer">🇮🇩 Bali Island Escape & Resorts</a></li>
              <li><a href="/packages?destination=Dubai" onClick={(e) => { e.preventDefault(); onNavigate('packages', { destination: 'Dubai' }); }} className="hover:text-coral-400 transition cursor-pointer">🇦🇪 Dubai Luxury Experience & Desert Safari</a></li>
              <li><a href="/packages?destination=Tokyo" onClick={(e) => { e.preventDefault(); onNavigate('packages', { destination: 'Tokyo' }); }} className="hover:text-coral-400 transition cursor-pointer">🇯🇵 Japan Cultural Discovery Tour</a></li>
            </ul>
          </div>

          {/* Col 3: Portal Navigation */}
          <div>
            <h4 className="text-white font-black text-xs tracking-wider uppercase mb-4">
              Explore GlobeTrek
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-coral-400 transition cursor-pointer">Home Overview</a></li>
              <li><a href="/packages" onClick={(e) => { e.preventDefault(); onNavigate('packages'); }} className="hover:text-coral-400 transition cursor-pointer">All Tour Packages</a></li>
              <li><a href="/destinations" onClick={(e) => { e.preventDefault(); onNavigate('destinations'); }} className="hover:text-coral-400 transition cursor-pointer">Worldwide Destinations (50+)</a></li>
              <li><a href="/packages?type=domestic" onClick={(e) => { e.preventDefault(); onNavigate('packages', { is_domestic: true }); }} className="hover:text-coral-400 transition cursor-pointer">Domestic India Tours</a></li>
              <li><a href="/packages?type=international" onClick={(e) => { e.preventDefault(); onNavigate('packages', { is_domestic: false }); }} className="hover:text-coral-400 transition cursor-pointer">International Tours</a></li>
              <li><a href="/my-bookings" onClick={(e) => { e.preventDefault(); onNavigate('my-bookings'); }} className="hover:text-coral-400 transition cursor-pointer">My Bookings & Tickets</a></li>
              <li><a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-coral-400 transition cursor-pointer">About GlobeTrek Architecture</a></li>
              <li><a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-coral-400 transition cursor-pointer">Contact Support & Travel Desk</a></li>
              <li><a href="/reports" onClick={(e) => { e.preventDefault(); onNavigate('reports-analytics'); }} className="hover:text-coral-400 transition cursor-pointer">14 Relational SQL Reports</a></li>
              <li><a href="/llms.txt" className="hover:text-coral-400 transition cursor-pointer font-mono text-[11px]">AI Specification (llms.txt)</a></li>
            </ul>
          </div>

          {/* Col 4: Trust, Safety & Helpline */}
          <div className="space-y-4">
            <h4 className="text-white font-black text-xs tracking-wider uppercase mb-4">
              Trust & Concierge
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Verified Stays & Private Transfers</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Licensed Multi-lingual Tour Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-coral-400 shrink-0" />
                <span>Secure Demo Payment Sandbox (UPI / Cards)</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-400 mb-1">24x7 Global Travel Support</div>
              <div className="text-white font-bold text-sm flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-coral-500" /> 1800-GLOBE-TREK
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-coral-500" /> concierge@globetrek.com
              </div>
            </div>
          </div>
        </div>

        {/* Bottom credits & SEO Footer Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} GlobeTrek Holidays Ltd. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a href="/packages" onClick={(e) => { e.preventDefault(); onNavigate('packages'); }} className="hover:text-white transition">Tour Packages</a>
            <a href="/destinations" onClick={(e) => { e.preventDefault(); onNavigate('destinations'); }} className="hover:text-white transition">Destinations</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-white transition">About Us</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-white transition">Help Desk</a>
            <a href="/sitemap.xml" className="hover:text-white transition">Sitemap XML</a>
            <a href="/llms.txt" className="hover:text-white transition">llms.txt</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
