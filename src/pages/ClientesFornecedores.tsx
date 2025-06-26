
import React, { useState, useEffect } from "react";
import { ArrowLeft, Users, Building, FileText, Clock, Edit, Trash2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PessoasModal from "@/components/modals/PessoasModal";
import DocumentosModal from "@/components/modals/DocumentosModal";
import HistoricoModal from "@/components/modals/HistoricoModal";

interface ClienteFornecedor {
  id: string;
  nome: string;
  tipo: "cliente" | "fornecedor";
  email: string;
  telefone: string;
  endereco: string;
  cnpj: string;
  observacoes: string;
}

const ClientesFornecedores = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    endereco: "",
    cnpj: "",
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
          endereco: "Av. Paulista, 1000",
          cnpj: "12.345.678/0001-90",
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

  const navigate = useNavigate();

  const filteredClients = clients.filter(client => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      client.nome.toLowerCase().includes(searchTermLower) ||
      client.email.toLowerCase().includes(searchTermLower) ||
      client.cnpj.toLowerCase().includes(searchTermLower);

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
      endereco: client.endereco,
      cnpj: client.cnpj,
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
      
      toast({
        title: "Sucesso",
        description: "Cliente excluído com sucesso!",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const resetAndClose = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    setIsEditing(false);
    setEditForm({
      nome: "",
      tipo: "cliente",
      email: "",
      telefone: "",
      endereco: "",
      cnpj: "",
      observacoes: ""
    });
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/comercial")}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
            <Users size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">
            Clientes e Fornecedores
          </h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Gestão completa de clientes e fornecedores da empresa
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Input
              type="search"
              placeholder="Buscar por nome, email ou CNPJ..."
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
              <Button onClick={() => alert("Funcionalidade em breve!")}>
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="modern-card group relative p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-150"
              onClick={() => handleView(client)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-sm">
                  {client.tipo === "cliente" ? (
                    <Users size={20} />
                  ) : (
                    <Building size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="subsection-title text-left">{client.nome}</h3>
                  <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded-full capitalize">
                    {client.tipo}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-description">{client.email}</p>
                <p className="text-description">{client.telefone}</p>
                <p className="text-description">{client.cnpj}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <Users size={64} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-description">
              Tente ajustar os filtros ou termos de busca
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modal de Visualização/Edição */}
      <Dialog open={isModalOpen} onOpenChange={resetAndClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedClient?.tipo === "cliente" ? <Users className="h-5 w-5" /> : <Building className="h-5 w-5" />}
              {isEditing ? "Editar" : "Visualizar"} {selectedClient?.tipo === "cliente" ? "Cliente" : "Fornecedor"}
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
                    <select
                      id="tipo"
                      value={editForm.tipo}
                      onChange={(e) => handleInputChange("tipo", e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-md"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="fornecedor">Fornecedor</option>
                    </select>
                  ) : (
                    <p className="text-slate-700 font-medium capitalize">{selectedClient.tipo}</p>
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
                      onClick={() => setIsEditing(false)}
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

      {/* Modais adicionais */}
      {selectedClient && (
        <>
          <PessoasModal
            isOpen={isPessoasModalOpen}
            onClose={() => setIsPessoasModalOpen(false)}
            clienteNome={selectedClient.nome}
            clienteId={selectedClient.id}
          />
          <DocumentosModal
            isOpen={isDocumentosModalOpen}
            onClose={() => setIsDocumentosModalOpen(false)}
            clienteNome={selectedClient.nome}
            clienteId={selectedClient.id}
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
