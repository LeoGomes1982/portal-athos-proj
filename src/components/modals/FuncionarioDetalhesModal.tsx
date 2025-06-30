
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
  ativo: { label: "Ativo", color: "bg-green-500", textColor: "text-green-700", bgColor: "#F0FDF4" }, // Verde nevasca
  ferias: { label: "Em Férias", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "#EFF6FF" }, // Azul serenity
  experiencia: { label: "Em Experiência", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "#FFF7ED" }, // Laranja flan de papaya
  aviso: { label: "Em Aviso Prévio", color: "bg-red-500", textColor: "text-red-700", bgColor: "#FEF2F2" }, // Vermelho coral red
  inativo: { label: "Inativo", color: "bg-gray-500", textColor: "text-gray-700", bgColor: "#F9FAFB" },
  destaque: { label: "Destaque", color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "#FFFBEB" } // Amarelo dourado
};

export function FuncionarioDetalhesModal({ funcionario, isOpen, onClose, onStatusChange }: FuncionarioDetalhesModalProps) {
  const [statusAtual, setStatusAtual] = useState(funcionario.status);

  const handleStatusChange = (novoStatus: string) => {
    const status = novoStatus as Funcionario['status'];
    setStatusAtual(status);
    onStatusChange(funcionario.id, status);
  };

  const statusInfo = statusConfig[statusAtual];
  
  // Cores específicas para cada status
  const getModalBackground = () => {
    switch (statusAtual) {
      case 'ativo':
        return { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }; // Verde nevasca
      case 'ferias':
        return { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }; // Azul serenity
      case 'destaque':
        return { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }; // Amarelo dourado
      case 'experiencia':
        return { backgroundColor: '#FFF7ED', borderColor: '#FDBA74' }; // Laranja flan de papaya
      case 'aviso':
        return { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }; // Vermelho coral red
      default:
        return { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' };
    }
  };

  const modalStyle = getModalBackground();
  const isDestaque = statusAtual === 'destaque';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto border-2"
        style={{
          backgroundColor: modalStyle.backgroundColor,
          borderColor: modalStyle.borderColor
        }}
      >
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
          <Card className="bg-white/90 backdrop-blur-sm border-2" style={{ borderColor: modalStyle.borderColor }}>
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
                    <Badge variant="secondary" className="font-medium" style={{ 
                      backgroundColor: modalStyle.backgroundColor,
                      borderColor: modalStyle.borderColor,
                      color: statusInfo.textColor
                    }}>
                      {funcionario.setor}
                    </Badge>
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
                        <SelectTrigger className="w-48 bg-white/80" style={{ borderColor: modalStyle.borderColor }}>
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
          <Card className="bg-white/90 backdrop-blur-sm border-2" style={{ borderColor: modalStyle.borderColor }}>
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
            <Card className="bg-white/90 backdrop-blur-sm border-2" style={{ borderColor: modalStyle.borderColor }}>
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
            <Card className="bg-white/90 backdrop-blur-sm border-2" style={{ borderColor: modalStyle.borderColor }}>
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
                      <p className={`text-lg font-bold ${statusInfo.textColor}`}>{funcionario.salario}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t-2" style={{ borderColor: modalStyle.borderColor }}>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="bg-white/80 text-slate-700 hover:bg-white"
              style={{ borderColor: modalStyle.borderColor }}
            >
              Fechar
            </Button>
            <Button className={`${statusInfo.color} text-white shadow-lg hover:opacity-90`}>
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
