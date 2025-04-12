import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Shield, 
  Mail, 
  Phone,
  MapPin,
  BookOpen,
  Heart,
  Zap,
  Globe,
  MessageSquare,
  HelpCircle,
  FileText,
  Users,
  Briefcase
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/helpdevoir', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/helpdevoir', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/helpdevoir', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/helpdevoir', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Help Devoir */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold">Help Devoir</span>
            </div>
            <p className="text-gray-400 mb-4">
              Solution innovante pour accompagner la réussite scolaire de vos enfants, avec des parcours adaptés et un suivi personnalisé.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Blog éducatif
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Recrutement
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Devenir partenaire
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations légales</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-400 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Gestion des cookies
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                  Accessibilité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:contact@helpdevoir.globacom3000.com"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  contact@helpdevoir.globacom3000.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:0758538374"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  07 58 53 83 74
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-400" />
                <address className="text-gray-400 not-italic">
                  6 Rue Charles BAUDELAIRES<br />
                  91610 Ballancourt sur Essonne<br />
                  France
                </address>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-indigo-400" />
              <span className="text-gray-400">Données sécurisées</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-400">
              <span>Powered by</span>
              <div className="flex items-center text-indigo-400 font-bold">
                <Zap className="h-4 w-4 mr-1" />
                GLOBACOM3000
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-400">
            <div className="flex flex-wrap justify-center gap-4 mb-2">
              <Link to="/rgpd" className="hover:text-white transition-colors">RGPD</Link>
              <Link to="/legal" className="hover:text-white transition-colors">Mentions légales</Link>
              <Link to="/sitemap" className="hover:text-white transition-colors">Plan du site</Link>
              <a 
                href="mailto:dpo@helpdevoir.globacom3000.com" 
                className="hover:text-white transition-colors"
              >
                DPO
              </a>
            </div>
            <p>
              © {currentYear} Help Devoir. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}