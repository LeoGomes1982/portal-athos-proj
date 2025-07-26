import { supabase } from '@/integrations/supabase/client';
import { addDays, format } from 'date-fns';

export const useAvaliacaoAgendamento = () => {
  
  // Agendar avaliações para um funcionário recém-admitido
  const agendarAvaliacoesAdmissao = async (funcionarioId: number, funcionarioNome: string, dataAdmissao: string) => {
    try {
      const dataAdmissaoDate = new Date(dataAdmissao);
      
      // Primeira avaliação: aos 30 dias de serviço
      const dataAvaliacao30 = addDays(dataAdmissaoDate, 30);
      await criarSequenciaAvaliacoes(funcionarioId, funcionarioNome, dataAvaliacao30, 'primeiro_periodo');
      
      // Segunda avaliação: aos 70 dias de serviço
      const dataAvaliacao70 = addDays(dataAdmissaoDate, 70);
      await criarSequenciaAvaliacoes(funcionarioId, funcionarioNome, dataAvaliacao70, 'segundo_periodo');
      
      // Terceira avaliação: aos 8 meses (240 dias) de serviço
      const dataAvaliacao8meses = addDays(dataAdmissaoDate, 240);
      await criarSequenciaAvaliacoes(funcionarioId, funcionarioNome, dataAvaliacao8meses, 'periodica');
      
      console.log(`Avaliações agendadas para ${funcionarioNome}`);
    } catch (error) {
      console.error('Erro ao agendar avaliações de admissão:', error);
    }
  };

  // Agendar próxima sequência de avaliações (a cada 8 meses)
  const agendarProximaSequencia = async (funcionarioId: number, funcionarioNome: string, ultimaAvaliacao: Date) => {
    try {
      // Próxima avaliação em 8 meses
      const proximaAvaliacao = addDays(ultimaAvaliacao, 240);
      await criarSequenciaAvaliacoes(funcionarioId, funcionarioNome, proximaAvaliacao, 'periodica');
      
      console.log(`Próxima sequência de avaliações agendada para ${funcionarioNome}`);
    } catch (error) {
      console.error('Erro ao agendar próxima sequência:', error);
    }
  };

  // Criar sequência de 3 avaliações (colega, chefia, responsável) em dias consecutivos
  const criarSequenciaAvaliacoes = async (funcionarioId: number, funcionarioNome: string, dataInicio: Date, periodo: string) => {
    const avaliacoes = [
      {
        tipo: 'colega',
        dia: 0, // Mesmo dia
        descricao: `Avaliação de Desempenho - Colega de ${funcionarioNome}`
      },
      {
        tipo: 'chefia',
        dia: 1, // Dia seguinte
        descricao: `Avaliação de Desempenho - Chefia de ${funcionarioNome}`
      },
      {
        tipo: 'responsavel', 
        dia: 2, // Dois dias depois
        descricao: `Avaliação de Desempenho - Responsável de ${funcionarioNome}`
      }
    ];

    const compromissos = avaliacoes.map(avaliacao => {
      const dataAvaliacao = addDays(dataInicio, avaliacao.dia);
      
      return {
        titulo: avaliacao.descricao,
        descricao: `${avaliacao.descricao} - Período: ${periodo}. Funcionário ID: ${funcionarioId}`,
        data: format(dataAvaliacao, 'yyyy-MM-dd'),
        horario: '14:00:00',
        participantes: [funcionarioNome, 'RH@GRUPOATHOSBRASIL.COM'],
        tipo: 'avaliacao_desempenho',
        prioridade: 'alta',
        criado_por: 'Sistema - Agendamento Automático',
        concluido: false,
        user_id: null
      };
    });

    // Inserir todos os compromissos de uma vez
    const { error } = await supabase
      .from('compromissos')
      .insert(compromissos);

    if (error) {
      console.error('Erro ao criar compromissos de avaliação:', error);
      throw error;
    }
  };

  // Verificar e agendar avaliações em atraso
  const verificarAvaliacoesEmAtraso = async () => {
    try {
      // Buscar funcionários ativos
      const { data: funcionarios, error: funcionariosError } = await supabase
        .from('funcionarios_sync')
        .select('funcionario_id, nome, data_admissao')
        .eq('status', 'ativo')
        .not('data_admissao', 'is', null);

      if (funcionariosError) throw funcionariosError;

      const hoje = new Date();

      for (const funcionario of funcionarios || []) {
        const dataAdmissao = new Date(funcionario.data_admissao);
        const diasTrabalho = Math.floor((hoje.getTime() - dataAdmissao.getTime()) / (1000 * 3600 * 24));

        // Verificar se já existem avaliações agendadas para este funcionário
        const { data: avaliacoesExistentes, error: avaliacoesError } = await supabase
          .from('compromissos')
          .select('id')
          .eq('tipo', 'avaliacao_desempenho')
          .ilike('descricao', `%${funcionario.funcionario_id}%`);

        if (avaliacoesError) throw avaliacoesError;

        // Se não há avaliações agendadas e já passou dos 30 dias
        if (!avaliacoesExistentes?.length && diasTrabalho >= 30) {
          console.log(`Agendando avaliações em atraso para ${funcionario.nome}`);
          await agendarAvaliacoesAdmissao(funcionario.funcionario_id, funcionario.nome, funcionario.data_admissao);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar avaliações em atraso:', error);
    }
  };

  return {
    agendarAvaliacoesAdmissao,
    agendarProximaSequencia,
    verificarAvaliacoesEmAtraso
  };
};