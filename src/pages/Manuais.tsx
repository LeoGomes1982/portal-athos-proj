
import { useState } from "react";
import { ArrowLeft, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ManuaisNormasSubsection from "@/components/subsections/ManuaisNormasSubsection";
import NossaDecisaoSubsection from "@/components/subsections/NossaDecisaoSubsection";

const Manuais = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <Book size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">
            Manuais
          </h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Gestão de manuais e documentos normativos
          </p>
        </div>

        {/* Subsections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
          <div className="modern-card group relative p-8 border-2 transition-all duration-300 bg-secondary border-primary/20">
            <ManuaisNormasSubsection />
          </div>
          
          <div className="modern-card group relative p-8 border-2 transition-all duration-300 bg-secondary border-primary/20">
            <NossaDecisaoSubsection />
          </div>
        </div>

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

export default Manuais;
