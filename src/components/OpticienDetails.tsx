import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Api/axios';

interface Image {
  "@id": string;
  "@type": string;
  imageName?: string;
}

interface OpticienDetail {
  "@id": string;
  "@type": string;
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  city?: string;
  images: Image[];
  adresse?: string;
  companyName?: string;
  ICE?: string;
}

const OpticienDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opticien, setOpticien] = useState<OpticienDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    fetchOpticienDetails(token);
  }, [id, navigate]);

  const fetchOpticienDetails = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/opticiens/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOpticien(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des détails');
      console.error('Error fetching opticien details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !opticien) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
          <p className="text-gray-600 mb-6">{error || 'Opticien non trouvé'}</p>
          <button
            onClick={() => navigate('/opticiens')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/opticiens')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8 font-medium transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
              {opticien.prenom.charAt(0)}{opticien.nom.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {opticien.prenom} {opticien.nom}
              </h1>
              {opticien.companyName && (
                <p className="text-xl text-gray-600 mb-4">{opticien.companyName}</p>
              )}
              <div className="flex flex-wrap gap-4">
                {opticien.telephone && (
                  <a
                    href={`tel:${opticien.telephone}`}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {opticien.telephone}
                  </a>
                )}
                {opticien.email && (
                  <a
                    href={`mailto:${opticien.email}`}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {opticien.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informations personnelles
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Nom complet</label>
                <p className="text-lg text-gray-900">{opticien.prenom} {opticien.nom}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Email</label>
                <p className="text-lg text-gray-900">{opticien.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Téléphone</label>
                <p className="text-lg text-gray-900">{opticien.telephone || 'Non renseigné'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Ville</label>
                <p className="text-lg text-gray-900">{opticien.city || 'Non renseigné'}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1M9 7a3 3 0 016 0m0 0a3 3 0 016 0m-9 11h7m-4-7h4" />
              </svg>
              Informations professionnelles
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Nom de l'entreprise</label>
                <p className="text-lg text-gray-900">{opticien.companyName || 'Non renseigné'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Adresse</label>
                <p className="text-lg text-gray-900">{opticien.adresse || 'Non renseigné'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Numéro ICE</label>
                <p className="text-lg text-gray-900 font-mono">{opticien.ICE || 'Non renseigné'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">ID Opticien</label>
                <p className="text-lg text-gray-900 font-mono">#{id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Images Section */}
        {opticien.images && opticien.images.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
              Galerie photos ({opticien.images.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {opticien.images.map((image, index) => {
                // Construct the image URL using the imageName from VichUploadBundle
                const imageUrl = `http://127.0.0.1:8000/uploads/opticiens/${image.imageName}`;
                
                return (
                  <div
                    key={index}
                    className="relative bg-gray-200 rounded-lg overflow-hidden h-48 group cursor-pointer"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={imageUrl}
                      alt={image.imageName || `Image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.currentTarget.parentElement as HTMLElement).innerHTML = `
                          <div class="w-full h-full bg-gray-300 flex items-center justify-center">
                            <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                            </svg>
                          </div>
                        `;
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-200 flex items-center justify-center">
                      <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 text-center px-2">
                        {image.imageName || `Image ${index + 1}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(!opticien.images || opticien.images.length === 0) && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600">Aucune image disponible</p>
          </div>
        )}

        {/* Image Lightbox Modal */}
        {selectedImageIndex !== null && opticien.images && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedImageIndex(null)}
          >
            <div 
              className="relative w-full max-w-4xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Inside Top Right */}
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition z-10 shadow-lg"
                title="Fermer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Main Image */}
              <img
                src={`http://127.0.0.1:8000/uploads/opticiens/${opticien.images[selectedImageIndex].imageName}`}
                alt={`Full view ${selectedImageIndex + 1}`}
                className="w-full h-auto rounded-lg max-h-[70vh] object-contain"
              />

              {/* Image Counter */}
              <div className="text-center mt-4 text-white">
                <p className="text-sm font-medium">
                  Image {selectedImageIndex + 1} sur {opticien.images.length}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {opticien.images[selectedImageIndex].imageName}
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-6 gap-4">
                <button
                  onClick={() => setSelectedImageIndex(selectedImageIndex === 0 ? opticien.images.length - 1 : selectedImageIndex - 1)}
                  className="bg-white hover:bg-gray-200 text-black p-3 rounded-lg transition flex items-center gap-2 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Précédent
                </button>

                {/* Thumbnail Strip */}
                <div className="flex gap-2 justify-center flex-wrap max-w-2xl">
                  {opticien.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-12 h-12 rounded-lg overflow-hidden transition ${
                        index === selectedImageIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={`http://127.0.0.1:8000/uploads/opticiens/${image.imageName}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedImageIndex(selectedImageIndex === opticien.images.length - 1 ? 0 : selectedImageIndex + 1)}
                  className="bg-white hover:bg-gray-200 text-black p-3 rounded-lg transition flex items-center gap-2 shadow-lg"
                >
                  Suivant
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpticienDetails;