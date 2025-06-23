
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
      bgColor: "bg-orange-100",
      textColor: "text-orange-700",
      onClick: () => navigate("/comercial/clientes-fornecedores")
    },
    {
      id: "contratos-propostas",
      title: "Contratos e Propostas",
      description: "Gestão de contratos e propostas",
      icon: FileText,
      bgColor: "bg-orange-100",
      textColor: "text-orange-700",
      onClick: () => navigate("/comercial/contratos-propostas")
    },
    {
      id: "estatisticas",
      title: "Estatísticas",
      description: "Análises e relatórios",
      icon: BarChart3,
      bgColor: "bg-orange-100",
      textColor: "text-orange-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
            <TrendingUp size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Área Comercial
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Gestão completa de clientes, fornecedores, contratos e análises comerciais
          </p>
        </div>

        {/* Subsections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-up">
          {subsections.map((subsection) => (
            <div 
              key={subsection.id}
              className="group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-150"
              onClick={subsection.onClick}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 ${subsection.bgColor} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                  <subsection.icon size={32} className={subsection.textColor} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{subsection.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{subsection.description}</p>
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
}
