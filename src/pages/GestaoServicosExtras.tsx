import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, Eye, Calendar, User, MapPin, FileText, Clock, DollarSign, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NovoServicoExtraModal } from "@/components/modals/NovoServicoExtraModal";
import { ServicoExtraDetalhesModal } from "@/components/modals/ServicoExtraDetalhesModal";
import { FiltrosServicosExtrasModal, FiltrosServicos } from "@/components/modals/FiltrosServicosExtrasModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";

interface ServicoExtra {
  id: string;
  nome_pessoa: string;
  local_servico: string;
  data_servico: string;
  quantidade_horas: number;
  motivo_servico: string;
  chave_pix: string;
  fiscal_responsavel: string;
  valor?: number;
  created_at: string;
}

export function GestaoServicosExtras() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [servicosExtras, setServicosExtras] = useState<ServicoExtra[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoServicoModalOpen, setNovoServicoModalOpen] = useState(false);
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false);
  const [filtrosModalOpen, setFiltrosModalOpen] = useState(false);
  const [servicosSelecionados, setServicosSelecionados] = useState<ServicoExtra[]>([]);
  const [filtrosAtivos, setFiltrosAtivos] = useState<FiltrosServicos>({
    periodo: "",
    fiscal: "",
    localServico: "",
    cidade: ""
  });

  useEffect(() => {
    fetchServicosExtras();
  }, []);

  const fetchServicosExtras = async () => {
    try {
      const { data, error } = await supabase
        .from('servicos_extras')
        .select('*')
        .order('data_servico', { ascending: false });

      if (error) throw error;
      setServicosExtras(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços extras:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os serviços extras.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNovoServico = () => {
    setNovoServicoModalOpen(true);
  };

  const handleServicoAdicionado = () => {
    fetchServicosExtras();
    setNovoServicoModalOpen(false);
    toast({
      title: "Sucesso",
      description: "Serviço extra adicionado com sucesso.",
    });
  };

  const aplicarFiltrosPeriodo = (servicos: ServicoExtra[]) => {
    if (!filtrosAtivos.periodo) return servicos;

    const agora = new Date();
    
    switch (filtrosAtivos.periodo) {
      case "semana":
        const inicioSemana = startOfWeek(agora, { locale: ptBR });
        const fimSemana = endOfWeek(agora, { locale: ptBR });
        return servicos.filter(servico => 
          isWithinInterval(new Date(servico.data_servico), { start: inicioSemana, end: fimSemana })
        );
      case "mes":
        const inicioMes = startOfMonth(agora);
        const fimMes = endOfMonth(agora);
        return servicos.filter(servico => 
          isWithinInterval(new Date(servico.data_servico), { start: inicioMes, end: fimMes })
        );
      case "personalizado":
        if (filtrosAtivos.dataInicio && filtrosAtivos.dataFim) {
          return servicos.filter(servico => 
            isWithinInterval(new Date(servico.data_servico), { 
              start: filtrosAtivos.dataInicio!, 
              end: filtrosAtivos.dataFim! 
            })
          );
        }
        return servicos;
      default:
        return servicos;
    }
  };

  const filteredServicos = aplicarFiltrosPeriodo(servicosExtras).filter(servico => {
    const matchesSearch = servico.nome_pessoa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.local_servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.motivo_servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.fiscal_responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFiscal = !filtrosAtivos.fiscal || servico.fiscal_responsavel === filtrosAtivos.fiscal;
    const matchesLocal = !filtrosAtivos.localServico || servico.local_servico === filtrosAtivos.localServico;
    const matchesCidade = !filtrosAtivos.cidade || 
      servico.local_servico.toLowerCase().includes(filtrosAtivos.cidade.toLowerCase());
    
    return matchesSearch && matchesFiscal && matchesLocal && matchesCidade;
  });

  const handleAbrirDetalhes = (servico?: ServicoExtra) => {
    if (servico) {
      // Se um serviço específico foi clicado, mostrar apenas ele
      setServicosSelecionados([servico]);
    } else {
      // Se não foi especificado, mostrar todos os serviços filtrados
      setServicosSelecionados(filteredServicos);
    }
    setDetalhesModalOpen(true);
  };

  const handleAplicarFiltros = (filtros: FiltrosServicos) => {
    setFiltrosAtivos(filtros);
  };

  const handleGerarRelatorio = (filtros: FiltrosServicos) => {
    const servicosFiltrados = aplicarFiltrosPeriodo(servicosExtras).filter(servico => {
      const matchesFiscal = !filtros.fiscal || servico.fiscal_responsavel === filtros.fiscal;
      const matchesLocal = !filtros.localServico || servico.local_servico === filtros.localServico;
      const matchesCidade = !filtros.cidade || 
        servico.local_servico.toLowerCase().includes(filtros.cidade.toLowerCase());
      
      return matchesFiscal && matchesLocal && matchesCidade;
    });

    gerarRelatorioPDF(servicosFiltrados, filtros);
  };

  const gerarRelatorioPDF = (servicos: ServicoExtra[], filtros: FiltrosServicos) => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text('Relatório de Serviços Extras', 20, 20);
    
    // Informações dos filtros
    doc.setFontSize(12);
    let yPos = 40;
    
    if (filtros.periodo) {
      doc.text(`Período: ${filtros.periodo}`, 20, yPos);
      yPos += 10;
    }
    if (filtros.fiscal) {
      doc.text(`Fiscal: ${filtros.fiscal}`, 20, yPos);
      yPos += 10;
    }
    if (filtros.localServico) {
      doc.text(`Local: ${filtros.localServico}`, 20, yPos);
      yPos += 10;
    }
    if (filtros.cidade) {
      doc.text(`Cidade: ${filtros.cidade}`, 20, yPos);
      yPos += 10;
    }
    
    yPos += 10;
    
    // Cabeçalho da tabela
    doc.setFontSize(10);
    doc.text('Nome', 20, yPos);
    doc.text('Local', 60, yPos);
    doc.text('Fiscal', 100, yPos);
    doc.text('PIX', 130, yPos);
    doc.text('Horas', 170, yPos);
    doc.text('Valor', 190, yPos);
    
    yPos += 5;
    doc.line(20, yPos, 200, yPos);
    yPos += 10;
    
    // Dados
    servicos.forEach((servico) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      const valorPorHora = servico.valor ? servico.valor / servico.quantidade_horas : 0;
      
      doc.text(servico.nome_pessoa.substring(0, 15), 20, yPos);
      doc.text(servico.local_servico.substring(0, 15), 60, yPos);
      doc.text(servico.fiscal_responsavel.substring(0, 12), 100, yPos);
      doc.text(servico.chave_pix.substring(0, 12), 130, yPos);
      doc.text(`${servico.quantidade_horas}h`, 170, yPos);
      doc.text(`R$ ${valorPorHora.toFixed(2)}`, 190, yPos);
      
      yPos += 8;
    });
    
    // Totais
    const totalHoras = servicos.reduce((acc, s) => acc + s.quantidade_horas, 0);
    const totalValor = servicos.reduce((acc, s) => acc + (s.valor || 0), 0);
    
    yPos += 10;
    doc.line(20, yPos, 200, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Total de Horas: ${totalHoras}h`, 20, yPos);
    doc.text(`Valor Total: R$ ${totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 120, yPos);
    
    doc.save('relatorio-servicos-extras.pdf');
  };

  // Extrair listas únicas para os filtros
  const fiscaisUnicos = [...new Set(servicosExtras.map(s => s.fiscal_responsavel))].sort();
  const locaisUnicos = [...new Set(servicosExtras.map(s => s.local_servico))].sort();
  const cidadesUnicas = [...new Set(servicosExtras.map(s => {
    // Extrair possíveis cidades dos nomes dos locais
    const local = s.local_servico.toLowerCase();
    if (local.includes('brasília') || local.includes('brasilia')) return 'Brasília';
    if (local.includes('goiânia') || local.includes('goiania')) return 'Goiânia';
    if (local.includes('anápolis') || local.includes('anapolis')) return 'Anápolis';
    return 'Outras';
  }))].sort();

  const totalServicos = servicosExtras.length;
  const totalHoras = servicosExtras.reduce((acc, servico) => acc + servico.quantidade_horas, 0);
  const totalValor = servicosExtras.reduce((acc, servico) => acc + (servico.valor || 0), 0);
  const servicosEsteAno = servicosExtras.filter(servico => 
    new Date(servico.data_servico).getFullYear() === new Date().getFullYear()
  ).length;

  return (
    <>
      {/* Page Header */}
      <div className="page-header-centered">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <Briefcase className="text-white text-3xl" size={40} />
        </div>
        <div>
          <h1 className="page-title mb-0">Gestão de Serviços Extras</h1>
          <p className="text-description">Controle de serviços extras, horas trabalhadas e pagamentos</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
        <Card className="modern-card bg-white border-gray-200">
          <CardContent className="card-content text-center p-4">
            <div className="text-3xl mb-2">💼</div>
            <div className="text-2xl font-bold text-green-700">
              {totalServicos}
            </div>
            <div className="text-sm text-green-600 mb-1">Total de Serviços</div>
            <div className="text-xs text-green-500 font-medium">
              Registros totais
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card bg-white border-gray-200">
          <CardContent className="card-content text-center p-4">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-2xl font-bold text-green-700">
              {totalHoras}h
            </div>
            <div className="text-sm text-green-600">Total de Horas</div>
          </CardContent>
        </Card>

        <Card className="modern-card bg-white border-gray-200">
          <CardContent className="card-content text-center p-4">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-green-700">
              R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-green-600">Valor Total</div>
          </CardContent>
        </Card>

        <Card className="modern-card bg-white border-gray-200">
          <CardContent className="card-content text-center p-4">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-green-700">
              {servicosEsteAno}
            </div>
            <div className="text-sm text-green-600">Este Ano</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-description" size={20} />
            <Input
              placeholder="Buscar por pessoa, local, motivo ou fiscal responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline"
            onClick={() => setFiltrosModalOpen(true)}
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            <Filter className="mr-2" size={16} />
            Filtros
            {(filtrosAtivos.periodo || filtrosAtivos.fiscal || filtrosAtivos.localServico || filtrosAtivos.cidade) && (
              <Badge className="ml-2 bg-primary text-white">•</Badge>
            )}
          </Button>
          <Button 
            onClick={handleNovoServico}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="mr-2" size={16} />
            Novo Serviço Extra
          </Button>
        </div>

      {/* Serviços List - Formato Lista */}
      <div className="space-y-4 animate-slide-up">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-description mt-2">Carregando serviços extras...</p>
          </div>
        ) : filteredServicos.length === 0 ? (
          <Card className="modern-card">
            <CardContent className="p-8 text-center">
              <Briefcase className="mx-auto mb-4 text-description" size={48} />
              <h3 className="subsection-title mb-2">Nenhum serviço extra encontrado</h3>
              <p className="text-description mb-4">
                {searchTerm || filtrosAtivos.periodo || filtrosAtivos.fiscal || filtrosAtivos.localServico || filtrosAtivos.cidade
                  ? "Tente ajustar os filtros de busca." 
                  : "Comece criando seu primeiro serviço extra."}
              </p>
              {!searchTerm && !filtrosAtivos.periodo && (
                <Button onClick={handleNovoServico} variant="outline">
                  <Plus className="mr-2" size={16} />
                  Criar Primeiro Serviço
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-primary" size={20} />
                Lista de Serviços Extras ({filteredServicos.length} registros)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredServicos.map((servico, index) => (
                  <div key={servico.id} className="border rounded-lg p-3 bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                       onClick={() => handleAbrirDetalhes(servico)}>
                    
                    {/* Primeira linha - Nome e Horas */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                        <h4 className="font-semibold flex items-center gap-2 text-sm">
                          <User size={14} />
                          {servico.nome_pessoa}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {servico.quantidade_horas}h
                        </Badge>
                        {servico.valor && (
                          <span className="text-sm font-semibold text-green-600">
                            R$ {servico.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Segunda linha - Data, Local e Motivo */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{format(new Date(servico.data_servico), "dd/MM/yyyy", { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span className="truncate max-w-[150px]">{servico.local_servico}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-1">
                        <FileText size={12} />
                        <span className="truncate">{servico.motivo_servico}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <NovoServicoExtraModal
        open={novoServicoModalOpen}
        onOpenChange={setNovoServicoModalOpen}
        onServicoAdicionado={handleServicoAdicionado}
      />

      <ServicoExtraDetalhesModal
        servicos={servicosSelecionados}
        open={detalhesModalOpen}
        onOpenChange={setDetalhesModalOpen}
      />

      <FiltrosServicosExtrasModal
        open={filtrosModalOpen}
        onOpenChange={setFiltrosModalOpen}
        onAplicarFiltros={handleAplicarFiltros}
        onGerarRelatorio={handleGerarRelatorio}
        fiscais={fiscaisUnicos}
        locais={locaisUnicos}
        cidades={cidadesUnicas}
      />
    </>
  );
}