import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Candidatura {
  id: string;
  vaga_id: string;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  curriculo?: string;
  sobre_mim?: string;
  experiencias?: string;
  status: string;
  created_at: string;
  updated_at: string;
  vaga?: {
    titulo: string;
    departamento: string;
    cidade: string;
  };
}

export const useCandidaturas = () => {
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarCandidaturas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('candidaturas')
        .select(`
          *,
          vaga:vagas(titulo, departamento, cidade)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar candidaturas:', error);
        toast.error('Erro ao carregar candidaturas');
        return;
      }

      setCandidaturas(data || []);
    } catch (error) {
      console.error('Erro ao carregar candidaturas:', error);
      toast.error('Erro ao carregar candidaturas');
    } finally {
      setLoading(false);
    }
  };

  const criarCandidatura = async (dadosCandidatura: Omit<Candidatura, 'id' | 'created_at' | 'updated_at' | 'vaga'>) => {
    try {
      const { data, error } = await supabase
        .from('candidaturas')
        .insert(dadosCandidatura)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar candidatura:', error);
        toast.error('Erro ao enviar candidatura');
        return null;
      }

      setCandidaturas(prev => [data, ...prev]);
      toast.success('Candidatura enviada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao criar candidatura:', error);
      toast.error('Erro ao enviar candidatura');
      return null;
    }
  };

  const atualizarStatusCandidatura = async (id: string, novoStatus: string) => {
    try {
      const { data, error } = await supabase
        .from('candidaturas')
        .update({ status: novoStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar status da candidatura:', error);
        toast.error('Erro ao atualizar status da candidatura');
        return null;
      }

      setCandidaturas(prev => prev.map(c => c.id === id ? { ...c, status: novoStatus } : c));
      toast.success('Status da candidatura atualizado!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar status da candidatura:', error);
      toast.error('Erro ao atualizar status da candidatura');
      return null;
    }
  };

  const excluirCandidatura = async (id: string) => {
    try {
      const { error } = await supabase
        .from('candidaturas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir candidatura:', error);
        toast.error('Erro ao excluir candidatura');
        return false;
      }

      setCandidaturas(prev => prev.filter(c => c.id !== id));
      toast.success('Candidatura excluída com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao excluir candidatura:', error);
      toast.error('Erro ao excluir candidatura');
      return false;
    }
  };

  const carregarCandidaturasPorVaga = async (vagaId: string) => {
    try {
      const { data, error } = await supabase
        .from('candidaturas')
        .select('*')
        .eq('vaga_id', vagaId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar candidaturas da vaga:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao carregar candidaturas da vaga:', error);
      return [];
    }
  };

  useEffect(() => {
    carregarCandidaturas();
  }, []);

  return {
    candidaturas,
    loading,
    carregarCandidaturas,
    criarCandidatura,
    atualizarStatusCandidatura,
    excluirCandidatura,
    carregarCandidaturasPorVaga
  };
};