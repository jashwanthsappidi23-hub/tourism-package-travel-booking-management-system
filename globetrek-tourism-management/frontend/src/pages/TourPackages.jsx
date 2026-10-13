import React, { useState, useEffect, useRef } from 'react';
import PackageCard from '../components/packages/PackageCard';
import { api } from '../services/api';
import { 
  Filter, SlidersHorizontal, MapPin, DollarSign, Clock, 
  RotateCcw, Search, Calendar, ChevronLeft, ChevronRight, 
  CheckCircle2, ArrowRight, Zap, X, Grid, Layers, Sparkles, 
  Plane, Hotel, Star, Compass, Tag, Check, Award
} from 'lucide-react';

export default function TourPackages({ onNavigate, onSelectPackage, onStartBooking, initialFilters = {} }) {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected package for instant booking
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [bookingModalPkg, setBookingModalPkg] = useState(null);
  const [modalDepartures, setModalDepartures] = useState([]);
  const [selectedDep, setSelectedDep] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // View mode: 'grid' or 'places'
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPlaceTab, setSelectedPlaceTab] = useState(initialFilters.destination || 'All');

  // FILTERS (MakeMyTrip Inspired)
  // 1. Domestic vs International
  const [tourType, setTourType] = useState(
    initialFilters.is_domestic === true ? 'domestic' : 
    initialFilters.is_domestic === false ? 'international' : 'all'
  );
  
  // 2. Search keyword
  const [searchQuery, setSearchQuery] = useState(initialFilters.destination || '');

  // 3. Destination filter
  const [selectedDestId, setSelectedDestId] = useState('');

  // 4. Departure City filter
  const [departureCityFilter, setDepartureCityFilter] = useState(initialFilters.departure_city || '');

  // 5. Hotel Star Category: 3, 4, 5
  const [selectedStar, setSelectedStar] = useState('');

  // 6. Flights Included filter: 'all', 'yes', 'no'
  const [flightFilter, setFlightFilter] = useState('all');

  // 7. Budget Per Person
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || 250000);

  // 8. Duration in Nights
  const [durationLimit, setDurationLimit] = useState('');

  // 9. Travel Themes
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '');

  // 10. Sorting: 'popularity', 'price-asc', 'price-desc', 'duration', 'rating'
  const [sortBy, setSortBy] = useState('popularity');

  // Departure Month Calendar state
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(initialFilters.month || '');
  const [selectedDate, setSelectedDate] = useState(initialFilters.date || null);
  const [calMonth, setCalMonth] = useState(10); // Nov
  const [calYear, setCalYear] = useState(2026);
  const calRef = useRef(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Close calendar popover on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (calRef.current && !calRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pkgs, dests] = await Promise.all([
          api.getPackages(),
          api.getDestinations()
        ]);
        setPackages(pkgs);
        setDestinations(dests);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Update tourType if initialFilters changes
  useEffect(() => {
    if (initialFilters.is_domestic === true) setTourType('domestic');
    else if (initialFilters.is_domestic === false) setTourType('international');
    if (initialFilters.category) setSelectedCategory(initialFilters.category);
    if (initialFilters.destination) {
      setSearchQuery(initialFilters.destination);
      setSelectedPlaceTab(initialFilters.destination);
    }
  }, [initialFilters]);

  // Open booking batch selector modal
  const handleOpenBookingModal = async (pkg) => {
    setBookingModalPkg(pkg);
    setModalLoading(true);
    try {
      const deps = await api.getDepartures(`package_id=${pkg.package_id}&only_available=true`);
      if (deps && deps.length > 0) {
        setModalDepartures(deps);
        setSelectedDep(deps[0]);
      } else {
        const fallback = {
          departure_id: 1000 + pkg.package_id,
          package_id: pkg.package_id,
          start_date: '2026-11-20',
          end_date: '2026-11-25',
          total_capacity: 25,
          available_seats: 12,
          confirmed_seats: 13,
          price_override: pkg.base_price,
          status: 'Confirmed'
        };
        setModalDepartures([fallback]);
        setSelectedDep(fallback);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmModalBooking = () => {
    if (bookingModalPkg && selectedDep) {
      if (onStartBooking) {
        onStartBooking(bookingModalPkg, selectedDep);
      } else if (onSelectPackage) {
        onSelectPackage(bookingModalPkg);
      }
      onNavigate('booking-flow');
    }
  };

  const handleResetFilters = () => {
    setTourType('all');
    setSearchQuery('');
    setSelectedDestId('');
    setDepartureCityFilter('');
    setSelectedStar('');
    setFlightFilter('all');
    setMaxPrice(250000);
    setDurationLimit('');
    setSelectedCategory('');
    setSortBy('popularity');
    setSelectedMonth('');
    setSelectedDate(null);
    setSelectedPlaceTab('All');
  };

  // Distinct travel themes
  const travelThemes = [
    'Honeymoon', 'Family', 'Adventure', 'Beach', 'Luxury', 
    'Cultural / City Tour', 'Spiritual', 'Wildlife', 'Cruise'
  ];

  // Client-side filtering
  const filtered = packages.filter(p => {
    // 1. Domestic vs International
    if (tourType === 'domestic' && p.is_domestic !== true) return false;
    if (tourType === 'international' && p.is_domestic !== false) return false;

    // 2. Hotel Category
    if (selectedStar && p.hotel_star_rating !== parseInt(selectedStar)) return false;

    // 3. Flight Included
    if (flightFilter === 'yes' && !p.flights_included) return false;
    if (flightFilter === 'no' && p.flights_included) return false;

    // 4. Departure City
    if (departureCityFilter && p.departure_city && !p.departure_city.toLowerCase().includes(departureCityFilter.toLowerCase())) {
      return false;
    }

    // 5. Travel Theme
    if (selectedCategory && !p.category?.toLowerCase().includes(selectedCategory.toLowerCase())) return false;

    // 6. Destination ID
    if (selectedDestId && !p.destinations?.some(d => d.destination_id === parseInt(selectedDestId))) return false;

    // 7. Budget Max Price
    if (p.base_price > maxPrice) return false;

    // 8. Duration Limit
    if (durationLimit === 'short' && p.duration_days > 4) return false;
    if (durationLimit === 'medium' && (p.duration_days < 5 || p.duration_days > 6)) return false;
    if (durationLimit === 'long' && p.duration_days < 7) return false;

    // 9. Place Tab Filter
    if (selectedPlaceTab !== 'All') {
      const matchPlace = p.destinations?.some(d => 
        d.name.toLowerCase().includes(selectedPlaceTab.toLowerCase()) || 
        (d.country && d.country.toLowerCase().includes(selectedPlaceTab.toLowerCase()))
      );
      if (!matchPlace) return false;
    }

    // 10. Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDest = p.destinations?.some(d => 
        d.name.toLowerCase().includes(q) || (d.country && d.country.toLowerCase().includes(q))
      );
      if (!matchTitle && !matchDest) return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'price-asc') return a.base_price - b.base_price;
    if (sortBy === 'price-desc') return b.base_price - a.base_price;
    if (sortBy === 'duration') return a.duration_days - b.duration_days;
    if (sortBy === 'rating') return (b.hotel_star_rating || 4) - (a.hotel_star_rating || 4);
    // Default popularity
    return a.package_id - b.package_id;
  });

  // Grouped by places map
  const groupedByPlaces = {};
  filtered.forEach(p => {
    const primaryPlace = p.destinations && p.destinations.length > 0 
      ? `${p.destinations[0].name}, ${p.destinations[0].country || p.destinations[0].state || ''}`
      : 'Special Holiday Packages';
    if (!groupedByPlaces[primaryPlace]) groupedByPlaces[primaryPlace] = [];
    groupedByPlaces[primaryPlace].push(p);
  });

  const placeTabs = [
    { name: 'All', label: '🌍 All Places', count: packages.length },
    { name: 'Kashmir', label: '🏔️ Kashmir', count: packages.filter(p => p.destinations?.some(d => d.name === 'Kashmir')).length },
    { name: 'Goa', label: '🏖️ Goa', count: packages.filter(p => p.destinations?.some(d => d.name === 'Goa')).length },
    { name: 'Kerala', label: '🌿 Kerala', count: packages.filter(p => p.destinations?.some(d => d.name === 'Kerala')).length },
    { name: 'Rajasthan', label: '🏰 Rajasthan', count: packages.filter(p => p.destinations?.some(d => d.name === 'Rajasthan' || d.name === 'Jaipur')).length },
    { name: 'Manali', label: '🏔️ Manali / Himachal', count: packages.filter(p => p.destinations?.some(d => d.name === 'Manali' || d.name === 'Himachal')).length },
    { name: 'Paris', label: '🇫🇷 Paris, France', count: packages.filter(p => p.destinations?.some(d => d.name === 'Paris')).length },
    { name: 'Swiss Alps', label: '🇨🇭 Swiss Alps', count: packages.filter(p => p.destinations?.some(d => d.name === 'Interlaken' || d.name === 'Lucerne')).length },
    { name: 'Japan', label: '🇯🇵 Japan', count: packages.filter(p => p.destinations?.some(d => d.name === 'Tokyo' || d.name === 'Kyoto')).length },
    { name: 'Dubai', label: '🇦🇪 Dubai', count: packages.filter(p => p.destinations?.some(d => d.name === 'Dubai')).length },
    { name: 'Bali', label: '🇮🇩 Bali', count: packages.filter(p => p.destinations?.some(d => d.name === 'Bali')).length },
    { name: 'Maldives', label: '🇲🇻 Maldives', count: packages.filter(p => p.destinations?.some(d => d.name === 'Maldives')).length },
    { name: 'Thailand', label: '🇹🇭 Thailand', count: packages.filter(p => p.destinations?.some(d => d.name === 'Bangkok' || d.name === 'Phuket')).length },
    { name: 'Singapore', label: '🇸🇬 Singapore', count: packages.filter(p => p.destinations?.some(d => d.name === 'Singapore')).length },
    { name: 'New York', label: '🇺🇸 New York', count: packages.filter(p => p.destinations?.some(d => d.name === 'New York')).length },
    { name: 'Sydney', label: '🇦🇺 Sydney', count: packages.filter(p => p.destinations?.some(d => d.name === 'Sydney')).length },
  ].filter(tab => tab.name === 'All' || tab.count > 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Breadcrumb Navigation & Main Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
            <span onClick={() => onNavigate('home')} className="hover:text-coral-500 cursor-pointer">Home</span>
            <span>/</span>
            <span className="text-brand-700">GlobeTrek Holiday Packages</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-brand-900 tracking-tight flex items-center gap-3">
                Holiday Packages Catalogue
                <span className="text-xs font-black text-coral-600 bg-coral-50 border border-coral-200 px-3 py-1 rounded-full">
                  Showing {filtered.length} of {packages.length} Tours
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Filter by destination, domestic or international, hotel stars, flights, duration, and budget.
              </p>
            </div>

            {/* View Mode & Sorting */}
            <div className="flex items-center gap-3">
              {/* View Switcher */}
              <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center shadow-xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewMode === 'grid' ? 'bg-brand-900 text-white shadow-xs' : 'text-slate-600 hover:text-brand-700'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" /> All Packages
                </button>
                <button
                  onClick={() => setViewMode('places')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewMode === 'places' ? 'bg-brand-900 text-white shadow-xs' : 'text-slate-600 hover:text-brand-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> By Places
                </button>
              </div>

              {/* MMT Sorting Dropdown */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl focus:outline-hidden shadow-xs text-slate-800"
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="price-asc">Sort by: Price (Low to High)</option>
                <option value="price-desc">Sort by: Price (High to Low)</option>
                <option value="duration">Sort by: Duration</option>
                <option value="rating">Sort by: Hotel Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Domestic vs International Master Toggle Pills */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">
              Tour Scope:
            </span>
            <button
              onClick={() => setTourType('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                tourType === 'all' ? 'bg-brand-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Packages ({packages.length})
            </button>
            <button
              onClick={() => setTourType('domestic')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                tourType === 'domestic' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🇮🇳 Domestic India Tours ({packages.filter(p => p.is_domestic).length})
            </button>
            <button
              onClick={() => setTourType('international')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                tourType === 'international' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ✈️ International Tours ({packages.filter(p => !p.is_domestic).length})
            </button>
          </div>

          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-coral-600 hover:text-coral-700 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear All Filters
          </button>
        </div>

        {/* Places Filter Pills Bar */}
        <div className="mb-8 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-coral-500" /> Filter by Place:
            </span>
            <span className="text-[11px] font-bold text-coral-600">
              Instant destination filter
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {placeTabs.map(tab => (
              <button
                key={tab.name}
                onClick={() => setSelectedPlaceTab(tab.name)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedPlaceTab === tab.name
                    ? 'bg-gradient-to-r from-coral-500 to-coral-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  selectedPlaceTab === tab.name ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Layout Grid: Advanced Sidebar Filters + Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* MMT-Inspired Advanced Filter Drawer */}
          <div className="lg:col-span-1">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-6 sticky top-28">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-coral-500" /> Filter Results
                </span>
                <button 
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-coral-600 hover:text-coral-700"
                >
                  Reset
                </button>
              </div>

              {/* 1. Keyword Search */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Search Destination / Tour</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Kashmir, Paris, Safari..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
                  />
                </div>
              </div>

              {/* 2. Budget Per Person (Slider + Steppers) */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Max Budget / Person</span>
                  <span className="text-brand-900 font-black">
                    ≤ ₹{Number(maxPrice).toLocaleString('en-IN')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setMaxPrice(prev => Math.max(15000, prev - 10000))}
                    className="flex-1 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"
                  >
                    - ₹10k
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaxPrice(prev => Math.min(250000, prev + 10000))}
                    className="flex-1 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"
                  >
                    + ₹10k
                  </button>
                </div>

                <input 
                  type="range" 
                  min="15000" 
                  max="250000" 
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-coral-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                  <span>₹15k</span>
                  <span>₹1.25L</span>
                  <span>₹2.5L+</span>
                </div>
              </div>

              {/* 3. Hotel Category Filter (3-Star, 4-Star, 5-Star) */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Hotel Category</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { star: '', label: 'All' },
                    { star: '3', label: '⭐⭐⭐ 3★' },
                    { star: '4', label: '⭐⭐⭐⭐ 4★' },
                    { star: '5', label: '⭐⭐⭐⭐⭐ 5★' },
                  ].map(item => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setSelectedStar(item.star)}
                      className={`py-1.5 px-2 text-[10px] font-black rounded-lg border text-center transition cursor-pointer ${
                        selectedStar === item.star 
                          ? 'bg-brand-900 text-white border-brand-900 shadow-xs' 
                          : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Flights Included Filter */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Flights Arrangement</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'yes', label: '✈️ Included' },
                    { id: 'no', label: 'Land Only' },
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFlightFilter(f.id)}
                      className={`py-1.5 px-2 text-[10px] font-black rounded-lg border text-center transition cursor-pointer ${
                        flightFilter === f.id 
                          ? 'bg-coral-500 text-white border-coral-500 shadow-xs' 
                          : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Travel Themes / Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Holiday Theme</label>
                <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                  {travelThemes.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-coral-50 border-coral-500 text-coral-600' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Duration in Nights */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Duration in Nights</label>
                <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="duration" 
                      checked={durationLimit === 'short'} 
                      onChange={() => setDurationLimit('short')} 
                      className="accent-coral-500"
                    />
                    <span>Up to 4 Nights (Short Break)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="duration" 
                      checked={durationLimit === 'medium'} 
                      onChange={() => setDurationLimit('medium')} 
                      className="accent-coral-500"
                    />
                    <span>5 to 6 Nights (Standard Vacation)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="duration" 
                      checked={durationLimit === 'long'} 
                      onChange={() => setDurationLimit('long')} 
                      className="accent-coral-500"
                    />
                    <span>7+ Nights (Extended Holiday)</span>
                  </label>
                </div>
              </div>

              {/* Apply / Reset Filter Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex-1 py-2 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-700 transition"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 text-xs font-black bg-brand-900 text-white rounded-xl shadow-xs hover:bg-brand-800 transition"
                >
                  Apply Filters
                </button>
              </div>

            </div>
          </div>

          {/* Packages Display Section */}
          <div className="lg:col-span-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-800">No holiday packages match your selected filters</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try widening your budget, toggling domestic/international filter, or clearing keyword search terms.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-6 py-2.5 bg-brand-900 text-white text-xs font-black rounded-xl shadow-sm hover:bg-brand-800 transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* All Packages Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map(pkg => (
                  <PackageCard 
                    key={pkg.package_id} 
                    pkg={pkg} 
                    isSelected={selectedPkg?.package_id === pkg.package_id}
                    onSelect={(p) => {
                      setSelectedPkg(p);
                    }}
                    onBookNow={(p) => {
                      setSelectedPkg(p);
                      handleOpenBookingModal(p);
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Grouped by Places View */
              <div className="space-y-10">
                {Object.entries(groupedByPlaces).map(([placeName, placePkgs]) => (
                  <div key={placeName} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                    {/* Place Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-coral-50 border border-coral-200 text-coral-600 flex items-center justify-center font-black">
                          <MapPin className="w-5 h-5 text-coral-500" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-brand-900 tracking-tight">
                            {placeName}
                          </h2>
                          <p className="text-xs text-slate-500">
                            {placePkgs.length} curated travel booking package{placePkgs.length > 1 ? 's' : ''} available
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-coral-600 bg-coral-50 px-3 py-1 rounded-full self-start sm:self-auto">
                        From ₹{Math.min(...placePkgs.map(p => p.base_price)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Place Packages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {placePkgs.map(pkg => (
                        <PackageCard 
                          key={pkg.package_id} 
                          pkg={pkg} 
                          isSelected={selectedPkg?.package_id === pkg.package_id}
                          onSelect={(p) => {
                            setSelectedPkg(p);
                          }}
                          onBookNow={(p) => {
                            setSelectedPkg(p);
                            handleOpenBookingModal(p);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Selected Package Action Bar (Immediate Option to Book) */}
      {selectedPkg && (
        <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-40 bg-brand-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl p-4 sm:p-5 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <img 
              src={selectedPkg.featured_image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=200&q=80'} 
              alt={selectedPkg.title} 
              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/20"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider bg-white/10 px-2 py-0.2 rounded">
                  Selected Holiday
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  {selectedPkg.duration_days} Days / {selectedPkg.duration_nights} Nights
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-white truncate max-w-md mt-0.5">
                {selectedPkg.title}
              </h4>
              <div className="text-xs font-bold text-coral-400">
                ₹{Number(selectedPkg.base_price).toLocaleString('en-IN')} <span className="text-[10px] text-slate-300 font-normal">per adult</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={() => {
                if (onSelectPackage) onSelectPackage(selectedPkg);
                onNavigate('package-details');
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
            >
              View Full Itinerary
            </button>
            <button
              onClick={() => handleOpenBookingModal(selectedPkg)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white text-xs font-black shadow-lg hover:shadow-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Book Now (Select Batch)
            </button>
            <button
              onClick={() => setSelectedPkg(null)}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Instant Departure Batch & Booking Modal */}
      {bookingModalPkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-coral-600">
                  Ready to Book Holiday
                </span>
                <h3 className="text-lg font-black text-brand-900 leading-snug">
                  {bookingModalPkg.title}
                </h3>
              </div>
              <button 
                onClick={() => setBookingModalPkg(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Places covered */}
            <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Places Visited:
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs font-bold text-slate-800">
                {bookingModalPkg.destinations?.map((d, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-coral-600">
                    <MapPin className="w-3 h-3" /> {d.name} {d.country ? `(${d.country})` : ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Batch selector */}
            <div className="mb-6">
              <label className="text-xs font-black text-slate-700 mb-2 block flex items-center justify-between">
                <span>Select Departure Batch:</span>
                <span className="text-[11px] text-emerald-600 font-bold">Guaranteed Departures</span>
              </label>

              {modalLoading ? (
                <div className="py-6 text-center text-xs text-slate-400">Loading departure batches...</div>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {modalDepartures.map(dep => {
                    const isSelected = selectedDep?.departure_id === dep.departure_id;
                    const seatsLeft = dep.available_seats;
                    return (
                      <div
                        key={dep.departure_id}
                        onClick={() => setSelectedDep(dep)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                          isSelected 
                            ? 'border-coral-500 bg-coral-50/40 ring-2 ring-coral-500/20' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-brand-900 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-coral-500" />
                            {dep.start_date} to {dep.end_date}
                          </span>
                          <span className="text-xs font-black text-brand-800">
                            ₹{Number(dep.price_override).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[11px]">
                          <span className="text-slate-500">
                            {dep.guide_name ? `Lead Guide: ${dep.guide_name}` : 'Certified Regional Guide'}
                          </span>
                          <span className={`font-bold ${seatsLeft <= 5 ? 'text-red-600' : 'text-emerald-700'}`}>
                            {seatsLeft} seats left
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBookingModalPkg(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedDep}
                onClick={handleConfirmModalBooking}
                className="flex-2 py-3 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                Proceed to Traveller Booking <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
