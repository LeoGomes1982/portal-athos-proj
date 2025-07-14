
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, ChevronRight, Clock, Users, MapPin, ArrowLeft } from "lucide-react";
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
  const navigate = useNavigate();
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

  const deleteCompromisso = (id: string) => {
    const novosCompromissos = compromissos.filter(c => c.id !== id);
    setCompromissos(novosCompromissos);
    
    try {
      localStorage.setItem('agenda_compromissos', JSON.stringify(novosCompromissos));
      console.log('Compromisso excluído:', id);
    } catch (error) {
      console.error('Erro ao excluir compromisso:', error);
    }
    
    // Fechar o modal se estiver aberto
    setShowDetalhesCompromisso(false);
    setCompromissoSelecionado(null);
  };

  const handleSelectCompromisso = (compromisso: Compromisso) => {
    setCompromissoSelecionado(compromisso);
    setShowDetalhesCompromisso(true);
  };

  const compromissosMuitoImportantes = compromissos.filter(c => c.prioridade === 'muito-importante' && !c.concluido);
  const compromissosHoje = compromissos.filter(c => c.data === format(selectedDate || new Date(), 'yyyy-MM-dd'));
  const compromissosConcluidos = compromissos.filter(c => c.concluido).length;
  const proximosCompromissos = compromissos.filter(c => new Date(c.data) >= new Date() && !c.concluido).length;
  
  // Verificar se há compromissos urgentes (3 estrelas e falta 1 dia)
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);
  const amanhaStr = amanha.toISOString().split('T')[0];
  
  const compromissosUrgentes = compromissos.filter(c => 
    c.prioridade === 'muito-importante' && 
    c.data === amanhaStr && 
    !c.concluido
  );
  const hasUrgentTasks = compromissosUrgentes.length > 0;

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
            <Calendar size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">Agenda</h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Gerencie compromissos, reuniões e tarefas importantes
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold text-blue-600">
                {compromissosHoje.length}
              </div>
              <div className="text-sm text-blue-600/80">Compromissos Hoje</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-600">
                {compromissosConcluidos}
              </div>
              <div className="text-sm text-green-600/80">Concluídos</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 relative">
            <CardContent className="card-content text-center p-4">
              {hasUrgentTasks && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse border-2 border-white flex items-center justify-center z-10">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              )}
              <div className="text-3xl mb-2">⏰</div>
              <div className="text-2xl font-bold text-purple-600">
                {proximosCompromissos}
              </div>
              <div className="text-sm text-purple-600/80">Próximos</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8 animate-slide-up">
          <Button 
            className="primary-btn flex items-center gap-2"
            onClick={() => setShowNovoCompromisso(true)}
          >
            <Plus size={20} />
            Novo Compromisso
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowResumoModal(true)}
          >
            <Calendar size={20} />
            Ver Resumo
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-8 animate-slide-up">
          {/* Calendar and High Priority Tasks - Same Height */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
          <AgendaCalendar 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate}
            compromissos={compromissos}
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

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>

        {/* Modals */}
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
          onDeleteCompromisso={deleteCompromisso}
          setCompromisso={setCompromissoSelecionado}
        />
      </div>
    </div>
  );
};

export default Agenda;
