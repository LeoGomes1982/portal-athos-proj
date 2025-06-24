
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdmissaoModal } from "@/components/modals/AdmissaoModal";
import { Shield, Lock, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PortalAdmissao = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Senha fixa de 4 dígitos (você pode alterar esta senha)
  const ACCESS_PASSWORD = "1234";

  const handlePasswordSubmit = () => {
    if (password === ACCESS_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Acesso liberado!",
        description: "Bem-vindo ao Portal de Admissão.",
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

        {/* Cards do Processo */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center p-6">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👋</span>
              </div>
              <CardTitle className="text-lg">Boas vindas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Seja bem-vindo ao nosso processo de admissão
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleOpenModal}>
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <CardTitle className="text-lg">Formulário de Admissão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Clique aqui para preencher seus dados pessoais e profissionais
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <CardTitle className="text-lg">Verificação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Nossa equipe verificará suas informações e documentos
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <CardTitle className="text-lg">Bem vindo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Parabéns! Você faz parte da nossa equipe
              </p>
            </CardContent>
          </Card>
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
