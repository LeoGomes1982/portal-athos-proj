
import { useState } from "react";
import { ArrowLeft, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-600/80">Manuais Ativos</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-green-600/80">Normas Vigentes</div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-slide-up">
          {/* Coluna Manuais */}
          <Card className="modern-card">
            <CardHeader className="card-header bg-blue-50">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Book size={20} className="text-blue-600" />
                Manuais e Normas
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  12
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content p-4 min-h-96">
              <ManuaisNormasSubsection />
            </CardContent>
          </Card>

          {/* Coluna Nossa Decisão */}
          <Card className="modern-card">
            <CardHeader className="card-header bg-green-50">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <ArrowLeft size={20} className="text-green-600" />
                Nossa Decisão
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  8
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content p-4 min-h-96">
              <NossaDecisaoSubsection />
            </CardContent>
          </Card>
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
