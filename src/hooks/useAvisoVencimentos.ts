import { useState, useEffect } from 'react';
import { funcionariosIniciais } from '@/data/funcionarios';

interface FuncionarioComAvisos {
  id: number;
  nome: string;
  documentosVencendo: number;
}

export function useAvisoVencimentos() {
  const [funcionariosComAvisos, setFuncionariosComAvisos] = useState<FuncionarioComAvisos[]>([]);

  const verificarVencimentos = () => {
    const hoje = new Date();
    const doisDiasDepois = new Date();
    doisDiasDepois.setDate(hoje.getDate() + 2);

    const funcionariosComDocumentosVencendo: FuncionarioComAvisos[] = [];

    funcionariosIniciais.forEach(funcionario => {
      const documentosKey = `documentos_funcionario_${funcionario.id}`;
      const savedDocumentos = localStorage.getItem(documentosKey);
      
      if (savedDocumentos) {
        const documentos = JSON.parse(savedDocumentos);
        const documentosVencendo = documentos.filter((doc: any) => {
          if (!doc.temValidade || !doc.dataValidade || doc.visualizado) return false;
          
          const dataValidade = new Date(doc.dataValidade);
          return dataValidade <= doisDiasDepois && dataValidade >= hoje;
        });

        if (documentosVencendo.length > 0) {
          funcionariosComDocumentosVencendo.push({
            id: funcionario.id,
            nome: funcionario.nome,
            documentosVencendo: documentosVencendo.length
          });
        }
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

  return {
    funcionariosComAvisos,
    hasAvisos,
    verificarVencimentos
  };
}