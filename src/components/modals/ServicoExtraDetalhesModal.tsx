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
  servico: ServicoExtra | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServicoExtraDetalhesModal({ servico, open, onOpenChange }: ServicoExtraDetalhesModalProps) {
  if (!servico) return null;

  const valorPorHora = servico.valor ? servico.valor / servico.quantidade_horas : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="text-primary" size={20} />
            Detalhes do Serviço Extra
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Pessoa */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <User size={18} />
              {servico.nome_pessoa}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted-foreground" />
                <span>Data do Serviço:</span>
                <span className="font-medium">
                  {format(new Date(servico.data_servico), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <span>Quantidade de Horas:</span>
                <Badge variant="secondary">{servico.quantidade_horas}h</Badge>
              </div>
            </div>
          </div>

          {/* Informações do Serviço */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações do Serviço</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Motivo do Serviço</label>
                <p className="p-3 bg-muted/50 rounded-md">{servico.motivo_servico}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin size={14} />
                    Local do Serviço
                  </label>
                  <p className="p-3 bg-muted/50 rounded-md">{servico.local_servico}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <FileText size={14} />
                    Fiscal Responsável
                  </label>
                  <p className="p-3 bg-muted/50 rounded-md">{servico.fiscal_responsavel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Financeiras */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações Financeiras</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <CreditCard size={14} />
                  Chave PIX
                </label>
                <p className="p-3 bg-muted/50 rounded-md font-mono text-sm">{servico.chave_pix}</p>
              </div>
              
              {servico.valor && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <DollarSign size={14} />
                      Valor por Hora
                    </label>
                    <p className="p-3 bg-green-50 text-green-700 rounded-md font-semibold">
                      R$ {valorPorHora.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <DollarSign size={14} />
                      Valor Total
                    </label>
                    <p className="p-3 bg-green-50 text-green-700 rounded-md font-semibold">
                      R$ {servico.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Informações de Sistema */}
          <div className="pt-4 border-t text-sm text-muted-foreground">
            <p>Registrado em: {format(new Date(servico.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}