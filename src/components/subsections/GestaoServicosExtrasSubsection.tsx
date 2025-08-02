import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { GestaoServicosExtras } from "@/pages/GestaoServicosExtras";

interface GestaoServicosExtrasSubsectionProps {
  onBack: () => void;
}

export function GestaoServicosExtrasSubsection({ onBack }: GestaoServicosExtrasSubsectionProps) {
  return (
    <div className="app-container">
      <div className="content-wrapper animate-fade-in">
        {/* Navigation Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={onBack}
        >
          <ChevronLeft size={16} />
          Voltar
        </Button>

        {/* Gestão de Serviços Extras Content */}
        <div className="h-full overflow-auto">
          <GestaoServicosExtras />
        </div>
      </div>
    </div>
  );
}