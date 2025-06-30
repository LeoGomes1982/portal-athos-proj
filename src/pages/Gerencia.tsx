
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Briefcase, TrendingUp, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlanosCargosSubsection } from "@/components/subsections/PlanosCargosSubsection";
import { ResultadosPessoaisSubsection } from "@/components/subsections/ResultadosPessoaisSubsection";
import { TomadaDecisaoSubsection } from "@/components/subsections/TomadaDecisaoSubsection";

export default function Gerencia() {
  const navigate = useNavigate();
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null);

  const subsections = [
    {
      id: "planos-cargos",
      title: "Planos de Cargos e Salários",
      icon: Briefcase,
      description: "Gestão de cargos, níveis e estrutura salarial",
      component: PlanosCargosSubsection
    },
    {
      id: "resultados-pessoais",
      title: "Resultados Pessoais",
      icon: TrendingUp,
      description: "Acompanhamento de performance e metas individuais",
      component: ResultadosPessoaisSubsection
    },
    {
      id: "tomada-decisao",
      title: "Tomada de Decisão",
      icon: Target,
      description: "Ferramentas e processos para tomada de decisão",
      component: TomadaDecisaoSubsection
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
            <Card 
              key={subsection.id}
              className="modern-card group hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleSubsectionClick(subsection.id)}
            >
              <CardHeader className="card-header">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <subsection.icon className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="subsection-title text-center">{subsection.title}</CardTitle>
              </CardHeader>
              <CardContent className="card-content">
                <p className="text-description text-center leading-relaxed">
                  {subsection.description}
                </p>
                <div className="mt-6 flex justify-center">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300"
                  >
                    Acessar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
