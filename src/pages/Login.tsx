import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validUsers = [
    'leandrogomes@grupoathosbrasil.com',
    'dp@grupoathosbrasil.com',
    'financeiro@grupoathosbrasil.com',
    'gerencia@grupoathosbrasil.com',
    'thiago@grupoathosbrasil.com',
    'diego@grupoathosbrasil.com'
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (validUsers.includes(email.toLowerCase()) && password === '123456') {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a), ${email}`,
      });
      onLogin(email);
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha inválidos",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="app-container animate-fade-in">
      <div className="flex items-center justify-center min-h-screen">
        <Card className="modern-card w-full max-w-md mx-4 shadow-lg animate-scale-in">
          <CardHeader className="card-header text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="page-title text-center mb-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Sistema Athos Brasil
            </CardTitle>
            <p className="text-description text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              Faça login para acessar o sistema
            </p>
          </CardHeader>
          <CardContent className="card-content space-y-6">
            <form onSubmit={handleLogin} className="space-y-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="form-group">
                <Label htmlFor="email" className="form-label">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="username"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <Label htmlFor="password" className="form-label">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    autoComplete="current-password"
                    className="form-input pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
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
                className="primary-btn w-full hover-scale"
                disabled={loading || !email || !password}
              >
                <Lock className="w-4 h-4 mr-2" />
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
            <div className="text-center text-xs text-slate-500 p-3 bg-gray-50 rounded-lg animate-fade-in" style={{ animationDelay: '1s' }}>
              <p className="mb-2 font-medium">Usuários para teste:</p>
              <div className="space-y-1">
                {validUsers.map((user, index) => (
                  <div key={index}>{user}</div>
                ))}
                <div className="mt-2 font-medium">Senha: 123456</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;