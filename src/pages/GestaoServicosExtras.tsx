import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, ChevronLeft, Briefcase, Eye, Calendar, User, MapPin, FileText, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NovoServicoExtraModal } from "@/components/modals/NovoServicoExtraModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const filteredServicos = servicosExtras.filter(servico =>
    servico.nome_pessoa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.local_servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.motivo_servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.fiscal_responsavel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar serviços por pessoa
  const servicosPorPessoa = filteredServicos.reduce((acc, servico) => {
    const chave = servico.nome_pessoa;
    
    if (!acc[chave]) {
      acc[chave] = [];
    }
    acc[chave].push(servico);
    return acc;
  }, {} as Record<string, ServicoExtra[]>);

  const totalServicos = servicosExtras.length;
  const totalHoras = servicosExtras.reduce((acc, servico) => acc + servico.quantidade_horas, 0);
  const totalValor = servicosExtras.reduce((acc, servico) => acc + (servico.valor || 0), 0);
  const servicosEsteAno = servicosExtras.filter(servico => 
    new Date(servico.data_servico).getFullYear() === new Date().getFullYear()
  ).length;

  return (
    <div className="min-h-screen">
      <div className="content-wrapper animate-fade-in bg-green-100/80 rounded-lg shadow-lg m-6 p-8">
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
              <div className="text-2xl font-bold text-gray-700">
                {totalServicos}
              </div>
              <div className="text-sm text-gray-600 mb-1">Total de Serviços</div>
              <div className="text-xs text-gray-500 font-medium">
                Registros totais
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">⏰</div>
              <div className="text-2xl font-bold text-gray-700">
                {totalHoras}h
              </div>
              <div className="text-sm text-gray-600">Total de Horas</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-gray-700">
                R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-gray-600">Valor Total</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold text-gray-700">
                {servicosEsteAno}
              </div>
              <div className="text-sm text-gray-600">Este Ano</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add Section */}
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
            onClick={handleNovoServico}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="mr-2" size={16} />
            Novo Serviço Extra
          </Button>
        </div>

        {/* Serviços List */}
        <div className="space-y-6 animate-slide-up">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-description mt-2">Carregando serviços extras...</p>
            </div>
          ) : Object.keys(servicosPorPessoa).length === 0 ? (
            <Card className="modern-card">
              <CardContent className="p-8 text-center">
                <Briefcase className="mx-auto mb-4 text-description" size={48} />
                <h3 className="subsection-title mb-2">Nenhum serviço extra encontrado</h3>
                <p className="text-description mb-4">
                  {searchTerm ? "Tente ajustar os filtros de busca." : "Comece criando seu primeiro serviço extra."}
                </p>
                {!searchTerm && (
                  <Button onClick={handleNovoServico} variant="outline">
                    <Plus className="mr-2" size={16} />
                    Criar Primeiro Serviço
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            Object.entries(servicosPorPessoa).map(([pessoa, servicos]) => (
              <Card key={pessoa} className="modern-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <User className="text-green-600" size={24} />
                    <div>
                      <CardTitle className="text-lg">{pessoa}</CardTitle>
                      <p className="text-sm text-description">
                        {servicos.length} serviço{servicos.length !== 1 ? 's' : ''} extra{servicos.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {servicos.map((servico) => (
                      <div key={servico.id} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{servico.motivo_servico}</h4>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              {servico.quantidade_horas}h
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-description">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {format(new Date(servico.data_servico), "dd/MM/yyyy", { locale: ptBR })}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              {servico.local_servico}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText size={14} />
                              {servico.fiscal_responsavel}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign size={14} />
                              {servico.chave_pix}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {servico.valor && (
                            <p className="text-sm font-medium text-green-600">
                              R$ {servico.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <NovoServicoExtraModal
        open={novoServicoModalOpen}
        onOpenChange={setNovoServicoModalOpen}
        onServicoAdicionado={handleServicoAdicionado}
      />
    </div>
  );
}