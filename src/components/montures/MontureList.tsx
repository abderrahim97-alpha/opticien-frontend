import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/axios";

interface Image {
  "@id": string;
  "@type": string;
  imageName?: string;
}

interface Monture {
  "@id": string;
  "@type": string;
  id: number;
  name: string;
  description?: string;
  price: number;
  brand?: string;
  stock?: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
  images: Image[];
  owner: {
    "@id": string;
    nom: string;
    prenom: string;
  };
}

const MontureList: React.FC = () => {
  const navigate = useNavigate();
  const [montures, setMontures] = useState<Monture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredMontures, setFilteredMontures] = useState<Monture[]>([]);
  const [filterBrand, setFilterBrand] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    fetchMontures(token);
  }, [navigate]);

  useEffect(() => {
    // Filtering logic
    const filtered = montures.filter((monture) => {
      const matchesSearch =
        monture.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monture.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monture.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand = !filterBrand || monture.brand === filterBrand;
      return matchesSearch && matchesBrand;
    });

    setFilteredMontures(filtered);
  }, [searchTerm, filterBrand, montures]);

  const fetchMontures = async (token: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/my-montures", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Montures response:", response.data.member);

      const mappedMontures =
        (response.data.member || []).map((m: any) => ({
          ...m,
          status: m.status || "pending", // Fallback for older data
        })) ?? [];

      setMontures(mappedMontures);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erreur lors du chargement des montures"
      );
      console.error("Error fetching montures:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette monture ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/montures/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMontures((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const uniqueBrands = Array.from(
    new Set(montures.map((m) => m.brand).filter(Boolean))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0
               c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600 font-medium">
            Chargement des montures...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Mes Montures
            </h1>
            <p className="text-sm text-gray-600">
              Gérez vos montures à vendre
            </p>
          </div>
          <button
            onClick={() => navigate("/montures/create")}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Ajouter une monture
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-start">
            <svg
              className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 
                1 0 00-1.414 1.414L8.586 10l-1.293 
                1.293a1 1 0 101.414 1.414L10 11.414l1.293 
                1.293a1 1 0 001.414-1.414L11.414 
                10l1.293-1.293a1 1 0 00-1.414-1.414L10 
                8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Search and Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 
                11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les marques</option>
            {uniqueBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 mb-6">
          Affichage de{" "}
          <span className="font-medium text-gray-900">
            {filteredMontures.length}
          </span>{" "}
          monture{filteredMontures.length !== 1 ? "s" : ""} sur{" "}
          <span className="font-medium text-gray-900">{montures.length}</span>
        </p>

        {/* Montures Grid */}
        {filteredMontures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMontures.map((monture) => (
              <div
                key={monture.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100"
              >
                {/* Image */}
                {monture.images && monture.images.length > 0 ? (
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={`http://127.0.0.1:8000/uploads/opticiens/${monture.images[0].imageName}`}
                      alt={monture.name}
                      className="w-full h-full object-cover hover:scale-110 transition"
                      onError={(e) => {
                        (e.currentTarget.parentElement as HTMLElement).innerHTML = `
                          <div class='w-full h-full bg-gray-300 flex items-center justify-center'>
                            <svg class='w-12 h-12 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                              <path d='M4 3a2 2 0 00-2 2v10a2 
                              2 0 002 2h12a2 2 0 002-2V5a2 
                              2 0 00-2-2H4zm12 12H4l4-8 
                              3 6 2-4 3 6z' />
                            </svg>
                          </div>`;
                      }}
                    />
                    {monture.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        +{monture.images.length - 1}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-gray-300 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 3a2 2 0 00-2 2v10a2 
                      2 0 002 2h12a2 2 0 002-2V5a2 
                      2 0 00-2-2H4zm12 12H4l4-8 
                      3 6 2-4 3 6z" />
                    </svg>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {monture.name}
                  </h3>

                  {monture.brand && (
                    <p className="text-sm text-gray-600 mb-1">
                      Marque : {monture.brand}
                    </p>
                  )}

                  {/* Status badge */}
                  <p
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3
                    ${
                      monture.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : monture.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {monture.status === "approved"
                      ? "Approuvée"
                      : monture.status === "pending"
                      ? "En attente"
                      : "Rejetée"}
                  </p>

                  {monture.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                      {monture.description}
                    </p>
                  )}

                  {/* Price and Stock */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {monture.price.toFixed(2)} DH
                      </p>
                      {monture.stock !== undefined && (
                        <p
                          className={`text-sm font-medium ${
                            monture.stock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {monture.stock > 0
                            ? `${monture.stock} en stock`
                            : "Rupture de stock"}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    Créé le{" "}
                    {new Date(monture.createdAt).toLocaleDateString("fr-FR")}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/montures/${monture.id}`)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Voir détails
                    </button>
                    <button
                      onClick={() => handleDelete(monture.id)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 
                00-2-2H6a2 2 0 
                00-2 2v7m16 0v5a2 
                2 0 01-2 2H6a2 2 0 
                01-2-2v-5m16 0h-2.586a1 
                1 0 00-.707.293l-2.414 
                2.414a1 1 0 01-.707.293h-3.172a1 
                1 0 01-.707-.293l-2.414-2.414A1 
                1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Aucune monture trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore créé de monture
            </p>
            <button
              onClick={() => navigate("/montures/create")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition inline-flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Créer une monture
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MontureList;
