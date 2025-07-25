
import { ChevronLeft, ClipboardCheck, TrendingUp, Plus, Users, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NovaAvaliacaoModal } from "@/components/modals/NovaAvaliacaoModal";
import { VisualizarAvaliacaoModal } from "@/components/modals/VisualizarAvaliacaoModal";
import { useAvaliacoes } from "@/hooks/useAvaliacoes";

interface ResultadosPessoaisSubsectionProps {
  onBack: () => void;
}

export function ResultadosPessoaisSubsection({ onBack }: ResultadosPessoaisSubsectionProps) {
  const [novaAvaliacaoModalOpen, setNovaAvaliacaoModalOpen] = useState(false);
  const [visualizarAvaliacaoModal, setVisualizarAvaliacaoModal] = useState<{open: boolean, avaliacaoId?: string}>({open: false});
  const { avaliacoes, loading } = useAvaliacoes();

  // Agrupar avaliações por funcionário
  const avaliacoesPorFuncionario = avaliacoes.reduce((acc, avaliacao) => {
    if (!acc[avaliacao.funcionario_nome]) {
      acc[avaliacao.funcionario_nome] = [];
    }
    acc[avaliacao.funcionario_nome].push(avaliacao);
    return acc;
  }, {} as Record<string, typeof avaliacoes>);

  // Calcular estatísticas
  const totalAvaliacoes = avaliacoes.length;
  const avaliacoesPositivas = avaliacoes.filter(a => a.resultado === 'POSITIVO').length;
  const avaliacoesNegativas = avaliacoes.filter(a => a.resultado === 'NEGATIVO').length;
  const funcionariosAvaliados = Object.keys(avaliacoesPorFuncionario).length;

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
            <span className="text-white text-3xl">📈</span>
          </div>
          <div>
            <h1 className="page-title mb-0">Resultados Pessoais</h1>
            <p className="text-description">Acompanhamento de performance e metas individuais</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-gray-700">
                {totalAvaliacoes}
              </div>
              <div className="text-sm text-gray-600 mb-1">Total de Avaliações</div>
              <div className="text-xs text-gray-500 font-medium">
                Registros totais
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-700">
                {avaliacoesPositivas}
              </div>
              <div className="text-sm text-gray-600">Avaliações Positivas</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">❌</div>
              <div className="text-2xl font-bold text-gray-700">
                {avaliacoesNegativas}
              </div>
              <div className="text-sm text-gray-600">Avaliações Negativas</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-gray-700">
                {funcionariosAvaliados}
              </div>
              <div className="text-sm text-gray-600">Funcionários Avaliados</div>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 mt-8">
          <Button 
            onClick={() => setNovaAvaliacaoModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus size={16} className="mr-2" />
            Nova Avaliação
          </Button>
          <Button 
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <TrendingUp size={16} className="mr-2" />
            Gráfico de Evolução
          </Button>
        </div>

        {/* Lista de Avaliações por Funcionário */}
        <Card className="bg-white shadow-lg border-slate-200 mt-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-800">Avaliações de Desempenho</CardTitle>
            <p className="text-sm text-slate-600">Lista de avaliações organizadas por funcionário</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {loading ? (
                <p className="text-slate-600 text-center py-8">Carregando avaliações...</p>
              ) : Object.keys(avaliacoesPorFuncionario).length === 0 ? (
                <p className="text-slate-600 text-center py-8">Nenhuma avaliação cadastrada</p>
              ) : (
                Object.entries(avaliacoesPorFuncionario).map(([funcionario, avaliacoesFuncionario]) => (
                  <div key={funcionario} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Users size={20} className="text-purple-600" />
                      <h3 className="text-lg font-semibold text-slate-800">{funcionario}</h3>
                      <Badge variant="secondary" className="ml-auto">
                        {avaliacoesFuncionario.length} avaliação{avaliacoesFuncionario.length !== 1 ? 'ões' : ''}
                      </Badge>
                    </div>
                    <div className="grid gap-3">
                      {avaliacoesFuncionario
                        .sort((a, b) => new Date(b.data_avaliacao).getTime() - new Date(a.data_avaliacao).getTime())
                        .map((avaliacao) => (
                        <div key={avaliacao.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <ClipboardCheck size={16} className="text-slate-600" />
                            <div>
                              <p className="font-medium text-slate-800 capitalize">{avaliacao.tipo_avaliacao}</p>
                              <p className="text-sm text-slate-600">
                                {new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR')} • por {avaliacao.avaliador_nome}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={avaliacao.resultado === 'POSITIVO' ? 'default' : 
                                     avaliacao.resultado === 'NEGATIVO' ? 'destructive' : 'secondary'}
                            >
                              {avaliacao.resultado}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setVisualizarAvaliacaoModal({open: true, avaliacaoId: avaliacao.id})}
                            >
                              <Eye size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        <NovaAvaliacaoModal 
          open={novaAvaliacaoModalOpen}
          onOpenChange={setNovaAvaliacaoModalOpen}
        />
        
        <VisualizarAvaliacaoModal
          open={visualizarAvaliacaoModal.open}
          onOpenChange={(open) => setVisualizarAvaliacaoModal({open, avaliacaoId: undefined})}
          avaliacaoId={visualizarAvaliacaoModal.avaliacaoId}
        />
      </div>
    </div>
  );
}
