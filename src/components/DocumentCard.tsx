
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye, Trash2, AlertTriangle, Calendar } from "lucide-react";

interface DocumentCardProps {
  documento: {
    id: number;
    nome: string;
    tipo: string;
    funcionario: string | null;
    local?: string | null;
    dataUpload: string;
    tamanho: string;
    thumbnail: string;
    temValidade?: boolean;
    dataValidade?: string;
    visualizado?: boolean;
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

  // Verificar se está vencendo (2 dias antes)
  const isVencendo = () => {
    if (!documento.temValidade || !documento.dataValidade || documento.visualizado) return false;
    
    const hoje = new Date();
    const doisDiasDepois = new Date();
    doisDiasDepois.setDate(hoje.getDate() + 2);
    
    const dataValidade = new Date(documento.dataValidade);
    return dataValidade <= doisDiasDepois && dataValidade >= hoje;
  };

  const isVencido = () => {
    if (!documento.temValidade || !documento.dataValidade) return false;
    
    const hoje = new Date();
    const dataValidade = new Date(documento.dataValidade);
    return dataValidade < hoje;
  };

  const vencendo = isVencendo();
  const vencido = isVencido();

  return (
    <Card className={`hover:shadow-lg transition-shadow relative ${vencendo ? 'ring-2 ring-red-400' : ''} ${vencido ? 'ring-2 ring-red-600 bg-red-50' : ''}`}>
      {/* Indicador de notificação */}
      {vencendo && !documento.visualizado && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
      )}
      
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Thumbnail */}
          <div className="text-6xl mb-2">{getDocumentIcon(documento.tipo)}</div>
          
          {/* Nome do documento */}
          <h3 className="font-medium text-sm truncate w-full" title={documento.nome}>
            {documento.nome}
          </h3>
          
          {/* Funcionário ou Local */}
          {documento.funcionario ? (
            <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              👤 {documento.funcionario}
            </p>
          ) : documento.local ? (
            <p className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              📍 {documento.local}
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
            
            {/* Informações de validade */}
            {documento.temValidade && documento.dataValidade && (
              <div className={`flex items-center gap-1 ${vencido ? 'text-red-600' : vencendo ? 'text-orange-600' : 'text-green-600'}`}>
                <Calendar className="w-3 h-3" />
                <span>
                  {vencido ? 'Vencido' : vencendo ? 'Vencendo' : 'Válido'}: {new Date(documento.dataValidade).toLocaleDateString('pt-BR')}
                </span>
                {(vencendo || vencido) && <AlertTriangle className="w-3 h-3" />}
              </div>
            )}
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
