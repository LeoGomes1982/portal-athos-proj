import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Eye, Calendar, MapPin, User, FileCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EscolhaTipoFiscalizacaoModal } from "@/components/modals/EscolhaTipoFiscalizacaoModal";
import { NovaFiscalizacaoModal } from "@/components/modals/NovaFiscalizacaoModal";
import { VisualizarFiscalizacaoModal } from "@/components/modals/VisualizarFiscalizacaoModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Fiscalizacao {
  id: string;
  tipo: string;
  titulo: string;
  data_fiscalizacao: string;
  fiscalizador_nome: string;
  local?: string;
  colaborador_nome?: string;
  resultado: string;
  pontuacao_total: number;
  created_at: string;
}

export function Fiscalizacoes() {
  const [fiscalizacoes, setFiscalizacoes] = useState<Fiscalizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [escolhaTipoModalOpen, setEscolhaTipoModalOpen] = useState(false);
  const [novaFiscalizacaoModalOpen, setNovaFiscalizacaoModalOpen] = useState(false);
  const [tipoFiscalizacao, setTipoFiscalizacao] = useState<'posto_servico' | 'colaborador' | null>(null);
  const [visualizarFiscalizacao, setVisualizarFiscalizacao] = useState<{open: boolean, fiscalizacaoId?: string}>({open: false});
  const { toast } = useToast();

  useEffect(() => {
    buscarFiscalizacoes();
  }, []);

  const buscarFiscalizacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('fiscalizacoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiscalizacoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar fiscalizações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar fiscalizações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarTipo = (tipo: 'posto_servico' | 'colaborador') => {
    setTipoFiscalizacao(tipo);
    setEscolhaTipoModalOpen(false);
    setNovaFiscalizacaoModalOpen(true);
  };

  const calcularResumos = () => {
    const totalFiscalizacoes = fiscalizacoes.length;
    const fiscalizacoesPostos = fiscalizacoes.filter(f => f.tipo === 'posto_servico').length;
    const fiscalizacoesColaboradores = fiscalizacoes.filter(f => f.tipo === 'colaborador').length;
    const fiscalizacoesEsteMes = fiscalizacoes.filter(fiscalizacao => {
      const dataFiscalizacao = new Date(fiscalizacao.data_fiscalizacao);
      const hoje = new Date();
      return dataFiscalizacao.getMonth() === hoje.getMonth() && dataFiscalizacao.getFullYear() === hoje.getFullYear();
    }).length;

    return { totalFiscalizacoes, fiscalizacoesPostos, fiscalizacoesColaboradores, fiscalizacoesEsteMes };
  };

  const { totalFiscalizacoes, fiscalizacoesPostos, fiscalizacoesColaboradores, fiscalizacoesEsteMes } = calcularResumos();

  const getResultadoColor = (resultado: string) => {
    switch (resultado.toLowerCase()) {
      case 'excelente':
        return 'bg-green-100 text-green-800';
      case 'muito bom':
        return 'bg-blue-100 text-blue-800';
      case 'bom':
        return 'bg-yellow-100 text-yellow-800';
      case 'regular':
        return 'bg-orange-100 text-orange-800';
      case 'ruim':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Fiscalizações</h1>
            <p className="text-muted-foreground">Controle e acompanhamento de fiscalizações realizadas</p>
          </div>
        </div>
        <Button onClick={() => setEscolhaTipoModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Fiscalização
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Total de Fiscalizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFiscalizacoes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Postos de Serviço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fiscalizacoesPostos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Colaboradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fiscalizacoesColaboradores}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fiscalizacoesEsteMes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Fiscalizações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Fiscalizações</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : fiscalizacoes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma fiscalização registrada
            </div>
          ) : (
            <div className="space-y-4">
              {fiscalizacoes.map((fiscalizacao) => (
                <div key={fiscalizacao.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{fiscalizacao.titulo}</h3>
                        <Badge variant={fiscalizacao.tipo === 'posto_servico' ? 'default' : 'secondary'}>
                          {fiscalizacao.tipo === 'posto_servico' ? 'Posto de Serviço' : 'Colaborador'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(fiscalizacao.data_fiscalizacao), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        Fiscalizador: {fiscalizacao.fiscalizador_nome}
                      </div>
                      {fiscalizacao.local && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {fiscalizacao.local}
                        </div>
                      )}
                      {fiscalizacao.colaborador_nome && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          Colaborador: {fiscalizacao.colaborador_nome}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getResultadoColor(fiscalizacao.resultado)}>
                        {fiscalizacao.resultado}
                      </Badge>
                      <span className="text-sm font-medium">{fiscalizacao.pontuacao_total} pts</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVisualizarFiscalizacao({open: true, fiscalizacaoId: fiscalizacao.id})}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <EscolhaTipoFiscalizacaoModal
        open={escolhaTipoModalOpen}
        onOpenChange={setEscolhaTipoModalOpen}
        onSelecionarTipo={handleSelecionarTipo}
      />

      <NovaFiscalizacaoModal
        open={novaFiscalizacaoModalOpen}
        onOpenChange={setNovaFiscalizacaoModalOpen}
        tipo={tipoFiscalizacao}
        onFiscalizacaoAdicionada={buscarFiscalizacoes}
      />

      <VisualizarFiscalizacaoModal
        open={visualizarFiscalizacao.open}
        onOpenChange={(open) => setVisualizarFiscalizacao({open})}
        fiscalizacaoId={visualizarFiscalizacao.fiscalizacaoId}
      />
    </div>
  );
}