
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
    icon: "🎯",
    description: "Novos talentos",
    gradient: "from-blue-400 to-blue-600",
    pattern: "bg-blue-50",
    stats: "12 este mês"
  },
  {
    id: "funcionarios",
    title: "Funcionários",
    icon: "👨‍💼",
    description: "Equipe ativa",
    gradient: "from-emerald-400 to-emerald-600",
    pattern: "bg-emerald-50",
    stats: "147 colaboradores"
  },
  {
    id: "uniformes",
    title: "Uniformes",
    icon: "👔",
    description: "Controle de EPI",
    gradient: "from-purple-400 to-purple-600",
    pattern: "bg-purple-50",
    stats: "23 pendentes"
  },
  {
    id: "documentos",
    title: "Documentos",
    icon: "📋",
    description: "Arquivos digitais",
    gradient: "from-orange-400 to-orange-600",
    pattern: "bg-orange-50",
    stats: "1.2k documentos"
  },
  {
    id: "arquivo",
    title: "Arquivo",
    icon: "🗃️",
    description: "Histórico completo",
    gradient: "from-gray-400 to-gray-600",
    pattern: "bg-gray-50",
    stats: "85 arquivados"
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
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20 mb-4">
          <span className="text-3xl">👥</span>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Recursos Humanos
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Gerencie sua equipe com inteligência e eficiência
        </p>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-blue-600">147</div>
          <div className="text-sm text-gray-600">Colaboradores</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-emerald-600">12</div>
          <div className="text-sm text-gray-600">Admissões</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-purple-600">23</div>
          <div className="text-sm text-gray-600">Uniformes</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-orange-600">1.2k</div>
          <div className="text-sm text-gray-600">Documentos</div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subsections.map((subsection, index) => (
          <Card 
            key={subsection.id}
            className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden relative ${
              index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
            }`}
            onClick={() => setActiveSubsection(subsection.id)}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${subsection.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 ${subsection.pattern} rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {subsection.icon}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 font-medium">{subsection.stats}</div>
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                {subsection.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative pt-0">
              <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
                {subsection.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${subsection.gradient} text-white rounded-full text-xs font-medium shadow-sm`}>
                  <span>Acessar</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom info */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-6 text-sm text-gray-500 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema Atualizado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Dados Seguros</span>
          </div>
        </div>
      </div>
    </div>
  );
}
