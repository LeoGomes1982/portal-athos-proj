import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Eye, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HistoricoDocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  arquivo: {
    nome: string;
    url: string;
    tipo: string;
    tamanho: number;
  };
}

export function HistoricoDocumentViewModal({ isOpen, onClose, arquivo }: HistoricoDocumentViewModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(arquivo.url);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivo.nome;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download realizado",
        description: "O arquivo foi baixado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o arquivo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewInNewTab = () => {
    window.open(arquivo.url, '_blank');
  };

  const isImage = arquivo.tipo.startsWith('image/');
  const isPdf = arquivo.tipo === 'application/pdf';
  const isWord = arquivo.tipo.includes('word') || arquivo.tipo.includes('document');

  const getFileIcon = () => {
    if (isImage) return <ImageIcon size={24} className="text-green-600" />;
    if (isPdf) return <FileText size={24} className="text-red-600" />;
    if (isWord) return <FileText size={24} className="text-blue-600" />;
    return <FileText size={24} className="text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <h2 className="text-lg font-bold">{arquivo.nome}</h2>
                <p className="text-sm opacity-90">
                  {formatFileSize(arquivo.tamanho)} • {arquivo.tipo}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewInNewTab}
                className="text-white hover:bg-white/20"
              >
                <Eye size={18} className="mr-2" />
                Visualizar
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                disabled={loading}
                className="text-white hover:bg-white/20"
              >
                <Download size={18} className="mr-2" />
                {loading ? 'Baixando...' : 'Baixar'}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2"
              >
                <X size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-auto">
          {isImage && (
            <div className="flex justify-center">
              <img 
                src={arquivo.url} 
                alt={arquivo.nome}
                className="max-w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '60vh' }}
              />
            </div>
          )}
          
          {isPdf && (
            <div className="w-full h-[60vh]">
              <iframe
                src={arquivo.url}
                width="100%"
                height="100%"
                className="border-0 rounded-lg"
                title={arquivo.nome}
              />
            </div>
          )}
          
          {isWord && (
            <div className="text-center py-8">
              <FileText size={64} className="mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Documento Word</h3>
              <p className="text-gray-600 mb-4">
                Para visualizar este documento, clique em "Visualizar" para abrir em uma nova aba
                ou "Baixar" para fazer o download.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleViewInNewTab} className="bg-blue-600 hover:bg-blue-700">
                  <Eye size={18} className="mr-2" />
                  Visualizar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDownload}
                  disabled={loading}
                >
                  <Download size={18} className="mr-2" />
                  {loading ? 'Baixando...' : 'Baixar'}
                </Button>
              </div>
            </div>
          )}
          
          {!isImage && !isPdf && !isWord && (
            <div className="text-center py-8">
              <FileText size={64} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Visualização não disponível</h3>
              <p className="text-gray-600 mb-4">
                Este tipo de arquivo não pode ser visualizado diretamente. 
                Clique em "Baixar" para fazer o download.
              </p>
              <Button 
                onClick={handleDownload}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download size={18} className="mr-2" />
                {loading ? 'Baixando...' : 'Baixar Arquivo'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}