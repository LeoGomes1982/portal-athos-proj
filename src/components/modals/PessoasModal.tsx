
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, User, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  status: 'ativo' | 'ferias' | 'experiencia' | 'aviso_previo';
  vinculadoCliente?: boolean;
}

interface PessoasModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteNome: string;
  clienteId: string;
}

const PessoasModal = ({ isOpen, onClose, clienteNome, clienteId }: PessoasModalProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingFuncionario, setIsAddingFuncionario] = useState(false);
  
  // Funcionários vinculados ao cliente
  const [funcionariosVinculados, setFuncionariosVinculados] = useState<Funcionario[]>([]);

  // Lista completa de funcionários disponíveis
  const [todosOsFuncionarios] = useState<Funcionario[]>([
    {
      id: "1",
      nome: "João Silva",
      cargo: "Gerente",
      email: "joao.silva@empresa.com",
      telefone: "(11) 99999-9999",
      status: "ativo"
    },
    {
      id: "2",
      nome: "Maria Santos",
      cargo: "Coordenadora",
      email: "maria.santos@empresa.com", 
      telefone: "(11) 88888-8888",
      status: "ativo"
    },
    {
      id: "3",
      nome: "Pedro Oliveira",
      cargo: "Analista",
      email: "pedro.oliveira@empresa.com",
      telefone: "(11) 77777-7777",
      status: "ativo"
    },
    {
      id: "4",
      nome: "Ana Costa",
      cargo: "Assistente",
      email: "ana.costa@empresa.com",
      telefone: "(11) 66666-6666",
      status: "ferias"
    },
    {
      id: "5",
      nome: "Carlos Lima",
      cargo: "Estagiário",
      email: "carlos.lima@empresa.com",
      telefone: "(11) 55555-5555",
      status: "experiencia"
    },
    {
      id: "6",
      nome: "Lucia Pereira",
      cargo: "Supervisora",
      email: "lucia.pereira@empresa.com",
      telefone: "(11) 44444-4444",
      status: "aviso_previo"
    }
  ]);

  // Carregar funcionários vinculados do localStorage
  useEffect(() => {
    if (!clienteId) return;
    
    const vinculos = localStorage.getItem(`funcionarios_cliente_${clienteId}`);
    if (vinculos) {
      try {
        const funcionariosIds = JSON.parse(vinculos);
        const funcionariosVinculadosData = todosOsFuncionarios.filter(func => 
          funcionariosIds.includes(func.id)
        ).map(func => ({ ...func, vinculadoCliente: true }));
        setFuncionariosVinculados(funcionariosVinculadosData);
        console.log('Funcionários vinculados carregados para cliente', clienteId, ':', funcionariosVinculadosData);
      } catch (error) {
        console.error('Erro ao carregar vínculos de funcionários:', error);
        setFuncionariosVinculados([]);
      }
    }
  }, [clienteId, todosOsFuncionarios]);

  // Salvar vínculos no localStorage
  const salvarVinculos = (funcionarios: Funcionario[]) => {
    if (!clienteId) return;
    
    const ids = funcionarios.map(func => func.id);
    try {
      localStorage.setItem(`funcionarios_cliente_${clienteId}`, JSON.stringify(ids));
      setFuncionariosVinculados(funcionarios);
      console.log('Vínculos salvos para cliente', clienteId, ':', ids);
    } catch (error) {
      console.error('Erro ao salvar vínculos:', error);
    }
  };

  const funcionariosDisponiveis = todosOsFuncionarios.filter(funcionario => 
    !funcionariosVinculados.some(vinculado => vinculado.id === funcionario.id)
  );

  const filteredFuncionarios = funcionariosVinculados.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFuncionariosDisponiveis = funcionariosDisponiveis.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'ferias': return 'Em Férias';
      case 'experiencia': return 'Contrato de Experiência';
      case 'aviso_previo': return 'Aviso Prévio';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'ferias': return 'bg-blue-100 text-blue-800';
      case 'experiencia': return 'bg-orange-100 text-orange-800';
      case 'aviso_previo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const vincularFuncionario = (funcionario: Funcionario) => {
    const novosFuncionariosVinculados = [...funcionariosVinculados, { ...funcionario, vinculadoCliente: true }];
    salvarVinculos(novosFuncionariosVinculados);
    toast({
      title: "Sucesso",
      description: `${funcionario.nome} foi vinculado ao cliente.`,
    });
  };

  const desvincularFuncionario = (funcionarioId: string) => {
    const novosFuncionariosVinculados = funcionariosVinculados.filter(f => f.id !== funcionarioId);
    salvarVinculos(novosFuncionariosVinculados);
    toast({
      title: "Sucesso",
      description: "Funcionário desvinculado com sucesso.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pessoas - {clienteNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                placeholder="Buscar funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setIsAddingFuncionario(!isAddingFuncionario)}>
              <UserPlus size={16} className="mr-2" />
              {isAddingFuncionario ? 'Cancelar' : 'Adicionar Funcionário'}
            </Button>
          </div>

          {isAddingFuncionario && (
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Funcionários Disponíveis</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredFuncionariosDisponiveis.map((funcionario) => (
                  <div key={funcionario.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <User className="text-white" size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{funcionario.nome}</h4>
                        <p className="text-sm text-slate-600">{funcionario.cargo}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(funcionario.status)}`}>
                          {getStatusLabel(funcionario.status)}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => vincularFuncionario(funcionario)}
                    >
                      <Plus size={14} className="mr-1" />
                      Vincular
                    </Button>
                  </div>
                ))}
                {filteredFuncionariosDisponiveis.length === 0 && (
                  <p className="text-center text-slate-500 py-4">Nenhum funcionário disponível</p>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3">Funcionários Vinculados</h3>
            <div className="space-y-3">
              {filteredFuncionarios.map((funcionario) => (
                <div key={funcionario.id} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <User className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{funcionario.nome}</h4>
                        <p className="text-sm text-slate-600">{funcionario.cargo}</p>
                        <p className="text-sm text-slate-500">{funcionario.email}</p>
                        <p className="text-sm text-slate-500">{funcionario.telefone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(funcionario.status)}`}>
                        {getStatusLabel(funcionario.status)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => desvincularFuncionario(funcionario.id)}
                      >
                        Desvincular
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredFuncionarios.length === 0 && !isAddingFuncionario && (
            <div className="text-center py-8 text-slate-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum funcionário vinculado</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PessoasModal;
