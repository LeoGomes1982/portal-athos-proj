
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
  aviso: { label: "Em Aviso Prévio", color: "bg-orange-500", textColor: "text-orange-700" },
  inativo: { label: "Inativo", color: "bg-gray-500", textColor: "text-gray-700" },
  destaque: { label: "Destaque", color: "bg-purple-500", textColor: "text-purple-700" }
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 flex items-center gap-3">
            <span className="text-4xl">{funcionario.foto}</span>
            Detalhes do Funcionário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <span className="font-medium">Status:</span>
            <Select value={statusAtual} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
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
          </div>

          {/* Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">👤 Informações Pessoais</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                  <p className="text-lg font-medium">{funcionario.nome}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">CPF</label>
                  <p>{funcionario.cpf || "000.000.000-00"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">RG</label>
                  <p>{funcionario.rg || "00.000.000-0"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">📞 Telefone</label>
                  <p>{funcionario.telefone}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">📧 E-mail</label>
                  <p className="break-all">{funcionario.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">🏠 Endereço</label>
                  <p>{funcionario.endereco || "Rua Exemplo, 123 - Centro"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">💼 Informações Profissionais</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Cargo</label>
                  <p className="text-lg font-medium">{funcionario.cargo}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Setor</label>
                  <p>
                    <Badge variant="secondary">{funcionario.setor}</Badge>
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">📅 Data de Admissão</label>
                  <p>{new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">⏱️ Tempo na Empresa</label>
                  <p>
                    {Math.floor((new Date().getTime() - new Date(funcionario.dataAdmissao).getTime()) / (1000 * 60 * 60 * 24 * 30))} meses
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">💰 Salário</label>
                  <p>{funcionario.salario || "R$ 0.000,00"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              📝 Editar Dados
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
