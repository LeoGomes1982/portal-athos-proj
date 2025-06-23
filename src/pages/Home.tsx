
import { 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  DollarSign,
  Building2,
  Edit,
  Globe,
  FileEdit
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const gestaoInternaSection = [
    {
      id: "rh",
      title: "RH",
      fullTitle: "Recursos Humanos",
      icon: Users,
      className: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150",
      iconColor: "text-blue-600",
      onClick: () => navigate("/rh")
    },
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
    }
  ];

  const configuracoesSection = [
    {
      id: "edicao-formularios",
      title: "EDIÇÃO DE FORMULÁRIOS",
      fullTitle: "Personalizar Formulários",
      icon: FileEdit,
      className: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-150",
      iconColor: "text-slate-600"
    },
    {
      id: "edicao-empresas",
      title: "EDIÇÃO DE EMPRESAS",
      fullTitle: "Gerenciar Empresas",
      icon: Building2,
      className: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-150",
      iconColor: "text-gray-600"
    },
    {
      id: "edicao-site",
      title: "EDIÇÃO DO SITE",
      fullTitle: "Configurar Site",
      icon: Globe,
      className: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:from-indigo-100 hover:to-indigo-150",
      iconColor: "text-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">GA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Portal Grupo Athos
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Sistema de gestão integrado para organização e controle dos setores essenciais da empresa
          </p>
        </div>

        {/* Section Title - Gestão Interna */}
        <div className="flex items-center justify-center gap-3 mb-12 animate-slide-up">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
            <Building2 size={24} className="text-slate-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Gestão Interna</h2>
        </div>

        {/* Cards Grid - Gestão Interna */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20 animate-slide-up">
          {gestaoInternaSection.map((section) => (
            <div 
              key={section.id}
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${section.className}`}
              onClick={section.onClick}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <section.icon size={32} className={section.iconColor} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{section.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{section.fullTitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Title - Configurações */}
        <div className="flex items-center justify-center gap-3 mb-12 animate-slide-up">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
            <Settings size={24} className="text-slate-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Configurações</h2>
        </div>

        {/* Cards Grid - Configurações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-up">
          {configuracoesSection.map((section) => (
            <div 
              key={section.id}
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${section.className}`}
              onClick={section.onClick}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <section.icon size={32} className={section.iconColor} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{section.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{section.fullTitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-sm text-slate-500">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
