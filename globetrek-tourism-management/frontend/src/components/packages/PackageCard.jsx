import React from 'react';
import { 
  Calendar, Clock, MapPin, Star, ShieldCheck, ArrowRight, 
  Sparkles, CheckCircle2, Hotel, Bus, Utensils, Zap, Award, Plane
} from 'lucide-react';

export default function PackageCard({ 
  pkg, 
  onSelect, 
  onBookNow, 
  isSelected = false,
  travellersCount = 2 
}) {
  const originalPrice = Math.round(pkg.base_price * 1.25);
  const discountPercent = pkg.discount_percentage || 20;
  const totalEstimatedPrice = Math.round(pkg.base_price * (travellersCount || 2));

  // Cities / Destinations covered
  const placesList = pkg.destinations && pkg.destinations.length > 0
    ? pkg.destinations
    : [{ name: 'Scenic Tour', country: 'India' }];

  // Hotel Star Rating badge
  const starRating = pkg.hotel_star_rating || 4;
  const hotelBadge = starRating === 5 
    ? '⭐⭐⭐⭐⭐ 5-Star Luxury' 
    : starRating === 3 
      ? '⭐⭐⭐ 3-Star Comfort' 
      : '⭐⭐⭐⭐ 4-Star Premium';

  // Transportation details
  const transitText = pkg.flights_included 
    ? '✈️ Return Flights & AC Sedan' 
    : '🚗 AC Private Chauffeur Vehicle';

  // Included meals
  const mealsText = pkg.category?.includes('Honeymoon') || pkg.base_price > 30000
    ? '🍽️ Breakfast & Candlelight Dinners'
    : '🍽️ Daily Buffet Breakfast';

  // Activities count
  const activitiesCount = pkg.activities_count || (pkg.duration_days ? pkg.duration_days + 1 : 5);

  // 3-4 feature highlights
  const highlights = [
    `${pkg.duration_days}D/${pkg.duration_nights}N Curated Plan`,
    hotelBadge,
    `${activitiesCount} Sightseeing Activities`,
    'Free Cancellation Policy'
  ];

  return (
    <div 
      onClick={() => onSelect && onSelect(pkg)}
      className={`rounded-3xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer ${
        isSelected 
          ? 'ring-3 ring-coral-500 border-2 border-coral-500 bg-white shadow-2xl -translate-y-1' 
          : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      {/* 1. Destination Cover Image & Badges Banner */}
      <div className="relative h-60 overflow-hidden bg-slate-900">
        <img 
          src={pkg.featured_image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'} 
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
        />

        {/* Top-Left Category & Domestic/International Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="bg-brand-900/85 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/20">
            {pkg.category}
          </span>
          {pkg.is_domestic ? (
            <span className="bg-emerald-700/85 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.8 rounded-full uppercase tracking-wider border border-white/20">
              🇮🇳 Domestic
            </span>
          ) : (
            <span className="bg-indigo-700/85 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.8 rounded-full uppercase tracking-wider border border-white/20">
              ✈️ International
            </span>
          )}
        </div>

        {/* Top-Right Discount Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-coral-500 to-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md">
          {discountPercent}% OFF
        </div>

        {/* Bottom Duration & Star Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-white/95 backdrop-blur-md text-brand-900 text-xs font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-coral-500" />
            {pkg.duration_days} Days / {pkg.duration_nights} Nights
          </span>
          <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            4.8 <span className="text-[10px] text-slate-400 font-normal">(Demo Reviews)</span>
          </span>
        </div>
      </div>

      {/* 2. Package Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Destination & Cities Covered */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-coral-600 mb-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {placesList.map(p => p.name).join(' • ')}
              {placesList[0]?.country ? ` (${placesList[0].country})` : ''}
            </span>
          </div>

          {/* Package Title */}
          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-brand-600 transition line-clamp-2">
            {pkg.title}
          </h3>

          {/* Key MMT Inclusions Badges */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-700">
            <div className="flex items-center gap-1.5 truncate">
              <Hotel className="w-3.5 h-3.5 text-coral-500 shrink-0" />
              <span className="truncate">{hotelBadge}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Bus className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate">{transitText}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Utensils className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{mealsText}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{activitiesCount} Activities Included</span>
            </div>
          </div>

          {/* 3-4 Feature Highlights */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {highlights.map((hl, i) => (
              <span 
                key={i} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
              >
                ✓ {hl}
              </span>
            ))}
          </div>

          {/* Availability Status Badge */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Guaranteed Departure • Available Batch
            </span>
            <span className="text-slate-400 font-medium">Demo Data</span>
          </div>
        </div>

        {/* 3. Pricing Presentation & Actions Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-brand-900">
                ₹{Number(pkg.base_price).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-bold">
              Per person (excl. GST)
            </div>
            <div className="text-[10px] text-emerald-600 font-extrabold mt-0.5">
              Est. Total: ₹{totalEstimatedPrice.toLocaleString('en-IN')} ({travellersCount} Travellers)
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(pkg);
              }}
              className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-brand-700 hover:bg-slate-100 rounded-xl transition"
            >
              View Details
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onBookNow) onBookNow(pkg);
                else onSelect(pkg);
              }}
              className="px-4 py-2 text-xs font-black bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-1 cursor-pointer"
            >
              Book Now
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
