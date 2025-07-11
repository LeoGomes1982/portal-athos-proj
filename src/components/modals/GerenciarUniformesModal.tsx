import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Shirt, Package } from "lucide-react";
import { EntradaUniformeModal } from "./EntradaUniformeModal";
import { EntregaUniformeModal } from "./EntregaUniformeModal";

interface GerenciarUniformesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEntradaEstoque: (dados: { item: string; categoria: "uniforme" | "epi"; tamanhos: { [tamanho: string]: number } }) => void;
  onEntregaUniforme: (dados: { funcionarioId: number; funcionarioNome: string; item: string; categoria: "uniforme" | "epi"; tamanho: string; quantidade: number }) => void;
  estoque: Array<{ id: string; nome: string; categoria: "uniforme" | "epi"; quantidade: number; tamanhos: { [tamanho: string]: number } }>;
}

export function GerenciarUniformesModal({ 
  isOpen, 
  onClose, 
  onEntradaEstoque, 
  onEntregaUniforme, 
  estoque 
}: GerenciarUniformesModalProps) {
  const [showEntradaModal, setShowEntradaModal] = useState(false);
  const [showEntregaModal, setShowEntregaModal] = useState(false);

  const handleEntradaClick = () => {
    onClose();
    setShowEntradaModal(true);
  };

  const handleEntregaClick = () => {
    onClose();
    setShowEntregaModal(true);
  };

  const handleEntradaClose = () => {
    setShowEntradaModal(false);
  };

  const handleEntregaClose = () => {
    setShowEntregaModal(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              👕 Gerenciar Uniformes e EPIs
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-slate-600 mb-6">
              Escolha uma das opções abaixo para gerenciar o controle de uniformes e EPIs:
            </p>

            <div className="space-y-3">
              <Button 
                className="w-full h-16 bg-primary hover:bg-primary/90 text-white flex items-center gap-3 text-left justify-start px-6"
                onClick={handleEntradaClick}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
                  <Plus size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Registrar Entrada de Uniforme</div>
                  <div className="text-sm opacity-90">Adicionar peças ao estoque da empresa</div>
                </div>
              </Button>

              <Button 
                variant="outline"
                className="w-full h-16 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 flex items-center gap-3 text-left justify-start px-6"
                onClick={handleEntregaClick}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Shirt size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">Entrega de Uniforme</div>
                  <div className="text-sm text-slate-600">Registrar entrega para funcionários</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sub-modals */}
      <EntradaUniformeModal
        isOpen={showEntradaModal}
        onClose={handleEntradaClose}
        onSubmit={(dados) => {
          onEntradaEstoque(dados);
          handleEntradaClose();
        }}
      />

      <EntregaUniformeModal
        isOpen={showEntregaModal}
        onClose={handleEntregaClose}
        onSubmit={(dados) => {
          onEntregaUniforme(dados);
          handleEntregaClose();
        }}
        estoque={estoque}
      />
    </>
  );
}