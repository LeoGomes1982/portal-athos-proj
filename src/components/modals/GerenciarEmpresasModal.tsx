
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  observacoes: string;
}

interface GerenciarEmpresasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GerenciarEmpresasModal = ({ isOpen, onClose }: GerenciarEmpresasModalProps) => {
  const { toast } = useToast();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    observacoes: ""
  });

  // Carregar empresas do localStorage na inicialização
  useEffect(() => {
    const empresasSalvas = localStorage.getItem('empresas');
    if (empresasSalvas) {
      try {
        const parsedEmpresas = JSON.parse(empresasSalvas);
        setEmpresas(parsedEmpresas);
        console.log('Empresas carregadas:', parsedEmpresas);
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        // Se houver erro, criar dados iniciais
        const empresasIniciais = criarEmpresasIniciais();
        setEmpresas(empresasIniciais);
        localStorage.setItem('empresas', JSON.stringify(empresasIniciais));
      }
    } else {
      // Dados iniciais se não houver dados salvos
      const empresasIniciais = criarEmpresasIniciais();
      setEmpresas(empresasIniciais);
      localStorage.setItem('empresas', JSON.stringify(empresasIniciais));
    }
  }, []);

  // Função para criar empresas iniciais
  const criarEmpresasIniciais = (): Empresa[] => {
    return [
      {
        id: "1",
        nome: "Minha Empresa Ltda",
        cnpj: "12.345.678/0001-90",
        endereco: "Rua Principal, 123",
        telefone: "(11) 99999-9999",
        email: "contato@minhaempresa.com.br",
        observacoes: "Empresa principal"
      }
    ];
  };

  // Salvar empresas no localStorage
  const salvarEmpresas = (novasEmpresas: Empresa[]) => {
    try {
      localStorage.setItem('empresas', JSON.stringify(novasEmpresas));
      setEmpresas(novasEmpresas);
      console.log('Empresas salvas:', novasEmpresas);
    } catch (error) {
      console.error('Erro ao salvar empresas:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      cnpj: "",
      endereco: "",
      telefone: "",
      email: "",
      observacoes: ""
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.nome || !formData.cnpj || !formData.email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios (Nome, CNPJ e E-mail).",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      // Editar empresa existente
      const novasEmpresas = empresas.map(empresa => 
        empresa.id === editingId 
          ? { ...empresa, ...formData }
          : empresa
      );
      salvarEmpresas(novasEmpresas);
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso!",
      });
    } else {
      // Adicionar nova empresa
      const novaEmpresa: Empresa = {
        id: Date.now().toString(),
        ...formData
      };
      const novasEmpresas = [...empresas, novaEmpresa];
      salvarEmpresas(novasEmpresas);
      toast({
        title: "Sucesso",
        description: "Empresa adicionada com sucesso!",
      });
    }

    resetForm();
  };

  const handleEdit = (empresa: Empresa) => {
    setFormData({
      nome: empresa.nome,
      cnpj: empresa.cnpj,
      endereco: empresa.endereco,
      telefone: empresa.telefone,
      email: empresa.email,
      observacoes: empresa.observacoes
    });
    setEditingId(empresa.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta empresa?")) {
      const novasEmpresas = empresas.filter(empresa => empresa.id !== id);
      salvarEmpresas(novasEmpresas);
      toast({
        title: "Sucesso",
        description: "Empresa excluída com sucesso!",
      });
    }
  };

  const startNew = () => {
    resetForm();
    setIsEditing(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Gerenciar Empresas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Empresas Cadastradas</h3>
            <Button onClick={startNew}>
              <Plus size={16} className="mr-2" />
              Nova Empresa
            </Button>
          </div>

          {isEditing && (
            <div className="bg-slate-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">
                  {editingId ? 'Editar Empresa' : 'Nova Empresa'}
                </h4>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  <X size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome da Empresa *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Digite o nome da empresa"
                  />
                </div>

                <div>
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange("cnpj", e.target.value)}
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange("endereco", e.target.value)}
                    placeholder="Endereço completo"
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@empresa.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    placeholder="Informações adicionais"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save size={16} className="mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {empresas.map((empresa) => (
              <div key={empresa.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Building2 className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{empresa.nome}</h4>
                      <p className="text-sm text-slate-600">CNPJ: {empresa.cnpj}</p>
                      <p className="text-sm text-slate-600">{empresa.email}</p>
                      {empresa.telefone && <p className="text-sm text-slate-500">{empresa.telefone}</p>}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(empresa)}
                    >
                      <Edit size={16} className="mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(empresa.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {empresas.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Building2 size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma empresa cadastrada</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GerenciarEmpresasModal;
