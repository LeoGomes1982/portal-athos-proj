
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

interface AdmissaoModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  
  // Informações Pessoais
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  estadoCivil: string;
  nacionalidade: string;
  naturalidade: string;
  nomePai: string;
  nomeMae: string;
  nomeConjuge: string;
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

export function AdmissaoModal({ isOpen, onClose }: AdmissaoModalProps) {
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
    nome: "",
    cpf: "",
    rg: "",
    dataNascimento: "",
    estadoCivil: "",
    nacionalidade: "Brasileiro",
    naturalidade: "",
    nomePai: "",
    nomeMae: "",
    nomeConjuge: "",
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

  // Calcular progresso baseado nos campos preenchidos
  const calculateProgress = () => {
    const totalFields = 30; // Número aproximado de campos obrigatórios
    let filledFields = 0;
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'dependentes' && value && value !== "") {
        filledFields++;
      }
    });
    
    // Adicionar dependentes ao cálculo
    filledFields += formData.dependentes.length * 2;
    
    const newProgress = Math.min((filledFields / totalFields) * 100, 100);
    setProgress(newProgress);
  };

  // Atualizar progresso quando formData mudar
  useEffect(() => {
    calculateProgress();
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    // Validação básica
    if (!formData.nome || !formData.cpf || !formData.email) {
      toast({
        title: "Erro ❌",
        description: "Preencha os campos obrigatórios: Nome, CPF e E-mail",
        variant: "destructive"
      });
      return;
    }

    // Simular envio
    toast({
      title: "Admissão Enviada com Sucesso! 🎉",
      description: `Olá ${formData.nome}! Recebemos sua solicitação de admissão. Nossa equipe de RH entrará em contato em breve. Obrigado!`,
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
          <DialogTitle className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
            🚀 Processo de Admissão Online
          </DialogTitle>
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
                  <Label htmlFor="cargo">Cargo Pretendido *</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => handleInputChange("cargo", e.target.value)}
                    placeholder="Ex: Analista de Sistemas"
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
                  <Select onValueChange={(value) => handleInputChange("escolaridade", value)}>
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
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
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
                    <Select onValueChange={(value) => handleInputChange("estadoCivil", value)}>
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
                    placeholder="Apartamento, casa, etc."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📄 Documentos Necessários</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="documentoRG">RG (frente e verso)</Label>
                  <Input
                    id="documentoRG"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("documentoRG", e)}
                    className="cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="documentoCPF">CPF</Label>
                  <Input
                    id="documentoCPF"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("documentoCPF", e)}
                    className="cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="comprovanteEndereco">Comprovante de Endereço</Label>
                  <Input
                    id="comprovanteEndereco"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("comprovanteEndereco", e)}
                    className="cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="comprovanteEscolaridade">Comprovante de Escolaridade</Label>
                  <Input
                    id="comprovanteEscolaridade"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("comprovanteEscolaridade", e)}
                    className="cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="carteiraTrabalho">Carteira de Trabalho</Label>
                  <Input
                    id="carteiraTrabalho"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("carteiraTrabalho", e)}
                    className="cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="tituloEleitor">Título de Eleitor</Label>
                  <Input
                    id="tituloEleitor"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("tituloEleitor", e)}
                    className="cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="certificadoReservista">Certificado de Reservista (se aplicável)</Label>
                  <Input
                    id="certificadoReservista"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("certificadoReservista", e)}
                    className="cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dependentes" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>👨‍👩‍👧‍👦 Dependentes</CardTitle>
                <Button onClick={addDependente} size="sm">
                  ➕ Adicionar Dependente
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.dependentes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
                    <p>Nenhum dependente cadastrado</p>
                    <p className="text-sm">Clique em "Adicionar Dependente" para começar</p>
                  </div>
                ) : (
                  formData.dependentes.map((dependente, index) => (
                    <Card key={index} className="border-dashed">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <h4 className="font-medium">Dependente {index + 1}</h4>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeDependente(index)}
                        >
                          🗑️ Remover
                        </Button>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nome</Label>
                          <Input
                            value={dependente.nome}
                            onChange={(e) => updateDependente(index, "nome", e.target.value)}
                            placeholder="Nome do dependente"
                          />
                        </div>
                        <div>
                          <Label>Parentesco</Label>
                          <Select onValueChange={(value) => updateDependente(index, "parentesco", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="filho">Filho(a)</SelectItem>
                              <SelectItem value="conjuge">Cônjuge</SelectItem>
                              <SelectItem value="pai">Pai</SelectItem>
                              <SelectItem value="mae">Mãe</SelectItem>
                              <SelectItem value="irmao">Irmão(ã)</SelectItem>
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
                              if (file) updateDependente(index, "certidaoNascimento", file);
                            }}
                            className="cursor-pointer"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            ❌ Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
            🚀 Enviar Admissão
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
