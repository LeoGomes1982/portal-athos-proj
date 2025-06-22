
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdmissaoSubsection } from "../subsections/AdmissaoSubsection";
import { FuncionariosSubsection } from "../subsections/FuncionariosSubsection";
import { UniformesSubsection } from "../subsections/UniformesSubsection";
import { DocumentosSubsection } from "../subsections/DocumentosSubsection";
import { ArquivoRHSubsection } from "../subsections/ArquivoRHSubsection";
import { 
  UserPlus, 
  Users, 
  Shirt, 
  FileText, 
  Archive,
  ArrowLeft 
} from "lucide-react";

const subsections = [
  {
    id: "admissao",
    title: "Admissão",
    icon: UserPlus,
    description: "Contratação de novos funcionários",
    stats: "12 este mês",
    color: "blue"
  },
  {
    id: "funcionarios",
    title: "Funcionários",
    icon: Users,
    description: "Gerenciar equipe ativa",
    stats: "147 ativos",
    color: "emerald"
  },
  {
    id: "uniformes",
    title: "Uniformes",
    icon: Shirt,
    description: "Controle de equipamentos",
    stats: "23 pendentes",
    color: "purple"
  },
  {
    id: "documentos",
    title: "Documentos",
    icon: FileText,
    description: "Arquivos e contratos",
    stats: "1.2k docs",
    color: "orange"
  },
  {
    id: "arquivo",
    title: "Arquivo",
    icon: Archive,
    description: "Histórico e backup",
    stats: "85 arquivos",
    color: "gray"
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
        <div className="mb-6">
          <Button
            onClick={() => setActiveSubsection(null)}
            variant="outline"
            size="lg"
            className="text-base font-medium px-6 py-3 shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar para RH
          </Button>
        </div>
        {renderSubsection()}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header mais limpo */}
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-3xl shadow-lg border border-gray-200 mb-4">
          <Users size={36} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Recursos Humanos</h1>
        </div>
        <p className="text-gray-600 text-lg">Gerencie sua equipe de forma simples e eficiente</p>
      </div>

      {/* Estatísticas agrupadas */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Resumo Atual</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">147</div>
            <div className="text-sm text-gray-600 font-medium">Funcionários</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="text-3xl font-bold text-emerald-600 mb-1">12</div>
            <div className="text-sm text-gray-600 font-medium">Admissões</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-1">23</div>
            <div className="text-sm text-gray-600 font-medium">Uniformes</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-2xl border border-orange-200">
            <div className="text-3xl font-bold text-orange-600 mb-1">1.2k</div>
            <div className="text-sm text-gray-600 font-medium">Documentos</div>
          </div>
        </div>
      </div>

      {/* Cards dos módulos organizados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subsections.map((subsection, index) => (
          <Card 
            key={subsection.id}
            className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white border-2 border-gray-200 hover:border-gray-300 overflow-hidden"
            onClick={() => setActiveSubsection(subsection.id)}
          >
            <CardHeader className="pb-4 text-center">
              <div className={`w-20 h-20 bg-${subsection.color}-50 border-2 border-${subsection.color}-200 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <subsection.icon size={32} className={`text-${subsection.color}-600`} />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                {subsection.title}
              </CardTitle>
              <div className={`inline-block px-4 py-2 bg-${subsection.color}-100 text-${subsection.color}-700 rounded-full text-sm font-semibold`}>
                {subsection.stats}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 text-center">
              <p className="text-gray-600 mb-4 text-base leading-relaxed">
                {subsection.description}
              </p>
              
              <Button 
                className={`w-full bg-${subsection.color}-600 hover:bg-${subsection.color}-700 text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                Acessar {subsection.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status do sistema mais visível */}
      <div className="text-center pt-6">
        <div className="inline-flex items-center gap-4 text-base text-gray-600 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl border border-gray-200 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Sistema Atualizado</span>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium">Dados Seguros</span>
          </div>
        </div>
      </div>
    </div>
  );
}
