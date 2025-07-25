
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Star, Trash2, Edit } from 'lucide-react';
import { format } from "date-fns";

interface Compromisso {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  participantes: string[];
  tipo: 'reuniao' | 'tarefa' | 'evento' | 'avaliacao';
  concluido: boolean;
  criadoPor: string;
  prioridade: 'normal' | 'importante' | 'muito-importante';
}

interface AppointmentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compromisso: Compromisso | null;
  onToggleConcluido: (id: string) => void;
  onDeleteCompromisso: (id: string) => void;
  setCompromisso: React.Dispatch<React.SetStateAction<Compromisso | null>>;
  onEditCompromisso?: (compromisso: Compromisso) => void;
  currentUser?: string;
}

const AppointmentDetailsModal = ({ 
  open, 
  onOpenChange, 
  compromisso, 
  onToggleConcluido, 
  onDeleteCompromisso,
  setCompromisso,
  onEditCompromisso,
  currentUser = 'leandrogomes@grupoathosbrasil.com'
}: AppointmentDetailsModalProps) => {
  const getPriorityStars = (prioridade: string) => {
    const starCount = prioridade === 'muito-importante' ? 3 : prioridade === 'importante' ? 2 : 1;
    return Array.from({ length: starCount }, (_, i) => (
      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
    ));
  };

  const getPriorityLabel = (prioridade: string) => {
    switch (prioridade) {
      case 'muito-importante':
        return 'Muito Importante';
      case 'importante':
        return 'Importante';
      default:
        return 'Normal';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do Compromisso</DialogTitle>
        </DialogHeader>
        {compromisso && (
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <p className="font-medium">{compromisso.titulo}</p>
            </div>

            <div>
              <Label>Descrição</Label>
              <p className="text-gray-700">{compromisso.descricao}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data</Label>
                <p>{format(new Date(compromisso.data), "dd/MM/yyyy")}</p>
              </div>
              <div>
                <Label>Horário</Label>
                <p>{compromisso.horario}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo</Label>
                <p className="capitalize">{compromisso.tipo}</p>
              </div>
              <div>
                <Label>Prioridade</Label>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {getPriorityStars(compromisso.prioridade)}
                  </div>
                  <span>{getPriorityLabel(compromisso.prioridade)}</span>
                </div>
              </div>
            </div>

            <div>
              <Label>Participantes</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {compromisso.participantes.map((participante) => (
                  <span key={participante} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {participante}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => {
                    onToggleConcluido(compromisso.id);
                    setCompromisso(prev => prev ? { ...prev, concluido: !prev.concluido } : null);
                  }}
                  className="text-green-600 hover:text-green-700"
                >
                  {compromisso.concluido ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <span className={compromisso.concluido ? 'text-green-600' : 'text-gray-600'}>
                  {compromisso.concluido ? 'Concluído' : 'Pendente'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              {/* Só permite editar se for o criador do compromisso */}
              {currentUser === compromisso.criadoPor && onEditCompromisso && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditCompromisso(compromisso)}
                  className="flex items-center gap-2"
                >
                  <Edit size={16} />
                  Editar
                </Button>
              )}
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDeleteCompromisso(compromisso.id)}
                className="flex items-center gap-2"
              >
                <Trash2 size={16} />
                Excluir
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsModal;
