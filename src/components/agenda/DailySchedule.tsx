
import React from 'react';
import { Clock, CalendarIcon, CheckCircle2, Circle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

interface DailyScheduleProps {
  selectedDate: Date | undefined;
  compromissos: Compromisso[];
  onToggleConcluido: (id: string) => void;
  onSelectCompromisso: (compromisso: Compromisso) => void;
}

const DailySchedule = ({ selectedDate, compromissos, onToggleConcluido, onSelectCompromisso }: DailyScheduleProps) => {
  const getCompromissosData = (data: Date) => {
    const dataStr = format(data, 'yyyy-MM-dd');
    return compromissos.filter(c => c.data === dataStr);
  };

  return (
    <Card className="modern-card animate-slide-up bg-white/95 backdrop-blur-sm border-purple-200/60 shadow-md">
      <CardHeader className="card-header">
        <CardTitle className="section-title flex items-center gap-2 mb-0">
          <Clock size={20} className="text-purple-600" />
          {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
        </CardTitle>
      </CardHeader>
      <CardContent className="card-content">
        <div className="space-y-3">
          {selectedDate && getCompromissosData(selectedDate).map((compromisso) => (
            <div
              key={compromisso.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                compromisso.concluido 
                  ? 'bg-gray-100 opacity-60 border-gray-300' 
                  : 'bg-white hover:shadow-md border-purple-200 hover:border-purple-400 hover:scale-102'
              }`}
              onClick={() => onSelectCompromisso(compromisso)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-base text-gray-800">{compromisso.titulo}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleConcluido(compromisso.id);
                  }}
                  className="text-green-600 hover:text-green-700 transition-colors hover:scale-110"
                >
                  {compromisso.concluido ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full">
                  <Clock size={14} />
                  {compromisso.horario}
                </div>
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                  <User size={14} />
                  {compromisso.participantes.length} pessoas
                </div>
              </div>
            </div>
          ))}
          {selectedDate && getCompromissosData(selectedDate).length === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-100">
              <div className="w-16 h-16 bg-purple-100 border-2 border-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CalendarIcon size={24} className="text-purple-500" />
              </div>
              <p className="text-gray-600 text-base font-medium">
                Nenhum compromisso para esta data
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySchedule;
