
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Star, AlertTriangle, X, User, Plus, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditarFuncionarioModal } from "./EditarFuncionarioModal";

interface HistoricoRegistro {
  id: string;
  data: string;
  classificacao: "positiva" | "neutra" | "negativa";
  comentario: string;
  registradoPor: string;
}

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
  onFuncionarioUpdate?: (funcionario: Funcionario) => void;
}

const statusConfig = {
  ativo: { label: "Ativo", color: "bg-green-500", textColor: "text-green-700", bgColor: "#F0FDF4" },
  ferias: { label: "Em Férias", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "#EFF6FF" },
  experiencia: { label: "Em Experiência", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "#FFF7ED" },
  aviso: { label: "Em Aviso Prévio", color: "bg-red-500", textColor: "text-red-700", bgColor: "#FEF2F2" },
  inativo: { label: "Inativo", color: "bg-gray-500", textColor: "text-gray-700", bgColor: "#F9FAFB" },
  destaque: { label: "Destaque", color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "#FFFBEB" }
};

export function FuncionarioDetalhesModal({ funcionario, isOpen, onClose, onStatusChange, onFuncionarioUpdate }: FuncionarioDetalhesModalProps) {
  const { toast } = useToast();
  const [statusAtual, setStatusAtual] = useState(funcionario.status);
  const [showDateInput, setShowDateInput] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dataFim, setDataFim] = useState("");
  const [activeTab, setActiveTab] = useState("informacoes");
  
  // Estados para o histórico
  const [historico, setHistorico] = useState<HistoricoRegistro[]>([]);
  const [showNovoRegistro, setShowNovoRegistro] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState({
    classificacao: "neutra" as "positiva" | "neutra" | "negativa",
    comentario: "",
    registradoPor: "Usuário Atual" // Em uma aplicação real, seria obtido do contexto de autenticação
  });
  
  // Estado para o modal de edição
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleSalvarRegistro = () => {
    if (!novoRegistro.comentario.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, adicione um comentário",
        variant: "destructive"
      });
      return;
    }

    const registro: HistoricoRegistro = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      classificacao: novoRegistro.classificacao,
      comentario: novoRegistro.comentario,
      registradoPor: novoRegistro.registradoPor
    };

    const novoHistorico = [registro, ...historico];
    setHistorico(novoHistorico);
    
    // Salvar no localStorage
    localStorage.setItem(`historico_funcionario_${funcionario.id}`, JSON.stringify(novoHistorico));
    
    setShowNovoRegistro(false);
    setNovoRegistro({
      classificacao: "neutra",
      comentario: "",
      registradoPor: "Usuário Atual"
    });

    toast({
      title: "Registro Adicionado",
      description: "Histórico atualizado com sucesso",
    });
  };

  // Carregar histórico do localStorage quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      const historicoSalvo = localStorage.getItem(`historico_funcionario_${funcionario.id}`);
      if (historicoSalvo) {
        setHistorico(JSON.parse(historicoSalvo));
      } else {
        setHistorico([]);
      }
    }
  }, [isOpen, funcionario.id]);

  const getClassificacaoIcon = (classificacao: string) => {
    switch (classificacao) {
      case "positiva": return "👍";
      case "negativa": return "👎"; 
      case "neutra": return "➖";
      default: return "➖";
    }
  };

  const getClassificacaoColor = (classificacao: string) => {
    switch (classificacao) {
      case "positiva": return "bg-green-100 text-green-700 border-green-200";
      case "negativa": return "bg-red-100 text-red-700 border-red-200";
      case "neutra": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleEditarFuncionario = () => {
    setShowEditModal(true);
  };

  const handleSalvarEdicaoFuncionario = (funcionarioEditado: Funcionario) => {
    if (onFuncionarioUpdate) {
      onFuncionarioUpdate(funcionarioEditado);
    }
    setShowEditModal(false);
  };

  const statusInfo = statusConfig[statusAtual];
  const isDestaque = statusAtual === 'destaque';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-blue-50 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white rounded-t-2xl border-b-2 border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  Detalhes do Funcionário
                  {funcionario.status === 'destaque' && (
                    <div className="relative">
                      <Star className="w-8 h-8 text-yellow-500 fill-yellow-400 drop-shadow-lg animate-pulse" style={{
                        filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.9)) brightness(1.3) saturate(1.2)'
                      }} />
                    </div>
                  )}
                </h2>
                <p className="text-slate-600">{funcionario.nome}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 h-auto hover:bg-blue-100"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Input Section */}
          {showDateInput && (
            <Card className="bg-white border-2 border-yellow-300">
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
          <Card className="bg-white border-2 border-blue-200">
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
                    <Badge variant="secondary" className="font-medium bg-blue-100 text-blue-700 border-blue-200">
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
                        <SelectTrigger className="w-48 bg-white border-blue-200">
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
          <Card className="bg-white border-2 border-blue-200">
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
            <Card className="bg-white border-2 border-blue-200">
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

          {/* Tabs para Informações Adicionais e Histórico */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="informacoes">Informações Adicionais</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="informacoes" className="mt-4">
              {/* Endereço e Salário */}
              {(funcionario.endereco || funcionario.salario) && (
                <Card className="bg-white border-2 border-blue-200">
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
                          <p className="text-lg font-bold text-blue-700">{funcionario.salario}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="historico" className="mt-4">
              <Card className="bg-white border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                      📋 Histórico do Funcionário
                    </h3>
                    <Button 
                      onClick={() => setShowNovoRegistro(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus size={16} className="mr-2" />
                      Incluir Registro
                    </Button>
                  </div>

                  {/* Formulário para novo registro */}
                  {showNovoRegistro && (
                    <Card className="mb-4 bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-slate-700 mb-3">Novo Registro</h4>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-slate-600">Classificação</Label>
                            <Select 
                              value={novoRegistro.classificacao} 
                              onValueChange={(value) => setNovoRegistro({...novoRegistro, classificacao: value as "positiva" | "neutra" | "negativa"})}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="positiva">👍 Positiva</SelectItem>
                                <SelectItem value="neutra">➖ Neutra</SelectItem>
                                <SelectItem value="negativa">👎 Negativa</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-slate-600">Comentário</Label>
                            <Textarea
                              value={novoRegistro.comentario}
                              onChange={(e) => setNovoRegistro({...novoRegistro, comentario: e.target.value})}
                              placeholder="Descreva o registro..."
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSalvarRegistro} className="bg-green-600 hover:bg-green-700">
                              Salvar
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setShowNovoRegistro(false);
                                setNovoRegistro({classificacao: "neutra", comentario: "", registradoPor: "Usuário Atual"});
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Lista de registros */}
                  <div className="space-y-3">
                    {historico.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare size={48} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">Nenhum registro no histórico</p>
                        <p className="text-sm text-gray-400">Clique em "Incluir Registro" para adicionar o primeiro</p>
                      </div>
                    ) : (
                      historico.map((registro) => (
                        <Card key={registro.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`text-xs ${getClassificacaoColor(registro.classificacao)}`}>
                                    {getClassificacaoIcon(registro.classificacao)} {registro.classificacao.charAt(0).toUpperCase() + registro.classificacao.slice(1)}
                                  </Badge>
                                  <span className="text-sm text-gray-500">
                                    {new Date(registro.data).toLocaleDateString('pt-BR')} às {new Date(registro.data).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                                  </span>
                                </div>
                                <p className="text-slate-700 mb-2">{registro.comentario}</p>
                                <p className="text-xs text-gray-500">Registrado por: {registro.registradoPor}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t-2 border-blue-200">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="bg-white text-slate-700 hover:bg-gray-50 border-blue-200"
            >
              Fechar
            </Button>
            <Button 
              onClick={handleEditarFuncionario}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              📝 Editar Funcionário
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
              📄 Ver Documentos
            </Button>
          </div>
        </div>

        {/* Modal de Edição */}
        <EditarFuncionarioModal
          funcionario={funcionario}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSalvarEdicaoFuncionario}
        />
      </div>
    </div>
  );
}
