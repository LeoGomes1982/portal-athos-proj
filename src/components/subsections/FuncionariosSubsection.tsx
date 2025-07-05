
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, ChevronLeft, AlertTriangle, ArrowLeft, Users } from "lucide-react";
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
  const funcionariosAtivos2 = funcionariosAtivos.length;
  const funcionariosFerias = funcionariosAtivos.filter(f => f.status === 'ferias').length;
  const funcionariosExperiencia = funcionariosAtivos.filter(f => f.status === 'experiencia').length;
  const funcionariosAviso = funcionariosAtivos.filter(f => f.status === 'aviso').length;
  const funcionariosDestaque = funcionariosAtivos.filter(f => f.status === 'destaque').length;

  // Verificar se há alertas
  const alertasExperiencia = funcionariosAtivos.filter(f => 
    f.status === 'experiencia' && f.dataFimExperiencia && isProximoDoFim(f.dataFimExperiencia)
  ).length;

  const alertasAvisoPrevio = funcionariosAtivos.filter(f => 
    f.status === 'aviso' && f.dataFimAvisoPrevio && isProximoDoFim(f.dataFimAvisoPrevio)
  ).length;

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={onBack}>
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
            <Users size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">Gestão de Funcionários</h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Controle completo da equipe e colaboradores
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Users size={20} className="text-primary" />
                Total Ativos
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-primary mb-2">{funcionariosAtivos2}</div>
              <p className="text-primary/80">funcionários</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <span className="text-primary text-lg">🏖️</span>
                Em Férias
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-primary mb-2">{funcionariosFerias}</div>
              <p className="text-primary/80">funcionários</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300 relative">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <span className="text-orange-700 text-lg">⏳</span>
                Experiência
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              {alertasExperiencia > 0 && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
              )}
              <div className="text-4xl font-bold text-orange-700 mb-2">{funcionariosExperiencia}</div>
              <p className="text-orange-700/80">funcionários</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-red-100 to-red-200 border-red-300 relative">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <span className="text-red-700 text-lg">⚠️</span>
                Aviso Prévio
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              {alertasAvisoPrevio > 0 && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
              )}
              <div className="text-4xl font-bold text-red-700 mb-2">{funcionariosAviso}</div>
              <p className="text-red-700/80">funcionários</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 shadow-yellow-200/50">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Star size={20} className="text-yellow-700 fill-yellow-600" />
                Destaque
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-yellow-700 mb-2">{funcionariosDestaque}</div>
              <p className="text-yellow-700/80">funcionários</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
            <Input
              placeholder="Buscar funcionário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white border-primary/20 shadow-lg rounded-xl text-lg font-medium focus:border-primary"
            />
          </div>
        </div>

        {/* Funcionários List */}
        <div className="grid grid-cols-1 gap-4 animate-slide-up">
          {funcionariosAtivos.map((funcionario) => {
            const statusInfo = statusConfig[funcionario.status];
            
            // Verificar se deve mostrar alerta
            const mostrarAlerta = (
              (funcionario.status === 'experiencia' && funcionario.dataFimExperiencia && isProximoDoFim(funcionario.dataFimExperiencia)) ||
              (funcionario.status === 'aviso' && funcionario.dataFimAvisoPrevio && isProximoDoFim(funcionario.dataFimAvisoPrevio))
            );

            return (
              <Card 
                key={funcionario.id} 
                className="modern-card cursor-pointer transition-all duration-300 hover:shadow-lg"
                onClick={() => handleFuncionarioClick(funcionario)}
              >
                <CardContent className="card-content p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
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
                            <AlertTriangle className="w-5 h-5 text-red-500 fill-red-400 drop-shadow-md" />
                          </div>
                        )}
                        <div className="w-12 h-12 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-2xl">{funcionario.foto}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">{funcionario.nome}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span>{funcionario.cargo}</span>
                              <span>{funcionario.setor}</span>
                              <span>{new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                          
                          {/* Status */}
                          <div className="flex-shrink-0">
                            <Badge className={`${statusInfo.color} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {funcionariosAtivos.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhum funcionário encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros de busca</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modal de Detalhes */}
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
