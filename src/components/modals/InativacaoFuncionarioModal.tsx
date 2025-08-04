import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InativacaoFuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionario: {
    id: number;
    nome: string;
    cargo: string;
  } | null;
  onConfirm: (dataInativacao: string, motivo: string) => void;
}

const motivosInativacao = [
  "Final de contrato 1º período",
  "Final de contrato 2º período", 
  "Demissão normal após aviso prévio",
  "Demissão normal sem aviso prévio",
  "Demissão por justa causa",
  "Acordo entre empresa e empregado",
  "Pedido de demissão",
  "Erro de sistema",
  "Duplicação do funcionário"
];

export function InativacaoFuncionarioModal({ 
  isOpen, 
  onClose, 
  funcionario, 
  onConfirm 
}: InativacaoFuncionarioModalProps) {
  const [dataInativacao, setDataInativacao] = useState(new Date().toISOString().split('T')[0]);
  const [motivoSelecionado, setMotivoSelecionado] = useState("");
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!motivoSelecionado) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione o motivo da inativação.",
        variant: "destructive"
      });
      return;
    }

    if (!dataInativacao) {
      toast({
        title: "Atenção", 
        description: "Por favor, informe a data de inativação.",
        variant: "destructive"
      });
      return;
    }

    onConfirm(dataInativacao, motivoSelecionado);
    handleClose();
  };

  const handleClose = () => {
    setDataInativacao(new Date().toISOString().split('T')[0]);
    setMotivoSelecionado("");
    onClose();
  };

  if (!funcionario) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <User className="w-5 h-5" />
            Inativar Funcionário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do funcionário */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-semibold text-slate-800 mb-1">{funcionario.nome}</h4>
            <p className="text-sm text-slate-600">{funcionario.cargo}</p>
          </div>

          {/* Data de inativação */}
          <div className="space-y-2">
            <Label htmlFor="dataInativacao" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              Data de Inativação
            </Label>
            <Input
              id="dataInativacao"
              type="date"
              value={dataInativacao}
              onChange={(e) => setDataInativacao(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Motivo da inativação */}
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo da Inativação</Label>
            <Select value={motivoSelecionado} onValueChange={setMotivoSelecionado}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o motivo..." />
              </SelectTrigger>
              <SelectContent>
                {motivosInativacao.map((motivo) => (
                  <SelectItem key={motivo} value={motivo}>
                    {motivo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Inativar Funcionário
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}