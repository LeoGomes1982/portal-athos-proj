
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
      setCompromissos(JSON.parse(savedCompromissos));
    } else {
      // Dados iniciais
      const compromissosIniciais: Compromisso[] = [
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
          data: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Amanhã
          horario: '14:00',
          participantes: ['user1', 'user4'],
          tipo: 'tarefa',
          concluido: false,
          criadoPor: 'user4'
        }
      ];
      setCompromissos(compromissosIniciais);
      localStorage.setItem('agenda_compromissos', JSON.stringify(compromissosIniciais));
    }
  }, []);

  // Salvar compromissos no localStorage
  useEffect(() => {
    if (compromissos.length > 0) {
      localStorage.setItem('agenda_compromissos', JSON.stringify(compromissos));
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
      
      setCompromissos([...compromissos, compromisso]);
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
    setCompromissos(compromissos.map(c => 
      c.id === id ? { ...c, concluido: !c.concluido } : c
    ));
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
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="page-header">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="page-back-button"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="page-header-icon bg-gradient-to-br from-indigo-100 to-indigo-200">
            <CalendarIcon size={24} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="page-title">Agenda</h1>
            <p className="text-description">Gestão de Tarefas e Agendamentos</p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 mb-6">
          <Button onClick={() => setShowResumoModal(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Users size={16} className="mr-2" />
            Resumo Geral
          </Button>
          <Button onClick={() => setShowNovoCompromisso(true)} variant="outline">
            <Plus size={16} className="mr-2" />
            Novo Compromisso
          </Button>
        </div>

        {/* Calendário Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border pointer-events-auto"
                />
              </CardContent>
            </Card>
          </div>

          {/* Compromissos do Dia */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedDate && getCompromissosData(selectedDate).map((compromisso) => (
                  <div
                    key={compromisso.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      compromisso.concluido 
                        ? 'bg-gray-100 opacity-60' 
                        : 'bg-white hover:shadow-md'
                    }`}
                    onClick={() => {
                      setCompromissoSelecionado(compromisso);
                      setShowDetalhesCompromisso(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{compromisso.titulo}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleConcluido(compromisso.id);
                        }}
                        className="text-green-600 hover:text-green-700"
                      >
                        {compromisso.concluido ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock size={12} />
                      {compromisso.horario}
                      <User size={12} />
                      {compromisso.participantes.length} pessoas
                    </div>
                  </div>
                ))}
                {selectedDate && getCompromissosData(selectedDate).length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Nenhum compromisso para esta data
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
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
