import { useState, useEffect } from 'react';
import { funcionariosIniciais } from '@/data/funcionarios';

interface FuncionarioComAvisos {
  id: number;
  nome: string;
  documentosVencendo: number;
  experienciaVencendo: boolean;
  avisoVencendo: boolean;
  dataFimExperiencia?: string;
  dataFimAvisoPrevio?: string;
}

export function useAvisoVencimentos() {
  const [funcionariosComAvisos, setFuncionariosComAvisos] = useState<FuncionarioComAvisos[]>([]);

  const verificarVencimentos = () => {
    // Carregar funcionários atualizados do localStorage
    const savedFuncionarios = localStorage.getItem('funcionarios_list');
    const funcionarios = savedFuncionarios ? JSON.parse(savedFuncionarios) : funcionariosIniciais;

    const hoje = new Date();
    const doisDiasDepois = new Date();
    doisDiasDepois.setDate(hoje.getDate() + 2);

    const funcionariosComDocumentosVencendo: FuncionarioComAvisos[] = [];

    funcionarios.forEach((funcionario: any) => {
      const documentosKey = `documentos_funcionario_${funcionario.id}`;
      const savedDocumentos = localStorage.getItem(documentosKey);
      
      let documentosVencendo = 0;
      let experienciaVencendo = false;
      let avisoVencendo = false;

      // Verificar documentos vencendo
      if (savedDocumentos) {
        const documentos = JSON.parse(savedDocumentos);
        const docsVencendo = documentos.filter((doc: any) => {
          if (!doc.temValidade || !doc.dataValidade || doc.visualizado) return false;
          
          const dataValidade = new Date(doc.dataValidade);
          return dataValidade <= doisDiasDepois && dataValidade >= hoje;
        });
        documentosVencendo = docsVencendo.length;
      }

      // Verificar período de experiência vencendo
      if (funcionario.status === 'experiencia' && funcionario.dataFimExperiencia) {
        const dataFim = new Date(funcionario.dataFimExperiencia);
        if (dataFim <= doisDiasDepois && dataFim >= hoje) {
          experienciaVencendo = true;
        }
      }

      // Verificar aviso prévio vencendo
      if (funcionario.status === 'aviso' && funcionario.dataFimAvisoPrevio) {
        const dataFim = new Date(funcionario.dataFimAvisoPrevio);
        if (dataFim <= doisDiasDepois && dataFim >= hoje) {
          avisoVencendo = true;
        }
      }

      // Adicionar à lista se houver qualquer tipo de aviso
      if (documentosVencendo > 0 || experienciaVencendo || avisoVencendo) {
        funcionariosComDocumentosVencendo.push({
          id: funcionario.id,
          nome: funcionario.nome,
          documentosVencendo,
          experienciaVencendo,
          avisoVencendo,
          dataFimExperiencia: funcionario.dataFimExperiencia,
          dataFimAvisoPrevio: funcionario.dataFimAvisoPrevio
        });
      }
    });

    setFuncionariosComAvisos(funcionariosComDocumentosVencendo);
  };

  useEffect(() => {
    verificarVencimentos();
    
    // Verificar a cada minuto
    const interval = setInterval(verificarVencimentos, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const hasAvisos = funcionariosComAvisos.length > 0;

  // Contadores por tipo de aviso
  const totalDocumentosVencendo = funcionariosComAvisos.reduce((total, func) => total + func.documentosVencendo, 0);
  const totalExperienciaVencendo = funcionariosComAvisos.filter(func => func.experienciaVencendo).length;
  const totalAvisoVencendo = funcionariosComAvisos.filter(func => func.avisoVencendo).length;

  return {
    funcionariosComAvisos,
    hasAvisos,
    verificarVencimentos,
    totalDocumentosVencendo,
    totalExperienciaVencendo,
    totalAvisoVencendo
  };
}