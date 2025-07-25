import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { secureCleanup, detectSuspiciousSession, logAdminAction } from '@/utils/authSecurity';
import { logSecurityEvent } from '@/utils/securityValidations';

export const useSecurityMonitoring = () => {
  const { user, isAdmin } = useAuth();

  // Limpeza automática de dados sensíveis
  useEffect(() => {
    const cleanup = () => {
      secureCleanup();
    };

    // Executar limpeza a cada 30 minutos
    const interval = setInterval(cleanup, 30 * 60 * 1000);
    
    // Limpeza inicial
    cleanup();

    return () => clearInterval(interval);
  }, []);

  // Monitoramento de sessão suspeita
  useEffect(() => {
    if (user) {
      const userAgent = navigator.userAgent;
      
      if (detectSuspiciousSession(userAgent)) {
        logSecurityEvent('SUSPICIOUS_SESSION_DETECTED', {
          user_id: user.id,
          user_agent: userAgent,
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [user]);

  // Função para registrar ações administrativas
  const logAction = useCallback(async (action: string, details: any) => {
    if (isAdmin()) {
      await logAdminAction(action, details);
    }
  }, [isAdmin]);

  // Monitoramento de tentativas de acesso não autorizado
  const monitorUnauthorizedAccess = useCallback((resource: string, requiredRole: string) => {
    if (user && !isAdmin()) {
      logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', {
        user_id: user.id,
        resource,
        required_role: requiredRole,
        user_role: user.user_metadata?.role || 'unknown',
        timestamp: new Date().toISOString()
      });
    }
  }, [user, isAdmin]);

  // Função para verificar integridade de dados críticos
  const verifyDataIntegrity = useCallback(() => {
    const criticalKeys = [
      'documentos',
      'funcionarios_data',
      'avaliacoes_data'
    ];

    criticalKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          JSON.parse(data);
        } catch (error) {
          logSecurityEvent('DATA_CORRUPTION_DETECTED', {
            key,
            error: error.message,
            timestamp: new Date().toISOString()
          });
          
          // Remove dados corrompidos para evitar erros
          localStorage.removeItem(key);
        }
      }
    });
  }, []);

  // Verificação automática de integridade a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(verifyDataIntegrity, 5 * 60 * 1000);
    
    // Verificação inicial
    verifyDataIntegrity();

    return () => clearInterval(interval);
  }, [verifyDataIntegrity]);

  return {
    logAction,
    monitorUnauthorizedAccess,
    verifyDataIntegrity
  };
};