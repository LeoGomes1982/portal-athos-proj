import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, User } from "lucide-react";

interface EscolhaTipoFiscalizacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelecionarTipo: (tipo: 'posto_servico' | 'colaborador') => void;
}

export function EscolhaTipoFiscalizacaoModal({ open, onOpenChange, onSelecionarTipo }: EscolhaTipoFiscalizacaoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Escolha o Tipo de Fiscalização</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Button
            variant="outline"
            className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground"
            onClick={() => onSelecionarTipo('posto_servico')}
          >
            <MapPin className="h-6 w-6" />
            <span className="text-sm font-medium">Fiscalização de Posto de Serviço</span>
          </Button>

          <Button
            variant="outline"
            className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground"
            onClick={() => onSelecionarTipo('colaborador')}
          >
            <User className="h-6 w-6" />
            <span className="text-sm font-medium">Fiscalização de Colaborador</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}