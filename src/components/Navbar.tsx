import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LanguageSelector } from './LanguageSelector';
import { getTranslation } from '../utils/translations';
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const t = (key: any) => getTranslation(key, user?.language || 'en');

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'worker': return 'bg-green-100 text-green-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'government': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                <HeartIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HealthChain Kerala</h1>
                <p className="text-xs text-gray-500">Decentralized Health Records</p>
              </div>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {t(user.role === 'worker' ? 'migrantWorker' : user.role)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <UserCircleIcon className="h-6 w-6" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Cog6ToothIcon className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};