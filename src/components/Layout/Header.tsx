import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Bell, 
  Settings, 
  User, 
  Wifi, 
  WifiOff, 
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { offlineSyncManager } from '../../utils/offlineSync';

export function Header() {
  const { state, dispatch } = useAppContext();
  const t = useTranslation(state.language);
  
  const handleLanguageChange = (lang: any) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
    dispatch({ type: 'TOGGLE_LANGUAGE_SELECTOR' });
  };
  
  const handleSync = async () => {
    if (state.isOffline) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const syncedIds = await offlineSyncManager.syncOfflineActions(
        (progress) => dispatch({ type: 'SET_SYNC_PROGRESS', payload: progress })
      );
      
      dispatch({ type: 'SYNC_ACTIONS', payload: syncedIds });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Sync failed. Please try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_SYNC_PROGRESS', payload: 0 });
    }
  };
  
  return (
    <motion.header 
      className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Kerala Health</h1>
              <p className="text-sm text-gray-500">Digital Healthcare Platform</p>
            </div>
          </motion.div>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {state.isOffline ? (
              <motion.div 
                className="flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <WifiOff size={16} />
                <span className="text-sm font-medium">{t('offline')}</span>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <Wifi size={16} />
                <span className="text-sm font-medium">{t('online')}</span>
              </motion.div>
            )}
            
            {/* Sync Button */}
            {state.pendingActions.length > 0 && (
              <motion.button
                onClick={handleSync}
                disabled={state.isOffline || state.loading}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw size={16} className={state.loading ? 'animate-spin' : ''} />
                <span className="text-sm">
                  {t('sync')} ({state.pendingActions.length})
                </span>
              </motion.button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <motion.button
              onClick={() => dispatch({ type: 'TOGGLE_LANGUAGE_SELECTOR' })}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Globe size={18} />
              <span className="text-sm font-medium uppercase">
                {state.language}
              </span>
              <ChevronDown size={16} />
            </motion.button>
            
            {state.showLanguageSelector && (
              <motion.div
                className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {[
                  { code: 'en', name: 'English' },
                  { code: 'ml', name: 'മലയാളം' },
                  { code: 'hi', name: 'हिन्दी' }
                ].map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    {lang.name}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          
          {/* Notifications */}
          <motion.button 
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </motion.button>
          
          {/* Settings */}
          <motion.button 
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={20} />
          </motion.button>
          
          {/* User Profile */}
          {state.user && (
            <motion.div 
              className="flex items-center space-x-3 pl-4 border-l border-gray-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{state.user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{state.user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {state.user.avatar ? (
                  <img src={state.user.avatar} alt={state.user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-gray-600" />
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Sync Progress Bar */}
      {state.syncProgress > 0 && (
        <motion.div 
          className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${state.syncProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}
    </motion.header>
  );
}