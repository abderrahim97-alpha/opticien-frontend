import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Api/axios';

interface Image {
  "@id": string;
  "@type": string;
  imageName?: string;
}

interface Owner {
  "@id": string;
  id?: string;
  nom: string;
  prenom: string;
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
  status?: string;
  createdAt: string;
  updatedAt?: string;
  images: Image[];
  owner: Owner;
}

interface CurrentUser {
  id: string;
  email: string;
  roles: string[];
}

const MontureDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [monture, setMonture] = useState<MontureDetail | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }
    fetchCurrentUser(token);
    fetchMontureDetails(token);
  }, [id, navigate]);

  // Debug useEffect
  useEffect(() => {
    if (currentUser) {
      console.log('Current User:', currentUser);
      console.log('Is Admin?', isAdmin());
      console.log('Roles:', currentUser.roles);
    }
    if (monture) {
      console.log('Monture:', monture);
      console.log('Monture Status:', monture.status);
      console.log('Status lowercase:', monture.status?.toLowerCase());
    }
  }, [currentUser, monture]);

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(response.data);
    } catch (err: any) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchMontureDetails = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/montures/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMonture(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des détails');
      console.error('Error fetching monture details:', err);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = (): boolean => {
    if (!currentUser || !monture || !monture.owner) return false;
    const ownerIdFromIri = monture.owner["@id"]?.split('/').pop();
    return currentUser.id === ownerIdFromIri || currentUser.id === monture.owner.id;
  };

  const isAdmin = (): boolean => {
    return currentUser?.roles?.includes('ROLE_ADMIN') || false;
  };

  const isPending = (): boolean => {
    if (!monture?.status) return false;
    return monture.status.toLowerCase() === 'pending';
  };

  const handleEdit = () => {
    navigate(`/montures/${id}/edit`);
  };

  const handleApprove = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir approuver cette monture ?')) {
      return;
    }

    setStatusUpdateLoading(true);
    setStatusMessage('');

    try {
      const token = localStorage.getItem('token');
      await api.patch(`/montures/${id}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatusMessage('Monture approuvée avec succès !');
      if (token) fetchMontureDetails(token);
    } catch (err: any) {
      setStatusMessage('Erreur lors de l\'approbation');
      console.error('Error approving monture:', err);
    } finally {
      setStatusUpdateLoading(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir rejeter cette monture ?')) {
      return;
    }

    setStatusUpdateLoading(true);
    setStatusMessage('');

    try {
      const token = localStorage.getItem('token');
      await api.patch(`/montures/${id}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatusMessage('Monture rejetée');
      if (token) fetchMontureDetails(token);
    } catch (err: any) {
      setStatusMessage('Erreur lors du rejet');
      console.error('Error rejecting monture:', err);
    } finally {
      setStatusUpdateLoading(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const getStatusBadge = (status?: string) => {
    const lowerStatus = status?.toLowerCase();
    
    switch (lowerStatus) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Approuvé
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Rejeté
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            En attente
          </span>
        );
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

  if (error || !monture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
          <p className="text-gray-600 mb-6">{error || 'Monture non trouvée'}</p>
          <button
            onClick={() => navigate('/montures')}
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
        {/* Back Button and Edit Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/montures')}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la liste
          </button>

          <div className="flex items-center gap-3">
            {isOwner() && (
              <button
                onClick={handleEdit}
                className="flex items-center bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-md font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </button>
            )}
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            statusMessage.includes('succès') || statusMessage.includes('approuvée') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : statusMessage.includes('Erreur')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <p className="font-medium">{statusMessage}</p>
          </div>
        )}

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {monture.name.substring(0, 2).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">{monture.name}</h1>
                {getStatusBadge(monture.status)}
              </div>
              {monture.brand && <p className="text-xl text-gray-600 mb-4">Marque: {monture.brand}</p>}
              <p className="text-3xl font-bold text-blue-600 mb-2">{monture.price.toFixed(2)} DH</p>
              {monture.stock !== undefined && (
                <p className={`text-lg font-medium ${monture.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {monture.stock > 0 ? `${monture.stock} en stock` : 'Rupture de stock'}
                </p>
              )}
            </div>
          </div>

          {/* Admin Status Control Buttons */}
          {isAdmin() && isPending() && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Actions administrateur</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={statusUpdateLoading}
                  className="flex-1 flex items-center justify-center bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {statusUpdateLoading ? 'Traitement...' : 'Approuver'}
                </button>
                <button
                  onClick={handleReject}
                  disabled={statusUpdateLoading}
                  className="flex-1 flex items-center justify-center bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {statusUpdateLoading ? 'Traitement...' : 'Rejeter'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Description
          </h2>

          {monture.description ? (
            <p className="text-lg text-gray-700 leading-relaxed mb-6">{monture.description}</p>
          ) : (
            <p className="text-gray-500 mb-6">Aucune description disponible</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Prix</label>
              <p className="text-2xl font-bold text-blue-600">{monture.price.toFixed(2)} DH</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Stock disponible</label>
              <p className={`text-xl font-medium ${monture.stock && monture.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monture.stock !== undefined ? `${monture.stock} unités` : 'Non renseigné'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Marque</label>
              <p className="text-lg text-gray-900">{monture.brand || 'Non renseigné'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Date de création</label>
              <p className="text-lg text-gray-900">{new Date(monture.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Statut</label>
              <div className="mt-1">
                {getStatusBadge(monture.status)}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Propriétaire</label>
              <p className="text-lg text-gray-900">
                {monture.owner.prenom} {monture.owner.nom}
              </p>
            </div>
          </div>
        </div>

        {/* Images Section */}
        {monture.images && monture.images.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
              Galerie photos ({monture.images.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monture.images.map((image, index) => {
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
                        Cliquez pour agrandir
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(!monture.images || monture.images.length === 0) && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600">Aucune image disponible</p>
          </div>
        )}

        {/* Image Lightbox Modal */}
        {selectedImageIndex !== null && monture.images && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedImageIndex(null)}
          >
            <div
              className="relative w-full max-w-4xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition z-10 shadow-lg"
                title="Fermer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <img
                src={`http://127.0.0.1:8000/uploads/opticiens/${monture.images[selectedImageIndex].imageName}`}
                alt={`Full view ${selectedImageIndex + 1}`}
                className="w-full h-auto rounded-lg max-h-[70vh] object-contain"
              />

              <div className="text-center mt-4 text-white">
                <p className="text-sm font-medium">
                  Image {selectedImageIndex + 1} sur {monture.images.length}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {monture.images[selectedImageIndex].imageName}
                </p>
              </div>

              <div className="flex justify-between items-center mt-6 gap-4">
                <button
                  onClick={() =>
                    setSelectedImageIndex(selectedImageIndex === 0 ? monture.images.length - 1 : selectedImageIndex - 1)
                  }
                  className="bg-white hover:bg-gray-200 text-black p-3 rounded-lg transition flex items-center gap-2 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Précédent
                </button>

                <div className="flex gap-2 justify-center flex-wrap max-w-2xl">
                  {monture.images.map((image, index) => (
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
                  onClick={() =>
                    setSelectedImageIndex(
                      selectedImageIndex === monture.images.length - 1 ? 0 : selectedImageIndex + 1
                    )
                  }
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

export default MontureDetails;