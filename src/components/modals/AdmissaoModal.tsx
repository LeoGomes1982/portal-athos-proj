
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  
  // Informações Pessoais
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  estadoCivil: string;
  nacionalidade: string;
  foto: File | null;
  
  // Informações de Contato
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  cep: string;
  estado: string;
  
  // Dependentes
  dependentes: Array<{
    nome: string;
    parentesco: string;
    dataNascimento: string;
    cpf: string;
  }>;
}

export function AdmissaoModal({ isOpen, onClose }: AdmissaoModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profissional");
  const [formData, setFormData] = useState<FormData>({
    cargo: "",
    setor: "",
    salario: "",
    dataAdmissao: "",
    tipoContrato: "",
    nome: "",
    cpf: "",
    rg: "",
    dataNascimento: "",
    estadoCivil: "",
    nacionalidade: "Brasileiro",
    foto: null,
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    cep: "",
    estado: "",
    dependentes: []
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, foto: file }));
    }
  };

  const addDependente = () => {
    setFormData(prev => ({
      ...prev,
      dependentes: [...prev.dependentes, { nome: "", parentesco: "", dataNascimento: "", cpf: "" }]
    }));
  };

  const removeDependente = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dependentes: prev.dependentes.filter((_, i) => i !== index)
    }));
  };

  const updateDependente = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dependentes: prev.dependentes.map((dep, i) => 
        i === index ? { ...dep, [field]: value } : dep
      )
    }));
  };

  const handleSubmit = () => {
    // Validação básica
    if (!formData.nome || !formData.cpf || !formData.cargo) {
      toast({
        title: "Erro ❌",
        description: "Preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Aqui você salvaria os dados
    toast({
      title: "Sucesso! 🎉",
      description: `Funcionário ${formData.nome} foi admitido com sucesso!`,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            👋 Nova Admissão
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="profissional" className="flex items-center gap-2">
              💼 Profissional
            </TabsTrigger>
            <TabsTrigger value="pessoal" className="flex items-center gap-2">
              👤 Pessoal
            </TabsTrigger>
            <TabsTrigger value="contato" className="flex items-center gap-2">
              📞 Contato
            </TabsTrigger>
            <TabsTrigger value="dependentes" className="flex items-center gap-2">
              👨‍👩‍👧‍👦 Dependentes
            </TabsTrigger>
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
                  <Select onValueChange={(value) => handleInputChange("setor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rh">RH</SelectItem>
                      <SelectItem value="ti">TI</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="operacoes">Operações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salario">Salário</Label>
                  <Input
                    id="salario"
                    value={formData.salario}
                    onChange={(e) => handleInputChange("salario", e.target.value)}
                    placeholder="R$ 0,00"
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
                <div className="md:col-span-2">
                  <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
                  <Select onValueChange={(value) => handleInputChange("tipoContrato", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clt">CLT</SelectItem>
                      <SelectItem value="pj">PJ</SelectItem>
                      <SelectItem value="estagio">Estágio</SelectItem>
                      <SelectItem value="temporario">Temporário</SelectItem>
                    </SelectContent>
                  </Select>
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
                      placeholder="Nome completo do funcionário"
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="foto">Foto do Funcionário 📸</Label>
                  <Input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos aceitos: JPG, PNG, GIF (máx. 5MB)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contato" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📞 Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="funcionario@empresa.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Textarea
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange("endereco", e.target.value)}
                    placeholder="Rua, número, complemento, bairro"
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
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => handleInputChange("cep", e.target.value)}
                    placeholder="00000-000"
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
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            ✅ Finalizar Admissão
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
