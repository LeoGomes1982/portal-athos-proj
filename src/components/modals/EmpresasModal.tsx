
import React, { useState } from "react";
import { Building2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  sanitizeInput, 
  validateEmail, 
  validatePhone, 
  validateCNPJ, 
  validateCEP,
  generateSecureId
} from "@/utils/security";
import EmpresasList from "./empresa/EmpresasList";
import EmpresaForm from "./empresa/EmpresaForm";

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
  console.log("EmpresasModal rendered with isOpen:", isOpen);
  
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

  const handleLogoChange = (logo: string) => {
    setLogoPreview(logo);
    setFormData(prev => ({ ...prev, logo }));
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
    console.log("handleEdit called for empresa:", empresa.nome);
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
      console.log("Form state updated, showForm:", true);
    } catch (error) {
      console.error("Error in handleEdit:", error);
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

  const handleAddNew = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const handleClose = () => {
    console.log("handleClose called");
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
          <DialogDescription>
            Gerencie as empresas do grupo, cadastre novas empresas ou edite as existentes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!showForm ? (
            <EmpresasList
              empresas={empresas}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddNew={handleAddNew}
            />
          ) : (
            <EmpresaForm
              formData={formData}
              editingEmpresa={editingEmpresa}
              logoPreview={logoPreview}
              onInputChange={handleInputChange}
              onLogoChange={handleLogoChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmpresasModal;
