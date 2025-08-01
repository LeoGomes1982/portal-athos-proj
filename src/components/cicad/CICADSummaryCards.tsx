import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, CheckCircle, Archive } from "lucide-react";
import { Denuncia } from "@/types/cicad";

interface CICADSummaryCardsProps {
  denuncias: Denuncia[];
}

export function CICADSummaryCards({ denuncias }: CICADSummaryCardsProps) {
  const emInvestigacao = denuncias.filter(d => d.status === 'em_investigacao').length;
  const encerrados = denuncias.filter(d => d.status === 'encerrado').length;
  const arquivados = denuncias.filter(d => d.status === 'arquivado').length;
  const urgentes = denuncias.filter(d => d.urgencia === 'alta' && d.status !== 'encerrado').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
      <Card className="modern-card bg-white border-gray-200">
        <CardContent className="card-content text-center p-4">
          <div className="text-3xl mb-2">🔍</div>
          <div className="text-2xl font-bold text-gray-700">
            {emInvestigacao}
          </div>
          <div className="text-sm text-gray-600 mb-1">Em Investigação</div>
          <div className="text-xs text-gray-500 font-medium">
            casos ativos
          </div>
        </CardContent>
      </Card>

      <Card className="modern-card bg-white border-gray-200">
        <CardContent className="card-content text-center p-4">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-gray-700">
            {encerrados}
          </div>
          <div className="text-sm text-gray-600">Encerrados</div>
        </CardContent>
      </Card>

      <Card className="modern-card bg-white border-gray-200">
        <CardContent className="card-content text-center p-4">
          <div className="text-3xl mb-2">📁</div>
          <div className="text-2xl font-bold text-gray-700">
            {arquivados}
          </div>
          <div className="text-sm text-gray-600">Arquivados</div>
        </CardContent>
      </Card>

      <Card className="modern-card bg-white border-gray-200">
        <CardContent className="card-content text-center p-4">
          <div className="text-3xl mb-2">🚨</div>
          <div className="text-2xl font-bold text-gray-700">
            {urgentes}
          </div>
          <div className="text-sm text-gray-600">Urgentes</div>
        </CardContent>
      </Card>
    </div>
  );
}