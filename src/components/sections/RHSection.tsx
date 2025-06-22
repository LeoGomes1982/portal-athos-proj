
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdmissaoSubsection } from "../subsections/AdmissaoSubsection";
import { FuncionariosSubsection } from "../subsections/FuncionariosSubsection";
import { UniformesSubsection } from "../subsections/UniformesSubsection";
import { DocumentosSubsection } from "../subsections/DocumentosSubsection";
import { ArquivoRHSubsection } from "../subsections/ArquivoRHSubsection";

const subsections = [
  {
    id: "admissao",
    title: "Admissão",
    icon: "👋",
    description: "Novos colaboradores",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700"
  },
  {
    id: "funcionarios",
    title: "Funcionários",
    icon: "👥",
    description: "Colaboradores ativos",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700"
  },
  {
    id: "uniformes",
    title: "Uniformes",
    icon: "👔",
    description: "Controle de uniformes",
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700"
  },
  {
    id: "documentos",
    title: "Documentos",
    icon: "📄",
    description: "Arquivos importantes",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700"
  },
  {
    id: "arquivo",
    title: "Arquivo",
    icon: "📦",
    description: "Funcionários inativos",
    color: "bg-gray-500",
    hoverColor: "hover:bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-700"
  }
];

export function RHSection() {
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null);

  const renderSubsection = () => {
    switch (activeSubsection) {
      case 'admissao':
        return <AdmissaoSubsection onBack={() => setActiveSubsection(null)} />;
      case 'funcionarios':
        return <FuncionariosSubsection onBack={() => setActiveSubsection(null)} />;
      case 'uniformes':
        return <UniformesSubsection onBack={() => setActiveSubsection(null)} />;
      case 'documentos':
        return <DocumentosSubsection onBack={() => setActiveSubsection(null)} />;
      case 'arquivo':
        return <ArquivoRHSubsection onBack={() => setActiveSubsection(null)} />;
      default:
        return null;
    }
  };

  if (activeSubsection) {
    return (
      <div className="animate-fade-in">
        {renderSubsection()}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header mais limpo */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Recursos Humanos</h1>
        <p className="text-gray-600 text-sm">Gestão de pessoas e processos</p>
      </div>

      {/* Cards em grid responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subsections.map((subsection) => (
          <Card 
            key={subsection.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-102 hover:shadow-lg border-2 ${subsection.borderColor} ${subsection.hoverColor} bg-white`}
            onClick={() => setActiveSubsection(subsection.id)}
          >
            <CardHeader className="text-center pb-2 pt-6">
              <div className="text-4xl mb-2">{subsection.icon}</div>
              <CardTitle className={`text-lg font-semibold ${subsection.textColor}`}>
                {subsection.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              <p className="text-center text-gray-600 text-sm mb-3">{subsection.description}</p>
              <div className="text-center">
                <div className={`inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors`}>
                  Acessar →
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rodapé com informações úteis */}
      <div className="mt-8 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Sistema Online</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Dados Seguros</span>
          </div>
        </div>
      </div>
    </div>
  );
}
