import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Download, Calendar, MapPin, User, Clock, CreditCard, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NovoServicoExtraModal } from "@/components/modals/NovoServicoExtraModal";
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
  valor_hora?: number;
  valor_total?: number;
  created_at: string;
}

export function GestaoServicosExtras() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [servicosExtras, setServicosExtras] = useState<ServicoExtra[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [novoServicoModalOpen, setNovoServicoModalOpen] = useState(false);

  useEffect(() => {
    fetchServicosExtras();
  }, []);

  const fetchServicosExtras = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('servicos_extras')
        .select('*')
        .order('data_servico', { ascending: false });

      if (error) {
        console.error('Erro ao buscar serviços extras:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os serviços extras.",
          variant: "destructive",
        });
        return;
      }

      setServicosExtras(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços extras:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os serviços extras.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const gerarRelatorio = () => {
    // Implementar geração de relatório PDF
    toast({
      title: "Relatório",
      description: "Funcionalidade de relatório em desenvolvimento.",
    });
  };

  const calcularResumo = () => {
    const totalServicos = servicosExtras.length;
    const totalHoras = servicosExtras.reduce((acc, servico) => acc + servico.quantidade_horas, 0);
    const totalValor = servicosExtras.reduce((acc, servico) => acc + (servico.valor_total || 0), 0);
    
    return { totalServicos, totalHoras, totalValor };
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
            <Clock size={24} />
          </div>
          <div>
            <h1 className="page-title">Gestão de Serviços Extras</h1>
            <p className="text-description">Controle de serviços extras, valores e relatórios</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button onClick={handleNovoServico} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço Extra
          </Button>
          <Button variant="outline" onClick={gerarRelatorio}>
            <Download className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>

        {/* Resumo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumo.totalServicos}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Horas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumo.totalHoras}h</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {resumo.totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Serviços */}
        <Card>
          <CardHeader>
            <CardTitle>Serviços Extras Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Carregando...</p>
              </div>
            ) : servicosExtras.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum serviço extra registrado ainda.</p>
                <Button 
                  onClick={handleNovoServico}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Serviço
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {servicosExtras.map((servico) => (
                  <div key={servico.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{servico.nome_pessoa}</h3>
                        <p className="text-sm text-gray-600">{servico.motivo_servico}</p>
                      </div>
                      <Badge variant="outline">
                        {servico.quantidade_horas}h
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(servico.data_servico), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{servico.local_servico}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{servico.fiscal_responsavel}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>{servico.chave_pix}</span>
                      </div>
                    </div>
                    
                    {servico.valor_total && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium">
                          Valor Total: R$ {servico.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal Novo Serviço */}
        <NovoServicoExtraModal
          open={novoServicoModalOpen}
          onOpenChange={setNovoServicoModalOpen}
          onServicoAdicionado={handleServicoAdicionado}
        />
      </div>
    </div>
  );
}