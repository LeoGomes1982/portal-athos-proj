import { supabase } from '@/integrations/supabase/client';

// Monitoramento de sessões suspeitas
export const detectSuspiciousSession = (userAgent: string, ip?: string): boolean => {
  // Lista de user agents suspeitos (bots comuns)
  const suspiciousAgents = [
    'curl/',
    'wget/',
    'python-requests/',
    'PostmanRuntime/',
    'node-fetch/',
    'axios/',
    'http',
    'bot',
    'crawler',
    'spider'
  ];

  const userAgentLower = userAgent.toLowerCase();
  return suspiciousAgents.some(agent => userAgentLower.includes(agent));
};

// Rate limiting para tentativas de login
interface LoginAttempt {
  count: number;
  lastAttempt: number;
  blocked: boolean;
}

const loginAttempts = new Map<string, LoginAttempt>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos

export const checkLoginRateLimit = (identifier: string): { allowed: boolean; attemptsLeft: number } => {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (!attempt) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now, blocked: false });
    return { allowed: true, attemptsLeft: MAX_LOGIN_ATTEMPTS - 1 };
  }

  // Reset se passou o tempo de lockout
  if (attempt.blocked && (now - attempt.lastAttempt) > LOCKOUT_DURATION) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now, blocked: false });
    return { allowed: true, attemptsLeft: MAX_LOGIN_ATTEMPTS - 1 };
  }

  if (attempt.blocked) {
    return { allowed: false, attemptsLeft: 0 };
  }

  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    attempt.blocked = true;
    attempt.lastAttempt = now;
    return { allowed: false, attemptsLeft: 0 };
  }

  attempt.count++;
  attempt.lastAttempt = now;
  
  return { 
    allowed: true, 
    attemptsLeft: Math.max(0, MAX_LOGIN_ATTEMPTS - attempt.count) 
  };
};

// Validação de força de senha
export const validatePasswordStrength = (password: string): { 
  isStrong: boolean; 
  score: number; 
  suggestions: string[] 
} => {
  const suggestions: string[] = [];
  let score = 0;

  // Comprimento mínimo
  if (password.length >= 8) {
    score += 1;
  } else {
    suggestions.push('Use pelo menos 8 caracteres');
  }

  // Maiúsculas
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Inclua pelo menos uma letra maiúscula');
  }

  // Minúsculas
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Inclua pelo menos uma letra minúscula');
  }

  // Números
  if (/\d/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Inclua pelo menos um número');
  }

  // Caracteres especiais
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Inclua pelo menos um caractere especial');
  }

  // Verificação de padrões comuns
  const commonPatterns = [
    /123456/,
    /qwerty/i,
    /password/i,
    /admin/i,
    /12345/,
    /senha/i
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    score -= 2;
    suggestions.push('Evite padrões comuns como "123456", "password", etc.');
  }

  return {
    isStrong: score >= 4,
    score: Math.max(0, score),
    suggestions
  };
};

// Limpeza segura de dados sensíveis do localStorage
export const secureCleanup = () => {
  const sensitiveKeys = [
    'auth_attempts',
    'lockout_time',
    'password_temp',
    'user_session',
    'temp_credentials'
  ];

  sensitiveKeys.forEach(key => {
    localStorage.removeItem(key);
  });

  // Limpar dados antigos (mais de 30 dias)
  const cutoffDate = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.includes('_timestamp')) {
      const timestamp = parseInt(localStorage.getItem(key) || '0');
      if (timestamp < cutoffDate) {
        const dataKey = key.replace('_timestamp', '');
        localStorage.removeItem(key);
        localStorage.removeItem(dataKey);
      }
    }
  }
};

// Criptografia simples para dados não-críticos
export const simpleEncrypt = (text: string, key: string = 'athos2024'): string => {
  const encoded = btoa(unescape(encodeURIComponent(text)));
  const keyNum = key.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const result = encoded.split('').map((char, i) => 
    String.fromCharCode(char.charCodeAt(0) + keyNum % 26)
  ).join('');
  
  return btoa(result);
};

export const simpleDecrypt = (encryptedText: string, key: string = 'athos2024'): string => {
  try {
    const keyNum = key.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const decoded = atob(encryptedText);
    const result = decoded.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) - keyNum % 26)
    ).join('');
    
    return decodeURIComponent(escape(atob(result)));
  } catch {
    return '';
  }
};

// Audit logging para ações administrativas
export const logAdminAction = async (action: string, details: any) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return;

    const logEntry = {
      user_id: session.session.user.id,
      action,
      details,
      timestamp: new Date().toISOString(),
      ip_address: 'unknown', // Em produção, capturar IP real
      user_agent: navigator.userAgent
    };

    // Em produção, salvar em tabela de auditoria
    console.log('[ADMIN ACTION]', logEntry);
    
    // Temporariamente no localStorage para desenvolvimento
    const adminLogs = JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
    adminLogs.push(logEntry);
    
    // Manter apenas os últimos 1000 logs
    if (adminLogs.length > 1000) {
      adminLogs.splice(0, adminLogs.length - 1000);
    }
    
    localStorage.setItem('admin_audit_logs', JSON.stringify(adminLogs));
  } catch (error) {
    console.error('Erro ao registrar ação administrativa:', error);
  }
};