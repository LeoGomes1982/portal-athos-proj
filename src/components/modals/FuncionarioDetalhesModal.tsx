import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  dataFimExperiencia?: string;
  dataFimAvisoPrevio?: string;
}

interface FuncionarioDetalhesModalProps {
  funcionario: Funcionario;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (funcionarioId: number, novoStatus: Funcionario['status'], dataFim?: string) => void;
}

const statusConfig = {
  ativo: { label: "Ativo", color: "bg-green-500", textColor: "text-green-700", bgColor: "#F0FDF4" },
  ferias: { label: "Em Férias", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "#EFF6FF" },
  experiencia: { label: "Em Experiência", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "#FFF7ED" },
  aviso: { label: "Em Aviso Prévio", color: "bg-red-500", textColor: "text-red-700", bgColor: "#FEF2F2" },
  inativo: { label: "Inativo", color: "bg-gray-500", textColor: "text-gray-700", bgColor: "#F9FAFB" },
  destaque: { label: "Destaque", color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "#FFFBEB" }
};

export function FuncionarioDetalhesModal({ funcionario, isOpen, onClose, onStatusChange }: FuncionarioDetalhesModalProps) {
  const { toast } = useToast();
  const [statusAtual, setStatusAtual] = useState(funcionario.status);
  const [showDateInput, setShowDateInput] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dataFim, setDataFim] = useState("");

  const handleStatusChange = (novoStatus: string) => {
    const status = novoStatus as Funcionario['status'];
    
    if (status === 'experiencia' || status === 'aviso') {
      setSelectedStatus(status);
      setShowDateInput(true);
      setDataFim("");
    } else {
      setStatusAtual(status);
      onStatusChange(funcionario.id, status);
      toast({
        title: "Status Atualizado",
        description: `Status alterado para ${statusConfig[status].label}`,
      });
    }
  };

  const handleDateSubmit = () => {
    if (!dataFim) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data",
        variant: "destructive"
      });
      return;
    }

    const status = selectedStatus as Funcionario['status'];
    setStatusAtual(status);
    onStatusChange(funcionario.id, status, dataFim);
    
    const statusLabel = selectedStatus === 'experiencia' ? 'período de experiência' : 'aviso prévio';
    toast({
      title: "Status Atualizado",
      description: `${statusConfig[status].label} definido até ${new Date(dataFim).toLocaleDateString('pt-BR')}`,
    });
    
    setShowDateInput(false);
    setSelectedStatus("");
    setDataFim("");
  };

  const handleDateCancel = () => {
    setShowDateInput(false);
    setSelectedStatus("");
    setDataFim("");
  };

  const statusInfo = statusConfig[statusAtual];
  
  const getModalBackground = () => {
    switch (statusAtual) {
      case 'ativo':
        return { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' };
      case 'ferias':
        return { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' };
      case 'destaque':
        return { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' };
      case 'experiencia':
        return { backgroundColor: '#FFF7ED', borderColor: '#FDBA74' };
      case 'aviso':
        return { backgroundColor: '#FEF2F2', borderColor: '#FECACA' };
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
          {/* Date Input Section */}
          {showDateInput && (
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-yellow-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  📅 Data de Encerramento
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dataFim" className="text-sm font-medium text-slate-600">
                      {selectedStatus === 'experiencia' ? 'Data de encerramento do período de experiência' : 'Data de encerramento do aviso prévio'}
                    </Label>
                    <Input
                      id="dataFim"
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      className="mt-1"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleDateSubmit} className="bg-green-600 hover:bg-green-700">
                      Confirmar
                    </Button>
                    <Button variant="outline" onClick={handleDateCancel}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                      <Select value={statusAtual} onValueChange={handleStatusChange} disabled={showDateInput}>
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
                  
                  {/* Mostrar datas de fim se existirem */}
                  {funcionario.dataFimExperiencia && statusAtual === 'experiencia' && (
                    <div>
                      <label className="text-sm font-medium text-slate-600">Fim do Período de Experiência</label>
                      <p className="text-md font-medium text-orange-700">
                        {new Date(funcionario.dataFimExperiencia).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                  
                  {funcionario.dataFimAvisoPrevio && statusAtual === 'aviso' && (
                    <div>
                      <label className="text-sm font-medium text-slate-600">Fim do Aviso Prévio</label>
                      <p className="text-md font-medium text-red-700">
                        {new Date(funcionario.dataFimAvisoPrevio).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
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
