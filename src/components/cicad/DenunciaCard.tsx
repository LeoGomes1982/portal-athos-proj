import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Calendar, AlertTriangle } from "lucide-react";
import { Denuncia } from "@/types/cicad";
import { statusConfig, tipoConfig, urgenciaConfig } from "@/config/cicadStatus";

interface DenunciaCardProps {
  denuncia: Denuncia;
  onResolverCaso: (denuncia: Denuncia) => void;
}

export function DenunciaCard({ denuncia, onResolverCaso }: DenunciaCardProps) {
  const statusInfo = statusConfig[denuncia.status];
  const tipoInfo = tipoConfig[denuncia.tipo];
  const urgenciaInfo = urgenciaConfig[denuncia.urgencia];

  return (
    <Card className="modern-card">
      <CardContent className="card-content p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={tipoInfo.color}>
                  {tipoInfo.label}
                </Badge>
                <Badge className={urgenciaInfo.color}>
                  {urgenciaInfo.label}
                </Badge>
                {denuncia.urgencia === 'alta' && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                {denuncia.assunto}
              </h3>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(denuncia.dataSubmissao).toLocaleDateString('pt-BR')}
                </div>
                {denuncia.setor && (
                  <div className="flex items-center gap-1">
                    <FileText size={14} />
                    {denuncia.setor}
                  </div>
                )}
                {denuncia.dataOcorrencia && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    Ocorreu em {new Date(denuncia.dataOcorrencia).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${statusInfo.color} text-white`}>
                {statusInfo.label}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onResolverCaso(denuncia)}
                className="flex items-center gap-1"
              >
                <FileText size={14} />
                Resolução do Caso
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-slate-700 leading-relaxed">
              {denuncia.descricao}
            </p>
          </div>

          {/* Resolution */}
          {denuncia.resolucao && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Resolução:</h4>
              <p className="text-green-700">
                {denuncia.resolucao}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}