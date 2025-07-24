
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Briefcase, TrendingUp, Target, Shirt, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlanosCargosSubsection } from "@/components/subsections/PlanosCargosSubsection";
import { ResultadosPessoaisSubsection } from "@/components/subsections/ResultadosPessoaisSubsection";
import { TomadaDecisaoSubsection } from "@/components/subsections/TomadaDecisaoSubsection";
import { UniformesSubsection } from "@/components/subsections/UniformesSubsection";

export default function Gerencia() {
  const navigate = useNavigate();
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null);

  const subsections = [
    {
      id: "planos-cargos",
      title: "Planos de Cargos e Salários",
      icon: Briefcase,
      description: "Gestão de cargos, níveis e estrutura salarial",
      component: PlanosCargosSubsection,
      bgColor: "bg-white",
      iconColor: "text-purple-600",
      cardClass: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150"
    },
    {
      id: "uniformes-epis",
      title: "Uniformes e EPIs",
      icon: Shirt,
      description: "Controle de estoque e entrega de uniformes e EPIs",
      component: UniformesSubsection,
      bgColor: "bg-white",
      iconColor: "text-purple-600",
      cardClass: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150"
    },
    {
      id: "resultados-pessoais",
      title: "Resultados Pessoais",
      icon: TrendingUp,
      description: "Acompanhamento de performance e metas individuais",
      component: ResultadosPessoaisSubsection,
      bgColor: "bg-white",
      iconColor: "text-blue-600",
      cardClass: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150"
    },
    {
      id: "tomada-decisao",
      title: "Tomada de Decisão",
      icon: Target,
      description: "Ferramentas e processos para tomada de decisão",
      component: TomadaDecisaoSubsection,
      bgColor: "bg-white",
      iconColor: "text-green-600",
      cardClass: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150"
    }
  ];

  const handleSubsectionClick = (subsectionId: string) => {
    setActiveSubsection(subsectionId);
  };

  const handleBackToMain = () => {
    setActiveSubsection(null);
  };

  if (activeSubsection) {
    const SubsectionComponent = subsections.find(s => s.id === activeSubsection)?.component;
    return SubsectionComponent ? <SubsectionComponent onBack={handleBackToMain} /> : null;
  }

  return (
    <div className="app-container">
      <div className="content-wrapper animate-fade-in">
        {/* Navigation Button */}
        <div className="navigation-button">
          <button onClick={() => navigate("/")} className="back-button">
            <ChevronLeft size={16} />
            Voltar ao Portal
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white text-3xl">🏢</span>
          </div>
          <div>
            <h1 className="page-title mb-0">Gerência</h1>
            <p className="text-description">Gestão estratégica e operacional</p>
          </div>
        </div>

        {/* Subsections Grid */}
        <div className="content-grid animate-slide-up">
          {subsections.map((subsection) => (
            <div 
              key={subsection.id}
              className={`modern-card group relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${subsection.cardClass}`}
              onClick={() => handleSubsectionClick(subsection.id)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 ${subsection.bgColor} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                  <subsection.icon size={32} className={subsection.iconColor} />
                </div>
                <div>
                  <h3 className="subsection-title">{subsection.title}</h3>
                  <p className="text-description leading-relaxed">{subsection.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
