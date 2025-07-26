import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Compromisso {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  participantes: string[];
  tipo: 'reuniao' | 'tarefa' | 'evento' | 'avaliacao' | 'avaliacao_desempenho' | 'vencimento_documento';
  concluido: boolean;
  criadoPor: string;
  prioridade: 'normal' | 'importante' | 'muito-importante';
}

interface EditAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compromisso: Compromisso | null;
  onUpdateAppointment: (compromisso: Compromisso) => void;
  usuarios: string[];
}

export default function EditAppointmentModal({
  open,
  onOpenChange,
  compromisso,
  onUpdateAppointment,
  usuarios
}: EditAppointmentModalProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data: '',
    horario: '',
    participantes: [] as string[],
    tipo: 'reuniao' as 'reuniao' | 'tarefa' | 'evento' | 'avaliacao' | 'avaliacao_desempenho' | 'vencimento_documento',
    prioridade: 'normal' as 'normal' | 'importante' | 'muito-importante'
  });

  useEffect(() => {
    if (compromisso) {
      setFormData({
        titulo: compromisso.titulo,
        descricao: compromisso.descricao,
        data: compromisso.data,
        horario: compromisso.horario,
        participantes: compromisso.participantes,
        tipo: compromisso.tipo,
        prioridade: compromisso.prioridade
      });
    }
  }, [compromisso]);

  const handleSave = () => {
    if (!compromisso || !formData.titulo || !formData.data || !formData.horario) return;

    const updatedCompromisso: Compromisso = {
      ...compromisso,
      titulo: formData.titulo,
      descricao: formData.descricao,
      data: formData.data,
      horario: formData.horario,
      participantes: formData.participantes,
      tipo: formData.tipo,
      prioridade: formData.prioridade
    };

    onUpdateAppointment(updatedCompromisso);
    onOpenChange(false);
  };

  const addParticipante = (email: string) => {
    if (!formData.participantes.includes(email)) {
      setFormData(prev => ({
        ...prev,
        participantes: [...prev.participantes, email]
      }));
    }
  };

  const removeParticipante = (email: string) => {
    setFormData(prev => ({
      ...prev,
      participantes: prev.participantes.filter(p => p !== email)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Compromisso</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Título do compromisso"
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição do compromisso"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="horario">Horário</Label>
              <Input
                id="horario"
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData(prev => ({ ...prev, horario: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={formData.tipo} onValueChange={(value: 'reuniao' | 'tarefa' | 'evento' | 'avaliacao' | 'avaliacao_desempenho' | 'vencimento_documento') => 
              setFormData(prev => ({ ...prev, tipo: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="tarefa">Tarefa</SelectItem>
                <SelectItem value="evento">Evento</SelectItem>
                <SelectItem value="avaliacao">Avaliação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select value={formData.prioridade} onValueChange={(value: 'normal' | 'importante' | 'muito-importante') => 
              setFormData(prev => ({ ...prev, prioridade: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal ⭐</SelectItem>
                <SelectItem value="importante">Importante ⭐⭐</SelectItem>
                <SelectItem value="muito-importante">Muito Importante ⭐⭐⭐</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Participantes</Label>
            <Select onValueChange={addParticipante}>
              <SelectTrigger>
                <SelectValue placeholder="Adicionar participante" />
              </SelectTrigger>
              <SelectContent>
                {usuarios.filter(u => !formData.participantes.includes(u)).map(usuario => (
                  <SelectItem key={usuario} value={usuario}>
                    {usuario}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.participantes.map(participante => (
                <Badge key={participante} variant="secondary" className="flex items-center gap-1">
                  {participante}
                  <X 
                    size={12} 
                    className="cursor-pointer hover:text-red-500" 
                    onClick={() => removeParticipante(participante)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}