import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HistoricoRegistro {
  id: string;
  funcionario_id: number;
  titulo: string;
  descricao: string;
  tipo: 'positivo' | 'neutro' | 'negativo';
  usuario: string;
  created_at: string;
  updated_at: string;
}

export const useFuncionarioHistorico = (funcionarioId: number | string) => {
  const [historico, setHistorico] = useState<HistoricoRegistro[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Carregar histórico do Supabase
  const carregarHistorico = async () => {
    if (!funcionarioId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('funcionario_historico')
        .select('*')
        .eq('funcionario_id', parseInt(funcionarioId.toString()))
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistorico((data as HistoricoRegistro[]) || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar novo registro
  const adicionarRegistro = async (
    titulo: string, 
    descricao: string, 
    tipo: 'positivo' | 'neutro' | 'negativo' = 'neutro',
    usuario: string = 'Sistema'
  ) => {
    try {
      const { data, error } = await supabase
        .from('funcionario_historico')
        .insert({
          funcionario_id: parseInt(funcionarioId.toString()),
          titulo,
          descricao,
          tipo,
          usuario
        })
        .select()
        .single();

      if (error) throw error;

      setHistorico(prev => [data as HistoricoRegistro, ...prev]);
      toast({
        title: "Sucesso",
        description: "Registro adicionado ao histórico",
      });

      return true;
    } catch (error) {
      console.error('Erro ao adicionar registro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o registro",
        variant: "destructive"
      });
      return false;
    }
  };

  // Escutar mudanças em tempo real
  useEffect(() => {
    if (!funcionarioId) return;

    const channel = supabase
      .channel('funcionario-historico-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'funcionario_historico',
          filter: `funcionario_id=eq.${parseInt(funcionarioId.toString())}`
        },
        () => {
          carregarHistorico();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [funcionarioId]);

  // Carregar histórico inicial
  useEffect(() => {
    carregarHistorico();
  }, [funcionarioId]);

  return {
    historico,
    loading,
    adicionarRegistro,
    carregarHistorico
  };
};