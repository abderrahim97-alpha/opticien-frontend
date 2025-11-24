import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Api/axios';

interface UserProfile {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  city?: string;
  status: string;
  companyName?: string;
  adresse?: string;
  ICE?: string;
}

const PendingApproval: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    telephone: '',
    city: '',
    adresse: '',
    companyName: '',
    ICE: '',
  });

  useEffect(() => {
    checkUserStatus();
    const interval = setInterval(checkUserStatus, 30000); // Vérifier toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  const checkUserStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      const response = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data;
      setUserProfile(user);

      // Si le statut change, rediriger
      if (user.status?.toLowerCase() === 'approved') {
        navigate('/dashboard', { replace: true });
      } else if (user.status?.toLowerCase() === 'rejected') {
        navigate('/account-rejected', { replace: true });
      }

      // Initialiser le formulaire avec les données existantes
      setFormData({
        telephone: user.telephone || '',
        city: user.city || '',
        adresse: user.adresse || '',
        companyName: user.companyName || '',
        ICE: user.ICE || '',
      });
    } catch (err) {
      console.error('Error checking user status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await api.put(`/opticiens/${userProfile?.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Profil mis à jour avec succès !');
      setIsEditing(false);
      checkUserStatus();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative text-center">
          <svg className="animate-spin h-12 w-12 sm:h-16 sm:w-16 text-yellow-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-blue-200 font-bold text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 p-4 sm:p-6 lg:py-12">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-5xl mx-auto z-10">
        {/* Header - Logout Button */}
        <div className="text-right mb-4 sm:mb-6">
          <button
            onClick={handleLogout}
            className="relative group overflow-hidden inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 text-white py-2 px-4 sm:px-6 rounded-lg font-bold transition duration-300 flex items-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Se déconnecter
            </div>
          </button>
        </div>

        {/* Main Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden">
            
            {/* Alert Header with Animated Clock Icon */}
            <div className="relative overflow-hidden bg-gradient-to-r from-yellow-500/30 to-orange-500/30 backdrop-blur-sm border-b border-white/20 px-4 sm:px-8 py-6 sm:py-8">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <svg className="relative w-16 h-16 sm:w-20 sm:h-20 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-8 py-6 sm:py-10">
              <div className="text-center mb-6 sm:mb-8 animate-fadeIn">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-4">
                  Compte en attente de validation
                </h1>
                <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-sm bg-yellow-500/20 border border-yellow-400/50 text-yellow-200 font-bold mb-4 sm:mb-6 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Statut : En attente
                </div>
                <p className="text-base sm:text-lg text-blue-200 mb-4">
                  Bonjour <span className="font-bold text-white">{userProfile?.prenom} {userProfile?.nom}</span>,
                </p>
                <p className="text-sm sm:text-base text-blue-200/90 leading-relaxed max-w-2xl mx-auto">
                  Votre compte a été créé avec succès et est actuellement en cours de vérification par notre équipe administrative. 
                  Vous recevrez un email de confirmation dès que votre compte sera validé.
                </p>
              </div>

              {/* Info Box */}
              <div className="backdrop-blur-xl bg-blue-500/20 border-l-4 border-blue-400 rounded-r-lg p-4 sm:p-6 mb-6 sm:mb-8 animate-fadeIn">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm sm:text-base font-bold text-blue-200 mb-2">Informations importantes</h3>
                    <div className="text-xs sm:text-sm text-blue-100 space-y-1">
                      <p>✓ Un email de confirmation vous a été envoyé</p>
                      <p>✓ La vérification peut prendre jusqu'à 48 heures</p>
                      <p>✓ Vous pouvez mettre à jour vos informations ci-dessous</p>
                      <p>✓ Cette page se mettra à jour automatiquement</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Section */}
              <div className="backdrop-blur-sm bg-white/5 border-t border-white/10 rounded-lg p-4 sm:p-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-white">Mes informations</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="relative group/btn overflow-hidden w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-lg font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 flex items-center justify-center text-sm">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </div>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                          Nom de l'entreprise
                        </label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                          className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                          Ville
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                          ICE
                        </label>
                        <input
                          type="text"
                          value={formData.ICE}
                          onChange={(e) => setFormData({ ...formData, ICE: e.target.value })}
                          className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                          Adresse
                        </label>
                        <input
                          type="text"
                          value={formData.adresse}
                          onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                          className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="relative group/btn overflow-hidden flex-1"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg blur opacity-50 group-hover/btn:opacity-75 transition duration-300" />
                        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 text-white py-2 sm:py-2.5 px-4 rounded-lg font-bold transition duration-300 text-sm sm:text-base text-center">
                          Annuler
                        </div>
                      </button>
                      <button
                        type="submit"
                        className="relative group/btn overflow-hidden flex-1"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 sm:py-2.5 px-4 rounded-lg font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 text-sm sm:text-base text-center">
                          Enregistrer
                        </div>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide">Email</label>
                      <p className="text-sm sm:text-base text-white font-semibold mt-1">{userProfile?.email}</p>
                    </div>
                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide">Nom complet</label>
                      <p className="text-sm sm:text-base text-white font-semibold mt-1">{userProfile?.prenom} {userProfile?.nom}</p>
                    </div>
                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide">Entreprise</label>
                      <p className="text-sm sm:text-base text-white font-semibold mt-1">{formData.companyName || 'Non renseigné'}</p>
                    </div>
                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide">Téléphone</label>
                      <p className="text-sm sm:text-base text-white font-semibold mt-1">{formData.telephone || 'Non renseigné'}</p>
                    </div>
                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide">Ville</label>
                      <p className="text-sm sm:text-base text-white font-semibold mt-1">{formData.city || 'Non renseigné'}</p>
                    </div>
                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide">ICE</label>
                      <p className="text-sm sm:text-base text-white font-semibold mt-1">{formData.ICE || 'Non renseigné'}</p>
                    </div>
                    <div className="sm:col-span-2 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-xs font-bold text-blue-200 uppercase tracking-wide">Adresse</label>
                      <p className="text-sm sm:text-base text-white font-semibold mt-1">{formData.adresse || 'Non renseigné'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Help Section */}
              <div className="mt-6 sm:mt-8 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 animate-fadeIn">
                <h3 className="text-base sm:text-lg font-black text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Besoin d'aide ?
                </h3>
                <p className="text-xs sm:text-sm text-blue-200 mb-4">
                  Si vous avez des questions concernant la validation de votre compte, n'hésitez pas à nous contacter.
                </p>
                <a
                  href="mailto:support@optique.ma"
                  className="inline-flex items-center text-blue-300 hover:text-blue-200 font-bold transition duration-200 text-sm group"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@optique.ma
                </a>
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PendingApproval;