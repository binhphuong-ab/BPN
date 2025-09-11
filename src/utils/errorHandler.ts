export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

export class ErrorHandler {
  static showError(message: string): void {
    // For now using alert, could be replaced with a toast library
    alert(`Error: ${message}`);
    console.error('Error:', message);
  }

  static showSuccess(message: string): void {
    // For now using alert, could be replaced with a toast library
    alert(`Success: ${message}`);
    console.log('Success:', message);
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

  static confirmAction(message: string): boolean {
    return confirm(message);
  }
}
