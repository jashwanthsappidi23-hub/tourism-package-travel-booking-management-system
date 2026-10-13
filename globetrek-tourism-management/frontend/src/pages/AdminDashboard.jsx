import React, { useState, useEffect } from 'react';
import AnalyticsCharts from '../components/dashboards/AnalyticsCharts';
import { api } from '../services/api';
import { 
  Users, MapPin, Package, Calendar, Ticket, DollarSign, 
  RotateCcw, ShieldCheck, Database, Plus, Search, Check, 
  X, AlertTriangle, Eye, Truck, CreditCard, UserCheck, 
  Phone, Mail, FileText, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); 
  // Tabs: overview, users, bookings, payments, transport, cancellations, departures, packages, destinations
  const [loading, setLoading] = useState(true);

  // Data lists
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [transports, setTransports] = useState([]);
  const [cancellations, setCancellations] = useState([]);

  // Search filters
  const [userSearch, setUserSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState('');

  // Modals state
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [newDestName, setNewDestName] = useState('');
  const [newDestState, setNewDestState] = useState('');
  const [newDestCountry, setNewDestCountry] = useState('India');
  const [newDestDesc, setNewDestDesc] = useState('');

  const [showAddTransportModal, setShowAddTransportModal] = useState(false);
  const [newVehicleType, setNewVehicleType] = useState('Toyota Innova Crysta');
  const [newCapacity, setNewCapacity] = useState(6);
  const [newRegNumber, setNewRegNumber] = useState('');
  const [newOperatorName, setNewOperatorName] = useState('GlobeTrek Premium Logistics');
  const [newContactPhone, setNewContactPhone] = useState('+91 98765 43210');

  // Passenger Manifest Modal
  const [selectedBookingForTravellers, setSelectedBookingForTravellers] = useState(null);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  async function loadAllAdminData() {
    setLoading(true);
    try {
      const [
        statsRes, chartsRes, destsRes, pkgsRes, 
        depsRes, bksRes, refsRes, custsRes, 
        paysRes, transRes, cancsRes
      ] = await Promise.all([
        api.getDashboardStats(),
        api.getAnalyticsCharts(),
        api.getDestinations(),
        api.getPackages(),
        api.getDepartures(),
        api.getAllBookings(),
        api.getAllRefunds(),
        api.getCustomers().catch(() => []),
        api.getAllPayments().catch(() => []),
        api.getTransport().catch(() => []),
        api.getAllCancellations().catch(() => [])
      ]);

      setStats(statsRes);
      setChartsData(chartsRes);
      setDestinations(destsRes || []);
      setPackages(pkgsRes || []);
      setDepartures(depsRes || []);
      setBookings(bksRes || []);
      setRefunds(refsRes || []);
      setCustomers(custsRes || []);
      setPayments(paysRes || []);
      setTransports(transRes || []);
      setCancellations(cancsRes || []);
    } catch (err) {
      console.error('Failed to load admin dataset:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateDestination = async (e) => {
    e.preventDefault();
    try {
      await api.createDestination({
        name: newDestName,
        state: newDestState,
        description: newDestDesc,
        country: newDestCountry || 'India',
        is_popular: true
      });
      setShowAddDestModal(false);
      setNewDestName('');
      setNewDestState('');
      setNewDestCountry('India');
      setNewDestDesc('');
      await loadAllAdminData();
    } catch (err) {
      alert(err.message || 'Failed to add destination');
    }
  };

  const handleCreateTransport = async (e) => {
    e.preventDefault();
    try {
      await api.createTransport({
        vehicle_type: newVehicleType,
        capacity: parseInt(newCapacity),
        registration_number: newRegNumber,
        operator_name: newOperatorName,
        contact_phone: newContactPhone
      });
      setShowAddTransportModal(false);
      setNewRegNumber('');
      await loadAllAdminData();
    } catch (err) {
      alert(err.message || 'Failed to register transport vehicle');
    }
  };

  // Filtered lists
  const filteredCustomers = customers.filter(c => {
    const q = userSearch.toLowerCase();
    return (
      (c.full_name && c.full_name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  const filteredBookings = bookings.filter(b => {
    const q = bookingSearch.toLowerCase();
    return (
      (b.booking_reference && b.booking_reference.toLowerCase().includes(q)) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
      (b.package_title && b.package_title.toLowerCase().includes(q))
    );
  });

  const filteredPayments = payments.filter(p => {
    const q = paymentSearch.toLowerCase();
    return (
      (p.payment_reference && p.payment_reference.toLowerCase().includes(q)) ||
      (p.booking_reference && p.booking_reference.toLowerCase().includes(q)) ||
      (p.customer_name && p.customer_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Relational Database Administration (3NF)
            </div>
            <h1 className="text-3xl font-black text-brand-900 tracking-tight">
              Administrator Control Panel
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Live operations: Users &amp; Customers, Bookings, Payments, Transport Logistics, Cancellations &amp; Analytics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('reports-analytics')}
              className="px-4 py-2.5 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-amber-300" />
              14 Academic SQL Reports
            </button>
            <button
              onClick={loadAllAdminData}
              className="px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* Executive KPI Summary Counters */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Users</span>
              <div className="text-xl font-black text-brand-900 mt-1">{customers.length || stats.registered_customers}</div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Packages</span>
              <div className="text-xl font-black text-brand-900 mt-1">{stats.active_tour_packages}</div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Bookings</span>
              <div className="text-xl font-black text-emerald-700 mt-1">{bookings.length}</div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Fleet Vehicles</span>
              <div className="text-xl font-black text-blue-700 mt-1">{transports.length}</div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Cancellations</span>
              <div className="text-xl font-black text-red-600 mt-1">{cancellations.length}</div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Revenue</span>
              <div className="text-xl font-black text-brand-900 mt-1">₹{Number(stats.total_revenue).toLocaleString('en-IN')}</div>
            </div>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold scrollbar-none">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            Analytics &amp; Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <Users className="w-3.5 h-3.5" /> Users &amp; Customers ({customers.length})
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'bookings' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <Ticket className="w-3.5 h-3.5" /> Bookings ({bookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'payments' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Payments ({payments.length})
          </button>
          <button 
            onClick={() => setActiveTab('transport')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'transport' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <Truck className="w-3.5 h-3.5" /> Transport &amp; Fleet ({transports.length})
          </button>
          <button 
            onClick={() => setActiveTab('cancellations')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'cancellations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Cancellations &amp; Refunds ({cancellations.length})
          </button>
          <button 
            onClick={() => setActiveTab('departures')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${activeTab === 'departures' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            Departures ({departures.length})
          </button>
          <button 
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${activeTab === 'packages' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            Packages ({packages.length})
          </button>
          <button 
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${activeTab === 'destinations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            Destinations ({destinations.length})
          </button>
        </div>

        {/* Tab 1: Analytics & Overview */}
        {activeTab === 'overview' && (
          <div>
            <AnalyticsCharts chartsData={chartsData} />
          </div>
        )}

        {/* Tab 2: Users & Customers Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="font-extrabold text-xs text-slate-800">Registered Users &amp; Customer Directory</span>
                <p className="text-[11px] text-slate-500">Stored in 3NF Users &amp; Customers relational tables</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search customer, email, phone..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border rounded-xl bg-white outline-hidden font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Customer ID</th>
                    <th className="p-3">Full Legal Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Phone Number</th>
                    <th className="p-3">Location (City, State)</th>
                    <th className="p-3">Emergency Contact</th>
                    <th className="p-3">Bookings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map(c => (
                    <tr key={c.customer_id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-brand-800">#{c.customer_id}</td>
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold flex items-center justify-center">
                          {c.full_name ? c.full_name[0] : 'U'}
                        </div>
                        {c.full_name}
                      </td>
                      <td className="p-3 text-slate-600">{c.email}</td>
                      <td className="p-3 text-slate-700 font-medium">{c.phone || 'N/A'}</td>
                      <td className="p-3 text-slate-600">{[c.city, c.state].filter(Boolean).join(', ') || 'Not specified'}</td>
                      <td className="p-3 text-slate-500">{c.emergency_contact || 'None'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {c.total_bookings} bookings
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Bookings Management & Passenger Manifests */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="font-extrabold text-xs text-slate-800">Customer Bookings Ledger</span>
                <p className="text-[11px] text-slate-500">Atomic reservations with allocated passenger seats</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={e => setBookingSearch(e.target.value)}
                  placeholder="Search ref, customer, package..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border rounded-xl bg-white outline-hidden font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Customer Details</th>
                    <th className="p-3">Package &amp; Dates</th>
                    <th className="p-3">Travellers</th>
                    <th className="p-3">Net Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Manifest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map(b => (
                    <tr key={b.booking_id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-brand-800">{b.booking_reference}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{b.customer_name}</div>
                        <div className="text-[11px] text-slate-500">{b.customer_email} • {b.customer_phone}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-800 font-medium truncate max-w-xs">{b.package_title}</div>
                        <div className="text-[10px] text-slate-500">{b.start_date} to {b.end_date}</div>
                      </td>
                      <td className="p-3 text-slate-700 font-bold">{b.traveller_count} seats</td>
                      <td className="p-3 font-bold text-brand-900">₹{Number(b.net_amount).toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.booking_status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {b.booking_status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedBookingForTravellers(b)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-indigo-600" /> View Travellers
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Payments Audit Ledger */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="font-extrabold text-xs text-slate-800">Financial Payment Audit Trail</span>
                <p className="text-[11px] text-slate-500">Processed gateway transactions, UPI references &amp; methods</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={paymentSearch}
                  onChange={e => setPaymentSearch(e.target.value)}
                  placeholder="Search txn ref, booking, customer..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border rounded-xl bg-white outline-hidden font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Payment Reference</th>
                    <th className="p-3">Booking Ref</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Amount (INR)</th>
                    <th className="p-3">Payment Mode</th>
                    <th className="p-3">Transaction Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map(p => (
                    <tr key={p.payment_id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-brand-800">{p.payment_reference}</td>
                      <td className="p-3 font-mono text-slate-700">{p.booking_reference}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{p.customer_name}</div>
                        <div className="text-[10px] text-slate-500">{p.customer_email}</div>
                      </td>
                      <td className="p-3 font-bold text-emerald-700">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {p.payment_method}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{p.transaction_date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.payment_status === 'Successful' ? 'bg-emerald-100 text-emerald-800' : p.payment_status === 'Refunded' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                          {p.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Transport & Fleet Logistics */}
        {activeTab === 'transport' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-extrabold text-xs text-slate-800">Transport Fleet &amp; Logistics Roster ({transports.length})</span>
                <p className="text-[11px] text-slate-500">Vehicles, operators, and contracted transit capacity</p>
              </div>
              <button 
                onClick={() => setShowAddTransportModal(true)}
                className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" /> Register Fleet Vehicle
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Transport ID</th>
                    <th className="p-3">Vehicle / Transit Type</th>
                    <th className="p-3">Registration Plate</th>
                    <th className="p-3">Seating Capacity</th>
                    <th className="p-3">Fleet Operator Agency</th>
                    <th className="p-3">Operator Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transports.map(t => (
                    <tr key={t.transport_id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-brand-800">#{t.transport_id}</td>
                      <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-indigo-600" />
                        {t.vehicle_type}
                      </td>
                      <td className="p-3 font-mono font-semibold text-slate-700">{t.registration_number}</td>
                      <td className="p-3 font-bold text-slate-800">{t.capacity} passengers</td>
                      <td className="p-3 text-slate-700">{t.operator_name}</td>
                      <td className="p-3 text-slate-600 font-medium">{t.contact_phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Cancellations & Refunds Audit */}
        {activeTab === 'cancellations' && (
          <div className="space-y-6">
            {/* Cancellations Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-xs text-slate-800">Cancellation Audit Trail ({cancellations.length})</span>
                  <p className="text-[11px] text-slate-500">Includes date notice, fee slab percentage, and refundable balances</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                    <tr>
                      <th className="p-3">Cancellation ID</th>
                      <th className="p-3">Booking Ref</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Cancellation Fee</th>
                      <th className="p-3">Refundable Balance</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cancellations.map(c => (
                      <tr key={c.cancellation_id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-brand-800">#{c.cancellation_id}</td>
                        <td className="p-3 font-mono font-bold text-slate-800">{c.booking_reference}</td>
                        <td className="p-3 font-semibold text-slate-800">{c.customer_name}</td>
                        <td className="p-3 font-bold text-red-600">₹{Number(c.cancellation_fee).toLocaleString('en-IN')}</td>
                        <td className="p-3 font-bold text-emerald-700">₹{Number(c.refundable_amount).toLocaleString('en-IN')}</td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">{c.reason}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Refunds Disbursements Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-xs text-slate-800">Refund Disbursements Audit ({refunds.length})</span>
                  <p className="text-[11px] text-slate-500">Processed payouts to original customer payment methods</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                    <tr>
                      <th className="p-3">Refund ID</th>
                      <th className="p-3">Booking Ref</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Refund Amount</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Audit Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {refunds.map(r => (
                      <tr key={r.refund_id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-brand-800">#{r.refund_id}</td>
                        <td className="p-3 font-mono text-brand-800 font-bold">{r.booking_reference}</td>
                        <td className="p-3 text-slate-800">{r.customer_name}</td>
                        <td className="p-3 font-bold text-emerald-700">₹{Number(r.refund_amount).toLocaleString('en-IN')}</td>
                        <td className="p-3 text-slate-600">{r.refund_method}</td>
                        <td className="p-3 text-slate-500">{new Date(r.refund_date).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {r.refund_status}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-500">{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Departures Scheduling */}
        {activeTab === 'departures' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="font-extrabold text-xs text-slate-800">Scheduled Tour Departures</span>
              <span className="text-xs text-slate-500">Atomic Capacity Tracking</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Package Title</th>
                    <th className="p-3">Dates</th>
                    <th className="p-3">Capacity</th>
                    <th className="p-3">Confirmed Seats</th>
                    <th className="p-3">Available</th>
                    <th className="p-3">Lead Guide</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departures.map(d => (
                    <tr key={d.departure_id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold">#{d.departure_id}</td>
                      <td className="p-3 font-bold text-slate-800">{d.package_title}</td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">{d.start_date} to {d.end_date}</td>
                      <td className="p-3 text-slate-700">{d.total_capacity}</td>
                      <td className="p-3 font-bold text-brand-800">{d.confirmed_seats}</td>
                      <td className="p-3 font-bold text-emerald-700">{d.available_seats}</td>
                      <td className="p-3 text-slate-700">{d.guide_name || 'Unassigned'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${d.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 8: Packages */}
        {activeTab === 'packages' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="font-extrabold text-xs text-slate-800">Tour Packages Management</span>
              <span className="text-xs text-slate-500">{packages.length} Packages</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Package Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Starting Price</th>
                    <th className="p-3">Destinations</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {packages.map(p => (
                    <tr key={p.package_id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold">#{p.package_id}</td>
                      <td className="p-3 font-bold text-slate-800">{p.title}</td>
                      <td className="p-3 text-coral-600 font-semibold">{p.category}</td>
                      <td className="p-3 text-slate-600">{p.duration_days}D / {p.duration_nights}N</td>
                      <td className="p-3 font-bold text-brand-900">₹{Number(p.base_price).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-slate-600 truncate max-w-xs">{p.destinations?.map(d => d.name).join(', ')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 9: Destinations */}
        {activeTab === 'destinations' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="font-extrabold text-xs text-slate-800">Registered Worldwide &amp; Indian Destinations ({destinations.length})</span>
              <button 
                onClick={() => setShowAddDestModal(true)}
                className="px-3 py-1.5 bg-brand-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Destination
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {destinations.map(d => (
                <div key={d.destination_id} className="p-4 rounded-xl border border-slate-200 flex gap-3 items-center">
                  <img src={d.image_url} alt={d.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">{d.name}</h4>
                    <p className="text-xs text-slate-500">{d.state}, {d.country}</p>
                    <span className="text-[10px] font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded mt-1 inline-block">
                      Best: {d.best_time_to_visit || 'Year round'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Passenger Manifest Modal */}
      {selectedBookingForTravellers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Passenger Manifest</span>
                <h3 className="font-extrabold text-base text-brand-900">
                  Booking Ref: {selectedBookingForTravellers.booking_reference}
                </h3>
                <p className="text-xs text-slate-500">{selectedBookingForTravellers.package_title} • Booked by {selectedBookingForTravellers.customer_name}</p>
              </div>
              <button onClick={() => setSelectedBookingForTravellers(null)} className="cursor-pointer p-1">
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-2.5">Seat</th>
                    <th className="p-2.5">Full Passenger Name</th>
                    <th className="p-2.5">Age / Gender</th>
                    <th className="p-2.5">ID Document Type</th>
                    <th className="p-2.5">ID Proof Number</th>
                    <th className="p-2.5">Contact Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedBookingForTravellers.travellers && selectedBookingForTravellers.travellers.length > 0 ? (
                    selectedBookingForTravellers.travellers.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-indigo-600">Seat #{idx + 1}</td>
                        <td className="p-2.5 font-bold text-slate-900">{t.full_name}</td>
                        <td className="p-2.5 text-slate-700">{t.age} yrs • {t.gender}</td>
                        <td className="p-2.5 text-slate-600">{t.id_proof_type || 'Aadhaar'}</td>
                        <td className="p-2.5 font-mono text-slate-800">{t.id_proof_number || 'DOC-XXXX-99'}</td>
                        <td className="p-2.5 text-slate-600">{t.phone || selectedBookingForTravellers.customer_phone}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-slate-400">
                        No individual traveller manifests recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBookingForTravellers(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Manifest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transport Fleet Modal */}
      {showAddTransportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h3 className="font-extrabold text-sm text-slate-800">Register Transport Fleet Vehicle</h3>
              <button onClick={() => setShowAddTransportModal(false)} className="cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateTransport} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Vehicle / Transit Type *</label>
                <input required value={newVehicleType} onChange={e => setNewVehicleType(e.target.value)} placeholder="e.g. Innova Crysta, Volvo Luxury Coach" className="w-full p-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Passenger Capacity *</label>
                  <input type="number" required min="1" value={newCapacity} onChange={e => setNewCapacity(e.target.value)} className="w-full p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Registration Plate *</label>
                  <input required value={newRegNumber} onChange={e => setNewRegNumber(e.target.value)} placeholder="e.g. KA-01-EQ-9876" className="w-full p-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Fleet Operator Agency *</label>
                <input required value={newOperatorName} onChange={e => setNewOperatorName(e.target.value)} placeholder="e.g. Royal Travels Pvt Ltd" className="w-full p-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Operator Contact Phone *</label>
                <input required value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)} placeholder="e.g. +91 98765 43210" className="w-full p-2 border rounded-xl" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl mt-4 cursor-pointer">
                Save Fleet Vehicle
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Destination Modal */}
      {showAddDestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h3 className="font-extrabold text-sm text-slate-800">Add New Destination</h3>
              <button onClick={() => setShowAddDestModal(false)} className="cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateDestination} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Destination Name</label>
                <input required value={newDestName} onChange={e => setNewDestName(e.target.value)} placeholder="e.g. Kyoto or Rishikesh" className="w-full p-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">State / Province</label>
                  <input required value={newDestState} onChange={e => setNewDestState(e.target.value)} placeholder="e.g. Kansai or Uttarakhand" className="w-full p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Country</label>
                  <input required value={newDestCountry} onChange={e => setNewDestCountry(e.target.value)} placeholder="e.g. Japan or India" className="w-full p-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea rows="3" value={newDestDesc} onChange={e => setNewDestDesc(e.target.value)} placeholder="Short highlights..." className="w-full p-2 border rounded-xl" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl mt-4 cursor-pointer">
                Save Destination
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
