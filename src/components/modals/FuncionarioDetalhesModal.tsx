
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Star, AlertTriangle, X, User, Plus, MessageSquare, Download, Eye, Trash2, FileText, Users, Shirt, Info, Check, Sun, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { AdicionarDependenteModal } from "./AdicionarDependenteModal";
import { AdicionarDocumentoModal } from "./AdicionarDocumentoModal";
import { HistoricoDocumentViewModal } from "./HistoricoDocumentViewModal";
import { DeleteInfoModal } from "./DeleteInfoModal";
import { FuncionarioDocumentosModal } from "./FuncionarioDocumentosModal";
import { SubstituirDocumentoModal } from "./SubstituirDocumentoModal";
import { useFuncionarioData } from "@/hooks/useFuncionarioData";
import { useFuncionarioHistorico } from "@/hooks/useFuncionarioHistorico";
import { useSupabaseDocumentos } from "@/hooks/useSupabaseDocumentos";
import { usePontosAtividade } from "@/hooks/usePontosAtividade";
import { format } from "date-fns";


interface HistoricoRegistro {
  id: string;
  funcionario_id: string;
  titulo: string;
  descricao: string;
  tipo: "positivo" | "neutro" | "negativo";
  usuario: string;
  created_at: string;
  updated_at: string;
  classificacao?: "positivo" | "neutro" | "negativo";
  data?: string;
  comentario?: string;
  registradoPor?: string;
  arquivo?: {
    nome: string;
    url: string;
    tipo: string;
    tamanho: number;
  } | null;
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
  orgaoEmissorRG?: string;
  endereco?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  bairro?: string;
  numero?: string;
  complemento?: string;
  salario?: string;
  dataFimExperiencia?: string;
  dataFimAvisoPrevio?: string;
  dataNascimento?: string;
  estadoCivil?: string;
  nacionalidade?: string;
  naturalidade?: string;
  nomePai?: string;
  nomeMae?: string;
  nomeConjuge?: string;
  racaEtnia?: string;
  ctpsNumero?: string;
  ctpsSerie?: string;
  ctpsEstado?: string;
  valeTransporte?: string;
  valorValeTransporte?: string;
  quantidadeVales?: string;
  possuiValeAlimentacao?: string;
  valorValeAlimentacao?: string;
  possuiAuxilioMoradia?: string;
  valorAuxilioMoradia?: string;
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
  ferias: { label: "Em Férias", color: "bg-purple-500", textColor: "text-purple-700", bgColor: "#FAF5FF" },
  experiencia: { label: "Em Experiência", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "#FFF7ED" },
  aviso: { label: "Em Aviso Prévio", color: "bg-red-500", textColor: "text-red-700", bgColor: "#FEF2F2" },
  inativo: { label: "Inativo", color: "bg-gray-500", textColor: "text-gray-700", bgColor: "#F9FAFB" },
  destaque: { label: "Destaque", color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "#FFFBEB" }
};

// Utility functions for historical records
const getClassificacaoColor = (classificacao: string) => {
  switch (classificacao) {
    case "positivo": return "border-green-200 bg-green-50";
    case "negativo": return "border-red-200 bg-red-50";
    default: return "border-gray-200 bg-gray-50";
  }
};

const getClassificacaoIcon = (classificacao: string) => {
  switch (classificacao) {
    case "positivo": return "👍";
    case "negativo": return "👎";
    default: return "➖";
  }
};

export function FuncionarioDetalhesModal({ funcionario, isOpen, onClose, onStatusChange, onFuncionarioUpdate }: FuncionarioDetalhesModalProps) {
  const { toast } = useToast();
  const { historico, loading: loadingHistorico, adicionarRegistro } = useFuncionarioHistorico(funcionario.id);
  
  // Função para obter o usuário atual logado
  const getCurrentUser = () => {
    return localStorage.getItem('currentUser') || 'usuario@sistema.com';
  };
  const [statusAtual, setStatusAtual] = useState(funcionario.status);
  const [showDateInput, setShowDateInput] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dataFim, setDataFim] = useState("");
  const [activeTab, setActiveTab] = useState("informacoes");
  
  // Estados para o histórico
  const [showNovoRegistro, setShowNovoRegistro] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState({
    titulo: "",
    descricao: "",
    tipo: "neutro" as "positivo" | "neutro" | "negativo",
    registradoPor: getCurrentUser(),
    arquivo: null as File | null
  });
  
  // Lista de usuários disponíveis
  const usuariosDisponiveis = [
    getCurrentUser(),
    'leandrogomes@grupoathosbrasil.com',
    'dp@grupoathosbrasil.com', 
    'financeiro@grupoathosbrasil.com',
    'gerencia@grupoathosbrasil.com',
    'thiago@grupoathosbrasil.com',
    'diego@grupoathosbrasil.com'
  ].filter((usuario, index, array) => array.indexOf(usuario) === index); // Remove duplicados
  
  // Estados para edição inline
  const [isEditing, setIsEditing] = useState(false);
  const [editedFuncionario, setEditedFuncionario] = useState<Funcionario>(funcionario);

  // Estados para modais de dependentes e documentos
  const [showDependenteModal, setShowDependenteModal] = useState(false);
  const [showDocumentoModal, setShowDocumentoModal] = useState(false);
  const [showDocumentViewModal, setShowDocumentViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isVerDocumentosModalOpen, setIsVerDocumentosModalOpen] = useState(false);
  const [showSubstituicaoModal, setShowSubstituicaoModal] = useState(false);
  const [documentoParaSubstituir, setDocumentoParaSubstituir] = useState<any>(null);
  
  // Estados para uniformes e EPIs
  const [uniformes, setUniformes] = useState<any[]>([]);
  const [showUniformeForm, setShowUniformeForm] = useState(false);
  const [novoUniforme, setNovoUniforme] = useState({
    peca: '',
    tamanho: '',
    tipo: 'Uniforme',
    dataEntrega: new Date().toISOString().split('T')[0]
  });
  
  const { 
    dependentes, 
    documentos, 
    adicionarDependente, 
    adicionarDocumento,
    removerDependente,
    removerDocumento
  } = useFuncionarioData(funcionario.id);

  const { 
    documentos: documentosSupabase, 
    loading: loadingDocumentosSupabase,
    carregarDocumentos: recarregarDocumentosSupabase
  } = useSupabaseDocumentos(funcionario.id);

  const { 
    pontosAtividade, 
    loading: loadingPontos,
    recalcularPontos 
  } = usePontosAtividade(funcionario.id);

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
      description: `${statusConfig[status].label} definido até ${new Date(dataFim + 'T12:00:00').toLocaleDateString('pt-BR')}`,
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

  const handleSalvarRegistro = async () => {
    if (!novoRegistro.titulo.trim() || !novoRegistro.descricao.trim()) {
      toast({
        title: "Erro",
        description: "Título e descrição são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const sucesso = await adicionarRegistro(
      novoRegistro.titulo,
      novoRegistro.descricao,
      novoRegistro.tipo,
      getCurrentUser(),
    );

    if (sucesso) {
      setShowNovoRegistro(false);
      setNovoRegistro({
        titulo: "",
        descricao: "",
        tipo: "neutro",
        registradoPor: getCurrentUser(),
        arquivo: null
      });
    }
  };

  // useEffect removido - histórico agora vem do Supabase
  useEffect(() => {
    if (isOpen) {
      
      // Carregar uniformes
      const uniformesSalvos = localStorage.getItem(`uniformes_funcionario_${funcionario.id}`);
      if (uniformesSalvos) {
        setUniformes(JSON.parse(uniformesSalvos));
      } else {
        setUniformes([]);
      }
    }
  }, [isOpen, funcionario.id]);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "positivo": return <Check className="w-4 h-4 text-green-600" />;
      case "negativo": return <X className="w-4 h-4 text-red-600" />; 
      case "neutro": return "➖";
      default: return "➖";
    }
  };


  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "positivo": return "bg-green-100 text-green-700 border-green-200";
      case "negativo": return "bg-red-100 text-red-700 border-red-200";
      case "neutro": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleEditarFuncionario = () => {
    setIsEditing(true);
  };

  const handleSalvarEdicao = () => {
    console.log('handleSalvarEdicao chamado com:', editedFuncionario.nome, editedFuncionario.id);
    console.log('onFuncionarioUpdate existe?', !!onFuncionarioUpdate);
    if (onFuncionarioUpdate) {
      console.log('Chamando onFuncionarioUpdate...');
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

  // Funções para uniformes
  const handleSalvarUniforme = () => {
    if (!novoUniforme.peca.trim() || !novoUniforme.tamanho.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const uniforme = {
      id: Date.now().toString(),
      ...novoUniforme,
      dataRegistro: new Date().toISOString()
    };

    const novosUniformes = [uniforme, ...uniformes];
    setUniformes(novosUniformes);
    localStorage.setItem(`uniformes_funcionario_${funcionario.id}`, JSON.stringify(novosUniformes));
    
    setShowUniformeForm(false);
    setNovoUniforme({
      peca: '',
      tamanho: '',
      tipo: 'Uniforme',
      dataEntrega: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Uniforme/EPI Adicionado",
      description: "Registro salvo com sucesso",
    });
  };

  const handleRemoverUniforme = (uniformeId: string) => {
    const novosUniformes = uniformes.filter(u => u.id !== uniformeId);
    setUniformes(novosUniformes);
    localStorage.setItem(`uniformes_funcionario_${funcionario.id}`, JSON.stringify(novosUniformes));
    
    toast({
      title: "Registro Removido",
      description: "Uniforme/EPI removido com sucesso",
    });
  };

  const statusInfo = statusConfig[statusAtual];
  const isDestaque = statusAtual === 'destaque';
  const currentFuncionario = isEditing ? editedFuncionario : funcionario;
  
  // Verificar se há documentos vencendo
  const temDocumentosVencendo = documentos.some((doc: any) => {
    if (!doc.temValidade || !doc.dataValidade || doc.visualizado) return false;
    const hoje = new Date();
    const doisDiasDepois = new Date();
    doisDiasDepois.setDate(hoje.getDate() + 2);
    const dataValidade = new Date(doc.dataValidade);
    return dataValidade <= doisDiasDepois && dataValidade >= hoje;
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div 
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-blue-50 rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`rounded-t-2xl border-b-2 p-6 ${
            funcionario.status === 'destaque' 
              ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300' 
              : temDocumentosVencendo 
                ? 'bg-red-50 border-red-300 animate-pulse' 
                : 'bg-white border-blue-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${temDocumentosVencendo ? 'bg-red-100 animate-pulse' : 'bg-blue-100'}`}>
                  <span className="text-3xl">{funcionario.foto}</span>
                </div>
                <div className="flex-1">
                  <h2 className={`text-3xl font-bold flex items-center gap-2 ${
                    funcionario.status === 'destaque' 
                      ? 'text-yellow-700' 
                      : temDocumentosVencendo 
                        ? 'text-red-700 animate-pulse' 
                        : 'text-slate-800'
                  }`}>
                    {currentFuncionario.nome}
                    {funcionario.status === 'destaque' && (
                      <div className="relative">
                        <Star className="w-8 h-8 text-yellow-500 fill-yellow-400 drop-shadow-lg animate-pulse" style={{
                          filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.9)) brightness(1.3) saturate(1.2)'
                        }} />
                      </div>
                    )}
                    {temDocumentosVencendo && (
                      <div className="relative">
                        <AlertTriangle className="w-8 h-8 text-red-500 fill-red-400 drop-shadow-lg animate-pulse" />
                      </div>
                    )}
                  </h2>
                  
                  {/* Status Atual movido para abaixo do nome */}
                  <div className="mt-2">
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
                    
                    
                    {/* Pontos de Atividade Unificados */}
                    <div className="mt-3">
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-xs font-medium text-slate-600">Pontos de Atividade</p>
                            <p className={`text-2xl font-bold ${
                              pontosAtividade > 0 ? 'text-green-700' : 
                              pontosAtividade < 0 ? 'text-red-700' : 
                              'text-blue-700'
                            }`}>
                              {loadingPontos ? '...' : pontosAtividade > 0 ? `+${pontosAtividade}` : pontosAtividade}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 mt-1">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelarEdicao}
                      className="h-8 px-3"
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSalvarEdicao}
                      className="bg-green-600 hover:bg-green-700 h-8 px-3"
                    >
                      Salvar
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditarFuncionario}
                    className="h-8 px-3"
                  >
                    Editar
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-1 h-8 w-8 hover:bg-blue-100"
                >
                  <X size={18} className="font-bold" />
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
                        <div className="mt-1">
                          <Badge variant="secondary" className="font-medium bg-blue-100 text-blue-700 border-blue-200">
                            {currentFuncionario.setor}
                          </Badge>
                        </div>
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
                    
                    <div>
                      <label className="text-sm font-medium text-slate-600">Possui registro de vale alimentação Ticket?</label>
                      {isEditing ? (
                        <Select value={editedFuncionario.possuiValeAlimentacao || ''} onValueChange={(value) => handleInputChange('possuiValeAlimentacao', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sim">Sim</SelectItem>
                            <SelectItem value="nao">Não</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.possuiValeAlimentacao || '-'}</p>
                      )}
                    </div>
                    
                    {(editedFuncionario.possuiValeAlimentacao === "sim" || currentFuncionario.possuiValeAlimentacao === "sim") && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Valor por dia</label>
                        {isEditing ? (
                          <Input
                            value={editedFuncionario.valorValeAlimentacao || ''}
                            onChange={(e) => handleInputChange('valorValeAlimentacao', e.target.value)}
                            placeholder="R$ 0,00"
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-md font-medium text-slate-700">{currentFuncionario.valorValeAlimentacao || '-'}</p>
                        )}
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-slate-600">Possui Auxílio moradia?</label>
                      {isEditing ? (
                        <Select value={editedFuncionario.possuiAuxilioMoradia || ''} onValueChange={(value) => handleInputChange('possuiAuxilioMoradia', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sim">Sim</SelectItem>
                            <SelectItem value="nao">Não</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.possuiAuxilioMoradia || '-'}</p>
                      )}
                    </div>
                    
                    {(editedFuncionario.possuiAuxilioMoradia === "sim" || currentFuncionario.possuiAuxilioMoradia === "sim") && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Valor mensal</label>
                        {isEditing ? (
                          <Input
                            value={editedFuncionario.valorAuxilioMoradia || ''}
                            onChange={(e) => handleInputChange('valorAuxilioMoradia', e.target.value)}
                            placeholder="R$ 0,00"
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-md font-medium text-slate-700">{currentFuncionario.valorAuxilioMoradia || '-'}</p>
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
                    
                    {/* Mostrar datas de fim se existirem */}
                    {funcionario.dataFimExperiencia && statusAtual === 'experiencia' && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Fim do Período de Experiência</label>
                         <p className="text-md font-medium text-orange-700">
                           {funcionario.dataFimExperiencia ? new Date(funcionario.dataFimExperiencia + 'T12:00:00').toLocaleDateString('pt-BR') : ''}
                         </p>
                      </div>
                    )}
                    
                    {funcionario.dataFimAvisoPrevio && statusAtual === 'aviso' && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Fim do Aviso Prévio</label>
                         <p className="text-md font-medium text-red-700">
                           {funcionario.dataFimAvisoPrevio ? new Date(funcionario.dataFimAvisoPrevio + 'T12:00:00').toLocaleDateString('pt-BR') : ''}
                          </p>
                       </div>
                     )}
                     
                     <div>
                       <label className="text-sm font-medium text-slate-600">Utiliza Vale Transporte?</label>
                       {isEditing ? (
                         <Select value={editedFuncionario.valeTransporte || ''} onValueChange={(value) => handleInputChange('valeTransporte', value)}>
                           <SelectTrigger className="mt-1">
                             <SelectValue placeholder="Selecione" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="sim">Sim</SelectItem>
                             <SelectItem value="nao">Não</SelectItem>
                           </SelectContent>
                         </Select>
                       ) : (
                         <p className="text-md font-medium text-slate-700">{currentFuncionario.valeTransporte || '-'}</p>
                       )}
                     </div>
                     
                     {(editedFuncionario.valeTransporte === "sim" || currentFuncionario.valeTransporte === "sim") && (
                       <>
                         <div>
                           <label className="text-sm font-medium text-slate-600">Valor de cada vale</label>
                           {isEditing ? (
                             <Input
                               value={editedFuncionario.valorValeTransporte || ''}
                               onChange={(e) => handleInputChange('valorValeTransporte', e.target.value)}
                               placeholder="R$ 0,00"
                               className="mt-1"
                             />
                           ) : (
                             <p className="text-md font-medium text-slate-700">{currentFuncionario.valorValeTransporte || '-'}</p>
                           )}
                         </div>
                         <div>
                           <label className="text-sm font-medium text-slate-600">Quantos vales por dia</label>
                           {isEditing ? (
                             <Input
                               type="number"
                               value={editedFuncionario.quantidadeVales || ''}
                               onChange={(e) => handleInputChange('quantidadeVales', e.target.value)}
                               placeholder="2"
                               className="mt-1"
                             />
                           ) : (
                             <p className="text-md font-medium text-slate-700">{currentFuncionario.quantidadeVales || '-'}</p>
                           )}
                         </div>
                       </>
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
                    <div>
                      <label className="text-sm font-medium text-slate-600">CPF</label>
                      {isEditing ? (
                        <Input
                          value={editedFuncionario.cpf || ''}
                          onChange={(e) => handleInputChange('cpf', e.target.value)}
                          placeholder="000.000.000-00"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.cpf || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">RG</label>
                      {isEditing ? (
                        <Input
                          value={editedFuncionario.rg || ''}
                          onChange={(e) => handleInputChange('rg', e.target.value)}
                          placeholder="00.000.000-0"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.rg || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Órgão Emissor RG</label>
                      {isEditing ? (
                        <Input
                          value={editedFuncionario.orgaoEmissorRG || ''}
                          onChange={(e) => handleInputChange('orgaoEmissorRG', e.target.value)}
                          placeholder="SSP/SP"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.orgaoEmissorRG || '-'}</p>
                      )}
                    </div>
                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium text-slate-600">Raça/Etnia</label>
                              <Info size={16} className="text-slate-400 hover:text-slate-600" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Registro obrigatório segundo portaria Ministério do Trabalho e Emprego</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {isEditing ? (
                        <Select value={editedFuncionario.racaEtnia || ''} onValueChange={(value) => handleInputChange('racaEtnia', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amarela">Amarela</SelectItem>
                            <SelectItem value="branca">Branca</SelectItem>
                            <SelectItem value="parda">Parda</SelectItem>
                            <SelectItem value="indigena">Indígena</SelectItem>
                            <SelectItem value="preta">Preta</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.racaEtnia || '-'}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Data de Nascimento</label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedFuncionario.dataNascimento || ''}
                          onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-md font-medium text-slate-700">
                          {currentFuncionario.dataNascimento ? new Date(currentFuncionario.dataNascimento).toLocaleDateString('pt-BR') : '-'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Estado Civil</label>
                      {isEditing ? (
                        <Select value={editedFuncionario.estadoCivil || ''} onValueChange={(value) => handleInputChange('estadoCivil', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                            <SelectItem value="casado">Casado(a)</SelectItem>
                            <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                            <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                            <SelectItem value="uniao-estavel">União Estável</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.estadoCivil || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">CTPS - Número</label>
                      {isEditing ? (
                        <Input
                          value={editedFuncionario.ctpsNumero || ''}
                          onChange={(e) => handleInputChange('ctpsNumero', e.target.value)}
                          placeholder="0000000"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.ctpsNumero || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">CTPS - Série</label>
                      {isEditing ? (
                        <Input
                          value={editedFuncionario.ctpsSerie || ''}
                          onChange={(e) => handleInputChange('ctpsSerie', e.target.value)}
                          placeholder="000"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.ctpsSerie || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">CTPS - Estado</label>
                      {isEditing ? (
                        <Input
                          value={editedFuncionario.ctpsEstado || ''}
                          onChange={(e) => handleInputChange('ctpsEstado', e.target.value)}
                          placeholder="SP"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.ctpsEstado || '-'}</p>
                      )}
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
                      {isEditing ? (
                        <Input
                          value={editedFuncionario.cep || ''}
                          onChange={(e) => handleInputChange('cep', e.target.value)}
                          placeholder="00000-000"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-md font-medium text-slate-700">{currentFuncionario.cep || '-'}</p>
                      )}
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
                {(documentos.length === 0 && documentosSupabase.length === 0) ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-slate-500">Nenhum documento anexado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Documentos do Supabase */}
                    {documentosSupabase.map((documento) => (
                      <div key={`supabase_${documento.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-700">{documento.nome}</p>
                            <Badge variant="secondary" className="text-xs">
                              {documento.origem === 'portal' ? '🌐 Portal' : '📁 Manual'}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">
                            {documento.arquivo_nome}
                            {documento.tem_validade && documento.data_validade && (
                              <span className="ml-2 text-orange-600">
                                • Vence em {format(new Date(documento.data_validade), "dd/MM/yyyy")}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Documentos locais */}
                    {documentos.map((documento) => (
                      <div key={documento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-700">{documento.nome}</p>
                            <Badge variant="outline" className="text-xs">💾 Local</Badge>
                          </div>
                          <p className="text-sm text-slate-500">
                            {documento.nomeArquivo}
                            {documento.temValidade && documento.dataValidade && (
                              <span className="ml-2 text-orange-600">
                                • Vence em {format(new Date(documento.dataValidade), "dd/MM/yyyy")}
                              </span>
                            )}
                          </p>
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Dependentes
                    </h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-slate-400 hover:text-slate-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adicione o cônjuge e os dependentes MENORES de 14 anos</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
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

            {/* Card Uniformes e EPIs */}
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <Shirt className="h-5 w-5" />
                    Uniformes e EPIs
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUniformeForm(true)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar Uniforme
                  </Button>
                </div>

                {/* Formulário para novo uniforme */}
                {showUniformeForm && (
                  <Card className="mb-4 bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-slate-700 mb-3">Novo Uniforme/EPI</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="peca" className="text-sm font-medium text-slate-600">
                            Peça de Roupa/EPI
                          </Label>
                          <Input
                            id="peca"
                            placeholder="Ex: Camisa, Calça, Capacete..."
                            value={novoUniforme.peca}
                            onChange={(e) => setNovoUniforme({...novoUniforme, peca: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="tamanho" className="text-sm font-medium text-slate-600">
                            Tamanho
                          </Label>
                          <Input
                            id="tamanho"
                            placeholder="Ex: P, M, G, GG, 38, 40..."
                            value={novoUniforme.tamanho}
                            onChange={(e) => setNovoUniforme({...novoUniforme, tamanho: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="tipo" className="text-sm font-medium text-slate-600">
                            Tipo
                          </Label>
                          <Select
                            value={novoUniforme.tipo}
                            onValueChange={(value) => setNovoUniforme({...novoUniforme, tipo: value})}
                          >
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Uniforme">Uniforme</SelectItem>
                              <SelectItem value="EPI">EPI</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="dataEntrega" className="text-sm font-medium text-slate-600">
                            Data de Entrega
                          </Label>
                          <Input
                            id="dataEntrega"
                            type="date"
                            value={novoUniforme.dataEntrega}
                            onChange={(e) => setNovoUniforme({...novoUniforme, dataEntrega: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-3">
                        <Button 
                          onClick={handleSalvarUniforme}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          Salvar
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowUniformeForm(false)}
                          size="sm"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {uniformes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">👕</div>
                    <p className="text-slate-500">Nenhum uniforme/EPI registrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uniformes.map((uniforme) => (
                      <div key={uniforme.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-slate-700">{uniforme.peca}</p>
                            <Badge variant={uniforme.tipo === 'EPI' ? 'destructive' : 'secondary'} className="text-xs">
                              {uniforme.tipo}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">
                            Tamanho: {uniforme.tamanho} • Entregue em: {new Date(uniforme.dataEntrega).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
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
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNovoRegistro(true)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
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
                          <Label htmlFor="titulo" className="text-sm font-medium text-slate-600">
                            Título
                          </Label>
                          <Input
                            id="titulo"
                            placeholder="Título do registro..."
                            value={novoRegistro.titulo}
                            onChange={(e) => setNovoRegistro({...novoRegistro, titulo: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="tipo" className="text-sm font-medium text-slate-600">
                            Tipo
                          </Label>
                          <Select
                            value={novoRegistro.tipo}
                            onValueChange={(value) => setNovoRegistro({...novoRegistro, tipo: value as "positivo" | "neutro" | "negativo"})}
                          >
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="positivo">👍 Positivo</SelectItem>
                              <SelectItem value="neutro">➖ Neutro</SelectItem>
                              <SelectItem value="negativo">👎 Negativo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="descricao" className="text-sm font-medium text-slate-600">
                            Descrição
                          </Label>
                          <Textarea
                            id="descricao"
                            placeholder="Descreva o registro..."
                            value={novoRegistro.descricao}
                            onChange={(e) => setNovoRegistro({...novoRegistro, descricao: e.target.value})}
                            className="mt-1 resize-none"
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="registrado-por" className="text-sm font-medium text-slate-600">
                            Registrado por
                          </Label>
                          <Select
                            value={novoRegistro.registradoPor}
                            onValueChange={(value) => setNovoRegistro({...novoRegistro, registradoPor: value})}
                          >
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {usuariosDisponiveis.map((usuario) => (
                                <SelectItem key={usuario} value={usuario}>
                                  {usuario}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="arquivo" className="text-sm font-medium text-slate-600">
                            Arquivo (opcional)
                          </Label>
                          <Input
                            id="arquivo"
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setNovoRegistro({...novoRegistro, arquivo: file || null});
                            }}
                            className="mt-1"
                            accept="image/*,.pdf,.doc,.docx,.txt"
                          />
                          {novoRegistro.arquivo && (
                            <p className="text-xs text-gray-500 mt-1">
                              Arquivo selecionado: {novoRegistro.arquivo.name}
                            </p>
                          )}
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
                      <Card key={registro.id} className={`border ${getClassificacaoColor(registro.tipo)}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center justify-center w-5 h-5">{getClassificacaoIcon(registro.tipo)}</div>
                                <span className="font-medium text-sm capitalize">{registro.tipo}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(registro.created_at).toLocaleString('pt-BR')}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-800 mb-1">{registro.titulo}</h4>
                              <p className="text-sm text-gray-700 mb-2">{registro.descricao}</p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">Por: {registro.usuario}</p>
                                {registro.arquivo_nome && (
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-6 h-6 bg-blue-100 border border-blue-300 rounded flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors"
                                      onClick={() => {
                                        setSelectedDocument({
                                          nome: registro.arquivo_nome!,
                                          url: registro.arquivo_url!,
                                          tipo: registro.arquivo_tipo!,
                                          tamanho: registro.arquivo_tamanho!
                                        });
                                        setShowDocumentViewModal(true);
                                      }}
                                      title={`${registro.arquivo_nome} (${((registro.arquivo_tamanho || 0) / 1024).toFixed(1)} KB)`}
                                    >
                                      <FileText size={12} className="text-blue-600" />
                                    </div>
                                  </div>
                                )}
                              </div>
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
              <Button 
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
              >
                🗑️ Deletar Informações
              </Button>
              <Button 
                onClick={() => setIsVerDocumentosModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
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

      {selectedDocument && (
        <HistoricoDocumentViewModal
          isOpen={showDocumentViewModal}
          onClose={() => {
            setShowDocumentViewModal(false);
            setSelectedDocument(null);
          }}
          arquivo={selectedDocument}
        />
      )}

      <DeleteInfoModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        funcionarioId={funcionario.id}
        funcionarioNome={funcionario.nome}
        onDataUpdate={() => window.location.reload()}
      />

      <FuncionarioDocumentosModal
        isOpen={isVerDocumentosModalOpen}
        onClose={() => setIsVerDocumentosModalOpen(false)}
        funcionarioId={funcionario.id}
        funcionarioNome={funcionario.nome}
      />

      <SubstituirDocumentoModal
        isOpen={showSubstituicaoModal}
        onClose={() => {
          setShowSubstituicaoModal(false);
          setDocumentoParaSubstituir(null);
        }}
        documento={documentoParaSubstituir}
        onSuccess={() => {
          recarregarDocumentosSupabase();
          // Força recarregamento do modal de documentos se estiver aberto
          if (isVerDocumentosModalOpen) {
            setIsVerDocumentosModalOpen(false);
            setTimeout(() => setIsVerDocumentosModalOpen(true), 100);
          }
        }}
      />
    </>
  );
}
