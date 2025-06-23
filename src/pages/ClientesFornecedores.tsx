import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Building, Plus, Eye, FileText, History, UserPlus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

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
  ativo: boolean;
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
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
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
    estado: '',
    ativo: true
  });

  const clientes = clientesFornecedores.filter(item => item.tipo === 'cliente');
  const fornecedores = clientesFornecedores.filter(item => item.tipo === 'fornecedor');

  // Função para ordenar itens - ativos primeiro, depois inativos
  const ordenarPorStatus = (items: ClienteFornecedor[]) => {
    return items.sort((a, b) => {
      if (a.ativo === b.ativo) return 0;
      return a.ativo ? -1 : 1;
    });
  };

  const handleSalvar = () => {
    if (formData.nomeFantasia && formData.tipo !== '') {
      const novoItem: ClienteFornecedor = {
        id: Date.now().toString(),
        nomeFantasia: formData.nomeFantasia,
        razaoSocial: formData.razaoSocial,
        cnpj: formData.cnpj,
        endereco: formData.endereco,
        contato: formData.contato,
        email: formData.email,
        telefone: formData.telefone,
        tipo: formData.tipo as 'cliente' | 'fornecedor',
        cidade: formData.cidade,
        estado: formData.estado,
        ativo: formData.ativo
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
        estado: '',
        ativo: true
      });
      setModalCadastroAberto(false);
    }
  };

  const handleVisualizar = (item: ClienteFornecedor) => {
    setItemSelecionado(item);
    setModalVisualizacaoAberto(true);
  };

  const handleEditar = (item: ClienteFornecedor) => {
    setItemSelecionado(item);
    setFormData({
      nomeFantasia: item.nomeFantasia,
      razaoSocial: item.razaoSocial,
      cnpj: item.cnpj,
      endereco: item.endereco,
      contato: item.contato,
      email: item.email,
      telefone: item.telefone,
      tipo: item.tipo,
      cidade: item.cidade,
      estado: item.estado,
      ativo: item.ativo
    });
    setModalVisualizacaoAberto(false);
    setModalEdicaoAberto(true);
  };

  const handleSalvarEdicao = () => {
    if (itemSelecionado && formData.nomeFantasia && formData.tipo !== '') {
      const clientesAtualizados = clientesFornecedores.map(item => 
        item.id === itemSelecionado.id 
          ? {
              ...item,
              nomeFantasia: formData.nomeFantasia,
              razaoSocial: formData.razaoSocial,
              cnpj: formData.cnpj,
              endereco: formData.endereco,
              contato: formData.contato,
              email: formData.email,
              telefone: formData.telefone,
              tipo: formData.tipo as 'cliente' | 'fornecedor',
              cidade: formData.cidade,
              estado: formData.estado,
              ativo: formData.ativo
            }
          : item
      );
      setClientesFornecedores(clientesAtualizados);
      setModalEdicaoAberto(false);
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
        estado: '',
        ativo: true
      });
    }
  };

  const handleExcluir = (id: string) => {
    const clientesAtualizados = clientesFornecedores.filter(item => item.id !== id);
    setClientesFornecedores(clientesAtualizados);
    setModalVisualizacaoAberto(false);
  };

  const toggleStatus = (id: string) => {
    const clientesAtualizados = clientesFornecedores.map(item => 
      item.id === id ? { ...item, ativo: !item.ativo } : item
    );
    setClientesFornecedores(clientesAtualizados);
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

  const itensOrdenados = ordenarPorStatus(clientesFornecedores);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-orange-100"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
            <Users size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Gestão de Clientes e Fornecedores
          </h1>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{clientes.length}</div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total de Fornecedores</CardTitle>
              <Building className="h-4 w-4 text-orange-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{fornecedores.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Botão Cadastrar */}
        <div className="mb-6">
          <Dialog open={modalCadastroAberto} onOpenChange={setModalCadastroAberto}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700 shadow-lg">
                <Plus size={16} className="mr-2" />
                Cadastrar Novo Cliente/Fornecedor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl border-orange-200">
              <DialogHeader>
                <DialogTitle className="text-orange-800">Cadastrar Cliente/Fornecedor</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                  <Input
                    id="nomeFantasia"
                    value={formData.nomeFantasia}
                    onChange={(e) => setFormData({...formData, nomeFantasia: e.target.value})}
                    className="focus:border-orange-400"
                  />
                </div>
                <div>
                  <Label htmlFor="razaoSocial">Razão Social</Label>
                  <Input
                    id="razaoSocial"
                    value={formData.razaoSocial}
                    onChange={(e) => setFormData({...formData, razaoSocial: e.target.value})}
                    className="focus:border-orange-400"
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                    className="focus:border-orange-400"
                  />
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    className="focus:border-orange-400"
                  />
                </div>
                <div>
                  <Label htmlFor="contato">Contato</Label>
                  <Input
                    id="contato"
                    value={formData.contato}
                    onChange={(e) => setFormData({...formData, contato: e.target.value})}
                    className="focus:border-orange-400"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="focus:border-orange-400"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    className="focus:border-orange-400"
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value: 'cliente' | 'fornecedor') => setFormData({...formData, tipo: value})}>
                    <SelectTrigger className="focus:border-orange-400">
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
                    className="focus:border-orange-400"
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    className="focus:border-orange-400"
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ativo"
                      checked={formData.ativo}
                      onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
                    />
                    <Label htmlFor="ativo">Ativo</Label>
                  </div>
                </div>
              </div>
              <Button onClick={handleSalvar} className="w-full bg-orange-600 hover:bg-orange-700">
                Salvar
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista */}
        <div className="space-y-4">
          {itensOrdenados.map((item) => (
            <Card key={item.id} className={`border-l-4 shadow-lg hover:shadow-xl transition-all ${
              item.tipo === 'cliente' ? 'border-l-orange-500' : 'border-l-orange-700'
            } ${
              item.ativo 
                ? item.tipo === 'cliente' 
                  ? 'bg-gradient-to-r from-orange-50 to-white' 
                  : 'bg-gradient-to-r from-orange-100 to-white'
                : 'bg-gray-100 opacity-60 grayscale'
            }`}>
              <CardContent className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.ativo
                      ? item.tipo === 'cliente' ? 'bg-orange-100' : 'bg-orange-200'
                      : 'bg-gray-200'
                  }`}>
                    {item.tipo === 'cliente' ? 
                      <Users className={`h-6 w-6 ${item.ativo ? 'text-orange-600' : 'text-gray-500'}`} /> : 
                      <Building className={`h-6 w-6 ${item.ativo ? 'text-orange-700' : 'text-gray-500'}`} />
                    }
                  </div>
                  <div>
                    <h3 className={`font-semibold ${item.ativo ? 'text-slate-800' : 'text-gray-500'}`}>
                      {item.nomeFantasia}
                    </h3>
                    <p className={`text-sm ${item.ativo ? 'text-slate-600' : 'text-gray-400'}`}>
                      {item.razaoSocial}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={item.tipo === 'cliente' ? 'default' : 'secondary'} 
                        className={
                          item.ativo
                            ? item.tipo === 'cliente' 
                              ? 'bg-orange-100 text-orange-800 border-orange-300' 
                              : 'bg-orange-200 text-orange-900 border-orange-400'
                            : 'bg-gray-200 text-gray-600 border-gray-300'
                        }>
                        {item.tipo}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Switch
                          checked={item.ativo}
                          onCheckedChange={() => toggleStatus(item.id)}
                          size="sm"
                        />
                        <span className={`text-xs ${item.ativo ? 'text-green-600' : 'text-red-600'}`}>
                          {item.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVisualizar(item)}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
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
          <DialogContent className="max-w-4xl border-orange-200">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DialogTitle className="text-orange-800">{itemSelecionado?.nomeFantasia}</DialogTitle>
                  <Badge variant={itemSelecionado?.ativo ? 'default' : 'secondary'} 
                    className={itemSelecionado?.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {itemSelecionado?.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditar(itemSelecionado!)}
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    <Edit size={16} className="mr-2" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir "{itemSelecionado?.nomeFantasia}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleExcluir(itemSelecionado?.id || '')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4 text-slate-700">
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
                <Button onClick={() => setModalPessoasAberto(true)} className="bg-orange-600 hover:bg-orange-700">
                  <UserPlus size={16} className="mr-2" />
                  Pessoas
                </Button>
                <Button onClick={() => setModalDocumentosAberto(true)} className="bg-orange-600 hover:bg-orange-700">
                  <FileText size={16} className="mr-2" />
                  Documentos
                </Button>
                <Button onClick={() => setModalHistoricoAberto(true)} className="bg-orange-600 hover:bg-orange-700">
                  <History size={16} className="mr-2" />
                  Histórico
                </Button>
              </div>
            ) : (
              <div className="flex space-x-4 mt-6">
                <Button onClick={() => setModalContratosAberto(true)} className="bg-orange-600 hover:bg-orange-700">
                  <FileText size={16} className="mr-2" />
                  Contratos
                </Button>
                <Button onClick={() => setModalHistoricoAberto(true)} className="bg-orange-600 hover:bg-orange-700">
                  <History size={16} className="mr-2" />
                  Histórico
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Edição */}
        <Dialog open={modalEdicaoAberto} onOpenChange={setModalEdicaoAberto}>
          <DialogContent className="max-w-2xl border-orange-200">
            <DialogHeader>
              <DialogTitle className="text-orange-800">Editar {itemSelecionado?.tipo}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="editNomeFantasia">Nome Fantasia</Label>
                <Input
                  id="editNomeFantasia"
                  value={formData.nomeFantasia}
                  onChange={(e) => setFormData({...formData, nomeFantasia: e.target.value})}
                  className="focus:border-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="editRazaoSocial">Razão Social</Label>
                <Input
                  id="editRazaoSocial"
                  value={formData.razaoSocial}
                  onChange={(e) => setFormData({...formData, razaoSocial: e.target.value})}
                  className="focus:border-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="editCnpj">CNPJ</Label>
                <Input
                  id="editCnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  className="focus:border-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="editEndereco">Endereço</Label>
                <Input
                  id="editEndereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  className="focus:border-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="editContato">Contato</Label>
                <Input
                  id="editContato"
                  value={formData.contato}
                  onChange={(e) => setFormData({...formData, contato: e.target.value})}
                  className="focus:border-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="focus:border-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="editTelefone">Telefone</Label>
                <Input
                  id="editTelefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  className="focus:border-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="editTipo">Tipo</Label>
                <Select value={formData.tipo} onValueChange={(value: 'cliente' | 'fornecedor') => setFormData({...formData, tipo: value})}>
                  <SelectTrigger className="focus:border-orange-400">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="fornecedor">Fornecedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editCidade">Cidade</Label>
                <Input
                  id="editCidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  className="focus:border-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="editEstado">Estado</Label>
                <Input
                  id="editEstado"
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="focus:border-orange-400"
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editAtivo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
                  />
                  <Label htmlFor="editAtivo">Ativo</Label>
                </div>
              </div>
            </div>
            <Button onClick={handleSalvarEdicao} className="w-full bg-orange-600 hover:bg-orange-700">
              Salvar Alterações
            </Button>
          </DialogContent>
        </Dialog>

        {/* Modal Pessoas */}
        <Dialog open={modalPessoasAberto} onOpenChange={setModalPessoasAberto}>
          <DialogContent className="border-orange-200">
            <DialogHeader>
              <DialogTitle className="text-orange-800">Funcionários Alocados</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-slate-600">Nenhum funcionário alocado ainda.</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Documentos */}
        <Dialog open={modalDocumentosAberto} onOpenChange={setModalDocumentosAberto}>
          <DialogContent className="border-orange-200">
            <DialogHeader>
              <DialogTitle className="text-orange-800">Contratos e Propostas</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-slate-600">Nenhum documento encontrado.</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Contratos (Fornecedor) */}
        <Dialog open={modalContratosAberto} onOpenChange={setModalContratosAberto}>
          <DialogContent className="border-orange-200">
            <DialogHeader>
              <DialogTitle className="text-orange-800">Contratos</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50">
                <Plus size={16} className="mr-2" />
                Anexar Arquivo
              </Button>
              <div>
                <Label htmlFor="textoContrato">Texto do Contrato</Label>
                <Textarea id="textoContrato" placeholder="Digite o texto do contrato..." className="focus:border-orange-400" />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Histórico */}
        <Dialog open={modalHistoricoAberto} onOpenChange={setModalHistoricoAberto}>
          <DialogContent className="border-orange-200">
            <DialogHeader>
              <DialogTitle className="text-orange-800">Histórico</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex space-x-2">
                <Textarea
                  value={novoHistoricoTexto}
                  onChange={(e) => setNovoHistoricoTexto(e.target.value)}
                  placeholder="Digite o histórico..."
                  className="flex-1 focus:border-orange-400"
                />
                <Button onClick={adicionarHistorico} className="bg-orange-600 hover:bg-orange-700">
                  <Plus size={16} />
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {historico.map((item) => (
                  <Card key={item.id} className="border-orange-200">
                    <CardContent className="p-3">
                      <div className="text-xs text-slate-500 mb-1">{item.data}</div>
                      <div className="text-sm text-slate-700">{item.texto}</div>
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
