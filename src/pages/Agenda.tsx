
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, ChevronRight, Clock, Users, MapPin, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AgendaCalendar from "@/components/agenda/AgendaCalendar";
import DailySchedule from "@/components/agenda/DailySchedule";
import HighPriorityTasks from "@/components/agenda/HighPriorityTasks";
import AgendaSummaryModal from "@/components/agenda/AgendaSummaryModal";
import NewAppointmentModal from "@/components/agenda/NewAppointmentModal";
import TasksNotesModal from "@/components/agenda/TasksNotesModal";
import AppointmentDetailsModal from "@/components/agenda/AppointmentDetailsModal";
import EditAppointmentModal from "@/components/agenda/EditAppointmentModal";

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

const Agenda = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showResumoModal, setShowResumoModal] = useState(false);
  const [showNovoCompromisso, setShowNovoCompromisso] = useState(false);
  const [showDetalhesCompromisso, setShowDetalhesCompromisso] = useState(false);
  const [showEditCompromisso, setShowEditCompromisso] = useState(false);
  const [showTasksNotes, setShowTasksNotes] = useState(false);
  const [compromissoSelecionado, setCompromissoSelecionado] = useState<Compromisso | null>(null);
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  
  const [novoCompromisso, setNovoCompromisso] = useState({
    titulo: '',
    descricao: '',
    data: '',
    horario: '',
    participantes: [] as string[],
    tipo: 'reuniao' as 'reuniao' | 'tarefa' | 'evento' | 'avaliacao' | 'avaliacao_desempenho' | 'vencimento_documento',
    prioridade: 'normal' as 'normal' | 'importante' | 'muito-importante'
  });

  const usuarios = [
    'leandrogomes@grupoathosbrasil.com',
    'dp@grupoathosbrasil.com', 
    'financeiro@grupoathosbrasil.com',
    'gerencia@grupoathosbrasil.com',
    'thiago@grupoathosbrasil.com',
    'diego@grupoathosbrasil.com'
  ];
  const usuarioAtual = 'leandrogomes@grupoathosbrasil.com';

  // Carregar compromissos do Supabase
  useEffect(() => {
    const carregarCompromissos = async () => {
      try {
        console.log('Carregando compromissos...');
        const { data, error } = await supabase
          .from('compromissos')
          .select('*')
          .order('data', { ascending: true });

        if (error) {
          console.error('Erro ao carregar compromissos:', error);
          setCompromissos([]);
          return;
        }

        if (data && data.length > 0) {
          console.log('Compromissos carregados:', data.length);
          const compromissosFormatados = data.map(c => ({
            id: c.id,
            titulo: c.titulo,
            descricao: c.descricao || '',
            data: c.data,
            horario: c.horario,
            participantes: c.participantes || [],
            tipo: c.tipo as 'reuniao' | 'tarefa' | 'evento' | 'avaliacao' | 'avaliacao_desempenho' | 'vencimento_documento',
            concluido: c.concluido,
            criadoPor: c.criado_por,
            prioridade: c.prioridade as 'normal' | 'importante' | 'muito-importante'
          }));

          setCompromissos(compromissosFormatados);
        } else {
          console.log('Nenhum compromisso encontrado');
          setCompromissos([]);
        }
      } catch (error) {
        console.error('Erro ao carregar compromissos:', error);
        setCompromissos([]);
      }
    };

    carregarCompromissos();
    
    // Verificar avaliações em atraso
    (async () => {
      try {
        const { useAvaliacaoAgendamento } = await import('@/hooks/useAvaliacaoAgendamento');
        const { verificarAvaliacoesEmAtraso } = useAvaliacaoAgendamento();
        await verificarAvaliacoesEmAtraso();
      } catch (error) {
        console.error('Erro ao verificar avaliações em atraso:', error);
      }
    })();
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
        participantes: ['leandrogomes@grupoathosbrasil.com', 'dp@grupoathosbrasil.com', 'gerencia@grupoathosbrasil.com'],
        tipo: 'reuniao',
        concluido: false,
        criadoPor: 'leandrogomes@grupoathosbrasil.com',
        prioridade: 'muito-importante'
      },
      {
        id: '2',
        titulo: 'Revisão de Contratos',
        descricao: 'Revisar contratos pendentes',
        data: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
        horario: '14:00',
        participantes: ['leandrogomes@grupoathosbrasil.com', 'gerencia@grupoathosbrasil.com'],
        tipo: 'tarefa',
        concluido: false,
        criadoPor: 'gerencia@grupoathosbrasil.com',
        prioridade: 'importante'
      }
    ];
  };

  const handleCriarCompromisso = async () => {
    if (novoCompromisso.titulo && novoCompromisso.data && novoCompromisso.horario) {
      try {
        const { data, error } = await supabase
          .from('compromissos')
          .insert({
            titulo: novoCompromisso.titulo,
            descricao: novoCompromisso.descricao,
            data: novoCompromisso.data,
            horario: novoCompromisso.horario,
            participantes: novoCompromisso.participantes,
            tipo: novoCompromisso.tipo,
            concluido: false,
            criado_por: usuarioAtual,
            prioridade: novoCompromisso.prioridade
          })
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar compromisso:', error);
          toast.error('Erro ao criar compromisso');
          return;
        }

        const novoCompromissoFormatado: Compromisso = {
          id: data.id,
          titulo: data.titulo,
          descricao: data.descricao || '',
          data: data.data,
          horario: data.horario,
          participantes: data.participantes || [],
          tipo: data.tipo as 'reuniao' | 'tarefa' | 'evento' | 'avaliacao' | 'avaliacao_desempenho' | 'vencimento_documento',
          concluido: data.concluido,
          criadoPor: data.criado_por,
          prioridade: data.prioridade as 'normal' | 'importante' | 'muito-importante'
        };

        setCompromissos(prev => [...prev, novoCompromissoFormatado]);
        
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
        toast.success('Compromisso criado com sucesso!');
      } catch (error) {
        console.error('Erro ao criar compromisso:', error);
        toast.error('Erro ao criar compromisso');
      }
    }
  };

  const toggleConcluido = async (id: string) => {
    const compromisso = compromissos.find(c => c.id === id);
    if (!compromisso) return;

    try {
      const { error } = await supabase
        .from('compromissos')
        .update({ concluido: !compromisso.concluido })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast.error('Erro ao atualizar status do compromisso');
        return;
      }

      setCompromissos(prev => 
        prev.map(c => c.id === id ? { ...c, concluido: !c.concluido } : c)
      );
      
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do compromisso');
    }
  };

  const deleteCompromisso = async (id: string) => {
    try {
      const { error } = await supabase
        .from('compromissos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir compromisso:', error);
        toast.error('Erro ao excluir compromisso');
        return;
      }

      setCompromissos(prev => prev.filter(c => c.id !== id));
      
      // Fechar o modal se estiver aberto
      setShowDetalhesCompromisso(false);
      setCompromissoSelecionado(null);
      
      toast.success('Compromisso excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir compromisso:', error);
      toast.error('Erro ao excluir compromisso');
    }
  };

  const handleSelectCompromisso = (compromisso: Compromisso) => {
    setCompromissoSelecionado(compromisso);
    setShowDetalhesCompromisso(true);
  };

  const handleEditCompromisso = (compromisso: Compromisso) => {
    setCompromissoSelecionado(compromisso);
    setShowDetalhesCompromisso(false);
    setShowEditCompromisso(true);
  };

  const handleUpdateCompromisso = async (updatedCompromisso: Compromisso) => {
    try {
      const { error } = await supabase
        .from('compromissos')
        .update({
          titulo: updatedCompromisso.titulo,
          descricao: updatedCompromisso.descricao,
          data: updatedCompromisso.data,
          horario: updatedCompromisso.horario,
          participantes: updatedCompromisso.participantes,
          tipo: updatedCompromisso.tipo,
          prioridade: updatedCompromisso.prioridade
        })
        .eq('id', updatedCompromisso.id);

      if (error) {
        console.error('Erro ao atualizar compromisso:', error);
        toast.error('Erro ao atualizar compromisso');
        return;
      }

      setCompromissos(prev => 
        prev.map(c => c.id === updatedCompromisso.id ? updatedCompromisso : c)
      );
      
      toast.success('Compromisso atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar compromisso:', error);
      toast.error('Erro ao atualizar compromisso');
    }
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
    <div className="min-h-screen">
      <div className="content-wrapper animate-fade-in bg-white rounded-lg shadow-lg m-6 p-8">
        {/* Navigation Button */}
        <div className="navigation-button">
          <button 
            onClick={() => navigate("/")}
            className="back-button"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Calendar size={32} className="text-white" />
          </div>
          <div>
            <h1 className="page-title mb-0">Agenda</h1>
            <p className="text-description">Gerencie compromissos, reuniões e tarefas importantes</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <div className="modern-card bg-white border-green-200">
            <div className="card-content text-center p-4">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold text-green-600">
                {compromissosHoje.length}
              </div>
              <div className="text-sm text-green-600/80 mb-1">Compromissos Hoje</div>
              <div className="text-xs text-gray-500 font-medium">
                Agendados para hoje
              </div>
            </div>
          </div>

          <div className="modern-card bg-white border-green-200">
            <div className="card-content text-center p-4">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-700">
                {compromissosConcluidos}
              </div>
              <div className="text-sm text-gray-600 mb-1">Concluídos</div>
              <div className="text-xs text-gray-500 font-medium">
                Total realizados
              </div>
            </div>
          </div>

          <div className="modern-card bg-white border-green-200 relative">
            <div className="card-content text-center p-4">
              {hasUrgentTasks && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse border-2 border-white flex items-center justify-center z-10">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              )}
              <div className="text-3xl mb-2">⏰</div>
              <div className="text-2xl font-bold text-gray-700">
                {proximosCompromissos}
              </div>
              <div className="text-sm text-gray-600 mb-1">Próximos</div>
              <div className="text-xs text-gray-500 font-medium">
                Pendentes
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <Button 
            onClick={() => setShowNovoCompromisso(true)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white h-12"
          >
            <Plus size={20} />
            Novo Compromisso
          </Button>
          <Button 
            onClick={() => setShowTasksNotes(true)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
          >
            <Calendar size={20} />
            Tarefas e Anotações 
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-8 animate-slide-up max-w-6xl mx-auto">
          {/* Calendar - Full Width */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
              <AgendaCalendar 
                selectedDate={selectedDate} 
                onSelectDate={setSelectedDate}
                compromissos={compromissos}
              />
            </div>
          </div>

          {/* High Priority Tasks - Below Calendar */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
              <HighPriorityTasks 
                compromissos={compromissosMuitoImportantes}
                onSelectCompromisso={handleSelectCompromisso}
                onToggleConcluido={toggleConcluido}
              />
            </div>
          </div>

          {/* Next 3 Days */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
              <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Próximos 3 Dias
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((dayOffset) => {
                  const date = new Date();
                  date.setDate(date.getDate() + dayOffset);
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const dayCompromissos = compromissos.filter(c => c.data === dateStr);
                  const dayLabel = dayOffset === 0 ? 'Hoje' : dayOffset === 1 ? 'Amanhã' : 'Depois de Amanhã';
                  
                  return (
                    <div key={dayOffset} className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="font-semibold text-green-800 mb-2">
                        {dayLabel} - {format(date, 'dd/MM')}
                      </div>
                      {dayCompromissos.length > 0 ? (
                        <div className="space-y-2">
                          {dayCompromissos.map((compromisso) => (
                            <div key={compromisso.id} className="text-sm p-2 bg-white rounded border-l-2 border-green-300">
                              <div className="font-medium text-green-700">{compromisso.horario}</div>
                              <div className="text-green-600">{compromisso.titulo}</div>
                              {compromisso.concluido && (
                                <div className="text-xs text-green-600">✓ Concluído</div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-green-600">Nenhum compromisso</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resumo de Todos os Compromissos */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
              <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Resumo dos Compromissos
              </h3>
              
              {compromissos.length > 0 ? (
                <div className="space-y-3">
                  {compromissos
                    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                    .map((compromisso) => {
                      const isToday = compromisso.data === format(new Date(), 'yyyy-MM-dd');
                      const isPast = new Date(compromisso.data) < new Date();
                      const isUrgent = compromisso.prioridade === 'muito-importante';
                      
                      return (
                        <div 
                          key={compromisso.id} 
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            compromisso.concluido 
                              ? 'bg-gray-50 opacity-60 border-gray-300' 
                              : isToday
                              ? 'bg-green-50 border-green-400 hover:shadow-md'
                              : isPast && !compromisso.concluido
                              ? 'bg-red-50 border-red-300 hover:shadow-md'
                              : isUrgent
                              ? 'bg-orange-50 border-orange-300 hover:shadow-md'
                              : 'bg-green-50 border-green-200 hover:shadow-md hover:border-green-400'
                          }`}
                          onClick={() => handleSelectCompromisso(compromisso)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                compromisso.concluido 
                                  ? 'bg-gray-400' 
                                  : isToday
                                  ? 'bg-green-500'
                                  : isPast && !compromisso.concluido
                                  ? 'bg-red-500'
                                  : isUrgent
                                  ? 'bg-orange-500'
                                  : 'bg-green-400'
                              }`}></div>
                              <h4 className="font-semibold text-gray-800">{compromisso.titulo}</h4>
                              {isUrgent && (
                                <div className="flex text-yellow-500">
                                  <span>⭐⭐⭐</span>
                                </div>
                              )}
                              {compromisso.concluido && (
                                <span className="text-green-600 text-sm">✓ Concluído</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {format(new Date(compromisso.data), 'dd/MM/yyyy')} - {compromisso.horario}
                            </div>
                          </div>
                          
                          {compromisso.descricao && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {compromisso.descricao}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs">
                            <div className={`px-2 py-1 rounded-full ${
                              compromisso.tipo === 'reuniao' ? 'bg-blue-100 text-blue-800' :
                              compromisso.tipo === 'tarefa' ? 'bg-purple-100 text-purple-800' :
                              compromisso.tipo === 'evento' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {compromisso.tipo.charAt(0).toUpperCase() + compromisso.tipo.slice(1)}
                            </div>
                            
                            <div className="flex items-center gap-1 text-gray-500">
                              <Users size={12} />
                              {compromisso.participantes.length} participante{compromisso.participantes.length !== 1 ? 's' : ''}
                            </div>
                            
                            <div className="text-gray-500">
                              Por: {compromisso.criadoPor}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-12 h-12 bg-green-100 border-2 border-green-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Calendar size={20} className="text-green-500" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium">
                    Nenhum compromisso agendado
                  </p>
                  <p className="text-gray-500 text-xs">
                    Clique em "Novo Compromisso" para começar
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-slate-500">
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
          onEditCompromisso={handleEditCompromisso}
          currentUser={usuarioAtual}
        />

        <EditAppointmentModal
          open={showEditCompromisso}
          onOpenChange={setShowEditCompromisso}
          compromisso={compromissoSelecionado}
          onUpdateAppointment={handleUpdateCompromisso}
          usuarios={usuarios}
        />

        <TasksNotesModal 
          open={showTasksNotes}
          onOpenChange={setShowTasksNotes}
        />
      </div>
    </div>
  );
};

export default Agenda;
