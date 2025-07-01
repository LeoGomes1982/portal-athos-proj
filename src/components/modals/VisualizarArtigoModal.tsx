
import { Edit, Calendar, Tag, MessageSquare, Link, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ArtigoVisualizarProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (artigo: any) => void;
  artigo: {
    id: string;
    titulo: string;
    conteudo: string;
    imagem?: string;
    link?: string;
    tags: string[];
    comentarios: string[];
    dataCriacao: string;
    dataAtualizacao: string;
  } | null;
}

const VisualizarArtigoModal = ({ isOpen, onClose, onEdit, artigo }: ArtigoVisualizarProps) => {
  if (!artigo) return null;

  const handleEdit = () => {
    onEdit(artigo);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-xl font-bold text-gray-800 flex-1">
              {artigo.titulo}
            </DialogTitle>
            <Button onClick={handleEdit} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Edit size={16} className="mr-2" />
              Editar
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metadados */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>Criado em: {new Date(artigo.dataCriacao).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>Atualizado em: {new Date(artigo.dataAtualizacao).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* Imagem */}
          {artigo.imagem && (
            <div className="space-y-2">
              <img
                src={artigo.imagem}
                alt={artigo.titulo}
                className="w-full max-h-96 object-cover rounded-lg border shadow-sm"
              />
            </div>
          )}

          {/* Conteúdo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Conteúdo</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {artigo.conteudo}
              </p>
            </div>
          </div>

          {/* Link */}
          {artigo.link && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Link size={18} />
                Link de Referência
              </h3>
              <a
                href={artigo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
              >
                {artigo.link}
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Tags */}
          {artigo.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Tag size={18} />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {artigo.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Comentários */}
          {artigo.comentarios.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MessageSquare size={18} />
                Comentários ({artigo.comentarios.length})
              </h3>
              <div className="space-y-3">
                {artigo.comentarios.map((comentario, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-gray-700">{comentario}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisualizarArtigoModal;
