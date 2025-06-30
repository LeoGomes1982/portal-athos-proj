
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Building2 } from "lucide-react";

const PortalVagas = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const cards = [
    {
      id: "vagas",
      title: "Vagas",
      description: "Confira nossas oportunidades disponíveis",
      icon: Target,
      color: "emerald"
    },
    {
      id: "nossa-empresa", 
      title: "Nossa Empresa",
      description: "Conheça mais sobre o Grupo Athos",
      icon: Building2,
      color: "emerald"
    }
  ];

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
            <Target size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4 leading-tight">
            Portal de Vagas
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore nossas oportunidades de carreira e faça parte da nossa equipe.
          </p>
        </div>

        {/* Cards */}
        <div className="content-grid animate-slide-up max-w-4xl mx-auto">
          {cards.map((card) => (
            <Card 
              key={card.id}
              className="modern-card group relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-150"
              onClick={() => setActiveCard(card.id)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <card.icon size={32} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="subsection-title mb-2">{card.title}</h3>
                    <p className="text-description leading-relaxed">{card.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Placeholder for future functionality */}
        {activeCard && (
          <div className="text-center mt-12 animate-fade-in">
            <p className="text-slate-600 text-lg">
              {activeCard === "vagas" ? "Funcionalidade de vagas será implementada em breve." : "Informações sobre nossa empresa serão adicionadas em breve."}
            </p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => setActiveCard(null)}
            >
              Voltar
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalVagas;
