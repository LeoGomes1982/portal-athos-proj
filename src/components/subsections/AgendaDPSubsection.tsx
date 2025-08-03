import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Plus, Share2, Bell, CheckCircle2, CalendarClock } from "lucide-react";
import { useDocumentNotifications } from "@/hooks/useDocumentNotifications";
import { useAvisoVencimentos } from "@/hooks/useAvisoVencimentos";
import AgendaDPCalendar from "@/components/agenda/AgendaDPCalendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { isProximoDoFim } from "@/utils/funcionarioUtils";

interface Compromisso {
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

interface AgendaDPSubsectionProps {
  onBack: () => void;
}

export const AgendaDPSubsection = ({ onBack }: AgendaDPSubsectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [showNovoCompromisso, setShowNovoCompromisso] = useState(false);
  const [showResolverModal, setShowResolverModal] = useState(false);
  const [compromissoParaResolver, setCompromissoParaResolver] = useState<Compromisso | null>(null);
  const [newCompromisso, setNewCompromisso] = useState({
    titulo: '',
    descricao: '',
    data: '',
    horario: '',
    tipo: 'reuniao' as const,
    prioridade: 'normal' as const,
    participantes: [] as string[]
  });

  const { toast } = useToast();
  const { funcionariosComAvisos } = useAvisoVencimentos();
  const { documentosVencendo } = useDocumentNotifications();

  useEffect(() => {
    // Carregar compromissos do localStorage
    const savedCompromissos = localStorage.getItem('agenda_dp_compromissos');
    if (savedCompromissos) {
      setCompromissos(JSON.parse(savedCompromissos));
    }
    
    // Criar avisos automáticos
    criarAvisosAutomaticos();
  }, [funcionariosComAvisos, documentosVencendo]);

  const criarAvisosAutomaticos = () => {
    const novosAvisos: Compromisso[] = [];
    const hoje = new Date();
    const cincoDiasDepois = new Date();
    cincoDiasDepois.setDate(hoje.getDate() + 5);

    // Avisos de documentos vencendo
    documentosVencendo.forEach(doc => {
      if (doc.dataValidade) {
        const dataVencimento = new Date(doc.dataValidade);
        const cincoDiasAntes = new Date(dataVencimento);
        cincoDiasAntes.setDate(dataVencimento.getDate() - 5);

        if (cincoDiasAntes <= hoje && dataVencimento > hoje) {
          novosAvisos.push({
            id: `doc_${doc.id}_${doc.dataValidade}`,
            titulo: `Documento vencendo: ${doc.nome}`,
            descricao: `Documento de ${doc.funcionario} vence em ${dataVencimento.toLocaleDateString('pt-BR')}`,
            data: dataVencimento.toISOString().split('T')[0],
            horario: '08:00',
            participantes: ['DP', 'RH'],
            tipo: 'aviso_documento',
            concluido: false,
            criadoPor: 'Sistema',
            prioridade: 'muito-importante',
            funcionarioId: doc.id.toString(),
            funcionarioNome: doc.funcionario || 'N/A'
          });
        }
      }
    });

    // Avisos de experiência vencendo
    funcionariosComAvisos.forEach(funcionario => {
      if (funcionario.experienciaVencendo && funcionario.dataFimExperiencia) {
        const dataVencimento = new Date(funcionario.dataFimExperiencia);
        const cincoDiasAntes = new Date(dataVencimento);
        cincoDiasAntes.setDate(dataVencimento.getDate() - 5);

        if (cincoDiasAntes <= hoje && dataVencimento > hoje) {
          novosAvisos.push({
            id: `exp_${funcionario.id}_${funcionario.dataFimExperiencia}`,
            titulo: `Fim de experiência: ${funcionario.nome}`,
            descricao: `Período de experiência termina em ${dataVencimento.toLocaleDateString('pt-BR')}`,
            data: dataVencimento.toISOString().split('T')[0],
            horario: '08:00',
            participantes: ['DP', 'RH'],
            tipo: 'aviso_experiencia',
            concluido: false,
            criadoPor: 'Sistema',
            prioridade: 'muito-importante',
            funcionarioId: funcionario.id.toString(),
            funcionarioNome: funcionario.nome
          });
        }
      }

      // Avisos de aviso prévio vencendo
      if (funcionario.avisoVencendo && funcionario.dataFimAvisoPrevio) {
        const dataVencimento = new Date(funcionario.dataFimAvisoPrevio);
        const cincoDiasAntes = new Date(dataVencimento);
        cincoDiasAntes.setDate(dataVencimento.getDate() - 5);

        if (cincoDiasAntes <= hoje && dataVencimento > hoje) {
          novosAvisos.push({
            id: `aviso_${funcionario.id}_${funcionario.dataFimAvisoPrevio}`,
            titulo: `Fim de aviso prévio: ${funcionario.nome}`,
            descricao: `Aviso prévio termina em ${dataVencimento.toLocaleDateString('pt-BR')}`,
            data: dataVencimento.toISOString().split('T')[0],
            horario: '08:00',
            participantes: ['DP', 'RH'],
            tipo: 'aviso_previo',
            concluido: false,
            criadoPor: 'Sistema',
            prioridade: 'muito-importante',
            funcionarioId: funcionario.id.toString(),
            funcionarioNome: funcionario.nome
          });
        }
      }
    });

    // Atualizar compromissos existentes com novos avisos
    setCompromissos(prev => {
      const avisosExistentes = prev.filter(c => ['aviso_documento', 'aviso_experiencia', 'aviso_previo'].includes(c.tipo));
      const outrosCompromissos = prev.filter(c => !['aviso_documento', 'aviso_experiencia', 'aviso_previo'].includes(c.tipo));
      
      // Merge novos avisos com existentes (evitar duplicatas)
      const avisosAtualizados = [...avisosExistentes];
      novosAvisos.forEach(novoAviso => {
        if (!avisosExistentes.find(existente => existente.id === novoAviso.id)) {
          avisosAtualizados.push(novoAviso);
        }
      });

      const todosCompromissos = [...outrosCompromissos, ...avisosAtualizados];
      localStorage.setItem('agenda_dp_compromissos', JSON.stringify(todosCompromissos));
      return todosCompromissos;
    });
  };

  const handleCriarCompromisso = () => {
    if (!newCompromisso.titulo || !newCompromisso.data || !newCompromisso.horario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const compromisso: Compromisso = {
      id: Date.now().toString(),
      ...newCompromisso,
      participantes: ['DP', 'RH'],
      concluido: false,
      criadoPor: 'Usuário'
    };

    const novosCompromissos = [...compromissos, compromisso];
    setCompromissos(novosCompromissos);
    localStorage.setItem('agenda_dp_compromissos', JSON.stringify(novosCompromissos));

    setShowNovoCompromisso(false);
    setNewCompromisso({
      titulo: '',
      descricao: '',
      data: '',
      horario: '',
      tipo: 'reuniao',
      prioridade: 'normal',
      participantes: []
    });

    toast({
      title: "Compromisso criado",
      description: "Compromisso adicionado à agenda com sucesso"
    });
  };

  const handleCompartilharCompromisso = (compromisso: Compromisso) => {
    // Adicionar aos outras agendas (simular por enquanto)
    toast({
      title: "Compromisso compartilhado",
      description: "Compromisso foi compartilhado com outras agendas"
    });
  };

  const handleMarcarResolvido = (compromisso: Compromisso) => {
    const compromissosAtualizados = compromissos.map(c => 
      c.id === compromisso.id ? { ...c, resolvido: true, concluido: true } : c
    );
    setCompromissos(compromissosAtualizados);
    localStorage.setItem('agenda_dp_compromissos', JSON.stringify(compromissosAtualizados));

    // Gerar log no sistema
    const log = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      usuario: 'DP',
      acao: 'Aviso marcado como resolvido',
      detalhes: `${compromisso.titulo} - ${compromisso.funcionarioNome}`,
      tipo: 'resolucao_aviso'
    };
    
    const logsExistentes = localStorage.getItem('sistema_logs') || '[]';
    const logs = JSON.parse(logsExistentes);
    logs.push(log);
    localStorage.setItem('sistema_logs', JSON.stringify(logs));

    setShowResolverModal(false);
    setCompromissoParaResolver(null);

    toast({
      title: "Aviso resolvido",
      description: "Aviso marcado como resolvido e log gerado no sistema"
    });
  };

  const handleReagendarAviso = (compromisso: Compromisso) => {
    // Reagendar o aviso para 7 dias à frente (apenas na agenda, sem modificar datas do funcionário)
    const novaData = new Date();
    novaData.setDate(novaData.getDate() + 7);
    
    const avisoReagendado: Compromisso = {
      ...compromisso,
      id: `reagendado_${Date.now()}`,
      data: novaData.toISOString().split('T')[0],
      titulo: `${compromisso.titulo} (Reagendado)`,
      descricao: `${compromisso.descricao} - Reagendado para acompanhamento`,
      resolvido: false,
      concluido: false
    };

    // Marcar o aviso original como resolvido
    const compromissosAtualizados = compromissos.map(c => 
      c.id === compromisso.id ? { ...c, resolvido: true, concluido: true } : c
    );

    // Adicionar o novo aviso reagendado
    const novosCompromissos = [...compromissosAtualizados, avisoReagendado];
    setCompromissos(novosCompromissos);
    localStorage.setItem('agenda_dp_compromissos', JSON.stringify(novosCompromissos));

    // Gerar log no sistema
    const log = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      usuario: 'DP',
      acao: 'Aviso reagendado',
      detalhes: `${compromisso.titulo} - ${compromisso.funcionarioNome} reagendado para ${novaData.toLocaleDateString('pt-BR')}`,
      tipo: 'reagendamento_aviso'
    };
    
    const logsExistentes = localStorage.getItem('sistema_logs') || '[]';
    const logs = JSON.parse(logsExistentes);
    logs.push(log);
    localStorage.setItem('sistema_logs', JSON.stringify(logs));

    setShowResolverModal(false);
    setCompromissoParaResolver(null);

    toast({
      title: "Aviso reagendado",
      description: `Aviso reagendado para ${novaData.toLocaleDateString('pt-BR')} - dados do funcionário não foram alterados`
    });
  };

  const getCompromissosUrgentes = () => {
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);
    
    return compromissos.filter(c => {
      const dataCompromisso = new Date(c.data);
      const isAmanha = dataCompromisso.toDateString() === amanha.toDateString();
      const isAvisoNaoResolvido = ['aviso_documento', 'aviso_experiencia', 'aviso_previo'].includes(c.tipo) && !c.resolvido;
      return isAmanha && isAvisoNaoResolvido;
    });
  };

  const compromissosUrgentes = getCompromissosUrgentes();
  const totalCompromissos = compromissos.length;
  const compromissosConcluidos = compromissos.filter(c => c.concluido).length;
  const compromissosHoje = compromissos.filter(c => c.data === new Date().toISOString().split('T')[0]).length;
  const avisosNaoResolvidos = compromissos.filter(c => 
    ['aviso_documento', 'aviso_experiencia', 'aviso_previo'].includes(c.tipo) && !c.resolvido
  ).length;

  return (
    <div className="min-h-screen p-6" style={{ background: 'white', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto animate-fade-in bg-blue-100/40 rounded-lg shadow-lg p-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={onBack}>
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg relative">
            <Calendar size={32} className="text-white" />
            {compromissosUrgentes.length > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">{compromissosUrgentes.length}</span>
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Agenda do DP e RH
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Gerencie compromissos, avisos de vencimento e atividades do departamento pessoal
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold text-gray-700">{totalCompromissos}</div>
              <div className="text-sm text-gray-600">Total de Compromissos</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-700">{compromissosConcluidos}</div>
              <div className="text-sm text-gray-600">Concluídos</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">📋</div>
              <div className="text-2xl font-bold text-gray-700">{compromissosHoje}</div>
              <div className="text-sm text-gray-600">Hoje</div>
            </CardContent>
          </Card>

          <Card className={`modern-card border-gray-200 ${avisosNaoResolvidos > 0 ? 'bg-red-50 animate-pulse' : 'bg-white'}`}>
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">⚠️</div>
              <div className={`text-2xl font-bold ${avisosNaoResolvidos > 0 ? 'text-red-700' : 'text-gray-700'}`}>
                {avisosNaoResolvidos}
              </div>
              <div className={`text-sm ${avisosNaoResolvidos > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                Avisos Pendentes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Avisos Urgentes */}
        {compromissosUrgentes.length > 0 && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6 animate-pulse">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-red-600" size={20} />
              <h3 className="text-lg font-semibold text-red-800">Avisos Urgentes - Ação Necessária!</h3>
            </div>
            <div className="space-y-3">
              {compromissosUrgentes.map(compromisso => (
                <div key={compromisso.id} className="flex items-center justify-between bg-white p-3 rounded border border-red-200">
                  <div>
                    <p className="font-medium text-red-800">{compromisso.titulo}</p>
                    <p className="text-sm text-red-600">{compromisso.descricao}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setCompromissoParaResolver(compromisso);
                      setShowResolverModal(true);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 size={16} className="mr-1" />
                    Resolver
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            onClick={() => setShowNovoCompromisso(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Novo Compromisso
          </Button>
        </div>

        {/* Calendar */}
        <div className="mb-8">
          <AgendaDPCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            compromissos={compromissos}
          />
        </div>

        {/* Lista de Compromissos */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Próximos Compromissos</h3>
          {compromissos
            .filter(c => new Date(c.data) >= new Date())
            .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
            .slice(0, 10)
            .map(compromisso => (
              <Card key={compromisso.id} className={`transition-all ${
                ['aviso_documento', 'aviso_experiencia', 'aviso_previo'].includes(compromisso.tipo) && !compromisso.resolvido
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200 bg-white'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{compromisso.titulo}</h4>
                        <Badge variant={compromisso.tipo.includes('aviso') ? 'destructive' : 'secondary'}>
                          {compromisso.tipo.replace('_', ' ')}
                        </Badge>
                        {compromisso.prioridade === 'muito-importante' && (
                          <Badge variant="destructive">Urgente</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{compromisso.descricao}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>📅 {new Date(compromisso.data).toLocaleDateString('pt-BR')}</span>
                        <span>🕐 {compromisso.horario}</span>
                        <span>👤 {compromisso.criadoPor}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!compromisso.tipo.includes('aviso') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompartilharCompromisso(compromisso)}
                        >
                          <Share2 size={16} />
                        </Button>
                      )}
                      {compromisso.tipo.includes('aviso') && !compromisso.resolvido && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setCompromissoParaResolver(compromisso);
                            setShowResolverModal(true);
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Modal Novo Compromisso */}
      <Dialog open={showNovoCompromisso} onOpenChange={setShowNovoCompromisso}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Compromisso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Título do compromisso"
              value={newCompromisso.titulo}
              onChange={(e) => setNewCompromisso(prev => ({ ...prev, titulo: e.target.value }))}
            />
            <Textarea
              placeholder="Descrição"
              value={newCompromisso.descricao}
              onChange={(e) => setNewCompromisso(prev => ({ ...prev, descricao: e.target.value }))}
            />
            <Input
              type="date"
              value={newCompromisso.data}
              onChange={(e) => setNewCompromisso(prev => ({ ...prev, data: e.target.value }))}
            />
            <Input
              type="time"
              value={newCompromisso.horario}
              onChange={(e) => setNewCompromisso(prev => ({ ...prev, horario: e.target.value }))}
            />
            <Select value={newCompromisso.tipo} onValueChange={(value) => 
              setNewCompromisso(prev => ({ ...prev, tipo: value as any }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="tarefa">Tarefa</SelectItem>
                <SelectItem value="evento">Evento</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newCompromisso.prioridade} onValueChange={(value) => 
              setNewCompromisso(prev => ({ ...prev, prioridade: value as any }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="importante">Importante</SelectItem>
                <SelectItem value="muito-importante">Muito Importante</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNovoCompromisso(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCriarCompromisso}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Resolver Aviso */}
      <Dialog open={showResolverModal} onOpenChange={setShowResolverModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Marcar como Resolvido</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Tem certeza que deseja marcar este aviso como resolvido?</p>
            {compromissoParaResolver && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium">{compromissoParaResolver.titulo}</p>
                <p className="text-sm text-gray-600">{compromissoParaResolver.descricao}</p>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Esta ação gerará um log no sistema e marcará o aviso como resolvido.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolverModal(false)}>
              Cancelar
            </Button>
            {compromissoParaResolver?.tipo === 'aviso_previo' && (
              <Button 
                onClick={() => compromissoParaResolver && handleReagendarAviso(compromissoParaResolver)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CalendarClock size={16} className="mr-1" />
                Reagendar
              </Button>
            )}
            <Button 
              onClick={() => compromissoParaResolver && handleMarcarResolvido(compromissoParaResolver)}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};