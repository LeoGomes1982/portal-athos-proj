import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Image, 
  FileCheck, 
  Download, 
  Eye, 
  Search,
  Calendar,
  User,
  X
} from "lucide-react";
import { useFuncionarioData } from "@/hooks/useFuncionarioData";
import { useFuncionarioHistorico } from "@/hooks/useFuncionarioHistorico";
import { useToast } from "@/hooks/use-toast";

interface FuncionarioDocumentosModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionarioId: number;
  funcionarioNome: string;
}

interface DocumentoUnificado {
  id: string;
  nome: string;
  tipo: string;
  tamanho?: number;
  dataUpload: string;
  url?: string;
  arquivo?: File;
  temValidade?: boolean;
  dataValidade?: string;
  fonte: 'documentos' | 'historico';
  isExpired?: boolean;
  isExpiring?: boolean;
}

export function FuncionarioDocumentosModal({ 
  isOpen, 
  onClose, 
  funcionarioId, 
  funcionarioNome 
}: FuncionarioDocumentosModalProps) {
  const { toast } = useToast();
  const { documentos } = useFuncionarioData(funcionarioId);
  const { historico } = useFuncionarioHistorico(funcionarioId);
  const [searchTerm, setSearchTerm] = useState("");
  const [documentosUnificados, setDocumentosUnificados] = useState<DocumentoUnificado[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const todosDocumentos: DocumentoUnificado[] = [];
    const hoje = new Date();

    // Adicionar documentos da seção Documentos
    documentos.forEach((doc) => {
      // Verificar se doc.arquivo é um objeto File válido
      if (!doc.arquivo || typeof doc.arquivo !== 'object' || (!('type' in doc.arquivo) && !('size' in doc.arquivo))) {
        console.warn('Documento sem arquivo válido:', doc);
        return;
      }

      const dataValidade = doc.dataValidade ? new Date(doc.dataValidade) : null;
      const isExpired = dataValidade ? dataValidade < hoje : false;
      const isExpiring = dataValidade ? (dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24) <= 2 && !isExpired : false;

      try {
        todosDocumentos.push({
          id: `doc_${doc.id}`,
          nome: doc.nome,
          tipo: doc.arquivo.type || 'application/octet-stream',
          tamanho: doc.arquivo.size,
          dataUpload: doc.dataUpload,
          arquivo: doc.arquivo,
          url: URL.createObjectURL(doc.arquivo),
          temValidade: doc.temValidade,
          dataValidade: doc.dataValidade,
          fonte: 'documentos',
          isExpired,
          isExpiring
        });
      } catch (error) {
        console.error('Erro ao criar URL para documento:', doc, error);
      }
    });

    // Adicionar documentos do histórico
    historico.forEach((reg) => {
      if (reg.arquivo_nome && reg.arquivo_url) {
        todosDocumentos.push({
          id: `hist_${reg.id}`,
          nome: reg.arquivo_nome,
          tipo: reg.arquivo_tipo || 'application/octet-stream',
          tamanho: reg.arquivo_tamanho,
          dataUpload: reg.created_at,
          url: reg.arquivo_url,
          fonte: 'historico'
        });
      }
    });

    setDocumentosUnificados(todosDocumentos);
  }, [documentos, historico, isOpen]);

  const documentosFiltrados = documentosUnificados.filter(doc =>
    doc.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (tipo: string) => {
    if (tipo.startsWith('image/')) return Image;
    if (tipo.includes('pdf')) return FileText;
    return FileCheck;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Tamanho desconhecido';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async (documento: DocumentoUnificado) => {
    try {
      if (documento.arquivo && documento.arquivo instanceof File) {
        // Para documentos locais (File objects)
        const url = URL.createObjectURL(documento.arquivo);
        const a = document.createElement('a');
        a.href = url;
        a.download = documento.nome;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (documento.url) {
        // Para documentos do Supabase
        const response = await fetch(documento.url);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = documento.nome;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Sucesso",
        description: "Download realizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer download do arquivo.",
        variant: "destructive",
      });
    }
  };

  const handleView = (documento: DocumentoUnificado) => {
    if (documento.url) {
      window.open(documento.url, '_blank');
    } else if (documento.arquivo && documento.arquivo instanceof File) {
      try {
        const url = URL.createObjectURL(documento.arquivo);
        window.open(url, '_blank');
      } catch (error) {
        console.error('Erro ao visualizar documento:', error);
        toast({
          title: "Erro",
          description: "Erro ao visualizar o arquivo.",
          variant: "destructive",
        });
      }
    }
  };

  const renderDocumentThumbnail = (documento: DocumentoUnificado) => {
    const IconComponent = getFileIcon(documento.tipo);
    
    return (
      <div className="relative group">
        <div className={`bg-gradient-to-br from-blue-50 to-blue-100 border-2 rounded-lg p-4 h-32 flex flex-col items-center justify-center transition-all duration-200 hover:shadow-lg cursor-pointer ${
          documento.isExpired ? 'border-red-300 bg-gradient-to-br from-red-50 to-red-100' :
          documento.isExpiring ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100' :
          'border-blue-200 hover:border-blue-300'
        }`}>
          <IconComponent className={`h-8 w-8 mb-2 ${
            documento.isExpired ? 'text-red-600' :
            documento.isExpiring ? 'text-orange-600' :
            'text-blue-600'
          }`} />
          
          <div className="text-center">
            <p className="text-xs font-medium text-gray-700 truncate max-w-20">
              {documento.nome}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(documento.tamanho)}
            </p>
          </div>

          {/* Status badges */}
          <div className="absolute top-1 right-1 flex flex-col gap-1">
            {documento.isExpired && (
              <Badge variant="destructive" className="text-xs px-1 py-0">
                Vencido
              </Badge>
            )}
            {documento.isExpiring && !documento.isExpired && (
              <Badge variant="secondary" className="text-xs px-1 py-0 bg-orange-100 text-orange-700">
                Vencendo
              </Badge>
            )}
            <Badge variant="outline" className="text-xs px-1 py-0">
              {documento.fonte === 'documentos' ? 'Doc' : 'Hist'}
            </Badge>
          </div>

          {/* Overlay com botões */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(documento);
                }}
                className="h-7 w-7 p-0"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(documento);
                }}
                className="h-7 w-7 p-0"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(documento.dataUpload).toLocaleDateString('pt-BR')}
          </div>
          
          {documento.temValidade && documento.dataValidade && (
            <div className={`flex items-center text-xs ${
              documento.isExpired ? 'text-red-600' :
              documento.isExpiring ? 'text-orange-600' :
              'text-green-600'
            }`}>
              <Calendar className="h-3 w-3 mr-1" />
              Válido até: {new Date(documento.dataValidade).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Documentos do Funcionário
                </DialogTitle>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <User className="h-4 w-4" />
                  <span>{funcionarioNome}</span>
                  <Badge variant="outline" className="ml-2">
                    {documentosFiltrados.length} documentos
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Barra de pesquisa */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Grid de documentos */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          {documentosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FileText className="h-16 w-16 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Nenhum documento encontrado</h3>
              <p className="text-sm text-center">
                {searchTerm ? 
                  "Tente ajustar os termos de pesquisa." :
                  "Este funcionário ainda não possui documentos anexados."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {documentosFiltrados.map((documento) => (
                <div key={documento.id}>
                  {renderDocumentThumbnail(documento)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legenda */}
        <div className="px-6 py-3 bg-gray-50 border-t">
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs px-1 py-0">Doc</Badge>
              <span>Seção Documentos</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs px-1 py-0">Hist</Badge>
              <span>Histórico</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="destructive" className="text-xs px-1 py-0">Vencido</Badge>
              <span>Documento vencido</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs px-1 py-0 bg-orange-100 text-orange-700">Vencendo</Badge>
              <span>Vence em 2 dias</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}