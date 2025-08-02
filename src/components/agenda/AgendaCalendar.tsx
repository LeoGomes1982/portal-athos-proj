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
    <div className="w-full">
      <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
        <CalendarIcon size={20} />
        Calendário
      </h3>
      <div className="w-full flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          locale={ptBR}
          className="w-full max-w-full mx-auto scale-110"
          classNames={{
            months: "w-full",
            month: "w-full space-y-4",
            caption: "flex justify-center pt-2 relative items-center mb-6 h-16",
            caption_label: "text-3xl font-bold text-blue-800",
            nav: "space-x-1 flex items-center",
            nav_button: "h-10 w-10 bg-white border-2 border-blue-200 p-0 opacity-70 hover:opacity-100 hover:border-blue-400 rounded-lg transition-all",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-2 mt-4",
            head_row: "flex mb-3",
            head_cell: "text-blue-600 rounded-md flex-1 h-12 font-bold text-lg flex items-center justify-center",
            row: "flex w-full mt-2",
            cell: "relative p-2 text-center focus-within:relative focus-within:z-20 flex-1",
            day: "h-14 w-full p-0 font-bold text-lg aria-selected:opacity-100 rounded-lg border-2 border-transparent hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center transition-all relative",
            day_selected: "bg-blue-600/20 text-blue-800 hover:bg-blue-600/30 border-blue-400/50 shadow-md scale-105",
            day_today: "bg-blue-100 text-blue-900 border-blue-400 font-bold",
            day_outside: "text-gray-400 opacity-50",
            day_disabled: "text-gray-300 opacity-30",
          }}
          modifiers={{
            allCompleted: (date) => getCompromissosStatus(date).allCompleted,
            hasAvaliacaoDesempenho: (date) => getCompromissosStatus(date).hasAvaliacaoDesempenho,
            hasCompromisso: (date) => getCompromissosStatus(date).hasCompromisso && !getCompromissosStatus(date).allCompleted && !getCompromissosStatus(date).hasAvaliacaoDesempenho
          }}
          modifiersClassNames={{
            allCompleted: "relative after:content-[''] after:absolute after:-top-1 after:-right-1 after:w-4 after:h-4 after:bg-gray-500 after:rounded-full after:z-10 after:border-2 after:border-white after:shadow-lg",
            hasAvaliacaoDesempenho: "relative after:content-[''] after:absolute after:-top-1 after:-right-1 after:w-4 after:h-4 after:bg-blue-600 after:rounded-full after:z-10 after:border-2 after:border-white after:shadow-lg",
            hasCompromisso: "relative after:content-[''] after:absolute after:-top-1 after:-right-1 after:w-4 after:h-4 after:bg-red-600 after:rounded-full after:z-10 after:border-2 after:border-white after:shadow-lg"
          }}
        />
      </div>
    </div>
  );
};

export default AgendaCalendar;