
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthenticationFormProps {
  onAuthenticate: (isInternal: boolean) => void;
}

export const AuthenticationForm = ({ onAuthenticate }: AuthenticationFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { toast } = useToast();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (attemptCount >= MAX_ATTEMPTS) {
      toast({
        title: "Muitas tentativas",
        description: "Aguarde 15 minutos antes de tentar novamente.",
        variant: "destructive",
      });
      return;
    }

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!validateEmail(sanitizedEmail)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(sanitizedPassword)) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate authentication - In production, this would be a proper API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, using specific test credentials
      // In production, this should be replaced with proper Supabase authentication
      const isValidUser = sanitizedEmail === "admin@grupoathos.com.br" && sanitizedPassword === "GrupoAthos2024!";
      const isInternalUser = sanitizedEmail.includes("@grupoathos.com.br");

      if (isValidUser) {
        // Clear attempt count on successful login
        setAttemptCount(0);
        localStorage.removeItem('auth_attempts');
        localStorage.removeItem('lockout_time');
        
        onAuthenticate(isInternalUser);
        
        toast({
          title: "Login realizado com sucesso!",
          description: isInternalUser 
            ? "Acesso interno - Todos os módulos liberados." 
            : "Bem-vindo ao Portal de Admissão.",
        });
      } else {
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);
        localStorage.setItem('auth_attempts', newAttemptCount.toString());
        
        if (newAttemptCount >= MAX_ATTEMPTS) {
          localStorage.setItem('lockout_time', Date.now().toString());
        }

        toast({
          title: "Credenciais inválidas",
          description: `Email ou senha incorretos. Tentativas restantes: ${MAX_ATTEMPTS - newAttemptCount}`,
          variant: "destructive",
        });
        
        setPassword("");
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check for lockout on component mount
  useState(() => {
    const storedAttempts = localStorage.getItem('auth_attempts');
    const lockoutTime = localStorage.getItem('lockout_time');
    
    if (storedAttempts) {
      setAttemptCount(parseInt(storedAttempts));
    }
    
    if (lockoutTime && Date.now() - parseInt(lockoutTime) > LOCKOUT_TIME) {
      localStorage.removeItem('auth_attempts');
      localStorage.removeItem('lockout_time');
      setAttemptCount(0);
    }
  });

  const isLocked = attemptCount >= MAX_ATTEMPTS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            Portal de Admissão
          </CardTitle>
          <p className="text-slate-600">
            Entre com suas credenciais para acessar o sistema
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={isLocked}
                autoComplete="username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  disabled={isLocked}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              disabled={isLocked || isLoading || !email || !password}
            >
              <Lock className="w-4 h-4 mr-2" />
              {isLoading ? "Entrando..." : isLocked ? "Conta Bloqueada" : "Entrar"}
            </Button>
          </form>
          
          {isLocked && (
            <div className="text-center text-sm text-red-600">
              Muitas tentativas incorretas. Aguarde 15 minutos.
            </div>
          )}
          
          <div className="text-center text-xs text-slate-500">
            <p>Email de teste: admin@grupoathos.com.br</p>
            <p>Senha de teste: GrupoAthos2024!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
