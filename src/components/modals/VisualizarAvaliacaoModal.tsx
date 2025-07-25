import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Avaliacao } from "@/hooks/useAvaliacoes";
import { Loader2, Copy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VisualizarAvaliacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  avaliacaoId?: string;
}

export function VisualizarAvaliacaoModal({ open, onOpenChange, avaliacaoId }: VisualizarAvaliacaoModalProps) {
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const linkCompartilhavel = avaliacaoId ? `${window.location.origin}/avaliacao/${avaliacaoId}` : '';

  const copiarLink = () => {
    navigator.clipboard.writeText(linkCompartilhavel);
    toast({
      title: "Link copiado!",
      description: "O link da avaliação foi copiado para a área de transferência",
    });
  };

  const compartilharLink = () => {
    if (navigator.share) {
      navigator.share({
        title: `Avaliação de ${avaliacao?.funcionario_nome}`,
        text: `Avaliação de Desempenho - ${avaliacao?.tipo_avaliacao}`,
        url: linkCompartilhavel,
      });
    } else {
      copiarLink();
    }
  };

  const getTipoAvaliacaoLabel = (tipo: string) => {
    switch (tipo) {
      case 'colega': return 'Avaliação de Colega';
      case 'chefia': return 'Avaliação de Chefia';
      case 'responsavel': return 'Avaliação do Responsável';
      default: return tipo;
    }
  };

  useEffect(() => {
    if (open && avaliacaoId) {
      carregarAvaliacao();
    }
  }, [open, avaliacaoId]);

  const carregarAvaliacao = async () => {
    if (!avaliacaoId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('avaliacoes_desempenho')
        .select('*')
        .eq('id', avaliacaoId)
        .single();

      if (error) throw error;
      setAvaliacao(data as Avaliacao);
    } catch (error) {
      console.error('Erro ao carregar avaliação:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!avaliacao && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl">
            {avaliacao?.funcionario_nome}
          </DialogTitle>
          {avaliacao && (
            <>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{getTipoAvaliacaoLabel(avaliacao.tipo_avaliacao)}</span>
                <span>•</span>
                <span>{new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span>Avaliador: {avaliacao.avaliador_nome}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={avaliacao.resultado === 'POSITIVO' ? 'default' : 
                         avaliacao.resultado === 'NEGATIVO' ? 'destructive' : 'secondary'}
                >
                  {avaliacao.resultado}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Pontuação: {avaliacao.pontuacao_total > 0 ? '+' : ''}{avaliacao.pontuacao_total}
                </span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copiarLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Link
                </Button>
                <Button variant="outline" size="sm" onClick={compartilharLink}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin mr-2" />
            Carregando avaliação...
          </div>
        ) : avaliacao ? (
          <div className="space-y-6">
            {/* Informações Gerais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Funcionário</p>
                  <p className="font-medium">{avaliacao.funcionario_nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avaliador</p>
                  <p className="font-medium">{avaliacao.avaliador_nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Avaliação</p>
                  <p className="font-medium capitalize">{avaliacao.tipo_avaliacao}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resultado</p>
                  <Badge 
                    variant={avaliacao.resultado === 'POSITIVO' ? 'default' : 
                           avaliacao.resultado === 'NEGATIVO' ? 'destructive' : 'secondary'}
                  >
                    {avaliacao.resultado}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pontuação</p>
                  <p className="font-medium">{avaliacao.pontuacao_total} pontos</p>
                </div>
              </CardContent>
            </Card>

            {/* Perguntas de Múltipla Escolha */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Perguntas de Múltipla Escolha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(avaliacao.perguntas_marcadas).map(([key, value], index) => (
                  <div key={key} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm">Pergunta {index + 1}</span>
                    <Badge variant="outline">{value}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Perguntas Descritivas */}
            {Object.keys(avaliacao.perguntas_descritivas).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Perguntas Descritivas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(avaliacao.perguntas_descritivas).map(([key, value], index) => (
                    <div key={key} className="space-y-2">
                      <p className="text-sm font-medium">Pergunta {index + 1}</p>
                      <p className="text-sm text-muted-foreground bg-slate-50 p-3 rounded-lg">{value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recomendações */}
            {avaliacao.recomendacoes && Object.keys(avaliacao.recomendacoes).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recomendações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(avaliacao.recomendacoes).map(([key, value], index) => (
                    <div key={key} className="space-y-2">
                      <p className="text-sm font-medium">Recomendação {index + 1}</p>
                      <p className="text-sm text-muted-foreground bg-slate-50 p-3 rounded-lg">{value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Feedback */}
            {avaliacao.feedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground bg-slate-50 p-3 rounded-lg">{avaliacao.feedback}</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}