
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface Compromisso {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  participantes: string[];
  tipo: 'reuniao' | 'tarefa' | 'evento' | 'avaliacao' | 'avaliacao_desempenho' | 'vencimento_documento';
  concluido: boolean;
  criadoPor: string;
}

interface AgendaSummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compromissos: Compromisso[];
  usuarios: string[];
}

const AgendaSummaryModal = ({ open, onOpenChange, compromissos, usuarios }: AgendaSummaryModalProps) => {
  const getCompromissosUsuario = (usuario: string) => {
    return compromissos.filter(c => 
      c.participantes.includes(usuario) || c.criadoPor === usuario
    );
  };

  const getProximaReuniao = () => {
    const hoje = new Date();
    const reunioes = compromissos
      .filter(c => c.tipo === 'reuniao' && !c.concluido && new Date(c.data) >= hoje)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    return reunioes[0];
  };

  const getProximaReuniaoGeral = () => {
    const proximaReuniao = getProximaReuniao();
    return proximaReuniao && proximaReuniao.participantes.length >= 3 ? proximaReuniao : null;
  };

  const getProximaReuniaoDiretoria = () => {
    const proximaReuniao = getProximaReuniao();
    return proximaReuniao && proximaReuniao.titulo.toLowerCase().includes('diretoria') ? proximaReuniao : null;
  };

  // Função para obter documentos vencidos do RH
  const getDocumentosVencidos = () => {
    const hoje = new Date();
    const documentosVencidos = [];
    
    // Simular alguns documentos vencidos do RH
    const proximosVencimentos = [
      { tipo: "Contrato de Experiência", funcionario: "João Silva", vencimento: addDays(hoje, 3) },
      { tipo: "Documento de Identificação", funcionario: "Maria Santos", vencimento: addDays(hoje, -2) },
      { tipo: "Certificado de Saúde", funcionario: "Pedro Costa", vencimento: addDays(hoje, 1) }
    ];
    
    return proximosVencimentos;
  };

  const getReunioesPendentes = () => {
    const hoje = new Date();
    return compromissos.filter(c => 
      c.tipo === 'reuniao' && 
      !c.concluido && 
      new Date(c.data) >= hoje
    ).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Resumo Geral da Agenda</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Compromissos por Usuário */}
          <div>
            <h3 className="font-semibold mb-4 text-blue-800">Compromissos por Membro</h3>
            <div className="space-y-4">
              {usuarios.map((usuario) => {
                const compromissosUsuario = getCompromissosUsuario(usuario);
                const pendentes = compromissosUsuario.filter(c => !c.concluido);
                return (
                  <div key={usuario} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-blue-800 text-lg">{usuario}</span>
                      <span className="text-sm text-blue-600 font-medium">
                        {pendentes.length} pendente{pendentes.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {/* Compromissos do usuário */}
                    {pendentes.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="font-medium text-blue-700 text-sm">Compromissos:</div>
                        {pendentes.slice(0, 3).map((compromisso) => (
                          <div key={compromisso.id} className="text-xs bg-white p-2 rounded border-l-2 border-blue-400">
                            <div className="font-medium text-blue-700">{compromisso.titulo}</div>
                            <div className="text-blue-600">{format(new Date(compromisso.data), "dd/MM/yyyy")} às {compromisso.horario}</div>
                          </div>
                        ))}
                        {pendentes.length > 3 && (
                          <div className="text-xs text-blue-600">+ {pendentes.length - 3} outros compromissos</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compromissos do RH */}
          <div>
            <h3 className="font-semibold mb-4 text-orange-800">Compromissos do RH</h3>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="font-medium text-orange-800 mb-2">Documentos Vencidos/Próximos ao Vencimento</div>
                <div className="space-y-2">
                  {getDocumentosVencidos().map((doc, index) => (
                    <div key={index} className="text-sm bg-white p-2 rounded border-l-2 border-orange-400">
                      <div className="font-medium text-orange-700">{doc.tipo}</div>
                      <div className="text-orange-600">{doc.funcionario} - Vence em {format(doc.vencimento, "dd/MM/yyyy")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reuniões Gerais */}
          <div>
            <h3 className="font-semibold mb-4 text-green-800">Reuniões em Geral</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="font-medium text-green-800 mb-2">Próximas Reuniões</div>
                <div className="space-y-2">
                  {getReunioesPendentes().slice(0, 5).map((reuniao) => (
                    <div key={reuniao.id} className="text-sm bg-white p-2 rounded border-l-2 border-green-400">
                      <div className="font-medium text-green-700">{reuniao.titulo}</div>
                      <div className="text-green-600">{format(new Date(reuniao.data), "dd/MM/yyyy")} às {reuniao.horario}</div>
                      <div className="text-xs text-gray-600">{reuniao.participantes.length} participantes</div>
                    </div>
                  ))}
                  {getReunioesPendentes().length === 0 && (
                    <div className="text-sm text-gray-500">Nenhuma reunião agendada</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgendaSummaryModal;
