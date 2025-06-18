
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye, Trash2 } from "lucide-react";

interface DocumentCardProps {
  documento: {
    id: number;
    nome: string;
    tipo: string;
    funcionario: string | null;
    dataUpload: string;
    tamanho: string;
    thumbnail: string;
  };
  onView?: (id: number) => void;
  onDownload?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function DocumentCard({ documento, onView, onDownload, onDelete }: DocumentCardProps) {
  const getDocumentIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'contrato': return '📝';
      case 'manual': return '📚';
      case 'exame médico': return '🏥';
      case 'política': return '📋';
      default: return '📄';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Thumbnail */}
          <div className="text-6xl mb-2">{getDocumentIcon(documento.tipo)}</div>
          
          {/* Nome do documento */}
          <h3 className="font-medium text-sm truncate w-full" title={documento.nome}>
            {documento.nome}
          </h3>
          
          {/* Nome do funcionário */}
          {documento.funcionario ? (
            <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              👤 {documento.funcionario}
            </p>
          ) : (
            <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              🏢 Documento Geral
            </p>
          )}
          
          {/* Informações adicionais */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>{documento.tipo}</p>
            <p>{documento.dataUpload}</p>
            <p>{documento.tamanho}</p>
          </div>
          
          {/* Botões de ação */}
          <div className="flex gap-1 mt-3">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onView?.(documento.id)}
              title="Visualizar"
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDownload?.(documento.id)}
              title="Baixar"
            >
              <Download className="w-3 h-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDelete?.(documento.id)}
              title="Excluir"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
