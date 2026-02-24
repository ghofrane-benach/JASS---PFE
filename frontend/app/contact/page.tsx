// apps/frontend/app/contact/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    reason: 'customer_service',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = [
    { id: 'customer_service', label: 'Service Client', icon: '🛒' },
    { id: 'product_inquiry', label: 'Demande sur un Produit', icon: '👕' },
    { id: 'billing_issue', label: 'Problème de Facturation', icon: '💰' },
    { id: 'general_feedback', label: 'Retour Général', icon: '💬' },
    { id: 'other', label: 'Autre', icon: '❓' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.message.trim()) {
      setError('Veuillez entrer un message');
      setLoading(false);
      return;
    }

    try {
      // Simuler l'envoi (remplacer par appel API réel)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Réinitialiser le formulaire
      setFormData({
        reason: 'customer_service',
        message: '',
      });
      setSubmitted(true);
      
      // Réinitialiser après 5 secondes
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Chargement de la session
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-serif">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-6">
            Nous Sommes à Votre Écoute
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Contactez-nous pour toute question, suggestion ou problème. 
            Notre équipe répondra dans les plus brefs délais.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
            >
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-serif font-light mb-4">
                Merci pour votre message !
              </h2>
              <p className="text-gray-600">
                Nous vous répondrons dans les 24 heures. 
                Vérifiez vos courriels, y compris les spams.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-xl">
              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded mb-6">
                  {error}
                </div>
              )}

              {/* Message Field */}
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-serif mb-2">
                  Votre message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  placeholder="Décrivez votre demande ou problème..."
                />
              </div>

              {/* Reason Field */}
              <div className="mb-6">
                <label className="block text-sm font-serif mb-2">
                  Raison de votre contact *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {reasons.map((reason) => (
                    <button
                      key={reason.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, reason: reason.id })}
                      className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-colors ${
                        formData.reason === reason.id
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-3xl mb-2">{reason.icon}</span>
                      <span className="text-sm font-serif">{reason.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-black text-white font-serif text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    'Envoyer le Message'
                  )}
                </button>
              </div>
            </form>
          )}
          {/* Contact Information */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="font-serif mb-2">Notre Adresse</h3>
              <p className="text-gray-600">
                 Tunis, Tunisie<br />
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-serif mb-2">Contact</h3>
              <p className="text-gray-600">
                +216 12 345 678<br />
                jass@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-light mb-8 text-center">
            Questions Fréquentes
          </h2>
          
          <div className="space-y-4">
            {[
              {
                question: "Combien de temps faut-il pour obtenir une réponse ?",
                answer: "Nous répondons généralement dans les 24 heures ouvrables. Pour les demandes urgentes, veuillez indiquer 'URGENT' dans l'objet de votre message."
              },
              {
                question: "Puis-je retourner un produit ?",
                answer: "Oui, vous avez 5 jours à compter de la réception de votre commande pour retourner un produit. Veuillez consulter notre page 'Politique de Retour' pour plus de détails."
              },
              {
                question: "Comment puis-je modifier ma commande ?",
                answer: "Vous pouvez modifier votre commande dans les 2 heures suivant la confirmation. Contactez-nous immédiatement avec votre numéro de commande."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <h3 className="font-serif py-4 px-6 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
                  {faq.question}
                </h3>
                <div className="px-6 py-4 bg-white">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}