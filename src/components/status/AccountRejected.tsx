import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Api/axios';

interface UserProfile {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  status: string;
}

const AccountRejected: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkUserStatus();
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

      // Si le statut n'est plus "rejected", rediriger
      if (user.status?.toLowerCase() === 'approved') {
        navigate('/dashboard', { replace: true });
      } else if (user.status?.toLowerCase() === 'pending') {
        navigate('/pending-approval', { replace: true });
      }
    } catch (err) {
      console.error('Error checking user status:', err);
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@optique.ma?subject=Demande de révision de compte';
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative text-center">
          <svg className="animate-spin h-12 w-12 sm:h-16 sm:w-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
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
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden">
            
            {/* Alert Header with Icon */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-500/30 to-orange-500/30 backdrop-blur-sm border-b border-white/20 px-4 sm:px-8 py-6 sm:py-8">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <svg className="relative w-16 h-16 sm:w-20 sm:h-20 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-8 py-6 sm:py-10">
              <div className="text-center mb-6 sm:mb-8 animate-fadeIn">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-4">
                  Compte refusé
                </h1>
                <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-sm bg-red-500/20 border border-red-400/50 text-red-200 font-bold mb-4 sm:mb-6 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Statut : Rejeté
                </div>
                <p className="text-base sm:text-lg text-blue-200">
                  Bonjour <span className="font-bold text-white">{userProfile?.prenom} {userProfile?.nom}</span>,
                </p>
              </div>

              {/* Main Message */}
              <div className="backdrop-blur-xl bg-red-500/20 border-l-4 border-red-400 rounded-r-lg p-4 sm:p-6 mb-6 sm:mb-8 animate-fadeIn">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm sm:text-base font-bold text-red-200 mb-2 sm:mb-3">
                      Votre demande de création de compte a été refusée
                    </h3>
                    <div className="text-xs sm:text-sm text-red-100">
                      <p className="mb-3">
                        Malheureusement, nous ne pouvons pas approuver votre compte pour le moment. 
                        Cette décision peut être due à plusieurs raisons :
                      </p>
                      <ul className="list-disc list-inside space-y-1 mb-3">
                        <li>Informations incomplètes ou incorrectes</li>
                        <li>Documents justificatifs manquants ou non valides</li>
                        <li>Non-conformité avec nos critères d'éligibilité</li>
                        <li>Informations professionnelles non vérifiables</li>
                      </ul>
                      <p className="font-bold">
                        Un email détaillant les raisons spécifiques vous a été envoyé à l'adresse : 
                        <span className="text-white ml-1">{userProfile?.email}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to do next */}
              <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-400/50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 animate-fadeIn">
                <h3 className="text-base sm:text-lg font-black text-white mb-3 sm:mb-4 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Que faire maintenant ?
                </h3>
                <div className="space-y-3 text-xs sm:text-sm text-blue-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold">1</span>
                    </div>
                    <p className="ml-3 flex-1">
                      <strong className="text-white">Consultez votre email</strong> pour comprendre les raisons précises du refus
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold">2</span>
                    </div>
                    <p className="ml-3 flex-1">
                      <strong className="text-white">Vérifiez et corrigez</strong> les informations manquantes ou incorrectes
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold">3</span>
                    </div>
                    <p className="ml-3 flex-1">
                      <strong className="text-white">Contactez notre support</strong> si vous pensez qu'il s'agit d'une erreur
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold">4</span>
                    </div>
                    <p className="ml-3 flex-1">
                      <strong className="text-white">Créez un nouveau compte</strong> avec les informations correctes
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 animate-fadeIn">
                {/* Contact Support Button */}
                <button
                  onClick={handleContactSupport}
                  className="relative group/btn overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                  <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 flex items-center justify-center text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contacter le support
                  </div>
                </button>

                {/* Create New Account Button */}
                <button
                  onClick={() => navigate('/register')}
                  className="relative group/btn overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                  <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 flex items-center justify-center text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Créer un nouveau compte
                  </div>
                </button>
              </div>

              {/* Contact Info */}
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 animate-fadeIn">
                <h3 className="text-base sm:text-lg font-black text-white mb-3 sm:mb-4">Besoin d'assistance ?</h3>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:support@optique.ma" className="text-blue-300 hover:text-blue-200 font-bold transition duration-200">
                      support@optique.ma
                    </a>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-blue-200 font-semibold">+212 5XX-XXXXXX</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-white font-bold">Heures d'ouverture</p>
                      <p className="text-blue-200">Lundi - Vendredi : 9h00 - 18h00</p>
                      <p className="text-blue-200">Samedi : 9h00 - 13h00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout Button at Bottom */}
              <div className="mt-6 sm:mt-8 pt-6 border-t border-white/20 text-center animate-fadeIn">
                <button
                  onClick={handleLogout}
                  className="group inline-flex items-center text-blue-200 hover:text-white font-bold transition duration-200 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Se déconnecter et retourner à la page de connexion
                </button>
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

export default AccountRejected;