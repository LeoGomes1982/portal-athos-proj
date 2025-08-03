import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, AlertTriangle, X, User, Plus, MessageSquare, Download, Eye, Trash2, FileText, Users, Shirt, Info, Check, Sun, RefreshCw, ClipboardList, Edit, Paperclip, ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { EmpresaSelect } from "./EmpresaSelect";

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
  empresaContratante?: string;
  fiscalResponsavel?: string;
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

// Componente para seções colapsáveis
const CollapsibleSection = ({ 
  id, 
  title, 
  icon, 
  children, 
  isOpen, 
  onToggle 
}: { 
  id: string, 
  title: string, 
  icon: string | React.ReactNode, 
  children: React.ReactNode,
  isOpen: boolean,
  onToggle: () => void
}) => {
  return (
    <Card className="bg-white border-2 border-blue-200">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CardContent className="p-0">
          <CollapsibleTrigger asChild>
            <div className="w-full p-6 pb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                {icon} {title}
              </h3>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-6 pb-6">
              {children}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};

export function FuncionarioDetalhesModal({ funcionario, isOpen, onClose, onStatusChange, onFuncionarioUpdate }: FuncionarioDetalhesModalProps) {
  const { toast } = useToast();
  const { historico, loading: loadingHistorico, adicionarRegistro } = useFuncionarioHistorico(funcionario.id);
  
  // Estados para collapse das seções
  const [sectionStates, setSectionStates] = useState({
    profissional: true,
    pessoal: true,
    contato: true,
    documentos: true,
    dependentes: true,
    historico: true
  });

  const [statusAtual, setStatusAtual] = useState(funcionario.status);
  const [showDateInput, setShowDateInput] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dataFim, setDataFim] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedFuncionario, setEditedFuncionario] = useState<Funcionario>(funcionario);

  // Estados para modais
  const [showDependenteModal, setShowDependenteModal] = useState(false);
  const [showDocumentoModal, setShowDocumentoModal] = useState(false);
  const [showDocumentViewModal, setShowDocumentViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isVerDocumentosModalOpen, setIsVerDocumentosModalOpen] = useState(false);
  const [showSubstituicaoModal, setShowSubstituicaoModal] = useState(false);
  const [documentoParaSubstituir, setDocumentoParaSubstituir] = useState<any>(null);

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

  // Função para toggle das seções
  const toggleSection = (section: keyof typeof sectionStates) => {
    setSectionStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
    
    toast({
      title: "Status Atualizado",
      description: `${statusConfig[status].label} definido até ${new Date(dataFim + 'T12:00:00').toLocaleDateString('pt-BR')}`,
    });
    
    setShowDateInput(false);
    setSelectedStatus("");
    setDataFim("");
  };

  const handleInputChange = (field: keyof Funcionario, value: string) => {
    setEditedFuncionario(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const statusInfo = statusConfig[statusAtual];
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
                      <Star className="w-8 h-8 text-yellow-500 fill-yellow-400 drop-shadow-lg animate-pulse" />
                    )}
                    {temDocumentosVencendo && (
                      <AlertTriangle className="w-8 h-8 text-red-500 fill-red-400 drop-shadow-lg animate-pulse" />
                    )}
                  </h2>
                  
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
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
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
                      <Button variant="outline" onClick={() => setShowDateInput(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Seções Colapsáveis */}
            
            {/* Informações Profissionais */}
            <CollapsibleSection 
              id="profissional" 
              title="Informações Profissionais" 
              icon="💼"
              isOpen={sectionStates.profissional}
              onToggle={() => toggleSection('profissional')}
            >
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
                </div>
              </div>
            </CollapsibleSection>

            {/* Informações Pessoais */}
            <CollapsibleSection 
              id="pessoal" 
              title="Informações Pessoais" 
              icon="👤"
              isOpen={sectionStates.pessoal}
              onToggle={() => toggleSection('pessoal')}
            >
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
                      <p className="text-md font-medium text-slate-700">{currentFuncionario.nome}</p>
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
                </div>
              </div>
            </CollapsibleSection>

            {/* Informações de Contato */}
            <CollapsibleSection 
              id="contato" 
              title="Informações de Contato" 
              icon="📞"
              isOpen={sectionStates.contato}
              onToggle={() => toggleSection('contato')}
            >
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
                </div>
              </div>
            </CollapsibleSection>

            {/* Documentos */}
            <CollapsibleSection 
              id="documentos" 
              title="Documentos" 
              icon={<FileText className="h-5 w-5" />}
              isOpen={sectionStates.documentos}
              onToggle={() => toggleSection('documentos')}
            >
              <div className="flex items-center justify-between mb-4">
                <div></div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDocumentoModal(true)}
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
                  {documentos.map((documento: any) => (
                    <div key={documento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-slate-700">{documento.nome}</p>
                        <p className="text-sm text-slate-500">{documento.tipo}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(documento);
                            setShowDocumentViewModal(true);
                          }}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerDocumento(documento.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>

            {/* Dependentes */}
            <CollapsibleSection 
              id="dependentes" 
              title="Dependentes" 
              icon={<Users className="h-5 w-5" />}
              isOpen={sectionStates.dependentes}
              onToggle={() => toggleSection('dependentes')}
            >
              <div className="flex items-center justify-between mb-4">
                <div></div>
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
                  <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
                  <p className="text-slate-500">Nenhum dependente cadastrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dependentes.map((dependente: any) => (
                    <div key={dependente.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-slate-700">{dependente.nome}</p>
                        <p className="text-sm text-slate-500">{dependente.parentesco}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerDependente(dependente.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>

            {/* Histórico */}
            <CollapsibleSection 
              id="historico" 
              title="Histórico" 
              icon="📋"
              isOpen={sectionStates.historico}
              onToggle={() => toggleSection('historico')}
            >
              {loadingHistorico ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">Carregando histórico...</p>
                </div>
              ) : historico.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-slate-500">Nenhum registro no histórico</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historico.map((registro: any) => (
                    <div key={registro.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-slate-700">{registro.titulo}</h4>
                        <Badge variant={registro.tipo === 'positivo' ? 'default' : registro.tipo === 'negativo' ? 'destructive' : 'secondary'}>
                          {registro.tipo}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{registro.descricao}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(registro.created_at).toLocaleDateString('pt-BR')} - {registro.usuario}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>

            {/* Botões de Ação */}
            {isEditing && (
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditedFuncionario(funcionario);
                    setIsEditing(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (onFuncionarioUpdate) {
                      onFuncionarioUpdate(editedFuncionario);
                    }
                    setIsEditing(false);
                    toast({
                      title: "Funcionário Atualizado",
                      description: "Informações salvas com sucesso!",
                    });
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Salvar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
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
          if (isVerDocumentosModalOpen) {
            setIsVerDocumentosModalOpen(false);
            setTimeout(() => setIsVerDocumentosModalOpen(true), 100);
          }
        }}
      />
    </>
  );
}