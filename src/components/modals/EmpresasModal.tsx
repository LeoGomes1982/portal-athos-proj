import React, { useState } from "react";
import { Building2, Upload, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  sanitizeInput, 
  validateEmail, 
  validatePhone, 
  validateCNPJ, 
  validateCEP,
  validateFileType,
  validateFileSize,
  sanitizeFileName,
  generateSecureId
} from "@/utils/security";

interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes: string;
  logo?: string;
  ativo: boolean;
}

interface EmpresasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmpresasModal = ({ isOpen, onClose }: EmpresasModalProps) => {
  const { toast } = useToast();
  const [empresas, setEmpresas] = useState<Empresa[]>([
    {
      id: "1",
      nome: "Grupo Athos - Matriz",
      cnpj: "12.345.678/0001-90",
      email: "matriz@grupoathos.com.br",
      telefone: "(11) 98765-4321",
      endereco: "Av. Paulista, 1000",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310-100",
      observacoes: "Empresa matriz do grupo",
      ativo: true
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: "",
    logo: ""
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      cnpj: "",
      email: "",
      telefone: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      observacoes: "",
      logo: ""
    });
    setLogoPreview("");
    setEditingEmpresa(null);
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const validateForm = (): boolean => {
    if (!formData.nome || !formData.cnpj || !formData.email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.telefone && !validatePhone(formData.telefone)) {
      toast({
        title: "Erro",
        description: "Formato de telefone inválido. Use: (00) 00000-0000",
        variant: "destructive",
      });
      return false;
    }

    if (!validateCNPJ(formData.cnpj)) {
      toast({
        title: "Erro",
        description: "Formato de CNPJ inválido. Use: 00.000.000/0000-00",
        variant: "destructive",
      });
      return false;
    }

    if (formData.cep && !validateCEP(formData.cep)) {
      toast({
        title: "Erro",
        description: "Formato de CEP inválido. Use: 00000-000",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSizeInMB = 5;

    if (!validateFileType(file, allowedTypes)) {
      toast({
        title: "Erro",
        description: "Tipo de arquivo inválido. Use: JPG, PNG, GIF ou WebP",
        variant: "destructive",
      });
      return;
    }

    if (!validateFileSize(file, maxSizeInMB)) {
      toast({
        title: "Erro",
        description: `Arquivo muito grande. Máximo permitido: ${maxSizeInMB}MB`,
        variant: "destructive",
      });
      return;
    }

    const sanitizedFileName = sanitizeFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      setFormData(prev => ({ ...prev, logo: result }));
    };
    
    reader.onerror = () => {
      toast({
        title: "Erro",
        description: "Erro ao processar o arquivo de imagem.",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingEmpresa) {
        setEmpresas(prev => prev.map(empresa => 
          empresa.id === editingEmpresa.id 
            ? { ...empresa, ...formData }
            : empresa
        ));
        toast({
          title: "Sucesso",
          description: "Empresa atualizada com sucesso!",
        });
      } else {
        const novaEmpresa: Empresa = {
          id: generateSecureId(),
          ...formData,
          ativo: true
        };
        setEmpresas(prev => [...prev, novaEmpresa]);
        toast({
          title: "Sucesso",
          description: "Empresa cadastrada com sucesso!",
        });
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar os dados da empresa.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (empresa: Empresa) => {
    try {
      setFormData({
        nome: empresa.nome,
        cnpj: empresa.cnpj,
        email: empresa.email,
        telefone: empresa.telefone,
        endereco: empresa.endereco,
        cidade: empresa.cidade,
        estado: empresa.estado,
        cep: empresa.cep,
        observacoes: empresa.observacoes,
        logo: empresa.logo || ""
      });
      setLogoPreview(empresa.logo || "");
      setEditingEmpresa(empresa);
      setShowForm(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da empresa.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    try {
      setEmpresas(prev => prev.filter(empresa => empresa.id !== id));
      toast({
        title: "Sucesso",
        description: "Empresa removida com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover empresa.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    resetForm();
    setShowForm(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="text-blue-600" size={24} />
            Gerenciar Empresas do Grupo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!showForm ? (
            <>
              {/* Header com botão adicionar */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Empresas Cadastradas</h3>
                <Button onClick={() => setShowForm(true)}>
                  <Building2 size={16} className="mr-2" />
                  Nova Empresa
                </Button>
              </div>

              {/* Lista de empresas */}
              <div className="space-y-4">
                {empresas.map((empresa) => (
                  <div key={empresa.id} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {empresa.logo ? (
                          <img 
                            src={empresa.logo} 
                            alt={`Logo ${empresa.nome}`}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Building2 className="text-white" size={24} />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-slate-800">{empresa.nome}</h4>
                          <p className="text-sm text-slate-600">CNPJ: {empresa.cnpj}</p>
                          <p className="text-sm text-slate-600">{empresa.email}</p>
                          <p className="text-sm text-slate-600">{empresa.telefone}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(empresa)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(empresa.id)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Formulário */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {editingEmpresa ? "Editar Empresa" : "Nova Empresa"}
                </h3>
                <Button 
                  variant="outline" 
                  onClick={() => { setShowForm(false); resetForm(); }}
                >
                  <X size={16} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload de Logo */}
                <div className="md:col-span-2">
                  <Label>Logo da Empresa</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Preview do logo"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center">
                        <Upload size={24} className="text-slate-400" />
                      </div>
                    )}
                    <div>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleLogoUpload}
                        className="w-full"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Formatos aceitos: JPG, PNG, GIF, WebP (máx. 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Campos do formulário */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nome">Nome da Empresa *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      placeholder="Digite o nome da empresa"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange("cnpj", e.target.value)}
                      placeholder="00.000.000/0000-00"
                      required
                      maxLength={18}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="empresa@exemplo.com"
                      required
                      maxLength={254}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange("telefone", e.target.value)}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange("endereco", e.target.value)}
                      placeholder="Rua, Avenida, número"
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange("cidade", e.target.value)}
                      placeholder="Nome da cidade"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => handleInputChange("estado", e.target.value)}
                      placeholder="UF"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleInputChange("cep", e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => handleInputChange("observacoes", e.target.value)}
                      placeholder="Informações adicionais sobre a empresa"
                      rows={3}
                      maxLength={500}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => { setShowForm(false); resetForm(); }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingEmpresa ? "Atualizar" : "Cadastrar"} Empresa
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmpresasModal;
