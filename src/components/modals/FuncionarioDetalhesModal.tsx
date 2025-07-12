
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Star, AlertTriangle, X, User, Plus, MessageSquare, Download, Eye, Trash2, FileText, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdicionarDependenteModal } from "./AdicionarDependenteModal";
import { AdicionarDocumentoModal } from "./AdicionarDocumentoModal";
import { useFuncionarioData } from "@/hooks/useFuncionarioData";
import { format } from "date-fns";


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
  
  // Estados para edição inline
  const [isEditing, setIsEditing] = useState(false);
  const [editedFuncionario, setEditedFuncionario] = useState<Funcionario>(funcionario);

  // Estados para modais de dependentes e documentos
  const [showDependenteModal, setShowDependenteModal] = useState(false);
  const [showDocumentoModal, setShowDocumentoModal] = useState(false);
  
  const { 
    dependentes, 
    documentos, 
    adicionarDependente, 
    adicionarDocumento,
    removerDependente,
    removerDocumento
  } = useFuncionarioData(funcionario.id);

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
    setIsEditing(true);
  };

  const handleSalvarEdicao = () => {
    if (onFuncionarioUpdate) {
      onFuncionarioUpdate(editedFuncionario);
    }
    setIsEditing(false);
    toast({
      title: "Funcionário Atualizado",
      description: "Informações salvas com sucesso!",
    });
  };

  const handleCancelarEdicao = () => {
    setEditedFuncionario(funcionario);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Funcionario, value: string) => {
    setEditedFuncionario(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Atualizar funcionário editado quando o funcionário original mudar
  useEffect(() => {
    setEditedFuncionario(funcionario);
  }, [funcionario]);

  const statusInfo = statusConfig[statusAtual];
  const isDestaque = statusAtual === 'destaque';
  const currentFuncionario = isEditing ? editedFuncionario : funcionario;

  if (!isOpen) return null;

  return (
    <>
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
                  <p className="text-slate-600">{currentFuncionario.nome}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelarEdicao}
                      className="h-auto"
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSalvarEdicao}
                      className="bg-green-600 hover:bg-green-700 h-auto"
                    >
                      Salvar
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditarFuncionario}
                    className="h-auto"
                  >
                    Editar
                  </Button>
                )}
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

            {/* Cards organizados por seção - correspondentes às abas do formulário de admissão */}
            
            {/* Card Profissional */}
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  💼 Informações Profissionais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Cargo</label>
                      {isEditing ? (
                        <Input
                          value={editedFuncionario.cargo}
                          onChange={(e) => handleInputChange('cargo', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.cargo}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Setor</label>
                      {isEditing ? (
                        <Input
                          value={editedFuncionario.setor}
                          onChange={(e) => handleInputChange('setor', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <Badge variant="secondary" className="font-medium bg-blue-100 text-blue-700 border-blue-200">
                          {currentFuncionario.setor}
                        </Badge>
                      )}
                    </div>
                    {currentFuncionario.salario && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Salário</label>
                        {isEditing ? (
                          <Input
                            value={editedFuncionario.salario || ''}
                            onChange={(e) => handleInputChange('salario', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-lg font-bold text-blue-700">{currentFuncionario.salario}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Data de Admissão</label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedFuncionario.dataAdmissao}
                          onChange={(e) => handleInputChange('dataAdmissao', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-md font-medium text-slate-700">
                          {new Date(currentFuncionario.dataAdmissao).toLocaleDateString('pt-BR')}
                        </p>
                      )}
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

            {/* Card Pessoal */}
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  👤 Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Nome Completo</label>
                      {isEditing ? (
                        <Input
                          value={editedFuncionario.nome}
                          onChange={(e) => handleInputChange('nome', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-bold text-slate-800">{currentFuncionario.nome}</p>
                      )}
                    </div>
                    {currentFuncionario.cpf && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">CPF</label>
                        {isEditing ? (
                          <Input
                            value={editedFuncionario.cpf || ''}
                            onChange={(e) => handleInputChange('cpf', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-md font-medium text-slate-700">{currentFuncionario.cpf}</p>
                        )}
                      </div>
                    )}
                    {currentFuncionario.rg && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">RG</label>
                        {isEditing ? (
                          <Input
                            value={editedFuncionario.rg || ''}
                            onChange={(e) => handleInputChange('rg', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-md font-medium text-slate-700">{currentFuncionario.rg}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Estado Civil</label>
                      <p className="text-md font-medium text-slate-700">-</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Data de Nascimento</label>
                      <p className="text-md font-medium text-slate-700">-</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Naturalidade</label>
                      <p className="text-md font-medium text-slate-700">-</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Contato */}
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  📞 Informações de Contato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Telefone</label>
                      {isEditing ? (
                        <Input
                          value={editedFuncionario.telefone}
                          onChange={(e) => handleInputChange('telefone', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.telefone}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">E-mail</label>
                      {isEditing ? (
                        <Input
                          value={editedFuncionario.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-md font-medium text-slate-700 break-all">{currentFuncionario.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {currentFuncionario.endereco && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Endereço</label>
                        {isEditing ? (
                          <Input
                            value={editedFuncionario.endereco || ''}
                            onChange={(e) => handleInputChange('endereco', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-md font-medium text-slate-700">{currentFuncionario.endereco}</p>
                        )}
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-slate-600">CEP</label>
                      <p className="text-md font-medium text-slate-700">-</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Documentos */}
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentos
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("Botão Adicionar Documento clicado");
                      console.log("showDocumentoModal antes:", showDocumentoModal);
                      setShowDocumentoModal(true);
                      console.log("setShowDocumentoModal(true) executado");
                    }}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar Documento
                  </Button>
                </div>
                {documentos.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-slate-500">Nenhum documento anexado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documentos.map((documento) => (
                      <div key={documento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <p className="font-medium text-slate-700">{documento.nome}</p>
                          <p className="text-sm text-slate-500">
                            {documento.nomeArquivo}
                            {documento.temValidade && documento.dataValidade && (
                              <span className="ml-2 text-orange-600">
                                • Vence em {format(new Date(documento.dataValidade), "dd/MM/yyyy")}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const url = URL.createObjectURL(documento.arquivo);
                              window.open(url, '_blank');
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const url = URL.createObjectURL(documento.arquivo);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = documento.nomeArquivo;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removerDocumento(documento.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card Dependentes */}
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Dependentes
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDependenteModal(true)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar Dependente
                  </Button>
                </div>
                {dependentes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">👶</div>
                    <p className="text-slate-500">Nenhum dependente cadastrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dependentes.map((dependente) => (
                      <div key={dependente.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <p className="font-medium text-slate-700">{dependente.nome}</p>
                          <p className="text-sm text-slate-500">
                            {dependente.grauParentesco} • {dependente.dataNascimento} • {dependente.cpf}
                          </p>
                          {dependente.nomeArquivo && (
                            <p className="text-xs text-blue-600">📄 {dependente.nomeArquivo}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removerDependente(dependente.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Histórico */}
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    📋 Histórico
                  </h3>
                  <Button 
                    onClick={() => setShowNovoRegistro(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Plus size={16} className="mr-1" />
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
                          <Label htmlFor="classificacao" className="text-sm font-medium text-slate-600">
                            Classificação
                          </Label>
                          <Select
                            value={novoRegistro.classificacao}
                            onValueChange={(value) => setNovoRegistro({...novoRegistro, classificacao: value as "positiva" | "neutra" | "negativa"})}
                          >
                            <SelectTrigger className="w-full mt-1">
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
                          <Label htmlFor="comentario" className="text-sm font-medium text-slate-600">
                            Comentário
                          </Label>
                          <Textarea
                            id="comentario"
                            placeholder="Descreva o registro..."
                            value={novoRegistro.comentario}
                            onChange={(e) => setNovoRegistro({...novoRegistro, comentario: e.target.value})}
                            className="mt-1 resize-none"
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="registradoPor" className="text-sm font-medium text-slate-600">
                            Registrado por
                          </Label>
                          <Input
                            id="registradoPor"
                            value={novoRegistro.registradoPor}
                            onChange={(e) => setNovoRegistro({...novoRegistro, registradoPor: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button 
                            onClick={handleSalvarRegistro}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            Salvar
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowNovoRegistro(false)}
                            size="sm"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Lista de registros do histórico */}
                <div className="space-y-3">
                  {historico.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare size={48} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500">Nenhum registro no histórico</p>
                      <p className="text-sm text-gray-400">Clique em "Incluir Registro" para adicionar um novo registro</p>
                    </div>
                  ) : (
                    historico.map((registro) => (
                      <Card key={registro.id} className={`border ${getClassificacaoColor(registro.classificacao)}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{getClassificacaoIcon(registro.classificacao)}</span>
                                <span className="font-medium text-sm capitalize">{registro.classificacao}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(registro.data).toLocaleString('pt-BR')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{registro.comentario}</p>
                              <p className="text-xs text-gray-500">Por: {registro.registradoPor}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="flex justify-end gap-3 pt-4 border-t-2 border-blue-200">
              <Button 
                variant="outline" 
                onClick={onClose} 
                className="bg-white text-slate-700 hover:bg-gray-50 border-blue-200"
              >
                Fechar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
                📄 Ver Documentos
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modais - renderizados fora do modal principal */}
      <AdicionarDependenteModal
        isOpen={showDependenteModal}
        onClose={() => setShowDependenteModal(false)}
        onSave={adicionarDependente}
        funcionarioId={funcionario.id}
      />

      <AdicionarDocumentoModal
        isOpen={showDocumentoModal}
        onClose={() => setShowDocumentoModal(false)}
        onSave={adicionarDocumento}
        funcionarioId={funcionario.id}
      />
    </>
  );
}
