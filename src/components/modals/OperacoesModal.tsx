import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OperacoesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OperacoesModal({ isOpen, onOpenChange }: OperacoesModalProps) {
  const navigate = useNavigate();

  const operacoes = [
    {
      id: "gestao-servicos-extras",
      title: "Gestão de Serviços Extras",
      description: "Controle de serviços extras, valores e relatórios",
      icon: Clock,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      onClick: () => {
        navigate("/operacoes/gestao-servicos-extras");
        onOpenChange(false);
      }
    },
    {
      id: "fiscalizacoes", 
      title: "Fiscalizações",
      description: "Fiscalização de postos e colaboradores",
      icon: Shield,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      onClick: () => {
        navigate("/operacoes/fiscalizacoes");
        onOpenChange(false);
      }
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Operações
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-3">
          {operacoes.map((operacao) => {
            const IconComponent = operacao.icon;
            return (
              <Button
                key={operacao.id}
                variant="outline"
                className="h-auto p-4 justify-start gap-3 hover:bg-gray-50"
                onClick={operacao.onClick}
              >
                <div className={`p-2 rounded-lg ${operacao.bgColor}`}>
                  <IconComponent className={`h-5 w-5 ${operacao.textColor}`} />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800">{operacao.title}</div>
                  <div className="text-sm text-gray-600">{operacao.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}