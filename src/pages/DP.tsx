
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
import { useAvisoVencimentos } from "@/hooks/useAvisoVencimentos";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    id: "destaque",
    title: "Destaque",
    description: "Informações importantes",
    icon: Users,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700"
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
  const { funcionariosComAvisos, hasAvisos, totalDocumentosVencendo, totalExperienciaVencendo, totalAvisoVencendo } = useAvisoVencimentos();
  const [showAvisosModal, setShowAvisosModal] = useState(false);

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

        {/* Card Aviso - aparece em cima centralizado quando há avisos */}
        {hasAvisos && (
          <div className="flex justify-center mb-8 animate-fade-in">
            <div 
              className="modern-card group relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-red-50 border-red-200 hover:border-red-300 animate-pulse max-w-md"
              onClick={() => setShowAvisosModal(true)}
            >
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">{funcionariosComAvisos.length}</span>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <FileText size={32} className="text-red-600" />
                </div>
                <div>
                  <h3 className="subsection-title text-red-700">Aviso</h3>
                  <div className="text-red-600 leading-relaxed text-sm space-y-1">
                    {totalDocumentosVencendo > 0 && (
                      <p>• Documentos vencendo ({totalDocumentosVencendo})</p>
                    )}
                    {totalAvisoVencendo > 0 && (
                      <p>• Aviso prévio vencendo ({totalAvisoVencendo})</p>
                    )}
                    {totalExperienciaVencendo > 0 && (
                      <p>• Experiência vencendo ({totalExperienciaVencendo})</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subsections Grid */}
        <div className="content-grid animate-slide-up">
          {subsections.map((subsection) => (
            <div 
              key={subsection.id}
              className="modern-card group relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-secondary border-primary/20 hover:border-primary/30"
              onClick={() => {
                if (subsection.id === "aviso") {
                  setShowAvisosModal(true);
                } else {
                  handleSubsectionClick(subsection.id);
                }
              }}
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

      {/* Modal de Avisos */}
      <Dialog open={showAvisosModal} onOpenChange={setShowAvisosModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <FileText className="h-5 w-5" />
              Avisos Importantes
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {funcionariosComAvisos.map((funcionario) => (
              <div key={funcionario.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="font-medium text-red-800">{funcionario.nome}</p>
                <div className="text-sm text-red-600 space-y-1">
                  {funcionario.documentosVencendo > 0 && (
                    <p>{funcionario.documentosVencendo} documento{funcionario.documentosVencendo > 1 ? 's' : ''} vencendo em 2 dias</p>
                  )}
                  {funcionario.experienciaVencendo && (
                    <p>Período de experiência termina em {new Date(funcionario.dataFimExperiencia!).toLocaleDateString('pt-BR')}</p>
                  )}
                  {funcionario.avisoVencendo && (
                    <p>Aviso prévio termina em {new Date(funcionario.dataFimAvisoPrevio!).toLocaleDateString('pt-BR')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowAvisosModal(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
