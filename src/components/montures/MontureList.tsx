import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/axios";

interface Image {
  "@id": string;
  "@type": string;
  imageName?: string;
}

interface Monture {
  "@id": string;
  "@type": string;
  id: number;
  name: string;
  description?: string;
  price: number;
  brand?: string;
  stock?: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
  images: Image[];
  owner: {
    "@id": string;
    nom: string;
    prenom: string;
  };
}

const MontureList: React.FC = () => {
  const navigate = useNavigate();
  const [montures, setMontures] = useState<Monture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredMontures, setFilteredMontures] = useState<Monture[]>([]);
  const [filterBrand, setFilterBrand] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    fetchMontures(token);
  }, [navigate]);

  useEffect(() => {
    const filtered = montures.filter((monture) => {
      const matchesSearch =
        monture.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monture.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monture.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand = !filterBrand || monture.brand === filterBrand;
      return matchesSearch && matchesBrand;
    });

    setFilteredMontures(filtered);
  }, [searchTerm, filterBrand, montures]);

  const fetchMontures = async (token: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/my-montures", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Montures response:", response.data.member);

      const mappedMontures =
        (response.data.member || []).map((m: any) => ({
          ...m,
          status: m.status || "pending",
        })) ?? [];

      setMontures(mappedMontures);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erreur lors du chargement des montures"
      );
      console.error("Error fetching montures:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette monture ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/montures/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMontures((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
    const config = {
      approved: {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
        text: 'text-white',
        label: 'Approuvée',
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
        label: 'Rejetée',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ),
      },
    };

    const statusConfig = config[status];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full ${statusConfig.bg} ${statusConfig.text} shadow-lg`}>
        {statusConfig.icon}
        {statusConfig.label}
      </span>
    );
  };

  const uniqueBrands = Array.from(
    new Set(montures.map((m) => m.brand).filter(Boolean))
  );

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
          <p className="text-lg font-bold text-white">Chargement des montures...</p>
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
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1">
              Mes Montures
            </h1>
            <p className="text-blue-200 text-sm sm:text-base lg:text-lg">
              Gérez vos montures à vendre
            </p>
          </div>
          <button
            onClick={() => navigate("/montures/create")}
            className="relative w-full sm:w-auto group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl font-bold shadow-lg group-hover:shadow-2xl transition duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Ajouter une monture</span>
              <span className="sm:hidden">Ajouter</span>
            </div>
          </button>
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

        {/* Search and Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Search Input */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl">
              <div className="relative">
                <svg className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-4 py-2.5 sm:py-3 bg-transparent text-white placeholder-blue-200/60 focus:outline-none text-sm sm:text-base font-medium"
                />
              </div>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl">
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 bg-transparent text-white focus:outline-none text-sm sm:text-base font-medium cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.5em 1.5em',
                }}
              >
                <option value="" className="bg-slate-800 text-white">Toutes les marques</option>
                {uniqueBrands.map((brand) => (
                  <option key={brand} value={brand} className="bg-slate-800 text-white">
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-blue-200 text-xs sm:text-sm font-semibold">
            <span className="text-white font-black">{filteredMontures.length}</span> monture{filteredMontures.length !== 1 ? 's' : ''} / <span className="text-white font-black">{montures.length}</span>
          </p>
        </div>

        {/* Montures Grid */}
        {filteredMontures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filteredMontures.map((monture) => (
              <div key={monture.id} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
                  {/* Image */}
                  {monture.images && monture.images.length > 0 ? (
                    <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                      <img
                        src={`http://127.0.0.1:8000/uploads/images/${monture.images[0].imageName}`}
                        alt={monture.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onError={(e) => {
                          (e.currentTarget.parentElement as HTMLElement).innerHTML = `
                            <div class='w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center'>
                              <svg class='w-12 h-12 sm:w-16 sm:h-16 text-gray-500' fill='currentColor' viewBox='0 0 20 20'>
                                <path d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' />
                              </svg>
                            </div>`;
                        }}
                      />
                      {monture.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                          +{monture.images.length - 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                      </svg>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base sm:text-lg lg:text-xl font-black text-white flex-1 line-clamp-2">
                        {monture.name}
                      </h3>
                    </div>

                    {monture.brand && (
                      <p className="text-blue-200 text-xs sm:text-sm font-semibold mb-2">
                        {monture.brand}
                      </p>
                    )}

                    {/* Status Badge */}
                    <div className="mb-3">
                      {getStatusBadge(monture.status)}
                    </div>

                    {monture.description && (
                      <p className="text-white/70 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
                        {monture.description}
                      </p>
                    )}

                    {/* Price and Stock */}
                    <div className="mb-3 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            {monture.price.toFixed(2)} DH
                          </p>
                          {monture.stock !== undefined && (
                            <p className={`text-xs font-bold mt-1 ${
                              monture.stock > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}>
                              {monture.stock > 0
                                ? `${monture.stock} en stock`
                                : "Rupture de stock"}
                            </p>
                          )}
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <p className="text-blue-200/60 text-xs mb-4">
                      Créé le {new Date(monture.createdAt).toLocaleDateString("fr-FR")}
                    </p>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button
                        onClick={() => navigate(`/montures/${monture.id}`)}
                        className="relative group/btn overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-3 rounded-lg font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 flex items-center justify-center text-xs sm:text-sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Voir
                        </div>
                      </button>
                      <button
                        onClick={() => handleDelete(monture.id)}
                        className="relative group/btn overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                        <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-3 rounded-lg font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 flex items-center justify-center text-xs sm:text-sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Supprimer
                        </div>
                      </button>
                    </div>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              Aucune monture trouvée
            </h3>
            <p className="text-blue-200 text-sm sm:text-base lg:text-lg mb-6">
              {searchTerm || filterBrand 
                ? "Essayez avec d'autres critères de recherche"
                : "Vous n'avez pas encore créé de monture"}
            </p>
            <button
              onClick={() => navigate("/montures/create")}
              className="relative inline-block group/btn overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
              <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 flex items-center gap-2 text-sm sm:text-base">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Créer une monture
              </div>
            </button>
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

export default MontureList;