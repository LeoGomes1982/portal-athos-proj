import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { GestaoServicosExtras } from "@/pages/GestaoServicosExtras";

interface GestaoServicosExtrasSubsectionProps {
  onBack: () => void;
}

export function GestaoServicosExtrasSubsection({ onBack }: GestaoServicosExtrasSubsectionProps) {
  return (
    <div className="h-full">
      {/* Navigation Button */}
      <div className="p-4 border-b">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={16} />
          Voltar
        </button>
      </div>

      {/* Gestão de Serviços Extras Content */}
      <div className="h-full overflow-auto">
        <GestaoServicosExtras />
      </div>
    </div>
  );
}