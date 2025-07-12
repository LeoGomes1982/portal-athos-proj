import { useState, useEffect } from 'react';

interface Dependente {
  id: number;
  nome: string;
  grauParentesco: string;
  dataNascimento: string;
  cpf: string;
  arquivo?: File;
  nomeArquivo?: string;
}

interface DocumentoFuncionario {
  id: number;
  nome: string;
  arquivo: File;
  nomeArquivo: string;
  temValidade: boolean;
  dataValidade?: string;
  funcionarioId: number;
  dataUpload: string;
  visualizado: boolean;
}

export function useFuncionarioData(funcionarioId: number) {
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [documentos, setDocumentos] = useState<DocumentoFuncionario[]>([]);

  // Carregar dados do localStorage quando o hook é inicializado
  useEffect(() => {
    const savedDependentes = localStorage.getItem(`dependentes_${funcionarioId}`);
    if (savedDependentes) {
      setDependentes(JSON.parse(savedDependentes));
    }

    const savedDocumentos = localStorage.getItem(`documentos_funcionario_${funcionarioId}`);
    if (savedDocumentos) {
      setDocumentos(JSON.parse(savedDocumentos));
    }
  }, [funcionarioId]);

  const adicionarDependente = (dependente: Dependente) => {
    const novosDependentes = [...dependentes, dependente];
    setDependentes(novosDependentes);
    localStorage.setItem(`dependentes_${funcionarioId}`, JSON.stringify(novosDependentes));
  };

  const adicionarDocumento = (documento: DocumentoFuncionario) => {
    const novosDocumentos = [...documentos, documento];
    setDocumentos(novosDocumentos);
    localStorage.setItem(`documentos_funcionario_${funcionarioId}`, JSON.stringify(novosDocumentos));
  };

  const removerDependente = (dependenteId: number) => {
    const novosDependentes = dependentes.filter(d => d.id !== dependenteId);
    setDependentes(novosDependentes);
    localStorage.setItem(`dependentes_${funcionarioId}`, JSON.stringify(novosDependentes));
  };

  const removerDocumento = (documentoId: number) => {
    const novosDocumentos = documentos.filter(d => d.id !== documentoId);
    setDocumentos(novosDocumentos);
    localStorage.setItem(`documentos_funcionario_${funcionarioId}`, JSON.stringify(novosDocumentos));
  };

  // Verificar documentos vencendo (2 dias antes do vencimento)
  const getDocumentosVencendo = () => {
    const hoje = new Date();
    const doisDiasDepois = new Date();
    doisDiasDepois.setDate(hoje.getDate() + 2);

    return documentos.filter(doc => {
      if (!doc.temValidade || !doc.dataValidade || doc.visualizado) return false;
      
      const dataValidade = new Date(doc.dataValidade);
      return dataValidade <= doisDiasDepois && dataValidade >= hoje;
    });
  };

  const marcarDocumentoComoVisualizado = (documentoId: number) => {
    const novosDocumentos = documentos.map(doc =>
      doc.id === documentoId ? { ...doc, visualizado: true } : doc
    );
    setDocumentos(novosDocumentos);
    localStorage.setItem(`documentos_funcionario_${funcionarioId}`, JSON.stringify(novosDocumentos));
  };

  return {
    dependentes,
    documentos,
    adicionarDependente,
    adicionarDocumento,
    removerDependente,
    removerDocumento,
    getDocumentosVencendo,
    marcarDocumentoComoVisualizado
  };
}