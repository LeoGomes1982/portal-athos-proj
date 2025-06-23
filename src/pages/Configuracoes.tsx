
import { 
  Settings, 
  ArrowLeft,
  FileEdit,
  Building2,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EmpresasModal from "@/components/modals/EmpresasModal";

const Configuracoes = () => {
  const navigate = useNavigate();
  const [isEmpresasModalOpen, setIsEmpresasModalOpen] = useState(false);

  const configuracoesSection = [
    {
      id: "edicao-formularios",
      title: "EDIÇÃO DE FORMULÁRIOS",
      fullTitle: "Personalizar Formulários",
      icon: FileEdit,
      className: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-150",
      iconColor: "text-slate-600",
      onClick: () => {}
    },
    {
      id: "edicao-empresas",
      title: "EDIÇÃO DE EMPRESAS",
      fullTitle: "Gerenciar Empresas",
      icon: Building2,
      className: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-150",
      iconColor: "text-gray-600",
      onClick: () => setIsEmpresasModalOpen(true)
    },
    {
      id: "edicao-site",
      title: "EDIÇÃO DO SITE",
      fullTitle: "Configurar Site",
      icon: Globe,
      className: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:from-indigo-100 hover:to-indigo-150",
      iconColor: "text-indigo-600",
      onClick: () => {}
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-6 py-12">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
            <span className="text-slate-700">Voltar</span>
          </button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl mb-6 shadow-lg">
            <Settings size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Configurações
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Configure formulários, empresas e personalize o site do sistema
          </p>
        </div>

        {/* Cards Grid - Configurações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-up">
          {configuracoesSection.map((section) => (
            <div 
              key={section.id}
              onClick={section.onClick}
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${section.className}`}
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

      {/* Modal de Empresas */}
      <EmpresasModal 
        isOpen={isEmpresasModalOpen}
        onClose={() => setIsEmpresasModalOpen(false)}
      />
    </div>
  );
};

export default Configuracoes;
