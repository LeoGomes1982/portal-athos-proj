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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
      <Card className="modern-card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <Clock size={20} className="text-yellow-600" />
            Em Investigação
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="text-4xl font-bold text-yellow-600 mb-2">{emInvestigacao}</div>
          <p className="text-yellow-700">casos ativos</p>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <CheckCircle size={20} className="text-green-600" />
            Encerrados
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="text-4xl font-bold text-green-600 mb-2">{encerrados}</div>
          <p className="text-green-700">casos resolvidos</p>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <Archive size={20} className="text-gray-600" />
            Arquivados
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="text-4xl font-bold text-gray-600 mb-2">{arquivados}</div>
          <p className="text-gray-700">casos arquivados</p>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <AlertTriangle size={20} className="text-red-600" />
            Urgentes
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="text-4xl font-bold text-red-600 mb-2">{urgentes}</div>
          <p className="text-red-700">alta prioridade</p>
        </CardContent>
      </Card>
    </div>
  );
}