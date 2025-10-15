import React, { useState, useEffect } from 'react';
import api from '../Api/axios';
import { useNavigate } from 'react-router-dom';

interface Image {
  "@id": string;
  "@type": string;
  imageName?: string;
}

interface Opticien {
  "@id": string;
  "@type": string;
  nom: string;
  prenom: string;
  telephone: string;
  city: string;
  images: Image[];
  adresse?: string;
  companyName?: string;
  ICE?: string;
}

const OpticienList: React.FC = () => {
  const [opticiens, setOpticiens] = useState<Opticien[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredOpticiens, setFilteredOpticiens] = useState<Opticien[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
        // Check token before fetching
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    fetchOpticiens(token);
  }, []);

  useEffect(() => {
    // Filter opticiens based on search term
    const filtered = opticiens.filter(
      (opticien) =>
        opticien.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opticien.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opticien.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opticien.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
    setFilteredOpticiens(filtered);
  }, [searchTerm, opticiens]);

  const fetchOpticiens = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/opticiens',{
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in header
        },
      });
      setOpticiens(response.data.member || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des opticiens');
      console.error('Error fetching opticiens:', err);
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
          <p className="text-gray-600 font-medium">Chargement des opticiens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nos Opticiens</h1>
          <p className="text-gray-600">Découvrez nos partenaires opticiens dans votre région</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-start">
            <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher par nom, ville ou entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Affichage de <span className="font-medium text-gray-900">{filteredOpticiens.length}</span> résultat{filteredOpticiens.length !== 1 ? 's' : ''} sur <span className="font-medium text-gray-900">{opticiens.length}</span>
          </p>
        </div>

        {/* Opticiens Grid */}
        {filteredOpticiens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpticiens.map((opticien) => (
              <div key={opticien["@id"]} className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2"></div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Profile Section */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {opticien.prenom.charAt(0)}{opticien.nom.charAt(0)}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {opticien.prenom} {opticien.nom}
                      </h3>
                      {opticien.companyName && (
                        <p className="text-sm text-gray-600">{opticien.companyName}</p>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    {/* City */}
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">{opticien.city}</span>
                    </div>

                    {/* Phone */}
                    {opticien.telephone && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${opticien.telephone}`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          {opticien.telephone}
                        </a>
                      </div>
                    )}

                    {/* Address */}
                    {opticien.adresse && (
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <span className="text-sm text-gray-700">{opticien.adresse}</span>
                      </div>
                    )}

                    {/* ICE Number */}
                    {opticien.ICE && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <span className="text-sm text-gray-700">ICE: {opticien.ICE}</span>
                      </div>
                    )}
                  </div>

                  {/* Images Count */}
                  {opticien.images && opticien.images.length > 0 && (
                    <div className="pt-4 border-t border-gray-100 flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                      </svg>
                      {opticien.images.length} image{opticien.images.length !== 1 ? 's' : ''}
                    </div>
                  )}

                  {/* View Button */}
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200">
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun résultat trouvé</h3>
            <p className="text-gray-600">Essayez avec d'autres termes de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpticienList;