
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

interface AgendaCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

const AgendaCalendar = ({ selectedDate, onSelectDate }: AgendaCalendarProps) => {
  return (
    <Card className="modern-card animate-slide-up bg-white/95 backdrop-blur-sm border-purple-200/60 shadow-md h-[500px] flex flex-col">
      <CardHeader className="card-header flex-shrink-0">
        <CardTitle className="section-title flex items-center gap-2 mb-0">
          <CalendarIcon size={20} className="text-purple-600" />
          Calendário
        </CardTitle>
      </CardHeader>
      <CardContent className="card-content flex-1 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            locale={ptBR}
            className="w-full mx-auto"
            classNames={{
              months: "w-full",
              month: "w-full space-y-4",
              caption: "flex justify-center pt-1 relative items-center mb-4",
              caption_label: "text-xl font-semibold text-purple-800",
              nav: "space-x-1 flex items-center",
              nav_button: "h-10 w-10 bg-white border-2 border-purple-200 p-0 opacity-70 hover:opacity-100 hover:border-purple-400 rounded-lg transition-all",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1 mt-4",
              head_row: "flex mb-2",
              head_cell: "text-purple-600 rounded-md flex-1 h-14 font-semibold text-base flex items-center justify-center",
              row: "flex w-full mt-2",
              cell: "relative p-1 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
              day: "h-14 w-full p-0 font-medium aria-selected:opacity-100 rounded-lg border-2 border-transparent hover:border-purple-300 hover:bg-purple-50 flex items-center justify-center text-base transition-all",
              day_selected: "bg-purple-600/20 text-purple-800 hover:bg-purple-600/30 border-purple-400/50 shadow-md scale-105",
              day_today: "bg-purple-100 text-purple-900 border-purple-400 font-bold",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-gray-300 opacity-30",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AgendaCalendar;
