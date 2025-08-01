import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, ChevronLeft, Shield, Eye, Calendar, User, MapPin, FileCheck, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { NovaFiscalizacaoModal } from "@/components/modals/NovaFiscalizacaoModal";
import { VisualizarFiscalizacaoModal } from "@/components/modals/VisualizarFiscalizacaoModal";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Fiscalizacao {
  id: string;
  tipo: 'posto_servico' | 'colaborador';
  titulo: string;
  data_fiscalizacao: string;
  fiscalizador_nome: string;
  local?: string;
  colaborador_nome?: string;
  observacoes?: string;
  pontuacao_total: number;
}

export default function Fiscalizacoes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [fiscalizacoes, setFiscalizacoes] = useState<Fiscalizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [novaFiscalizacaoModalOpen, setNovaFiscalizacaoModalOpen] = useState(false);
  const [visualizarModalOpen, setVisualizarModalOpen] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<'posto_servico' | 'colaborador'>('posto_servico');
  const [fiscalizacaoSelecionada, setFiscalizacaoSelecionada] = useState<string>("");

  useEffect(() => {
    fetchFiscalizacoes();
  }, []);

  const fetchFiscalizacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('fiscalizacoes')
        .select('*')
        .order('data_fiscalizacao', { ascending: false });

      if (error) throw error;
      setFiscalizacoes(data?.map(f => ({
        ...f,
        tipo: f.tipo as 'posto_servico' | 'colaborador'
      })) || []);
    } catch (error) {
      console.error('Erro ao buscar fiscalizações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovaFiscalizacao = () => {
    setTipoSelecionado('posto_servico');
    setNovaFiscalizacaoModalOpen(true);
  };

  const handleFiscalizacaoAdicionada = () => {
    fetchFiscalizacoes();
    setNovaFiscalizacaoModalOpen(false);
  };

  const handleVisualizarFiscalizacao = (fiscalizacaoId: string) => {
    setFiscalizacaoSelecionada(fiscalizacaoId);
    setVisualizarModalOpen(true);
  };

  const filteredFiscalizacoes = fiscalizacoes.filter(fiscalizacao =>
    fiscalizacao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fiscalizacao.fiscalizador_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (fiscalizacao.local && fiscalizacao.local.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (fiscalizacao.colaborador_nome && fiscalizacao.colaborador_nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Agrupar fiscalizações por local/colaborador
  const fiscalizacoesPorEntidade = filteredFiscalizacoes.reduce((acc, fiscalizacao) => {
    const chave = fiscalizacao.tipo === 'posto_servico' 
      ? fiscalizacao.local || 'Local não informado'
      : fiscalizacao.colaborador_nome || 'Colaborador não informado';
    
    if (!acc[chave]) {
      acc[chave] = {
        tipo: fiscalizacao.tipo,
        fiscalizacoes: []
      };
    }
    acc[chave].fiscalizacoes.push(fiscalizacao);
    return acc;
  }, {} as Record<string, { tipo: 'posto_servico' | 'colaborador', fiscalizacoes: Fiscalizacao[] }>);

  const getStatusColor = (pontuacao: number) => {
    if (pontuacao >= 90) return "text-green-600 bg-green-100";
    if (pontuacao >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const totalFiscalizacoes = fiscalizacoes.length;
  const fiscalizacoesPostoServico = fiscalizacoes.filter(f => f.tipo === 'posto_servico').length;
  const fiscalizacoesColaborador = fiscalizacoes.filter(f => f.tipo === 'colaborador').length;
  const fiscalizacoesAprovadas = fiscalizacoes.filter(f => f.pontuacao_total >= 70).length;

  return (
    <div className="app-container">
      <div className="content-wrapper animate-fade-in">
        {/* Navigation Button */}
        <div className="navigation-button">
          <button onClick={() => navigate('/operacoes')} className="back-button">
            <ChevronLeft size={16} />
            Voltar
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Shield className="text-white text-3xl" size={40} />
          </div>
          <div>
            <h1 className="page-title mb-0">Fiscalizações</h1>
            <p className="text-description">Controle de fiscalizações de postos de serviço e colaboradores</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-description">Total de Fiscalizações</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary">{totalFiscalizacoes}</div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-description">Postos de Serviço</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-blue-600">{fiscalizacoesPostoServico}</div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-description">Colaboradores</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-purple-600">{fiscalizacoesColaborador}</div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-description">Aprovadas (≥70%)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-green-600">{fiscalizacoesAprovadas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-description" size={20} />
            <Input
              placeholder="Buscar por título, fiscalizador, local ou colaborador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleNovaFiscalizacao}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="mr-2" size={16} />
            Nova Fiscalização
          </Button>
        </div>

        {/* Fiscalizações List */}
        <div className="space-y-6 animate-slide-up">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-description mt-2">Carregando fiscalizações...</p>
            </div>
          ) : Object.keys(fiscalizacoesPorEntidade).length === 0 ? (
            <Card className="modern-card">
              <CardContent className="p-8 text-center">
                <Shield className="mx-auto mb-4 text-description" size={48} />
                <h3 className="subsection-title mb-2">Nenhuma fiscalização encontrada</h3>
                <p className="text-description mb-4">
                  {searchTerm ? "Tente ajustar os filtros de busca." : "Comece criando sua primeira fiscalização."}
                </p>
                {!searchTerm && (
                  <Button onClick={handleNovaFiscalizacao} variant="outline">
                    <Plus className="mr-2" size={16} />
                    Criar Primeira Fiscalização
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            Object.entries(fiscalizacoesPorEntidade).map(([entidade, { tipo, fiscalizacoes }]) => (
              <Card key={entidade} className="modern-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {tipo === 'posto_servico' ? (
                      <MapPin className="text-blue-600" size={24} />
                    ) : (
                      <User className="text-purple-600" size={24} />
                    )}
                    <div>
                      <CardTitle className="text-lg">{entidade}</CardTitle>
                      <p className="text-sm text-description">
                        {fiscalizacoes.length} fiscalização{fiscalizacoes.length !== 1 ? 'ões' : ''}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fiscalizacoes.map((fiscalizacao) => (
                      <div key={fiscalizacao.id} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{fiscalizacao.titulo}</h4>
                            <Badge className={`${getStatusColor(fiscalizacao.pontuacao_total)} border-0`}>
                              {fiscalizacao.pontuacao_total}%
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-description">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {format(new Date(fiscalizacao.data_fiscalizacao), "dd/MM/yyyy", { locale: ptBR })}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileCheck size={14} />
                              {fiscalizacao.fiscalizador_nome}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVisualizarFiscalizacao(fiscalizacao.id)}
                        >
                          <Eye size={16} className="mr-1" />
                          Ver Detalhes
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <NovaFiscalizacaoModal
        open={novaFiscalizacaoModalOpen}
        onOpenChange={setNovaFiscalizacaoModalOpen}
        tipo={tipoSelecionado}
        onFiscalizacaoAdicionada={handleFiscalizacaoAdicionada}
      />

      <VisualizarFiscalizacaoModal
        open={visualizarModalOpen}
        onOpenChange={setVisualizarModalOpen}
        fiscalizacaoId={fiscalizacaoSelecionada}
      />
    </div>
  );
}