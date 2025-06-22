
import { Card, CardContent } from "@/components/ui/card";
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
  ArrowRight,
  BarChart3,
  Shield,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Funcionários",
      value: "147",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Candidatos",
      value: "89",
      icon: UserPlus,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      label: "Operações",
      value: "32",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      label: "Clientes",
      value: "256",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      label: "Faturamento",
      value: "R$ 2.4M",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  const sections = [
    {
      id: "rh",
      title: "Recursos Humanos",
      description: "Gestão completa de pessoas e talentos",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      route: "/sistema"
    },
    {
      id: "dp",
      title: "Departamento Pessoal",
      description: "Folha de pagamento e benefícios",
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      route: "/sistema"
    },
    {
      id: "operacoes",
      title: "Operações",
      description: "Controle operacional e logística",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      route: "/sistema"
    },
    {
      id: "comercial",
      title: "Comercial",
      description: "Vendas e relacionamento com clientes",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      route: "/sistema"
    },
    {
      id: "financeiro",
      title: "Financeiro",
      description: "Controle financeiro e contabilidade",
      icon: DollarSign,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
      route: "/sistema"
    }
  ];

  const portals = [
    {
      title: "Portal de Admissão",
      description: "Processo seletivo e contratação",
      icon: UserPlus,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Portal Jurídico",
      description: "Contratos e documentos legais",
      icon: Scale,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Portal Contábil",
      description: "Relatórios e demonstrativos",
      icon: Calculator,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Portal de Vagas",
      description: "Oportunidades de emprego",
      icon: Briefcase,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    }
  ];

  return (
    <div className="page-background">
      <div className="container-page">
        {/* Header Principal */}
        <div className="page-header animate-fade-in">
          <div className="inline-flex items-center gap-4 bg-white px-8 py-6 rounded-3xl shadow-lg border border-slate-200 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/effff35e-ae72-47e6-afa2-40c4b365fbde.png" 
                alt="GM Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="page-title mb-0">Sistema Integrado</h1>
              <p className="text-lg text-slate-600">Painel de Controle Empresarial</p>
            </div>
          </div>
          <p className="page-subtitle">
            Gerencie todos os setores da sua empresa com eficiência e simplicidade
          </p>
        </div>

        {/* Botão de Acesso Principal */}
        <div className="text-center mb-16 animate-slide-up">
          <Button
            onClick={() => navigate('/sistema')}
            className="btn-primary text-xl px-12 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <ArrowRight size={24} className="mr-3" />
            Acessar Sistema Completo
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="mb-16 animate-slide-up">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Resumo Executivo</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="stats-card">
                <div className={`section-icon ${stat.bgColor} ${stat.color} w-12 h-12 mb-4`}>
                  <stat.icon size={24} />
                </div>
                <div className={`stats-value ${stat.color}`}>{stat.value}</div>
                <div className="stats-label">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Seções Principais */}
        <div className="mb-16 animate-slide-up">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Módulos do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <Card 
                key={section.id}
                className="section-card"
                onClick={() => navigate(section.route)}
              >
                <div className={`section-icon ${section.bgColor} ${section.color}`}>
                  <section.icon size={28} />
                </div>
                <h3 className="section-title">{section.title}</h3>
                <p className="section-description">{section.description}</p>
                <Button className="btn-primary w-full">
                  Acessar Módulo
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Portais Externos */}
        <div className="mb-16 animate-slide-up">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Portais Externos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portals.map((portal) => (
              <Card key={portal.title} className="section-card">
                <div className={`section-icon ${portal.bgColor} ${portal.color} w-14 h-14 mb-4`}>
                  <portal.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">{portal.title}</h3>
                <p className="text-slate-600 mb-6 text-sm">{portal.description}</p>
                <Button className="btn-secondary w-full">
                  <ExternalLink size={16} className="mr-2" />
                  Acessar Portal
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Status do Sistema */}
        <div className="text-center animate-slide-up">
          <div className="inline-flex items-center gap-8 bg-white px-8 py-4 rounded-2xl shadow-lg border border-slate-200">
            <div className="status-online">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Sistema Online</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <BarChart3 size={16} />
              <span className="font-medium">Dados Atualizados</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Shield size={16} />
              <span className="font-medium">Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-orange-600">
              <Zap size={16} />
              <span className="font-medium">Alta Performance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
