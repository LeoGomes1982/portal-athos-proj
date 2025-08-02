import React, { useState, useEffect } from "react";
import { ArrowLeft, Users, Building, FileText, Clock, Edit, Trash2, Save, Plus, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PessoasModal from "@/components/modals/PessoasModal";
import { NovoDocumentoModal } from "@/components/modals/DocumentosModal";
import HistoricoModal from "@/components/modals/HistoricoModal";

interface ClienteFornecedor {
  id: string;
  nome: string;
  tipo: "cliente" | "fornecedor";
  email: string;
  telefone: string;
  telefoneSecundario?: string;
  endereco: string;
  cnpj: string;
  representante: string;
  observacoes: string;
}

const ClientesFornecedores = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNovoClienteOpen, setIsNovoClienteOpen] = useState(false);
  const [isNovoFornecedorOpen, setIsNovoFornecedorOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClienteFornecedor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPessoasModalOpen, setIsPessoasModalOpen] = useState(false);
  const [isHistoricoModalOpen, setIsHistoricoModalOpen] = useState(false);
  const [isDocumentosModalOpen, setIsDocumentosModalOpen] = useState(false);
  
  const [clients, setClients] = useState<ClienteFornecedor[]>([]);
  const [editForm, setEditForm] = useState({
    nome: "",
    tipo: "cliente" as "cliente" | "fornecedor",
    email: "",
    telefone: "",
    telefoneSecundario: "",
    endereco: "",
    cnpj: "",
    representante: "",
    observacoes: ""
  });

  const [novoForm, setNovoForm] = useState({
    nome: "",
    tipo: "cliente" as "cliente" | "fornecedor",
    email: "",
    telefone: "",
    telefoneSecundario: "",
    endereco: "",
    cnpj: "",
    representante: "",
    observacoes: ""
  });

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedClients = localStorage.getItem('clientesFornecedores');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      // Dados iniciais se não houver dados salvos
      const initialClients: ClienteFornecedor[] = [
        {
          id: "1",
          nome: "Tech Solutions Ltda",
          tipo: "cliente",
          email: "contato@techsolutions.com",
          telefone: "(11) 9999-9999",
          telefoneSecundario: "(11) 3333-3333",
          endereco: "Av. Paulista, 1000",
          cnpj: "12.345.678/0001-90",
          representante: "João Silva",
          observacoes: "Cliente premium"
        },
        {
          id: "2",
          nome: "Fornecedor ABC",
          tipo: "fornecedor",
          email: "vendas@fornecedorabc.com",
          telefone: "(11) 8888-8888",
          endereco: "Rua das Empresas, 200",
          cnpj: "98.765.432/0001-10",
          representante: "Maria Santos",
          observacoes: "Fornecedor confiável"
        }
      ];
      setClients(initialClients);
      localStorage.setItem('clientesFornecedores', JSON.stringify(initialClients));
    }
  }, []);

  // Salvar no localStorage sempre que clients mudar
  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem('clientesFornecedores', JSON.stringify(clients));
    }
  }, [clients]);

  const totalClientes = clients.filter(c => c.tipo === 'cliente').length;
  const totalFornecedores = clients.filter(c => c.tipo === 'fornecedor').length;

  const filteredClients = clients.filter(client => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      client.nome.toLowerCase().includes(searchTermLower) ||
      client.email.toLowerCase().includes(searchTermLower) ||
      client.cnpj.toLowerCase().includes(searchTermLower) ||
      client.representante.toLowerCase().includes(searchTermLower);

    if (filterType === "todos") {
      return matchesSearch;
    } else {
      return client.tipo === filterType && matchesSearch;
    }
  });

  const handleView = (client: ClienteFornecedor) => {
    setSelectedClient(client);
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleEdit = (client: ClienteFornecedor) => {
    setSelectedClient(client);
    setEditForm({
      nome: client.nome,
      tipo: client.tipo,
      email: client.email,
      telefone: client.telefone,
      telefoneSecundario: client.telefoneSecundario || "",
      endereco: client.endereco,
      cnpj: client.cnpj,
      representante: client.representante,
      observacoes: client.observacoes
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedClient) return;

    const updatedClients = clients.map(client =>
      client.id === selectedClient.id
        ? { ...client, ...editForm }
        : client
    );

    setClients(updatedClients);
    setIsEditing(false);
    
    toast({
      title: "Sucesso",
      description: "Cliente atualizado com sucesso!",
    });
  };

  const handleDelete = (client: ClienteFornecedor) => {
    if (confirm(`Tem certeza que deseja excluir ${client.nome}?`)) {
      const updatedClients = clients.filter(c => c.id !== client.id);
      setClients(updatedClients);
      localStorage.setItem('clientesFornecedores', JSON.stringify(updatedClients));
      setIsModalOpen(false);
      setSelectedClient(null);
      
      toast({
        title: "Sucesso",
        description: "Cliente excluído com sucesso!",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNovoInputChange = (field: string, value: string) => {
    setNovoForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNovoCliente = () => {
    setNovoForm({
      nome: "",
      tipo: "cliente",
      email: "",
      telefone: "",
      telefoneSecundario: "",
      endereco: "",
      cnpj: "",
      representante: "",
      observacoes: ""
    });
    setIsNovoClienteOpen(true);
  };

  const handleNovoFornecedor = () => {
    setNovoForm({
      nome: "",
      tipo: "fornecedor",
      email: "",
      telefone: "",
      telefoneSecundario: "",
      endereco: "",
      cnpj: "",
      representante: "",
      observacoes: ""
    });
    setIsNovoFornecedorOpen(true);
  };

  const handleSalvarNovo = () => {
    if (!novoForm.nome || !novoForm.email || !novoForm.cnpj || !novoForm.representante) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const novoCliente: ClienteFornecedor = {
      id: Date.now().toString(),
      ...novoForm
    };

    const updatedClients = [...clients, novoCliente];
    setClients(updatedClients);
    localStorage.setItem('clientesFornecedores', JSON.stringify(updatedClients));

    toast({
      title: "Sucesso",
      description: `${novoForm.tipo === 'cliente' ? 'Cliente' : 'Fornecedor'} adicionado com sucesso!`,
    });

    setIsNovoClienteOpen(false);
    setIsNovoFornecedorOpen(false);
    setNovoForm({
      nome: "",
      tipo: "cliente",
      email: "",
      telefone: "",
      telefoneSecundario: "",
      endereco: "",
      cnpj: "",
      representante: "",
      observacoes: ""
    });
  };

  // Função corrigida para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    setIsEditing(false);
    // Limpar o formulário apenas se não estiver editando
    if (!isEditing) {
      setEditForm({
        nome: "",
        tipo: "cliente",
        email: "",
        telefone: "",
        telefoneSecundario: "",
        endereco: "",
        cnpj: "",
        representante: "",
        observacoes: ""
      });
    }
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Restaurar dados originais
    if (selectedClient) {
      setEditForm({
        nome: selectedClient.nome,
        tipo: selectedClient.tipo,
        email: selectedClient.email,
        telefone: selectedClient.telefone,
        telefoneSecundario: selectedClient.telefoneSecundario || "",
        endereco: selectedClient.endereco,
        cnpj: selectedClient.cnpj,
        representante: selectedClient.representante,
        observacoes: selectedClient.observacoes
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="content-wrapper animate-fade-in bg-orange-100/80 rounded-lg shadow-lg m-6 p-8">
        {/* Navigation Button */}
        <div className="navigation-button">
          <button 
            onClick={() => navigate("/comercial")}
            className="back-button"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Users size={32} className="text-white" />
          </div>
          <div>
            <h1 className="page-title mb-0">Clientes e Fornecedores</h1>
            <p className="text-description">Gestão completa de clientes e fornecedores da empresa</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-slide-up">
          <div className="modern-card bg-white border-gray-200">
            <div className="card-content text-center p-4">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-gray-700">
                {totalClientes}
              </div>
              <div className="text-sm text-gray-600 mb-1">Total de Clientes</div>
              <div className="text-xs text-gray-500 font-medium">
                Registros ativos
              </div>
            </div>
          </div>

          <div className="modern-card bg-white border-gray-200">
            <div className="card-content text-center p-4">
              <div className="text-3xl mb-2">🏢</div>
              <div className="text-2xl font-bold text-gray-700">
                {totalFornecedores}
              </div>
              <div className="text-sm text-gray-600 mb-1">Total de Fornecedores</div>
              <div className="text-xs text-gray-500 font-medium">
                Registros ativos
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <Button
            onClick={handleNovoCliente}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-12"
          >
            <Plus size={20} />
            Novo Cliente
          </Button>
          <Button
            onClick={handleNovoFornecedor}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-12"
          >
            <Plus size={20} />
            Novo Fornecedor
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Input
              type="search"
              placeholder="Buscar por nome, email, CNPJ ou representante..."
              className="w-full md:max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setFilterType("todos")}
                variant={filterType === "todos" ? "default" : "outline"}
                size="sm"
              >
                Todos
              </Button>
              <Button
                onClick={() => setFilterType("cliente")}
                variant={filterType === "cliente" ? "default" : "outline"}
                size="sm"
              >
                Clientes
              </Button>
              <Button
                onClick={() => setFilterType("fornecedor")}
                variant={filterType === "fornecedor" ? "default" : "outline"}
                size="sm"
              >
                Fornecedores
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de Clientes e Fornecedores */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Clientes e Fornecedores</h2>
          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-orange-200 cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleView(client)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        client.tipo === 'cliente' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {client.tipo === 'cliente' ? 'Cliente' : 'Fornecedor'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {client.nome}
                    </h3>
                    <p className="text-slate-600 mb-1">Representante: {client.representante}</p>
                    <p className="text-slate-600 mb-1">{client.email}</p>
                    <p className="text-sm text-slate-500">
                      {client.telefone} • CNPJ: {client.cnpj}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-16">
            <Users size={64} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-slate-500">
              Tente ajustar os filtros ou termos de busca
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-slate-500">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modal de Visualização/Edição - MODAL MAIOR (25% maior) */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) {
          handleCloseModal();
        }
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 text-lg">
                {selectedClient?.tipo === "cliente" ? <Users className="h-5 w-5" /> : <Building className="h-5 w-5" />}
                {isEditing ? "Editar" : "Visualizar"} {selectedClient?.tipo === "cliente" ? "Cliente" : "Fornecedor"}
              </div>
              <div className="text-2xl font-bold text-orange-600 border-l-4 border-orange-500 pl-4">
                {selectedClient?.nome}
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  {isEditing ? (
                    <Input
                      id="nome"
                      value={editForm.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                    />
                  ) : (
                    <p className="text-slate-700 font-medium">{selectedClient.nome}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  {isEditing ? (
                    <Select value={editForm.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cliente">Cliente</SelectItem>
                        <SelectItem value="fornecedor">Fornecedor</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-slate-700 font-medium capitalize">{selectedClient.tipo}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="representante">Representante</Label>
                  {isEditing ? (
                    <Input
                      id="representante"
                      value={editForm.representante}
                      onChange={(e) => handleInputChange("representante", e.target.value)}
                    />
                  ) : (
                    <p className="text-slate-700">{selectedClient.representante}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  ) : (
                    <p className="text-slate-700">{selectedClient.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  {isEditing ? (
                    <Input
                      id="telefone"
                      value={editForm.telefone}
                      onChange={(e) => handleInputChange("telefone", e.target.value)}
                    />
                  ) : (
                    <p className="text-slate-700">{selectedClient.telefone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefoneSecundario">Telefone Secundário</Label>
                  {isEditing ? (
                    <Input
                      id="telefoneSecundario"
                      value={editForm.telefoneSecundario}
                      onChange={(e) => handleInputChange("telefoneSecundario", e.target.value)}
                    />
                  ) : (
                    <p className="text-slate-700">{selectedClient.telefoneSecundario || "Não informado"}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  {isEditing ? (
                    <Input
                      id="endereco"
                      value={editForm.endereco}
                      onChange={(e) => handleInputChange("endereco", e.target.value)}
                    />
                  ) : (
                    <p className="text-slate-700">{selectedClient.endereco}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  {isEditing ? (
                    <Input
                      id="cnpj"
                      value={editForm.cnpj}
                      onChange={(e) => handleInputChange("cnpj", e.target.value)}
                    />
                  ) : (
                    <p className="text-slate-700">{selectedClient.cnpj}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  {isEditing ? (
                    <Textarea
                      id="observacoes"
                      value={editForm.observacoes}
                      onChange={(e) => handleInputChange("observacoes", e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <p className="text-slate-700">{selectedClient.observacoes}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                {!isEditing ? (
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => setIsPessoasModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Users size={16} className="mr-2" />
                      Pessoas
                    </Button>
                    <Button
                      onClick={() => setIsDocumentosModalOpen(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <FileText size={16} className="mr-2" />
                      Documentos
                    </Button>
                    <Button
                      onClick={() => setIsHistoricoModalOpen(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Clock size={16} className="mr-2" />
                      Histórico
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save size={16} className="mr-2" />
                      Salvar
                    </Button>
                  </div>
                )}

                {!isEditing && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(selectedClient)}
                    >
                      <Edit size={16} className="mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(selectedClient)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Excluir
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Novo Cliente */}
      <Dialog open={isNovoClienteOpen} onOpenChange={setIsNovoClienteOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Novo Cliente
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="novo-nome">Nome *</Label>
                <Input
                  id="novo-nome"
                  value={novoForm.nome}
                  onChange={(e) => handleNovoInputChange("nome", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="novo-representante">Representante *</Label>
                <Input
                  id="novo-representante"
                  value={novoForm.representante}
                  onChange={(e) => handleNovoInputChange("representante", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="novo-email">E-mail *</Label>
                <Input
                  id="novo-email"
                  type="email"
                  value={novoForm.email}
                  onChange={(e) => handleNovoInputChange("email", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="novo-telefone">Telefone *</Label>
                <Input
                  id="novo-telefone"
                  value={novoForm.telefone}
                  onChange={(e) => handleNovoInputChange("telefone", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="novo-telefoneSecundario">Telefone Secundário</Label>
                <Input
                  id="novo-telefoneSecundario"
                  value={novoForm.telefoneSecundario}
                  onChange={(e) => handleNovoInputChange("telefoneSecundario", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="novo-cnpj">CNPJ *</Label>
                <Input
                  id="novo-cnpj"
                  value={novoForm.cnpj}
                  onChange={(e) => handleNovoInputChange("cnpj", e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="novo-endereco">Endereço</Label>
                <Input
                  id="novo-endereco"
                  value={novoForm.endereco}
                  onChange={(e) => handleNovoInputChange("endereco", e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="novo-observacoes">Observações</Label>
                <Textarea
                  id="novo-observacoes"
                  value={novoForm.observacoes}
                  onChange={(e) => handleNovoInputChange("observacoes", e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsNovoClienteOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSalvarNovo}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                Salvar Cliente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Novo Fornecedor */}
      <Dialog open={isNovoFornecedorOpen} onOpenChange={setIsNovoFornecedorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Novo Fornecedor
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="novo-nome-fornecedor">Nome *</Label>
                <Input
                  id="novo-nome-fornecedor"
                  value={novoForm.nome}
                  onChange={(e) => handleNovoInputChange("nome", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="novo-representante-fornecedor">Representante *</Label>
                <Input
                  id="novo-representante-fornecedor"
                  value={novoForm.representante}
                  onChange={(e) => handleNovoInputChange("representante", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="novo-email-fornecedor">E-mail *</Label>
                <Input
                  id="novo-email-fornecedor"
                  type="email"
                  value={novoForm.email}
                  onChange={(e) => handleNovoInputChange("email", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="novo-telefone-fornecedor">Telefone *</Label>
                <Input
                  id="novo-telefone-fornecedor"
                  value={novoForm.telefone}
                  onChange={(e) => handleNovoInputChange("telefone", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="novo-telefoneSecundario-fornecedor">Telefone Secundário</Label>
                <Input
                  id="novo-telefoneSecundario-fornecedor"
                  value={novoForm.telefoneSecundario}
                  onChange={(e) => handleNovoInputChange("telefoneSecundario", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="novo-cnpj-fornecedor">CNPJ *</Label>
                <Input
                  id="novo-cnpj-fornecedor"
                  value={novoForm.cnpj}
                  onChange={(e) => handleNovoInputChange("cnpj", e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="novo-endereco-fornecedor">Endereço</Label>
                <Input
                  id="novo-endereco-fornecedor"
                  value={novoForm.endereco}
                  onChange={(e) => handleNovoInputChange("endereco", e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="novo-observacoes-fornecedor">Observações</Label>
                <Textarea
                  id="novo-observacoes-fornecedor"
                  value={novoForm.observacoes}
                  onChange={(e) => handleNovoInputChange("observacoes", e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsNovoFornecedorOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSalvarNovo}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                Salvar Fornecedor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modais adicionais */}
      {selectedClient && (
        <>
          <PessoasModal
            isOpen={isPessoasModalOpen}
            onClose={() => setIsPessoasModalOpen(false)}
            clienteNome={selectedClient.nome}
            clienteId={selectedClient.id}
          />
          <NovoDocumentoModal
            isOpen={isDocumentosModalOpen}
            onClose={() => setIsDocumentosModalOpen(false)}
            onSubmit={(documento) => {
              console.log('Documento adicionado:', documento);
              setIsDocumentosModalOpen(false);
            }}
          />
          <HistoricoModal
            isOpen={isHistoricoModalOpen}
            onClose={() => setIsHistoricoModalOpen(false)}
            clienteNome={selectedClient.nome}
            clienteId={selectedClient.id}
          />
        </>
      )}
    </div>
  );
};

export default ClientesFornecedores;
