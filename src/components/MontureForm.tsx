import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api/axios';

interface MontureFormData {
  name: string;
  description: string;
  price: string;
  brand: string;
  stock: string;
}

interface UploadedImage {
  file: File;
  preview: string;
}

const MontureForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<MontureFormData>({
    name: '',
    description: '',
    price: '',
    brand: '',
    stock: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (error) setError('');
    if (success) setSuccess('');

    // Validate price on change
    if (name === 'price') {
      if (value && !validatePrice(value)) {
        setPriceError('Le prix doit être un nombre valide');
      } else {
        setPriceError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.name || !formData.price) {
      setError('Le nom et le prix sont obligatoires');
      return;
    }

    // Validate price
    if (!validatePrice(formData.price)) {
      setPriceError('Le prix doit être un nombre valide');
      return;
    }

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

      // Add uploaded images
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
      
      // Reset form
      setFormData({ name: '', description: '', price: '', brand: '', stock: '' });
      setUploadedImages([]);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/montures');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création de la monture');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Ajouter une Monture</h1>
          <p className="text-gray-600">Créez une nouvelle monture à vendre sur la marketplace</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Price and Stock - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (DH) <span className="text-red-500">*</span>
                </label>
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

            {/* Brand Field */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                Marque
              </label>
              <input
                id="brand"
                type="text"
                name="brand"
                placeholder="Ex: Ray-Ban, Oakley"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
              />
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Décrivez la monture en détail..."
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none resize-none"
              />
            </div>

            {/* Image Upload Field */}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                Images du produit
              </label>
              <div className="relative">
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
                  className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-200 flex flex-col items-center justify-center"
                >
                  <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700">Cliquez pour ajouter des images</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                </label>
              </div>
            </div>

            {/* Image Preview Grid */}
            {uploadedImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Images téléchargées ({uploadedImages.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImages(uploadedImages.filter((_, i) => i !== index));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{img.file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!priceError}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création en cours...
                </>
              ) : (
                'Créer la monture'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MontureForm;