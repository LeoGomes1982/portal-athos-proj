
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

  return (
    <div className="min-h-screen bg-white">
      <div className="content-wrapper animate-fade-in bg-blue-100/80 rounded-lg shadow-lg m-6 p-8">
        {/* Navigation Button */}
        <div className="navigation-button">
          <button onClick={onBack} className="back-button">
            <ChevronLeft size={16} />
            Voltar
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white text-3xl">📈</span>
          </div>
          <div>
            <h1 className="page-title mb-0">Resultados Pessoais</h1>
            <p className="text-description">Acompanhamento de performance e metas individuais</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Avaliações de Desempenho */}
          <Card className="bg-white shadow-lg border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <ClipboardCheck size={24} className="text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-800">Avaliações de Desempenho</CardTitle>
                    <p className="text-sm text-slate-600">Gestão de avaliações dos funcionários</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setNovaAvaliacaoModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus size={16} className="mr-2" />
                  Nova Avaliação
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-slate-600 text-center py-8">Carregando avaliações...</p>
                ) : avaliacoes.length === 0 ? (
                  <p className="text-slate-600 text-center py-8">Nenhuma avaliação cadastrada</p>
                ) : (
                  avaliacoes.slice(0, 5).map((avaliacao) => (
                    <div key={avaliacao.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Users size={16} className="text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-800">{avaliacao.funcionario_nome}</p>
                          <p className="text-sm text-slate-600">
                            {avaliacao.tipo_avaliacao} • {new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR')}
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
                  ))
                )}
                {avaliacoes.length > 5 && (
                  <Button variant="outline" className="w-full">
                    Ver todas as avaliações ({avaliacoes.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Evolução */}
          <Card className="bg-white shadow-lg border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-800">Gráfico de Evolução</CardTitle>
                  <p className="text-sm text-slate-600">Acompanhamento da evolução dos funcionários</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <TrendingUp size={48} className="text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Gráfico de evolução em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </div>

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
