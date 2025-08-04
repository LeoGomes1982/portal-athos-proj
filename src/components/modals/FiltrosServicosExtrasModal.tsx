import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface FiltrosServicos {
  periodo: "semana" | "mes" | "personalizado" | "";
  dataInicio?: Date;
  dataFim?: Date;
  fiscal: string;
  localServico: string;
  cidade: string;
}

interface FiltrosServicosExtrasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAplicarFiltros: (filtros: FiltrosServicos) => void;
  onGerarRelatorio: (filtros: FiltrosServicos) => void;
  fiscais: string[];
  locais: string[];
  cidades: string[];
}

export function FiltrosServicosExtrasModal({
  open,
  onOpenChange,
  onAplicarFiltros,
  onGerarRelatorio,
  fiscais,
  locais,
  cidades
}: FiltrosServicosExtrasModalProps) {
  const [filtros, setFiltros] = useState<FiltrosServicos>({
    periodo: "",
    fiscal: "",
    localServico: "",
    cidade: ""
  });

  const handleAplicarFiltros = () => {
    onAplicarFiltros(filtros);
    onOpenChange(false);
  };

  const handleGerarRelatorio = () => {
    onGerarRelatorio(filtros);
  };

  const handleLimparFiltros = () => {
    setFiltros({
      periodo: "",
      fiscal: "",
      localServico: "",
      cidade: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="text-primary" size={20} />
            Filtros e Relatórios
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Período */}
          <div className="space-y-2">
            <Label>Período</Label>
            <Select value={filtros.periodo} onValueChange={(value: any) => setFiltros(prev => ({ ...prev, periodo: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os períodos</SelectItem>
                <SelectItem value="semana">Esta semana</SelectItem>
                <SelectItem value="mes">Este mês</SelectItem>
                <SelectItem value="personalizado">Período personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Datas personalizadas */}
          {filtros.periodo === "personalizado" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filtros.dataInicio && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filtros.dataInicio ? format(filtros.dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filtros.dataInicio}
                      onSelect={(date) => setFiltros(prev => ({ ...prev, dataInicio: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data Fim</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filtros.dataFim && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filtros.dataFim ? format(filtros.dataFim, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filtros.dataFim}
                      onSelect={(date) => setFiltros(prev => ({ ...prev, dataFim: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Fiscal Responsável</Label>
              <Select value={filtros.fiscal} onValueChange={(value) => setFiltros(prev => ({ ...prev, fiscal: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os fiscais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os fiscais</SelectItem>
                  {fiscais.map((fiscal) => (
                    <SelectItem key={fiscal} value={fiscal}>{fiscal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Local do Serviço</Label>
              <Select value={filtros.localServico} onValueChange={(value) => setFiltros(prev => ({ ...prev, localServico: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os locais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os locais</SelectItem>
                  {locais.map((local) => (
                    <SelectItem key={local} value={local}>{local}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                placeholder="Filtrar por cidade"
                value={filtros.cidade}
                onChange={(e) => setFiltros(prev => ({ ...prev, cidade: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleLimparFiltros}>
            Limpar Filtros
          </Button>
          <Button variant="outline" onClick={handleGerarRelatorio}>
            <Download className="mr-2" size={16} />
            Gerar Relatório PDF
          </Button>
          <Button onClick={handleAplicarFiltros}>
            <Filter className="mr-2" size={16} />
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}