import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building, User } from "lucide-react";

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
          <DialogTitle className="text-center text-xl font-semibold">Nova Fiscalização</DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Qual tipo de fiscalização você gostaria de realizar?
          </p>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <Button
            variant="outline"
            className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground"
            onClick={() => onSelecionarTipo('posto_servico')}
          >
            <Building className="h-6 w-6" />
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