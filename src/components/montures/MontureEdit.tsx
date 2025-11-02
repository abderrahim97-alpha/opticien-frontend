import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

interface ExistingImage {
  "@id": string;
  "@type": string;
  imageName: string;
  id?: number;
}

interface UploadedImage {
  file: File;
  preview: string;
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
  type?: string;
  genre?: string;
  forme?: string;
  couleur?: string;
  materiau?: string;
  images: ExistingImage[];
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

const MontureEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<UploadedImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [priceError, setPriceError] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }
    fetchMontureData(token);
  }, [id, navigate]);

  const fetchMontureData = async (token: string) => {
    try {
      setLoadingData(true);
      const response = await api.get<MontureDetail>(`/montures/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const monture = response.data;
      setFormData({
        name: monture.name,
        description: monture.description || '',
        price: monture.price.toString(),
        brand: monture.brand || '',
        stock: monture.stock?.toString() || '0',
        type: monture.type || '',
        genre: monture.genre || '',
        forme: monture.forme || '',
        couleur: monture.couleur || '',
        materiau: monture.materiau || '',
      });
      setExistingImages(monture.images || []);
    } catch (err: any) {
      setError('Erreur lors du chargement des données');
      console.error('Error fetching monture:', err);
    } finally {
      setLoadingData(false);
    }
  };

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

  // Validation for each step
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
        // Optional fields
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

  const handleDeleteExistingImage = (imageId: string) => {
    setExistingImages(existingImages.filter((img) => img["@id"] !== imageId));
    setImagesToDelete([...imagesToDelete, imageId]);
  };

  // ========== FONCTION DE SOUMISSION FINALE ==========
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

      // Add new images
      newImages.forEach((img) => {
        submitData.append('images[]', img.file);
      });

      // Add images to delete
      imagesToDelete.forEach((imgId) => {
        submitData.append('imagesToDelete[]', imgId);
      });

      const response = await api.post(`/montures/${id}/edit`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Monture mise à jour avec succès ! Redirection...');
      
      setTimeout(() => {
        navigate(`/montures/${id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== EMPÊCHER LA SOUMISSION PAR ENTER ==========
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    }
  };

  // ========== HANDLER POUR LE FORMULAIRE (NE FAIT RIEN) ==========
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📋 Informations de base</h2>
              <p className="text-gray-600 mt-2">Modifiez les informations essentielles</p>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la monture <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Ex: Lunettes de soleil aviateur"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (DH) <span className="text-red-500">*</span>
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none ${
                      priceError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <span className="absolute right-3 top-3 text-gray-500">DH</span>
                </div>
                {priceError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {priceError}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                />
              </div>
            </div>

            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                Marque
              </label>
              <input
                id="brand"
                type="text"
                name="brand"
                placeholder="Ex: Ray-Ban, Oakley, Gucci"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🔍 Caractéristiques</h2>
              <p className="text-gray-600 mt-2">Mettez à jour les détails de la monture</p>
            </div>

            {/* Type and Genre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type de lunettes
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-white"
                >
                  {TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-white"
                >
                  {GENRE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Forme and Materiau */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="forme" className="block text-sm font-medium text-gray-700 mb-2">
                  Forme
                </label>
                <select
                  id="forme"
                  name="forme"
                  value={formData.forme}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-white"
                >
                  {FORME_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="materiau" className="block text-sm font-medium text-gray-700 mb-2">
                  Matériau
                </label>
                <select
                  id="materiau"
                  name="materiau"
                  value={formData.materiau}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-white"
                >
                  {MATERIAU_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Couleur */}
            <div>
              <label htmlFor="couleur" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
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
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200"
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
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📝 Description</h2>
              <p className="text-gray-600 mt-2">Modifiez la description du produit</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description complète
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Décrivez la monture en détail (matériaux, style, occasions d'utilisation, points forts...)&#10;&#10;Exemple:&#10;- Monture en acétate italien de haute qualité&#10;- Design intemporel et élégant&#10;- Confortable pour un port prolongé&#10;- Protection UV400&#10;- Idéale pour toutes occasions"
                value={formData.description}
                onChange={handleChange}
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none resize-none"
              />
              <p className="mt-2 text-sm text-gray-500">
                {formData.description.length} caractères
              </p>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Conseils pour une bonne description
              </h3>
              <ul className="text-sm text-blue-800 space-y-1 ml-7">
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
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📸 Images du produit</h2>
              <p className="text-gray-600 mt-2">Gérez les photos de votre monture</p>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                  <span>Images actuelles ({existingImages.length})</span>
                  {existingImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const allIds = existingImages.map(img => img["@id"]);
                        setImagesToDelete([...imagesToDelete, ...allIds]);
                        setExistingImages([]);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Tout supprimer
                    </button>
                  )}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingImages.map((img, index) => (
                    <div key={img["@id"]} className="relative group">
                      <img
                        src={`http://127.0.0.1:8000/uploads/opticiens/${img.imageName}`}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img["@id"])}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-200 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Principal
                        </div>
                      )}
                      <p className="text-xs text-gray-600 mt-2 truncate">{img.imageName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Upload */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Ajouter de nouvelles images
              </h3>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = e.currentTarget.files;
                  if (files) {
                    const newImgs: UploadedImage[] = [];
                    for (let i = 0; i < files.length; i++) {
                      const file = files[i];
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        newImgs.push({
                          file,
                          preview: event.target?.result as string,
                        });
                        if (newImgs.length === files.length) {
                          setNewImages([...newImages, ...newImgs]);
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
                className="w-full px-6 py-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-200 flex flex-col items-center justify-center group"
              >
                <svg className="w-16 h-16 text-gray-400 group-hover:text-blue-500 transition duration-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-semibold text-gray-700 mb-1">Cliquez pour ajouter des images</p>
                <p className="text-sm text-gray-500">ou glissez-déposez vos fichiers ici</p>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF jusqu'à 10MB</p>
              </label>
            </div>

            {/* New Images Preview */}
            {newImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                  <span>Nouvelles images ({newImages.length})</span>
                  <button
                    type="button"
                    onClick={() => setNewImages([])}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Tout supprimer
                  </button>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview}
                        alt={`New preview ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewImages(newImages.filter((_, i) => i !== index));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-200 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Nouveau
                      </div>
                      <p className="text-xs text-gray-600 mt-2 truncate">{img.file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips for images */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Conseils pour de meilleures photos
              </h3>
              <ul className="text-sm text-green-800 space-y-1 ml-7">
                <li>• Utilisez un fond neutre et bien éclairé</li>
                <li>• Prenez plusieurs angles (face, profil, détails)</li>
                <li>• La première image sera la photo principale</li>
                <li>• Évitez les photos floues ou mal cadrées</li>
                <li>• Montrez les détails importants (logo, charnières...)</li>
              </ul>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Résumé des modifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Nom</p>
                  <p className="font-semibold text-gray-800">{formData.name || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Prix</p>
                  <p className="font-semibold text-gray-800">{formData.price ? `${formData.price} DH` : '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Marque</p>
                  <p className="font-semibold text-gray-800">{formData.brand || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Stock</p>
                  <p className="font-semibold text-gray-800">{formData.stock || '0'} unités</p>
                </div>
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-semibold text-gray-800">
                    {TYPE_OPTIONS.find(t => t.value === formData.type)?.label || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Genre</p>
                  <p className="font-semibold text-gray-800">
                    {GENRE_OPTIONS.find(g => g.value === formData.genre)?.label || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Forme</p>
                  <p className="font-semibold text-gray-800">
                    {FORME_OPTIONS.find(f => f.value === formData.forme)?.label || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Matériau</p>
                  <p className="font-semibold text-gray-800">
                    {MATERIAU_OPTIONS.find(m => m.value === formData.materiau)?.label || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Couleur</p>
                  <p className="font-semibold text-gray-800">{formData.couleur || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Images</p>
                  <p className="font-semibold text-gray-800">
                    {existingImages.length} existante(s) • {newImages.length} nouvelle(s)
                  </p>
                </div>
              </div>
              {imagesToDelete.length > 0 && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm text-red-600 font-medium">
                    ⚠️ {imagesToDelete.length} image(s) seront supprimée(s)
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/montures/${id}`)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 font-medium transition duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux détails
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Modifier la Monture</h1>
          <p className="text-gray-600">Mettez à jour les informations étape par étape</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition duration-300 ${
                      currentStep === step.id
                        ? 'bg-blue-600 text-white scale-110 shadow-lg'
                        : currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <p className={`mt-2 text-xs font-medium ${currentStep === step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.name}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition duration-300 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            {/* Step Content */}
            {renderStepContent()}

            {/* Success Message */}
            {success && (
              <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {/* Previous Button */}
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Précédent
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
                  className="ml-auto flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Suivant
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isLoading || !!priceError}
                  className="ml-auto flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mise à jour en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Step Indicator (Mobile) */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Étape {currentStep} sur {STEPS.length}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MontureEdit;