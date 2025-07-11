import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, Calendar, User, MapPin, Building2 } from "lucide-react";
import { DocumentoCompleto } from "@/hooks/useDocumentNotifications";

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documento: DocumentoCompleto | null;
  onDownload: (id: number) => void;
}

export function DocumentViewModal({ isOpen, onClose, documento, onDownload }: DocumentViewModalProps) {
  if (!documento) return null;

  const getDocumentIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'contrato': return '📝';
      case 'manual': return '📚';
      case 'exame médico': return '🏥';
      case 'política': return '📋';
      default: return '📄';
    }
  };

  const isVencido = () => {
    if (!documento.temValidade || !documento.dataValidade) return false;
    const hoje = new Date();
    const dataValidade = new Date(documento.dataValidade);
    return dataValidade < hoje;
  };

  const isVencendo = () => {
    if (!documento.temValidade || !documento.dataValidade) return false;
    const hoje = new Date();
    const doisDiasDepois = new Date();
    doisDiasDepois.setDate(hoje.getDate() + 2);
    const dataValidade = new Date(documento.dataValidade);
    return dataValidade <= doisDiasDepois && dataValidade >= hoje;
  };

  const vencido = isVencido();
  const vencendo = isVencendo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{getDocumentIcon(documento.tipo)}</div>
              <div>
                <DialogTitle className="text-xl font-bold mb-2">
                  {documento.nome}
                </DialogTitle>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {documento.tipo}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {documento.tamanho}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    📅 {documento.dataUpload}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => onDownload(documento.id)}>
              <Download className="w-4 h-4 mr-2" />
              Baixar
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6">
          {/* Informações de destinatário */}
          {documento.funcionario && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">Funcionário: {documento.funcionario}</span>
            </div>
          )}

          {documento.local && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-purple-50 rounded-lg">
              <MapPin className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 font-medium">Local: {documento.local}</span>
            </div>
          )}

          {!documento.funcionario && !documento.local && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
              <Building2 className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 font-medium">Documento Geral</span>
            </div>
          )}

          {/* Informações de validade */}
          {documento.temValidade && documento.dataValidade && (
            <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
              vencido ? 'bg-red-50' : vencendo ? 'bg-orange-50' : 'bg-green-50'
            }`}>
              <Calendar className={`w-4 h-4 ${
                vencido ? 'text-red-600' : vencendo ? 'text-orange-600' : 'text-green-600'
              }`} />
              <span className={`font-medium ${
                vencido ? 'text-red-700' : vencendo ? 'text-orange-700' : 'text-green-700'
              }`}>
                {vencido ? 'Documento Vencido' : vencendo ? 'Documento Vencendo' : 'Documento Válido'}: {' '}
                {new Date(documento.dataValidade).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>

        {/* Área de visualização do documento */}
        <div className="flex-1 mx-6 mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-8xl mb-4">{getDocumentIcon(documento.tipo)}</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Visualização do Documento</h3>
            <p className="text-gray-500 mb-4">
              Esta é uma prévia do documento. Para uma visualização completa, faça o download.
            </p>
            <div className="bg-white p-4 rounded border-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-600">
                <strong>Nome:</strong> {documento.nome}<br />
                <strong>Tipo:</strong> {documento.tipo}<br />
                <strong>Tamanho:</strong> {documento.tamanho}<br />
                <strong>Data de Upload:</strong> {documento.dataUpload}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}