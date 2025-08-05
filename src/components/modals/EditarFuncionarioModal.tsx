import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { X, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

interface EditarFuncionarioModalProps {
  funcionario: Funcionario;
  isOpen: boolean;
  onClose: () => void;
  onSave: (funcionario: Funcionario) => void;
}

interface FormData {
  // Informações Profissionais
  cargo: string;
  setor: string;
  salario: string;
  dataAdmissao: string;
  tipoContrato: string;
  escolaridade: string;
  profissao: string;
  experienciaProfissional: string;
  pis: string;
  valeTransporte: string;
  valorValeTransporte: string;
  quantidadeVales: string;
  
  // Informações Pessoais
  nome: string;
  cpf: string;
  rg: string;
  orgaoEmissorRG: string;
  dataNascimento: string;
  estadoCivil: string;
  nacionalidade: string;
  naturalidade: string;
  nomePai: string;
  nomeMae: string;
  nomeConjuge: string;
  racaEtnia: string;
  ctpsNumero: string;
  ctpsSerie: string;
  ctpsEstado: string;
  foto: File | null;
  
  // Informações de Contato
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  cep: string;
  estado: string;
  bairro: string;
  numero: string;
  complemento: string;
  
  // Documentos
  documentoRG: File | null;
  documentoCPF: File | null;
  comprovanteEndereco: File | null;
  comprovanteEscolaridade: File | null;
  carteiraTrabalho: File | null;
  tituloEleitor: File | null;
  certificadoReservista: File | null;
  
  // Dependentes
  dependentes: Array<{
    nome: string;
    parentesco: string;
    dataNascimento: string;
    cpf: string;
    certidaoNascimento: File | null;
  }>;
}

export function EditarFuncionarioModal({ funcionario, isOpen, onClose, onSave }: EditarFuncionarioModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profissional");
  const [progress, setProgress] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    cargo: "",
    setor: "",
    salario: "",
    dataAdmissao: "",
    tipoContrato: "",
    escolaridade: "",
    profissao: "",
    experienciaProfissional: "",
    pis: "",
    valeTransporte: "",
    valorValeTransporte: "",
    quantidadeVales: "",
    nome: "",
    cpf: "",
    rg: "",
    orgaoEmissorRG: "",
    dataNascimento: "",
    estadoCivil: "",
    nacionalidade: "Brasileiro",
    naturalidade: "",
    nomePai: "",
    nomeMae: "",
    nomeConjuge: "",
    racaEtnia: "",
    ctpsNumero: "",
    ctpsSerie: "",
    ctpsEstado: "",
    foto: null,
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    cep: "",
    estado: "",
    bairro: "",
    numero: "",
    complemento: "",
    documentoRG: null,
    documentoCPF: null,
    comprovanteEndereco: null,
    comprovanteEscolaridade: null,
    carteiraTrabalho: null,
    tituloEleitor: null,
    certificadoReservista: null,
    dependentes: []
  });

  // Carregar dados do funcionário quando abrir o modal
  useEffect(() => {
    if (isOpen && funcionario) {
      // Carregar dados salvos do localStorage se existirem
      const dadosSalvos = localStorage.getItem(`funcionario_edicao_${funcionario.id}`);
      if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        setFormData(dados);
      } else {
        // Carregar dados básicos do funcionário
        setFormData(prev => ({
          ...prev,
          nome: funcionario.nome || "",
          cargo: funcionario.cargo || "",
          setor: funcionario.setor || "",
          salario: funcionario.salario || "",
          dataAdmissao: funcionario.dataAdmissao || "",
          telefone: funcionario.telefone || "",
          email: funcionario.email || "",
          cpf: funcionario.cpf || "",
          rg: funcionario.rg || "",
          endereco: funcionario.endereco || ""
        }));
      }
    }
  }, [isOpen, funcionario]);

  // Calcular progresso baseado nos campos preenchidos
  const calculateProgress = () => {
    const totalFields = 30;
    let filledFields = 0;
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'dependentes' && value && value !== "") {
        filledFields++;
      }
    });
    
    filledFields += formData.dependentes.length * 2;
    
    const newProgress = Math.min((filledFields / totalFields) * 100, 100);
    setProgress(newProgress);
  };

  // Atualizar progresso apenas quando necessário
  useEffect(() => {
    calculateProgress();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Salvar no localStorage usando os dados atualizados
      localStorage.setItem(`funcionario_edicao_${funcionario.id}`, JSON.stringify(newData));
      return newData;
    });
  };

  const handleFileUpload = (field: keyof FormData, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const addDependente = () => {
    setFormData(prev => ({
      ...prev,
      dependentes: [...prev.dependentes, { nome: "", parentesco: "", dataNascimento: "", cpf: "", certidaoNascimento: null }]
    }));
  };

  const removeDependente = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dependentes: prev.dependentes.filter((_, i) => i !== index)
    }));
  };

  const updateDependente = (index: number, field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      dependentes: prev.dependentes.map((dep, i) => 
        i === index ? { ...dep, [field]: value } : dep
      )
    }));
  };

  const handleSubmit = () => {
    // Validação básica - apenas campos essenciais
    if (!formData.nome || !formData.email) {
      toast({
        title: "Erro ❌",
        description: "Preencha os campos obrigatórios: Nome e E-mail",
        variant: "destructive"
      });
      return;
    }

    // Atualizar funcionário
    const funcionarioAtualizado: Funcionario = {
      ...funcionario,
      nome: formData.nome,
      cargo: formData.cargo,
      setor: formData.setor,
      telefone: formData.telefone,
      email: formData.email,
      cpf: formData.cpf,
      rg: formData.rg,
      endereco: formData.endereco,
      salario: formData.salario
    };

    onSave(funcionarioAtualizado);
    
    // Limpar dados salvos do localStorage
    localStorage.removeItem(`funcionario_edicao_${funcionario.id}`);
    
    toast({
      title: "Funcionário Atualizado! 🎉",
      description: `Dados de ${formData.nome} foram atualizados com sucesso.`,
    });
    
    onClose();
  };

  const tabs = [
    { id: "profissional", label: "💼 Profissional" },
    { id: "pessoal", label: "👤 Pessoal" },
    { id: "contato", label: "📞 Contato" },
    { id: "documentos", label: "📄 Documentos" },
    { id: "dependentes", label: "👨‍👩‍👧‍👦 Dependentes" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              ✏️ Editar Funcionário - {funcionario.nome}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 h-auto hover:bg-blue-100"
            >
              <X size={20} />
            </Button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso do Formulário</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            {tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profissional" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>💼 Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => handleInputChange("cargo", e.target.value)}
                    placeholder="Ex: Analista de Sistemas"
                  />
                </div>
                <div>
                  <Label htmlFor="setor">Setor</Label>
                  <Input
                    id="setor"
                    value={formData.setor}
                    onChange={(e) => handleInputChange("setor", e.target.value)}
                    placeholder="Setor de trabalho"
                  />
                </div>
                <div>
                  <Label htmlFor="salario">Salário</Label>
                  <Input
                    id="salario"
                    value={formData.salario}
                    onChange={(e) => handleInputChange("salario", e.target.value)}
                    placeholder="R$ 0.000,00"
                  />
                </div>
                <div>
                  <Label htmlFor="dataAdmissao">Data de Admissão</Label>
                  <Input
                    id="dataAdmissao"
                    type="date"
                    value={formData.dataAdmissao}
                    onChange={(e) => handleInputChange("dataAdmissao", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input
                    id="profissao"
                    value={formData.profissao}
                    onChange={(e) => handleInputChange("profissao", e.target.value)}
                    placeholder="Sua profissão atual"
                  />
                </div>
                <div>
                  <Label htmlFor="escolaridade">Escolaridade</Label>
                  <Select value={formData.escolaridade} onValueChange={(value) => handleInputChange("escolaridade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua escolaridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                      <SelectItem value="medio">Ensino Médio</SelectItem>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                      <SelectItem value="superior">Superior</SelectItem>
                      <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
                      <SelectItem value="mestrado">Mestrado</SelectItem>
                      <SelectItem value="doutorado">Doutorado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pis">PIS/PASEP</Label>
                  <Input
                    id="pis"
                    value={formData.pis}
                    onChange={(e) => handleInputChange("pis", e.target.value)}
                    placeholder="000.00000.00-0"
                  />
                </div>
                <div>
                  <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
                  <Select value={formData.tipoContrato} onValueChange={(value) => handleInputChange("tipoContrato", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clt">CLT</SelectItem>
                      <SelectItem value="pj">PJ</SelectItem>
                      <SelectItem value="temporario">Temporário</SelectItem>
                      <SelectItem value="estagio">Estágio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="valeTransporte">Utiliza Vale Transporte?</Label>
                  <Select value={formData.valeTransporte} onValueChange={(value) => handleInputChange("valeTransporte", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.valeTransporte === "sim" && (
                  <>
                    <div>
                      <Label htmlFor="valorValeTransporte">Valor de cada vale</Label>
                      <Input
                        id="valorValeTransporte"
                        value={formData.valorValeTransporte}
                        onChange={(e) => handleInputChange("valorValeTransporte", e.target.value)}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantidadeVales">Quantos vales por dia</Label>
                      <Input
                        id="quantidadeVales"
                        type="number"
                        value={formData.quantidadeVales}
                        onChange={(e) => handleInputChange("quantidadeVales", e.target.value)}
                        placeholder="2"
                      />
                    </div>
                  </>
                )}
                
                <div className="md:col-span-2">
                  <Label htmlFor="experienciaProfissional">Experiência Profissional</Label>
                  <Textarea
                    id="experienciaProfissional"
                    value={formData.experienciaProfissional}
                    onChange={(e) => handleInputChange("experienciaProfissional", e.target.value)}
                    placeholder="Descreva sua experiência profissional anterior..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pessoal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>👤 Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => handleInputChange("cpf", e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rg">RG</Label>
                    <Input
                      id="rg"
                      value={formData.rg}
                      onChange={(e) => handleInputChange("rg", e.target.value)}
                      placeholder="00.000.000-0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="orgaoEmissorRG">Órgão Emissor RG</Label>
                    <Input
                      id="orgaoEmissorRG"
                      value={formData.orgaoEmissorRG}
                      onChange={(e) => handleInputChange("orgaoEmissorRG", e.target.value)}
                      placeholder="SSP/SP"
                    />
                  </div>
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="racaEtnia">Raça/Etnia</Label>
                            <Info size={16} className="text-slate-400 hover:text-slate-600" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Registro obrigatório segundo portaria Ministério do Trabalho e Emprego</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Select value={formData.racaEtnia} onValueChange={(value) => handleInputChange("racaEtnia", value)}>
                      <SelectTrigger>
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
                  </div>
                  <div>
                    <Label htmlFor="ctpsNumero">CTPS - Número</Label>
                    <Input
                      id="ctpsNumero"
                      value={formData.ctpsNumero}
                      onChange={(e) => handleInputChange("ctpsNumero", e.target.value)}
                      placeholder="0000000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ctpsSerie">CTPS - Série</Label>
                    <Input
                      id="ctpsSerie"
                      value={formData.ctpsSerie}
                      onChange={(e) => handleInputChange("ctpsSerie", e.target.value)}
                      placeholder="000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ctpsEstado">CTPS - Estado</Label>
                    <Input
                      id="ctpsEstado"
                      value={formData.ctpsEstado}
                      onChange={(e) => handleInputChange("ctpsEstado", e.target.value)}
                      placeholder="SP"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estadoCivil">Estado Civil</Label>
                    <Select value={formData.estadoCivil} onValueChange={(value) => handleInputChange("estadoCivil", value)}>
                      <SelectTrigger>
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
                  </div>
                  <div>
                    <Label htmlFor="naturalidade">Naturalidade</Label>
                    <Input
                      id="naturalidade"
                      value={formData.naturalidade}
                      onChange={(e) => handleInputChange("naturalidade", e.target.value)}
                      placeholder="Cidade/Estado onde nasceu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nomePai">Nome do Pai</Label>
                    <Input
                      id="nomePai"
                      value={formData.nomePai}
                      onChange={(e) => handleInputChange("nomePai", e.target.value)}
                      placeholder="Nome completo do pai"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nomeMae">Nome da Mãe</Label>
                    <Input
                      id="nomeMae"
                      value={formData.nomeMae}
                      onChange={(e) => handleInputChange("nomeMae", e.target.value)}
                      placeholder="Nome completo da mãe"
                    />
                  </div>
                  {(formData.estadoCivil === "casado" || formData.estadoCivil === "uniao-estavel") && (
                    <div>
                      <Label htmlFor="nomeConjuge">Nome do Cônjuge</Label>
                      <Input
                        id="nomeConjuge"
                        value={formData.nomeConjuge}
                        onChange={(e) => handleInputChange("nomeConjuge", e.target.value)}
                        placeholder="Nome completo do cônjuge"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="foto">Foto 3x4 📸</Label>
                  <Input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload("foto", e)}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos aceitos: JPG, PNG (máx. 5MB)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contato" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📞 Informações de Contato e Endereço</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => handleInputChange("cep", e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => handleInputChange("estado", e.target.value)}
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange("cidade", e.target.value)}
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) => handleInputChange("bairro", e.target.value)}
                    placeholder="Centro"
                  />
                </div>
                <div>
                  <Label htmlFor="endereco">Logradouro</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange("endereco", e.target.value)}
                    placeholder="Rua, Avenida..."
                  />
                </div>
                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => handleInputChange("numero", e.target.value)}
                    placeholder="123"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={formData.complemento}
                    onChange={(e) => handleInputChange("complemento", e.target.value)}
                    placeholder="Apto, Bloco, etc."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📄 Upload de Documentos</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { field: "documentoRG", label: "RG (frente e verso)" },
                  { field: "documentoCPF", label: "CPF" },
                  { field: "comprovanteEndereco", label: "Comprovante de Endereço" },
                  { field: "comprovanteEscolaridade", label: "Comprovante de Escolaridade" },
                  { field: "carteiraTrabalho", label: "Carteira de Trabalho" },
                  { field: "tituloEleitor", label: "Título de Eleitor" },
                  { field: "certificadoReservista", label: "Certificado de Reservista" }
                ].map((doc) => (
                  <div key={doc.field}>
                    <Label htmlFor={doc.field}>{doc.label}</Label>
                    <Input
                      id={doc.field}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(doc.field as keyof FormData, e)}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (máx. 10MB)</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dependentes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>👨‍👩‍👧‍👦 Dependentes</span>
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
                  <Button onClick={addDependente} size="sm" className="bg-green-600 hover:bg-green-700">
                    + Adicionar Dependente
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.dependentes.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum dependente cadastrado. Clique em "Adicionar Dependente" para incluir.
                  </p>
                ) : (
                  formData.dependentes.map((dependente, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Dependente #{index + 1}</h4>
                          <Button 
                            onClick={() => removeDependente(index)}
                            size="sm" 
                            variant="destructive"
                          >
                            Remover
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Nome Completo</Label>
                            <Input
                              value={dependente.nome}
                              onChange={(e) => updateDependente(index, "nome", e.target.value)}
                              placeholder="Nome do dependente"
                            />
                          </div>
                          <div>
                            <Label>Parentesco</Label>
                            <Select 
                              value={dependente.parentesco}
                              onValueChange={(value) => updateDependente(index, "parentesco", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="filho">Filho(a)</SelectItem>
                                <SelectItem value="conjuge">Cônjuge</SelectItem>
                                <SelectItem value="pai">Pai</SelectItem>
                                <SelectItem value="mae">Mãe</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Data de Nascimento</Label>
                            <Input
                              type="date"
                              value={dependente.dataNascimento}
                              onChange={(e) => updateDependente(index, "dataNascimento", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>CPF</Label>
                            <Input
                              value={dependente.cpf}
                              onChange={(e) => updateDependente(index, "cpf", e.target.value)}
                              placeholder="000.000.000-00"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Certidão de Nascimento</Label>
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                updateDependente(index, "certidaoNascimento", file || null);
                              }}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}