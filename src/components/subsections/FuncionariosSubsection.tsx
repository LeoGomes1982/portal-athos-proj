
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Search } from "lucide-react";

interface FuncionariosSubsectionProps {
  onBack: () => void;
}

// Dados mockados de funcionários
const funcionarios = [
  {
    id: 1,
    nome: "Ana Silva",
    cargo: "Analista de Sistemas",
    setor: "TI",
    dataAdmissao: "2023-01-15",
    telefone: "(11) 99999-1111",
    email: "ana.silva@empresa.com",
    foto: "👩‍💻",
    status: "Ativo"
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
    status: "Ativo"
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
    status: "Ativo"
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
    status: "Ativo"
  }
];

export function FuncionariosSubsection({ onBack }: FuncionariosSubsectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredFuncionarios = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-gray-600">Total Funcionários</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">TI</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">6</div>
            <div className="text-sm text-gray-600">Comercial</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">10</div>
            <div className="text-sm text-gray-600">Outros Setores</div>
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
          {filteredFuncionarios.map((funcionario) => (
            <Card key={funcionario.id} className="hover:shadow-lg transition-shadow cursor-pointer">
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
          ))}
        </div>
      ) : (
        /* Lista de Funcionários */
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredFuncionarios.map((funcionario, index) => (
                <div
                  key={funcionario.id}
                  className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${
                    index !== filteredFuncionarios.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{funcionario.foto}</div>
                    <div>
                      <div className="font-medium">{funcionario.nome}</div>
                      <div className="text-sm text-gray-600">{funcionario.cargo}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{funcionario.setor}</Badge>
                    <div className="text-sm text-gray-500 hidden md:block">
                      {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-sm text-gray-500 hidden lg:block">
                      {funcionario.telefone}
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  );
}
