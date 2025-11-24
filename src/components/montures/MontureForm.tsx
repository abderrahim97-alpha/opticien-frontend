import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Api/axios';

interface MontureFormData {
  name: string;
  description: string;
  price: string;
  brand: string;
  stock: string;
  type: string;
  genre: string;
  forme: string;
  couleur: string;
  materiau: string;
}

interface UploadedImage {
  file: File;
  preview: string;
}

// ========== ENUM OPTIONS ==========
const TYPE_OPTIONS = [
  { value: '', label: 'Sélectionner un type' },
  { value: 'vue', label: '👓 Lunettes de vue' },
  { value: 'soleil', label: '🕶️ Lunettes de soleil' },
];

const GENRE_OPTIONS = [
  { value: '', label: 'Sélectionner un genre' },
  { value: 'homme', label: '👨 Homme' },
  { value: 'femme', label: '👩 Femme' },
  { value: 'enfant', label: '👶 Enfant' },
  { value: 'unisexe', label: '⚡ Unisexe' },
];

const FORME_OPTIONS = [
  { value: '', label: 'Sélectionner une forme' },
  { value: 'rectangulaire', label: 'Rectangulaire' },
  { value: 'ronde', label: 'Ronde' },
  { value: 'ovale', label: 'Ovale' },
  { value: 'carree', label: 'Carrée' },
  { value: 'aviateur', label: 'Aviateur' },
  { value: 'papillon', label: 'Papillon (Cat-eye)' },
  { value: 'clubmaster', label: 'Clubmaster' },
  { value: 'sport', label: 'Sport' },
  { value: 'geometrique', label: 'Géométrique' },
];

const MATERIAU_OPTIONS = [
  { value: '', label: 'Sélectionner un matériau' },
  { value: 'acetate', label: 'Acétate' },
  { value: 'metal', label: 'Métal' },
  { value: 'plastique', label: 'Plastique' },
  { value: 'titane', label: 'Titane' },
  { value: 'tr90', label: 'TR90' },
  { value: 'aluminium', label: 'Aluminium' },
  { value: 'acier_inoxydable', label: 'Acier inoxydable' },
  { value: 'fibre_carbone', label: 'Fibre de carbone' },
  { value: 'bois', label: 'Bois' },
  { value: 'corne', label: 'Corne' },
  { value: 'metal_plastique', label: 'Métal/Plastique' },
];

const COULEUR_SUGGESTIONS = [
  'Noir', 'Bleu', 'Marron', 'Vert', 'Rouge', 'Rose', 'Gris', 
  'Transparent', 'Doré', 'Argenté', 'Écaille', 'Multicolore'
];

// ========== STEPS CONFIGURATION ==========
const STEPS = [
  { id: 1, name: 'Informations', icon: '📋' },
  { id: 2, name: 'Caractéristiques', icon: '🔍' },
  { id: 3, name: 'Description', icon: '📝' },
  { id: 4, name: 'Images', icon: '📸' },
];

const MontureForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MontureFormData>({
    name: '',
    description: '',
    price: '',
    brand: '',
    stock: '',
    type: '',
    genre: '',
    forme: '',
    couleur: '',
    materiau: '',
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [priceError, setPriceError] = useState<string>('');

  const validatePrice = (price: string): boolean => {
    if (!price || price.trim() === '') return false;
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) && numPrice > 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (error) setError('');
    if (success) setSuccess('');

    if (name === 'price') {
      if (value && !validatePrice(value)) {
        setPriceError('Le prix doit être un nombre valide');
      } else {
        setPriceError('');
      }
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.name) {
          setError('Le nom est obligatoire');
          return false;
        }
        if (!formData.price || !validatePrice(formData.price)) {
          setError('Le prix est obligatoire et doit être valide');
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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
    setError('');
  };

  const handleFinalSubmit = async () => {
    setError('');
    setSuccess('');

    if (!validateStep(currentStep)) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('brand', formData.brand);
      submitData.append('stock', formData.stock || '0');

      if (formData.type) submitData.append('type', formData.type);
      if (formData.genre) submitData.append('genre', formData.genre);
      if (formData.forme) submitData.append('forme', formData.forme);
      if (formData.couleur) submitData.append('couleur', formData.couleur);
      if (formData.materiau) submitData.append('materiau', formData.materiau);

      uploadedImages.forEach((img) => {
        submitData.append('images[]', img.file);
      });

      const response = await api.post('/montures-upload', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(response.data.message || 'Monture créée avec succès ! Redirection...');

      setTimeout(() => {
        navigate('/montures');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création de la monture');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center mb-4">
              <h2 className="text-xl sm:text-2xl font-black text-white mb-2">📋 Informations de base</h2>
              <p className="text-blue-200 text-sm">Commençons par les informations essentielles</p>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                Nom de la monture <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Ex: Lunettes de soleil aviateur"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm sm:text-base"
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="price" className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                  Prix (DH) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="price"
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                    className={`w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border rounded-lg text-white placeholder-blue-200/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm sm:text-base ${
                      priceError ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 sm:top-3 text-blue-200 text-sm">DH</span>
                </div>
                {priceError && (
                  <p className="mt-1 text-xs text-red-400 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {priceError}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="stock" className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                  Stock disponible
                </label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                Marque
              </label>
              <input
                id="brand"
                type="text"
                name="brand"
                placeholder="Ex: Ray-Ban, Oakley, Gucci"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm sm:text-base"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center mb-4">
              <h2 className="text-xl sm:text-2xl font-black text-white mb-2">🔍 Caractéristiques</h2>
              <p className="text-blue-200 text-sm">Précisez les détails de la monture</p>
            </div>

            {/* Type and Genre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="type" className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                  Type de lunettes
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm sm:text-base cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                  }}
                >
                  {TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="genre" className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                  Genre
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm sm:text-base cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                  }}
                >
                  {GENRE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Forme and Materiau */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="forme" className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                  Forme
                </label>
                <select
                  id="forme"
                  name="forme"
                  value={formData.forme}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm sm:text-base cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                  }}
                >
                  {FORME_OPTIONS.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="materiau" className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                  Matériau
                </label>
                <select
                  id="materiau"
                  name="materiau"
                  value={formData.materiau}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm sm:text-base cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                  }}
                >
                  {MATERIAU_OPTIONS.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Couleur */}
            <div>
              <label htmlFor="couleur" className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                Couleur
              </label>
              <input
                id="couleur"
                type="text"
                name="couleur"
                placeholder="Ex: Noir, Bleu marine, Écaille de tortue..."
                value={formData.couleur}
                onChange={handleChange}
                list="couleur-suggestions"
                className="w-full px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm sm:text-base"
              />
              <datalist id="couleur-suggestions">
                {COULEUR_SUGGESTIONS.map(couleur => (
                  <option key={couleur} value={couleur} />
                ))}
              </datalist>
              <div className="mt-2 flex flex-wrap gap-2">
                {COULEUR_SUGGESTIONS.slice(0, 6).map(couleur => (
                  <button
                    key={couleur}
                    type="button"
                    onClick={() => setFormData({ ...formData, couleur })}
                    className="px-3 py-1 text-xs backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-full transition duration-200"
                  >
                    {couleur}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center mb-4">
              <h2 className="text-xl sm:text-2xl font-black text-white mb-2">📝 Description</h2>
              <p className="text-blue-200 text-sm">Décrivez votre produit en détail</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                Description complète
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Décrivez la monture en détail (matériaux, style, occasions d'utilisation, points forts...)&#10;&#10;Exemple:&#10;- Monture en acétate italien de haute qualité&#10;- Design intemporel et élégant&#10;- Confortable pour un port prolongé&#10;- Protection UV400&#10;- Idéale pour toutes occasions"
                value={formData.description}
                onChange={handleChange}
                rows={10}
                className="w-full px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none resize-none text-sm"
              />
              <p className="mt-2 text-xs text-blue-200">
                {formData.description.length} caractères
              </p>
            </div>

            {/* Tips */}
            <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
              <h3 className="font-bold text-white mb-2 flex items-center text-sm">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Conseils pour une bonne description
              </h3>
              <ul className="text-xs text-blue-200 space-y-1 ml-7">
                <li>• Mentionnez les caractéristiques techniques</li>
                <li>• Décrivez le style et le design</li>
                <li>• Indiquez les occasions d'utilisation</li>
                <li>• Soyez précis sur les matériaux</li>
                <li>• Mettez en avant les points forts</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center mb-4">
              <h2 className="text-xl sm:text-2xl font-black text-white mb-2">📸 Images du produit</h2>
              <p className="text-blue-200 text-sm">Ajoutez des photos de qualité</p>
            </div>

            {/* Image Upload */}
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
                className="w-full px-6 py-8 sm:py-12 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-white/5 transition duration-200 flex flex-col items-center justify-center group"
              >
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-blue-200 group-hover:text-blue-300 transition duration-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-base sm:text-lg font-bold text-white mb-1">Cliquez pour ajouter des images</p>
                <p className="text-xs sm:text-sm text-blue-200">ou glissez-déposez vos fichiers ici</p>
                <p className="text-xs text-blue-200/60 mt-2">PNG, JPG, GIF jusqu'à 10MB</p>
              </label>
            </div>

            {/* Image Preview Grid */}
            {uploadedImages.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-blue-200 mb-3 flex items-center justify-between">
                  <span>Images téléchargées ({uploadedImages.length})</span>
                  <button
                    type="button"
                    onClick={() => setUploadedImages([])}
                    className="text-xs text-red-400 hover:text-red-300 font-bold"
                  >
                    Tout supprimer
                  </button>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 sm:h-40 object-cover rounded-lg border-2 border-white/20 group-hover:border-blue-400 transition duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImages(uploadedImages.filter((_, i) => i !== index));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition duration-200 hover:bg-red-600"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded font-bold">
                          Principal
                        </div>
                      )}
                      <p className="text-xs text-blue-200 mt-1 truncate">{img.file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips for images */}
            <div className="backdrop-blur-xl bg-green-500/20 border border-green-400/50 rounded-lg p-4">
              <h3 className="font-bold text-white mb-2 flex items-center text-sm">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Conseils pour de meilleures photos
              </h3>
              <ul className="text-xs text-green-200 space-y-1 ml-7">
                <li>• Utilisez un fond neutre et bien éclairé</li>
                <li>• Prenez plusieurs angles (face, profil, détails)</li>
                <li>• La première image sera la photo principale</li>
                <li>• Évitez les photos floues ou mal cadrées</li>
                <li>• Montrez les détails importants (logo, charnières...)</li>
              </ul>
            </div>

            {/* Summary Card */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/50 rounded-lg p-4 sm:p-6">
              <h3 className="font-black text-base sm:text-lg text-white mb-4 flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Résumé de votre monture
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2">
                  <p className="text-blue-200 text-xs">Nom</p>
                  <p className="font-bold text-white">{formData.name || '-'}</p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2">
                  <p className="text-blue-200 text-xs">Prix</p>
                  <p className="font-bold text-white">{formData.price ? `${formData.price} DH` : '-'}</p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2">
                  <p className="text-blue-200 text-xs">Marque</p>
                  <p className="font-bold text-white">{formData.brand || '-'}</p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2">
                  <p className="text-blue-200 text-xs">Stock</p>
                  <p className="font-bold text-white">{formData.stock || '0'} unités</p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2">
                  <p className="text-blue-200 text-xs">Type</p>
                  <p className="font-bold text-white">
                    {TYPE_OPTIONS.find(t => t.value === formData.type)?.label || '-'}
                  </p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2">
                  <p className="text-blue-200 text-xs">Genre</p>
                  <p className="font-bold text-white">
                    {GENRE_OPTIONS.find(g => g.value === formData.genre)?.label || '-'}
                  </p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2">
                  <p className="text-blue-200 text-xs">Forme</p>
                  <p className="font-bold text-white">
                    {FORME_OPTIONS.find(f => f.value === formData.forme)?.label || '-'}
                  </p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2">
                  <p className="text-blue-200 text-xs">Matériau</p>
                  <p className="font-bold text-white">
                    {MATERIAU_OPTIONS.find(m => m.value === formData.materiau)?.label || '-'}
                  </p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2">
                  <p className="text-blue-200 text-xs">Couleur</p>
                  <p className="font-bold text-white">{formData.couleur || '-'}</p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2">
                  <p className="text-blue-200 text-xs">Images</p>
                  <p className="font-bold text-white">{uploadedImages.length} photo(s)</p>
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 p-3 sm:p-4 lg:p-6">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* FULL WIDTH CONTAINER */}
      <div className="relative w-full max-w-5xl mx-auto z-10">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2">Ajouter une Monture</h1>
          <p className="text-blue-200 text-sm sm:text-base">Complétez les étapes pour créer votre monture</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold transition duration-300 ${
                      currentStep === step.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white scale-110 shadow-lg'
                        : currentStep > step.id
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'backdrop-blur-sm bg-white/10 border border-white/20 text-blue-200'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <p className={`mt-2 text-xs font-bold hidden sm:block ${currentStep === step.id ? 'text-blue-300' : 'text-blue-200/60'}`}>
                    {step.name}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-1 sm:mx-2 rounded transition duration-300 ${
                      currentStep > step.id ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'backdrop-blur-sm bg-white/10'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              {/* Step Content */}
              {renderStepContent()}

              {/* Success Message */}
              {success && (
                <div className="mt-6 backdrop-blur-xl bg-green-500/20 border border-green-400/50 text-green-200 px-4 py-3 rounded-lg flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold">{success}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 backdrop-blur-xl bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold">{error}</span>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-6 sm:mt-8 flex items-center justify-between gap-3">
                {/* Previous Button */}
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="relative group/btn overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg blur opacity-50 group-hover/btn:opacity-75 transition duration-300" />
                    <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg font-bold transition duration-300 flex items-center text-sm sm:text-base">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Précédent</span>
                      <span className="sm:hidden">Préc.</span>
                    </div>
                  </button>
                )}

                {/* Spacer */}
                {currentStep === 1 && <div />}

                {/* Next/Submit Button */}
                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!!priceError}
                    className="relative ml-auto group/btn overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 sm:py-2.5 px-4 sm:px-8 rounded-lg font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm sm:text-base">
                      <span className="hidden sm:inline">Suivant</span>
                      <span className="sm:hidden">Suiv.</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isLoading || !!priceError}
                    className="relative ml-auto group/btn overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                    <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 sm:py-2.5 px-4 sm:px-8 rounded-lg font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm sm:text-base">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 h-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="hidden sm:inline">Création en cours...</span>
                          <span className="sm:hidden">Création...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="hidden sm:inline">Créer la monture</span>
                          <span className="sm:hidden">Créer</span>
                        </>
                      )}
                    </div>
                  </button>
                )}
              </div>

              {/* Step Indicator (Mobile) */}
              <div className="mt-4 text-center text-xs sm:text-sm text-blue-200">
                Étape {currentStep} sur {STEPS.length}
              </div>
            </form>
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

export default MontureForm;