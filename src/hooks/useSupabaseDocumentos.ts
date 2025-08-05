import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DocumentoSupabase {
  id: string;
  funcionario_id: number;
  nome: string;
  arquivo_nome: string;
  arquivo_url: string;
  arquivo_tipo: string;
  arquivo_tamanho: number;
  tem_validade: boolean;
  data_validade: string | null;
  origem: string;
  visualizado: boolean;
  created_at: string;
  updated_at: string;
}

export function useSupabaseDocumentos(funcionarioId: number) {
  const [documentos, setDocumentos] = useState<DocumentoSupabase[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarDocumentos = async () => {
    if (!funcionarioId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('funcionario_documentos')
        .select('*')
        .eq('funcionario_id', funcionarioId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar documentos:', error);
      } else {
        setDocumentos(data || []);
      }
    } catch (error) {
      console.error('Erro inesperado ao carregar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarDocumento = async (
    nome: string,
    arquivo: File,
    temValidade: boolean = false,
    dataValidade?: string
  ) => {
    try {
      // Upload do arquivo
      const fileExt = arquivo.name.split('.').pop();
      const fileName = `${funcionarioId}_${nome.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('funcionario-documentos')
        .upload(fileName, arquivo);

      if (uploadError) throw uploadError;

      // Obter URL público
      const { data: urlData } = supabase.storage
        .from('funcionario-documentos')
        .getPublicUrl(fileName);

      // Inserir registro na tabela
      const { error: dbError } = await supabase
        .from('funcionario_documentos')
        .insert({
          funcionario_id: funcionarioId,
          nome,
          arquivo_nome: arquivo.name,
          arquivo_url: urlData.publicUrl,
          arquivo_tipo: arquivo.type,
          arquivo_tamanho: arquivo.size,
          tem_validade: temValidade,
          data_validade: dataValidade || null,
          origem: 'manual'
        });

      if (dbError) throw dbError;

      // Recarregar documentos
      await carregarDocumentos();
      return true;
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
      return false;
    }
  };

  const removerDocumento = async (documentoId: string) => {
    try {
      // Primeiro deletar registro da tabela
      const { error: dbError } = await supabase
        .from('funcionario_documentos')
        .delete()
        .eq('id', documentoId);

      if (dbError) {
        console.error('Erro ao deletar documento da base de dados:', dbError);
        throw dbError;
      }

      // Buscar informações do documento para deletar do storage
      const documento = documentos.find(d => d.id === documentoId);
      if (documento) {
        // Extrair o nome do arquivo da URL
        const fileName = documento.arquivo_url.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('funcionario-documentos')
            .remove([fileName]);
          
          // Log do erro do storage mas não falhe a operação
          if (storageError) {
            console.warn('Erro ao deletar arquivo do storage:', storageError);
          }
        }
      }

      // Recarregar documentos
      await carregarDocumentos();
      return true;
    } catch (error) {
      console.error('Erro ao remover documento:', error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const loadDocumentos = async () => {
      if (mounted) {
        await carregarDocumentos();
      }
    };
    
    loadDocumentos();
    
    return () => {
      mounted = false;
    };
  }, [funcionarioId]);

  return {
    documentos,
    loading,
    carregarDocumentos,
    adicionarDocumento,
    removerDocumento
  };
}