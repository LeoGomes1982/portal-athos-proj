
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { FuncionarioDetalhesModal } from "@/components/modals/FuncionarioDetalhesModal";

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
  status: "ativo" | "ferias" | "experiencia" | "aviso" | "inativo";
  cpf?: string;
  rg?: string;
  endereco?: string;
  salario?: string;
}

// Dados mockados de funcionários com status
const funcionarios: Funcionario[] = [
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
    status: "ativo",
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
  }
];

const statusConfig = {
  ativo: { label: "Ativo", color: "bg-green-500", textColor: "text-green-700" },
  ferias: { label: "Em Férias", color: "bg-blue-500", textColor: "text-blue-700" },
  experiencia: { label: "Em Experiência", color: "bg-yellow-500", textColor: "text-yellow-700" },
  aviso: { label: "Em Aviso Prévio", color: "bg-orange-500", textColor: "text-orange-700" },
  inativo: { label: "Inativo", color: "bg-gray-500", textColor: "text-gray-700" }
};

export function FuncionariosSubsection({ onBack }: FuncionariosSubsectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [funcionariosList, setFuncionariosList] = useState(funcionarios);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredFuncionarios = funcionariosList.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFuncionarioClick = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsModalOpen(true);
  };

  const handleStatusChange = (funcionarioId: number, novoStatus: Funcionario['status']) => {
    setFuncionariosList(prev => 
      prev.map(func => 
        func.id === funcionarioId 
          ? { ...func, status: novoStatus }
          : func
      )
    );
  };

  // Contadores por status
  const contadores = {
    total: funcionariosList.length,
    ferias: funcionariosList.filter(f => f.status === 'ferias').length,
    experiencia: funcionariosList.filter(f => f.status === 'experiencia').length,
    aviso: funcionariosList.filter(f => f.status === 'aviso').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-slate-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
          {/* Header - sem botão voltar */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-md px-8 py-6 rounded-3xl shadow-xl border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl">👥</span>
              </div>
              <div className="text-left">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Funcionários Ativos
                </h1>
                <p className="text-lg text-gray-600 font-medium">Gerencie sua equipe</p>
              </div>
            </div>
          </div>

          {/* Resumo com contadores */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              📊 Resumo da Equipe
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl font-bold">{contadores.total}</span>
                </div>
                <div className="text-lg font-bold text-gray-800 mb-1">Total</div>
                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Funcionários
                </div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl">🏖️</span>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{contadores.ferias}</div>
                <div className="text-sm font-medium text-blue-600">Em Férias</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl">🆕</span>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{contadores.experiencia}</div>
                <div className="text-sm font-medium text-yellow-600">Em Experiência</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl">⚠️</span>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{contadores.aviso}</div>
                <div className="text-sm font-medium text-orange-600">Em Aviso Prévio</div>
              </div>
            </div>
          </div>

          {/* Controles */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-6">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar funcionário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-white/80 border-gray-200 shadow-lg rounded-2xl text-lg font-medium"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setViewMode("grid")}
                  className={`${viewMode === "grid" 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg" 
                    : "bg-white/80 border-gray-200 hover:bg-white"
                  } px-6 py-3 rounded-2xl font-semibold transition-all duration-200`}
                >
                  📱 Quadros
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setViewMode("list")}
                  className={`${viewMode === "list" 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg" 
                    : "bg-white/80 border-gray-200 hover:bg-white"
                  } px-6 py-3 rounded-2xl font-semibold transition-all duration-200`}
                >
                  📋 Lista
                </Button>
              </div>
            </div>
          </div>

          {/* Grid/Lista de Funcionários */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              👨‍💼 Equipe Ativa
            </h2>
            
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFuncionarios.map((funcionario) => {
                  const statusInfo = statusConfig[funcionario.status];
                  return (
                    <Card 
                      key={funcionario.id} 
                      className="group cursor-pointer bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden"
                      onClick={() => handleFuncionarioClick(funcionario)}
                    >
                      <CardHeader className="text-center pb-4 pt-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <span className="text-4xl">{funcionario.foto}</span>
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-800 mb-1">{funcionario.nome}</CardTitle>
                        <p className="text-sm text-gray-600 font-medium">{funcionario.cargo}</p>
                      </CardHeader>
                      <CardContent className="space-y-3 px-6 pb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-medium">Setor:</span>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-medium px-3 py-1 rounded-full">{funcionario.setor}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-medium">Status:</span>
                          <Badge className={`${statusInfo.color} text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm`}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
                          <span>📅</span>
                          {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
                          <span>📞</span>
                          {funcionario.telefone}
                        </div>
                        <div className="text-xs text-gray-500 font-medium flex items-center gap-2 truncate">
                          <span>📧</span>
                          <span className="truncate">{funcionario.email}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* Lista de Funcionários */
              <div className="space-y-0 bg-white/50 rounded-2xl overflow-hidden border border-gray-200">
                {filteredFuncionarios.map((funcionario, index) => {
                  const statusInfo = statusConfig[funcionario.status];
                  return (
                    <div
                      key={funcionario.id}
                      className={`flex items-center justify-between p-6 hover:bg-blue-50/80 cursor-pointer transition-all duration-200 ${
                        index !== filteredFuncionarios.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                      onClick={() => handleFuncionarioClick(funcionario)}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-2xl">{funcionario.foto}</span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-lg">{funcionario.nome}</div>
                          <div className="text-sm text-gray-600 font-medium">{funcionario.cargo}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <Badge className={`${statusInfo.color} text-white font-medium px-4 py-2 rounded-full shadow-sm`}>
                          {statusInfo.label}
                        </Badge>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-full">{funcionario.setor}</Badge>
                        <div className="text-sm text-gray-500 font-medium hidden md:block">
                          {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-sm text-gray-500 font-medium hidden lg:block">
                          {funcionario.telefone}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {filteredFuncionarios.length === 0 && (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-600 mb-3">Nenhum funcionário encontrado</h3>
                <p className="text-gray-500 font-medium">Tente ajustar os filtros de busca</p>
              </div>
            )}
          </div>

          {/* Status do sistema */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 text-base text-gray-600 bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/50 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                <span className="font-medium">Dados Atualizados</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                <span className="font-medium">Sistema Online</span>
              </div>
            </div>
          </div>
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
