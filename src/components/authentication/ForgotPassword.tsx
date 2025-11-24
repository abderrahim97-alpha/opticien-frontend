import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Api/axios';
import logoImage from '../../assets/opt-Logo.png';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/password/forgot', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Logo + Title Section */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition duration-500 animate-pulse" />
            <div className="relative w-32 h-32 bg-white/10 backdrop-blur-md border-4 border-white/30 rounded-full flex items-center justify-center shadow-2xl transform transition-transform duration-300 hover:scale-110">
              <img 
                src={logoImage} 
                alt="Optique Marketplace Logo" 
                className="w-24 h-24 object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-6xl font-black text-white tracking-tight drop-shadow-lg leading-none">
              Optique<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">MP</span>
            </h1>
            <p className="text-blue-200 text-base font-semibold mt-2">Réinitialisation du mot de passe</p>
          </div>
        </div>

        {/* Form Card with Glassmorphism */}
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl opacity-20 blur-xl" />
          
          <div className="relative">
            {!message ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-4 shadow-lg shadow-yellow-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Mot de passe oublié ?</h2>
                  <p className="text-blue-200">Entrez votre email pour recevoir un lien de réinitialisation</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-bold text-white/90 uppercase tracking-wide">
                      Adresse email
                    </label>
                    <div className="relative group">
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="relative overflow-hidden bg-red-500/20 backdrop-blur-sm border-2 border-red-400/50 rounded-2xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="p-1 bg-red-500/30 rounded-lg">
                            <svg className="w-4 h-4 text-red-200" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-red-100 flex-1">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <span className="relative flex items-center justify-center px-8 py-4 text-white font-bold text-lg tracking-wide disabled:opacity-60">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Envoyer le lien
                          <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </form>

                <div className="mt-6 bg-yellow-500/20 backdrop-blur-sm border-2 border-yellow-400/30 rounded-2xl p-5">
                  <h3 className="font-bold text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Que va-t-il se passer ?
                  </h3>
                  <ul className="text-sm text-yellow-100 space-y-1.5 ml-7">
                    <li>• Vous recevrez un email avec un lien sécurisé</li>
                    <li>• Le lien expire après 1 heure</li>
                    <li>• Vérifiez votre boîte spam si nécessaire</li>
                  </ul>
                </div>
              </>
            ) : (
              /* Success Message */
              <div className="text-center py-6">
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-60 animate-pulse" />
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-2xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-3">Email envoyé !</h3>
                <p className="text-blue-200 text-lg mb-6">{message}</p>
                
                <div className="bg-green-500/20 backdrop-blur-sm border-2 border-green-400/30 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-green-100">
                    ✓ Vérifiez votre boîte de réception et vos spams
                  </p>
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-8 pt-6 border-t-2 border-white/10">
              <Link
                to="/"
                className="flex items-center justify-center text-sm text-blue-300 hover:text-blue-200 font-bold transition-colors duration-200 hover:underline underline-offset-4 decoration-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/40 text-sm font-medium">
            © {new Date().getFullYear()} Optique Marketplace. Tous droits réservés.
          </p>
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
      `}</style>
    </div>
  );
};

export default ForgotPassword;