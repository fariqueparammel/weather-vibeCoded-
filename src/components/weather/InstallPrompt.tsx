import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaTimes } from 'react-icons/fa';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    // Hide the app provided install prompt
    setShowPrompt(false);
    
    // Show the install prompt
    if (deferredPrompt) {
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        // Clear the saved prompt since it can't be used again
        setDeferredPrompt(null);
      });
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <motion.div 
      className="install-prompt position-fixed bottom-0 start-0 end-0 p-3 bg-white shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-1">Install Weather App</h5>
          <p className="mb-0 text-muted">Add to your home screen for quick access</p>
        </div>
        <div className="d-flex">
          <button 
            className="btn btn-primary me-2"
            onClick={handleInstallClick}
          >
            <FaDownload className="me-2" />
            Install
          </button>
          <button 
            className="btn btn-outline-secondary"
            onClick={dismissPrompt}
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InstallPrompt;
