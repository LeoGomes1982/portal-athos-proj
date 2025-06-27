
import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  ArrowLeft, 
  Plus, 
  Users, 
  Building2,
  CheckCircle2,
  Circle,
  Clock,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
    tipo: 'reuniao' as 'reuniao' | 'tarefa' | 'evento'
  });

  const usuarios = ['user1', 'user2', 'user3', 'user4'];
  const usuarioAtual = 'user1'; // Simular usuário logado

  // Carregar compromissos do localStorage
  useEffect(() => {
    const savedCompromissos = localStorage.getItem('agenda_compromissos');
    if (savedCompromissos) {
      try {
        const parsedCompromissos = JSON.parse(savedCompromissos);
        setCompromissos(parsedCompromissos);
        console.log('Compromissos carregados:', parsedCompromissos);
      } catch (error) {
        console.error('Erro ao carregar compromissos:', error);
        // Se houver erro, criar dados iniciais
        const compromissosIniciais = criarCompromissosIniciais();
        setCompromissos(compromissosIniciais);
        localStorage.setItem('agenda_compromissos', JSON.stringify(compromissosIniciais));
      }
    } else {
      // Criar dados iniciais se não existirem
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
        criadoPor: 'user1'
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
        criadoPor: 'user4'
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
      
      // Salvar imediatamente
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
        tipo: 'reuniao'
      });
      setShowNovoCompromisso(false);
    }
  };

  const toggleConcluido = (id: string) => {
    const novosCompromissos = compromissos.map(c => 
      c.id === id ? { ...c, concluido: !c.concluido } : c
    );
    setCompromissos(novosCompromissos);
    
    // Salvar imediatamente
    try {
      localStorage.setItem('agenda_compromissos', JSON.stringify(novosCompromissos));
      console.log('Status de compromisso atualizado:', id);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const getCompromissosUsuario = (usuario: string) => {
    return compromissos.filter(c => 
      c.participantes.includes(usuario) || c.criadoPor === usuario
    );
  };

  const getProximaReuniao = () => {
    const hoje = new Date();
    const reunioes = compromissos
      .filter(c => c.tipo === 'reuniao' && !c.concluido && new Date(c.data) >= hoje)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    return reunioes[0];
  };

  const getProximaReuniaoGeral = () => {
    const proximaReuniao = getProximaReuniao();
    return proximaReuniao && proximaReuniao.participantes.length >= 3 ? proximaReuniao : null;
  };

  const getProximaReuniaoDiretoria = () => {
    const proximaReuniao = getProximaReuniao();
    return proximaReuniao && proximaReuniao.titulo.toLowerCase().includes('diretoria') ? proximaReuniao : null;
  };

  const getCompromissosData = (data: Date) => {
    const dataStr = format(data, 'yyyy-MM-dd');
    return compromissos.filter(c => c.data === dataStr);
  };

  const handleParticipanteChange = (usuario: string, checked: boolean) => {
    if (checked) {
      setNovoCompromisso(prev => ({
        ...prev,
        participantes: [...prev.participantes, usuario]
      }));
    } else {
      setNovoCompromisso(prev => ({
        ...prev,
        participantes: prev.participantes.filter(p => p !== usuario)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100/60 via-purple-50/40 to-violet-100/50">
      <div className="content-wrapper animate-fade-in bg-white/90 backdrop-blur-sm border border-purple-200/60 shadow-lg">
        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button onClick={() => navigate("/")} className="back-button">
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <CalendarIcon size={32} className="text-white" />
          </div>
          <div>
            <h1 className="page-title mb-0">Agenda</h1>
            <p className="text-description">Gestão de Tarefas e Agendamentos</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setShowResumoModal(true)}
              className="primary-btn text-base px-8 py-4 h-auto bg-purple-600 hover:bg-purple-700"
            >
              <Users size={20} className="mr-2" />
              Resumo Geral
            </button>
            <button 
              onClick={() => setShowNovoCompromisso(true)}
              className="success-btn text-base px-8 py-4 h-auto"
            >
              <Plus size={20} className="mr-2" />
              Novo Compromisso
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar - Full Width */}
          <Card className="lg:col-span-2 modern-card animate-slide-up bg-white/95 backdrop-blur-sm border-purple-200/60 shadow-md">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <CalendarIcon size={20} className="text-purple-600" />
                Calendário
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="w-full">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
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

          {/* Daily Schedule */}
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
                    onClick={() => {
                      setCompromissoSelecionado(compromisso);
                      setShowDetalhesCompromisso(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-base text-gray-800">{compromisso.titulo}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleConcluido(compromisso.id);
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
        </div>

        {/* Modal de Resumo */}
        <Dialog open={showResumoModal} onOpenChange={setShowResumoModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Resumo Geral da Agenda</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compromissos por Usuário */}
              <div>
                <h3 className="font-semibold mb-4">Compromissos por Membro</h3>
                <div className="space-y-4">
                  {usuarios.map((usuario) => {
                    const compromissosUsuario = getCompromissosUsuario(usuario);
                    const pendentes = compromissosUsuario.filter(c => !c.concluido).length;
                    return (
                      <div key={usuario} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{usuario}</span>
                          <span className="text-sm text-gray-600">
                            {pendentes} pendente{pendentes !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {compromissosUsuario.length} total
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Próximas Reuniões */}
              <div>
                <h3 className="font-semibold mb-4">Próximas Reuniões</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800">Reunião Geral</div>
                    {getProximaReuniaoGeral() ? (
                      <div className="text-sm text-blue-600">
                        {format(new Date(getProximaReuniaoGeral()!.data), "dd/MM/yyyy")} às {getProximaReuniaoGeral()!.horario}
                        <div className="text-xs">{getProximaReuniaoGeral()!.titulo}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Nenhuma reunião agendada</div>
                    )}
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-800">Reunião de Diretoria</div>
                    {getProximaReuniaoDiretoria() ? (
                      <div className="text-sm text-purple-600">
                        {format(new Date(getProximaReuniaoDiretoria()!.data), "dd/MM/yyyy")} às {getProximaReuniaoDiretoria()!.horario}
                        <div className="text-xs">{getProximaReuniaoDiretoria()!.titulo}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Nenhuma reunião agendada</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Novo Compromisso */}
        <Dialog open={showNovoCompromisso} onOpenChange={setShowNovoCompromisso}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Compromisso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={novoCompromisso.titulo}
                  onChange={(e) => setNovoCompromisso(prev => ({ ...prev, titulo: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={novoCompromisso.descricao}
                  onChange={(e) => setNovoCompromisso(prev => ({ ...prev, descricao: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={novoCompromisso.data}
                    onChange={(e) => setNovoCompromisso(prev => ({ ...prev, data: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="horario">Horário</Label>
                  <Input
                    id="horario"
                    type="time"
                    value={novoCompromisso.horario}
                    onChange={(e) => setNovoCompromisso(prev => ({ ...prev, horario: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Tipo</Label>
                <Select
                  value={novoCompromisso.tipo}
                  onValueChange={(value: 'reuniao' | 'tarefa' | 'evento') => 
                    setNovoCompromisso(prev => ({ ...prev, tipo: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="tarefa">Tarefa</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Participantes</Label>
                <div className="space-y-2 mt-2">
                  {usuarios.map((usuario) => (
                    <div key={usuario} className="flex items-center space-x-2">
                      <Checkbox
                        id={usuario}
                        checked={novoCompromisso.participantes.includes(usuario)}
                        onCheckedChange={(checked) => handleParticipanteChange(usuario, checked as boolean)}
                      />
                      <Label htmlFor={usuario}>{usuario}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNovoCompromisso(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCriarCompromisso}>
                  Criar Compromisso
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Detalhes do Compromisso */}
        <Dialog open={showDetalhesCompromisso} onOpenChange={setShowDetalhesCompromisso}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Compromisso</DialogTitle>
            </DialogHeader>
            {compromissoSelecionado && (
              <div className="space-y-4">
                <div>
                  <Label>Título</Label>
                  <p className="font-medium">{compromissoSelecionado.titulo}</p>
                </div>

                <div>
                  <Label>Descrição</Label>
                  <p className="text-gray-700">{compromissoSelecionado.descricao}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data</Label>
                    <p>{format(new Date(compromissoSelecionado.data), "dd/MM/yyyy")}</p>
                  </div>
                  <div>
                    <Label>Horário</Label>
                    <p>{compromissoSelecionado.horario}</p>
                  </div>
                </div>

                <div>
                  <Label>Tipo</Label>
                  <p className="capitalize">{compromissoSelecionado.tipo}</p>
                </div>

                <div>
                  <Label>Participantes</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {compromissoSelecionado.participantes.map((participante) => (
                      <span key={participante} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {participante}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => {
                        toggleConcluido(compromissoSelecionado.id);
                        setCompromissoSelecionado(prev => prev ? { ...prev, concluido: !prev.concluido } : null);
                      }}
                      className="text-green-600 hover:text-green-700"
                    >
                      {compromissoSelecionado.concluido ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                    <span className={compromissoSelecionado.concluido ? 'text-green-600' : 'text-gray-600'}>
                      {compromissoSelecionado.concluido ? 'Concluído' : 'Pendente'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Agenda;
