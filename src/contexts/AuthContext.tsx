import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkAuthState = () => {
      try {
        const auth = localStorage.getItem('isAuthenticated');
        const email = localStorage.getItem('userEmail');
        
        if (isMounted) {
          if (auth === 'true' && email) {
            setIsAuthenticated(true);
            setUserEmail(email);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Use timeout to prevent blocking
    const timeoutId = setTimeout(checkAuthState, 0);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const login = useCallback((email: string) => {
    try {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      setIsAuthenticated(true);
      setUserEmail(email);
    } catch (error) {
      console.error('Error during login:', error);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      setIsAuthenticated(false);
      setUserEmail(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  const value = useMemo(() => ({
    isAuthenticated,
    userEmail,
    login,
    logout,
    isLoading
  }), [isAuthenticated, userEmail, login, logout, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}