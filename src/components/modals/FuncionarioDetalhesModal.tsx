
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  setor: string;
  dataAdmissao: string;
  telefone: string;
  email: string;
  foto: string;
  status: "ativo" | "ferias" | "experiencia" | "aviso" | "inativo" | "destaque";
  cpf?: string;
  rg?: string;
  endereco?: string;
  salario?: string;
}

interface FuncionarioDetalhesModalProps {
  funcionario: Funcionario;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (funcionarioId: number, novoStatus: Funcionario['status']) => void;
}

const statusConfig = {
  ativo: { label: "Ativo", color: "bg-green-500", textColor: "text-green-700" },
  ferias: { label: "Em Férias", color: "bg-blue-500", textColor: "text-blue-700" },
  experiencia: { label: "Em Experiência", color: "bg-yellow-500", textColor: "text-yellow-700" },
  aviso: { label: "Em Aviso Prévio", color: "bg-red-500", textColor: "text-red-700" },
  inativo: { label: "Inativo", color: "bg-gray-500", textColor: "text-gray-700" },
  destaque: { label: "Destaque", color: "bg-yellow-500", textColor: "text-yellow-700" }
};

export function FuncionarioDetalhesModal({ funcionario, isOpen, onClose, onStatusChange }: FuncionarioDetalhesModalProps) {
  const [statusAtual, setStatusAtual] = useState(funcionario.status);

  const handleStatusChange = (novoStatus: string) => {
    const status = novoStatus as Funcionario['status'];
    setStatusAtual(status);
    onStatusChange(funcionario.id, status);
  };

  const statusInfo = statusConfig[statusAtual];

  console.log("Modal aberto:", isOpen, "Funcionario:", funcionario?.nome);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-600">
            Detalhes do Funcionário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações em linha horizontal compacta */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            {/* Foto */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 border border-green-300 rounded-full flex items-center justify-center">
                <span className="text-2xl">{funcionario.foto}</span>
              </div>
            </div>

            {/* Nome */}
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold text-slate-800 truncate">{funcionario.nome}</p>
            </div>

            {/* Cargo */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{funcionario.cargo}</p>
            </div>

            {/* Data de Admissão */}
            <div className="flex-shrink-0">
              <p className="text-sm text-slate-600">
                {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Status */}
            <div className="flex-shrink-0">
              <Select value={statusAtual} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-32">
                  <SelectValue>
                    <Badge className={`${statusInfo.color} text-white text-xs`}>
                      {statusInfo.label}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <Badge className={`${config.color} text-white text-xs`}>
                        {config.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="border-green-300 text-green-700 hover:bg-green-50">
              Fechar
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              📝 Editar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
