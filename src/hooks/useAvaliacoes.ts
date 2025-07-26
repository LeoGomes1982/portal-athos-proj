import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Avaliacao {
  id: string;
  funcionario_id: string;
  funcionario_nome: string;
  tipo_avaliacao: 'colega' | 'chefia' | 'responsavel';
  avaliador_nome: string;
  data_avaliacao: string;
  perguntas_marcadas: Record<string, string>;
  perguntas_descritivas: Record<string, string>;
  recomendacoes?: Record<string, string>;
  sugestoes?: Record<string, string>;
  feedback?: string;
  pontuacao_total: number;
  resultado: 'POSITIVO' | 'NEGATIVO' | 'NEUTRO';
  created_at: string;
  updated_at: string;
}

export interface AvaliacaoFormData {
  funcionario_id: string;
  funcionario_nome: string;
  tipo_avaliacao: 'colega' | 'chefia' | 'responsavel';
  avaliador_nome: string;
  data_avaliacao: string;
  perguntas_marcadas: Record<string, string>;
  perguntas_descritivas: Record<string, string>;
  recomendacoes?: Record<string, string>;
  sugestoes?: Record<string, string>;
  feedback?: string;
}

export const useAvaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Carregar avaliações do Supabase
  const carregarAvaliacoes = async () => {
    setLoading(true);
    try {
      console.log('Carregando avaliações...');
      const { data, error } = await supabase
        .from('avaliacoes_desempenho')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar avaliações:', error);
        setAvaliacoes([]);
      } else if (data && data.length > 0) {
        console.log('Avaliações carregadas:', data.length);
        setAvaliacoes(data as Avaliacao[]);
      } else {
        console.log('Nenhuma avaliação encontrada');
        setAvaliacoes([]);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      setAvaliacoes([]);
    } finally {
      setLoading(false);
    }
  };

  // Calcular resultado baseado nas respostas para uma avaliação individual
  const calcularResultado = (perguntas_marcadas: Record<string, string>): { resultado: 'POSITIVO' | 'NEGATIVO' | 'NEUTRO', pontuacao: number } => {
    const respostas = Object.values(perguntas_marcadas);
    const positivas = respostas.filter(resp => resp === 'Excelente' || resp === 'Muito Bom').length;
    const negativas = respostas.filter(resp => resp === 'Ruim' || resp === 'Muito Ruim').length;
    const neutras = respostas.filter(resp => resp === 'Regular' || resp === 'Bom').length;

    // Resultado individual da avaliação (será usado para calcular o resultado final)
    if (positivas > negativas && positivas > neutras) {
      return { resultado: 'POSITIVO', pontuacao: 0 }; // Pontuação será calculada no resultado final
    } else if (negativas > positivas) {
      return { resultado: 'NEGATIVO', pontuacao: 0 };
    } else {
      return { resultado: 'NEUTRO', pontuacao: 0 };
    }
  };

  // Calcular resultado final baseado em todas as avaliações do funcionário
  const calcularResultadoFinal = async (funcionarioId: string): Promise<{ resultado: 'POSITIVO' | 'NEGATIVO' | 'NEUTRO', pontuacao: number }> => {
    try {
      // Buscar todas as avaliações do funcionário do Supabase
      const { data: avaliacoesFuncionario, error } = await supabase
        .from('avaliacoes_desempenho')
        .select('*')
        .eq('funcionario_id', funcionarioId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!avaliacoesFuncionario || avaliacoesFuncionario.length === 0) {
        return { resultado: 'NEUTRO', pontuacao: 0 };
      }
      
      let pontuacaoTotal = 0;
      
      // Calcular pontuação para cada avaliação baseada no tipo e resultado
      avaliacoesFuncionario.forEach(avaliacao => {
        const { tipo_avaliacao, resultado } = avaliacao;
        
        if (resultado === 'POSITIVO') {
          switch (tipo_avaliacao) {
            case 'colega':
              pontuacaoTotal += 10;
              break;
            case 'chefia':
              pontuacaoTotal += 20;
              break;
            case 'responsavel':
              pontuacaoTotal += 30;
              break;
          }
        } else if (resultado === 'NEGATIVO') {
          switch (tipo_avaliacao) {
            case 'colega':
              pontuacaoTotal -= 2;
              break;
            case 'chefia':
              pontuacaoTotal -= 5;
              break;
            case 'responsavel':
              pontuacaoTotal -= 10;
              break;
          }
        }
        // NEUTRO não adiciona nem remove pontos
      });
      
      // Determinar resultado final baseado na pontuação total
      let resultadoFinal: 'POSITIVO' | 'NEGATIVO' | 'NEUTRO';
      
      if (pontuacaoTotal > 0) {
        resultadoFinal = 'POSITIVO';
      } else if (pontuacaoTotal < 0) {
        resultadoFinal = 'NEGATIVO';
      } else {
        resultadoFinal = 'NEUTRO';
      }
      
      return { resultado: resultadoFinal, pontuacao: pontuacaoTotal };
    } catch (error) {
      console.error('Erro ao calcular resultado final:', error);
      return { resultado: 'NEUTRO', pontuacao: 0 };
    }
  };

  // Adicionar nova avaliação
  const adicionarAvaliacao = async (dadosAvaliacao: AvaliacaoFormData) => {
    try {
      const { resultado, pontuacao } = calcularResultado(dadosAvaliacao.perguntas_marcadas);
      
      const novaAvaliacao = {
        funcionario_id: dadosAvaliacao.funcionario_id,
        funcionario_nome: dadosAvaliacao.funcionario_nome,
        tipo_avaliacao: dadosAvaliacao.tipo_avaliacao,
        avaliador_nome: dadosAvaliacao.avaliador_nome,
        data_avaliacao: dadosAvaliacao.data_avaliacao,
        perguntas_marcadas: dadosAvaliacao.perguntas_marcadas,
        perguntas_descritivas: dadosAvaliacao.perguntas_descritivas,
        recomendacoes: dadosAvaliacao.recomendacoes || {},
        sugestoes: dadosAvaliacao.sugestoes || {},
        feedback: dadosAvaliacao.feedback || '',
        pontuacao_total: pontuacao,
        resultado
      };

      // Salvar no Supabase
      const { data, error } = await supabase
        .from('avaliacoes_desempenho')
        .insert(novaAvaliacao)
        .select()
        .single();

      if (error) throw error;

      // Adicionar registro ao histórico do funcionário
      await adicionarRegistroHistorico(
        dadosAvaliacao.funcionario_id,
        dadosAvaliacao.funcionario_nome,
        dadosAvaliacao.tipo_avaliacao,
        resultado,
        data.id
      );

      // Atualizar pontuação do funcionário em tempo real (trigger para outros componentes)
      window.dispatchEvent(new CustomEvent('avaliacaoAdicionada', { 
        detail: { funcionarioId: dadosAvaliacao.funcionario_id } 
      }));

      // Recarregar avaliações
      await carregarAvaliacoes();

      toast({
        title: "Sucesso",
        description: "Avaliação cadastrada com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar a avaliação",
        variant: "destructive"
      });
      return false;
    }
  };

  // Adicionar registro no histórico do funcionário
  const adicionarRegistroHistorico = async (
    funcionarioId: string,
    funcionarioNome: string,
    tipoAvaliacao: string,
    resultado: string,
    avaliacaoId: string
  ) => {
    try {
      const titulo = `Avaliação de Desempenho - ${tipoAvaliacao.charAt(0).toUpperCase() + tipoAvaliacao.slice(1)}`;
      const descricao = `Avaliação realizada com resultado: ${resultado}. Clique para visualizar detalhes.`;
      const tipo = resultado === 'POSITIVO' ? 'positivo' : resultado === 'NEGATIVO' ? 'negativo' : 'neutro';

      await supabase
        .from('funcionario_historico')
        .insert({
          funcionario_id: parseInt(funcionarioId),
          titulo,
          descricao,
          tipo,
          usuario: localStorage.getItem('currentUser') || 'Sistema',
          arquivo_url: `/resultados-pessoais?avaliacao=${avaliacaoId}` // Link para a avaliação
        });

      // Verificar se é a última avaliação da sequência (responsável) para agendar próxima sequência
      if (tipoAvaliacao === 'responsavel') {
        // Importar dinamicamente o hook de agendamento
        const { useAvaliacaoAgendamento } = await import('./useAvaliacaoAgendamento');
        const { agendarProximaSequencia } = useAvaliacaoAgendamento();
        
        // Agendar próxima sequência em 8 meses
        const ultimaAvaliacao = new Date();
        await agendarProximaSequencia(parseInt(funcionarioId), funcionarioNome, ultimaAvaliacao);
      }

    } catch (error) {
      console.error('Erro ao adicionar registro no histórico:', error);
    }
  };

  // Carregar avaliações inicial
  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  return {
    avaliacoes,
    loading,
    adicionarAvaliacao,
    carregarAvaliacoes,
    calcularResultadoFinal
  };
};