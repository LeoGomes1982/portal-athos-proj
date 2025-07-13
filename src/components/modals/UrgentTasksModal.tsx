import React from 'react';
import { AlertTriangle, Calendar, Clock, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Compromisso {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  participantes: string[];
  tipo: 'reuniao' | 'tarefa' | 'evento';
  concluido: boolean;
  criadoPor: string;
  prioridade: 'normal' | 'importante' | 'muito-importante';
}

interface UrgentTasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compromissosUrgentes: Compromisso[];
}

export const UrgentTasksModal = ({ open, onOpenChange, compromissosUrgentes }: UrgentTasksModalProps) => {
  const formatData = (dataStr: string) => {
    try {
      const data = new Date(dataStr);
      return format(data, "dd 'de' MMMM", { locale: ptBR });
    } catch {
      return dataStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={24} />
            Compromissos Urgentes - Amanhã
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {compromissosUrgentes.map((compromisso) => (
            <Card key={compromisso.id} className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-red-800 text-lg">
                    {compromisso.titulo}
                  </h3>
                  <div className="flex text-yellow-500">
                    <span>⭐⭐⭐</span>
                  </div>
                </div>
                
                {compromisso.descricao && (
                  <p className="text-red-700 mb-3 text-sm">
                    {compromisso.descricao}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-red-200">
                    <Calendar size={14} className="text-red-600" />
                    <span className="text-red-700">
                      {formatData(compromisso.data)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-red-200">
                    <Clock size={14} className="text-red-600" />
                    <span className="text-red-700">
                      {compromisso.horario}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-red-200">
                    <Users size={14} className="text-red-600" />
                    <span className="text-red-700">
                      {compromisso.participantes.length} participante{compromisso.participantes.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};