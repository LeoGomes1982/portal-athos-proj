import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ChevronLeft, Briefcase, Edit, Trash2, Loader2 } from "lucide-react";
import { NovoCargoModal } from "@/components/modals/NovoCargoModal";
import { EditarCargoModal } from "@/components/modals/EditarCargoModal";
import { VisualizarCargoModal } from "@/components/modals/VisualizarCargoModal";
import { useCargos, type Cargo } from "@/hooks/useCargos";

interface PlanosCargosSubsectionProps {
  onBack: () => void;
}

export function PlanosCargosSubsection({ onBack }: PlanosCargosSubsectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNovoCargoModalOpen, setIsNovoCargoModalOpen] = useState(false);
  const [isEditarCargoModalOpen, setIsEditarCargoModalOpen] = useState(false);
  const [isVisualizarCargoModalOpen, setIsVisualizarCargoModalOpen] = useState(false);
  const [cargoSelecionado, setCargoSelecionado] = useState<Cargo | null>(null);

  // Hook para gerenciar cargos com persistência
  const { 
    cargos, 
    isLoading, 
    adicionarCargo, 
    atualizarCargo, 
    excluirCargo 
  } = useCargos();

  const filteredCargos = cargos.filter(cargo =>
    cargo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cargo.nivel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar cargos por nome
  const cargosAgrupados = filteredCargos.reduce((acc, cargo) => {
    if (!acc[cargo.nome]) {
      acc[cargo.nome] = [];
    }
    acc[cargo.nome].push(cargo);
    return acc;
  }, {} as Record<string, Cargo[]>);

  const handleVisualizarCargo = (cargo: Cargo) => {
    setCargoSelecionado(cargo);
    setIsVisualizarCargoModalOpen(true);
  };

  const handleEditarCargo = (cargo: Cargo) => {
    setCargoSelecionado(cargo);
    setIsEditarCargoModalOpen(true);
  };

  const handleExcluirCargo = async (cargoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cargo?')) {
      await excluirCargo(cargoId);
    }
  };

  const handleSalvarCargo = async (cargo: Omit<Cargo, 'id' | 'criadoEm'>) => {
    const sucesso = await adicionarCargo(cargo);
    if (sucesso) {
      setIsNovoCargoModalOpen(false);
    }
  };

  const handleAtualizarCargo = async (cargoAtualizado: Cargo) => {
    const sucesso = await atualizarCargo(cargoAtualizado);
    if (sucesso) {
      setIsEditarCargoModalOpen(false);
      setCargoSelecionado(null);
    }
  };

  const getNivelColor = (nivel: string) => {
    switch(nivel) {
      case 'I': return 'bg-green-500';
      case 'II': return 'bg-blue-500';
      case 'III': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="content-wrapper animate-fade-in bg-purple-100/80 rounded-lg shadow-lg m-6 p-8">
        {/* Navigation Button */}
        <div className="navigation-button">
          <button onClick={onBack} className="back-button">
            <ChevronLeft size={16} />
            Voltar
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Briefcase className="text-white text-3xl w-10 h-10" />
          </div>
          <div>
            <h1 className="page-title mb-0">Planos de Cargos e Salários</h1>
            <p className="text-description">Gestão de cargos, níveis e estrutura salarial</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">💼</div>
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(cargosAgrupados).length}
              </div>
              <div className="text-sm text-purple-600/80 mb-1">Funções Diferentes</div>
              <div className="text-xs text-purple-500 font-medium">
                Tipos de cargos únicos
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-600">
                {cargos.filter(c => c.status === 'ativo').length}
              </div>
              <div className="text-sm text-green-600/80">Cargos Ativos</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold text-blue-600">
                {cargos.length}
              </div>
              <div className="text-sm text-blue-600/80">Total de Níveis</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(cargos.reduce((sum, cargo) => sum + cargo.carencia, 0) / cargos.length) || 0}
              </div>
              <div className="text-sm text-orange-600/80">Carência Média (meses)</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Cargos Agrupados */}
        <Card className="modern-card animate-slide-up bg-white">
          <CardHeader className="card-header">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                💼 Cargos Cadastrados
              </CardTitle>
              
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
                  <Input
                    placeholder="Buscar cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-white border-purple-300 shadow-lg rounded-2xl text-lg font-medium focus:border-purple-400"
                  />
                </div>
                
                {/* Add Button */}
                <Button
                  onClick={() => setIsNovoCargoModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl shadow-lg text-lg font-medium transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Novo Cargo
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="card-content">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="ml-2 text-purple-600 font-medium">Carregando cargos...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(cargosAgrupados).map(([nomeFuncao, cargosGrupo]) => (
                  <div key={nomeFuncao} className="bg-gray-50 rounded-lg p-4 border">
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Briefcase className="text-purple-600 w-5 h-5" />
                    {nomeFuncao}
                  </h3>
                  <div className="space-y-2">
                    {cargosGrupo.map((cargo) => (
                      <div 
                        key={cargo.id}
                        className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-400 bg-white rounded-lg p-3"
                        onClick={() => handleVisualizarCargo(cargo)}
                      >
                        <div className="flex items-center gap-4">
                          {/* Nível */}
                          <div className="flex-shrink-0">
                            <Badge className={`${getNivelColor(cargo.nivel)} text-white text-sm font-medium px-3 py-1 rounded-full shadow-sm`}>
                              Nível {cargo.nivel}
                            </Badge>
                          </div>

                          {/* Detalhes */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-600">Carência: {cargo.carencia} meses</p>
                          </div>

                          {/* Salário */}
                          <div className="flex-shrink-0">
                            <p className="text-lg font-bold text-green-600">{cargo.salarioBase}</p>
                          </div>

                          {/* Status */}
                          <div className="flex-shrink-0">
                            <Badge className={`${cargo.status === 'ativo' ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm`}>
                              {cargo.status === 'ativo' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>

                          {/* Ações */}
                          <div className="flex-shrink-0 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditarCargo(cargo);
                              }}
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExcluirCargo(cargo.id);
                              }}
                              className="hover:bg-red-50 hover:border-red-300 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                ))}
              </div>

              {Object.keys(cargosAgrupados).length === 0 && (
                <div className="text-center py-16 bg-gradient-to-br from-purple-100 to-white rounded-3xl shadow-lg border border-purple-300">
                  <div className="w-24 h-24 bg-purple-200 border-2 border-purple-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Briefcase className="text-purple-500 w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-600 mb-3">Nenhum cargo encontrado</h3>
                  <p className="text-slate-500 font-medium">Tente ajustar os filtros de busca ou crie um novo cargo</p>
                </div>
              )}
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modais */}
      <NovoCargoModal
        isOpen={isNovoCargoModalOpen}
        onClose={() => setIsNovoCargoModalOpen(false)}
        onSave={handleSalvarCargo}
      />

      {cargoSelecionado && (
        <>
          <EditarCargoModal
            isOpen={isEditarCargoModalOpen}
            onClose={() => {
              setIsEditarCargoModalOpen(false);
              setCargoSelecionado(null);
            }}
            cargo={cargoSelecionado}
            onSave={handleAtualizarCargo}
          />

          <VisualizarCargoModal
            isOpen={isVisualizarCargoModalOpen}
            onClose={() => {
              setIsVisualizarCargoModalOpen(false);
              setCargoSelecionado(null);
            }}
            cargo={cargoSelecionado}
            onEdit={() => {
              setIsVisualizarCargoModalOpen(false);
              setIsEditarCargoModalOpen(true);
            }}
          />
        </>
      )}
    </div>
  );
}
