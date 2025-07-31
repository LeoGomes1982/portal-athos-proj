import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Clock, Shield, MapPin, User, X } from "lucide-react";
import { GestaoServicosExtras } from "@/pages/GestaoServicosExtras";
import { useNavigate } from "react-router-dom";

interface OperacoesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type SelectedPage = 'gestao-servicos-extras' | 'fiscalizacoes' | 'escolha-fiscalizacao' | null;

export function OperacoesModal({ isOpen, onOpenChange }: OperacoesModalProps) {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(null);

  const operacoes = [
    {
      id: "gestao-servicos-extras" as const,
      title: "Gestão de Serviços Extras",
      description: "Controle de serviços extras, valores e relatórios",
      icon: Clock,
    },
    {
      id: "escolha-fiscalizacao" as const, 
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

  const handleBackToMenu = () => {
    setSelectedPage(null);
  };

  // Modal de escolha de tipo de fiscalização
  if (selectedPage === 'escolha-fiscalizacao') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl w-[90vw] p-0">
          <div className="bg-white rounded-lg p-8 relative">
            {/* Botão fechar */}
            <button
              onClick={handleBackToMenu}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            {/* Título */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Nova Fiscalização</h2>
              <p className="text-gray-600">Como você gostaria de realizar esta fiscalização?</p>
            </div>

            {/* Opções */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fiscalização de Posto de Serviço */}
              <div
                className="bg-gray-50 rounded-lg p-8 cursor-pointer hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-blue-200"
                onClick={() => {
                  handleClose();
                  navigate('/operacoes/fiscalizacoes', { state: { tipo: 'posto_servico' } });
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Fiscalização de Posto de Serviço
                  </h3>
                  <p className="text-sm text-gray-600">
                    Preencher a fiscalização diretamente nesta tela
                  </p>
                </div>
              </div>

              {/* Fiscalização de Colaborador */}
              <div
                className="bg-gray-50 rounded-lg p-8 cursor-pointer hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-blue-200"
                onClick={() => {
                  handleClose();
                  navigate('/operacoes/fiscalizacoes', { state: { tipo: 'colaborador' } });
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Fiscalização de Colaborador
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gerar link para compartilhar via WhatsApp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Se Gestão de Serviços Extras foi selecionada
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