import React, { useState, useEffect } from 'react';
import api from '../../Api/axios';
import { useNavigate } from 'react-router-dom';

interface Image {
  "@id": string;
  "@type": string;
  imageName?: string;
}

interface Opticien {
  "@id": string;
  "@type": string;
  nom: string;
  prenom: string;
  telephone: string;
  city: string;
  status?: string;
  images: Image[];
  adresse?: string;
  companyName?: string;
  ICE?: string;
}

const OpticienList: React.FC = () => {
  const [opticiens, setOpticiens] = useState<Opticien[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredOpticiens, setFilteredOpticiens] = useState<Opticien[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }
    fetchOpticiens(token);
  }, []);

  useEffect(() => {
    const filtered = opticiens.filter(
      (opticien) =>
        opticien.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opticien.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opticien.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opticien.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
    setFilteredOpticiens(filtered);
  }, [searchTerm, opticiens]);

  const fetchOpticiens = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/opticiens', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpticiens(response.data.member || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des opticiens');
      console.error('Error fetching opticiens:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    const lowerStatus = status?.toLowerCase();
    const config = {
      approved: {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
        text: 'text-white',
        label: 'Approuvé',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ),
      },
      pending: {
        bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        text: 'text-white',
        label: 'En attente',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        ),
      },
      rejected: {
        bg: 'bg-gradient-to-r from-red-500 to-pink-500',
        text: 'text-white',
        label: 'Rejeté',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ),
      },
    };

    const statusConfig = config[lowerStatus as keyof typeof config] || config.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full ${statusConfig.bg} ${statusConfig.text} shadow-lg`}>
        {statusConfig.icon}
        {statusConfig.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative text-center z-10">
          <div className="relative inline-flex mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="relative">
              <svg className="animate-spin h-16 w-16 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-bold text-white">Chargement des opticiens...</p>
        </div>

        <style>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-[1600px] mx-auto z-10">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1">Nos Opticiens</h1>
          <p className="text-blue-200 text-sm sm:text-base lg:text-lg">
            Découvrez nos partenaires opticiens dans votre région
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6">
            <div className="backdrop-blur-xl bg-white/10 border-2 border-red-400/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-300 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white text-sm sm:text-base lg:text-lg font-semibold">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar + Results Count */}
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl">
              <div className="relative">
                <svg className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-3.5 bg-transparent text-white placeholder-blue-200/60 focus:outline-none text-sm sm:text-base lg:text-lg font-medium"
                />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div>
            <p className="text-blue-200 text-xs sm:text-sm font-semibold">
              <span className="text-white font-black">{filteredOpticiens.length}</span> résultat{filteredOpticiens.length !== 1 ? 's' : ''} / <span className="text-white font-black">{opticiens.length}</span>
            </p>
          </div>
        </div>

        {/* Opticiens Grid */}
        {filteredOpticiens.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filteredOpticiens.map((opticien) => (
              <div key={opticien["@id"]} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    {/* Profile Section */}
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-base sm:text-xl flex-shrink-0 shadow-lg">
                        {opticien.prenom.charAt(0)}{opticien.nom.charAt(0)}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg lg:text-xl font-black text-white mb-1 truncate">
                          {opticien.prenom} {opticien.nom}
                        </h3>
                        {opticien.companyName && (
                          <p className="text-blue-200 text-xs sm:text-sm font-semibold mb-2 truncate">{opticien.companyName}</p>
                        )}
                        {/* Status Badge */}
                        <div>
                          {getStatusBadge(opticien.status)}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2.5 mb-4 flex-1">
                      {/* City */}
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="ml-2.5 text-white/90 font-medium text-xs sm:text-sm truncate">{opticien.city}</span>
                      </div>

                      {/* Phone */}
                      {opticien.telephone && (
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <a href={`tel:${opticien.telephone}`} className="ml-2.5 text-blue-200 hover:text-white font-medium transition duration-200 text-xs sm:text-sm truncate">
                            {opticien.telephone}
                          </a>
                        </div>
                      )}

                      {/* Address */}
                      {opticien.adresse && (
                        <div className="flex items-start">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          <span className="ml-2.5 text-white/90 font-medium leading-relaxed text-xs sm:text-sm line-clamp-2">{opticien.adresse}</span>
                        </div>
                      )}

                      {/* ICE Number */}
                      {opticien.ICE && (
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                          </div>
                          <span className="ml-2.5 text-white/90 font-medium text-xs sm:text-sm truncate">ICE: {opticien.ICE}</span>
                        </div>
                      )}
                    </div>

                    {/* Images Count */}
                    {opticien.images && opticien.images.length > 0 && (
                      <div className="mb-3 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2 sm:p-2.5 flex items-center">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                          </svg>
                        </div>
                        <span className="ml-2 text-blue-200 text-xs sm:text-sm font-semibold">
                          {opticien.images.length} image{opticien.images.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    {/* View Button */}
                    <button 
                      onClick={() => navigate(`/opticiens/${opticien["@id"].split('/').pop()}`)}
                      className="relative w-full group/btn overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 sm:py-2.5 px-4 rounded-lg sm:rounded-xl font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 flex items-center justify-center text-xs sm:text-sm">
                        <span>Voir les détails</span>
                        <svg className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
            <div className="relative inline-flex mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full blur-xl opacity-40" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-2xl">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Aucun résultat trouvé</h3>
            <p className="text-blue-200 text-sm sm:text-base lg:text-lg">Essayez avec d'autres termes de recherche</p>
          </div>
        )}
      </div>

      {/* Additional CSS for animations */}
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
      `}</style>
    </div>
  );
};

export default OpticienList;