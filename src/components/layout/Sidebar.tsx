import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../Api/axios';
import logoImage from '../../assets/opt-Logo.png';
interface CurrentUser {
  id: string;
  email: string;
  roles: string[];
}

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const isAdmin = () => {
    return user?.roles?.includes('ROLE_ADMIN');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 text-base font-bold rounded-xl transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/50'
        : 'text-white/80 hover:text-white hover:bg-white/10'
    }`;

  return (
      <aside
        className={`fixed top-0 left-0 z-50 w-72 h-screen backdrop-blur-xl bg-white/10 border-r border-white/20 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 shadow-2xl`}
      >
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-center border-b border-white/20 px-4">
        <a 
          href="/dashboard" 
          className="flex items-center hover:opacity-80 transition-opacity group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition duration-500 animate-pulse" />
            <div className="relative w-12 h-12 bg-white/10 backdrop-blur-md border-4 border-white/30 rounded-xl flex items-center justify-center shadow-2xl">
              <img 
                src={logoImage} 
                alt="Optique Marketplace Logo" 
                className="w-9 h-9 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          <span className="ml-3 text-2xl font-black text-white">
            Opti<span className="text-blue-300">MAROC</span>
          </span>
        </a>
      </div>

      {/* Navigation Menu */}
      <div className="h-[calc(100vh-5rem)] px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {/* Dashboard */}
          <li>
            <NavLink to="/dashboard" className={navLinkClass}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Tableau de bord</span>
            </NavLink>
          </li>
          
          {/* Marktplace Divider */}
          <li className="pt-4 pb-2">
            <div className="flex items-center">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="px-3 text-xs font-bold text-white/50 uppercase tracking-wider">marché</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
          </li>
          {/* MarketPlace */}
          <li>
            <NavLink to="/marketplace" className={navLinkClass}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Marché</span>
            </NavLink>
          </li>

          {/* Divider */}
          <li className="pt-4 pb-2">
            <div className="flex items-center">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="px-3 text-xs font-bold text-white/50 uppercase tracking-wider">Montures</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
          </li>

          {/* Liste des montures */}
          <li>
            <NavLink to="/montures" className={navLinkClass}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Liste des montures</span>
            </NavLink>
          </li>

          {/* Ajouter monture */}
          <li>
            <NavLink to="/montureform" className={navLinkClass}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Ajouter une monture</span>
            </NavLink>
          </li>

          {/* Orders Divider */}
          <li className="pt-4 pb-2">
            <div className="flex items-center">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="px-3 text-xs font-bold text-white/50 uppercase tracking-wider">Commandes</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
          </li>

          {/* My Orders */}
          <li>
            <NavLink to="/orders" className={navLinkClass}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Mes commandes</span>
            </NavLink>
          </li>

          {/* Admin Only Section */}
          {isAdmin() && (
            <>
              {/* Divider */}
              <li className="pt-4 pb-2">
                <div className="flex items-center">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="px-3 text-xs font-bold text-purple-300 uppercase tracking-wider">Administration</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>
              </li>

              {/* Liste des opticiens */}
              <li>
                <NavLink to="/opticiens" className={navLinkClass}>
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Opticiens</span>
                </NavLink>
              </li>

              {/* Validation */}
              <li>
                <NavLink to="/validation" className={navLinkClass}>
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Validation</span>
                </NavLink>
              </li>

              {/* Admin Orders Management */}
              <li>
                <NavLink to="/admin/orders" className={navLinkClass}>
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>Gestion des commandes</span>
                </NavLink>
              </li>
            </>
          )}

          {/* Divider */}
          <li className="pt-4 pb-2">
            <div className="flex items-center">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="px-3 text-xs font-bold text-white/50 uppercase tracking-wider">Statistiques</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
          </li>

          {/* Statistiques */}
          <li>
            <NavLink to="/statistiques" className={navLinkClass}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Statistiques</span>
            </NavLink>
          </li>
        </ul>

        {/* Footer Info */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-300" />
            <div className="relative backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-3 text-base font-bold text-white">Aide & Support</span>
              </div>
              <p className="text-xs text-white/70 mb-3 leading-relaxed">
                Besoin d'aide ? Notre équipe est à votre disposition.
              </p>
              <a
                href="mailto:support@optique.ma"
                className="relative block w-full overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center text-white text-sm font-bold py-2.5 rounded-xl">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contacter le support
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;