
import { useState } from "react";
import { FileText, Plus, Search, Tag, MessageSquare, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ArtigoModal from "@/components/modals/ArtigoModal";
import VisualizarArtigoModal from "@/components/modals/VisualizarArtigoModal";

interface Artigo {
  id: string;
  titulo: string;
  conteudo: string;
  imagem?: string;
  link?: string;
  tags: string[];
  comentarios: string[];
  dataCriacao: string;
  dataAtualizacao: string;
}

const ManuaisNormasSubsection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedArtigo, setSelectedArtigo] = useState<Artigo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [artigos, setArtigos] = useState<Artigo[]>([
    {
      id: "1",
      titulo: "Política de Uso de Equipamentos",
      conteudo: "Este manual estabelece as diretrizes para o uso adequado dos equipamentos da empresa...",
      tags: ["equipamentos", "política", "uso"],
      comentarios: ["Artigo muito esclarecedor", "Precisa ser atualizado"],
      dataCriacao: "2024-01-15",
      dataAtualizacao: "2024-01-15"
    },
    {
      id: "2",
      titulo: "Normas de Segurança no Trabalho", 
      conteudo: "Conjunto de normas e procedimentos de segurança que devem ser seguidos...",
      tags: ["segurança", "trabalho", "normas"],
      comentarios: ["Muito importante", "Deveria ter mais exemplos"],
      dataCriacao: "2024-01-10",
      dataAtualizacao: "2024-01-20"
    }
  ]);

  const filteredArtigos = artigos.filter(artigo =>
    artigo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artigo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveArtigo = (novoArtigo: Omit<Artigo, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => {
    if (selectedArtigo) {
      // Editando artigo existente
      setArtigos(prev => prev.map(artigo => 
        artigo.id === selectedArtigo.id 
          ? { ...artigo, ...novoArtigo, dataAtualizacao: new Date().toISOString().split('T')[0] }
          : artigo
      ));
    } else {
      // Criando novo artigo
      const artigo: Artigo = {
        ...novoArtigo,
        id: Date.now().toString(),
        dataCriacao: new Date().toISOString().split('T')[0],
        dataAtualizacao: new Date().toISOString().split('T')[0]
      };
      setArtigos(prev => [...prev, artigo]);
    }
    setIsModalOpen(false);
    setSelectedArtigo(null);
  };

  const handleViewArtigo = (artigo: Artigo) => {
    setSelectedArtigo(artigo);
    setIsViewModalOpen(true);
  };

  const handleEditArtigo = (artigo: Artigo) => {
    setSelectedArtigo(artigo);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="page-header-icon bg-gradient-to-br from-blue-100 to-blue-200">
            <FileText size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="section-title mb-0">Manuais e Normas Internas</h2>
            <p className="text-description">Biblioteca de artigos e documentos normativos</p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Novo Artigo
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Buscar artigos por título ou tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtigos.map((artigo) => (
          <Card key={artigo.id} className="modern-card hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                {artigo.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm line-clamp-3">
                {artigo.conteudo}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {artigo.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Comments Count */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{artigo.comentarios.length} comentários</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(artigo.dataAtualizacao).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewArtigo(artigo)}
                  className="flex-1"
                >
                  Visualizar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditArtigo(artigo)}
                  className="flex-1"
                >
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArtigos.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhum artigo encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Tente outros termos de busca" : "Comece criando seu primeiro artigo"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-2" />
              Criar Primeiro Artigo
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <ArtigoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedArtigo(null);
        }}
        onSave={handleSaveArtigo}
        artigo={selectedArtigo}
      />

      <VisualizarArtigoModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedArtigo(null);
        }}
        artigo={selectedArtigo}
        onEdit={handleEditArtigo}
      />
    </div>
  );
};

export default ManuaisNormasSubsection;
