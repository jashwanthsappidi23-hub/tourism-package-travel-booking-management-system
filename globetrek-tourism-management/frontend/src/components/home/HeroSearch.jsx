import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, MapPin, Calendar, Users, DollarSign, Sparkles, 
  ChevronLeft, ChevronRight, Check, X, Plane, Bed, Plus, Minus, ArrowRight
} from 'lucide-react';

export default function HeroSearch({ onSearch, destinations = [] }) {
  // 1. Starting From (Departure City / Airport)
  const [startingCity, setStartingCity] = useState('New Delhi (DEL)');
  
  // 2. Going To (Destination / Place)
  const [goingTo, setGoingTo] = useState('');

  // 3. Departure Date
  const [departureDate, setDepartureDate] = useState('2026-11-20');
  const [departureDateFormatted, setDepartureDateFormatted] = useState('20 Nov 2026');
  const [depCalOpen, setDepCalOpen] = useState(false);
  const [depMonth, setDepMonth] = useState(10); // Nov
  const [depYear, setDepYear] = useState(2026);

  // 4. Return Date
  const [returnDate, setReturnDate] = useState('2026-11-26');
  const [returnDateFormatted, setReturnDateFormatted] = useState('26 Nov 2026');
  const [retCalOpen, setRetCalOpen] = useState(false);
  const [retMonth, setRetMonth] = useState(10); // Nov
  const [retYear, setRetYear] = useState(2026);

  // 5 & 6. Travellers (Adults + Children) & Rooms
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);

  // Budget adjustment state
  const [budget, setBudget] = useState(150000);

  const depRef = useRef(null);
  const retRef = useRef(null);
  const guestRef = useRef(null);

  // Departure cities with airport codes (MakeMyTrip reference)
  const departureCities = [
    { code: 'DEL', city: 'New Delhi', label: 'New Delhi (DEL)' },
    { code: 'BOM', city: 'Mumbai', label: 'Mumbai (BOM)' },
    { code: 'BLR', city: 'Bengaluru', label: 'Bangalore (BLR)' },
    { code: 'MAA', city: 'Chennai', label: 'Chennai (MAA)' },
    { code: 'CCU', city: 'Kolkata', label: 'Kolkata (CCU)' },
    { code: 'HYD', city: 'Hyderabad', label: 'Hyderabad (HYD)' },
    { code: 'AMD', city: 'Ahmedabad', label: 'Ahmedabad (AMD)' },
    { code: 'PNQ', city: 'Pune', label: 'Pune (PNQ)' },
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (depRef.current && !depRef.current.contains(e.target)) setDepCalOpen(false);
      if (retRef.current && !retRef.current.contains(e.target)) setRetCalOpen(false);
      if (guestRef.current && !guestRef.current.contains(e.target)) setGuestPickerOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({
      departure_city: startingCity,
      destination: goingTo,
      departure_date: departureDate,
      return_date: returnDate,
      travellers: adults + children,
      adults,
      children,
      rooms,
      maxPrice: budget
    });
  };

  const trendingPills = [
    'Kashmir', 'Manali', 'Goa', 'Kerala', 'Rajasthan', 
    'Bali', 'Maldives', 'Dubai', 'Paris', 'Swiss Alps', 'Japan'
  ];

  // Calendar helpers
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfWeek = (month, year) => new Date(year, month, 1).getDay();

  const handleSelectDepDay = (day) => {
    const formatted = `${day} ${monthNames[depMonth].substring(0, 3)} ${depYear}`;
    const iso = `${depYear}-${String(depMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setDepartureDateFormatted(formatted);
    setDepartureDate(iso);
    setDepCalOpen(false);
  };

  const handleSelectRetDay = (day) => {
    const formatted = `${day} ${monthNames[retMonth].substring(0, 3)} ${retYear}`;
    const iso = `${retYear}-${String(retMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setReturnDateFormatted(formatted);
    setReturnDate(iso);
    setRetCalOpen(false);
  };

  return (
    <div className="relative pt-6 pb-28 overflow-hidden bg-gradient-to-b from-brand-900 via-brand-800 to-slate-900 text-white">
      {/* Background Scenic Travel Imagery */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80" 
          alt="Scenic Tropical Beach and Mountains" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto pt-6 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            GlobeTrek Holidays — Handcrafted Worldwide & Domestic Tours
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Worldwide Tourism Packages & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 via-amber-300 to-coral-500">
              Travel Booking Management
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal max-w-2xl mx-auto">
            Compare handpicked holiday packages across 50+ worldwide destinations and India. Guaranteed departures, verified 4-star & 5-star hotels, transparent pricing, and instant booking.
          </p>

          {/* Quick Trending Destination Chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-xs text-slate-400 font-bold mr-1">Trending Holidays:</span>
            {trendingPills.map(place => (
              <button
                key={place}
                onClick={() => { setGoingTo(place); onSearch({ destination: place }); }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/25 backdrop-blur-xs text-xs font-bold text-white rounded-full border border-white/15 transition cursor-pointer"
              >
                {place}
              </button>
            ))}
          </div>
        </div>

        {/* MakeMyTrip-Style Floating Holiday Search Panel */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-900 border border-slate-200/90 -mb-16">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-900">
              <Plane className="w-4 h-4 text-coral-500" /> Search Holiday Packages
            </div>
            <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ✓ 100% Verified Stays & Handcrafted Itineraries
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
              
              {/* Field 1: Starting From (Departure City / Airport) */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-brand-500 transition">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Plane className="w-3 h-3 text-coral-500" /> Starting From
                </label>
                <select 
                  value={startingCity}
                  onChange={(e) => setStartingCity(e.target.value)}
                  className="w-full bg-transparent font-extrabold text-slate-900 focus:outline-hidden text-sm"
                >
                  {departureCities.map(c => (
                    <option key={c.code} value={c.label}>{c.label}</option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 font-medium block truncate">Select origin airport</span>
              </div>

              {/* Field 2: Going To (Destination / Place) */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-brand-500 transition">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-coral-500" /> Going To
                </label>
                <select 
                  value={goingTo}
                  onChange={(e) => setGoingTo(e.target.value)}
                  className="w-full bg-transparent font-extrabold text-slate-900 focus:outline-hidden text-sm"
                >
                  <option value="">Any Destination (Worldwide)</option>
                  <optgroup label="Popular Domestic Holidays">
                    <option value="Kashmir">Kashmir, India</option>
                    <option value="Goa">Goa, India</option>
                    <option value="Kerala">Kerala, India</option>
                    <option value="Rajasthan">Rajasthan, India</option>
                    <option value="Manali">Manali / Himachal, India</option>
                    <option value="Ooty">Ooty / South India</option>
                    <option value="Andaman">Andaman Islands</option>
                  </optgroup>
                  <optgroup label="International Worldwide Holidays">
                    <option value="Paris">Paris, France</option>
                    <option value="Swiss Alps">Swiss Alps, Switzerland</option>
                    <option value="Bali">Bali, Indonesia</option>
                    <option value="Tokyo">Japan (Tokyo & Kyoto)</option>
                    <option value="Dubai">Dubai, UAE</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Thailand">Thailand (Bangkok & Phuket)</option>
                    <option value="Singapore">Singapore</option>
                    <option value="New York">New York, USA</option>
                    <option value="Sydney">Sydney, Australia</option>
                    <option value="Cape Town">Cape Town, South Africa</option>
                    <option value="Rio de Janeiro">Rio de Janeiro, Brazil</option>
                  </optgroup>
                </select>
                <span className="text-[10px] text-slate-400 font-medium block truncate">Where do you want to go?</span>
              </div>

              {/* Field 3: Departure Date (Calendar Picker) */}
              <div ref={depRef} className="relative bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-brand-500 transition cursor-pointer">
                <div onClick={() => setDepCalOpen(!depCalOpen)}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1 cursor-pointer">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-coral-500" /> Departure Date
                    </span>
                    <span className="text-[9px] text-coral-600 font-bold bg-coral-50 px-1 rounded border border-coral-200">
                      Pick
                    </span>
                  </label>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {departureDateFormatted}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">Starts on this date</span>
                </div>

                {/* Departure Calendar Dropdown */}
                {depCalOpen && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <button 
                        type="button" 
                        onClick={() => depMonth === 0 ? (setDepMonth(11), setDepYear(y => y - 1)) : setDepMonth(m => m - 1)}
                        className="p-1 rounded hover:bg-slate-100"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-black text-xs text-brand-900">{monthNames[depMonth]} {depYear}</span>
                      <button 
                        type="button" 
                        onClick={() => depMonth === 11 ? (setDepMonth(0), setDepYear(y => y + 1)) : setDepMonth(m => m + 1)}
                        className="p-1 rounded hover:bg-slate-100"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-slate-400 mb-1">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                      {Array.from({ length: getFirstDayOfWeek(depMonth, depYear) }).map((_, i) => (
                        <div key={`empty-dep-${i}`} className="h-6" />
                      ))}
                      {Array.from({ length: getDaysInMonth(depMonth, depYear) }).map((_, i) => {
                        const day = i + 1;
                        return (
                          <button
                            key={`dep-day-${day}`}
                            type="button"
                            onClick={() => handleSelectDepDay(day)}
                            className="h-6 text-[11px] font-bold rounded hover:bg-coral-50 hover:text-coral-600 text-slate-700"
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Field 4: Return Date (Calendar Picker) */}
              <div ref={retRef} className="relative bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-brand-500 transition cursor-pointer">
                <div onClick={() => setRetCalOpen(!retCalOpen)}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1 cursor-pointer">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-coral-500" /> Return Date
                    </span>
                    <span className="text-[9px] text-coral-600 font-bold bg-coral-50 px-1 rounded border border-coral-200">
                      Pick
                    </span>
                  </label>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {returnDateFormatted}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">Flexible return date</span>
                </div>

                {/* Return Calendar Dropdown */}
                {retCalOpen && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <button 
                        type="button" 
                        onClick={() => retMonth === 0 ? (setRetMonth(11), setRetYear(y => y - 1)) : setRetMonth(m => m - 1)}
                        className="p-1 rounded hover:bg-slate-100"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-black text-xs text-brand-900">{monthNames[retMonth]} {retYear}</span>
                      <button 
                        type="button" 
                        onClick={() => retMonth === 11 ? (setRetMonth(0), setRetYear(y => y + 1)) : setRetMonth(m => m + 1)}
                        className="p-1 rounded hover:bg-slate-100"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-slate-400 mb-1">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                      {Array.from({ length: getFirstDayOfWeek(retMonth, retYear) }).map((_, i) => (
                        <div key={`empty-ret-${i}`} className="h-6" />
                      ))}
                      {Array.from({ length: getDaysInMonth(retMonth, retYear) }).map((_, i) => {
                        const day = i + 1;
                        return (
                          <button
                            key={`ret-day-${day}`}
                            type="button"
                            onClick={() => handleSelectRetDay(day)}
                            className="h-6 text-[11px] font-bold rounded hover:bg-coral-50 hover:text-coral-600 text-slate-700"
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Field 5 & 6: Travellers & Rooms Popover */}
              <div ref={guestRef} className="relative bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-brand-500 transition cursor-pointer">
                <div onClick={() => setGuestPickerOpen(!guestPickerOpen)}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1 cursor-pointer">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-coral-500" /> Travellers & Rooms
                    </span>
                    <span className="text-[9px] text-brand-700 font-bold bg-brand-50 px-1 rounded border border-brand-200">
                      Edit
                    </span>
                  </label>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {adults + children} Travellers, {rooms} {rooms === 1 ? 'Room' : 'Rooms'}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">
                    {adults} Adults{children > 0 ? `, ${children} Child` : ''}
                  </span>
                </div>

                {/* Travellers & Rooms Popover Modal */}
                {guestPickerOpen && (
                  <div className="absolute top-full right-0 mt-2 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 text-slate-800 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                    <div className="text-xs font-black text-brand-900 border-b border-slate-100 pb-2">
                      Select Travellers & Rooms
                    </div>

                    {/* Adults Stepper */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Adults</div>
                        <div className="text-[10px] text-slate-400">(12+ years)</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdults(a => Math.max(1, a - 1))}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-black text-sm">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(a => Math.min(10, a + 1))}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Children Stepper */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Children</div>
                        <div className="text-[10px] text-slate-400">(2 - 12 years)</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildren(c => Math.max(0, c - 1))}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-black text-sm">{children}</span>
                        <button
                          type="button"
                          onClick={() => setChildren(c => Math.min(6, c + 1))}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Rooms Stepper */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Hotel Rooms</div>
                        <div className="text-[10px] text-slate-400">Standard / Deluxe</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRooms(r => Math.max(1, r - 1))}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-black text-sm">{rooms}</span>
                        <button
                          type="button"
                          onClick={() => setRooms(r => Math.min(5, r + 1))}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setGuestPickerOpen(false)}
                      className="w-full mt-3 py-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl transition"
                    >
                      Apply Travellers & Rooms
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: Budget Stepper & Search Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-coral-500" /> Max Budget:
                </span>
                <span className="text-sm font-black text-brand-900">
                  ≤ ₹{Number(budget).toLocaleString('en-IN')}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBudget(b => Math.max(15000, b - 10000))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold"
                  >
                    - 10k
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudget(b => Math.min(250000, b + 10000))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold"
                  >
                    + 10k
                  </button>
                </div>
              </div>

              {/* Action Button: Search Packages */}
              <button 
                type="submit"
                className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-black text-sm rounded-xl shadow-md hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Search Packages
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
