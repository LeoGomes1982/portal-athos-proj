import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CompromissoDP {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  participantes: string[];
  tipo: 'reuniao' | 'tarefa' | 'evento' | 'avaliacao' | 'avaliacao_desempenho' | 'vencimento_documento' | 'aviso_documento' | 'aviso_experiencia' | 'aviso_previo';
  concluido: boolean;
  criadoPor: string;
  prioridade: 'normal' | 'importante' | 'muito-importante';
  resolvido?: boolean;
  funcionarioId?: string;
  funcionarioNome?: string;
}

interface AgendaDPCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  compromissos: CompromissoDP[];
}

const AgendaDPCalendar = ({ selectedDate, onSelectDate, compromissos }: AgendaDPCalendarProps) => {
  const getCompromissosStatus = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const compromissosData = compromissos.filter(compromisso => compromisso.data === dateString);
    
    if (compromissosData.length === 0) {
      return { hasCompromisso: false, allCompleted: false, hasAviso: false };
    }

    const allCompleted = compromissosData.every(c => c.concluido);
    const hasAviso = compromissosData.some(c => 
      !c.resolvido && ['aviso_documento', 'aviso_experiencia', 'aviso_previo'].includes(c.tipo)
    );

    return {
      hasCompromisso: true,
      allCompleted,
      hasAviso: hasAviso && !allCompleted
    };
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2">
        <CalendarIcon size={20} />
        Calendário
      </h3>
      <div className="w-full flex justify-center bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          locale={ptBR}
          className="w-full max-w-full mx-auto"
          classNames={{
            months: "w-full",
            month: "w-full space-y-2",
            caption: "flex justify-center relative items-center mb-4 h-12",
            caption_label: "text-2xl font-bold text-gray-800",
            nav: "space-x-1 flex items-center",
            nav_button: "h-8 w-8 bg-transparent border-0 p-0 opacity-60 hover:opacity-100 hover:bg-gray-100 rounded transition-all",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse mt-2",
            head_row: "flex mb-2",
            head_cell: "text-gray-600 flex-1 h-8 font-medium text-sm flex items-center justify-center uppercase",
            row: "flex w-full",
            cell: "relative text-center focus-within:relative focus-within:z-20 flex-1 border border-gray-200 bg-white h-16",
            day: "h-16 w-full p-0 font-medium text-lg aria-selected:opacity-100 hover:bg-gray-100 flex items-center justify-center transition-all relative",
            day_selected: "bg-purple-500 text-white hover:bg-purple-600",
            day_today: "bg-red-500 text-white font-bold",
            day_outside: "text-gray-300 opacity-50",
            day_disabled: "text-gray-200 opacity-30",
          }}
          modifiers={{
            allCompleted: (date) => getCompromissosStatus(date).allCompleted,
            hasAviso: (date) => getCompromissosStatus(date).hasAviso,
            hasCompromisso: (date) => getCompromissosStatus(date).hasCompromisso && !getCompromissosStatus(date).allCompleted && !getCompromissosStatus(date).hasAviso
          }}
          modifiersClassNames={{
            allCompleted: "relative after:content-[''] after:absolute after:top-0 after:right-0 after:w-4 after:h-4 after:bg-gray-500 after:rounded-full after:z-10",
            hasAviso: "relative after:content-[''] after:absolute after:top-0 after:right-0 after:w-4 after:h-4 after:bg-red-600 after:rounded-full after:z-10 animate-pulse",
            hasCompromisso: "relative after:content-[''] after:absolute after:top-0 after:right-0 after:w-4 after:h-4 after:bg-blue-600 after:rounded-full after:z-10"
          }}
        />
      </div>
    </div>
  );
};

export default AgendaDPCalendar;