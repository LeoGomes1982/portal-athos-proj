
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Briefcase, 
  Target,
  UserCheck,
  Archive
} from "lucide-react";

const subsections = [
  {
    id: "vagas",
    title: "Vagas",
    description: "Gestão de vagas disponíveis",
    icon: Briefcase,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    id: "banco-talentos",
    title: "Banco de Talentos",
    description: "Candidatos e talentos",
    icon: Target,
    bgColor: "bg-green-100",
    textColor: "text-green-700"
  },
  {
    id: "processo-seletivo",
    title: "Processo Seletivo",
    description: "Gestão de seleções",
    icon: UserCheck,
    bgColor: "bg-purple-100",
    textColor: "text-purple-700"
  },
  {
    id: "geladeira",
    title: "Geladeira",
    description: "Arquivos do RH",
    icon: Archive,
    bgColor: "bg-orange-100",
    textColor: "text-orange-700"
  }
];

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

        {/* Subsections Grid */}
        <div className="content-grid animate-slide-up">
          {subsections.map((subsection) => (
            <div 
              key={subsection.id}
              className="modern-card group relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 ${subsection.bgColor} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                  <subsection.icon size={32} className={subsection.textColor} />
                </div>
                <div>
                  <h3 className="subsection-title">{subsection.title}</h3>
                  <p className="text-description leading-relaxed">{subsection.description}</p>
                </div>
              </div>
            </div>
          ))}
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
