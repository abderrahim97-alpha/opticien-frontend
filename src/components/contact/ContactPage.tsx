import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ContactPage.css'; // ⭐ IMPORT CSS
import api from '../../Api/axios';

// Fix for default marker icon in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  userType: 'client' | 'opticien' | 'autre';
}

interface FormErrors {
  [key: string]: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    userType: 'client'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Coordinates for Casablanca, Morocco
  const position: [number, number] = [33.5731, -7.5898];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const response = await api.post('/contact', formData);
      
      if (response.data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          userType: 'client'
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setSubmitError(error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2">
              Contactez-nous
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-blue-200">
              Une question ? Besoin d'aide ? Notre équipe est à votre écoute
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {/* Email Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Email</h3>
                <p className="text-xs sm:text-sm text-blue-200 break-all">contact@opti-maroc.com</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Téléphone</h3>
                <p className="text-xs sm:text-sm text-blue-200">+212 5XX-XXXXXX</p>
              </div>
            </div>

            {/* Address Card */}
            <div className="relative group sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Adresse</h3>
                <p className="text-xs sm:text-sm text-blue-200">Casablanca, Maroc</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Contact Form */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-white/5 border-b border-white/20 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-bold text-white">Envoyez-nous un message</h2>
              </div>
              <div className="p-4 sm:p-6">
                {submitSuccess && (
                  <div className="mb-4 sm:mb-6 backdrop-blur-xl bg-green-500/20 border-2 border-green-400/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white font-bold text-xs sm:text-sm">
                        Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                      </p>
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="mb-4 sm:mb-6 backdrop-blur-xl bg-red-500/20 border-2 border-red-400/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white font-bold text-xs sm:text-sm">{submitError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-sm bg-white/10 border ${
                          errors.name ? 'border-red-400' : 'border-white/20'
                        } rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors`}
                        placeholder="Votre nom"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-300 font-semibold">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-sm bg-white/10 border ${
                          errors.email ? 'border-red-400' : 'border-white/20'
                        } rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors`}
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-300 font-semibold">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="+212 XXX-XXXXXX"
                      />
                    </div>

                    {/* User Type */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                        Vous êtes *
                      </label>
                      <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-blue-400 transition-colors"
                      >
                        <option value="client" className="bg-slate-900">Client</option>
                        <option value="opticien" className="bg-slate-900">Opticien</option>
                        <option value="autre" className="bg-slate-900">Autre</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-sm bg-white/10 border ${
                        errors.subject ? 'border-red-400' : 'border-white/20'
                      } rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors`}
                      placeholder="Sujet de votre message"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-300 font-semibold">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-sm bg-white/10 border ${
                        errors.message ? 'border-red-400' : 'border-white/20'
                      } rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors resize-none`}
                      placeholder="Votre message..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-300 font-semibold">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* OpenStreetMap with Leaflet - DARK THEME */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-white/5 border-b border-white/20 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-bold text-white">Notre localisation</h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="rounded-lg sm:rounded-xl overflow-hidden shadow-lg h-64 sm:h-80 lg:h-96 border-2 border-white/10">
                  <MapContainer
                    center={position}
                    zoom={14}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
                  >        
                    <TileLayer
                      attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                      url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                    />
                    <Marker position={position}>
                      <Popup>
                        <div style={{ textAlign: 'center', padding: '8px' }}>
                          <strong style={{ fontSize: '18px', display: 'block', marginBottom: '8px' }}>
                            📍 Opti-Marketplace
                          </strong>
                          <p style={{ fontSize: '14px', marginTop: '8px', marginBottom: '8px', fontWeight: '600' }}>
                            Casablanca, Maroc
                          </p>
                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                            <p style={{ fontSize: '12px', marginBottom: '4px' }}>
                              <strong>📧</strong> contact@opti-maroc.com
                            </p>
                            <p style={{ fontSize: '12px', marginTop: '4px' }}>
                              <strong>📱</strong> +212 5XX-XXXXXX
                            </p>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>

                {/* Additional Info */}
                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide">Horaires</h3>
                        <p className="text-white text-xs sm:text-sm font-semibold">Lun-Ven: 9h - 18h</p>
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wide">Réponse</h3>
                        <p className="text-white text-xs sm:text-sm font-semibold">Sous 24-48h</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ContactPage;