import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Denuncia } from "@/types/cicad";
import { statusConfig } from "@/config/cicadStatus";
import { useToast } from "@/hooks/use-toast";

interface ResolucaoCasoModalProps {
  isOpen: boolean;
  onClose: () => void;
  denuncia: Denuncia;
  onSubmit: (denunciaId: string, status: Denuncia['status'], resolucao: string) => void;
}

export function ResolucaoCasoModal({ isOpen, onClose, denuncia, onSubmit }: ResolucaoCasoModalProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<Denuncia['status']>(denuncia.status);
  const [resolucao, setResolucao] = useState(denuncia.resolucao || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((status === 'encerrado' || status === 'arquivado') && !resolucao.trim()) {
      toast({
        title: "Resolução obrigatória",
        description: "Para encerrar ou arquivar um caso, é necessário informar a resolução.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(denuncia.id, status, resolucao);
    toast({
      title: "Caso atualizado",
      description: "A resolução do caso foi salva com sucesso."
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resolução do Caso</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Case Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-800 mb-2">Caso:</h4>
            <p className="text-sm text-slate-600 mb-2">{denuncia.assunto}</p>
            <p className="text-sm text-slate-700">{denuncia.descricao}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="status">Status do Caso</Label>
              <Select value={status} onValueChange={(value: Denuncia['status']) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="resolucao">
                Resolução do Caso {(status === 'encerrado' || status === 'arquivado') && '*'}
              </Label>
              <Textarea
                id="resolucao"
                value={resolucao}
                onChange={(e) => setResolucao(e.target.value)}
                placeholder="Descreva as ações tomadas, investigações realizadas e a resolução final do caso..."
                rows={6}
                required={status === 'encerrado' || status === 'arquivado'}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="primary-btn">
                Salvar Resolução
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}