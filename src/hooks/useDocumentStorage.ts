import { useState, useEffect } from 'react';
import { DocumentoCompleto } from './useDocumentNotifications';
import { documentosMockCompletos } from '@/data/documentos';

export function useDocumentStorage() {
  const [documentos, setDocumentos] = useState<DocumentoCompleto[]>([]);

  // Carregar documentos do localStorage quando o hook é inicializado
  useEffect(() => {
    const savedDocs = localStorage.getItem('documentos');
    if (savedDocs) {
      setDocumentos(JSON.parse(savedDocs));
    } else {
      // Se não há documentos salvos, usar os dados mock e salvar
      setDocumentos(documentosMockCompletos);
      localStorage.setItem('documentos', JSON.stringify(documentosMockCompletos));
    }
  }, []);

  const adicionarDocumento = (documento: any) => {
    const novoDocumento = {
      ...documento,
      id: documentos.length + 1,
      dataUpload: new Date().toLocaleDateString('pt-BR'),
      thumbnail: "📄",
      visualizado: false
    };
    const novosDocumentos = [novoDocumento, ...documentos];
    setDocumentos(novosDocumentos);
    
    // Salvar no localStorage
    localStorage.setItem('documentos', JSON.stringify(novosDocumentos));
  };

  const atualizarDocumentos = (novosDocumentos: DocumentoCompleto[]) => {
    setDocumentos(novosDocumentos);
    localStorage.setItem('documentos', JSON.stringify(novosDocumentos));
  };

  return {
    documentos,
    adicionarDocumento,
    atualizarDocumentos
  };
}