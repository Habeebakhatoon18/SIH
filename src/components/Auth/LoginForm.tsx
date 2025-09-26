import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  QrCode, 
  Phone, 
  Key, 
  Fingerprint,
  ArrowRight,
  Shield,
  Smartphone
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { AuthService } from '../../services/mockApi';

export function LoginForm() {
  const { state, dispatch } = useAppContext();
  const t = useTranslation(state.language);
  
  const [step, setStep] = useState<'method' | 'aadhaar' | 'otp' | 'biometric'>('method');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricScanning, setBiometricScanning] = useState(false);
  
  const handleMethodSelect = (method: 'aadhaar' | 'qr') => {
    dispatch({ type: 'SET_AUTH_METHOD', payload: method });
    if (method === 'aadhaar') {
      setStep('aadhaar');
    } else {
      // For demo purposes, simulate QR scan success
      simulateQRLogin();
    }
  };
  
  const simulateQRLogin = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockUser = {
      id: '2',
      name: 'Dr. Rajesh Kumar',
      role: 'doctor' as const,
      aadhaar: '9876-5432-1098',
      phone: '+91-9123456789',
      email: 'rajesh.kumar@hospital.com',
      avatar: 'https://images.pexels.com/photos/612807/pexels-photo-612807.jpeg?w=150&h=150&fit=crop&crop=face'
    };
    
    dispatch({ type: 'SET_USER', payload: mockUser });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    setIsLoading(false);
  };
  
  const handleAadhaarSubmit = async () => {
    if (aadhaarNumber.length !== 12 || phoneNumber.length !== 10) {
      setError('Please enter valid Aadhaar and phone numbers');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await AuthService.sendOTP(aadhaarNumber, phoneNumber);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOTPVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const user = await AuthService.verifyOTP(otp);
      if (user) {
        // Proceed to biometric for enhanced security
        setStep('biometric');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBiometricAuth = async () => {
    setBiometricScanning(true);
    setError('');
    
    try {
      const success = await AuthService.biometricAuth('fingerprint_data');
      if (success) {
        const user = await AuthService.verifyOTP(otp); // Get user data
        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      } else {
        setError('Biometric authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Biometric scanner error. Please try again.');
    } finally {
      setBiometricScanning(false);
    }
  };
  
  const skipBiometric = async () => {
    // Allow skip for demo purposes
    const user = await AuthService.verifyOTP(otp);
    dispatch({ type: 'SET_USER', payload: user });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-6">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('welcome')}
          </h1>
          <p className="text-gray-600">
            Secure • Digital • Accessible
          </p>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {step === 'method' && (
            <motion.div
              key="method"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <motion.button
                onClick={() => handleMethodSelect('aadhaar')}
                className="w-full bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard size={24} className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">
                      {t('aadhaarLogin')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      UIDAI compliant authentication
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-gray-400 ml-auto" />
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => handleMethodSelect('qr')}
                className="w-full bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-teal-300 hover:shadow-md transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <QrCode size={24} className="text-teal-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">
                      {t('qrLogin')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quick authentication with QR
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-gray-400 ml-auto" />
                </div>
              </motion.button>
            </motion.div>
          )}
          
          {step === 'aadhaar' && (
            <motion.div
              key="aadhaar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-4">
                {t('enterAadhaar')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('aadhaarNumber')}
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123456789012"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('phoneNumber')}
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="9876543210"
                  />
                </div>
                
                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
                
                <motion.button
                  onClick={handleAadhaarSubmit}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone size={20} />
                  <span>{isLoading ? t('loading') : t('generateOTP')}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-4">
                {t('verifyOTP')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('enterOTP')}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                    placeholder="123456"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Demo OTP: 123456
                  </p>
                </div>
                
                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
                
                <motion.button
                  onClick={handleOTPVerify}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Key size={20} />
                  <span>{isLoading ? t('loading') : t('verifyOTP')}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {step === 'biometric' && (
            <motion.div
              key="biometric"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-4">
                {t('biometricAuth')}
              </h2>
              
              <div className="text-center space-y-6">
                <div className="relative">
                  <motion.div
                    className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center ${
                      biometricScanning ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                    }`}
                    animate={biometricScanning ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                    transition={{ repeat: biometricScanning ? Infinity : 0, duration: 1 }}
                  >
                    <Fingerprint 
                      size={48} 
                      className={biometricScanning ? 'text-blue-600' : 'text-gray-400'} 
                    />
                  </motion.div>
                  
                  {biometricScanning && (
                    <motion.div
                      className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-blue-500"
                      animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>
                
                <div>
                  <p className="text-gray-700 mb-2">
                    {biometricScanning ? 'Scanning fingerprint...' : t('scanFingerprint')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Enhanced security verification
                  </p>
                </div>
                
                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
                
                <div className="space-y-3">
                  <motion.button
                    onClick={handleBiometricAuth}
                    disabled={biometricScanning}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {biometricScanning ? 'Scanning...' : 'Start Biometric Scan'}
                  </motion.button>
                  
                  <button
                    onClick={skipBiometric}
                    className="w-full text-gray-600 py-2 text-sm hover:text-gray-900"
                  >
                    Skip biometric (Demo)
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Loading QR */}
        {isLoading && state.authMethod === 'qr' && (
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Smartphone size={32} className="text-teal-600" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Authenticating...</h3>
            <p className="text-gray-600">Please wait while we verify your QR code</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}