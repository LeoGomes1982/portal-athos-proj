
import { useState, useEffect } from "react";
import { AdmissaoModal } from "@/components/modals/AdmissaoModal";
import { AuthenticationForm } from "@/components/portal/AuthenticationForm";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { StepsProgress } from "@/components/portal/StepsProgress";
import { useToast } from "@/hooks/use-toast";

const PortalAdmissao = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isInternalAccess, setIsInternalAccess] = useState(false);
  const { toast } = useToast();

  const steps = [
    { id: 0, title: "Boas vindas", icon: "👋", unlocked: true },
    { id: 1, title: "Formulário de Admissão", icon: "📋", unlocked: false },
    { id: 2, title: "Verificação", icon: "✅", unlocked: false },
    { id: 3, title: "Bem vindo", icon: "🎉", unlocked: false }
  ];

  useEffect(() => {
    // Automatically unlock first step when authenticated
    if (isAuthenticated && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [isAuthenticated]);

  const handleAuthenticate = (isInternal: boolean) => {
    setIsAuthenticated(true);
    setIsInternalAccess(isInternal);
    
    if (isInternal) {
      setCurrentStep(4); // All steps unlocked for internal access
    }
  };

  const handleOpenModal = () => {
    if (currentStep >= 1 || isInternalAccess) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmitted = () => {
    if (!isInternalAccess && currentStep === 1) {
      setCurrentStep(2);
      toast({
        title: "Formulário enviado!",
        description: "Agora aguarde nossa verificação.",
      });
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId === 1) {
      handleOpenModal();
    }
    // Add other step actions here as needed
  };

  if (!isAuthenticated) {
    return <AuthenticationForm onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="container mx-auto px-6 py-12">
        <PortalHeader />
        
        <StepsProgress
          steps={steps}
          currentStep={currentStep}
          isInternalAccess={isInternalAccess}
          onStepClick={handleStepClick}
        />

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-slate-500">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      <AdmissaoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PortalAdmissao;
