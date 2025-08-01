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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Nova Fiscalização</DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Qual tipo de fiscalização você gostaria de realizar?
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-6">
          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 border-2 hover:border-primary/20"
            onClick={() => onSelecionarTipo('posto_servico')}
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Building className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg mb-1">Fiscalização de Posto</div>
              <div className="text-sm text-muted-foreground">
                Fiscalizar um posto de serviço específico
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 border-2 hover:border-primary/20"
            onClick={() => onSelecionarTipo('colaborador')}
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg mb-1">Fiscalização de Colaborador</div>
              <div className="text-sm text-muted-foreground">
                Fiscalizar um colaborador específico
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}