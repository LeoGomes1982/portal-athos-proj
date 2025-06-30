
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import AgendaHeader from "@/components/agenda/AgendaHeader";
import AgendaActionButtons from "@/components/agenda/AgendaActionButtons";
import AgendaCalendar from "@/components/agenda/AgendaCalendar";
import DailySchedule from "@/components/agenda/DailySchedule";
import HighPriorityTasks from "@/components/agenda/HighPriorityTasks";
import AgendaSummaryModal from "@/components/agenda/AgendaSummaryModal";
import NewAppointmentModal from "@/components/agenda/NewAppointmentModal";
import AppointmentDetailsModal from "@/components/agenda/AppointmentDetailsModal";

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

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showResumoModal, setShowResumoModal] = useState(false);
  const [showNovoCompromisso, setShowNovoCompromisso] = useState(false);
  const [showDetalhesCompromisso, setShowDetalhesCompromisso] = useState(false);
  const [compromissoSelecionado, setCompromissoSelecionado] = useState<Compromisso | null>(null);
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  
  const [novoCompromisso, setNovoCompromisso] = useState({
    titulo: '',
    descricao: '',
    data: '',
    horario: '',
    participantes: [] as string[],
    tipo: 'reuniao' as 'reuniao' | 'tarefa' | 'evento',
    prioridade: 'normal' as 'normal' | 'importante' | 'muito-importante'
  });

  const usuarios = ['user1', 'user2', 'user3', 'user4'];
  const usuarioAtual = 'user1';

  // Carregar compromissos do localStorage
  useEffect(() => {
    const savedCompromissos = localStorage.getItem('agenda_compromissos');
    if (savedCompromissos) {
      try {
        const parsedCompromissos = JSON.parse(savedCompromissos);
        // Adicionar prioridade aos compromissos existentes se não tiverem
        const compromissosComPrioridade = parsedCompromissos.map((c: any) => ({
          ...c,
          prioridade: c.prioridade || 'normal'
        }));
        setCompromissos(compromissosComPrioridade);
        console.log('Compromissos carregados:', compromissosComPrioridade);
      } catch (error) {
        console.error('Erro ao carregar compromissos:', error);
        const compromissosIniciais = criarCompromissosIniciais();
        setCompromissos(compromissosIniciais);
        localStorage.setItem('agenda_compromissos', JSON.stringify(compromissosIniciais));
      }
    } else {
      const compromissosIniciais = criarCompromissosIniciais();
      setCompromissos(compromissosIniciais);
      localStorage.setItem('agenda_compromissos', JSON.stringify(compromissosIniciais));
    }
  }, []);

  // Função para criar compromissos iniciais
  const criarCompromissosIniciais = (): Compromisso[] => {
    return [
      {
        id: '1',
        titulo: 'Reunião de Planejamento',
        descricao: 'Planejamento mensal da equipe',
        data: format(new Date(), 'yyyy-MM-dd'),
        horario: '09:00',
        participantes: ['user1', 'user2', 'user3'],
        tipo: 'reuniao',
        concluido: false,
        criadoPor: 'user1',
        prioridade: 'muito-importante'
      },
      {
        id: '2',
        titulo: 'Revisão de Contratos',
        descricao: 'Revisar contratos pendentes',
        data: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
        horario: '14:00',
        participantes: ['user1', 'user4'],
        tipo: 'tarefa',
        concluido: false,
        criadoPor: 'user4',
        prioridade: 'importante'
      }
    ];
  };

  // Salvar compromissos no localStorage sempre que mudar
  useEffect(() => {
    if (compromissos.length > 0) {
      try {
        localStorage.setItem('agenda_compromissos', JSON.stringify(compromissos));
        console.log('Compromissos salvos:', compromissos);
      } catch (error) {
        console.error('Erro ao salvar compromissos:', error);
      }
    }
  }, [compromissos]);

  const handleCriarCompromisso = () => {
    if (novoCompromisso.titulo && novoCompromisso.data && novoCompromisso.horario) {
      const compromisso: Compromisso = {
        id: Date.now().toString(),
        ...novoCompromisso,
        concluido: false,
        criadoPor: usuarioAtual
      };
      
      const novosCompromissos = [...compromissos, compromisso];
      setCompromissos(novosCompromissos);
      
      try {
        localStorage.setItem('agenda_compromissos', JSON.stringify(novosCompromissos));
        console.log('Novo compromisso salvo:', compromisso);
      } catch (error) {
        console.error('Erro ao salvar novo compromisso:', error);
      }
      
      setNovoCompromisso({
        titulo: '',
        descricao: '',
        data: '',
        horario: '',
        participantes: [],
        tipo: 'reuniao',
        prioridade: 'normal'
      });
      setShowNovoCompromisso(false);
    }
  };

  const toggleConcluido = (id: string) => {
    const novosCompromissos = compromissos.map(c => 
      c.id === id ? { ...c, concluido: !c.concluido } : c
    );
    setCompromissos(novosCompromissos);
    
    try {
      localStorage.setItem('agenda_compromissos', JSON.stringify(novosCompromissos));
      console.log('Status de compromisso atualizado:', id);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleSelectCompromisso = (compromisso: Compromisso) => {
    setCompromissoSelecionado(compromisso);
    setShowDetalhesCompromisso(true);
  };

  const compromissosMuitoImportantes = compromissos.filter(c => c.prioridade === 'muito-importante' && !c.concluido);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200/80 via-violet-150/60 to-purple-300/70">
      <div className="content-wrapper animate-fade-in bg-white/80 backdrop-blur-sm border border-purple-300/80 shadow-xl">
        <AgendaHeader />
        
        <AgendaActionButtons 
          onShowSummary={() => setShowResumoModal(true)}
          onShowNewAppointment={() => setShowNovoCompromisso(true)}
        />

        {/* Main Content */}
        <div className="space-y-8">
          {/* Calendar and High Priority Tasks - Same Height */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AgendaCalendar 
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>
            
            <div className="lg:col-span-1">
              <HighPriorityTasks 
                compromissos={compromissosMuitoImportantes}
                onSelectCompromisso={handleSelectCompromisso}
                onToggleConcluido={toggleConcluido}
              />
            </div>
          </div>

          {/* Daily Schedule - Full Width */}
          <div className="w-full">
            <DailySchedule 
              selectedDate={selectedDate}
              compromissos={compromissos}
              onToggleConcluido={toggleConcluido}
              onSelectCompromisso={handleSelectCompromisso}
            />
          </div>
        </div>

        <AgendaSummaryModal 
          open={showResumoModal}
          onOpenChange={setShowResumoModal}
          compromissos={compromissos}
          usuarios={usuarios}
        />

        <NewAppointmentModal 
          open={showNovoCompromisso}
          onOpenChange={setShowNovoCompromisso}
          novoCompromisso={novoCompromisso}
          setNovoCompromisso={setNovoCompromisso}
          usuarios={usuarios}
          onCreateAppointment={handleCriarCompromisso}
        />

        <AppointmentDetailsModal 
          open={showDetalhesCompromisso}
          onOpenChange={setShowDetalhesCompromisso}
          compromisso={compromissoSelecionado}
          onToggleConcluido={toggleConcluido}
          setCompromisso={setCompromissoSelecionado}
        />
      </div>
    </div>
  );
};

export default Agenda;
