
import React from 'react';
import { Star, Clock, User, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  prioridade: 'normal' | 'importante' | 'muito-importante';
}

interface HighPriorityTasksProps {
  compromissos: Compromisso[];
  onSelectCompromisso: (compromisso: Compromisso) => void;
  onToggleConcluido: (id: string) => void;
}

const HighPriorityTasks = ({ compromissos, onSelectCompromisso, onToggleConcluido }: HighPriorityTasksProps) => {
  const getPriorityStars = (prioridade: string) => {
    const starCount = prioridade === 'muito-importante' ? 3 : prioridade === 'importante' ? 2 : 1;
    return Array.from({ length: starCount }, (_, i) => (
      <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <Card className="modern-card animate-slide-up bg-gradient-to-br from-red-50 to-orange-50 border-red-200/60 shadow-md">
      <CardHeader className="card-header">
        <CardTitle className="section-title flex items-center gap-2 mb-0 text-red-700">
          <div className="flex">
            <Star size={20} className="fill-yellow-400 text-yellow-400" />
            <Star size={20} className="fill-yellow-400 text-yellow-400" />
            <Star size={20} className="fill-yellow-400 text-yellow-400" />
          </div>
          Muito Importantes
        </CardTitle>
      </CardHeader>
      <CardContent className="card-content">
        <div className="space-y-3">
          {compromissos.map((compromisso) => (
            <div
              key={compromisso.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                compromisso.concluido 
                  ? 'bg-gray-100 opacity-60 border-gray-300' 
                  : 'bg-white hover:shadow-md border-red-200 hover:border-red-400 hover:scale-102'
              }`}
              onClick={() => onSelectCompromisso(compromisso)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {getPriorityStars(compromisso.prioridade)}
                  </div>
                  <span className="font-semibold text-sm text-gray-800">{compromisso.titulo}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleConcluido(compromisso.id);
                  }}
                  className="text-green-600 hover:text-green-700 transition-colors hover:scale-110"
                >
                  {compromisso.concluido ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full">
                  <Clock size={12} />
                  {compromisso.horario}
                </div>
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                  <User size={12} />
                  {compromisso.participantes.length}
                </div>
              </div>
            </div>
          ))}
          {compromissos.length === 0 && (
            <div className="text-center py-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-red-100">
              <div className="w-12 h-12 bg-red-100 border-2 border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Star size={20} className="text-red-500" />
              </div>
              <p className="text-gray-600 text-sm font-medium">
                Nenhuma tarefa muito importante pendente
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HighPriorityTasks;
