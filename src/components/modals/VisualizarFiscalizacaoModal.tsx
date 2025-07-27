import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, User, FileCheck, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VisualizarFiscalizacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fiscalizacaoId?: string;
}

interface Fiscalizacao {
  id: string;
  tipo: string;
  titulo: string;
  data_fiscalizacao: string;
  fiscalizador_nome: string;
  local?: string;
  colaborador_nome?: string;
  perguntas_marcadas: any;
  perguntas_descritivas: any;
  observacoes: string;
  resultado: string;
  pontuacao_total: number;
  created_at: string;
}

export function VisualizarFiscalizacaoModal({ open, onOpenChange, fiscalizacaoId }: VisualizarFiscalizacaoModalProps) {
  const [fiscalizacao, setFiscalizacao] = useState<Fiscalizacao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && fiscalizacaoId) {
      buscarFiscalizacao();
    }
  }, [open, fiscalizacaoId]);

  const buscarFiscalizacao = async () => {
    if (!fiscalizacaoId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fiscalizacoes')
        .select('*')
        .eq('id', fiscalizacaoId)
        .single();

      if (error) throw error;
      setFiscalizacao(data);
    } catch (error) {
      console.error('Erro ao buscar fiscalização:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getStarRating = (rating: string) => {
    const ratings: Record<string, number> = {
      'Excelente': 5,
      'Muito Bom': 4,
      'Bom': 3,
      'Regular': 2,
      'Ruim': 1
    };
    return ratings[rating] || 0;
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-8">
            Carregando...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!fiscalizacao) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-8">
            Fiscalização não encontrada
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            {fiscalizacao.titulo}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant={fiscalizacao.tipo === 'posto_servico' ? 'default' : 'secondary'}>
                    {fiscalizacao.tipo === 'posto_servico' ? 'Posto de Serviço' : 'Colaborador'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getResultadoColor(fiscalizacao.resultado)}>
                    {fiscalizacao.resultado} ({fiscalizacao.pontuacao_total} pts)
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Data: {format(new Date(fiscalizacao.data_fiscalizacao), "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Fiscalizador: {fiscalizacao.fiscalizador_nome}</span>
                </div>
                {fiscalizacao.local && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Local: {fiscalizacao.local}</span>
                  </div>
                )}
                {fiscalizacao.colaborador_nome && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Colaborador: {fiscalizacao.colaborador_nome}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Perguntas Marcadas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(fiscalizacao.perguntas_marcadas || {}).map(([key, value], index) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Pergunta {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= getStarRating(String(value)) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <Badge variant="outline">{String(value)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Observações Descritivas */}
          {fiscalizacao.perguntas_descritivas && Object.keys(fiscalizacao.perguntas_descritivas).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações Complementares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fiscalizacao.perguntas_descritivas?.observacao_geral && (
                  <div>
                    <h4 className="font-medium mb-2">Observação Geral</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {String(fiscalizacao.perguntas_descritivas.observacao_geral)}
                    </p>
                  </div>
                )}
                {fiscalizacao.perguntas_descritivas?.pontos_positivos && (
                  <div>
                    <h4 className="font-medium mb-2">Pontos Positivos</h4>
                    <p className="text-sm text-muted-foreground bg-green-50 p-3 rounded">
                      {String(fiscalizacao.perguntas_descritivas.pontos_positivos)}
                    </p>
                  </div>
                )}
                {fiscalizacao.perguntas_descritivas?.pontos_melhoria && (
                  <div>
                    <h4 className="font-medium mb-2">Pontos para Melhoria</h4>
                    <p className="text-sm text-muted-foreground bg-orange-50 p-3 rounded">
                      {String(fiscalizacao.perguntas_descritivas.pontos_melhoria)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Observações Finais */}
          {fiscalizacao.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações Finais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                  {fiscalizacao.observacoes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}