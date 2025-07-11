import { useState, useEffect, useCallback } from 'react';

export interface DocumentoCompleto {
  id: number;
  nome: string;
  tipo: string;
  funcionario: string | null;
  local?: string | null;
  dataUpload: string;
  tamanho: string;
  thumbnail: string;
  temValidade: boolean;
  dataValidade?: string;
  visualizado?: boolean;
}

export function useDocumentNotifications() {
  const [documentosVencendo, setDocumentosVencendo] = useState<DocumentoCompleto[]>([]);

  const checkDocumentosVencendo = useCallback((documentos: DocumentoCompleto[]) => {
    const hoje = new Date();
    const doisDiasDepois = new Date();
    doisDiasDepois.setDate(hoje.getDate() + 2);

    const vencendo = documentos.filter(doc => {
      if (!doc.temValidade || !doc.dataValidade || doc.visualizado) return false;
      
      const dataValidade = new Date(doc.dataValidade);
      return dataValidade <= doisDiasDepois && dataValidade >= hoje;
    });

    setDocumentosVencendo(vencendo);
  }, []);

  const marcarComoVisualizado = (documentoId: number, documentos: DocumentoCompleto[]) => {
    const documentosAtualizados = documentos.map(doc =>
      doc.id === documentoId ? { ...doc, visualizado: true } : doc
    );
    
    // Salvar no localStorage
    localStorage.setItem('documentos', JSON.stringify(documentosAtualizados));
    
    // Recheck notifications
    checkDocumentosVencendo(documentosAtualizados);
    
    return documentosAtualizados;
  };

  const hasNotifications = documentosVencendo.length > 0;

  return {
    documentosVencendo,
    hasNotifications,
    checkDocumentosVencendo,
    marcarComoVisualizado
  };
}