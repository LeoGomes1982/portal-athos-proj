import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFuncionarioSync } from "@/hooks/useFuncionarioSync";

const LoginHome = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyQuote, setDailyQuote] = useState("");
  const [totalClientes, setTotalClientes] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { funcionarios } = useFuncionarioSync();

  // Frases motivacionais categorizadas
  const motivationalQuotes = [
    // Bom humor
    "O café pode não resolver todos os problemas, mas é um bom começo! ☕",
    "Segunda-feira: o dia em que até o café precisa de café! 😴",
    "Se a vida te der limões, faça uma caipirinha! 🍋",
    "Sorria! Hoje você está mais próximo do fim de semana! 😄",
    
    // Bons fluídos
    "Energias positivas atraem resultados positivos! ✨",
    "Sua vibe atrai sua tribo! 🌟",
    "O universo conspira a favor de quem vibra alto! 🌈",
    "Gratidão transforma o que temos em suficiente! 🙏",
    
    // Zen/Mindfulness
    "Respire fundo. Você chegou até aqui, pode ir mais longe! 🧘‍♀️",
    "A paz interior é o novo sucesso! 🕊️",
    "No meio da dificuldade encontra-se a oportunidade! 💡",
    "Seja como a água: flexível, mas persistente! 🌊",
    
    // Humor geek
    "Erro 404: Motivação não encontrada. Reiniciando... 🤖",
    "Se debugging é a arte de remover bugs, programar deve ser a arte de criá-los! 💻",
    "Não há problema que não possa ser resolvido com ctrl+z! ⌨️",
    "Loading... 99% - Carregando dose diária de produtividade! ⚡",
    
    // Curiosidades
    "Você sabia? Um polvo tem 3 corações! Assim como você tem 3 projetos pendentes! 🐙",
    "Curiosidade: As abelhas podem reconhecer rostos humanos! 🐝",
    "Fato curioso: Um dia em Vênus dura mais que um ano venusiano! 🪐",
    "Você sabia? Os golfinhos têm nomes próprios! 🐬",
    
    // Motivacionais gerais
    "Grandes conquistas começam com pequenos passos! 👣",
    "O sucesso é a soma de pequenos esforços repetidos dia após dia! 💪",
    "Acredite em você, mesmo quando ninguém mais acreditar! 🌟",
    "O melhor momento para plantar uma árvore foi há 20 anos. O segundo melhor é agora! 🌳"
  ];

  // Seleciona uma frase baseada no dia atual
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    setDailyQuote(motivationalQuotes[quoteIndex]);

    // Carregar número de clientes
    const savedClients = localStorage.getItem('clientesFornecedores');
    if (savedClients) {
      const clients = JSON.parse(savedClients);
      const clientesCount = clients.filter((c: any) => c.tipo === 'cliente').length;
      setTotalClientes(clientesCount);
    }

    // Verificar se já está logado
    const isLoggedIn = localStorage.getItem('isAuthenticated');
    if (isLoggedIn === 'true') {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar se o email existe no sistema
    const emailExists = funcionarios.some(func => func.email === email);
    
    if (!emailExists) {
      toast({
        title: "Erro de autenticação",
        description: "Email não encontrado no sistema.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Verificar senha (sempre 123456)
    if (password !== "123456") {
      toast({
        title: "Erro de autenticação",
        description: "Senha incorreta.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Login bem-sucedido
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    
    toast({
      title: "Login realizado com sucesso!",
      description: "Bem-vindo ao sistema!",
    });

    navigate('/home');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-start justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-end pt-8">
        
        {/* Lado esquerdo - Frase motivacional */}
        <div className="text-center lg:text-left space-y-6">
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
              <div className="text-2xl font-bold text-primary">{funcionarios.length}</div>
              <div className="text-sm text-slate-600">Funcionários</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100 text-center">
              <div className="text-2xl font-bold text-primary">{totalClientes}</div>
              <div className="text-sm text-slate-600">Clientes</div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário de login */}
        <div className="w-full max-w-lg mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm h-[104px] flex items-center">
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <LogIn size={20} className="text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800">
                Fazer Login
              </CardTitle>
              <p className="text-sm text-slate-600">
                Digite suas credenciais para acessar o sistema
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Entrando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn size={16} />
                      Entrar no Sistema
                    </div>
                  )}
                </Button>
              </form>

              {/* Dica para desenvolvedores */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 text-center">
                  <strong>Dica:</strong> Use qualquer email cadastrado no sistema com a senha <code className="bg-blue-100 px-1 rounded">123456</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginHome;