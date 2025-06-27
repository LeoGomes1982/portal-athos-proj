
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface NewAppointmentData {
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  participantes: string[];
  tipo: 'reuniao' | 'tarefa' | 'evento';
}

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  novoCompromisso: NewAppointmentData;
  setNovoCompromisso: React.Dispatch<React.SetStateAction<NewAppointmentData>>;
  usuarios: string[];
  onCreateAppointment: () => void;
}

const NewAppointmentModal = ({ 
  open, 
  onOpenChange, 
  novoCompromisso, 
  setNovoCompromisso, 
  usuarios, 
  onCreateAppointment 
}: NewAppointmentModalProps) => {
  const handleParticipanteChange = (usuario: string, checked: boolean) => {
    if (checked) {
      setNovoCompromisso(prev => ({
        ...prev,
        participantes: [...prev.participantes, usuario]
      }));
    } else {
      setNovoCompromisso(prev => ({
        ...prev,
        participantes: prev.participantes.filter(p => p !== usuario)
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Compromisso</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={novoCompromisso.titulo}
              onChange={(e) => setNovoCompromisso(prev => ({ ...prev, titulo: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={novoCompromisso.descricao}
              onChange={(e) => setNovoCompromisso(prev => ({ ...prev, descricao: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={novoCompromisso.data}
                onChange={(e) => setNovoCompromisso(prev => ({ ...prev, data: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="horario">Horário</Label>
              <Input
                id="horario"
                type="time"
                value={novoCompromisso.horario}
                onChange={(e) => setNovoCompromisso(prev => ({ ...prev, horario: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Tipo</Label>
            <Select
              value={novoCompromisso.tipo}
              onValueChange={(value: 'reuniao' | 'tarefa' | 'evento') => 
                setNovoCompromisso(prev => ({ ...prev, tipo: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="tarefa">Tarefa</SelectItem>
                <SelectItem value="evento">Evento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Participantes</Label>
            <div className="space-y-2 mt-2">
              {usuarios.map((usuario) => (
                <div key={usuario} className="flex items-center space-x-2">
                  <Checkbox
                    id={usuario}
                    checked={novoCompromisso.participantes.includes(usuario)}
                    onCheckedChange={(checked) => handleParticipanteChange(usuario, checked as boolean)}
                  />
                  <Label htmlFor={usuario}>{usuario}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={onCreateAppointment}>
              Criar Compromisso
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewAppointmentModal;
