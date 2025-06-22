
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  DollarSign,
  UserPlus,
  Scale,
  Calculator,
  Briefcase,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const resumos = [
    {
      secao: "RH",
      icon: Users,
      valor: "147",
      descricao: "Total de Funcionários",
      cor: "blue"
    },
    {
      secao: "DP",
      icon: FileText,
      valor: "89",
      descricao: "Candidatos no Banco de Talentos",
      cor: "emerald"
    },
    {
      secao: "Operações",
      icon: Settings,
      valor: "32",
      descricao: "Fiscalizações de Posto",
      cor: "orange"
    },
    {
      secao: "Comercial",
      icon: TrendingUp,
      valor: "256",
      descricao: "Total de Clientes",
      cor: "purple"
    },
    {
      secao: "Financeiro",
      icon: DollarSign,
      valor: "R$ 2.4M",
      descricao: "Faturamento Mensal",
      cor: "teal"
    }
  ];

  const portais = [
    {
      nome: "Portal de Admissão",
      icon: UserPlus,
      descricao: "Processo seletivo e contratação",
      link: "#",
      cor: "blue"
    },
    {
      nome: "Portal Jurídico",
      icon: Scale,
      descricao: "Contratos e documentos legais",
      link: "#",
      cor: "red"
    },
    {
      nome: "Portal Contábil",
      icon: Calculator,
      descricao: "Relatórios e demonstrativos",
      link: "#",
      cor: "green"
    },
    {
      nome: "Portal de Vagas",
      icon: Briefcase,
      descricao: "Oportunidades de emprego",
      link: "#",
      cor: "indigo"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-100 rounded-full opacity-20"></div>
      </div>

      <div className="relative z-10 py-6 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
          {/* Header Principal */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm px-12 py-6 rounded-3xl shadow-lg border border-gray-200 mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden bg-white">
                <img 
                  src="/lovable-uploads/effff35e-ae72-47e6-afa2-40c4b365fbde.png" 
                  alt="GM Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Sistema Integrado</h1>
                <p className="text-lg text-gray-600">Painel de Controle Geral</p>
              </div>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Visualize todos os dados importantes da sua empresa em um só lugar
            </p>
          </div>

          {/* Acesso ao Sistema Principal */}
          <div className="text-center">
            <Button
              onClick={() => navigate('/sistema')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowRight size={24} className="mr-3" />
              Acessar Sistema Completo
            </Button>
          </div>

          {/* Resumos por Seção */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
              📊 Resumo Geral
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
              {resumos.map((item) => (
                <Card key={item.secao} className="hover:shadow-xl transition-all duration-300 border-2 hover:scale-105">
                  <CardContent className="text-center p-6">
                    <div className={`w-16 h-16 bg-${item.cor}-100 border-2 border-${item.cor}-200 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <item.icon size={28} className={`text-${item.cor}-600`} />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">{item.valor}</div>
                    <div className="text-sm font-medium text-gray-600 mb-1">{item.descricao}</div>
                    <div className={`text-xs font-semibold text-${item.cor}-600 bg-${item.cor}-50 px-3 py-1 rounded-full`}>
                      {item.secao}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Portais Externos */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
              🌐 Portais Externos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {portais.map((portal) => (
                <Card key={portal.nome} className="hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 group">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-20 h-20 bg-${portal.cor}-100 border-2 border-${portal.cor}-200 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <portal.icon size={32} className={`text-${portal.cor}-600`} />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800 mb-2">
                      {portal.nome}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-gray-600 mb-4 text-sm">
                      {portal.descricao}
                    </p>
                    <Button 
                      className={`w-full bg-${portal.cor}-600 hover:bg-${portal.cor}-700 text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200`}
                      onClick={() => window.open(portal.link, '_blank')}
                    >
                      <ExternalLink size={18} className="mr-2" />
                      Acessar Portal
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Status do Sistema */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 text-base text-gray-600 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl border border-gray-200 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Todos os Sistemas Online</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Dados Atualizados</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="font-medium">Backup Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
