import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import api from '../../Api/axios';

interface Image {
  "@id": string;
  "@type": string;
  imageName?: string;
}

interface Owner {
  "@id": string;
  id?: string;
  nom: string;
  prenom: string;
}

interface MontureDetail {
  "@id": string;
  "@type": string;
  id: number;
  name: string;
  description?: string;
  price: number;
  brand?: string;
  stock?: number;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  images: Image[];
  owner: Owner;
}

interface CurrentUser {
  id: string;
  email: string;
  roles: string[];
}

const MontureDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [monture, setMonture] = useState<MontureDetail | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const DESCRIPTION_PREVIEW_LENGTH = 200;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }
    fetchCurrentUser(token);
    fetchMontureDetails(token);
  }, [id, navigate]);

  // Désactiver le scroll quand le lightbox est ouvert
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex]);

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(response.data);
    } catch (err: any) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchMontureDetails = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/montures/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMonture(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des détails');
      console.error('Error fetching monture details:', err);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = (): boolean => {
    if (!currentUser || !monture || !monture.owner) return false;
    const ownerIdFromIri = monture.owner["@id"]?.split('/').pop();
    return currentUser.id === ownerIdFromIri || currentUser.id === monture.owner.id;
  };

  const isAdmin = (): boolean => {
    return currentUser?.roles?.includes('ROLE_ADMIN') || false;
  };

  const isPending = (): boolean => {
    if (!monture?.status) return false;
    return monture.status.toLowerCase() === 'pending';
  };

  const handleEdit = () => {
    navigate(`/montures/${id}/edit`);
  };

  const handleApprove = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir approuver cette monture ?')) {
      return;
    }

    setStatusUpdateLoading(true);
    setStatusMessage('');

    try {
      const token = localStorage.getItem('token');
      await api.patch(`/montures/${id}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatusMessage('Monture approuvée avec succès !');
      if (token) fetchMontureDetails(token);
    } catch (err: any) {
      setStatusMessage('Erreur lors de l\'approbation');
      console.error('Error approving monture:', err);
    } finally {
      setStatusUpdateLoading(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir rejeter cette monture ?')) {
      return;
    }

    setStatusUpdateLoading(true);
    setStatusMessage('');

    try {
      const token = localStorage.getItem('token');
      await api.patch(`/montures/${id}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatusMessage('Monture rejetée');
      if (token) fetchMontureDetails(token);
    } catch (err: any) {
      setStatusMessage('Erreur lors du rejet');
      console.error('Error rejecting monture:', err);
    } finally {
      setStatusUpdateLoading(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const getStatusBadge = (status?: string) => {
    const lowerStatus = status?.toLowerCase();
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

    const statusConfig = config[lowerStatus as keyof typeof config] || config.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full ${statusConfig.bg} ${statusConfig.text} shadow-lg`}>
        {statusConfig.icon}
        {statusConfig.label}
      </span>
    );
  };

  const renderDescription = () => {
    if (!monture?.description) {
      return (
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3 mb-4">
          <p className="text-blue-200/60 text-xs sm:text-sm text-center italic">Aucune description disponible</p>
        </div>
      );
    }

    const description = monture.description;
    const needsReadMore = description.length > DESCRIPTION_PREVIEW_LENGTH;

    if (!needsReadMore) {
      return (
        <p className="text-sm text-white/90 leading-relaxed mb-4 whitespace-pre-line">
          {description}
        </p>
      );
    }

    const displayText = isDescriptionExpanded 
      ? description 
      : description.substring(0, DESCRIPTION_PREVIEW_LENGTH) + '...';

    return (
      <div className="mb-4">
        <p className="text-sm text-white/90 leading-relaxed mb-2 whitespace-pre-line">
          {displayText}
        </p>
        <button
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="inline-flex items-center text-blue-300 hover:text-blue-200 font-bold transition duration-200 group text-xs sm:text-sm"
        >
          {isDescriptionExpanded ? (
            <>
              <span>Voir moins</span>
              <svg 
                className="w-4 h-4 ml-1 transform group-hover:-translate-y-0.5 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Lire la suite</span>
              <svg 
                className="w-4 h-4 ml-1 transform group-hover:translate-y-0.5 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>
    );
  };

// Navigation au clavier
  useEffect(() => {
    if (selectedImageIndex === null || !monture?.images) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedImageIndex(prev => {
          if (prev === null || !monture?.images) return prev;
          return prev === 0 ? monture.images.length - 1 : prev - 1;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedImageIndex(prev => {
          if (prev === null || !monture?.images) return prev;
          return prev === monture.images.length - 1 ? 0 : prev + 1;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, monture?.images]);

  // Composant Lightbox séparé pour le Portal
  const LightboxModal = () => {
    if (selectedImageIndex === null || !monture?.images) return null;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return createPortal(
      <div
        className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto backdrop-blur-sm animate-fadeIn"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedImageIndex(null);
          }
        }}
      >
        <div
          className="relative w-full max-w-5xl my-8"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Bouton Fermer */}
          <button
            onMouseDown={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(null);
            }}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition z-10 shadow-lg hover:scale-110 active:scale-95"
            title="Fermer (Échap)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image principale */}
          <div className="relative">
            <img
              src={`http://127.0.0.1:8000/uploads/images/${monture.images[selectedImageIndex].imageName}`}
              alt={`Full view ${selectedImageIndex + 1}`}
              className="w-full h-auto rounded-xl max-h-[60vh] sm:max-h-[70vh] object-contain shadow-2xl pointer-events-none select-none"
              draggable="false"
            />
            
            {/* Boutons de navigation sur l'image (desktop) */}
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(prev => {
                  if (prev === null || !monture?.images) return prev;
                  return prev === 0 ? monture.images.length - 1 : prev - 1;
                });
              }}
              className="hidden md:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition shadow-lg hover:scale-110 active:scale-95"
              title="Précédent (←)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(prev => {
                  if (prev === null || !monture?.images) return prev;
                  return prev === monture.images.length - 1 ? 0 : prev + 1;
                });
              }}
              className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition shadow-lg hover:scale-110 active:scale-95"
              title="Suivant (→)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Info image */}
          <div 
            className="text-center mt-3 sm:mt-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-2 sm:p-3"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <p className="text-xs sm:text-sm font-bold text-white">
              Image {selectedImageIndex + 1} / {monture.images.length}
            </p>
            <p className="text-xs text-blue-200 mt-1 truncate">
              {monture.images[selectedImageIndex].imageName}
            </p>
          </div>

          {/* Navigation */}
          <div 
            className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-4 gap-2 sm:gap-3"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(prev => {
                  if (prev === null || !monture?.images) return prev;
                  return prev === 0 ? monture.images.length - 1 : prev - 1;
                });
              }}
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black p-2 sm:p-2.5 rounded-lg transition flex items-center justify-center gap-2 shadow-lg font-bold text-xs sm:text-sm hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Précédent
            </button>

            {/* Thumbnails */}
            <div className="flex gap-1.5 sm:gap-2 justify-center flex-wrap max-w-full overflow-x-auto py-1">
              {monture.images.map((image, index) => (
                <button
                  key={index}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(index);
                  }}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden transition flex-shrink-0 ${
                    index === selectedImageIndex 
                      ? 'ring-2 ring-white scale-110' 
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img
                    src={`http://127.0.0.1:8000/uploads/images/${image.imageName}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable="false"
                  />
                </button>
              ))}
            </div>

            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(prev => {
                  if (prev === null || !monture?.images) return prev;
                  return prev === monture.images.length - 1 ? 0 : prev + 1;
                });
              }}
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black p-2 sm:p-2.5 rounded-lg transition flex items-center justify-center gap-2 shadow-lg font-bold text-xs sm:text-sm hover:scale-105 active:scale-95"
            >
              Suivant
              <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>,
      modalRoot
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
              <svg className="animate-spin h-12 w-12 sm:h-16 sm:w-16 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
          <p className="text-base sm:text-lg font-bold text-white">Chargement des détails...</p>
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

  if (error || !monture) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 px-3 sm:px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center max-w-md">
          <div className="relative inline-flex mb-4 sm:mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-xl opacity-40" />
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center shadow-2xl">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white mb-2">Erreur</h3>
          <p className="text-blue-200 text-sm mb-4 sm:mb-6">{error || 'Monture non trouvée'}</p>
          <button
            onClick={() => navigate('/montures')}
            className="relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-5 rounded-lg sm:rounded-xl font-bold shadow-lg group-hover:shadow-2xl transition duration-300 text-sm">
                            Retour à la liste
            </div>
          </button>
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
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 p-3 sm:p-4 lg:p-6">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative w-full z-10">
          {/* Back Button and Edit Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
            <button
              onClick={() => navigate('/montures')}
              className="relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 text-white py-1.5 px-3 rounded-lg font-bold transition duration-300 flex items-center text-sm">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </div>
            </button>

            {isOwner() && (
              <button
                onClick={handleEdit}
                className="relative w-full sm:w-auto group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-1.5 px-4 rounded-lg font-bold shadow-lg group-hover:shadow-2xl transition duration-300 flex items-center justify-center text-sm">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </div>
              </button>
            )}
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="mb-3">
              <div className={`backdrop-blur-xl border-2 rounded-lg p-3 ${
                statusMessage.includes('succès') || statusMessage.includes('approuvée') 
                  ? 'bg-green-500/20 border-green-400/50' 
                  : statusMessage.includes('Erreur')
                  ? 'bg-red-500/20 border-red-400/50'
                  : 'bg-blue-500/20 border-blue-400/50'
              }`}>
                <div className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 flex-shrink-0 ${
                    statusMessage.includes('succès') || statusMessage.includes('approuvée') 
                      ? 'text-green-300' 
                      : statusMessage.includes('Erreur')
                      ? 'text-red-300'
                      : 'text-blue-300'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white font-bold text-xs sm:text-sm">{statusMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid - Full Width 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            
            {/* Left Column - 2/3 width on LG */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              
              {/* Header Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-lg sm:text-xl flex-shrink-0 shadow-lg">
                      {monture.name.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h1 className="text-xl sm:text-2xl font-black text-white truncate">
                          {monture.name}
                        </h1>
                        {getStatusBadge(monture.status)}
                      </div>
                      {monture.brand && (
                        <p className="text-sm sm:text-base text-blue-200 mb-2 font-semibold truncate">
                          {monture.brand}
                        </p>
                      )}
                      <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-1">
                        {monture.price.toFixed(2)} DH
                      </p>
                      {monture.stock !== undefined && (
                        <p className={`text-xs sm:text-sm font-bold ${
                          monture.stock > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {monture.stock > 0 ? `${monture.stock} en stock` : 'Rupture de stock'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Admin Status Control Buttons */}
                  {isAdmin() && isPending() && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <h3 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">
                        Actions admin
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleApprove}
                          disabled={statusUpdateLoading}
                          className="relative group/btn overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                          <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-3 rounded-lg font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {statusUpdateLoading ? 'Traitement...' : 'Approuver'}
                          </div>
                        </button>
                        <button
                          onClick={handleReject}
                          disabled={statusUpdateLoading}
                          className="relative group/btn overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                          <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-3 rounded-lg font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {statusUpdateLoading ? 'Traitement...' : 'Rejeter'}
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 sm:p-5">
                  <h2 className="text-base sm:text-lg font-black text-white mb-3 flex items-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-2 shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Description
                  </h2>

                  {renderDescription()}
                </div>
              </div>

              {/* Images Section */}
              {monture.images && monture.images.length > 0 && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
                  <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 sm:p-5">
                    <h2 className="text-base sm:text-lg font-black text-white mb-3 flex items-center">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mr-2 shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                        </svg>
                      </div>
                      Galerie ({monture.images.length})
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                      {monture.images.map((image, index) => {
                        const imageUrl = `http://127.0.0.1:8000/uploads/images/${image.imageName}`;

                        return (
                          <div
                            key={index}
                            className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden h-24 sm:h-32 group/img cursor-pointer transform hover:scale-105 transition-transform duration-300"
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <img
                              src={imageUrl}
                              alt={image.imageName || `Image ${index + 1}`}
                              className="w-full h-full object-cover group-hover/img:scale-110 transition duration-300"
                              onError={(e) => {
                                (e.currentTarget.parentElement as HTMLElement).innerHTML = `
                                  <div class="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                    <svg class="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                    </svg>
                                  </div>
                                `;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition duration-300 flex items-end justify-center pb-2">
                              <span className="text-white text-xs font-bold">Agrandir</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {(!monture.images || monture.images.length === 0) && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl blur-lg opacity-50" />
                  <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 text-center">
                    <div className="relative inline-flex mb-3">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full blur-xl opacity-40" />
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-2xl">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-blue-200 text-xs sm:text-sm font-semibold">Aucune image disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details - 1/3 width on LG */}
            <div className="lg:col-span-1">
              <div className="relative group lg:sticky lg:top-4">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 sm:p-5">
                  <h2 className="text-base sm:text-lg font-black text-white mb-3 flex items-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-2 shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    Détails
                  </h2>

                  <div className="space-y-3">
                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide block mb-1">Prix</label>
                      <p className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        {monture.price.toFixed(2)} DH
                      </p>
                    </div>

                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide block mb-1">Stock</label>
                      <p className={`text-base font-black ${
                        monture.stock && monture.stock > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {monture.stock !== undefined ? `${monture.stock} unités` : 'Non renseigné'}
                      </p>
                    </div>

                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide block mb-1">Marque</label>
                      <p className="text-sm text-white font-semibold">{monture.brand || 'Non renseigné'}</p>
                    </div>

                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide block mb-1">Date création</label>
                      <p className="text-sm text-white font-semibold">
                        {new Date(monture.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>

                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide block mb-1">Statut</label>
                      <div className="mt-1">
                        {getStatusBadge(monture.status)}
                      </div>
                    </div>

                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide block mb-1">Propriétaire</label>
                      <p className="text-sm text-white font-semibold">
                        {monture.owner.prenom} {monture.owner.nom}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }
        `}</style>
      </div>

      {/* Lightbox Modal - Rendu via Portal */}
      <LightboxModal />
    </>
  );
};

export default MontureDetails;