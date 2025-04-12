import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Shield,
  Bell,
  Users,
  Mail,
  Database,
  Palette,
  MessageSquare,
  Globe,
  Code,
  Lock,
  BookOpen,
  Brain,
  Ear,
  Gauge,
  Server,
  Save
} from 'lucide-react';
import BackupDashboard from '../components/backup/BackupDashboard';

// Composants des sections
const GeneralSettings = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Configuration générale</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom de l'établissement</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            defaultValue="Help Devoir"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fuseau horaire</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option>Europe/Paris</option>
            <option>Europe/London</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

const SecuritySettings = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Sécurité et authentification</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Double authentification</h4>
            <p className="text-sm text-gray-500">Renforcer la sécurité des comptes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>
    </div>
  </div>
);

type SettingSection = {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  component: React.ElementType;
};

const sections: SettingSection[] = [
  { 
    id: 'general', 
    title: 'Général', 
    icon: Settings, 
    description: 'Paramètres généraux de l\'application',
    component: GeneralSettings 
  },
  { 
    id: 'security', 
    title: 'Sécurité', 
    icon: Shield, 
    description: 'Paramètres de sécurité et authentification',
    component: SecuritySettings 
  },
  { 
    id: 'backup', 
    title: 'Sauvegardes', 
    icon: Save, 
    description: 'Gestion des sauvegardes et restaurations',
    component: BackupDashboard 
  }
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || GeneralSettings;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 md:col-span-3">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <span className="ml-3 font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main content */}
            <div className="col-span-12 md:col-span-9">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ActiveComponent />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}