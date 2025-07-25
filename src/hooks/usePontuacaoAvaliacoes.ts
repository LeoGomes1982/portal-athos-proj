import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePontuacaoAvaliacoes = (funcionarioId: number) => {
  const [pontuacaoAvaliacoes, setPontuacaoAvaliacoes] = useState(0);
  const [loading, setLoading] = useState(false);

  const calcularPontuacaoAvaliacoes = async () => {
    setLoading(true);
    try {
      // Buscar todas as avaliações do funcionário
      const { data: avaliacoes, error } = await supabase
        .from('avaliacoes_desempenho')
        .select('tipo_avaliacao, resultado')
        .eq('funcionario_id', funcionarioId.toString());

      if (error) throw error;

      if (!avaliacoes || avaliacoes.length === 0) {
        setPontuacaoAvaliacoes(0);
        return 0;
      }

      let pontuacaoTotal = 0;

      // Calcular pontuação baseada no tipo e resultado
      avaliacoes.forEach(avaliacao => {
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

      setPontuacaoAvaliacoes(pontuacaoTotal);
      return pontuacaoTotal;
    } catch (error) {
      console.error('Erro ao calcular pontuação das avaliações:', error);
      setPontuacaoAvaliacoes(0);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (funcionarioId) {
      calcularPontuacaoAvaliacoes();
    }

    // Escutar evento de nova avaliação adicionada
    const handleAvaliacaoAdicionada = (event: CustomEvent) => {
      if (event.detail.funcionarioId === funcionarioId.toString()) {
        calcularPontuacaoAvaliacoes();
      }
    };

    window.addEventListener('avaliacaoAdicionada', handleAvaliacaoAdicionada as EventListener);

    return () => {
      window.removeEventListener('avaliacaoAdicionada', handleAvaliacaoAdicionada as EventListener);
    };
  }, [funcionarioId]);

  return {
    pontuacaoAvaliacoes,
    loading,
    recalcularPontuacao: calcularPontuacaoAvaliacoes
  };
};