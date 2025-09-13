'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { ToastContainer, ToastMessage } from '@/components/ui/Toast';
import { ErrorHandler } from '@/utils/errorHandler';

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = generateId();
    const newToast: ToastMessage = {
      id,
      autoClose: true,
      duration: 4000,
      ...toast,
    };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showToast({ type: 'success', message, title });
  }, [showToast]);

  const showError = useCallback((message: string, title?: string) => {
    showToast({ type: 'error', message, title, duration: 6000 });
  }, [showToast]);

  const showWarning = useCallback((message: string, title?: string) => {
    showToast({ type: 'warning', message, title, duration: 5000 });
  }, [showToast]);

  const showInfo = useCallback((message: string, title?: string) => {
    showToast({ type: 'info', message, title });
  }, [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Initialize ErrorHandler with toast functions
  useEffect(() => {
    ErrorHandler.setToastHandlers({
      showSuccess,
      showError,
      showWarning,
      showInfo,
    });
  }, [showSuccess, showError, showWarning, showInfo]);

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
