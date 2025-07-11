import { DocumentCard } from "@/components/DocumentCard";
import { DocumentoCompleto } from "@/hooks/useDocumentNotifications";

interface DocumentGridProps {
  documentos: DocumentoCompleto[];
  onView: (id: number) => void;
  onDownload: (id: number) => void;
  onDelete: (id: number) => void;
}

export function DocumentGrid({ documentos, onView, onDownload, onDelete }: DocumentGridProps) {
  if (documentos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhum documento encontrado</h3>
        <p className="text-gray-500">Tente ajustar os filtros de busca ou adicione um novo documento</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documentos.map((documento) => (
        <DocumentCard
          key={documento.id}
          documento={documento}
          onView={onView}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}