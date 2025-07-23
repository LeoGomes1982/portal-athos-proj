import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn, UserPlus, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [dailyQuote, setDailyQuote] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();

  console.log('Auth page - user state:', { userEmail: user?.email, isLoading });

  // Redirecionar usuários já autenticados
  useEffect(() => {
    if (!isLoading && user) {
      console.log('User already authenticated, redirecting to home');
      navigate('/home');
    }
  }, [user, isLoading, navigate]);

  // Frases motivacionais categorizadas
  const motivationalQuotes = [
    "O café pode não resolver todos os problemas, mas é um bom começo! ☕",
    "Segunda-feira: o dia em que até o café precisa de café! 😴",
    "Se a vida te der limões, faça uma caipirinha! 🍋",
    "Sorria! Hoje você está mais próximo do fim de semana! 😄",
    "Energias positivas atraem resultados positivos! ✨",
    "Sua vibe atrai sua tribo! 🌟",
    "O universo conspira a favor de quem vibra alto! 🌈",
    "Gratidão transforma o que temos em suficiente! 🙏",
    "Respire fundo. Você chegou até aqui, pode ir mais longe! 🧘‍♀️",
    "A paz interior é o novo sucesso! 🕊️",
    "No meio da dificuldade encontra-se a oportunidade! 💡",
    "Seja como a água: flexível, mas persistente! 🌊"
  ];

  // Seleciona uma frase baseada no dia atual
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    setDailyQuote(motivationalQuotes[quoteIndex]);
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já pode fazer login no sistema.",
      });

      setIsSignUp(false);
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao cadastrar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema!",
        });
        navigate('/home');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Email ou senha incorretos.",
        variant: "destructive",
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-start justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-end pt-8">
        
        {/* Lado esquerdo - Frase motivacional */}
        <div className="text-center lg:text-left space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
              <Sparkles size={32} className="text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
              Bem-vindo ao
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent block">
                Sistema Athos
              </span>
            </h1>
          </div>
          
          {/* Frase do dia */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-sm">💡</span>
              </div>
              <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                Frase do Dia
              </span>
            </div>
            <p className="text-lg text-slate-700 font-medium leading-relaxed">
              {dailyQuote}
            </p>
          </div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100 text-center">
              <div className="text-2xl font-bold text-primary">24</div>
              <div className="text-sm text-slate-600">Funcionários</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100 text-center">
              <div className="text-2xl font-bold text-primary">15</div>
              <div className="text-sm text-slate-600">Clientes</div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário de autenticação */}
        <div className="w-full max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm p-6 hover-scale">
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                {isSignUp ? <UserPlus size={20} className="text-white" /> : <LogIn size={20} className="text-white" />}
              </div>
              <CardTitle className="text-xl font-bold text-slate-800">
                {isSignUp ? "Criar Conta" : "Fazer Login"}
              </CardTitle>
              <p className="text-sm text-slate-600">
                {isSignUp 
                  ? "Crie sua conta para acessar o sistema" 
                  : "Digite suas credenciais para acessar o sistema"
                }
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-medium text-slate-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10 border-slate-200 focus:border-primary focus:ring-primary text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-xs font-medium text-slate-700">
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-10 pr-10 border-slate-200 focus:border-primary focus:ring-primary text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-10 w-10 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="text-slate-400" />
                        ) : (
                          <Eye size={16} className="text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-sm"
                  disabled={isFormLoading}
                >
                  {isFormLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isSignUp ? "Criando conta..." : "Entrando..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isSignUp ? <UserPlus size={16} /> : <LogIn size={16} />}
                      {isSignUp ? "Criar Conta" : "Entrar no Sistema"}
                    </div>
                  )}
                </Button>
              </form>

              {/* Toggle entre login e cadastro */}
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-slate-600 hover:text-slate-800"
                >
                  {isSignUp 
                    ? "Já tem uma conta? Fazer login" 
                    : "Não tem uma conta? Criar conta"
                  }
                </Button>
              </div>

              {/* Dica para desenvolvedores */}
              {!isSignUp && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 text-center">
                    <strong>Dica:</strong> Crie uma conta ou use suas credenciais existentes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;