
import React from 'react';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AgendaHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button onClick={() => navigate("/")} className="back-button">
          <ArrowLeft size={16} />
          Voltar
        </button>
      </div>

      {/* Page Header */}
      <div className="page-header-centered">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <CalendarIcon size={32} className="text-white" />
        </div>
        <div>
          <h1 className="page-title mb-0">Agenda</h1>
          <p className="text-description">Gestão de Tarefas e Agendamentos</p>
        </div>
      </div>
    </>
  );
};

export default AgendaHeader;
