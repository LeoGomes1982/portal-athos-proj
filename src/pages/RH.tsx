
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-6 py-12">
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
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Recursos Humanos
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Gestão completa de pessoas, processos seletivos e desenvolvimento organizacional
          </p>
        </div>

        {/* Subsections Grid */}
        <div className="max-w-6xl mx-auto animate-slide-up">
          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {subsections.slice(0, 3).map((subsection) => (
              <div 
                key={subsection.id}
                className="group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 ${subsection.bgColor} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                    <subsection.icon size={32} className={subsection.textColor} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{subsection.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{subsection.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second row - 1 card centered */}
          <div className="flex justify-center">
            <div 
              key={subsections[3].id}
              className="group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150 w-full max-w-sm"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 ${subsections[3].bgColor} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                  <subsections[3].icon size={32} className={subsections[3].textColor} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{subsections[3].title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{subsections[3].description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-sm text-slate-500">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
