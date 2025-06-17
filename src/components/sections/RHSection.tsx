
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
    description: "Novos colaboradores"
  },
  {
    id: "funcionarios",
    title: "Funcionários",
    icon: "👥",
    description: "Colaboradores ativos"
  },
  {
    id: "uniformes",
    title: "Uniformes",
    icon: "👕",
    description: "Controle de uniformes"
  },
  {
    id: "documentos",
    title: "Documentos",
    icon: "📄",
    description: "Arquivos e documentos"
  },
  {
    id: "arquivo",
    title: "Arquivo RH",
    icon: "📦",
    description: "Funcionários inativos"
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
    return renderSubsection();
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">👥 Recursos Humanos</h1>
        <p className="text-gray-600 text-lg">Gestão completa de pessoas e processos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subsections.map((subsection) => (
          <Card 
            key={subsection.id}
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-blue-100 hover:border-blue-300"
            onClick={() => setActiveSubsection(subsection.id)}
          >
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-3">{subsection.icon}</div>
              <CardTitle className="text-xl font-bold text-blue-700">
                {subsection.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 mb-4">{subsection.description}</p>
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                  Acessar 🚀
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
