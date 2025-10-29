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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-right mb-6">
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800 font-medium transition"
          >
            Se déconnecter
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Alert Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
            <div className="flex items-center justify-center">
              <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Compte refusé
              </h1>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 font-medium mb-6">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Statut : Rejeté
              </div>
              <p className="text-lg text-gray-700 mb-2">
                Bonjour <span className="font-semibold">{userProfile?.prenom} {userProfile?.nom}</span>,
              </p>
            </div>

            {/* Main Message */}
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Votre demande de création de compte a été refusée
                  </h3>
                  <div className="text-sm text-red-700">
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
                    <p className="font-medium">
                      Un email détaillant les raisons spécifiques vous a été envoyé à l'adresse : 
                      <span className="font-bold ml-1">{userProfile?.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What to do next */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Que faire maintenant ?
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">1</span>
                  </div>
                  <p className="ml-3 flex-1">
                    <strong>Consultez votre email</strong> pour comprendre les raisons précises du refus
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">2</span>
                  </div>
                  <p className="ml-3 flex-1">
                    <strong>Vérifiez et corrigez</strong> les informations manquantes ou incorrectes
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">3</span>
                  </div>
                  <p className="ml-3 flex-1">
                    <strong>Contactez notre support</strong> si vous pensez qu'il s'agit d'une erreur
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">4</span>
                  </div>
                  <p className="ml-3 flex-1">
                    <strong>Créez un nouveau compte</strong> avec les informations correctes
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleContactSupport}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contacter le support
              </button>

              <button
                onClick={() => navigate('/register')}
                className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Créer un nouveau compte
              </button>
            </div>

            {/* Contact Info */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Besoin d'assistance ?</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:support@optique.ma" className="text-blue-600 hover:text-blue-700 font-medium">
                    support@optique.ma
                  </a>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">+212 5XX-XXXXXX</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-700 font-medium">Heures d'ouverture</p>
                    <p className="text-sm text-gray-600">Lundi - Vendredi : 9h00 - 18h00</p>
                    <p className="text-sm text-gray-600">Samedi : 9h00 - 13h00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 font-medium transition inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Se déconnecter et retourner à la page de connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountRejected;