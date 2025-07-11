import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDocumentNotifications } from "@/hooks/useDocumentNotifications";
import { useDocumentStorage } from "@/hooks/useDocumentStorage";
import { NovoDocumentoModal } from "@/components/modals/DocumentosModal";
import { DocumentSummaryCards } from "@/components/documentos/DocumentSummaryCards";
import { DocumentSearch } from "@/components/documentos/DocumentSearch";
import { DocumentGrid } from "@/components/documentos/DocumentGrid";

interface DocumentosSubsectionProps {
  onBack: () => void;
}

export function DocumentosSubsection({ onBack }: DocumentosSubsectionProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { marcarComoVisualizado } = useDocumentNotifications();
  const { documentos, adicionarDocumento, atualizarDocumentos } = useDocumentStorage();
  const [showNovoDocumentoModal, setShowNovoDocumentoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocumentos = documentos.filter(doc =>
    doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.funcionario && doc.funcionario.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDocument = (id: number) => {
    const doc = documentos.find(d => d.id === id);
    const documentosAtualizados = marcarComoVisualizado(id, documentos);
    atualizarDocumentos(documentosAtualizados);
    toast({
      title: "Visualizar Documento 👁️",
      description: `Abrindo ${doc?.nome}...`,
    });
  };

  const handleDownloadDocument = (id: number) => {
    const doc = documentos.find(d => d.id === id);
    toast({
      title: "Download Iniciado 📥",
      description: `Baixando ${doc?.nome}...`,
    });
  };

  const handleDeleteDocument = (id: number) => {
    const doc = documentos.find(d => d.id === id);
    toast({
      title: "Documento Excluído 🗑️",
      description: `${doc?.nome} foi removido`,
    });
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={onBack}>
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
            <Folder size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">Gestão de Documentos</h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Sua estante virtual para armazenar e gerenciar todos os documentos importantes
          </p>
        </div>

        {/* Summary Cards */}
        <DocumentSummaryCards documentos={documentos} />

        {/* Action Button */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <Button 
            className="primary-btn flex items-center gap-2"
            onClick={() => setShowNovoDocumentoModal(true)}
          >
            <Plus size={20} />
            Adicionar Documento
          </Button>
        </div>

        {/* Documents List */}
        <div className="space-y-4 animate-slide-up">
          {/* Search */}
          <DocumentSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />

          {/* Document Grid */}
          <DocumentGrid
            documentos={filteredDocumentos}
            onView={handleViewDocument}
            onDownload={handleDownloadDocument}
            onDelete={handleDeleteDocument}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modal */}
      <NovoDocumentoModal
        isOpen={showNovoDocumentoModal}
        onClose={() => setShowNovoDocumentoModal(false)}
        onSubmit={adicionarDocumento}
      />
    </div>
  );
}
