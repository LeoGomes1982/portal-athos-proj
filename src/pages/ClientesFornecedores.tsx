
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Building, Plus, Eye, FileText, History, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClienteFornecedor {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  contato: string;
  email: string;
  telefone: string;
  tipo: 'cliente' | 'fornecedor';
  cidade: string;
  estado: string;
}

interface Documento {
  id: string;
  nome: string;
  arquivo: string;
}

interface HistoricoItem {
  id: string;
  data: string;
  texto: string;
}

export default function ClientesFornecedores() {
  const navigate = useNavigate();
  const [clientesFornecedores, setClientesFornecedores] = useState<ClienteFornecedor[]>([]);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalVisualizacaoAberto, setModalVisualizacaoAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<ClienteFornecedor | null>(null);
  const [modalPessoasAberto, setModalPessoasAberto] = useState(false);
  const [modalDocumentosAberto, setModalDocumentosAberto] = useState(false);
  const [modalContratosAberto, setModalContratosAberto] = useState(false);
  const [modalHistoricoAberto, setModalHistoricoAberto] = useState(false);
  const [novoHistoricoTexto, setNovoHistoricoTexto] = useState("");
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  
  const [formData, setFormData] = useState({
    nomeFantasia: '',
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    contato: '',
    email: '',
    telefone: '',
    tipo: '' as 'cliente' | 'fornecedor' | '',
    cidade: '',
    estado: ''
  });

  const clientes = clientesFornecedores.filter(item => item.tipo === 'cliente');
  const fornecedores = clientesFornecedores.filter(item => item.tipo === 'fornecedor');

  const handleSalvar = () => {
    if (formData.nomeFantasia && formData.tipo) {
      const novoItem: ClienteFornecedor = {
        id: Date.now().toString(),
        ...formData
      };
      setClientesFornecedores([...clientesFornecedores, novoItem]);
      setFormData({
        nomeFantasia: '',
        razaoSocial: '',
        cnpj: '',
        endereco: '',
        contato: '',
        email: '',
        telefone: '',
        tipo: '',
        cidade: '',
        estado: ''
      });
      setModalCadastroAberto(false);
    }
  };

  const handleVisualizar = (item: ClienteFornecedor) => {
    setItemSelecionado(item);
    setModalVisualizacaoAberto(true);
  };

  const adicionarHistorico = () => {
    if (novoHistoricoTexto.trim()) {
      const novoItem: HistoricoItem = {
        id: Date.now().toString(),
        data: new Date().toLocaleDateString('pt-BR'),
        texto: novoHistoricoTexto
      };
      setHistorico([...historico, novoItem]);
      setNovoHistoricoTexto("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Gestão de Clientes e Fornecedores
          </h1>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{clientes.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Fornecedores</CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{fornecedores.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Botão Cadastrar */}
        <div className="mb-6">
          <Dialog open={modalCadastroAberto} onOpenChange={setModalCadastroAberto}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus size={16} className="mr-2" />
                Cadastrar Novo Cliente/Fornecedor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Cliente/Fornecedor</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                  <Input
                    id="nomeFantasia"
                    value={formData.nomeFantasia}
                    onChange={(e) => setFormData({...formData, nomeFantasia: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="razaoSocial">Razão Social</Label>
                  <Input
                    id="razaoSocial"
                    value={formData.razaoSocial}
                    onChange={(e) => setFormData({...formData, razaoSocial: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="contato">Contato</Label>
                  <Input
                    id="contato"
                    value={formData.contato}
                    onChange={(e) => setFormData({...formData, contato: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value: 'cliente' | 'fornecedor') => setFormData({...formData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cliente">Cliente</SelectItem>
                      <SelectItem value="fornecedor">Fornecedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleSalvar} className="w-full">
                Salvar
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista */}
        <div className="space-y-4">
          {clientesFornecedores.map((item) => (
            <Card key={item.id} className={`border-l-4 ${item.tipo === 'cliente' ? 'border-l-blue-500' : 'border-l-green-500'}`}>
              <CardContent className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.tipo === 'cliente' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    {item.tipo === 'cliente' ? 
                      <Users className={`h-6 w-6 text-blue-600`} /> : 
                      <Building className={`h-6 w-6 text-green-600`} />
                    }
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.nomeFantasia}</h3>
                    <p className="text-sm text-gray-600">{item.razaoSocial}</p>
                    <Badge variant={item.tipo === 'cliente' ? 'default' : 'secondary'} className={item.tipo === 'cliente' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                      {item.tipo}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVisualizar(item)}
                >
                  <Eye size={16} className="mr-2" />
                  Visualizar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal de Visualização */}
        <Dialog open={modalVisualizacaoAberto} onOpenChange={setModalVisualizacaoAberto}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{itemSelecionado?.nomeFantasia}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div><strong>Razão Social:</strong> {itemSelecionado?.razaoSocial}</div>
              <div><strong>CNPJ:</strong> {itemSelecionado?.cnpj}</div>
              <div><strong>Endereço:</strong> {itemSelecionado?.endereco}</div>
              <div><strong>Contato:</strong> {itemSelecionado?.contato}</div>
              <div><strong>Email:</strong> {itemSelecionado?.email}</div>
              <div><strong>Telefone:</strong> {itemSelecionado?.telefone}</div>
              <div><strong>Cidade:</strong> {itemSelecionado?.cidade}</div>
              <div><strong>Estado:</strong> {itemSelecionado?.estado}</div>
            </div>
            
            {itemSelecionado?.tipo === 'cliente' ? (
              <div className="flex space-x-4 mt-6">
                <Button onClick={() => setModalPessoasAberto(true)} className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus size={16} className="mr-2" />
                  Pessoas
                </Button>
                <Button onClick={() => setModalDocumentosAberto(true)} className="bg-green-600 hover:bg-green-700">
                  <FileText size={16} className="mr-2" />
                  Documentos
                </Button>
                <Button onClick={() => setModalHistoricoAberto(true)} className="bg-gray-600 hover:bg-gray-700">
                  <History size={16} className="mr-2" />
                  Histórico
                </Button>
              </div>
            ) : (
              <div className="flex space-x-4 mt-6">
                <Button onClick={() => setModalContratosAberto(true)} className="bg-green-600 hover:bg-green-700">
                  <FileText size={16} className="mr-2" />
                  Contratos
                </Button>
                <Button onClick={() => setModalHistoricoAberto(true)} className="bg-gray-600 hover:bg-gray-700">
                  <History size={16} className="mr-2" />
                  Histórico
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal Pessoas */}
        <Dialog open={modalPessoasAberto} onOpenChange={setModalPessoasAberto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Funcionários Alocados</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-gray-600">Nenhum funcionário alocado ainda.</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Documentos */}
        <Dialog open={modalDocumentosAberto} onOpenChange={setModalDocumentosAberto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contratos e Propostas</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-gray-600">Nenhum documento encontrado.</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Contratos (Fornecedor) */}
        <Dialog open={modalContratosAberto} onOpenChange={setModalContratosAberto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contratos</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <Button variant="outline" className="w-full">
                <Plus size={16} className="mr-2" />
                Anexar Arquivo
              </Button>
              <div>
                <Label htmlFor="textoContrato">Texto do Contrato</Label>
                <Textarea id="textoContrato" placeholder="Digite o texto do contrato..." />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Histórico */}
        <Dialog open={modalHistoricoAberto} onOpenChange={setModalHistoricoAberto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Histórico</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex space-x-2">
                <Textarea
                  value={novoHistoricoTexto}
                  onChange={(e) => setNovoHistoricoTexto(e.target.value)}
                  placeholder="Digite o histórico..."
                  className="flex-1"
                />
                <Button onClick={adicionarHistorico}>
                  <Plus size={16} />
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {historico.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-3">
                      <div className="text-xs text-gray-500 mb-1">{item.data}</div>
                      <div className="text-sm">{item.texto}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
