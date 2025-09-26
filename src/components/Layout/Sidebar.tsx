import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Shield, 
  Heart, 
  BarChart3, 
  User, 
  LogOut,
  Stethoscope,
  Users,
  Activity
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { state, dispatch } = useAppContext();
  const t = useTranslation(state.language);
  
  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
      { id: 'records', label: t('records'), icon: FileText },
      { id: 'consent', label: t('consent'), icon: Shield },
      { id: 'welfare', label: t('welfare'), icon: Heart },
    ];
    
    const roleSpecificItems = {
      patient: [],
      doctor: [
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'consultations', label: 'Consultations', icon: Stethoscope },
      ],
      admin: [
        { id: 'analytics', label: t('analytics'), icon: BarChart3 },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'monitoring', label: 'System Monitoring', icon: Activity },
      ]
    };
    
    return [
      ...commonItems,
      ...(roleSpecificItems[state.user?.role as keyof typeof roleSpecificItems] || [])
    ];
  };
  
  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    dispatch({ type: 'SET_AUTH_METHOD', payload: null });
  };
  
  const menuItems = getMenuItems();
  
  return (
    <motion.aside 
      className="bg-white border-r border-gray-200 w-64 h-screen overflow-y-auto"
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon 
                size={20} 
                className={activeSection === item.id ? 'text-blue-600' : 'text-gray-400'} 
              />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>
        
        <div className="mt-8 pt-8 border-t border-gray-200 space-y-2">
          <motion.button
            onClick={() => onSectionChange('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              activeSection === 'profile'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <User size={20} className="text-gray-400" />
            <span className="font-medium">{t('profile')}</span>
          </motion.button>
          
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} />
            <span className="font-medium">{t('logout')}</span>
          </motion.button>
        </div>
        
        {/* User Role Badge */}
        <motion.div 
          className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-100"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              {state.user?.role === 'doctor' && <Stethoscope size={16} className="text-blue-600" />}
              {state.user?.role === 'patient' && <User size={16} className="text-blue-600" />}
              {state.user?.role === 'admin' && <BarChart3 size={16} className="text-blue-600" />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {state.user?.role} Portal
              </p>
              <p className="text-xs text-gray-500">
                {state.user?.role === 'doctor' && 'Medical Professional'}
                {state.user?.role === 'patient' && 'Healthcare Consumer'}
                {state.user?.role === 'admin' && 'System Administrator'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
}