
import { useState } from "react";
import { ArrowLeft, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ManuaisSection from "@/components/sections/ManuaisSection";

const Manuais = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="page-header animate-slide-up">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft size={16} />
          </Button>
          <div className="page-header-icon">
            <Book size={24} className="text-blue-600" />
          </div>
          <div>
            <h1 className="page-title mb-0">Manuais</h1>
            <p className="text-description">
              Gestão de manuais e documentos normativos
            </p>
          </div>
        </div>

        {/* Content */}
        <ManuaisSection />
      </div>
    </div>
  );
};

export default Manuais;
