import { createContext, useState, useContext, useCallback } from 'react';
import Popup from '../components/Popup';

const PopupContext = createContext();

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState({
    isOpen: false,
    message: '',
    type: 'success', // 'success', 'error', 'info'
  });

  const showPopup = useCallback((message, type = 'success') => {
    setPopup({ isOpen: true, message, type });
    
    // Automatically close after 4 seconds
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, isOpen: false }));
    }, 4000);
  }, []);

  const closePopup = useCallback(() => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      <Popup 
        isOpen={popup.isOpen} 
        message={popup.message} 
        type={popup.type} 
        onClose={closePopup} 
      />
    </PopupContext.Provider>
  );
}

export function usePopup() {
  return useContext(PopupContext);
}
