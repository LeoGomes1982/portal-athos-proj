
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

interface Compromisso {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  participantes: string[];
  tipo: 'reuniao' | 'tarefa' | 'evento';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Resumo Geral da Agenda</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compromissos por Usuário */}
          <div>
            <h3 className="font-semibold mb-4">Compromissos por Membro</h3>
            <div className="space-y-4">
              {usuarios.map((usuario) => {
                const compromissosUsuario = getCompromissosUsuario(usuario);
                const pendentes = compromissosUsuario.filter(c => !c.concluido).length;
                return (
                  <div key={usuario} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{usuario}</span>
                      <span className="text-sm text-gray-600">
                        {pendentes} pendente{pendentes !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {compromissosUsuario.length} total
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Próximas Reuniões */}
          <div>
            <h3 className="font-semibold mb-4">Próximas Reuniões</h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800">Reunião Geral</div>
                {getProximaReuniaoGeral() ? (
                  <div className="text-sm text-blue-600">
                    {format(new Date(getProximaReuniaoGeral()!.data), "dd/MM/yyyy")} às {getProximaReuniaoGeral()!.horario}
                    <div className="text-xs">{getProximaReuniaoGeral()!.titulo}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Nenhuma reunião agendada</div>
                )}
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-800">Reunião de Diretoria</div>
                {getProximaReuniaoDiretoria() ? (
                  <div className="text-sm text-purple-600">
                    {format(new Date(getProximaReuniaoDiretoria()!.data), "dd/MM/yyyy")} às {getProximaReuniaoDiretoria()!.horario}
                    <div className="text-xs">{getProximaReuniaoDiretoria()!.titulo}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Nenhuma reunião agendada</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgendaSummaryModal;
