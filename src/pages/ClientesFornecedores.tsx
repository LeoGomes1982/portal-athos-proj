import React, { useState } from "react";
import { 
  Building2, 
  ArrowLeft, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface ClienteFornecedor {
  id: string;
  nome: string;
  tipo: 'cliente' | 'fornecedor' | 'ambos';
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes: string;
  ativo: boolean;
}

const ClientesFornecedores = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'clientes' | 'fornecedores' | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClienteFornecedor | null>(null);
  const [viewingItem, setViewingItem] = useState<ClienteFornecedor | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "cliente" as 'cliente' | 'fornecedor' | 'ambos',
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: ""
  });

  const [clientesFornecedores, setClientesFornecedores] = useState<ClienteFornecedor[]>([
    {
      id: "1",
      nome: "Empresa ABC Ltda",
      tipo: "cliente",
      cnpj: "12.345.678/0001-90",
      email: "contato@empresaabc.com.br",
      telefone: "(11) 98765-4321",
      endereco: "Rua das Flores, 123",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      observacoes: "Cliente preferencial",
      ativo: true
    },
    {
      id: "2",
      nome: "Fornecedor XYZ S.A.",
      tipo: "fornecedor",
      cnpj: "98.765.432/0001-10",
      email: "vendas@fornecedorxyz.com.br",
      telefone: "(11) 91234-5678",
      endereco: "Av. Industrial, 456",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04567-890",
      observacoes: "Fornecedor de materiais de escritório",
      ativo: true
    }
  ]);

  const filteredItems = clientesFornecedores.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.cnpj.includes(searchTerm);
    
    if (activeTab === 'todos') return matchesSearch;
    if (activeTab === 'clientes') return matchesSearch && (item.tipo === 'cliente' || item.tipo === 'ambos');
    if (activeTab === 'fornecedores') return matchesSearch && (item.tipo === 'fornecedor' || item.tipo === 'ambos');
    
    return matchesSearch;
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      tipo: "cliente",
      cnpj: "",
      email: "",
      telefone: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      observacoes: ""
    });
    setEditingItem(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.nome || !formData.cnpj || !formData.email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (editingItem) {
      setClientesFornecedores(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
      toast({
        title: "Sucesso",
        description: "Cliente/Fornecedor atualizado com sucesso!",
      });
    } else {
      const novoItem: ClienteFornecedor = {
        id: Date.now().toString(),
        ...formData,
        ativo: true
      };
      setClientesFornecedores(prev => [...prev, novoItem]);
      toast({
        title: "Sucesso",
        description: "Cliente/Fornecedor cadastrado com sucesso!",
      });
    }

    resetForm();
    setIsModalOpen(false);
  };

  const editarItem = (item: ClienteFornecedor) => {
    setFormData({
      nome: item.nome,
      tipo: item.tipo,
      cnpj: item.cnpj,
      email: item.email,
      telefone: item.telefone,
      endereco: item.endereco,
      cidade: item.cidade,
      estado: item.estado,
      cep: item.cep,
      observacoes: item.observacoes
    });
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const visualizarItem = (item: ClienteFornecedor) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  const confirmarExclusao = (id: string) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const excluirItem = () => {
    if (itemToDelete) {
      setClientesFornecedores(prev => prev.filter(item => item.id !== itemToDelete));
      toast({
        title: "Sucesso",
        description: "Cliente/Fornecedor excluído com sucesso!",
      });
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const toggleStatus = (id: string) => {
    setClientesFornecedores(prev => prev.map(item => 
      item.id === id ? { ...item, ativo: !item.ativo } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/comercial")}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
            <span className="text-slate-700">Voltar</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Clientes e Fornecedores
          </h1>
          <p className="text-slate-600">
            Gerencie seus clientes e fornecedores
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            {[
              { key: 'todos', label: 'Todos' },
              { key: 'clientes', label: 'Clientes' },
              { key: 'fornecedores', label: 'Fornecedores' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Buscar por nome, email ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus size={20} className="mr-2" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={`bg-white rounded-lg border p-4 transition-all hover:shadow-md ${
                !item.ativo ? 'opacity-50 grayscale' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Building2 className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.nome}</h3>
                    <p className="text-sm text-slate-600">{item.email}</p>
                    <p className="text-xs text-slate-500">{item.telefone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`status-${item.id}`} className="text-sm">
                      {item.ativo ? 'Ativo' : 'Inativo'}
                    </Label>
                    <Switch
                      id={`status-${item.id}`}
                      checked={item.ativo}
                      onCheckedChange={() => toggleStatus(item.id)}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => visualizarItem(item)}
                  >
                    <Eye size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar' : 'Novo'} Cliente/Fornecedor
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Digite o nome"
                />
              </div>

              <div>
                <Label htmlFor="tipo">Tipo *</Label>
                <select
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) => handleInputChange("tipo", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="cliente">Cliente</option>
                  <option value="fornecedor">Fornecedor</option>
                  <option value="ambos">Ambos</option>
                </select>
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

              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@exemplo.com"
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
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleInputChange("cep", e.target.value)}
                  placeholder="00000-000"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange("endereco", e.target.value)}
                  placeholder="Rua, Avenida, número"
                />
              </div>

              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange("cidade", e.target.value)}
                  placeholder="Nome da cidade"
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => handleInputChange("estado", e.target.value)}
                  placeholder="UF"
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

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {editingItem ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Cliente/Fornecedor</DialogTitle>
            </DialogHeader>

            {viewingItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Nome:</Label>
                    <p className="text-slate-700">{viewingItem.nome}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Tipo:</Label>
                    <p className="text-slate-700 capitalize">{viewingItem.tipo}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">CNPJ:</Label>
                    <p className="text-slate-700">{viewingItem.cnpj}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">E-mail:</Label>
                    <p className="text-slate-700">{viewingItem.email}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Telefone:</Label>
                    <p className="text-slate-700">{viewingItem.telefone}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">CEP:</Label>
                    <p className="text-slate-700">{viewingItem.cep}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="font-semibold">Endereço:</Label>
                    <p className="text-slate-700">{viewingItem.endereco}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Cidade:</Label>
                    <p className="text-slate-700">{viewingItem.cidade}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Estado:</Label>
                    <p className="text-slate-700">{viewingItem.estado}</p>
                  </div>
                  {viewingItem.observacoes && (
                    <div className="col-span-2">
                      <Label className="font-semibold">Observações:</Label>
                      <p className="text-slate-700">{viewingItem.observacoes}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      editarItem(viewingItem);
                    }}
                  >
                    <Edit size={16} className="mr-2" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      confirmarExclusao(viewingItem.id);
                    }}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este cliente/fornecedor? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={excluirItem}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ClientesFornecedores;
