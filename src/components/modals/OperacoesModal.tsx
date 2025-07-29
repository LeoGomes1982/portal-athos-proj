import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Shield } from "lucide-react";
import { GestaoServicosExtras } from "@/pages/GestaoServicosExtras";
import { Fiscalizacoes } from "@/pages/Fiscalizacoes";

interface OperacoesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type SelectedPage = 'gestao-servicos-extras' | 'fiscalizacoes' | null;

export function OperacoesModal({ isOpen, onOpenChange }: OperacoesModalProps) {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(null);

  const operacoes = [
    {
      id: "gestao-servicos-extras" as const,
      title: "Gestão de Serviços Extras",
      description: "Controle de serviços extras, valores e relatórios",
      icon: Clock,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700"
    },
    {
      id: "fiscalizacoes" as const, 
      title: "Fiscalizações",
      description: "Fiscalização de postos e colaboradores",
      icon: Shield,
      bgColor: "bg-green-100",
      textColor: "text-green-700"
    }
  ];

  const handlePageSelect = (pageId: SelectedPage) => {
    setSelectedPage(pageId);
  };

  const handleBackToMenu = () => {
    setSelectedPage(null);
  };

  const handleClose = () => {
    setSelectedPage(null);
    onOpenChange(false);
  };

  // Se uma página específica foi selecionada, renderizar lado a lado
  if (selectedPage) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0">
          <div className="flex h-full">
            {/* Gestão de Serviços Extras */}
            <div className="flex-1 border-r">
              <div className="h-full overflow-auto">
                <GestaoServicosExtras />
              </div>
            </div>
            
            {/* Fiscalizações */}
            <div className="flex-1">
              <div className="h-full overflow-auto">
                <Fiscalizacoes />
              </div>
            </div>
          </div>
          
          {/* Botão voltar */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-16 z-10"
            onClick={handleBackToMenu}
          >
            Menu
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
                onClick={() => handlePageSelect(operacao.id)}
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