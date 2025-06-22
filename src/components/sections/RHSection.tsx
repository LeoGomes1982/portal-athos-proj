
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
    description: "Processo de contratação e integração",
    stats: "12 este mês",
    color: "blue"
  },
  {
    id: "funcionarios",
    title: "Funcionários",
    icon: Users,
    description: "Gestão da equipe ativa",
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
    color: "slate"
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
      <div className="system-page animate-fade-in">
        <div className="system-container">
          <div className="mb-6">
            <Button
              onClick={() => setActiveSubsection(null)}
              variant="outline"
              size="lg"
              className="glass-button"
            >
              <ArrowLeft size={20} className="mr-2" />
              Voltar para RH
            </Button>
          </div>
          {renderSubsection()}
        </div>
      </div>
    );
  }

  return (
    <div className="system-page">
      <div className="system-container">
        {/* Header da seção */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-4 glass-card px-8 py-6 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Users size={28} className="text-white" />
            </div>
            <div className="text-left">
              <h1 className="system-title mb-0">Recursos Humanos</h1>
              <p className="system-subtitle mb-0">Gestão completa de pessoas e talentos</p>
            </div>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <div className="stat-card stat-card-blue">
            <div className="text-2xl font-bold mb-1">147</div>
            <div className="text-sm">Funcionários</div>
          </div>
          <div className="stat-card stat-card-emerald">
            <div className="text-2xl font-bold mb-1">12</div>
            <div className="text-sm">Admissões</div>
          </div>
          <div className="stat-card stat-card-purple">
            <div className="text-2xl font-bold mb-1">23</div>
            <div className="text-sm">Uniformes</div>
          </div>
          <div className="stat-card stat-card-orange">
            <div className="text-2xl font-bold mb-1">1.2k</div>
            <div className="text-sm">Documentos</div>
          </div>
        </div>

        {/* Cards dos módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {subsections.map((subsection) => (
            <Card 
              key={subsection.id}
              className="section-card cursor-pointer"
              onClick={() => setActiveSubsection(subsection.id)}
            >
              <CardHeader className="pb-4 text-center">
                <div className={`section-icon bg-${subsection.color}-50 text-${subsection.color}-600 border-${subsection.color}-200`}>
                  <subsection.icon size={28} />
                </div>
                <CardTitle className="section-title">
                  {subsection.title}
                </CardTitle>
                <div className={`inline-block px-4 py-2 bg-${subsection.color}-100 text-${subsection.color}-700 rounded-full text-sm font-semibold`}>
                  {subsection.stats}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 text-center">
                <p className="section-description mb-6">
                  {subsection.description}
                </p>
                
                <Button className={`action-button action-button-${subsection.color} w-full`}>
                  Acessar {subsection.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status do sistema */}
        <div className="text-center mt-8 animate-fade-in">
          <div className="inline-flex items-center gap-4 glass-card px-6 py-3">
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Sistema Atualizado</span>
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Dados Seguros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
