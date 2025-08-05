import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePontosAtividade = (funcionarioId: number) => {
  const [pontosAtividade, setPontosAtividade] = useState(0);
  const [loading, setLoading] = useState(false);

  const calcularPontosAtividade = async () => {
    setLoading(true);
    try {
      // 1. Buscar pontos das avaliações de desempenho
      const { data: avaliacoes, error: errorAvaliacoes } = await supabase
        .from('avaliacoes_desempenho')
        .select('tipo_avaliacao, resultado')
        .eq('funcionario_id', funcionarioId.toString());

      if (errorAvaliacoes) throw errorAvaliacoes;

      let pontosAvaliacoes = 0;
      
      if (avaliacoes && avaliacoes.length > 0) {
        avaliacoes.forEach(avaliacao => {
          const { tipo_avaliacao, resultado } = avaliacao;
          
          if (resultado === 'POSITIVO') {
            switch (tipo_avaliacao) {
              case 'colega':
                pontosAvaliacoes += 10;
                break;
              case 'chefia':
                pontosAvaliacoes += 20;
                break;
              case 'responsavel':
                pontosAvaliacoes += 30;
                break;
            }
          } else if (resultado === 'NEGATIVO') {
            switch (tipo_avaliacao) {
              case 'colega':
                pontosAvaliacoes -= 2;
                break;
              case 'chefia':
                pontosAvaliacoes -= 5;
                break;
              case 'responsavel':
                pontosAvaliacoes -= 10;
                break;
            }
          }
        });
      }

      // 2. Buscar pontos do histórico de atividades
      const { data: historico, error: errorHistorico } = await supabase
        .from('funcionario_historico')
        .select('tipo')
        .eq('funcionario_id', funcionarioId);

      if (errorHistorico) throw errorHistorico;

      let pontosHistorico = 0;
      let registrosNeutros = 0;

      if (historico && historico.length > 0) {
        historico.forEach((registro) => {
          switch (registro.tipo) {
            case "positivo":
              pontosHistorico += 10;
              break;
            case "negativo":
              pontosHistorico -= 3;
              break;
            case "neutro":
              registrosNeutros += 1;
              break;
          }
        });

        // A cada 2 registros neutros, adiciona 1 ponto
        pontosHistorico += Math.floor(registrosNeutros / 2);
      }

      // 3. Somar ambos os tipos de pontos
      const pontosTotal = pontosAvaliacoes + pontosHistorico;
      setPontosAtividade(pontosTotal);
      return pontosTotal;

    } catch (error) {
      console.error('Erro ao calcular pontos de atividade:', error);
      setPontosAtividade(0);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!funcionarioId) return;
    
    let mounted = true;
    
    const calcularPontos = async () => {
      if (mounted) {
        await calcularPontosAtividade();
      }
    };
    
    calcularPontos();

    // Escutar eventos de nova avaliação e novo registro de histórico
    const handleAvaliacaoAdicionada = (event: CustomEvent) => {
      if (mounted && event.detail.funcionarioId === funcionarioId.toString()) {
        calcularPontosAtividade();
      }
    };

    const handleRegistroHistoricoAdicionado = (event: CustomEvent) => {
      if (mounted && event.detail.funcionarioId === funcionarioId.toString()) {
        calcularPontosAtividade();
      }
    };

    window.addEventListener('avaliacaoAdicionada', handleAvaliacaoAdicionada as EventListener);
    window.addEventListener('registroHistoricoAdicionado', handleRegistroHistoricoAdicionado as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('avaliacaoAdicionada', handleAvaliacaoAdicionada as EventListener);
      window.removeEventListener('registroHistoricoAdicionado', handleRegistroHistoricoAdicionado as EventListener);
    };
  }, [funcionarioId]);

  return {
    pontosAtividade,
    loading,
    recalcularPontos: calcularPontosAtividade
  };
};