export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

// For use in React components
let toastHandlers: {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
} | null = null;

export class ErrorHandler {
  static setToastHandlers(handlers: typeof toastHandlers) {
    toastHandlers = handlers;
  }

  static showError(message: string): void {
    if (toastHandlers) {
      toastHandlers.showError(message);
    } else {
      // Fallback for non-React contexts
      alert(`Error: ${message}`);
    }
    console.error('Error:', message);
  }

  static showSuccess(message: string): void {
    if (toastHandlers) {
      toastHandlers.showSuccess(message);
    } else {
      // Fallback for non-React contexts
      alert(`Success: ${message}`);
    }
    console.log('Success:', message);
  }

  static showWarning(message: string): void {
    if (toastHandlers) {
      toastHandlers.showWarning(message);
    } else {
      // Fallback for non-React contexts
      alert(`Warning: ${message}`);
    }
    console.warn('Warning:', message);
  }

  static showInfo(message: string): void {
    if (toastHandlers) {
      toastHandlers.showInfo(message);
    } else {
      // Fallback for non-React contexts
      alert(`Info: ${message}`);
    }
    console.info('Info:', message);
  }

  static handleApiError(error: unknown, defaultMessage: string = 'An unexpected error occurred'): void {
    let message = defaultMessage;
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
      message = error.message;
    }
    
    this.showError(message);
  }

  static async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    errorMessage: string = 'Operation failed'
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handleApiError(error, errorMessage);
      return null;
    }
  }

  // Remove confirmation dialogs - operations will proceed immediately with success notification
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static confirmAction(_message: string): boolean {
    // Parameter is intentionally unused - keeping for API compatibility
    return true; // Always proceed, show success notification after operation
  }
}
