import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
];

export const LanguageSelector: React.FC = () => {
  const { user, updateLanguage } = useAuth();

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
        <GlobeAltIcon className="h-5 w-5" />
        <span>{languages.find(lang => lang.code === user?.language)?.native}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <div className="py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => updateLanguage(lang.code as any)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                user?.language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span className="font-medium">{lang.native}</span>
              <span className="text-gray-500 ml-2">({lang.name})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};