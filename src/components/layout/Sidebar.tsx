import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../Api/axios';

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
    `flex items-center p-3 text-base font-medium rounded-lg transition duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-center border-b border-gray-200 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <a 
            href="/dashboard" 
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                />
              </svg>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">
              Optique <span className="text-blue-600">Pro</span>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Tableau de bord</span>
              </NavLink>
            </li>

            {/* Divider */}
            <li className="pt-4 pb-2">
              <div className="flex items-center">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="px-3 text-xs font-semibold text-gray-500 uppercase">Montures</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
            </li>

            {/* Liste des montures */}
            <li>
              <NavLink to="/montures" className={navLinkClass}>
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Liste des montures</span>
              </NavLink>
            </li>

            {/* Ajouter monture */}
            <li>
              <NavLink to="/montureform" className={navLinkClass}>
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Ajouter une monture</span>
              </NavLink>
            </li>

            {/* 🆕 Orders Divider */}
            <li className="pt-4 pb-2">
              <div className="flex items-center">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="px-3 text-xs font-semibold text-gray-500 uppercase">Commandes</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
            </li>

            {/* 🆕 My Orders (Opticien) */}
            <li>
              <NavLink to="/orders" className={navLinkClass}>
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="px-3 text-xs font-semibold text-gray-500 uppercase">Administration</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                </li>

                {/* Liste des opticiens */}
                <li>
                  <NavLink to="/opticiens" className={navLinkClass}>
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Opticiens</span>
                  </NavLink>
                </li>

                {/* Validation */}
                <li>
                  <NavLink to="/validation" className={navLinkClass}>
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Validation</span>
                  </NavLink>
                </li>

                {/* 🆕 Admin Orders Management */}
                <li>
                  <NavLink to="/admin/orders" className={navLinkClass}>
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span>Gestion des commandes</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* Divider */}
            <li className="pt-4 pb-2">
              <div className="flex items-center">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="px-3 text-xs font-semibold text-gray-500 uppercase">Statistiques</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
            </li>

            {/* Statistiques */}
            <li>
              <NavLink to="/statistiques" className={navLinkClass}>
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Statistiques</span>
              </NavLink>
            </li>
          </ul>

          {/* Footer Info */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-blue-900">Aide & Support</span>
              </div>
              <p className="text-xs text-blue-700 mb-3">
                Besoin d'aide ? Consultez notre documentation.
              </p>
              <a
                href="mailto:support@optique.ma"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg transition"
              >
                Contacter le support
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;