import { simpleEncrypt, simpleDecrypt } from './authSecurity';

// Secure localStorage wrapper with encryption
export class SecureStorage {
  private static readonly PREFIX = 'athos_secure_';
  private static readonly MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

  static setItem(key: string, value: any): void {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        checksum: this.generateChecksum(JSON.stringify(value))
      };
      
      const encryptedData = simpleEncrypt(JSON.stringify(data));
      localStorage.setItem(this.PREFIX + key, encryptedData);
    } catch (error) {
      console.error('Error storing secure data:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const encryptedData = localStorage.getItem(this.PREFIX + key);
      if (!encryptedData) return null;

      const decryptedData = simpleDecrypt(encryptedData);
      const data = JSON.parse(decryptedData);

      // Check if data has expired
      if (Date.now() - data.timestamp > this.MAX_AGE) {
        this.removeItem(key);
        return null;
      }

      // Verify data integrity
      const expectedChecksum = this.generateChecksum(JSON.stringify(data.value));
      if (data.checksum !== expectedChecksum) {
        console.warn('Data integrity check failed for key:', key);
        this.removeItem(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      this.removeItem(key); // Remove corrupted data
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  private static generateChecksum(data: string): string {
    // Simple checksum for data integrity verification
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }
}

// Enhanced security for critical data - use SessionStorage with encryption
export class CriticalDataStorage {
  private static readonly PREFIX = 'athos_critical_';

  static setItem(key: string, value: any): void {
    try {
      const data = {
        value,
        timestamp: Date.now()
      };
      
      const encryptedData = simpleEncrypt(JSON.stringify(data));
      sessionStorage.setItem(this.PREFIX + key, encryptedData);
    } catch (error) {
      console.error('Error storing critical data:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const encryptedData = sessionStorage.getItem(this.PREFIX + key);
      if (!encryptedData) return null;

      const decryptedData = simpleDecrypt(encryptedData);
      const data = JSON.parse(decryptedData);

      return data.value;
    } catch (error) {
      console.error('Error retrieving critical data:', error);
      this.removeItem(key);
      return null;
    }
  }

  static removeItem(key: string): void {
    sessionStorage.removeItem(this.PREFIX + key);
  }

  static clear(): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  }
}