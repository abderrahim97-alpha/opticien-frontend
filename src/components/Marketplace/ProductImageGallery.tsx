import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { MontureImage } from '../../types/marketplace';

interface ProductImageGalleryProps {
  images: MontureImage[];
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const getImageUrl = (imageName: string) => {
    return `http://localhost:8000/uploads/images/${imageName}`;
  };

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl sm:rounded-2xl blur-xl opacity-30" />
        <div className="relative w-full h-64 sm:h-80 md:h-96 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl">
          <div className="text-center">
            <div className="relative inline-flex mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full blur-xl opacity-40" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-2xl">
                <ImageIcon className="text-white" size={32} />
              </div>
            </div>
            <p className="text-white/70 text-sm sm:text-base font-semibold">Aucune image disponible</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-300" />
        <div
          className="relative w-full h-64 sm:h-80 md:h-96 backdrop-blur-xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-2xl border border-white/10"
          onClick={() => setShowLightbox(true)}
        >
          <img
            src={getImageUrl(images[selectedIndex].imageName)}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-glasses.png';
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Zoom Hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 px-4 py-2 rounded-full">
              <p className="text-white text-sm font-bold flex items-center gap-2">
                <ImageIcon size={16} />
                Cliquez pour agrandir
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 p-2 sm:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} className="text-white sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 p-2 sm:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} className="text-white sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 backdrop-blur-md bg-black/60 border border-white/20 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative group/thumb overflow-hidden transition-all ${
                index === selectedIndex
                  ? 'ring-2 sm:ring-4 ring-blue-400 shadow-lg shadow-blue-500/50 scale-105'
                  : 'ring-1 sm:ring-2 ring-white/20 hover:ring-blue-300'
              }`}
              style={{ borderRadius: '0.5rem' }}
            >
              {/* Glow effect for selected */}
              {index === selectedIndex && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-lg opacity-50" />
              )}
              
              <div className="relative h-16 sm:h-20 md:h-24 backdrop-blur-sm bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src={getImageUrl(image.imageName)}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    index === selectedIndex ? '' : 'group-hover/thumb:scale-110'
                  }`}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-glasses.png';
                  }}
                />
                
                {/* Overlay on non-selected */}
                {index !== selectedIndex && (
                  <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/10 transition-colors" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 p-2 sm:p-3 rounded-full transition-colors z-10 group"
          >
            <X size={24} className="text-white group-hover:rotate-90 transition-transform duration-300 sm:w-7 sm:h-7" />
          </button>

          {/* Image Counter in Lightbox */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 backdrop-blur-md bg-black/60 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
              {selectedIndex + 1} / {images.length}
            </div>
          )}

          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Main Lightbox Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-2xl opacity-20" />
              <img
                src={getImageUrl(images[selectedIndex].imageName)}
                alt={`${productName} - Fullscreen`}
                className="relative w-full h-auto max-h-[90vh] object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Navigation Arrows in Lightbox */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 p-3 sm:p-4 rounded-full transition-all shadow-lg group"
                >
                  <ChevronLeft size={28} className="text-white group-hover:-translate-x-1 transition-transform sm:w-8 sm:h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 p-3 sm:p-4 rounded-full transition-all shadow-lg group"
                >
                  <ChevronRight size={28} className="text-white group-hover:translate-x-1 transition-transform sm:w-8 sm:h-8" />
                </button>
              </>
            )}

            {/* Thumbnail Navigation in Lightbox */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-full overflow-x-auto">
                <div className="flex gap-2 px-4">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIndex(index);
                      }}
                      className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden transition-all ${
                        index === selectedIndex
                          ? 'ring-2 sm:ring-4 ring-blue-400 scale-110'
                          : 'ring-1 sm:ring-2 ring-white/30 hover:ring-blue-300 opacity-70 hover:opacity-100'
                      }`}
                      style={{ borderRadius: '0.5rem' }}
                    >
                      <div className="backdrop-blur-sm bg-gradient-to-br from-gray-800 to-gray-900 w-full h-full">
                        <img
                          src={getImageUrl(image.imageName)}
                          alt={`Thumb ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-glasses.png';
                          }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;