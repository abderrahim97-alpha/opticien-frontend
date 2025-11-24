import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Api/axios';
import logoImage from '../../assets/opt-Logo.png';

interface LoginData {
  email: string;
  password: string;
}

interface UserProfile {
  roles?: string[];
  role?: string | string[];
  status?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/login_check', formData);
      const token = response.data.token;
      localStorage.setItem('token', token);

      const profileRes = await api.get<UserProfile>('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = profileRes.data;

      const roles: string[] = user.roles ?? (Array.isArray(user.role) ? user.role : []);
      const roleString: string | undefined = typeof user.role === 'string' ? user.role : undefined;

      const isAdmin =
        roleString === 'admin' ||
        roles.some((r) => r.toLowerCase().includes('admin') || r === 'ROLE_ADMIN');

      const isOpticien =
        roleString === 'opticien' ||
        roles.some((r) => r.toLowerCase().includes('opticien') || r === 'ROLE_OPTICIEN');

      const status = (user.status ?? '').toString().toLowerCase();

      if (isAdmin) {
        window.location.href = '/dashboard';
      } else if (isOpticien) {
        if (status === 'pending' || status === 'en attente' || status === 'waiting') {
          window.location.href = '/pending-approval';
        } else if (status === 'approved' || status === 'approuvé') {
          window.location.href = '/dashboard';
        } else if (status === 'rejected' || status === 'refused' || status === 'rejeted') {
          window.location.href = '/account-rejected';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Email ou mot de passe incorrect');
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
        {/* Logo + Title Section - HORIZONTAL */}
        <div className="flex items-center justify-center gap-6 mb-10">
          {/* Logo Circle - GRAND */}
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

          {/* Title */}
          <div className="flex flex-col">
            <h1 className="text-6xl font-black text-white tracking-tight drop-shadow-lg leading-none">
              Opti<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">MAROC</span>
            </h1>
            <p className="text-blue-200 text-base font-semibold mt-2">Bienvenue sur votre plateforme</p>
          </div>
        </div>

        {/* Login Card with Glassmorphism */}
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl opacity-20 blur-xl" />
          
          <div className="relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-white/90 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold text-white/90 uppercase tracking-wide">
                  Mot de passe
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                    aria-label={showPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
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

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-bold text-blue-300 hover:text-blue-200 transition-colors duration-200 hover:underline underline-offset-4 decoration-2"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

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
                      Connexion...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm font-bold text-white/40 bg-transparent uppercase tracking-wider">ou</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-white/70 text-base font-medium">
                Pas encore de compte ?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-300 hover:text-blue-200 font-bold transition-all duration-200 hover:underline underline-offset-4 decoration-2 inline-flex items-center"
                >
                  Créer un compte
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </p>
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

export default Login;