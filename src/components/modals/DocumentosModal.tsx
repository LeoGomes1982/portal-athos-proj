
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Plus, Upload, Download, ExternalLink, File } from "lucide-react";

interface Documento {
  id: string;
  nome: string;
  tipo: 'arquivo' | 'contrato' | 'proposta';
  data: string;
  tamanho?: string;
  url?: string;
}

interface DocumentosModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteNome: string;
}

const DocumentosModal = ({ isOpen, onClose, clienteNome }: DocumentosModalProps) => {
  const [isUploading, setIsUploading] = useState(false);

  // Dados mockados - em produção viriam de uma API
  const [documentos] = useState<Documento[]>([
    {
      id: "1",
      nome: "Contrato de Prestação de Serviços - Janeiro 2024",
      tipo: "contrato",
      data: "2024-01-15",
      url: "/contratos/contrato-janeiro-2024"
    },
    {
      id: "2",
      nome: "Proposta Comercial - Novos Serviços",
      tipo: "proposta", 
      data: "2024-01-10",
      url: "/propostas/proposta-novos-servicos"
    },
    {
      id: "3",
      nome: "Documento Fiscal.pdf",
      tipo: "arquivo",
      data: "2024-01-08",
      tamanho: "2.3 MB"
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simular upload
      setTimeout(() => {
        setIsUploading(false);
        // Aqui adicionaria o arquivo à lista
      }, 2000);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'contrato': return <FileText className="text-blue-600" size={20} />;
      case 'proposta': return <FileText className="text-green-600" size={20} />;
      default: return <File className="text-gray-600" size={20} />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'contrato': return 'Contrato';
      case 'proposta': return 'Proposta';
      default: return 'Arquivo';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos - {clienteNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Arquivos e Documentos</h3>
            <div className="flex gap-2">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button disabled={isUploading}>
                  <Upload size={16} className="mr-2" />
                  {isUploading ? 'Enviando...' : 'Upload Arquivo'}
                </Button>
              </Label>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
              />
            </div>
          </div>

          <div className="space-y-3">
            {documentos.map((documento) => (
              <div key={documento.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                      {getTipoIcon(documento.tipo)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{documento.nome}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                          {getTipoLabel(documento.tipo)}
                        </span>
                        <span>{new Date(documento.data).toLocaleDateString('pt-BR')}</span>
                        {documento.tamanho && <span>{documento.tamanho}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {documento.tipo === 'contrato' || documento.tipo === 'proposta' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(documento.url, '_blank')}
                      >
                        <ExternalLink size={16} className="mr-1" />
                        Visualizar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Simular download
                          const link = document.createElement('a');
                          link.href = '#';
                          link.download = documento.nome;
                          link.click();
                        }}
                      >
                        <Download size={16} className="mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {documentos.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum documento encontrado</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentosModal;
