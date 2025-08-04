import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MapPin, FileText, DollarSign, Clock, CreditCard } from "lucide-react";
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

interface ServicoExtraDetalhesModalProps {
  servicos: ServicoExtra[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServicoExtraDetalhesModal({ servicos, open, onOpenChange }: ServicoExtraDetalhesModalProps) {
  if (!servicos || servicos.length === 0) return null;

  const totalHoras = servicos.reduce((acc, servico) => acc + servico.quantidade_horas, 0);
  const totalValor = servicos.reduce((acc, servico) => acc + (servico.valor || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="text-primary" size={20} />
            Lista de Serviços Extras ({servicos.length} registros)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Resumo Geral</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{servicos.length}</div>
                <div className="text-sm text-muted-foreground">Registros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalHoras}h</div>
                <div className="text-sm text-muted-foreground">Total de Horas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground">Valor Total</div>
              </div>
            </div>
          </div>

          {/* Lista de Serviços */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Detalhes dos Serviços</h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {servicos.map((servico, index) => {
                const valorPorHora = servico.valor ? servico.valor / servico.quantidade_horas : 0;
                
                return (
                  <div key={servico.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                        <h4 className="font-semibold flex items-center gap-2">
                          <User size={16} />
                          {servico.nome_pessoa}
                        </h4>
                      </div>
                      <Badge variant="secondary">
                        {servico.quantidade_horas}h
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-muted-foreground" />
                          <span className="text-muted-foreground">Data:</span>
                          <span className="font-medium">
                            {format(new Date(servico.data_servico), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-muted-foreground" />
                          <span className="text-muted-foreground">Local:</span>
                          <span className="font-medium">{servico.local_servico}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-muted-foreground" />
                          <span className="text-muted-foreground">Fiscal:</span>
                          <span className="font-medium">{servico.fiscal_responsavel}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} className="text-muted-foreground" />
                          <span className="text-muted-foreground">PIX:</span>
                          <span className="font-mono text-xs">{servico.chave_pix}</span>
                        </div>
                        
                        {servico.valor && (
                          <>
                            <div className="flex items-center gap-2">
                              <DollarSign size={14} className="text-muted-foreground" />
                              <span className="text-muted-foreground">Valor/Hora:</span>
                              <span className="font-semibold text-green-600">
                                R$ {valorPorHora.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <DollarSign size={14} className="text-muted-foreground" />
                              <span className="text-muted-foreground">Total:</span>
                              <span className="font-semibold text-green-600">
                                R$ {servico.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground text-sm">Motivo:</span>
                        <span className="text-sm flex-1">{servico.motivo_servico}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}