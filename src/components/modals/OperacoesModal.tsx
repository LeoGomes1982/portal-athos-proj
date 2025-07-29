import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
    },
    {
      id: "fiscalizacoes" as const, 
      title: "Fiscalizações",
      description: "Fiscalização de postos e colaboradores",
      icon: Shield,
    }
  ];

  const handlePageSelect = (pageId: SelectedPage) => {
    setSelectedPage(pageId);
  };

  const handleClose = () => {
    setSelectedPage(null);
    onOpenChange(false);
  };

  // Se uma página específica foi selecionada, renderizar a página
  if (selectedPage === 'gestao-servicos-extras') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0">
          <div className="h-full overflow-auto">
            <GestaoServicosExtras />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (selectedPage === 'fiscalizacoes') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0">
          <div className="h-full overflow-auto">
            <Fiscalizacoes />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-[90vw] p-0">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[600px] flex flex-col items-center justify-center p-8">
          {/* Ícone e título principal */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Portal de Operações</h1>
            <p className="text-gray-600 text-center max-w-md">
              Gerencie serviços extras e fiscalizações de forma eficiente e organizada.
            </p>
          </div>

          {/* Cards das operações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            {operacoes.map((operacao) => {
              const IconComponent = operacao.icon;
              return (
                <div
                  key={operacao.id}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                  onClick={() => handlePageSelect(operacao.id)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {operacao.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {operacao.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 Grupo Athos. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}