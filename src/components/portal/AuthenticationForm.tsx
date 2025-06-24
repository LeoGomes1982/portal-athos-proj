
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthenticationFormProps {
  onAuthenticate: (isInternal: boolean) => void;
}

export const AuthenticationForm = ({ onAuthenticate }: AuthenticationFormProps) => {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const ACCESS_PASSWORD = "1234";
  const INTERNAL_PASSWORDS = ["DP01", "DP02", "DP03", "DP04", "DP05"];

  const handlePasswordSubmit = () => {
    const isInternalPassword = INTERNAL_PASSWORDS.includes(password);
    
    if (password === ACCESS_PASSWORD || isInternalPassword) {
      onAuthenticate(isInternalPassword);
      
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
};
