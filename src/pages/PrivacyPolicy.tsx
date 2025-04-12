import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, UserCheck, Database, Clock, Download, ArrowLeft, Home } from 'lucide-react';
import TouchFeedback from '../components/common/TouchFeedback';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de navigation fixe */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <TouchFeedback onClick={() => navigate(-1)}>
            <div className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Retour</span>
            </div>
          </TouchFeedback>

          <TouchFeedback onClick={() => navigate('/')}>
            <div className="flex items-center text-gray-600 hover:text-gray-900">
              <Home className="h-5 w-5 mr-2" />
              <span>Accueil</span>
            </div>
          </TouchFeedback>
        </div>
      </div>

      {/* Contenu avec padding-top pour compenser la barre fixe */}
      <div className="max-w-4xl mx-auto py-12 px-4 pt-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>

        <div className="prose prose-indigo max-w-none space-y-8">
          {/* Protection des données */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Protection de vos données</h2>
            </div>
            <p className="text-gray-600">
              Help Devoir s'engage à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>

          {/* Contact DPO */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Contact DPO</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Pour toute question concernant vos données personnelles, contactez notre Délégué à la Protection des Données (DPO) :
            </p>
            <a 
              href="mailto:dpo@helpdevoir.globacom3000.com"
              className="text-indigo-600 hover:text-indigo-800"
            >
              dpo@helpdevoir.globacom3000.com
            </a>
          </section>

          {/* Données collectées */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Données collectées</h2>
            </div>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Informations de compte (email, mot de passe crypté)</li>
              <li>Informations sur les élèves (prénom, âge, niveau scolaire)</li>
              <li>Données de progression et résultats scolaires</li>
              <li>Préférences d'apprentissage</li>
            </ul>
          </section>

          {/* Sécurité des données */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Sécurité des données</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Chiffrement des données sensibles</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Surveillance continue de la sécurité</li>
              <li>Sauvegardes régulières</li>
            </ul>
          </section>

          {/* Vos droits */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <UserCheck className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Vos droits</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition au traitement</li>
              <li>Droit de limitation du traitement</li>
            </ul>
          </section>

          {/* Conservation des données */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Conservation des données</h2>
            </div>
            <p className="text-gray-600">
              Nous conservons vos données pendant la durée de votre utilisation du service et jusqu'à 12 mois après la dernière connexion.
              Vous pouvez demander la suppression de votre compte à tout moment.
            </p>
          </section>

          {/* Exportation des données */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Download className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Exportation des données</h2>
            </div>
            <p className="text-gray-600">
              Vous pouvez demander une copie de vos données personnelles à tout moment.
              Contactez notre DPO pour effectuer cette demande.
            </p>
          </section>

          {/* Mise à jour */}
          <div className="text-sm text-gray-500 mt-8">
            <p>Dernière mise à jour : {new Date().toLocaleDateString()}</p>
          </div>

          {/* Bouton de retour */}
          <div className="flex justify-center mt-8">
            <TouchFeedback onClick={() => navigate(-1)}>
              <div className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Retour à la page précédente
              </div>
            </TouchFeedback>
          </div>
        </div>
      </div>
    </div>
  );
}