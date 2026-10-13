import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Calendar, Users, MapPin, Clock, Hotel, Bus, 
  ShieldCheck, Phone, Mail, Award, CheckCircle 
} from 'lucide-react';

export default function GuideDashboard({ onNavigate }) {
  const [guideData, setGuideData] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const data = await api.getGuideSchedule();
        setGuideData(data);
        if (data.assigned_tours?.length > 0) {
          setSelectedTour(data.assigned_tours[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Loading guide schedule...</div>;
  }

  if (!guideData) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Guide profile not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Guide Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {guideData.full_name ? guideData.full_name[0] : 'G'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-brand-900">{guideData.full_name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Certified Regional Guide
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">{guideData.bio}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-coral-500" /> {guideData.phone}</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-500" /> {guideData.experience_years} Years Experience</span>
                <span className="flex items-center gap-1">🗣️ {guideData.languages}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center shrink-0">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Scheduled Tours</div>
            <div className="text-2xl font-black text-brand-900 mt-0.5">{guideData.assigned_tours?.length || 0}</div>
            <span className="text-[10px] text-emerald-600 font-bold">Conflict-Free Roster</span>
          </div>
        </div>

        {/* Assigned Tours Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Tour Roster (1 Col) */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-extrabold text-base text-brand-900 mb-3">Assigned Departure Batches</h3>
            
            {guideData.assigned_tours?.map((tour) => {
              const isSelected = selectedTour?.departure_id === tour.departure_id;
              return (
                <div
                  key={tour.departure_id}
                  onClick={() => setSelectedTour(tour)}
                  className={`p-5 rounded-2xl border cursor-pointer transition ${isSelected ? 'border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-600/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <span className="text-[10px] font-bold uppercase text-coral-600">Departure #{tour.departure_id}</span>
                  <h4 className="font-extrabold text-sm text-slate-800 line-clamp-2 mt-0.5">{tour.package_title}</h4>
                  
                  <div className="mt-3 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-brand-800">
                      <Calendar className="w-3.5 h-3.5 text-coral-500" /> {tour.start_date} to {tour.end_date}
                    </div>
                    <div className="flex items-center justify-between text-slate-500 pt-1">
                      <span>{tour.confirmed_travellers_count} Passengers</span>
                      <span>{tour.vehicle_type}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Tour Details & Passenger Manifest (2 Cols) */}
          <div className="lg:col-span-2">
            {selectedTour ? (
              <div className="space-y-6">
                {/* Tour Info Banner */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div>
                      <span className="text-xs font-bold text-coral-600 uppercase">Active Tour Schedule</span>
                      <h2 className="text-xl font-black text-brand-900">{selectedTour.package_title}</h2>
                    </div>
                    <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg border border-brand-200">
                      {selectedTour.vehicle_type} ({selectedTour.vehicle_plate})
                    </span>
                  </div>

                  {/* Passenger Manifest */}
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" /> Passenger Manifest ({selectedTour.manifest.length} Confirmed Travellers)
                    </h3>

                    {selectedTour.manifest.length === 0 ? (
                      <p className="text-xs text-slate-400">No confirmed travellers booked on this departure yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                            <tr>
                              <th className="p-2.5">Seat</th>
                              <th className="p-2.5">Passenger Name</th>
                              <th className="p-2.5">Age / Gender</th>
                              <th className="p-2.5">Booking Ref</th>
                              <th className="p-2.5">Contact Phone</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedTour.manifest.map((p, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-2.5 font-bold font-mono text-brand-700">{p.seat_number || `S-${idx+1}`}</td>
                                <td className="p-2.5 font-bold text-slate-800">{p.full_name}</td>
                                <td className="p-2.5 text-slate-600">{p.age} yrs • {p.gender}</td>
                                <td className="p-2.5 font-mono text-slate-500">{p.booking_reference}</td>
                                <td className="p-2.5 text-slate-700">{p.phone || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Day-by-Day Itinerary Guide View */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                  <h3 className="font-extrabold text-sm text-slate-800 mb-4">Tour Day-by-Day Schedule</h3>
                  <div className="space-y-3">
                    {selectedTour.itinerary.map((d) => (
                      <div key={d.day_number} className="p-4 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="text-brand-900">Day {d.day_number}: {d.title}</span>
                          <span className="text-slate-500">Stay: {d.hotel}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{d.activities}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
                Select a departure batch from the left to view passenger manifest and tour itinerary.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
