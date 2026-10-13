import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MapPin, Calendar, ArrowRight, Search, Sparkles, Globe } from 'lucide-react';

export default function ExploreDestinations({ onNavigate }) {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, []);

  const continents = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Oceania', 'Africa'];

  const filtered = destinations.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(search.toLowerCase()) || 
      (d.state && d.state.toLowerCase().includes(search.toLowerCase())) ||
      (d.country && d.country.toLowerCase().includes(search.toLowerCase())) ||
      (d.continent && d.continent.toLowerCase().includes(search.toLowerCase()));

    const matchesContinent = 
      selectedContinent === 'All' || 
      (d.continent && d.continent.toLowerCase().includes(selectedContinent.toLowerCase()));

    return matchesSearch && matchesContinent;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-coral-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4" /> Global Destinations Catalogue
            </div>
            <h1 className="text-3xl font-black text-brand-900 tracking-tight">Explore Worldwide Destinations</h1>
            <p className="text-xs text-slate-500 mt-1">
              Discover 50+ handpicked iconic destinations across Europe, Asia, the Americas, Africa, and Oceania
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination, country or city..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
            />
          </div>
        </div>

        {/* Continent Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {continents.map((cont) => (
            <button
              key={cont}
              onClick={() => setSelectedContinent(cont)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap ${
                selectedContinent === cont
                  ? 'bg-brand-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cont}
            </button>
          ))}
          <span className="text-[11px] font-semibold text-slate-400 ml-auto whitespace-nowrap">
            Showing {filtered.length} of {destinations.length} destinations
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading worldwide destinations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dest) => (
              <div 
                key={dest.destination_id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-900">
                    <img 
                      src={dest.image_url} 
                      alt={dest.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-brand-900/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-coral-400" />
                      {dest.country}
                    </div>
                    {dest.continent && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {dest.continent}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-black text-slate-900">{dest.name}</h3>
                      <span className="text-[11px] font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full">
                        Best: {dest.best_time_to_visit || 'Year-round'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mb-2 flex items-center gap-1">
                      <span>{dest.state}</span>
                      <span>•</span>
                      <span className="text-brand-700">{dest.country}</span>
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button 
                    onClick={() => onNavigate('packages', { destination: dest.name })}
                    className="w-full py-3 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    View Packages for {dest.name} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
