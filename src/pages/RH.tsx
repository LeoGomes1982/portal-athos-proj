
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Users
} from "lucide-react";

export default function RH() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <Users size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">
            Recursos Humanos
          </h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Gestão completa de pessoas, processos seletivos e desenvolvimento organizacional
          </p>
        </div>

        {/* Empty state - subsections moved to DP */}
        <div className="text-center py-16 animate-fade-in">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">Seção em Desenvolvimento</h3>
          <p className="text-gray-500 mb-6">As funcionalidades de RH foram movidas para o Departamento Pessoal</p>
          <Button 
            onClick={() => navigate("/dp")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Ir para Departamento Pessoal
          </Button>
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
}
