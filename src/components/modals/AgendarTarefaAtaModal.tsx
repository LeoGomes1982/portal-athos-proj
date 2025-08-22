import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AgendarTarefaAtaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ataId: string;
  ataDescricao: string;
  onTarefaCriada: (tarefaId: string) => void;
}

export function AgendarTarefaAtaModal({ open, onOpenChange, ataId, ataDescricao, onTarefaCriada }: AgendarTarefaAtaModalProps) {
  const [formData, setFormData] = useState({
    titulo: `Tarefa referente à Ata ${ataId}`,
    descricao: ataDescricao,
    data: new Date().toISOString().split('T')[0],
    horario: "09:00",
    prioridade: "normal" as const
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('compromissos')
        .insert({
          titulo: formData.titulo,
          descricao: formData.descricao,
          data: formData.data,
          horario: formData.horario,
          tipo: 'operacional',
          participantes: ['Sistema'],
          criado_por: 'Sistema - Ata',
          prioridade: formData.prioridade,
          concluido: false
        })
        .select()
        .single();

      if (error) throw error;

      onTarefaCriada(data.id);
      onOpenChange(false);
      
      toast({
        title: "Sucesso",
        description: "Tarefa agendada com sucesso!",
      });
      
      // Reset form
      setFormData({
        titulo: `Tarefa referente à Ata ${ataId}`,
        descricao: ataDescricao,
        data: new Date().toISOString().split('T')[0],
        horario: "09:00",
        prioridade: "normal"
      });
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast({
        title: "Erro",
        description: "Erro ao agendar tarefa. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agendar Tarefa da Ata</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título da Tarefa *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="horario">Horário *</Label>
              <Input
                id="horario"
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData(prev => ({ ...prev, horario: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select value={formData.prioridade} onValueChange={(value: any) => setFormData(prev => ({ ...prev, prioridade: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              {loading ? "Agendando..." : "Agendar Tarefa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}