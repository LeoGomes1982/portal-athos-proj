
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
import { supabase } from "@/integrations/supabase/client";

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
  dataFimExperiencia: string;
  dataFimAvisoPrevio: string;
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
  
  // Documentos CTPS
  ctpsNumero: string;
  ctpsSerie: string;
  ctpsEstado: string;
  
  // Status (será definido automaticamente como 'experiencia' para novos funcionários)
  status: string;
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
    dataFimExperiencia: "",
    dataFimAvisoPrevio: "",
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
    ctpsNumero: "",
    ctpsSerie: "",
    ctpsEstado: "",
    status: "experiencia"
  });

  // Calcular progresso baseado nos campos preenchidos
  const calculateProgress = () => {
    const totalFields = 20; // Número aproximado de campos obrigatórios
    let filledFields = 0;
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value && value !== "") {
        filledFields++;
      }
    });
    
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


  const handleSubmit = async () => {
    // Validação básica
    if (!formData.nome || !formData.cpf || !formData.email || !formData.cargo) {
      toast({
        title: "Erro ❌",
        description: "Preencha os campos obrigatórios: Nome, CPF, E-mail e Cargo",
        variant: "destructive"
      });
      return;
    }

    try {
      // Gerar um ID único para o funcionário
      const funcionarioId = Math.floor(Math.random() * 10000) + 1000;
      let fotoUrl = null;

      // Upload da foto se existir
      if (formData.foto) {
        const fileExt = formData.foto.name.split('.').pop();
        const fileName = `${funcionarioId}_foto_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('funcionario-documentos')
          .upload(fileName, formData.foto);

        if (uploadError) {
          console.error('Erro ao fazer upload da foto:', uploadError);
          toast({
            title: "Aviso ⚠️",
            description: "Erro ao salvar foto, mas o cadastro prosseguirá.",
            variant: "destructive"
          });
        } else {
          // Obter URL público da foto
          const { data: urlData } = supabase.storage
            .from('funcionario-documentos')
            .getPublicUrl(fileName);
          
          fotoUrl = urlData.publicUrl;
        }
      }

      // Inserir na tabela funcionarios_sync
      const { error } = await supabase
        .from('funcionarios_sync')
        .insert({
          funcionario_id: funcionarioId,
          nome: formData.nome,
          cargo: formData.cargo,
          setor: formData.setor || null,
          data_admissao: formData.dataAdmissao || null,
          telefone: formData.telefone || null,
          email: formData.email || null,
          foto: fotoUrl, // URL da foto salva no Storage
          status: formData.status,
          cpf: formData.cpf || null,
          rg: formData.rg || null,
          orgao_emissor_rg: formData.orgaoEmissorRG || null,
          endereco: formData.endereco || null,
          cep: formData.cep || null,
          cidade: formData.cidade || null,
          estado: formData.estado || null,
          bairro: formData.bairro || null,
          numero: formData.numero || null,
          complemento: formData.complemento || null,
          salario: formData.salario || null,
          data_fim_experiencia: formData.dataFimExperiencia || null,
          data_fim_aviso_previo: formData.dataFimAvisoPrevio || null,
          data_nascimento: formData.dataNascimento || null,
          estado_civil: formData.estadoCivil || null,
          nacionalidade: formData.nacionalidade || 'Brasileiro',
          naturalidade: formData.naturalidade || null,
          nome_pai: formData.nomePai || null,
          nome_mae: formData.nomeMae || null,
          nome_conjuge: formData.nomeConjuge || null,
          raca_etnia: formData.racaEtnia || null,
          ctps_numero: formData.ctpsNumero || null,
          ctps_serie: formData.ctpsSerie || null,
          ctps_estado: formData.ctpsEstado || null,
          vale_transporte: formData.valeTransporte || null,
          valor_vale_transporte: formData.valorValeTransporte || null,
          quantidade_vales: formData.quantidadeVales || null
        });

      if (error) {
        console.error('Erro ao salvar funcionário:', error);
        toast({
          title: "Erro ❌",
          description: "Erro ao processar admissão. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      // Salvar foto como documento se foi carregada
      if (formData.foto && fotoUrl) {
        const { error: docError } = await supabase
          .from('funcionario_documentos')
          .insert({
            funcionario_id: funcionarioId,
            nome: 'Foto 3x4',
            arquivo_nome: formData.foto.name,
            arquivo_url: fotoUrl,
            arquivo_tipo: formData.foto.type,
            arquivo_tamanho: formData.foto.size,
            origem: 'portal',
            tem_validade: false
          });

        if (docError) {
          console.error('Erro ao salvar documento de foto:', docError);
        }
      }

      toast({
        title: "Admissão Enviada com Sucesso! 🎉",
        description: `Olá ${formData.nome}! Recebemos sua solicitação de admissão. O registro foi automaticamente adicionado ao sistema. Nossa equipe de RH entrará em contato em breve!`,
      });
      
      onClose();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro ❌",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const tabs = [
    { id: "profissional", label: "💼 Profissional" },
    { id: "pessoal", label: "👤 Pessoal" },
    { id: "contato", label: "📞 Contato" },
    { id: "documentos", label: "📄 Documentos" }
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
          <TabsList className="grid grid-cols-4 w-full">
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
                  <Label htmlFor="setor">Setor</Label>
                  <Input
                    id="setor"
                    value={formData.setor}
                    onChange={(e) => handleInputChange("setor", e.target.value)}
                    placeholder="Departamento/Setor"
                  />
                </div>
                <div>
                  <Label htmlFor="salario">Salário</Label>
                  <Input
                    id="salario"
                    value={formData.salario}
                    onChange={(e) => handleInputChange("salario", e.target.value)}
                    placeholder="Ex: R$ 3.000,00"
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
                  <Label htmlFor="valeTransporte">Vale Transporte</Label>
                  <Select onValueChange={(value) => handleInputChange("valeTransporte", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Usa vale transporte?" />
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
                      <Label htmlFor="valorValeTransporte">Valor Vale Transporte</Label>
                      <Input
                        id="valorValeTransporte"
                        value={formData.valorValeTransporte}
                        onChange={(e) => handleInputChange("valorValeTransporte", e.target.value)}
                        placeholder="R$ 150,00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantidadeVales">Quantidade de Vales</Label>
                      <Input
                        id="quantidadeVales"
                        value={formData.quantidadeVales}
                        onChange={(e) => handleInputChange("quantidadeVales", e.target.value)}
                        placeholder="30"
                      />
                    </div>
                  </>
                )}
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
                    <Label htmlFor="orgaoEmissorRG">Órgão Emissor RG</Label>
                    <Input
                      id="orgaoEmissorRG"
                      value={formData.orgaoEmissorRG}
                      onChange={(e) => handleInputChange("orgaoEmissorRG", e.target.value)}
                      placeholder="SSP-SP"
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
                    <Label htmlFor="racaEtnia">Raça/Etnia</Label>
                    <Select onValueChange={(value) => handleInputChange("racaEtnia", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="branca">Branca</SelectItem>
                        <SelectItem value="preta">Preta</SelectItem>
                        <SelectItem value="parda">Parda</SelectItem>
                        <SelectItem value="amarela">Amarela</SelectItem>
                        <SelectItem value="indigena">Indígena</SelectItem>
                        <SelectItem value="nao-declarado">Não declarado</SelectItem>
                      </SelectContent>
                    </Select>
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
                <CardTitle>📄 Informações da CTPS</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ctpsNumero">Número CTPS</Label>
                  <Input
                    id="ctpsNumero"
                    value={formData.ctpsNumero}
                    onChange={(e) => handleInputChange("ctpsNumero", e.target.value)}
                    placeholder="000000000"
                  />
                </div>
                <div>
                  <Label htmlFor="ctpsSerie">Série CTPS</Label>
                  <Input
                    id="ctpsSerie"
                    value={formData.ctpsSerie}
                    onChange={(e) => handleInputChange("ctpsSerie", e.target.value)}
                    placeholder="0000"
                  />
                </div>
                <div>
                  <Label htmlFor="ctpsEstado">Estado CTPS</Label>
                  <Input
                    id="ctpsEstado"
                    value={formData.ctpsEstado}
                    onChange={(e) => handleInputChange("ctpsEstado", e.target.value)}
                    placeholder="SP"
                  />
                </div>
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
