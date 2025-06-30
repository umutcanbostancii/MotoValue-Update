// Error Handling Utility - Merkezi hata yönetimi
import { toast } from 'react-hot-toast';

// Custom Error Types
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CALCULATION_ERROR = 'CALCULATION_ERROR',
  DATA_NOT_FOUND = 'DATA_NOT_FOUND',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly userMessage: string;
  public readonly technicalMessage: string;
  public readonly retry: boolean;
  public readonly timestamp: Date;

  constructor(
    type: ErrorType,
    userMessage: string,
    technicalMessage?: string,
    retry: boolean = false
  ) {
    super(technicalMessage || userMessage);
    this.type = type;
    this.userMessage = userMessage;
    this.technicalMessage = technicalMessage || userMessage;
    this.retry = retry;
    this.timestamp = new Date();
    this.name = 'AppError';
  }
}

// User-friendly Turkish error messages
const ERROR_MESSAGES = {
  [ErrorType.NETWORK_ERROR]: {
    message: 'İnternet bağlantınızı kontrol edip tekrar deneyiniz',
    action: 'Tekrar Dene',
    retry: true
  },
  [ErrorType.VALIDATION_ERROR]: {
    message: 'Lütfen tüm gerekli alanları doldurunuz',
    action: 'Kontrol Et',
    retry: false
  },
  [ErrorType.CALCULATION_ERROR]: {
    message: 'Fiyat hesaplanamadı. Lütfen farklı filtreler deneyiniz',
    action: 'Filtreleri Değiştir',
    retry: true
  },
  [ErrorType.DATA_NOT_FOUND]: {
    message: 'Aradığınız veri bulunamadı. Farklı seçimler yapınız',
    action: 'Yeniden Seç',
    retry: false
  },
  [ErrorType.AUTHENTICATION_ERROR]: {
    message: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapınız',
    action: 'Giriş Yap',
    retry: false
  },
  [ErrorType.RATE_LIMIT_ERROR]: {
    message: 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyiniz',
    action: 'Bekle',
    retry: true
  },
  [ErrorType.UNKNOWN_ERROR]: {
    message: 'Beklenmeyen bir hata oluştu. Tekrar deneyiniz',
    action: 'Tekrar Dene',
    retry: true
  }
};

// Error Categorization - Backend error'ı AppError'a çevir
export function categorizeError(error: any): AppError {
  // Network errors
  if (
    error.code === 'NETWORK_ERR' ||
    error.message?.includes('network') ||
    error.message?.includes('fetch') ||
    !navigator.onLine
  ) {
    return new AppError(
      ErrorType.NETWORK_ERROR,
      ERROR_MESSAGES[ErrorType.NETWORK_ERROR].message,
      error.message,
      true
    );
  }

  // Supabase specific errors
  if (error.code) {
    switch (error.code) {
      case 'PGRST116': // Not found
        return new AppError(
          ErrorType.DATA_NOT_FOUND,
          ERROR_MESSAGES[ErrorType.DATA_NOT_FOUND].message,
          error.message,
          false
        );
      case 'PGRST301': // Syntax error
        return new AppError(
          ErrorType.CALCULATION_ERROR,
          ERROR_MESSAGES[ErrorType.CALCULATION_ERROR].message,
          error.message,
          true
        );
      case '23505': // Unique violation
      case '23502': // Not null violation
        return new AppError(
          ErrorType.VALIDATION_ERROR,
          ERROR_MESSAGES[ErrorType.VALIDATION_ERROR].message,
          error.message,
          false
        );
    }
  }

  // Custom validation errors
  if (error.message?.includes('validation') || error.message?.includes('gerekli')) {
    return new AppError(
      ErrorType.VALIDATION_ERROR,
      ERROR_MESSAGES[ErrorType.VALIDATION_ERROR].message,
      error.message,
      false
    );
  }

  // Rate limiting
  if (error.status === 429 || error.message?.includes('rate limit')) {
    return new AppError(
      ErrorType.RATE_LIMIT_ERROR,
      ERROR_MESSAGES[ErrorType.RATE_LIMIT_ERROR].message,
      error.message,
      true
    );
  }

  // Authentication errors
  if (error.status === 401 || error.status === 403) {
    return new AppError(
      ErrorType.AUTHENTICATION_ERROR,
      ERROR_MESSAGES[ErrorType.AUTHENTICATION_ERROR].message,
      error.message,
      false
    );
  }

  // Default unknown error
  return new AppError(
    ErrorType.UNKNOWN_ERROR,
    ERROR_MESSAGES[ErrorType.UNKNOWN_ERROR].message,
    error.message || 'Unknown error occurred',
    true
  );
}

// Error Handler - Merkezi error processing
export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  onRetry?: () => void;
  context?: string;
}

export function handleError(
  error: any,
  options: ErrorHandlerOptions = {}
): AppError {
  const {
    showToast = true,
    logError = true,
    onRetry,
    context = 'Unknown'
  } = options;

  // Categorize the error
  const appError = error instanceof AppError ? error : categorizeError(error);

  // Log error for debugging
  if (logError) {
    console.group(`🚨 Error in ${context}`);
    console.error('Type:', appError.type);
    console.error('User Message:', appError.userMessage);
    console.error('Technical:', appError.technicalMessage);
    console.error('Retry Possible:', appError.retry);
    console.error('Timestamp:', appError.timestamp);
    console.error('Original Error:', error);
    console.groupEnd();
  }

  // Show user-friendly toast
  if (showToast) {
    const errorConfig = ERROR_MESSAGES[appError.type];
    
    if (appError.retry && onRetry) {
      // Show toast with retry action text
      toast.error(`${appError.userMessage}\n\nTekrar denemek için: ${errorConfig.action}`, { 
        duration: 6000 
      });
    } else {
      toast.error(appError.userMessage, { 
        duration: appError.type === ErrorType.RATE_LIMIT_ERROR ? 8000 : 4000 
      });
    }
  }

  return appError;
}

// Retry Mechanism
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  context: string = 'Operation'
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      const appError = categorizeError(error);
      
      // Don't retry validation or authentication errors
      if (!appError.retry || attempt === maxRetries) {
        throw error;
      }

      console.warn(`🔄 Retry ${attempt}/${maxRetries} for ${context}:`, error.message);
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

// Validation helper
export function validateRequired(fields: Record<string, any>, fieldNames: string[]): void {
  const missing = fieldNames.filter(field => !fields[field] || fields[field] === '');
  
  if (missing.length > 0) {
    throw new AppError(
      ErrorType.VALIDATION_ERROR,
      `Lütfen şu alanları doldurunuz: ${missing.join(', ')}`,
      `Missing required fields: ${missing.join(', ')}`
    );
  }
}

// Network status checker
export function checkNetworkStatus(): boolean {
  if (!navigator.onLine) {
    throw new AppError(
      ErrorType.NETWORK_ERROR,
      'İnternet bağlantınız yok. Lütfen bağlantınızı kontrol ediniz',
      'Network is offline',
      true
    );
  }
  return true;
} 