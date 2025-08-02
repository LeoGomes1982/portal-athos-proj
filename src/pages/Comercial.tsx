
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Users, 
  FileText,
  BarChart3
} from "lucide-react";

export default function Comercial() {
  const navigate = useNavigate();

  const subsections = [
    {
      id: "clientes-fornecedores",
      title: "Clientes e Fornecedores",
      description: "Gestão de clientes e fornecedores",
      icon: Users,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      onClick: () => navigate("/comercial/clientes-fornecedores")
    },
    {
      id: "contratos-propostas",
      title: "Contratos e Propostas",
      description: "Gestão de contratos e propostas",
      icon: FileText,
      bgColor: "bg-gray-100",
      textColor: "text-gray-500",
      disabled: true
    },
    {
      id: "estatisticas",
      title: "Estatísticas",
      description: "Análises e relatórios",
      icon: BarChart3,
      bgColor: "bg-gray-100",
      textColor: "text-gray-500",
      disabled: true
    }
  ];

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
            <TrendingUp size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">
            Área Comercial
          </h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Gestão completa de clientes, fornecedores, contratos e análises comerciais
          </p>
        </div>

        {/* Subsections Grid */}
        <div className="content-grid animate-slide-up">
          {subsections.map((subsection) => (
            <div 
              key={subsection.id}
              className={`modern-card group relative p-8 border-2 transition-all duration-300 ${
                subsection.disabled 
                  ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed' 
                  : 'hover:scale-105 hover:shadow-xl cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-150'
              }`}
              onClick={subsection.disabled ? undefined : subsection.onClick}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 ${subsection.bgColor} rounded-xl flex items-center justify-center shadow-sm ${
                  !subsection.disabled && 'group-hover:shadow-md'
                } transition-shadow`}>
                  <subsection.icon size={32} className={subsection.textColor} />
                </div>
                <div>
                  <h3 className={`subsection-title ${subsection.disabled ? 'text-gray-500' : ''}`}>
                    {subsection.title}
                  </h3>
                  <p className={`leading-relaxed ${subsection.disabled ? 'text-gray-400' : 'text-description'}`}>
                    {subsection.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
