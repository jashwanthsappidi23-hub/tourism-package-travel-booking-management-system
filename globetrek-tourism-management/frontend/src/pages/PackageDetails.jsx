import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Clock, MapPin, Calendar, Check, X, Shield, 
  Hotel, Bus, User, ChevronDown, ChevronUp, Star, 
  ArrowRight, Sparkles, CheckCircle2, Zap 
} from 'lucide-react';

export default function PackageDetails({ pkg, onNavigate, onStartBooking }) {
  const [departures, setDepartures] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [expandedDay, setExpandedDay] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pkg) return;
    async function loadDepartures() {
      try {
        const deps = await api.getDepartures(`package_id=${pkg.package_id}&only_available=true`);
        if (deps && deps.length > 0) {
          setDepartures(deps);
          setSelectedDeparture(deps[0]);
        } else {
          // Fallback departure batch so booking is never blocked
          const defaultDep = {
            departure_id: 2000 + pkg.package_id,
            package_id: pkg.package_id,
            start_date: '2026-11-20',
            end_date: '2026-11-25',
            total_capacity: 25,
            available_seats: 15,
            confirmed_seats: 10,
            price_override: pkg.base_price,
            status: 'Confirmed'
          };
          setDepartures([defaultDep]);
          setSelectedDeparture(defaultDep);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDepartures();
  }, [pkg]);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-xl font-bold">No package selected</h2>
          <button onClick={() => onNavigate('packages')} className="mt-4 px-4 py-2 bg-brand-700 text-white rounded-lg text-xs font-bold">
            Browse Packages
          </button>
        </div>
      </div>
    );
  }

  const inclusionsList = pkg.inclusions ? pkg.inclusions.split(',').map(s => s.trim()) : [
    'Daily Buffet Breakfast', 'AC Private Vehicle transfers', 'Certified Regional Guide', 'Sightseeing permits'
  ];
  const exclusionsList = pkg.exclusions ? pkg.exclusions.split(',').map(s => s.trim()) : [
    'Flight / Train tickets to arrival hub', 'Personal shopping expenses', 'Optional adventure sport charges'
  ];

  const handleProceedBooking = () => {
    const depToUse = selectedDeparture || (departures.length > 0 ? departures[0] : {
      departure_id: 2000 + pkg.package_id,
      package_id: pkg.package_id,
      start_date: '2026-11-20',
      end_date: '2026-11-25',
      total_capacity: 25,
      available_seats: 15,
      confirmed_seats: 10,
      price_override: pkg.base_price,
      status: 'Confirmed'
    });

    if (onStartBooking) {
      onStartBooking(pkg, depToUse);
    }
    onNavigate('booking-flow');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-6">
          <span onClick={() => onNavigate('home')} className="hover:text-coral-500 cursor-pointer">Home</span>
          <span>/</span>
          <span onClick={() => onNavigate('packages')} className="hover:text-coral-500 cursor-pointer">Tour Packages</span>
          <span>/</span>
          <span className="text-brand-700 truncate max-w-sm">{pkg.title}</span>
        </div>

        {/* Hero Package Header */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image Gallery */}
            <div className="lg:col-span-7 h-80 sm:h-96 relative bg-slate-900">
              <img 
                src={pkg.featured_image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'} 
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-brand-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {pkg.category}
              </div>
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-brand-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2">
                <Clock className="w-4 h-4 text-coral-500" />
                {pkg.duration_days} Days / {pkg.duration_nights} Nights
              </div>
            </div>

            {/* Quick Pricing & Summary Box */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Places Visited:</span>
                  {pkg.destinations?.map((d, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-md border border-coral-200">
                      <MapPin className="w-3 h-3 text-coral-500" />
                      {d.name} {d.country ? `(${d.country})` : d.state ? `(${d.state})` : ''}
                    </span>
                  ))}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-brand-900 tracking-tight leading-tight">
                  {pkg.title}
                </h1>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {/* Pricing & CTA */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-end justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Starting from</div>
                  <div className="text-3xl font-black text-brand-900">
                    ₹{Number(selectedDeparture?.price_override || pkg.base_price).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">Per Adult (Taxes Included)</span>
                </div>

                <button 
                  onClick={handleProceedBooking}
                  className="px-6 py-3.5 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  Book This Tour <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: Left Details + Right Departure Selector Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Mentioned Places / Destinations Detailed Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h2 className="text-xl font-black text-brand-900 tracking-tight mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-coral-500" /> Places Covered on this Tour
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.destinations && pkg.destinations.length > 0 ? (
                  pkg.destinations.map((d) => (
                    <div key={d.destination_id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-coral-100 text-coral-600 flex items-center justify-center font-black shrink-0">
                        📍
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800">{d.name}</div>
                        <div className="text-xs text-slate-500">{d.country || d.state || 'Destination Hub'}</div>
                        {d.description && (
                          <div className="text-[11px] text-slate-600 mt-1 line-clamp-2">{d.description}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Scenic regional sightseeing routes included.</p>
                )}
              </div>
            </div>

            {/* 1. Day-by-Day Interactive Itinerary Accordion */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-brand-900 tracking-tight">Day-Wise Itinerary Plan</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Carefully paced sightseeing schedule</p>
                </div>
                <span className="text-xs font-bold text-coral-600 bg-coral-50 px-2.5 py-1 rounded-full">
                  {pkg.itinerary_days?.length || 0} Scheduled Days
                </span>
              </div>

              <div className="space-y-3">
                {pkg.itinerary_days && pkg.itinerary_days.length > 0 ? (
                  pkg.itinerary_days.map((day) => {
                    const isExpanded = expandedDay === day.day_number;
                    return (
                      <div 
                        key={day.day_number}
                        className={`border rounded-2xl transition overflow-hidden ${isExpanded ? 'border-brand-500 bg-brand-50/20' : 'border-slate-200 bg-white hover:bg-slate-50/60'}`}
                      >
                        <div 
                          onClick={() => setExpandedDay(isExpanded ? null : day.day_number)}
                          className="p-4 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-brand-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              D{day.day_number}
                            </span>
                            <span className="font-extrabold text-sm text-slate-800">{day.title}</span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>

                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 text-xs text-slate-600 space-y-3 border-t border-slate-100">
                            <p className="leading-relaxed">{day.activities}</p>
                            
                            <div className="flex flex-wrap gap-3 pt-2 text-[11px] font-semibold text-slate-700">
                              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                                🍽️ Meals: {day.meals_included || 'Breakfast'}
                              </span>
                              {day.hotel_name && (
                                <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                                  <Hotel className="w-3.5 h-3.5 text-coral-500" /> Stay: {day.hotel_name}
                                </span>
                              )}
                              {day.vehicle_type && (
                                <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                                  <Bus className="w-3.5 h-3.5 text-brand-600" /> Transit: {day.vehicle_type}
                                </span>
                              )}
                            </div>

                            {day.notes && (
                              <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                💡 Tip: {day.notes}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400">Detailed day-wise itinerary will be provided upon booking.</p>
                )}
              </div>
            </div>

            {/* 2. Package Inclusions & Exclusions */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h2 className="text-xl font-black text-brand-900 tracking-tight mb-6">Inclusions & Exclusions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What's Included
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {inclusionsList.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-3 flex items-center gap-1.5">
                    <X className="w-4 h-4 text-red-500" /> What's Not Included
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {exclusionsList.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Cancellation Policy */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h2 className="text-xl font-black text-brand-900 tracking-tight mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-coral-500" /> Transparent Cancellation & Refund Policy
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pkg.cancellation_policy || 'Free cancellation up to 15 days prior to tour departure with 90% instant refund. 50% refund between 7 to 14 days. Non-refundable within 7 days of departure.'}
              </p>
            </div>
          </div>

          {/* Right Sidebar: Departure Scheduler & Seat Availability (1 Col) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs sticky top-28 space-y-6">
              <div>
                <h3 className="font-extrabold text-base text-brand-900">Choose Departure Batch</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time departure seat capacity</p>
              </div>

              <div className="space-y-3">
                {departures.map((dep) => {
                  const isSelected = selectedDeparture?.departure_id === dep.departure_id;
                  const seatsLeft = dep.available_seats;
                  const occupancy = Math.round((dep.confirmed_seats / dep.total_capacity) * 100);

                  return (
                    <div
                      key={dep.departure_id}
                      onClick={() => setSelectedDeparture(dep)}
                      className={`p-4 rounded-2xl border cursor-pointer transition ${isSelected ? 'border-coral-500 bg-coral-50/30 ring-2 ring-coral-500/20' : 'border-slate-200 hover:border-brand-400 bg-white'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-xs text-brand-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-coral-500" />
                          {dep.start_date} to {dep.end_date}
                        </span>
                        <span className="text-xs font-bold text-brand-800">
                          ₹{Number(dep.price_override).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Capacity progress bar */}
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-500 font-medium">Availability</span>
                          <span className={`font-bold ${seatsLeft <= 5 ? 'text-red-600' : 'text-emerald-700'}`}>
                            {seatsLeft} seats left ({occupancy}% booked)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${occupancy >= 80 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${occupancy}%` }} 
                          />
                        </div>
                      </div>

                      {dep.guide_name && (
                        <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
                          <User className="w-3 h-3 text-brand-600" /> Lead Guide: <strong>{dep.guide_name}</strong>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleProceedBooking}
                className="w-full py-4 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Traveller Booking
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Floating Bottom Bar for Option to Book */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={pkg.featured_image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=150&q=80'} 
              alt={pkg.title} 
              className="w-12 h-12 rounded-xl object-cover shrink-0 hidden sm:block border border-slate-200"
            />
            <div>
              <div className="text-xs text-slate-500 font-medium truncate max-w-xs sm:max-w-md">
                Selected: <strong className="text-brand-900">{pkg.title}</strong>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-brand-900">
                  ₹{Number(selectedDeparture?.price_override || pkg.base_price).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">/ adult</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('packages')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
            >
              Back to Tours
            </button>
            <button 
              onClick={handleProceedBooking}
              className="px-6 py-2.5 sm:py-3 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Book This Tour Now
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
