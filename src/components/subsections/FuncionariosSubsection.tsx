
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Search } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-blue-600">👥 Funcionários Ativos</h1>
      </div>

      {/* Resumo com novos contadores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{contadores.total}</div>
            <div className="text-sm text-gray-600">Total Funcionários</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{contadores.ferias}</div>
            <div className="text-sm text-gray-600">🏖️ Em Férias</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-yellow-600">{contadores.experiencia}</div>
            <div className="text-sm text-gray-600">🆕 Em Experiência</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">{contadores.aviso}</div>
            <div className="text-sm text-gray-600">⚠️ Em Aviso Prévio</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar funcionário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            📱 Quadros
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            📋 Lista
          </Button>
        </div>
      </div>

      {/* Grid de Funcionários */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFuncionarios.map((funcionario) => {
            const statusInfo = statusConfig[funcionario.status];
            return (
              <Card 
                key={funcionario.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleFuncionarioClick(funcionario)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="text-6xl mb-2">{funcionario.foto}</div>
                  <CardTitle className="text-lg">{funcionario.nome}</CardTitle>
                  <p className="text-sm text-gray-600">{funcionario.cargo}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Setor:</span>
                    <Badge variant="secondary">{funcionario.setor}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status:</span>
                    <Badge className={`${statusInfo.color} text-white text-xs`}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    📅 {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-xs text-gray-500">
                    📞 {funcionario.telefone}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    📧 {funcionario.email}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Lista de Funcionários */
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredFuncionarios.map((funcionario, index) => {
                const statusInfo = statusConfig[funcionario.status];
                return (
                  <div
                    key={funcionario.id}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${
                      index !== filteredFuncionarios.length - 1 ? 'border-b' : ''
                    }`}
                    onClick={() => handleFuncionarioClick(funcionario)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{funcionario.foto}</div>
                      <div>
                        <div className="font-medium">{funcionario.nome}</div>
                        <div className="text-sm text-gray-600">{funcionario.cargo}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`${statusInfo.color} text-white`}>
                        {statusInfo.label}
                      </Badge>
                      <Badge variant="secondary">{funcionario.setor}</Badge>
                      <div className="text-sm text-gray-500 hidden md:block">
                        {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-500 hidden lg:block">
                        {funcionario.telefone}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredFuncionarios.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhum funcionário encontrado</h3>
          <p className="text-gray-500">Tente ajustar os filtros de busca</p>
        </div>
      )}

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
