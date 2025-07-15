import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Vaga {
  id: string;
  titulo: string;
  departamento: string;
  cidade: string;
  tipo: string;
  salario?: string;
  descricao?: string;
  requisitos?: string;
  beneficios?: string;
  status: string;
  criado_por: string;
  created_at: string;
  updated_at: string;
}

export const useVagas = () => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarVagas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vagas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar vagas:', error);
        toast.error('Erro ao carregar vagas');
        return;
      }

      setVagas(data || []);
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
      toast.error('Erro ao carregar vagas');
    } finally {
      setLoading(false);
    }
  };

  const criarVaga = async (dadosVaga: Omit<Vaga, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('vagas')
        .insert(dadosVaga)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar vaga:', error);
        toast.error('Erro ao criar vaga');
        return null;
      }

      setVagas(prev => [data, ...prev]);
      toast.success('Vaga criada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      toast.error('Erro ao criar vaga');
      return null;
    }
  };

  const atualizarVaga = async (id: string, dadosAtualizacao: Partial<Vaga>) => {
    try {
      const { data, error } = await supabase
        .from('vagas')
        .update(dadosAtualizacao)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar vaga:', error);
        toast.error('Erro ao atualizar vaga');
        return null;
      }

      setVagas(prev => prev.map(v => v.id === id ? data : v));
      toast.success('Vaga atualizada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar vaga:', error);
      toast.error('Erro ao atualizar vaga');
      return null;
    }
  };

  const excluirVaga = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vagas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir vaga:', error);
        toast.error('Erro ao excluir vaga');
        return false;
      }

      setVagas(prev => prev.filter(v => v.id !== id));
      toast.success('Vaga excluída com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao excluir vaga:', error);
      toast.error('Erro ao excluir vaga');
      return false;
    }
  };

  useEffect(() => {
    carregarVagas();
  }, []);

  return {
    vagas,
    loading,
    carregarVagas,
    criarVaga,
    atualizarVaga,
    excluirVaga
  };
};