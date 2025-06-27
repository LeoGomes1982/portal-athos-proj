
import React from 'react';
import { Users, Plus } from 'lucide-react';

interface AgendaActionButtonsProps {
  onShowSummary: () => void;
  onShowNewAppointment: () => void;
}

const AgendaActionButtons = ({ onShowSummary, onShowNewAppointment }: AgendaActionButtonsProps) => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={onShowSummary}
          className="primary-btn text-base px-8 py-4 h-auto bg-purple-600 hover:bg-purple-700"
        >
          <Users size={20} className="mr-2" />
          Resumo Geral
        </button>
        <button 
          onClick={onShowNewAppointment}
          className="success-btn text-base px-8 py-4 h-auto"
        >
          <Plus size={20} className="mr-2" />
          Novo Compromisso
        </button>
      </div>
    </div>
  );
};

export default AgendaActionButtons;
