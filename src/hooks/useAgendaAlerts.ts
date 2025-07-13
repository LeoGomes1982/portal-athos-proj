import { useState, useEffect } from "react";

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

export const useAgendaAlerts = () => {
  const [hasUrgentTasks, setHasUrgentTasks] = useState(false);

  const checkUrgentTasks = () => {
    try {
      const savedCompromissos = localStorage.getItem('agenda_compromissos');
      if (!savedCompromissos) {
        setHasUrgentTasks(false);
        return;
      }

      const compromissos: Compromisso[] = JSON.parse(savedCompromissos);
      const hoje = new Date();
      const amanha = new Date(hoje);
      amanha.setDate(hoje.getDate() + 1);
      
      const amanhaStr = amanha.toISOString().split('T')[0];

      // Verificar se há compromissos de prioridade muito-importante para amanhã
      const urgentTasks = compromissos.filter(compromisso => 
        compromisso.prioridade === 'muito-importante' &&
        compromisso.data === amanhaStr &&
        !compromisso.concluido
      );

      setHasUrgentTasks(urgentTasks.length > 0);
    } catch (error) {
      console.error('Erro ao verificar tarefas urgentes:', error);
      setHasUrgentTasks(false);
    }
  };

  useEffect(() => {
    checkUrgentTasks();
    
    // Verificar a cada minuto
    const interval = setInterval(checkUrgentTasks, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { hasUrgentTasks, checkUrgentTasks };
};