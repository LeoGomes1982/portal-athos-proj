import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Download, Calendar, MapPin, User, Clock, CreditCard, FileText } from "lucide-react";
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
  valor: number;
  created_at: string;
}

export function GestaoServicosExtras() {
  const [servicosExtras, setServicosExtras] = useState<ServicoExtra[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoServicoModalOpen, setNovoServicoModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    buscarServicosExtras();
  }, []);

  const buscarServicosExtras = async () => {
    try {
      const { data, error } = await supabase
        .from('servicos_extras')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServicosExtras(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços extras:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar serviços extras",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularResumos = () => {
    const totalServicos = servicosExtras.length;
    const totalHoras = servicosExtras.reduce((acc, servico) => acc + servico.quantidade_horas, 0);
    const totalValor = servicosExtras.reduce((acc, servico) => acc + Number(servico.valor || 0), 0);
    const servicosEsteMes = servicosExtras.filter(servico => {
      const dataServico = new Date(servico.data_servico);
      const hoje = new Date();
      return dataServico.getMonth() === hoje.getMonth() && dataServico.getFullYear() === hoje.getFullYear();
    }).length;

    return { totalServicos, totalHoras, totalValor, servicosEsteMes };
  };

  const { totalServicos, totalHoras, totalValor, servicosEsteMes } = calcularResumos();

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
            <h1 className="text-2xl font-bold">Gestão de Serviços Extras</h1>
            <p className="text-muted-foreground">Controle e acompanhamento de serviços extras realizados</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Relatório PDF
          </Button>
          <Button onClick={() => setNovoServicoModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Serviço Extra
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total de Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServicos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Total de Horas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoras}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
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
            <div className="text-2xl font-bold">{servicosEsteMes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Serviços Extras */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Serviços Extras</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : servicosExtras.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum serviço extra registrado
            </div>
          ) : (
            <div className="space-y-4">
              {servicosExtras.map((servico) => (
                <div key={servico.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{servico.nome_pessoa}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {servico.local_servico}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(servico.data_servico), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="secondary">{servico.quantidade_horas}h</Badge>
                      {servico.valor && (
                        <div className="text-lg font-semibold">
                          R$ {Number(servico.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Motivo:</span>
                      <p className="text-muted-foreground mt-1">{servico.motivo_servico}</p>
                    </div>
                    <div>
                      <span className="font-medium">Fiscal Responsável:</span>
                      <p className="text-muted-foreground mt-1">{servico.fiscal_responsavel}</p>
                    </div>
                    <div>
                      <span className="font-medium">Chave PIX:</span>
                      <p className="text-muted-foreground mt-1 font-mono text-xs">{servico.chave_pix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <NovoServicoExtraModal
        open={novoServicoModalOpen}
        onOpenChange={setNovoServicoModalOpen}
        onServicoAdicionado={buscarServicosExtras}
      />
    </div>
  );
}