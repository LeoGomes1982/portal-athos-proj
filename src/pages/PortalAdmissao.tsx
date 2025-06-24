
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AdmissaoModal } from "@/components/modals/AdmissaoModal";
import { Shield, Lock, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PortalAdmissao = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isInternalAccess, setIsInternalAccess] = useState(false);
  const { toast } = useToast();

  // Senha fixa de 4 dígitos (você pode alterar esta senha)
  const ACCESS_PASSWORD = "1234";
  const INTERNAL_PASSWORDS = ["DP01", "DP02", "DP03", "DP04", "DP05"];

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

  const handlePasswordSubmit = () => {
    const isInternalPassword = INTERNAL_PASSWORDS.includes(password);
    
    if (password === ACCESS_PASSWORD || isInternalPassword) {
      setIsAuthenticated(true);
      setIsInternalAccess(isInternalPassword);
      
      if (isInternalPassword) {
        setCurrentStep(4); // All steps unlocked for internal access
      }
      
      toast({
        title: "Acesso liberado!",
        description: isInternalPassword 
          ? "Acesso interno - Todos os módulos liberados." 
          : "Bem-vindo ao Portal de Admissão.",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "Por favor, verifique a senha e tente novamente.",
        variant: "destructive",
      });
      setPassword("");
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
    if (isInternalAccess || stepId <= currentStep) {
      if (stepId === 1) {
        handleOpenModal();
      }
      // Add other step actions here as needed
    }
  };

  const getStepProgress = (stepIndex: number) => {
    if (isInternalAccess) return 100;
    if (stepIndex < currentStep) return 100;
    if (stepIndex === currentStep) return 50;
    return 0;
  };

  const isStepUnlocked = (stepId: number) => {
    return isInternalAccess || stepId <= currentStep;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Acesso Restrito
            </CardTitle>
            <p className="text-slate-600">
              Digite a senha de 4 dígitos para acessar o Portal de Admissão
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <InputOTP
                maxLength={4}
                value={password}
                onChange={(value) => setPassword(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
              
              <Button 
                onClick={handlePasswordSubmit}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                disabled={password.length !== 4}
              >
                <Lock className="w-4 h-4 mr-2" />
                Acessar Portal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
            <UserPlus size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Portal de Admissão
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Bem-vindo ao nosso processo de admissão online. Siga os passos abaixo para completar sua jornada conosco.
          </p>
        </div>

        {/* Process Steps with Connection Lines */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connection Lines - Behind Cards */}
            <div className="absolute top-16 left-0 w-full h-1 z-0 hidden lg:block">
              {/* Background gray line */}
              <div className="w-full h-full bg-gray-300 rounded-full" />
              
              {/* Progress lines */}
              <div className="absolute top-0 left-0 h-full flex">
                {steps.slice(0, -1).map((_, index) => {
                  const segmentWidth = 100 / (steps.length - 1);
                  const progressPercent = getStepProgress(index + 1);
                  
                  return (
                    <div 
                      key={index} 
                      className="h-full relative"
                      style={{ width: `${segmentWidth}%` }}
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cards */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const isUnlocked = isStepUnlocked(step.id);
                const isClickable = step.id === 1 && isUnlocked;
                
                return (
                  <Card 
                    key={step.id}
                    className={`text-center p-6 transition-all duration-300 ${
                      isClickable ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''
                    } ${
                      isUnlocked 
                        ? 'opacity-100 bg-white border-emerald-200' 
                        : 'opacity-50 grayscale bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => handleStepClick(step.id)}
                  >
                    <CardHeader>
                      <div className={`mx-auto w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${
                        isUnlocked 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <span className="text-3xl">{step.icon}</span>
                      </div>
                      <CardTitle className={`text-lg transition-colors duration-300 ${
                        isUnlocked ? 'text-slate-800' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isUnlocked && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mx-auto animate-pulse" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <span className="text-sm text-slate-600">
                Progresso: {isInternalAccess ? '100' : Math.round((currentStep / (steps.length - 1)) * 100)}%
              </span>
            </div>
            <Progress 
              value={isInternalAccess ? 100 : (currentStep / (steps.length - 1)) * 100} 
              className="h-2"
            />
          </div>
        </div>

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
