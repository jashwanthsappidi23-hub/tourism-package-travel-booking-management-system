import React, { useState, useEffect } from 'react';
import HeroSearch from '../components/home/HeroSearch';
import PackageCard from '../components/packages/PackageCard';
import { api } from '../services/api';
import { 
  Sparkles, TrendingUp, ShieldCheck, Award, Heart, 
  MapPin, Compass, ArrowRight, Star, Clock, Gift, 
  CheckCircle2, Users, HelpCircle, Plane, Palmtree, Mountain
} from 'lucide-react';

export default function Home({ onNavigate, onSelectPackage }) {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pkgs, dests] = await Promise.all([
          api.getPackages(),
          api.getDestinations()
        ]);
        setPackages(pkgs);
        setDestinations(dests);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearch = (filters) => {
    onNavigate('packages', filters);
  };

  // 16 key destinations mentioned in prompt with images and starting prices
  const topDestinations = [
    { name: 'Kashmir', country: 'India', price: '₹28,999', img: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80' },
    { name: 'Manali', country: 'India', price: '₹16,999', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80' },
    { name: 'Goa', country: 'India', price: '₹14,500', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Kerala', country: 'India', price: '₹24,500', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80' },
    { name: 'Rajasthan', country: 'India', price: '₹21,999', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80' },
    { name: 'Andaman Islands', country: 'India', price: '₹38,500', img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80' },
    { name: 'Bali', country: 'Indonesia', price: '₹45,000', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80' },
    { name: 'Maldives', country: 'South Asia', price: '₹85,000', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80' },
    { name: 'Dubai', country: 'UAE', price: '₹60,000', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Thailand', country: 'Thailand', price: '₹54,000', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80' },
    { name: 'Singapore', country: 'Singapore', price: '₹72,000', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80' },
    { name: 'Switzerland', country: 'Europe', price: '₹1,50,000', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80' },
    { name: 'Paris', country: 'France', price: '₹75,000', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
    { name: 'Japan', country: 'Asia', price: '₹1,20,000', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Australia', country: 'Oceania', price: '₹1,40,000', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80' },
    { name: 'South Africa', country: 'Africa', price: '₹1,10,000', img: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80' },
  ];

  // Filtering for featured packages section
  const filterTabs = [
    { id: 'All', label: 'All Featured Packages' },
    { id: 'Domestic', label: 'Domestic India Tours' },
    { id: 'International', label: 'International Tours' },
    { id: 'Honeymoon', label: 'Honeymoon Specials' },
    { id: 'Family', label: 'Family Vacations' },
    { id: 'Adventure', label: 'Adventure & Nature' },
  ];

  const displayedPackages = packages.filter(p => {
    if (activeTab === 'Domestic') return p.is_domestic === true;
    if (activeTab === 'International') return p.is_domestic === false;
    if (activeTab === 'Honeymoon') return p.category?.toLowerCase().includes('honeymoon');
    if (activeTab === 'Family') return p.category?.toLowerCase().includes('family');
    if (activeTab === 'Adventure') return p.category?.toLowerCase().includes('adventure');
    return true;
  }).slice(0, 9);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. Hero Search Section (MakeMyTrip reference) */}
      <HeroSearch onSearch={handleHeroSearch} destinations={destinations} />

      {/* 2. Popular Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-28 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-coral-600 text-xs font-black uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" /> Worldwide & Domestic Hotspots
            </div>
            <h2 className="text-3xl font-black text-brand-900 tracking-tight">
              Popular Destinations
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explore the most loved vacation spots with handpicked hotels, excursions, and verified local guides.
            </p>
          </div>
          
          <button 
            onClick={() => onNavigate('destinations')}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-brand-800 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            View All ({destinations.length || 55} Destinations) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 16 Destination Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {topDestinations.map((dest) => (
            <div 
              key={dest.name}
              onClick={() => onNavigate('packages', { destination: dest.name })}
              className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-slate-900"
            >
              <img 
                src={dest.img} 
                alt={dest.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider block">
                  {dest.country}
                </span>
                <h3 className="font-black text-sm leading-tight text-white group-hover:text-amber-300 transition">
                  {dest.name}
                </h3>
                <span className="text-[10px] text-slate-300 block font-semibold mt-0.5">
                  From {dest.price}*
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Holiday Packages (MakeMyTrip format) */}
      <section className="bg-white py-16 border-y border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-coral-600 text-xs font-black uppercase tracking-wider">
              Handpicked Holiday Packages
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-900 tracking-tight mt-1">
              Featured Leisure Packages
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Comprehensive holiday travel experiences — curated hotels, seamless intercity transfers, and included sightseeing.
            </p>
          </div>

          {/* Segment Filter Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-brand-900 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Packages Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPackages.map(pkg => (
              <PackageCard 
                key={pkg.package_id} 
                pkg={pkg} 
                onSelect={(p) => { onSelectPackage(p); onNavigate('package-details'); }}
                onBookNow={(p) => { onSelectPackage(p); onNavigate('booking-flow'); }}
              />
            ))}
          </div>

          {/* View All Packages Action */}
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('packages')}
              className="px-8 py-3.5 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white text-xs font-black rounded-xl shadow-md hover:shadow-xl transition inline-flex items-center gap-2 cursor-pointer"
            >
              Explore All {packages.length} Holiday Packages <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              *Sample prices shown are illustrative demo quotations for academic project evaluation.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Value Propositions & Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-coral-50 text-coral-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-coral-500" />
            </div>
            <div>
              <h4 className="font-black text-sm text-brand-900">Guaranteed Departures</h4>
              <p className="text-xs text-slate-500 mt-1">Real-time capacity tracking prevents overbooking via database transactions.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h4 className="font-black text-sm text-brand-900">Verified Stays & Cars</h4>
              <p className="text-xs text-slate-500 mt-1">Handpicked 4-star & 5-star properties with clean AC tourist transit.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-black text-sm text-brand-900">Transparent Pricing</h4>
              <p className="text-xs text-slate-500 mt-1">No hidden surcharges. Clear inclusions, taxes, and cancellation refunds.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="font-black text-sm text-brand-900">Certified Local Guides</h4>
              <p className="text-xs text-slate-500 mt-1">Multi-lingual licensed regional guides assigned to each departure batch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Promotional Season Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
        <div className="bg-gradient-to-r from-coral-500 via-coral-600 to-amber-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-3">
              <Gift className="w-3.5 h-3.5" /> Early Bird Holiday Offers
            </div>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight">
              Get Up To 25% OFF On 2026/2027 Holiday Packages
            </h3>
            <p className="text-white/90 text-xs sm:text-sm mt-2">
              Book your dream vacation early and secure guaranteed departure slots with flexible payment and instant booking confirmation.
            </p>
          </div>

          <div className="relative z-10">
            <button
              onClick={() => onNavigate('packages')}
              className="px-6 py-3.5 bg-white text-coral-600 hover:bg-slate-50 text-xs font-black rounded-xl shadow-lg transition whitespace-nowrap cursor-pointer"
            >
              Browse Discounted Packages
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
