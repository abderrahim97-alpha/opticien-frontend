import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Api/axios';
import logoImage from '../../assets/opt-Logo.png';

interface CurrentUser {
  id: string;
  email: string;
  roles: string[];
  nom?: string;
  prenom?: string;
  status?: string;
}

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

interface SearchResult {
  type: 'monture' | 'opticien';
  id: string | number;
  name: string;
  subtitle: string;
  price?: number;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const results: SearchResult[] = [];

      const monturesResponse = await api.get('/my-montures', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredMontures = monturesResponse.data.member.filter((monture: any) =>
        monture.name?.toLowerCase().includes(query.toLowerCase()) ||
        monture.brand?.toLowerCase().includes(query.toLowerCase())
      );

      filteredMontures.forEach((monture: any) => {
        results.push({
          type: 'monture',
          id: monture.id,
          name: monture.name,
          subtitle: `${monture.brand || 'Sans marque'} • ${monture.price?.toFixed(2) || 0} MAD`,
          price: monture.price,
        });
      });

      if (isAdmin()) {
        const opticiensResponse = await api.get('/my-opticiens', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredOpticiens = opticiensResponse.data.member.filter((opticien: any) =>
          opticien.nom?.toLowerCase().includes(query.toLowerCase()) ||
          opticien.prenom?.toLowerCase().includes(query.toLowerCase()) ||
          opticien.companyName?.toLowerCase().includes(query.toLowerCase()) ||
          opticien.email?.toLowerCase().includes(query.toLowerCase())
        );

        filteredOpticiens.forEach((opticien: any) => {
          let opticienId = opticien.id;
          
          if (!opticienId && opticien['@id']) {
            opticienId = opticien['@id'].split('/').pop();
          }

          results.push({
            type: 'opticien',
            id: opticienId,
            name: `${opticien.prenom} ${opticien.nom}`,
            subtitle: opticien.companyName || opticien.email,
          });
        });
      }

      setSearchResults(results);
    } catch (err) {
      console.error('Error searching:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setShowSearchResults(false);
    setSearchQuery('');
    
    try {
      if (result.type === 'monture') {
        navigate(`/montures/${result.id}`);
      } else {
        let opticienId: string | number = result.id;
        
        if (typeof result.id === 'string' && result.id.includes('/')) {
          const parts = result.id.split('/');
          opticienId = parts[parts.length - 1];
        }
        
        navigate(`/opticiens/${opticienId}`);
      }
    } catch (error) {
      console.error('Erreur de navigation:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const isAdmin = () => {
    return user?.roles?.includes('ROLE_ADMIN');
  };

  const getUserInitials = () => {
    if (user?.prenom && user?.nom) {
      return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    if (user?.prenom && user?.nom) {
      return `${user.prenom} ${user.nom}`;
    }
    return user?.email || 'Utilisateur';
  };

  const getResultIcon = (type: 'monture' | 'opticien') => {
    if (type === 'monture') {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    }
  };

  const getResultBadge = (type: 'monture' | 'opticien') => {
    if (type === 'monture') {
      return <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-bold shadow-lg">Monture</span>;
    } else {
      return <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold shadow-lg">Opticien</span>;
    }
  };

  return (
    <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 fixed w-full z-20 top-0 shadow-lg">
      <div className="h-20 px-4 lg:pl-72 lg:pr-6 flex items-center justify-between">
        
        {/* Left Side */}
        <div className="flex items-center gap-3 flex-1">
          {/* Toggle Button - Mobile Only */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden inline-flex items-center justify-center p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path 
                fillRule="evenodd" 
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>

          {/* Logo Mobile */}
          <a 
            href="/dashboard" 
            className="lg:hidden flex items-center group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition duration-300" />
              <div className="relative w-10 h-10 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src={logoImage} 
                  alt="Optique Marketplace Logo" 
                  className="w-7 h-7 object-contain drop-shadow-lg"
                />
              </div>
            </div>
            <span className="ml-2 text-lg font-black text-white">
              Opti<span className="text-blue-300">MAROC</span>
            </span>
          </a>

          {/* Search Bar - Desktop & Mobile */}
          <div className="hidden sm:block flex-1 max-w-xl ml-4 lg:ml-8 relative">
            <div className="relative group">
              <input
                type="text"
                placeholder={isAdmin() ? "Rechercher une monture ou un opticien..." : "Rechercher une monture..."}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                className="w-full px-5 py-3 pl-12 pr-12 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-white/50 group-focus-within:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              {/* Loading spinner */}
              {isSearching && (
                <div className="absolute right-12 top-3.5">
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {/* Clear button */}
              {searchQuery && !isSearching && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSearchResults(false);
                  }}
                  className="absolute right-4 top-3.5 text-white/50 hover:text-white transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl py-2 max-h-96 overflow-y-auto z-50">
                {searchResults.length === 0 && !isSearching ? (
                  <div className="py-12 text-center">
                    <svg className="w-12 h-12 mx-auto text-white/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-sm text-white/70 font-semibold">Aucun résultat pour "{searchQuery}"</p>
                  </div>
                ) : (
                  <>
                    {searchResults.length > 0 && (
                      <div className="px-4 py-2 text-xs font-bold text-blue-200 uppercase border-b border-white/10 sticky top-0 backdrop-blur-xl bg-white/5">
                        {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
                      </div>
                    )}
                    {searchResults.map((result, index) => (
                      <button
                        key={`${result.type}-${result.id}-${index}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center gap-3 transition-all duration-200"
                      >
                        {getResultIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold text-white truncate">{result.name}</p>
                            {getResultBadge(result.type)}
                          </div>
                          <p className="text-xs text-white/60 truncate">{result.subtitle}</p>
                        </div>
                        <svg className="w-5 h-5 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Search Icon Mobile */}
          <button 
            className="sm:hidden p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-all"
            onClick={() => {
              alert('Recherche mobile - À implémenter si besoin');
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Admin Badge */}
          {isAdmin() && (
            <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50">
              <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path 
                  fillRule="evenodd" 
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
              Admin
            </span>
          )}

          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-all"
              aria-label="User menu"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/50">
                {getUserInitials()}
              </div>
              <div className="hidden lg:block text-left mr-1">
                <p className="text-sm font-bold text-white leading-tight">{getUserDisplayName()}</p>
                <p className="text-xs text-white/60 leading-tight">
                  {isAdmin() ? 'Administrateur' : 'Opticien'}
                </p>
              </div>
              <svg className="hidden lg:block w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-4 py-3 border-b border-white/10 lg:hidden">
                  <p className="text-sm font-bold text-white truncate">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-white/70 truncate mt-0.5">
                    {user?.email}
                  </p>
                  {user?.status && (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold mt-2 ${
                      user.status.toLowerCase() === 'approved' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                        : user.status.toLowerCase() === 'pending'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                    }`}>
                      {user.status}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/dashboard');
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 flex items-center transition-all font-semibold"
                >
                  <svg 
                    className="w-5 h-5 mr-3 text-white/70 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                    />
                  </svg>
                  Tableau de bord
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/ProfileSettings');
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 flex items-center transition-all font-semibold"
                >
                  <svg 
                    className="w-5 h-5 mr-3 text-white/70 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 ThisExpressionIsNotCallable.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                  Paramètres du compte
                </button>

                <div className="border-t border-white/10 my-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-red-500/20 flex items-center transition-all font-bold"
                >
                  <svg 
                    className="w-5 h-5 mr-3 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlays */}
      {(showUserMenu || showSearchResults) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowSearchResults(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;