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
      <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <Folder size={20} className="text-primary" />
            Total de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="text-4xl font-bold text-primary mb-2">{totalDocumentos}</div>
          <p className="text-primary/80">documentos arquivados</p>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-red-500/10 to-red-500/20 border-red-500/20">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <AlertTriangle size={20} className="text-red-600" />
            Vencendo
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="text-4xl font-bold text-red-600 mb-2">{docsVencendo}</div>
          <p className="text-red-600/80">próximos ao vencimento</p>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-green-500/10 to-green-500/20 border-green-500/20">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <Users size={20} className="text-green-600" />
            Funcionários
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="text-4xl font-bold text-green-600 mb-2">{documentosFuncionarios}</div>
          <p className="text-green-600/80">docs de funcionários</p>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-purple-500/10 to-purple-500/20 border-purple-500/20">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <Building size={20} className="text-purple-600" />
            Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="text-4xl font-bold text-purple-600 mb-2">{documentosGerais}</div>
          <p className="text-purple-600/80">documentos gerais</p>
        </CardContent>
      </Card>
    </div>
  );
}