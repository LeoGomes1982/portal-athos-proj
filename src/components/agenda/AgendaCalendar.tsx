import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

interface AgendaCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  compromissos: Compromisso[];
}

const AgendaCalendar = ({ selectedDate, onSelectDate, compromissos }: AgendaCalendarProps) => {
  const getCompromissosStatus = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const compromissosData = compromissos.filter(compromisso => compromisso.data === dateString);
    
    if (compromissosData.length === 0) {
      return { hasCompromisso: false, allCompleted: false, hasAvaliacaoDesempenho: false };
    }

    const allCompleted = compromissosData.every(c => c.concluido);
    const hasAvaliacaoDesempenho = compromissosData.some(c => 
      !c.concluido && (
        c.titulo.toLowerCase().includes('avaliação') || 
        c.titulo.toLowerCase().includes('avaliacao') ||
        c.tipo === 'avaliacao'
      )
    );

    return {
      hasCompromisso: true,
      allCompleted,
      hasAvaliacaoDesempenho: hasAvaliacaoDesempenho && !allCompleted
    };
  };

  return (
    <Card className="modern-card animate-slide-up bg-white/95 backdrop-blur-sm border-purple-200/60 shadow-md h-[500px] flex flex-col">
      <CardHeader className="card-header flex-shrink-0">
        <CardTitle className="section-title flex items-center gap-2 mb-0">
          <CalendarIcon size={20} className="text-purple-600" />
          Calendário
        </CardTitle>
      </CardHeader>
      <CardContent className="card-content flex-1 overflow-hidden p-4">
        <div className="w-full h-full flex items-start justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            locale={ptBR}
            className="w-full max-w-lg mx-auto"
            classNames={{
              months: "w-full",
              month: "w-full space-y-3",
              caption: "flex justify-center pt-2 relative items-center mb-4 h-12",
              caption_label: "text-lg font-semibold text-purple-800",
              nav: "space-x-1 flex items-center",
              nav_button: "h-8 w-8 bg-white border-2 border-purple-200 p-0 opacity-70 hover:opacity-100 hover:border-purple-400 rounded-lg transition-all",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1 mt-2",
              head_row: "flex mb-2",
              head_cell: "text-purple-600 rounded-md flex-1 h-10 font-semibold text-sm flex items-center justify-center",
              row: "flex w-full mt-1",
              cell: "relative p-1 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
              day: "h-10 w-full p-0 font-medium aria-selected:opacity-100 rounded-lg border-2 border-transparent hover:border-purple-300 hover:bg-purple-50 flex items-center justify-center text-sm transition-all relative",
              day_selected: "bg-purple-600/20 text-purple-800 hover:bg-purple-600/30 border-purple-400/50 shadow-md scale-105",
              day_today: "bg-purple-100 text-purple-900 border-purple-400 font-bold",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-gray-300 opacity-30",
            }}
            modifiers={{
              allCompleted: (date) => getCompromissosStatus(date).allCompleted,
              hasAvaliacaoDesempenho: (date) => getCompromissosStatus(date).hasAvaliacaoDesempenho,
              hasCompromisso: (date) => getCompromissosStatus(date).hasCompromisso && !getCompromissosStatus(date).allCompleted && !getCompromissosStatus(date).hasAvaliacaoDesempenho
            }}
            modifiersClassNames={{
              allCompleted: "relative after:content-[''] after:absolute after:-top-1 after:-right-1 after:w-2 after:h-2 after:bg-gray-400 after:rounded-full after:z-10 after:border after:border-white",
              hasAvaliacaoDesempenho: "relative after:content-[''] after:absolute after:-top-1 after:-right-1 after:w-2 after:h-2 after:bg-blue-500 after:rounded-full after:z-10 after:border after:border-white",
              hasCompromisso: "relative after:content-[''] after:absolute after:-top-1 after:-right-1 after:w-2 after:h-2 after:bg-red-500 after:rounded-full after:z-10"
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AgendaCalendar;