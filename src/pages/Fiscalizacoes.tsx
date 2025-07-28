import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Eye, Calendar, MapPin, User, FileCheck, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  observacoes?: string;
  pontuacao_total?: number;
  created_at: string;
}

export function Fiscalizacoes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [fiscalizacoes, setFiscalizacoes] = useState<Fiscalizacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [escolhaTipoModalOpen, setEscolhaTipoModalOpen] = useState(false);
  const [novaFiscalizacaoModalOpen, setNovaFiscalizacaoModalOpen] = useState(false);
  const [visualizarModalOpen, setVisualizarModalOpen] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("");
  const [fiscalizacaoSelecionada, setFiscalizacaoSelecionada] = useState<Fiscalizacao | null>(null);

  useEffect(() => {
    fetchFiscalizacoes();
  }, []);

  const fetchFiscalizacoes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('fiscalizacoes')
        .select('*')
        .order('data_fiscalizacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar fiscalizações:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as fiscalizações.",
          variant: "destructive",
        });
        return;
      }

      setFiscalizacoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar fiscalizações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as fiscalizações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNovaFiscalizacao = () => {
    setEscolhaTipoModalOpen(true);
  };

  const handleTipoSelecionado = (tipo: string) => {
    setTipoSelecionado(tipo);
    setEscolhaTipoModalOpen(false);
    setNovaFiscalizacaoModalOpen(true);
  };

  const handleFiscalizacaoAdicionada = () => {
    fetchFiscalizacoes();
    setNovaFiscalizacaoModalOpen(false);
    toast({
      title: "Sucesso",
      description: "Fiscalização registrada com sucesso.",
    });
  };

  const handleVisualizarFiscalizacao = (fiscalizacao: Fiscalizacao) => {
    setFiscalizacaoSelecionada(fiscalizacao);
    setVisualizarModalOpen(true);
  };

  const getStatusColor = (status: string = 'pendente') => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'reprovado':
        return 'bg-red-100 text-red-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calcularResumo = () => {
    const totalFiscalizacoes = fiscalizacoes.length;
    const fiscalizacoesPosto = fiscalizacoes.filter(f => f.tipo === 'posto_servico').length;
    const fiscalizacoesColaborador = fiscalizacoes.filter(f => f.tipo === 'colaborador').length;
    const aprovadas = fiscalizacoes.filter(f => f.pontuacao_total && f.pontuacao_total >= 70).length;
    
    return { totalFiscalizacoes, fiscalizacoesPosto, fiscalizacoesColaborador, aprovadas };
  };

  const resumo = calcularResumo();

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Início
        </Button>
        
        {/* Page Title */}
        <div className="page-header">
          <div className="page-header-icon">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="page-title">Fiscalizações</h1>
            <p className="text-description">Fiscalização de postos de serviço e colaboradores</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <Button onClick={handleNovaFiscalizacao} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Fiscalização
          </Button>
        </div>

        {/* Resumo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumo.totalFiscalizacoes}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Postos</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumo.fiscalizacoesPosto}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumo.fiscalizacoesColaborador}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumo.aprovadas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Fiscalizações */}
        <Card>
          <CardHeader>
            <CardTitle>Fiscalizações Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Carregando...</p>
              </div>
            ) : fiscalizacoes.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma fiscalização registrada ainda.</p>
                <Button 
                  onClick={handleNovaFiscalizacao}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Primeira Fiscalização
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {fiscalizacoes.map((fiscalizacao) => (
                  <div key={fiscalizacao.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{fiscalizacao.titulo}</h3>
                        <p className="text-sm text-gray-600">
                          {fiscalizacao.tipo === 'posto_servico' ? 'Fiscalização de Posto' : 'Fiscalização de Colaborador'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(fiscalizacao.pontuacao_total && fiscalizacao.pontuacao_total >= 70 ? 'aprovado' : 'pendente')}>
                          {fiscalizacao.pontuacao_total && fiscalizacao.pontuacao_total >= 70 ? 'Aprovado' : 'Pendente'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVisualizarFiscalizacao(fiscalizacao)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(fiscalizacao.data_fiscalizacao), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{fiscalizacao.fiscalizador_nome}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {fiscalizacao.tipo === 'posto_servico' ? (
                          <>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{fiscalizacao.local}</span>
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{fiscalizacao.colaborador_nome}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {fiscalizacao.pontuacao_total && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium">
                          Pontuação: {fiscalizacao.pontuacao_total}/100
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modais */}
        <EscolhaTipoFiscalizacaoModal
          open={escolhaTipoModalOpen}
          onOpenChange={setEscolhaTipoModalOpen}
          onSelecionarTipo={(tipo) => handleTipoSelecionado(tipo)}
        />

        <NovaFiscalizacaoModal
          open={novaFiscalizacaoModalOpen}
          onOpenChange={setNovaFiscalizacaoModalOpen}
          tipo={tipoSelecionado as 'colaborador' | 'posto_servico'}
          onFiscalizacaoAdicionada={handleFiscalizacaoAdicionada}
        />

        {fiscalizacaoSelecionada && (
          <VisualizarFiscalizacaoModal
            open={visualizarModalOpen}
            onOpenChange={setVisualizarModalOpen}
            fiscalizacaoId={fiscalizacaoSelecionada.id}
          />
        )}
      </div>
    </div>
  );
}