
import { useState } from "react";
import { FileText, Plus, Search, Tag, MessageSquare, Calendar } from "lucide-react";
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
      setArtigos(prev => prev.map(artigo => 
        artigo.id === selectedArtigo.id 
          ? { ...artigo, ...novoArtigo, dataAtualizacao: new Date().toISOString().split('T')[0] }
          : artigo
      ));
    } else {
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <FileText size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Manuais e Normas Internas</h3>
          <p className="text-sm text-gray-600">Biblioteca de documentos normativos</p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{artigos.length}</div>
              <div className="text-sm text-gray-500">Artigos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {artigos.reduce((acc, artigo) => acc + artigo.comentarios.length, 0)}
              </div>
              <div className="text-sm text-gray-500">Comentários</div>
            </div>
          </div>
        </div>
      </div>

      {/* New Article Button */}
      <Button 
        onClick={() => setIsModalOpen(true)} 
        className="mb-4 bg-blue-600 hover:bg-blue-700"
      >
        <Plus size={16} className="mr-2" />
        Nova Publicação
      </Button>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Buscar artigos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>

      {/* Articles List */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredArtigos.map((artigo) => (
            <div key={artigo.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{artigo.titulo}</h4>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewArtigo(artigo)}
                    className="text-xs px-2 py-1"
                  >
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditArtigo(artigo)}
                    className="text-xs px-2 py-1"
                  >
                    Editar
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-600 text-xs line-clamp-2 mb-2">{artigo.conteudo}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Tag size={12} />
                    <span>{artigo.tags.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={12} />
                    <span>{artigo.comentarios.length}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{new Date(artigo.dataAtualizacao).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredArtigos.length === 0 && (
            <div className="text-center py-8">
              <FileText size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">
                {searchTerm ? "Nenhum artigo encontrado" : "Nenhum artigo cadastrado"}
              </p>
            </div>
          )}
        </div>
      </div>

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
