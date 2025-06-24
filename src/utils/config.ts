
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;

export const config = {
  app: {
    name: "Grupo Athos Portal",
    version: "1.0.0",
  },
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  api: {
    timeout: 10000, // 10 seconds
    retries: 3,
  }
};

// Safe console logging - only logs in development
export const safeConsoleLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

export const safeConsoleError = (...args: any[]) => {
  if (isDevelopment) {
    console.error(...args);
  }
};

export const safeConsoleWarn = (...args: any[]) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};
