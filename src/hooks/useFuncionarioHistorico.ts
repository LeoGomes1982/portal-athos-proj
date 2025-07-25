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
  arquivo_nome?: string;
  arquivo_url?: string;
  arquivo_tipo?: string;
  arquivo_tamanho?: number;
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
    usuario: string = localStorage.getItem('currentUser') || 'sistema@empresa.com',
    arquivo?: File
  ) => {
    try {
      let arquivoData = {};
      
      // Se há arquivo, fazer upload primeiro
      if (arquivo) {
        const fileName = `${Date.now()}_${arquivo.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('historico-arquivos')
          .upload(fileName, arquivo);

        if (uploadError) {
          console.error('Erro no upload:', uploadError);
          throw uploadError;
        }

        // Obter URL pública do arquivo
        const { data: { publicUrl } } = supabase.storage
          .from('historico-arquivos')
          .getPublicUrl(fileName);

        arquivoData = {
          arquivo_nome: arquivo.name,
          arquivo_url: publicUrl,
          arquivo_tipo: arquivo.type,
          arquivo_tamanho: arquivo.size
        };
      }

      const { data, error } = await supabase
        .from('funcionario_historico')
        .insert({
          funcionario_id: parseInt(funcionarioId.toString()),
          titulo,
          descricao,
          tipo,
          usuario,
          ...arquivoData
        })
        .select()
        .single();

      if (error) throw error;

      setHistorico(prev => [data as HistoricoRegistro, ...prev]);
      
      // Disparar evento para recalcular pontos
      window.dispatchEvent(new CustomEvent('registroHistoricoAdicionado', { 
        detail: { funcionarioId: funcionarioId.toString() } 
      }));
      
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

  // Remover registro
  const removerRegistro = async (registroId: string) => {
    try {
      const { error } = await supabase
        .from('funcionario_historico')
        .delete()
        .eq('id', registroId);

      if (error) throw error;

      setHistorico(prev => prev.filter(registro => registro.id !== registroId));
      toast({
        title: "Sucesso",
        description: "Registro removido do histórico",
      });

      return true;
    } catch (error) {
      console.error('Erro ao remover registro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o registro",
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
    removerRegistro,
    carregarHistorico
  };
};