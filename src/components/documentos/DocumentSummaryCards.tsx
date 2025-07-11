import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, AlertTriangle, Users, Building } from "lucide-react";
import { DocumentoCompleto } from "@/hooks/useDocumentNotifications";

interface DocumentSummaryCardsProps {
  documentos: DocumentoCompleto[];
}

export function DocumentSummaryCards({ documentos }: DocumentSummaryCardsProps) {
  const totalDocumentos = documentos.length;
  const docsVencendo = documentos.filter(d => d.temValidade && d.dataValidade).length;
  const documentosFuncionarios = documentos.filter(d => d.funcionario).length;
  const documentosGerais = documentos.filter(d => !d.funcionario && !d.local).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
      <Card className="modern-card bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
        <CardContent className="card-content text-center p-4">
          <div className="text-3xl mb-2">📁</div>
          <div className="text-2xl font-bold text-slate-600">
            {totalDocumentos}
          </div>
          <div className="text-sm text-slate-600/80">Total de Documentos</div>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardContent className="card-content text-center p-4">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-2xl font-bold text-red-600">
            {docsVencendo}
          </div>
          <div className="text-sm text-red-600/80">Vencendo</div>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="card-content text-center p-4">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-green-600">
            {documentosFuncionarios}
          </div>
          <div className="text-sm text-green-600/80">Funcionários</div>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="card-content text-center p-4">
          <div className="text-3xl mb-2">🏢</div>
          <div className="text-2xl font-bold text-purple-600">
            {documentosGerais}
          </div>
          <div className="text-sm text-purple-600/80">Gerais</div>
        </CardContent>
      </Card>
    </div>
  );
}