
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
  ArrowRight 
} from "lucide-react";

const subsections = [
  {
    id: "admissao",
    title: "Admissão",
    icon: UserPlus,
    description: "Processo de contratação",
    stats: "12 este mês",
    color: "emerald"
  },
  {
    id: "funcionarios",
    title: "Funcionários",
    icon: Users,
    description: "Gestão da equipe",
    stats: "147 ativos",
    color: "blue"
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
    description: "Histórico e dados",
    stats: "85 registros",
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
    return renderSubsection();
  }

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header da Seção */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Users size={32} className="text-white" />
            </div>
            <div>
              <h1 className="page-title">Recursos Humanos</h1>
              <p className="page-subtitle mb-0">Gestão completa de pessoas e processos</p>
            </div>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="stats-grid animate-slide-up">
          <div className="stat-card">
            <div className="text-3xl font-bold text-emerald-600 mb-1">147</div>
            <div className="text-sm text-gray-600">Funcionários Ativos</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
            <div className="text-sm text-gray-600">Admissões/Mês</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-purple-600 mb-1">23</div>
            <div className="text-sm text-gray-600">Uniformes Pendentes</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-orange-600 mb-1">1.2k</div>
            <div className="text-sm text-gray-600">Documentos</div>
          </div>
        </div>

        {/* Módulos Principais */}
        <div className="responsive-grid animate-fade-in">
          {subsections.map((subsection) => (
            <Card 
              key={subsection.id}
              className="feature-card group"
              onClick={() => setActiveSubsection(subsection.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`icon-btn mx-auto mb-4 ${
                  subsection.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                  subsection.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  subsection.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  subsection.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <subsection.icon size={24} />
                </div>
                <CardTitle className="card-title">
                  {subsection.title}
                </CardTitle>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  subsection.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                  subsection.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  subsection.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                  subsection.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {subsection.stats}
                </div>
              </CardHeader>
              
              <CardContent className="text-center pt-0">
                <p className="text-gray-600 mb-6">
                  {subsection.description}
                </p>
                
                <Button className="primary-btn w-full group-hover:shadow-md">
                  <span>Acessar</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status Final */}
        <div className="text-center mt-12 animate-fade-in">
          <div className="inline-flex items-center gap-6 modern-card px-6 py-3">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Sistema Atualizado</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
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
