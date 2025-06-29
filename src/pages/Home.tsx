import { 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  DollarSign,
  Building2,
  Globe,
  UserPlus,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const gestaoInternaSection = [
    {
      id: "dp",
      title: "DP",
      fullTitle: "Departamento Pessoal",
      icon: FileText,
      className: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-150",
      iconColor: "text-green-600",
      onClick: () => navigate("/dp")
    },
    {
      id: "agenda",
      title: "AGENDA",
      fullTitle: "Gestão de Tarefas e Agendamentos",
      icon: Calendar,
      className: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:from-indigo-100 hover:to-indigo-150",
      iconColor: "text-indigo-600",
      onClick: () => navigate("/agenda")
    },
    {
      id: "operacoes",
      title: "OPERAÇÕES",
      fullTitle: "Gestão Operacional",
      icon: Settings,
      className: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150",
      iconColor: "text-purple-600"
    },
    {
      id: "comercial",
      title: "COMERCIAL",
      fullTitle: "Área Comercial",
      icon: TrendingUp,
      className: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-150",
      iconColor: "text-orange-600",
      onClick: () => navigate("/comercial")
    },
    {
      id: "financeiro",
      title: "FINANCEIRO",
      fullTitle: "Gestão Financeira",
      icon: DollarSign,
      className: "bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-150",
      iconColor: "text-red-600"
    },
    {
      id: "configuracoes",
      title: "CONFIGURAÇÕES",
      fullTitle: "Configurações do Sistema",
      icon: Settings,
      className: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-150",
      iconColor: "text-slate-600",
      onClick: () => navigate("/configuracoes")
    }
  ];

  const portaisExternosSection = [
    {
      id: "portal-admissao",
      title: "PORTAL DE ADMISSÃO",
      fullTitle: "Portal de Admissão de Funcionários",
      icon: UserPlus,
      className: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-150",
      iconColor: "text-emerald-600",
      onClick: () => window.open("/portal-admissao", "_blank")
    }
  ];

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">GA</span>
          </div>
          <h1 className="page-title text-center">
            Portal Grupo Athos
          </h1>
          <p className="text-description text-center max-w-2xl mx-auto text-base">
            Sistema de gestão integrado para organização e controle dos setores essenciais da empresa
          </p>
        </div>

        {/* Section Title - Gestão Interna */}
        <div className="page-header justify-center animate-slide-up">
          <div className="page-header-icon bg-gradient-to-br from-slate-100 to-slate-200">
            <Building2 size={24} className="text-slate-600" />
          </div>
          <div>
            <h2 className="section-title mb-0">Portal de Gestão</h2>
            <p className="text-description">Módulos internos do sistema</p>
          </div>
        </div>

        {/* Cards Grid - Gestão Interna */}
        <div className="content-grid animate-slide-up mb-12">
          {gestaoInternaSection.map((section) => (
            <div 
              key={section.id}
              className={`modern-card group relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${section.className}`}
              onClick={section.onClick}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <section.icon size={32} className={section.iconColor} />
                </div>
                <div>
                  <h3 className="subsection-title mb-2">{section.title}</h3>
                  <p className="text-description leading-relaxed">{section.fullTitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Title - Portais Externos */}
        <div className="page-header justify-center animate-slide-up">
          <div className="page-header-icon bg-gradient-to-br from-emerald-100 to-emerald-200">
            <Globe size={24} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="section-title mb-0">Portais Externos</h2>
            <p className="text-description">Acesso para colaboradores e parceiros</p>
          </div>
        </div>

        {/* Cards Grid - Portais Externos */}
        <div className="content-grid animate-slide-up mb-8">
          {portaisExternosSection.map((section) => (
            <div 
              key={section.id}
              className={`modern-card group relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${section.className}`}
              onClick={section.onClick}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <section.icon size={32} className={section.iconColor} />
                </div>
                <div>
                  <h3 className="subsection-title mb-2">{section.title}</h3>
                  <p className="text-description leading-relaxed">{section.fullTitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
