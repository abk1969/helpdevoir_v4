import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Save, Settings } from 'lucide-react';
import { autoSave } from '../../utils/autoSave';
import TouchFeedback from '../common/TouchFeedback';
import toast from 'react-hot-toast';

const intervals = [
  { value: 5, label: '5 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 heure' }
];

export default function AutoBackupSettings() {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState(5);

  const handleIntervalChange = (minutes: number) => {
    autoSave.setInterval(minutes);
    setSelectedInterval(minutes);
    toast.success(`Sauvegarde automatique configurée : toutes les ${minutes} minutes`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Save className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-medium">Sauvegarde automatique</h3>
        </div>
        <TouchFeedback onClick={() => setShowSettings(!showSettings)}>
          <div className="p-2 rounded-lg hover:bg-gray-100">
            <Settings className="h-5 w-5 text-gray-600" />
          </div>
        </TouchFeedback>
      </div>

      <motion.div
        initial={false}
        animate={{ height: showSettings ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Intervalle de sauvegarde</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {intervals.map((interval) => (
              <TouchFeedback
                key={interval.value}
                onClick={() => handleIntervalChange(interval.value)}
              >
                <div className={`p-3 rounded-lg text-center ${
                  selectedInterval === interval.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  {interval.label}
                </div>
              </TouchFeedback>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}