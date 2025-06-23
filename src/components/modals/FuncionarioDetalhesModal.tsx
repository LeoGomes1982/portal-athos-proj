
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600 flex items-center gap-3">
            <span className="text-4xl">{funcionario.foto}</span>
            Detalhes do Funcionário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações em linha horizontal */}
          <div className="flex items-center justify-between gap-6 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
            {/* Foto */}
            <div className="flex flex-col items-center min-w-fit">
              <div className="w-20 h-20 bg-green-100 border-2 border-green-300 rounded-3xl flex items-center justify-center shadow-lg mb-2">
                <span className="text-4xl">{funcionario.foto}</span>
              </div>
              <span className="text-xs text-green-600 font-medium">Foto</span>
            </div>

            {/* Nome */}
            <div className="flex flex-col items-center min-w-fit">
              <p className="text-xl font-bold text-slate-800 text-center mb-2">{funcionario.nome}</p>
              <span className="text-xs text-green-600 font-medium">Nome</span>
            </div>

            {/* Cargo */}
            <div className="flex flex-col items-center min-w-fit">
              <p className="text-lg font-semibold text-slate-700 text-center mb-2">{funcionario.cargo}</p>
              <span className="text-xs text-green-600 font-medium">Cargo</span>
            </div>

            {/* Data de Admissão */}
            <div className="flex flex-col items-center min-w-fit">
              <p className="text-lg font-medium text-slate-700 text-center mb-2">
                {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
              </p>
              <span className="text-xs text-green-600 font-medium">Admissão</span>
            </div>

            {/* Status */}
            <div className="flex flex-col items-center min-w-fit">
              <Select value={statusAtual} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40 mb-2 border-green-300">
                  <SelectValue>
                    <Badge className={`${statusInfo.color} text-white`}>
                      {statusInfo.label}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <Badge className={`${config.color} text-white`}>
                        {config.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-green-600 font-medium">Status</span>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t border-green-200">
            <Button variant="outline" onClick={onClose} className="border-green-300 text-green-700 hover:bg-green-50">
              Fechar
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              📝 Editar Dados
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
