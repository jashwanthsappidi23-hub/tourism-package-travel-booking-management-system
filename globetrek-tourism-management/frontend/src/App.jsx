import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import TourPackages from './pages/TourPackages';
import PackageDetails from './pages/PackageDetails';
import ExploreDestinations from './pages/ExploreDestinations';
import BookingFlow from './pages/BookingFlow';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import RefundStatusPage from './pages/RefundStatusPage';
import CustomerDashboard from './pages/CustomerDashboard';
import GuideDashboard from './pages/GuideDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportsAnalytics from './pages/ReportsAnalytics';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import { useAuth } from './context/AuthContext';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState(null);

  const { isAuthenticated, role } = useAuth();

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleStartBooking = (pkg, dep) => {
    setSelectedPackage(pkg);
    setSelectedDeparture(dep);
  };

  const handleBookingConfirmed = (booking) => {
    setLastConfirmedBooking(booking);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      <main className="flex-1">
        {currentPage === 'home' && (
          <Home 
            onNavigate={handleNavigate} 
            onSelectPackage={handleSelectPackage} 
          />
        )}

        {currentPage === 'packages' && (
          <TourPackages 
            onNavigate={handleNavigate} 
            onSelectPackage={handleSelectPackage} 
            onStartBooking={handleStartBooking}
            initialFilters={pageParams} 
          />
        )}

        {currentPage === 'package-details' && (
          <PackageDetails 
            pkg={selectedPackage} 
            onNavigate={handleNavigate} 
            onStartBooking={handleStartBooking} 
          />
        )}

        {currentPage === 'destinations' && (
          <ExploreDestinations onNavigate={handleNavigate} />
        )}

        {currentPage === 'booking-flow' && (
          <BookingFlow 
            pkg={selectedPackage} 
            departure={selectedDeparture} 
            onNavigate={handleNavigate} 
            onBookingConfirmed={handleBookingConfirmed} 
          />
        )}

        {currentPage === 'booking-confirmation' && (
          <BookingConfirmation 
            booking={lastConfirmedBooking} 
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === 'my-bookings' && (
          <MyBookings 
            onNavigate={handleNavigate} 
            onSelectBooking={handleBookingConfirmed} 
          />
        )}

        {currentPage === 'refund-status' && (
          <RefundStatusPage 
            initialRef={pageParams.ref} 
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === 'customer-dashboard' && (
          <CustomerDashboard 
            onNavigate={handleNavigate} 
            onSelectBooking={handleBookingConfirmed} 
          />
        )}

        {currentPage === 'guide-dashboard' && (
          <GuideDashboard onNavigate={handleNavigate} />
        )}

        {currentPage === 'admin-dashboard' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}

        {currentPage === 'reports-analytics' && (
          <ReportsAnalytics onNavigate={handleNavigate} />
        )}

        {currentPage === 'login' && (
          <Login onNavigate={handleNavigate} />
        )}

        {currentPage === 'register' && (
          <Register onNavigate={handleNavigate} />
        )}

        {currentPage === 'forgot-password' && (
          <ForgotPassword onNavigate={handleNavigate} />
        )}

        {currentPage === 'about' && (
          <AboutUs onNavigate={handleNavigate} />
        )}

        {currentPage === 'contact' && (
          <ContactUs onNavigate={handleNavigate} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
