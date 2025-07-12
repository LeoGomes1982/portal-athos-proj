
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Users, 
  Shirt,
  FolderOpen,
  Archive,
  Briefcase, 
  UserCheck,
  Shield,
  Refrigerator
} from "lucide-react";
import { FuncionariosSubsection } from "@/components/subsections/FuncionariosSubsection";
import { ArquivoRHSubsection } from "@/components/subsections/ArquivoRHSubsection";
import { VagasTalentosSubsection } from "@/components/subsections/VagasTalentosSubsection";
import { UniformesSubsection } from "@/components/subsections/UniformesSubsection";
import { GeladeiraSubsection } from "@/components/subsections/GeladeiraSubsection";

import { NotificationBadge } from "@/components/NotificationBadge";
import { useDocumentNotifications } from "@/hooks/useDocumentNotifications";

const subsections = [
  {
    id: "vagas-talentos",
    title: "Vagas e Talentos",
    description: "Gestão de vagas e processos seletivos",
    icon: Briefcase,
    bgColor: "bg-primary/10",
    textColor: "text-primary"
  },
  {
    id: "processo-seletivo",
    title: "Processo Seletivo",
    description: "Kanban de candidatos em processo",
    icon: UserCheck,
    bgColor: "bg-blue-50",
    textColor: "text-blue-600"
  },
  {
    id: "funcionarios",
    title: "Funcionários",
    description: "Gestão de funcionários",
    icon: Users,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    id: "uniformes-epis",
    title: "Uniformes e EPIs",
    description: "Controle de estoque e entrega de uniformes e EPIs",
    icon: Shirt,
    bgColor: "bg-purple-100",
    textColor: "text-purple-700"
  },
  {
    id: "documentos",
    title: "Documentos",
    description: "Documentação pessoal",
    icon: FileText,
    bgColor: "bg-orange-100",
    textColor: "text-orange-700"
  },
  {
    id: "geladeira",
    title: "Geladeira",
    description: "Arquivos do RH",
    icon: Refrigerator,
    bgColor: "bg-teal-100",
    textColor: "text-teal-700"
  },
  {
    id: "arquivo",
    title: "Arquivo",
    description: "Arquivo de funcionários inativos",
    icon: Archive,
    bgColor: "bg-red-100",
    textColor: "text-red-700"
  }
];

export default function DP() {
  const navigate = useNavigate();
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null);
  const { hasNotifications, checkDocumentosVencendo } = useDocumentNotifications();

  // Verificar notificações quando o componente monta
  useEffect(() => {
    const savedDocs = localStorage.getItem('documentos');
    if (savedDocs) {
      checkDocumentosVencendo(JSON.parse(savedDocs));
    }
  }, [checkDocumentosVencendo]);

  const handleSubsectionClick = (subsectionId: string) => {
    if (subsectionId === "processo-seletivo") {
      navigate("/processo-seletivo");
    } else {
      setActiveSubsection(subsectionId);
    }
  };

  const handleBackToMain = () => {
    setActiveSubsection(null);
  };

  if (activeSubsection === "funcionarios") {
    return <FuncionariosSubsection onBack={handleBackToMain} />;
  }

  if (activeSubsection === "arquivo") {
    return <ArquivoRHSubsection onBack={handleBackToMain} />;
  }

  if (activeSubsection === "vagas-talentos") {
    return <VagasTalentosSubsection onBack={handleBackToMain} />;
  }

  if (activeSubsection === "uniformes-epis") {
    return <UniformesSubsection onBack={handleBackToMain} />;
  }

  if (activeSubsection === "geladeira") {
    return <GeladeiraSubsection onBack={handleBackToMain} />;
  }


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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6 shadow-lg relative">
            <FileText size={32} className="text-white" />
            <NotificationBadge show={hasNotifications} />
          </div>
          <h1 className="page-title text-center">
            DP e RH
          </h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Gestão completa de funcionários, documentação, controles administrativos e processos de RH
          </p>
        </div>

        {/* Subsections Grid */}
        <div className="content-grid animate-slide-up">
          {subsections.map((subsection) => (
            <div 
              key={subsection.id}
              className="modern-card group relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-secondary border-primary/20 hover:border-primary/30"
              onClick={() => handleSubsectionClick(subsection.id)}
            >
              {/* Notificação para documentos */}
              {subsection.id === "documentos" && (
                <NotificationBadge show={hasNotifications} />
              )}
              
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
