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

  // Calcular resultado baseado nas respostas
  const calcularResultado = (perguntas_marcadas: Record<string, string>): { resultado: 'POSITIVO' | 'NEGATIVO' | 'NEUTRO', pontuacao: number } => {
    const respostas = Object.values(perguntas_marcadas);
    const positivas = respostas.filter(resp => resp === 'Excelente' || resp === 'Muito Bom').length;
    const negativas = respostas.filter(resp => resp === 'Ruim' || resp === 'Muito Ruim').length;
    const neutras = respostas.filter(resp => resp === 'Regular' || resp === 'Bom').length;

    let pontuacao = 0;
    if (positivas > negativas && positivas > neutras) {
      pontuacao = 20;
      return { resultado: 'POSITIVO', pontuacao };
    } else if (negativas > positivas) {
      pontuacao = -3;
      return { resultado: 'NEGATIVO', pontuacao };
    } else {
      pontuacao = 0;
      return { resultado: 'NEUTRO', pontuacao };
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
    carregarAvaliacoes
  };
};