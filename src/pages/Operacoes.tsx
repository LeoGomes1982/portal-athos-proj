import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Shield, Clock, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FiscalizacoesSubsection } from "@/components/subsections/FiscalizacoesSubsection";
import { GestaoServicosExtrasSubsection } from "@/components/subsections/GestaoServicosExtrasSubsection";
import { CuidadosTreinamentosSubsection } from "@/components/subsections/CuidadosTreinamentosSubsection";

export default function Operacoes() {
  const navigate = useNavigate();
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null);

  const subsections = [
    {
      id: "fiscalizacoes",
      title: "Fiscalizações",
      icon: Shield,
      description: "Fiscalização de postos de serviço e colaboradores",
      component: FiscalizacoesSubsection,
      bgColor: "bg-white",
      iconColor: "text-green-600",
      cardClass: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-150"
    },
    {
      id: "gestao-servicos-extras",
      title: "Gestão de Serviços Extras",
      icon: Clock,
      description: "Controle de serviços extras, valores e relatórios",
      component: GestaoServicosExtrasSubsection,
      bgColor: "bg-white",
      iconColor: "text-green-600",
      cardClass: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-150"
    },
    {
      id: "cuidados-treinamentos",
      title: "Cuidados e Treinamentos",
      icon: GraduationCap,
      description: "Gestão de treinamentos e cuidados operacionais",
      component: CuidadosTreinamentosSubsection,
      bgColor: "bg-white",
      iconColor: "text-green-600",
      cardClass: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-150"
    }
  ];

  const handleSubsectionClick = (subsectionId: string) => {
    if (subsectionId === "fiscalizacoes") {
      navigate('/fiscalizacoes');
    } else {
      setActiveSubsection(subsectionId);
    }
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
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Shield className="text-white text-3xl" size={40} />
          </div>
          <div>
            <h1 className="page-title mb-0">Operações</h1>
            <p className="text-description">Gestão operacional e fiscalizações</p>
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