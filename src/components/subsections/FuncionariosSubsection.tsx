
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, ChevronLeft, AlertTriangle } from "lucide-react";
import { FuncionarioDetalhesModal } from "@/components/modals/FuncionarioDetalhesModal";
import { useNavigate } from "react-router-dom";

interface FuncionariosSubsectionProps {
  onBack: () => void;
}

interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  setor: string;
  dataAdmissao: string;
  telefone: string;
  email: string;
  foto: string;
  status: "ativo" | "ferias" | "experiencia" | "aviso" | "inativo" | "destaque";
  cpf?: string;
  rg?: string;
  endereco?: string;
  salario?: string;
  dataFimExperiencia?: string;
  dataFimAvisoPrevio?: string;
}

// Dados mockados de funcionários
const funcionariosIniciais: Funcionario[] = [
  {
    id: 1,
    nome: "Ana Silva",
    cargo: "Analista de Sistemas",
    setor: "TI",
    dataAdmissao: "2023-01-15",
    telefone: "(11) 99999-1111",
    email: "ana.silva@empresa.com",
    foto: "👩‍💻",
    status: "ativo",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    endereco: "Rua das Flores, 123 - Centro",
    salario: "R$ 5.500,00"
  },
  {
    id: 2,
    nome: "João Santos",
    cargo: "Desenvolvedor",
    setor: "TI",
    dataAdmissao: "2023-03-10",
    telefone: "(11) 99999-2222",
    email: "joao.santos@empresa.com",
    foto: "👨‍💻",
    status: "ferias",
    cpf: "987.654.321-00",
    rg: "98.765.432-1",
    endereco: "Av. Principal, 456 - Jardim",
    salario: "R$ 4.800,00"
  },
  {
    id: 3,
    nome: "Maria Costa",
    cargo: "Gerente de Vendas",
    setor: "Comercial",
    dataAdmissao: "2022-11-05",
    telefone: "(11) 99999-3333",
    email: "maria.costa@empresa.com",
    foto: "👩‍💼",
    status: "destaque",
    cpf: "456.789.123-00",
    rg: "45.678.912-3",
    endereco: "Rua Comercial, 789 - Vila Nova",
    salario: "R$ 7.200,00"
  },
  {
    id: 4,
    nome: "Carlos Oliveira",
    cargo: "Analista Financeiro",
    setor: "Financeiro",
    dataAdmissao: "2023-02-20",
    telefone: "(11) 99999-4444",
    email: "carlos.oliveira@empresa.com",
    foto: "👨‍💼",
    status: "experiencia",
    cpf: "321.654.987-00",
    rg: "32.165.498-7",
    endereco: "Rua dos Números, 321 - Centro",
    salario: "R$ 4.200,00"
  },
  {
    id: 5,
    nome: "Patricia Fernandes",
    cargo: "Assistente Administrativo",
    setor: "Administrativo",
    dataAdmissao: "2023-04-01",
    telefone: "(11) 99999-5555",
    email: "patricia.fernandes@empresa.com",
    foto: "👩‍💼",
    status: "aviso",
    cpf: "159.753.486-00",
    rg: "15.975.348-6",
    endereco: "Rua da Administração, 159 - Bairro Alto",
    salario: "R$ 3.500,00"
  },
  {
    id: 6,
    nome: "Roberto Silva",
    cargo: "Ex-Funcionário",
    setor: "TI",
    dataAdmissao: "2022-01-10",
    telefone: "(11) 99999-6666",
    email: "roberto.silva@empresa.com",
    foto: "👨‍💻",
    status: "inativo",
    cpf: "111.222.333-44",
    rg: "11.222.333-4",
    endereco: "Rua Antiga, 999 - Bairro Distante",
    salario: "R$ 4.000,00"
  }
];

const statusConfig = {
  ativo: { label: "Ativo", color: "bg-green-500", textColor: "text-green-700" },
  ferias: { label: "Em Férias", color: "bg-blue-500", textColor: "text-blue-700" },
  experiencia: { label: "Em Experiência", color: "bg-orange-500", textColor: "text-orange-700" },
  aviso: { label: "Em Aviso Prévio", color: "bg-red-500", textColor: "text-red-700" },
  inativo: { label: "Inativo", color: "bg-gray-500", textColor: "text-gray-700" },
  destaque: { label: "Destaque", color: "bg-yellow-500", textColor: "text-yellow-700" }
};

export function FuncionariosSubsection({ onBack }: FuncionariosSubsectionProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [funcionariosList, setFuncionariosList] = useState(funcionariosIniciais);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para verificar se está próximo do fim (3 dias ou menos)
  const isProximoDoFim = (dataFim: string) => {
    const hoje = new Date();
    const dataLimite = new Date(dataFim);
    const diferenca = dataLimite.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diferenca / (1000 * 3600 * 24));
    return diasRestantes <= 3 && diasRestantes >= 0;
  };

  // Função para verificar se a data já passou
  const dataJaPassou = (dataFim: string) => {
    const hoje = new Date();
    const dataLimite = new Date(dataFim);
    return dataLimite < hoje;
  };

  // Verificar automaticamente as datas e atualizar status
  useEffect(() => {
    const verificarDatas = () => {
      setFuncionariosList(prev => prev.map(func => {
        let novoStatus = func.status;

        // Verificar período de experiência
        if (func.status === 'experiencia' && func.dataFimExperiencia) {
          if (dataJaPassou(func.dataFimExperiencia)) {
            novoStatus = 'ativo';
            console.log(`Funcionário ${func.nome} mudou de experiência para ativo`);
          }
        }

        // Verificar aviso prévio
        if (func.status === 'aviso' && func.dataFimAvisoPrevio) {
          if (dataJaPassou(func.dataFimAvisoPrevio)) {
            novoStatus = 'inativo';
            console.log(`Funcionário ${func.nome} mudou de aviso prévio para inativo`);
          }
        }

        return { ...func, status: novoStatus };
      }));
    };

    // Executar verificação imediatamente e depois a cada minuto
    verificarDatas();
    const interval = setInterval(verificarDatas, 60000);

    return () => clearInterval(interval);
  }, []);

  const filteredFuncionarios = funcionariosList.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Only show active employees (not inactive)
  const funcionariosAtivos = filteredFuncionarios.filter(f => f.status !== 'inativo');

  const handleFuncionarioClick = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsModalOpen(true);
  };

  const handleStatusChange = (funcionarioId: number, novoStatus: Funcionario['status'], dataFim?: string) => {
    setFuncionariosList(prev => 
      prev.map(func => {
        if (func.id === funcionarioId) {
          const updatedFunc = { ...func, status: novoStatus };
          
          // Limpar datas antigas
          if (novoStatus !== 'experiencia') {
            delete updatedFunc.dataFimExperiencia;
          }
          if (novoStatus !== 'aviso') {
            delete updatedFunc.dataFimAvisoPrevio;
          }
          
          // Adicionar nova data se fornecida
          if (dataFim) {
            if (novoStatus === 'experiencia') {
              updatedFunc.dataFimExperiencia = dataFim;
            } else if (novoStatus === 'aviso') {
              updatedFunc.dataFimAvisoPrevio = dataFim;
            }
          }
          
          return updatedFunc;
        }
        return func;
      })
    );
  };

  // Contadores por status (apenas funcionários ativos)
  const contadores = {
    total: funcionariosAtivos.length,
    ferias: funcionariosAtivos.filter(f => f.status === 'ferias').length,
    experiencia: funcionariosAtivos.filter(f => f.status === 'experiencia').length,
    aviso: funcionariosAtivos.filter(f => f.status === 'aviso').length,
    destaque: funcionariosAtivos.filter(f => f.status === 'destaque').length
  };

  // Verificar se há alertas
  const alertasExperiencia = funcionariosAtivos.filter(f => 
    f.status === 'experiencia' && f.dataFimExperiencia && isProximoDoFim(f.dataFimExperiencia)
  ).length;

  const alertasAvisoPrevio = funcionariosAtivos.filter(f => 
    f.status === 'aviso' && f.dataFimAvisoPrevio && isProximoDoFim(f.dataFimAvisoPrevio)
  ).length;

  const renderFuncionarioListItem = (funcionario: Funcionario) => {
    const statusInfo = statusConfig[funcionario.status];
    
    // Verificar se deve mostrar alerta
    const mostrarAlerta = (
      (funcionario.status === 'experiencia' && funcionario.dataFimExperiencia && isProximoDoFim(funcionario.dataFimExperiencia)) ||
      (funcionario.status === 'aviso' && funcionario.dataFimAvisoPrevio && isProximoDoFim(funcionario.dataFimAvisoPrevio))
    );

    return (
      <div 
        key={funcionario.id}
        className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-400 bg-white rounded-lg p-4 mb-3"
        onClick={() => handleFuncionarioClick(funcionario)}
      >
        <div className="flex items-center gap-4">
          {/* Foto */}
          <div className="flex-shrink-0 relative">
            {funcionario.status === 'destaque' && (
              <div className="absolute -top-1 -right-1 animate-bounce">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-400 drop-shadow-md" style={{
                  filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.8)) brightness(1.2)'
                }} />
              </div>
            )}
            {mostrarAlerta && (
              <div className="absolute -top-1 -right-1 animate-bounce">
                <AlertTriangle className="w-5 h-5 text-red-500 fill-red-400 drop-shadow-md" style={{
                  filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.8)) brightness(1.2)'
                }} />
              </div>
            )}
            <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">{funcionario.foto}</span>
            </div>
          </div>

          {/* Nome */}
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-slate-800 truncate">{funcionario.nome}</p>
          </div>

          {/* Cargo */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{funcionario.cargo}</p>
          </div>

          {/* Data de Admissão */}
          <div className="flex-shrink-0">
            <p className="text-sm text-slate-600 font-medium">
              {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Status */}
          <div className="flex-shrink-0">
            <Badge className={`${statusInfo.color} text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm`}>
              {statusInfo.label}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Navigation Button */}
        <div className="mb-6">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors duration-300 font-medium"
          >
            <ChevronLeft size={16} />
            Voltar
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-white text-3xl">👥</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Gestão de Funcionários</h1>
          <p className="text-slate-600 text-lg">Departamento Pessoal</p>
        </div>

        {/* Resumo com contadores */}
        <Card className="mb-8 bg-white border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <CardTitle className="text-xl font-bold text-slate-800 text-center">
              📊 Resumo da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap justify-center gap-4">
              <Card className="hover:shadow-md transition-all duration-300 min-w-[140px] border-blue-200">
                <CardContent className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{contadores.total}</div>
                  <div className="text-sm font-medium text-slate-600">Funcionários Ativos</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all duration-300 min-w-[140px] border-blue-200">
                <CardContent className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{contadores.ferias}</div>
                  <div className="text-sm font-medium text-slate-600">Em Férias</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all duration-300 min-w-[140px] border-orange-300 bg-gradient-to-br from-orange-50 to-white relative">
                <CardContent className="text-center p-4">
                  {alertasExperiencia > 0 && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
                  )}
                  <div className="text-2xl font-bold text-orange-600 mb-1">{contadores.experiencia}</div>
                  <div className="text-sm font-medium text-orange-700">Em Experiência</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all duration-300 min-w-[140px] border-red-300 bg-gradient-to-br from-red-50 to-white relative">
                <CardContent className="text-center p-4">
                  {alertasAvisoPrevio > 0 && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
                  )}
                  <div className="text-2xl font-bold text-red-600 mb-1">{contadores.aviso}</div>
                  <div className="text-sm font-medium text-red-700">Em Aviso Prévio</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all duration-300 min-w-[140px] border-yellow-400 bg-gradient-to-br from-yellow-100 to-yellow-50 shadow-yellow-200/50">
                <CardContent className="text-center p-4">
                  <div className="flex items-center justify-center mb-1">
                    <div className="relative">
                      <Star className="text-yellow-500 w-6 h-6 fill-yellow-400 mr-1 drop-shadow-md" style={{
                        filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8)) brightness(1.2)'
                      }} />
                      <div className="absolute inset-0 animate-pulse opacity-50">
                        <Star className="text-yellow-300 w-6 h-6 fill-yellow-200" />
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-yellow-700">{contadores.destaque}</span>
                  </div>
                  <div className="text-sm font-medium text-yellow-800">Em Destaque</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Funcionários Ativos */}
        <Card className="bg-white border-blue-200 shadow-lg animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-0">
                👨‍💼 Funcionários Ativos
              </CardTitle>
              
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                  <Input
                    placeholder="Buscar funcionário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-white border-blue-300 shadow-lg rounded-2xl text-lg font-medium focus:border-blue-400"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {funcionariosAtivos.map((funcionario) => renderFuncionarioListItem(funcionario))}
            </div>

            {funcionariosAtivos.length === 0 && (
              <div className="text-center py-16 bg-gradient-to-br from-blue-100 to-white rounded-3xl shadow-lg border border-blue-300">
                <div className="w-24 h-24 bg-blue-200 border-2 border-blue-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-blue-500 text-4xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-600 mb-3">Nenhum funcionário ativo encontrado</h3>
                <p className="text-slate-500 font-medium">Tente ajustar os filtros de busca</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalhes Completo */}
      {selectedFuncionario && (
        <FuncionarioDetalhesModal
          funcionario={selectedFuncionario}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
