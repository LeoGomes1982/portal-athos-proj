
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Grid3X3, List } from "lucide-react";
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
  status: "ativo" | "ferias" | "experiencia" | "aviso" | "inativo" | "destaque";
  cpf?: string;
  rg?: string;
  endereco?: string;
  salario?: string;
}

// Dados mockados de funcionários
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
  experiencia: { label: "Em Experiência", color: "bg-yellow-500", textColor: "text-yellow-700" },
  aviso: { label: "Em Aviso Prévio", color: "bg-red-500", textColor: "text-red-700" },
  inativo: { label: "Inativo", color: "bg-gray-500", textColor: "text-gray-700" },
  destaque: { label: "Destaque", color: "bg-yellow-500", textColor: "text-yellow-700" }
};

export function FuncionariosSubsection({ onBack }: FuncionariosSubsectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [funcionariosList, setFuncionariosList] = useState(funcionarios);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  const handleStatusChange = (funcionarioId: number, novoStatus: Funcionario['status']) => {
    setFuncionariosList(prev => 
      prev.map(func => 
        func.id === funcionarioId 
          ? { ...func, status: novoStatus }
          : func
      )
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

  const renderFuncionarioCard = (funcionario: Funcionario) => {
    const statusInfo = statusConfig[funcionario.status];

    return (
      <Card 
        key={funcionario.id} 
        className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 border-green-300 hover:border-green-400 bg-gradient-to-br from-green-50 to-white"
        onClick={() => handleFuncionarioClick(funcionario)}
      >
        <CardHeader className="text-center pb-4 pt-6 relative">
          {funcionario.status === 'destaque' && (
            <div className="absolute top-2 right-2 animate-bounce">
              <div className="relative">
                <Star className="w-10 h-10 text-yellow-500 fill-yellow-400 drop-shadow-lg" style={{
                  filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.9)) brightness(1.3) saturate(1.2)'
                }} />
                <div className="absolute inset-0 animate-pulse">
                  <Star className="w-10 h-10 text-yellow-300 fill-yellow-200 opacity-50" />
                </div>
              </div>
            </div>
          )}
          <div className="w-20 h-20 bg-green-100 border-2 border-green-300 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-4xl">{funcionario.foto}</span>
          </div>
          <CardTitle className="text-lg font-bold text-slate-800 mb-1">{funcionario.nome}</CardTitle>
          <p className="text-sm text-slate-600 font-medium">{funcionario.cargo}</p>
        </CardHeader>
        <CardContent className="space-y-3 px-6 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Setor:</span>
            <Badge variant="secondary" className="bg-green-200 text-green-800 font-medium px-3 py-1 rounded-full">{funcionario.setor}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <Badge className={`${statusInfo.color} text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm`}>
              {statusInfo.label}
            </Badge>
          </div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <span>📅</span>
            {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
          </div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <span>📞</span>
            {funcionario.telefone}
          </div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-2 truncate">
            <span>📧</span>
            <span className="truncate">{funcionario.email}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-40"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-300 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-250 rounded-full opacity-25"></div>
      </div>

      <div className="relative z-10 py-6 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
          {/* Header */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-4 bg-white/95 backdrop-blur-sm px-12 py-6 rounded-3xl shadow-lg border border-green-300 mb-6">
              <div className="w-16 h-16 bg-green-200 border-2 border-green-300 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-green-700 text-2xl">👥</span>
              </div>
              <div className="text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">Gestão de Funcionários</h1>
                <p className="text-lg text-green-700">Departamento Pessoal</p>
              </div>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Gerencie todos os funcionários da empresa e seus status
            </p>
            <Button 
              variant="outline" 
              onClick={onBack} 
              className="mt-4 border-green-300 text-green-800 hover:bg-green-100"
            >
              ← Voltar ao DP
            </Button>
          </div>

          {/* Resumo com contadores - mais compacto */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border border-green-300 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">
              📊 Resumo da Equipe
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Card className="hover:shadow-md transition-all duration-300 min-w-[140px] border-green-300">
                <CardContent className="text-center p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">{contadores.total}</div>
                  <div className="text-sm font-medium text-slate-600">Funcionários Ativos</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all duration-300 min-w-[140px] border-green-300">
                <CardContent className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{contadores.ferias}</div>
                  <div className="text-sm font-medium text-slate-600">Em Férias</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all duration-300 min-w-[140px] border-green-300">
                <CardContent className="text-center p-4">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">{contadores.experiencia}</div>
                  <div className="text-sm font-medium text-slate-600">Em Experiência</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all duration-300 min-w-[140px] border-red-300 bg-gradient-to-br from-red-50 to-white">
                <CardContent className="text-center p-4">
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
          </div>

          {/* Grid de Funcionários Ativos com Controles */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border border-green-300 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">
                👨‍💼 Funcionários Ativos
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Search Input */}
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                  <Input
                    placeholder="Buscar funcionário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-white/90 border-green-300 shadow-lg rounded-2xl text-lg font-medium focus:border-green-400"
                  />
                </div>
                
                {/* View Mode Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-300 text-green-700 hover:bg-green-100"}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-300 text-green-700 hover:bg-green-100"}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6" : "space-y-4"}>
              {funcionariosAtivos.map((funcionario) => renderFuncionarioCard(funcionario))}
            </div>

            {funcionariosAtivos.length === 0 && (
              <div className="text-center py-16 bg-gradient-to-br from-green-100 to-white rounded-3xl shadow-lg border border-green-300">
                <div className="w-24 h-24 bg-green-200 border-2 border-green-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-green-500 text-4xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-600 mb-3">Nenhum funcionário ativo encontrado</h3>
                <p className="text-slate-500 font-medium">Tente ajustar os filtros de busca</p>
              </div>
            )}
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
