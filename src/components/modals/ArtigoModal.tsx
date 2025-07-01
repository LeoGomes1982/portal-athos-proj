
import { useState, useEffect } from "react";
import { X, Upload, Link, Tag, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ArtigoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (artigo: {
    titulo: string;
    conteudo: string;
    imagem?: string;
    link?: string;
    tags: string[];
    comentarios: string[];
  }) => void;
  artigo?: {
    id: string;
    titulo: string;
    conteudo: string;
    imagem?: string;
    link?: string;
    tags: string[];
    comentarios: string[];
  } | null;
}

const ArtigoModal = ({ isOpen, onClose, onSave, artigo }: ArtigoModalProps) => {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState<string>("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [comentarios, setComentarios] = useState<string[]>([]);
  const [newComentario, setNewComentario] = useState("");

  useEffect(() => {
    if (artigo) {
      setTitulo(artigo.titulo);
      setConteudo(artigo.conteudo);
      setImagem(artigo.imagem || "");
      setLink(artigo.link || "");
      setTags(artigo.tags);
      setComentarios(artigo.comentarios);
    } else {
      resetForm();
    }
  }, [artigo]);

  const resetForm = () => {
    setTitulo("");
    setConteudo("");
    setImagem("");
    setLink("");
    setTags([]);
    setNewTag("");
    setComentarios([]);
    setNewComentario("");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagem(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addComentario = () => {
    if (newComentario.trim()) {
      setComentarios([...comentarios, newComentario.trim()]);
      setNewComentario("");
    }
  };

  const removeComentario = (index: number) => {
    setComentarios(comentarios.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!titulo.trim() || !conteudo.trim()) {
      return;
    }

    onSave({
      titulo,
      conteudo,
      imagem: imagem || undefined,
      link: link || undefined,
      tags,
      comentarios
    });

    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save size={20} className="text-blue-600" />
            {artigo ? "Editar Artigo" : "Novo Artigo"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título do artigo"
            />
          </div>

          {/* Conteúdo */}
          <div className="space-y-2">
            <Label htmlFor="conteudo">Conteúdo *</Label>
            <Textarea
              id="conteudo"
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Digite o conteúdo do artigo"
              className="min-h-[200px]"
            />
          </div>

          {/* Upload de Imagem */}
          <div className="space-y-2">
            <Label htmlFor="imagem">Imagem</Label>
            <div className="flex items-center gap-4">
              <Input
                id="imagem"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
              />
              <Upload size={20} className="text-gray-400" />
            </div>
            {imagem && (
              <div className="mt-2">
                <img
                  src={imagem}
                  alt="Preview"
                  className="max-w-xs max-h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Link */}
          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <div className="flex items-center gap-2">
              <Link size={16} className="text-gray-400" />
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://exemplo.com"
                className="flex-1"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-gray-400" />
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar tag"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" onClick={addTag} size="sm">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    size={12}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Comentários */}
          <div className="space-y-2">
            <Label>Comentários</Label>
            <div className="flex items-center gap-2">
              <Input
                value={newComentario}
                onChange={(e) => setNewComentario(e.target.value)}
                placeholder="Adicionar comentário"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addComentario()}
              />
              <Button type="button" onClick={addComentario} size="sm">
                Adicionar
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {comentarios.map((comentario, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm">{comentario}</span>
                  <X
                    size={16}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => removeComentario(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!titulo.trim() || !conteudo.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save size={16} className="mr-2" />
              {artigo ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtigoModal;
