import React, { useState, useEffect } from 'react';
import api from '../../Api/axios';

interface ProfileData {
  id: string;
  email: string;
  roles: string[];
  nom?: string;
  prenom?: string;
  telephone?: string;
  city?: string;
  adresse?: string;
  companyName?: string;
  ICE?: string;
  status?: string;
}

type TabType = 'profile' | 'email' | 'password';

const ProfileSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      showMessage('error', 'Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const tabs = [
    { id: 'profile' as TabType, name: 'Informations personnelles', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'email' as TabType, name: 'Adresse email', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'password' as TabType, name: 'Mot de passe', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )},
  ];

  if (loading) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative text-center z-10">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="relative">
              <svg className="animate-spin h-16 w-16 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-bold text-white">Chargement...</p>
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
    <div className="relative p-6">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Paramètres du compte</h1>
          <p className="text-blue-200 text-lg">Gérez vos informations personnelles et vos préférences de sécurité</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 backdrop-blur-xl rounded-xl p-4 flex items-start border-2 shadow-lg ${
            message.type === 'success' 
              ? 'bg-green-500/20 border-green-400/50'
              : 'bg-red-500/20 border-red-400/50'
          }`}>
            <svg className={`w-5 h-5 mr-2 flex-shrink-0 mt-0.5 ${
              message.type === 'success' ? 'text-green-300' : 'text-red-300'
            }`} fill="currentColor" viewBox="0 0 20 20">
              {message.type === 'success' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            <p className={`font-bold ${message.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
              {message.text}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-lg sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className={activeTab === tab.id ? 'text-white' : 'text-white/50'}>
                      {tab.icon}
                    </span>
                    <span className="ml-3">{tab.name}</span>
                  </button>
                ))}
              </nav>

              {/* Account Info */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-blue-200 font-semibold mb-2 uppercase tracking-wide">Rôle</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                      {profile?.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'Opticien'}
                    </span>
                  </div>
                  {profile?.status && (
                    <div>
                      <p className="text-xs text-blue-200 font-semibold mb-2 uppercase tracking-wide">Statut</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                        profile.status.toLowerCase() === 'approved'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                      }`}>
                        {profile.status === 'approved' ? 'Approuvé' : 'En attente'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <ProfileInfoTab profile={profile} onUpdate={fetchProfile} showMessage={showMessage} />
            )}
            {activeTab === 'email' && (
              <EmailTab profile={profile} onUpdate={fetchProfile} showMessage={showMessage} />
            )}
            {activeTab === 'password' && (
              <PasswordTab showMessage={showMessage} />
            )}
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
      `}</style>
    </div>
  );
};

// Tab Component: Profile Information
const ProfileInfoTab: React.FC<{
  profile: ProfileData | null;
  onUpdate: () => void;
  showMessage: (type: 'success' | 'error', text: string) => void;
}> = ({ profile, onUpdate, showMessage }) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nom: profile?.nom || '',
    prenom: profile?.prenom || '',
    telephone: profile?.telephone || '',
    city: profile?.city || '',
    adresse: profile?.adresse || '',
    companyName: profile?.companyName || '',
    ICE: profile?.ICE || '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nom: profile.nom || '',
        prenom: profile.prenom || '',
        telephone: profile.telephone || '',
        city: profile.city || '',
        adresse: profile.adresse || '',
        companyName: profile.companyName || '',
        ICE: profile.ICE || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      await api.put('/profile/update', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage('success', '✅ Informations mises à jour avec succès');
      onUpdate();
    } catch (err: any) {
      showMessage('error', err.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="ml-4">
          <h2 className="text-2xl font-black text-white">Informations personnelles</h2>
          <p className="text-sm text-blue-200">Mettez à jour vos coordonnées professionnelles</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Prénom <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Nom <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
              placeholder="+212 6XX-XXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Ville
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Adresse
          </label>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Numéro ICE
            </label>
            <input
              type="text"
              name="ICE"
              value={formData.ICE}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-blue-500/50"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Tab Component: Email
const EmailTab: React.FC<{
  profile: ProfileData | null;
  onUpdate: () => void;
  showMessage: (type: 'success' | 'error', text: string) => void;
}> = ({ profile, onUpdate, showMessage }) => {
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState(profile?.email || '');

  useEffect(() => {
    if (profile) {
      setEmail(profile.email);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      await api.put('/profile/update', { email }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage('success', '✅ Email mis à jour avec succès');
      onUpdate();
    } catch (err: any) {
      showMessage('error', err.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="ml-4">
          <h2 className="text-2xl font-black text-white">Adresse email</h2>
          <p className="text-sm text-blue-200">Modifiez l'email associé à votre compte</p>
        </div>
      </div>

      <div className="bg-blue-500/20 border-2 border-blue-400/50 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-300 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-bold text-blue-200">Information importante</p>
            <p className="text-sm text-blue-300 mt-1">Votre email est utilisé pour vous connecter. Assurez-vous d'avoir accès à la nouvelle adresse email avant de la modifier.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Adresse email actuelle
          </label>
          <div className="px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white/70">
            {profile?.email}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Nouvelle adresse email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-indigo-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300"
            placeholder="nouveau@email.com"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving || email === profile?.email}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-indigo-500/50"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mise à jour...
              </>
            ) : (
              'Mettre à jour l\'email'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Tab Component: Password
const PasswordTab: React.FC<{
  showMessage: (type: 'success' | 'error', text: string) => void;
}> = ({ showMessage }) => {
  const [changing, setChanging] = useState(false);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'Les mots de passe ne correspondent pas');
      return;
    }

    setChanging(true);

    try {
      const token = localStorage.getItem('token');
      await api.post('/profile/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage('success', '✅ Mot de passe modifié avec succès');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showMessage('error', err.response?.data?.error || 'Erreur lors du changement de mot de passe');
    } finally {
      setChanging(false);
    }
  };

  const passwordsMatch = passwordData.newPassword && passwordData.confirmPassword && 
                         passwordData.newPassword === passwordData.confirmPassword;

  const passwordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    if (strength <= 2) return { strength, label: 'Faible', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Moyen', color: 'bg-yellow-500' };
    return { strength, label: 'Fort', color: 'bg-green-500' };
  };

  const strength = passwordStrength(passwordData.newPassword);

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="ml-4">
          <h2 className="text-2xl font-black text-white">Changer le mot de passe</h2>
          <p className="text-sm text-blue-200">Assurez-vous d'utiliser un mot de passe fort et sécurisé</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Mot de passe actuel <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword.current ? 'text' : 'password'}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 pr-12 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-purple-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword.current ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Nouveau mot de passe <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword.new ? 'text' : 'password'}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 pr-12 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-purple-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
              placeholder="Minimum 6 caractères"
            />
            <button
              type="button"
              onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword.new ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
              </svg>
            </button>
          </div>
          {passwordData.newPassword && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/70 font-semibold">Force du mot de passe</span>
                <span className={`text-xs font-bold ${
                  strength.strength <= 2 ? 'text-red-400' : strength.strength <= 3 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {strength.label}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${strength.color}`}
                  style={{ width: `${(strength.strength / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Confirmer le nouveau mot de passe <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 pr-12 bg-white/10 border-2 rounded-xl text-white placeholder:text-white/50 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 ${
                passwordData.confirmPassword && !passwordsMatch ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-purple-400'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword.confirm ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
              </svg>
            </button>
          </div>
          {passwordData.confirmPassword && (
            <p className={`mt-2 text-sm flex items-center font-bold ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
              {passwordsMatch ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Les mots de passe correspondent
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Les mots de passe ne correspondent pas
                </>
              )}
            </p>
          )}
        </div>

        <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-xl p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-300 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-bold text-yellow-200">Conseils de sécurité</p>
              <ul className="text-sm text-yellow-300 mt-2 space-y-1">
                <li>• Utilisez au moins 10 caractères</li>
                <li>• Combinez majuscules, minuscules, chiffres et symboles</li>
                <li>• N'utilisez pas d'informations personnelles</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={changing || !passwordsMatch}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-purple-500/50"
          >
            {changing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Modification en cours...
              </>
            ) : (
              'Changer le mot de passe'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;