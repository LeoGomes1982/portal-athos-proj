import { sanitizeInput } from './security';

// Rate limiting para avaliações externas
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hora
const MAX_EVALUATION_ATTEMPTS = 3;
const rateLimitMap = new Map<string, RateLimitEntry>();

export const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= MAX_EVALUATION_ATTEMPTS) {
    return false;
  }

  entry.count++;
  return true;
};

// Validação robusta de token de avaliação
export const validateEvaluationToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // Token deve ter formato específico (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(token);
};

// Validação de dados de avaliação
export const validateEvaluationData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.funcionario_id || typeof data.funcionario_id !== 'string') {
    errors.push('ID do funcionário é obrigatório');
  }

  if (!data.funcionario_nome || typeof data.funcionario_nome !== 'string') {
    errors.push('Nome do funcionário é obrigatório');
  }

  if (!data.tipo_avaliacao || typeof data.tipo_avaliacao !== 'string') {
    errors.push('Tipo de avaliação é obrigatório');
  }

  if (data.perguntas_marcadas && typeof data.perguntas_marcadas !== 'object') {
    errors.push('Formato de perguntas marcadas inválido');
  }

  if (data.perguntas_descritivas && typeof data.perguntas_descritivas !== 'object') {
    errors.push('Formato de perguntas descritivas inválido');
  }

  // Sanitizar campos de texto
  if (data.feedback && typeof data.feedback === 'string') {
    data.feedback = sanitizeInput(data.feedback);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Proteção contra CSRF simples (para ser melhorada com tokens server-side)
export const generateCSRFToken = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  return btoa(`${timestamp}-${random}`);
};

export const validateCSRFToken = (token: string, maxAge: number = 30 * 60 * 1000): boolean => {
  try {
    const decoded = atob(token);
    const [timestamp] = decoded.split('-');
    const tokenTime = parseInt(timestamp);
    const now = Date.now();
    
    return (now - tokenTime) <= maxAge;
  } catch {
    return false;
  }
};

// Detecção de padrões suspeitos
export const detectSuspiciousActivity = (data: any): boolean => {
  // Verificar se há muitos campos vazios (possível bot)
  if (typeof data === 'object') {
    const values = Object.values(data);
    const emptyCount = values.filter(v => !v || v === '').length;
    const totalCount = values.length;
    
    if (emptyCount / totalCount > 0.8) {
      return true; // 80% dos campos vazios
    }
  }

  // Verificar padrões repetitivos em strings
  if (data.feedback && typeof data.feedback === 'string') {
    const words = data.feedback.split(' ');
    const uniqueWords = new Set(words);
    
    if (words.length > 10 && uniqueWords.size / words.length < 0.3) {
      return true; // Muito repetitivo
    }
  }

  return false;
};

// Log de segurança
export const logSecurityEvent = (event: string, details: any) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details: {
      ...details,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    }
  };

  // Em produção, isto seria enviado para um serviço de logging
  console.warn('[SECURITY EVENT]', logEntry);
  
  // Armazenar localmente para análise (temporário)
  const existingLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
  existingLogs.push(logEntry);
  
  // Manter apenas os últimos 100 logs
  if (existingLogs.length > 100) {
    existingLogs.splice(0, existingLogs.length - 100);
  }
  
  localStorage.setItem('security_logs', JSON.stringify(existingLogs));
};