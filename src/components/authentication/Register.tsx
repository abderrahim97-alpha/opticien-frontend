import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Api/axios';
import logoImage from '../../assets/opt-Logo.png';

interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone?: string;
  city?: string;
  adresse?: string;
  companyName?: string;
  ICE?: string;
}

interface UploadedImage {
  file: File;
  preview: string;
}

const STEPS = [
  { id: 1, name: 'Compte', icon: '👤' },
  { id: 2, name: 'Contact', icon: '📞' },
  { id: 3, name: 'Entreprise', icon: '🏢' },
  { id: 4, name: 'Images', icon: '📸' },
];

const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
    city: '',
    adresse: '',
    companyName: '',
    ICE: '',
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s+]+$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    if (name === 'telephone') {
      if (value && !validatePhone(value)) {
        setPhoneError('Le téléphone ne peut contenir que des chiffres, espaces et le symbole +');
        return;
      } else {
        setPhoneError('');
      }
    }
    
    setFormData({ ...formData, [name]: value });
    
    if (error) setError('');
    if (success) setSuccess('');
    
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Format d\'email invalide');
      } else {
        setEmailError('');
      }
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.prenom) {
          setError('Le prénom est obligatoire');
          return false;
        }
        if (!formData.nom) {
          setError('Le nom est obligatoire');
          return false;
        }
        if (!formData.email || !validateEmail(formData.email)) {
          setError('Une adresse email valide est requise');
          return false;
        }
        if (!formData.password || formData.password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          return false;
        }
        break;
      case 2:
      case 3:
      case 4:
        break;
    }
    setError('');
    return true;
  };

  const nextStep = (): void => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, STEPS.length));
    }
  };

  const prevStep = (): void => {
    setCurrentStep(Math.max(currentStep - 1, 1));
    setError('');
  };

  const handleFinalSubmit = async (): Promise<void> => {
    setError('');
    setSuccess('');

    if (!validateStep(currentStep)) return;

    setIsLoading(true);

    try {
      const submitData = new FormData();
      
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('nom', formData.nom);
      submitData.append('prenom', formData.prenom);
      submitData.append('telephone', formData.telephone || '');
      submitData.append('city', formData.city || '');
      submitData.append('adresse', formData.adresse || '');
      submitData.append('companyName', formData.companyName || '');
      submitData.append('ICE', formData.ICE || '');
      
      uploadedImages.forEach((img) => {
        submitData.append('images[]', img.file);
      });

      const response = await api.post('/register-opticien', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess(response.data.message || 'Inscription réussie ! Redirection...');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
                <span className="text-3xl">👤</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Créez votre compte</h2>
              <p className="text-blue-200">Commencez par vos informations personnelles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="prenom" className="block text-sm font-bold text-white/90 uppercase tracking-wide">
                  Prénom <span className="text-red-400">*</span>
                </label>
                <input
                  id="prenom"
                  type="text"
                  name="prenom"
                  placeholder="Jean"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nom" className="block text-sm font-bold text-white/90 uppercase tracking-wide">
                  Nom <span className="text-red-400">*</span>
                </label>
                <input
                  id="nom"
                  type="text"
                  name="nom"
                  placeholder="Dupont"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-white/90 uppercase tracking-wide">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-5 py-4 bg-white/10 backdrop-blur-sm border-2 rounded-2xl text-white placeholder:text-white/40 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium ${
                  emailError ? 'border-red-400' : 'border-white/20'
                }`}
              />
              {emailError && (
                <p className="text-sm text-red-300 flex items-center mt-2">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-white/90 uppercase tracking-wide">
                Mot de passe <span className="text-red-400">*</span>
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
                  minLength={6}
                  className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
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
              </div>
              <p className="text-xs text-white/50 mt-2">Minimum 6 caractères</p>
            </div>

            <div className="bg-blue-500/20 backdrop-blur-sm border-2 border-blue-400/30 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Sécurité de votre compte
              </h3>
              <ul className="text-sm text-blue-100 space-y-1.5 ml-7">
                <li>• Utilisez un email valide pour la confirmation</li>
                <li>• Choisissez un mot de passe fort et unique</li>
                <li>• Ces informations seront utilisées pour vous connecter</li>
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4 shadow-lg shadow-green-500/30">
                <span className="text-3xl">📞</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Vos coordonnées</h2>
              <p className="text-blue-200">Comment pouvons-nous vous joindre ?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="telephone" className="block text-sm font-bold text-white/90 uppercase tracking-wide">
                  Téléphone
                </label>
                <input
                  id="telephone"
                  type="tel"
                  name="telephone"
                  placeholder="+212 6 12 34 56 78"
                  value={formData.telephone}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-white/10 backdrop-blur-sm border-2 rounded-2xl text-white placeholder:text-white/40 focus:border-green-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 font-medium ${
                    phoneError ? 'border-red-400' : 'border-white/20'
                  }`}
                />
                {phoneError && (
                  <p className="text-sm text-red-300 flex items-center mt-2">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {phoneError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-bold text-white/90 uppercase tracking-wide">
                  Ville
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="Casablanca, Rabat..."
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-green-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="adresse" className="block text-sm font-bold text-white/90 uppercase tracking-wide">
                Adresse complète
              </label>
              <input
                id="adresse"
                type="text"
                name="adresse"
                placeholder="123 Rue Mohamed V, Quartier Maarif"
                value={formData.adresse}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-green-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 font-medium"
              />
            </div>

            <div className="bg-green-500/20 backdrop-blur-sm border-2 border-green-400/30 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Pourquoi ces informations ?
              </h3>
              <ul className="text-sm text-green-100 space-y-1.5 ml-7">
                <li>• Faciliter la communication avec vos clients</li>
                <li>• Permettre la livraison de vos commandes</li>
                <li>• Ces informations sont optionnelles</li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
                <span className="text-3xl">🏢</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Votre entreprise</h2>
              <p className="text-blue-200">Parlez-nous de votre magasin d'optique</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="companyName" className="block text-sm font-bold text-white/90 uppercase tracking-wide">
                Nom de l'entreprise
              </label>
              <input
                id="companyName"
                type="text"
                name="companyName"
                placeholder="Optique Vision Plus"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-purple-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="ICE" className="block text-sm font-bold text-white/90 uppercase tracking-wide">
                Numéro ICE
              </label>
              <input
                id="ICE"
                type="text"
                name="ICE"
                placeholder="000000000000000"
                value={formData.ICE}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-purple-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 font-medium"
              />
              <p className="text-xs text-white/50 mt-2">15 chiffres - Format: 000000000000000</p>
            </div>

            <div className="bg-purple-500/20 backdrop-blur-sm border-2 border-purple-400/30 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                À propos de votre entreprise
              </h3>
              <ul className="text-sm text-purple-100 space-y-1.5 ml-7">
                <li>• Ces informations renforcent votre crédibilité</li>
                <li>• Le numéro ICE est requis pour les factures</li>
                <li>• Vous pourrez modifier ces informations plus tard</li>
                <li>• Ces champs sont optionnels pour l'inscription</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4 shadow-lg shadow-orange-500/30">
                <span className="text-3xl">📸</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Photos de votre magasin</h2>
              <p className="text-blue-200">Montrez votre espace aux futurs clients</p>
            </div>

            <div>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = e.currentTarget.files;
                  if (files) {
                    const newImages: UploadedImage[] = [];
                    for (let i = 0; i < files.length; i++) {
                      const file = files[i];
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        newImages.push({
                          file,
                          preview: event.target?.result as string,
                        });
                        if (newImages.length === files.length) {
                          setUploadedImages([...uploadedImages, ...newImages]);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="w-full px-6 py-12 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:border-orange-400 hover:bg-white/5 transition duration-300 flex flex-col items-center justify-center group"
              >
                <svg className="w-16 h-16 text-white/40 group-hover:text-orange-400 transition duration-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-bold text-white mb-1">Cliquez pour ajouter des images</p>
                <p className="text-sm text-white/60">ou glissez-déposez vos fichiers ici</p>
                <p className="text-xs text-white/40 mt-2">PNG, JPG, GIF jusqu'à 10MB</p>
              </label>
            </div>

            {uploadedImages.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                  <span>Images téléchargées ({uploadedImages.length})</span>
                  <button
                    type="button"
                    onClick={() => setUploadedImages([])}
                    className="text-xs text-red-300 hover:text-red-200 font-bold transition-colors duration-200"
                  >
                    Tout supprimer
                  </button>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border-2 border-white/20 group-hover:border-orange-400 transition duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImages(uploadedImages.filter((_, i) => i !== index));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-red-600 shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <p className="text-xs text-white/70 mt-2 truncate">{img.file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-orange-500/20 backdrop-blur-sm border-2 border-orange-400/30 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Conseils pour les photos
              </h3>
              <ul className="text-sm text-orange-100 space-y-1.5 ml-7">
                <li>• Photos de la devanture et de l'intérieur du magasin</li>
                <li>• Images professionnelles et bien éclairées</li>
                <li>• Montrez votre espace d'accueil et vos équipements</li>
                <li>• Les photos sont optionnelles mais recommandées</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-2 border-blue-400/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-bold text-lg text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Récapitulatif de votre inscription
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Nom complet</p>
                  <p className="font-bold text-white">{formData.prenom} {formData.nom}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Email</p>
                  <p className="font-bold text-white">{formData.email}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Téléphone</p>
                  <p className="font-bold text-white">{formData.telephone || '-'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Ville</p>
                  <p className="font-bold text-white">{formData.city || '-'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Entreprise</p>
                  <p className="font-bold text-white">{formData.companyName || '-'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Photos</p>
                  <p className="font-bold text-white">{uploadedImages.length} image(s)</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
      <div className="relative w-full max-w-4xl z-10">
        {/* Logo + Title Section */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition duration-500 animate-pulse" />
            <div className="relative w-24 h-24 bg-white/10 backdrop-blur-md border-4 border-white/30 rounded-full flex items-center justify-center shadow-2xl transform transition-transform duration-300 hover:scale-110">
              <img 
                src={logoImage} 
                alt="Optique Marketplace Logo" 
                className="w-18 h-18 object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-5xl font-black text-white tracking-tight drop-shadow-lg leading-none">
              Optique<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">MP</span>
            </h1>
            <p className="text-blue-200 text-base font-semibold mt-2">Créez votre compte opticien</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                      currentStep === step.id
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white scale-110 shadow-lg shadow-blue-500/50'
                        : currentStep > step.id
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                        : 'bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white/40'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <p className={`mt-3 text-xs font-bold uppercase tracking-wider ${currentStep === step.id ? 'text-blue-300' : 'text-white/50'}`}>
                    {step.name}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-1 mx-3 rounded-full transition-all duration-500" style={{
                    background: currentStep > step.id 
                      ? 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))' 
                      : 'rgba(255, 255, 255, 0.1)'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Registration Card */}
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl opacity-20 blur-xl" />
          
          <div className="relative">
            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              {renderStepContent()}

              {/* Success Message */}
              {success && (
                <div className="mt-6 bg-green-500/20 backdrop-blur-sm border-2 border-green-400/50 text-green-100 px-5 py-4 rounded-2xl flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold">{success}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 bg-red-500/20 backdrop-blur-sm border-2 border-red-400/50 text-red-100 px-5 py-4 rounded-2xl flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold">{error}</span>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-between gap-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-6 py-3.5 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-xl font-bold hover:bg-white/15 hover:border-white/30 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Précédent
                  </button>
                )}

                {currentStep === 1 && (
                  <Link
                    to="/"
                    className="flex items-center px-6 py-3.5 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-xl font-bold hover:bg-white/15 hover:border-white/30 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Se connecter
                  </Link>
                )}

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!!emailError || !!phoneError}
                    className="ml-auto relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center px-8 py-3.5 text-white font-bold tracking-wide disabled:opacity-60">
                      Suivant
                      <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isLoading || !!emailError || !!phoneError}
                    className="ml-auto relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl" />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center px-8 py-3.5 text-white font-bold tracking-wide disabled:opacity-60">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Inscription...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Créer mon compte
                        </>
                      )}
                    </span>
                  </button>
                )}
              </div>

              <div className="mt-6 text-center text-sm text-white/50 font-medium">
                Étape {currentStep} sur {STEPS.length}
              </div>
            </form>

            {currentStep === 1 && (
              <div className="mt-8 pt-6 border-t-2 border-white/10">
                <p className="text-center text-sm text-white/70">
                  Vous avez déjà un compte ?{' '}
                  <Link 
                    to="/" 
                    className="text-blue-300 hover:text-blue-200 font-bold transition-colors duration-200 hover:underline underline-offset-4 decoration-2"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            )}
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

export default Register;