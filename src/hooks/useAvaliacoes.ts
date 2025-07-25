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

  // Carregar avaliações do localStorage (temporário até tipos serem atualizados)
  const carregarAvaliacoes = async () => {
    setLoading(true);
    try {
      // Usar localStorage temporariamente
      const savedAvaliacoes = localStorage.getItem('avaliacoes_desempenho');
      if (savedAvaliacoes) {
        const parsedAvaliacoes = JSON.parse(savedAvaliacoes);
        setAvaliacoes(parsedAvaliacoes);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as avaliações",
        variant: "destructive"
      });
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

  // Calcular resultado final baseado em 3 avaliações (colega, chefia, responsável)
  const calcularResultadoFinal = async (funcionarioId: string): Promise<{ resultado: 'POSITIVO' | 'NEGATIVO' | 'NEUTRO', pontuacao: number }> => {
    try {
      // Buscar as 3 últimas avaliações do funcionário (uma de cada tipo)
      const savedAvaliacoes = localStorage.getItem('avaliacoes_desempenho');
      const todasAvaliacoes = savedAvaliacoes ? JSON.parse(savedAvaliacoes) : [];
      
      const avaliacoesFuncionario = todasAvaliacoes.filter((av: Avaliacao) => av.funcionario_id === funcionarioId);
      
      // Pegar a última avaliação de cada tipo
      const avaliacaoColega = avaliacoesFuncionario.filter((av: Avaliacao) => av.tipo_avaliacao === 'colega').pop();
      const avaliacaoChefia = avaliacoesFuncionario.filter((av: Avaliacao) => av.tipo_avaliacao === 'chefia').pop();
      const avaliacaoResponsavel = avaliacoesFuncionario.filter((av: Avaliacao) => av.tipo_avaliacao === 'responsavel').pop();
      
      // Se não temos as 3 avaliações, retorna resultado neutro
      if (!avaliacaoColega || !avaliacaoChefia || !avaliacaoResponsavel) {
        return { resultado: 'NEUTRO', pontuacao: 0 };
      }
      
      const resultadoColega = avaliacaoColega.resultado;
      const resultadoChefia = avaliacaoChefia.resultado;
      const resultadoResponsavel = avaliacaoResponsavel.resultado;
      
      // Aplicar a lógica de cálculo baseada nas regras fornecidas
      if (resultadoColega === 'POSITIVO' && resultadoChefia === 'POSITIVO' && resultadoResponsavel === 'POSITIVO') {
        return { resultado: 'POSITIVO', pontuacao: 50 };
      }
      
      if (resultadoColega === 'POSITIVO' && resultadoChefia === 'NEGATIVO' && resultadoResponsavel === 'NEGATIVO') {
        return { resultado: 'NEGATIVO', pontuacao: -10 };
      }
      
      if (resultadoColega === 'POSITIVO' && resultadoChefia === 'POSITIVO' && resultadoResponsavel === 'NEGATIVO') {
        return { resultado: 'NEUTRO', pontuacao: 0 };
      }
      
      if (resultadoColega === 'NEGATIVO' && resultadoChefia === 'NEGATIVO' && resultadoResponsavel === 'NEGATIVO') {
        return { resultado: 'NEGATIVO', pontuacao: -10 };
      }
      
      if (resultadoColega === 'NEGATIVO' && resultadoChefia === 'POSITIVO' && resultadoResponsavel === 'POSITIVO') {
        return { resultado: 'POSITIVO', pontuacao: 50 };
      }
      
      if (resultadoColega === 'NEGATIVO' && resultadoChefia === 'POSITIVO' && resultadoResponsavel === 'NEGATIVO') {
        return { resultado: 'NEGATIVO', pontuacao: -10 };
      }
      
      // Casos adicionais (neutro + outros)
      if (resultadoColega === 'NEUTRO' || resultadoChefia === 'NEUTRO' || resultadoResponsavel === 'NEUTRO') {
        const positivos = [resultadoColega, resultadoChefia, resultadoResponsavel].filter(r => r === 'POSITIVO').length;
        const negativos = [resultadoColega, resultadoChefia, resultadoResponsavel].filter(r => r === 'NEGATIVO').length;
        
        if (positivos > negativos) {
          return { resultado: 'POSITIVO', pontuacao: 50 };
        } else if (negativos > positivos) {
          return { resultado: 'NEGATIVO', pontuacao: -10 };
        } else {
          return { resultado: 'NEUTRO', pontuacao: 0 };
        }
      }
      
      return { resultado: 'NEUTRO', pontuacao: 0 };
    } catch (error) {
      console.error('Erro ao calcular resultado final:', error);
      return { resultado: 'NEUTRO', pontuacao: 0 };
    }
  };

  // Adicionar nova avaliação
  const adicionarAvaliacao = async (dadosAvaliacao: AvaliacaoFormData) => {
    try {
      const { resultado, pontuacao } = calcularResultado(dadosAvaliacao.perguntas_marcadas);
      
      const novaAvaliacao: Avaliacao = {
        id: Date.now().toString(),
        ...dadosAvaliacao,
        pontuacao_total: pontuacao,
        resultado,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Salvar no localStorage temporariamente
      const savedAvaliacoes = localStorage.getItem('avaliacoes_desempenho');
      const avaliacoes = savedAvaliacoes ? JSON.parse(savedAvaliacoes) : [];
      const novasAvaliacoes = [novaAvaliacao, ...avaliacoes];
      localStorage.setItem('avaliacoes_desempenho', JSON.stringify(novasAvaliacoes));

      // Adicionar registro ao histórico do funcionário
      await adicionarRegistroHistorico(
        dadosAvaliacao.funcionario_id,
        dadosAvaliacao.funcionario_nome,
        dadosAvaliacao.tipo_avaliacao,
        resultado,
        novaAvaliacao.id
      );

      setAvaliacoes(prev => [novaAvaliacao, ...prev]);
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