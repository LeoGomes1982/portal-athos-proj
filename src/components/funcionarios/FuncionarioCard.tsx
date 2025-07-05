import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, AlertTriangle } from "lucide-react";
import { Funcionario } from "@/types/funcionario";
import { statusConfig } from "@/config/funcionarioStatus";
import { isProximoDoFim } from "@/utils/funcionarioUtils";

interface FuncionarioCardProps {
  funcionario: Funcionario;
  onClick: (funcionario: Funcionario) => void;
}

export function FuncionarioCard({ funcionario, onClick }: FuncionarioCardProps) {
  const statusInfo = statusConfig[funcionario.status];
  
  // Verificar se deve mostrar alerta
  const mostrarAlerta = (
    (funcionario.status === 'experiencia' && funcionario.dataFimExperiencia && isProximoDoFim(funcionario.dataFimExperiencia)) ||
    (funcionario.status === 'aviso' && funcionario.dataFimAvisoPrevio && isProximoDoFim(funcionario.dataFimAvisoPrevio))
  );

  return (
    <Card 
      className="modern-card cursor-pointer transition-all duration-300 hover:shadow-lg"
      onClick={() => onClick(funcionario)}
    >
      <CardContent className="card-content p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Foto */}
            <div className="flex-shrink-0 relative">
              {funcionario.status === 'destaque' && (
                <div className="absolute -top-1 -right-1 animate-bounce">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-400 drop-shadow-md" style={{
                    filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.8)) brightness(1.2)'
                  }} />
                </div>
              )}
              {mostrarAlerta && (
                <div className="absolute -top-1 -right-1 animate-bounce">
                  <AlertTriangle className="w-5 h-5 text-red-500 fill-red-400 drop-shadow-md" />
                </div>
              )}
              <div className="w-12 h-12 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">{funcionario.foto}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">{funcionario.nome}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>{funcionario.cargo}</span>
                    <span>{funcionario.setor}</span>
                    <span>{new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex-shrink-0">
                  <Badge className={`${statusInfo.color} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}