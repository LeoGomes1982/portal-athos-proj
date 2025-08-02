
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Star, Share2 } from 'lucide-react';

interface NewAppointmentData {
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  participantes: string[];
  tipo: 'reuniao' | 'tarefa' | 'evento' | 'avaliacao' | 'avaliacao_desempenho' | 'vencimento_documento' | 'rescisao' | 'audiencia';
  prioridade: 'normal' | 'importante' | 'muito-importante';
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedAgendas, setSelectedAgendas] = useState<string[]>([]);

  const agendas = [
    'Agenda da Operações',
    'Agenda do Financeiro', 
    'Agenda da Gerência',
    'Agenda Comercial'
  ];
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

  const handleAgendaShareChange = (agenda: string, checked: boolean) => {
    if (checked) {
      setSelectedAgendas(prev => [...prev, agenda]);
    } else {
      setSelectedAgendas(prev => prev.filter(a => a !== agenda));
    }
  };

  const handleShareEvent = () => {
    console.log('Compartilhando evento com agendas:', selectedAgendas);
    setShowShareModal(false);
    setSelectedAgendas([]);
  };

  const getPriorityDisplay = (prioridade: string) => {
    const starCount = prioridade === 'muito-importante' ? 3 : prioridade === 'importante' ? 2 : 1;
    const label = prioridade === 'muito-importante' ? 'Muito Importante' : prioridade === 'importante' ? 'Importante' : 'Normal';
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {Array.from({ length: starCount }, (_, i) => (
            <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <span>{label}</span>
      </div>
    );
  };

  return (
    <>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select
                value={novoCompromisso.tipo}
                onValueChange={(value: 'reuniao' | 'tarefa' | 'evento' | 'avaliacao' | 'avaliacao_desempenho' | 'vencimento_documento' | 'rescisao' | 'audiencia') => 
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
                  <SelectItem value="avaliacao">Avaliação</SelectItem>
                  <SelectItem value="rescisao">Rescisão</SelectItem>
                  <SelectItem value="audiencia">Audiência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prioridade</Label>
              <Select
                value={novoCompromisso.prioridade}
                onValueChange={(value: 'normal' | 'importante' | 'muito-importante') => 
                  setNovoCompromisso(prev => ({ ...prev, prioridade: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">
                    {getPriorityDisplay('normal')}
                  </SelectItem>
                  <SelectItem value="importante">
                    {getPriorityDisplay('importante')}
                  </SelectItem>
                  <SelectItem value="muito-importante">
                    {getPriorityDisplay('muito-importante')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2"
            >
              <Share2 size={16} />
              Compartilhar Evento
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={onCreateAppointment}>
                Criar Compromisso
              </Button>
            </div>
          </div>
        </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhar Evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Selecione as agendas para compartilhar:</Label>
            <div className="space-y-2">
              {agendas.map((agenda) => (
                <div key={agenda} className="flex items-center space-x-2">
                  <Checkbox
                    id={agenda}
                    checked={selectedAgendas.includes(agenda)}
                    onCheckedChange={(checked) => handleAgendaShareChange(agenda, checked as boolean)}
                  />
                  <Label htmlFor={agenda}>{agenda}</Label>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowShareModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleShareEvent}>
                Compartilhar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewAppointmentModal;
