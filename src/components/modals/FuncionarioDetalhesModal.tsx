
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100 border border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-700 flex items-center gap-3">
            <span className="text-3xl">{funcionario.foto}</span>
            Detalhes do Funcionário
            {funcionario.status === 'destaque' && (
              <div className="relative">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-400 drop-shadow-lg animate-pulse" style={{
                  filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.9)) brightness(1.3) saturate(1.2)'
                }} />
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Principais */}
          <Card className="border-slate-200 bg-gradient-to-r from-slate-50/70 to-gray-50/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Nome Completo</label>
                    <p className="text-lg font-bold text-slate-800">{funcionario.nome}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Cargo</label>
                    <p className="text-md font-medium text-slate-700">{funcionario.cargo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Setor</label>
                    <Badge variant="secondary" className="bg-slate-200 text-slate-700 font-medium">{funcionario.setor}</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Data de Admissão</label>
                    <p className="text-md font-medium text-slate-700">
                      {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Status Atual</label>
                    <div className="mt-1">
                      <Select value={statusAtual} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-48 bg-white/80 border-slate-300">
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <Card className="border-slate-200 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                📞 Informações de Contato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Telefone</label>
                  <p className="text-md font-medium text-slate-700">{funcionario.telefone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">E-mail</label>
                  <p className="text-md font-medium text-slate-700 break-all">{funcionario.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentos Pessoais */}
          {(funcionario.cpf || funcionario.rg) && (
            <Card className="border-slate-200 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  📋 Documentos Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {funcionario.cpf && (
                    <div>
                      <label className="text-sm font-medium text-slate-600">CPF</label>
                      <p className="text-md font-medium text-slate-700">{funcionario.cpf}</p>
                    </div>
                  )}
                  {funcionario.rg && (
                    <div>
                      <label className="text-sm font-medium text-slate-600">RG</label>
                      <p className="text-md font-medium text-slate-700">{funcionario.rg}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Endereço e Salário */}
          {(funcionario.endereco || funcionario.salario) && (
            <Card className="border-slate-200 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  🏠 Informações Adicionais
                </h3>
                <div className="space-y-4">
                  {funcionario.endereco && (
                    <div>
                      <label className="text-sm font-medium text-slate-600">Endereço</label>
                      <p className="text-md font-medium text-slate-700">{funcionario.endereco}</p>
                    </div>
                  )}
                  {funcionario.salario && (
                    <div>
                      <label className="text-sm font-medium text-slate-600">Salário</label>
                      <p className="text-lg font-bold text-emerald-600">{funcionario.salario}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white/80"
            >
              Fechar
            </Button>
            <Button className="bg-slate-600 hover:bg-slate-700 text-white shadow-lg">
              📝 Editar Funcionário
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
              📄 Ver Documentos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
