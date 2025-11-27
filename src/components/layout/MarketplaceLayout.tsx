import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, LogOut, Home, Settings, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import logoImage from '../../assets/opt-Logo.png';

interface MarketplaceLayoutProps {
  children: React.ReactNode;
}

const MarketplaceLayout: React.FC<MarketplaceLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userRole = localStorage.getItem('role');
  const userEmail = localStorage.getItem('email') || 'User';
  const currentYear = new Date().getFullYear();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 flex flex-col">
      {/* Top Navbar - Style premium glassmorphism */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section - Identique à la Sidebar */}
            <Link 
              to="/marketplace" 
              className="flex items-center hover:opacity-80 transition-opacity group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition duration-500 animate-pulse" />
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md border-4 border-white/30 rounded-xl flex items-center justify-center shadow-2xl">
                  <img 
                    src={logoImage} 
                    alt="Optique Marketplace Logo" 
                    className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-xl sm:text-2xl font-black text-white">
                  Opti<span className="text-blue-300">MAROC</span>
                </span>
                <p className="text-blue-200/70 text-xs font-semibold hidden sm:block">
                  Marketplace
                </p>
              </div>
            </Link>

            {/* Right Side - Navigation Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className="relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300" />
                <div className="relative flex items-center gap-2 px-3 sm:px-4 py-2 backdrop-blur-sm bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-bold transition-all duration-300 text-sm sm:text-base">
                  <Home size={18} className="flex-shrink-0" />
                  <span className="hidden sm:inline">Dashboard</span>
                </div>
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300" />
                <div className="relative p-2 sm:p-3 backdrop-blur-sm bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all duration-300">
                  <ShoppingCart className="text-white" size={20} />
                  {cart.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg animate-pulse">
                      {cart.totalItems > 99 ? '99+' : cart.totalItems}
                    </span>
                  )}
                </div>
              </Link>

              {/* User Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300" />
                  <div className="relative flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 backdrop-blur-sm bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all duration-300">
                    <div className="hidden md:block text-right">
                      <p className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px]">
                        {userEmail}
                      </p>
                      <p className="text-xs text-blue-200 font-semibold">
                        {userRole === 'ROLE_ADMIN' ? 'Admin' : 'Opticien'}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <User className="text-white" size={20} />
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-white/20 bg-white/5">
                      <p className="text-sm font-bold text-white truncate">{userEmail}</p>
                      <p className="text-xs text-blue-200 font-semibold mt-1">
                        {userRole === 'ROLE_ADMIN' ? 'Administrateur' : 'Opticien'}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {/* Account Settings */}
                      <Link
                        to="/ProfileSettings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-all duration-200 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                          <Settings size={18} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">Paramètres du compte</p>
                          <p className="text-xs text-blue-200">Gérer votre profil</p>
                        </div>
                      </Link>

                      {/* Divider */}
                      <div className="my-2 h-px bg-white/10"></div>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-red-500/20 transition-all duration-200 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-red-500/50 transition-all duration-300">
                          <LogOut size={18} className="text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold">Déconnexion</p>
                          <p className="text-xs text-red-200">Quitter votre session</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with animated background */}
      <main className="relative flex-1">
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Footer Premium */}
      <footer className="relative mt-auto backdrop-blur-xl bg-white/5 border-t border-white/10 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link 
                to="/marketplace" 
                className="flex items-center group mb-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition duration-300" />
                  <div className="relative w-12 h-12 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-xl flex items-center justify-center shadow-lg">
                    <img 
                      src={logoImage} 
                      alt="Optique Marketplace Logo" 
                      className="w-9 h-9 object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
                <span className="ml-3 text-2xl font-black text-white group-hover:text-blue-300 transition-colors duration-300">
                  Opti<span className="text-blue-300">MAROC</span>
                </span>
              </Link>
              <p className="text-sm text-blue-200/70 mb-4 max-w-md">
                Votre marketplace professionnel de montures optiques au Maroc. 
                Connectant opticiens et fournisseurs pour une expérience d'achat optimale.
              </p>
              <div className="space-y-2">
                <a href="mailto:contact@optimaroc.ma" className="flex items-center gap-2 text-sm text-blue-200/70 hover:text-white transition-colors group">
                  <Mail size={16} className="group-hover:text-blue-400 transition-colors" />
                  <span>contact@optimaroc.ma</span>
                </a>
                <a href="tel:+212600000000" className="flex items-center gap-2 text-sm text-blue-200/70 hover:text-white transition-colors group">
                  <Phone size={16} className="group-hover:text-blue-400 transition-colors" />
                  <span>+212 6 00 00 00 00</span>
                </a>
                <div className="flex items-start gap-2 text-sm text-blue-200/70">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Casablanca, Maroc</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-black text-lg mb-4">Liens rapides</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/marketplace" 
                    className="relative text-blue-200/70 hover:text-white font-medium transition-colors duration-300 group inline-block"
                  >
                    <span>Marketplace</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/orders" 
                    className="relative text-blue-200/70 hover:text-white font-medium transition-colors duration-300 group inline-block"
                  >
                    <span>Mes commandes</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dashboard" 
                    className="relative text-blue-200/70 hover:text-white font-medium transition-colors duration-300 group inline-block"
                  >
                    <span>Dashboard</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/ProfileSettings" 
                    className="relative text-blue-200/70 hover:text-white font-medium transition-colors duration-300 group inline-block"
                  >
                    <span>Paramètres</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-white font-black text-lg mb-4">Suivez-nous</h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#"
                  className="group relative w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <svg className="relative w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="group relative w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <svg className="relative w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="group relative w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300"
                  aria-label="Twitter"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <svg className="relative w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="group relative w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <svg className="relative w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-white/60 text-center md:text-left">
              © {currentYear} OptiMAROC. Tous droits réservés.
            </p>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <a 
                href="#" 
                className="relative text-white/70 hover:text-white font-medium transition-colors duration-300 group"
              >
                <span>À propos</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300" />
              </a>
              <span className="text-white/30">•</span>
              <a 
                href="#" 
                className="relative text-white/70 hover:text-white font-medium transition-colors duration-300 group"
              >
                <span>Confidentialité</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300" />
              </a>
              <span className="text-white/30">•</span>
              <a 
                href="#" 
                className="relative text-white/70 hover:text-white font-medium transition-colors duration-300 group"
              >
                <span>Conditions</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300" />
              </a>
              <span className="text-white/30">•</span>
              <a 
                href="/contact" 
                className="relative text-white/70 hover:text-white font-medium transition-colors duration-300 group"
              >
                <span>Contact</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/50">
              Conçu avec <span className="text-red-400 animate-pulse">❤</span> par l'équipe OptiMAROC
            </p>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MarketplaceLayout;