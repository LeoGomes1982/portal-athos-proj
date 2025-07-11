import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Upload, Search, Plus, Home, AlertTriangle, ArrowLeft, Folder, Users, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DocumentCard } from "@/components/DocumentCard";
import { useNavigate } from "react-router-dom";
import { useDocumentNotifications, DocumentoCompleto } from "@/hooks/useDocumentNotifications";
import { NovoDocumentoModal } from "@/components/modals/DocumentosModal";

interface DocumentosSubsectionProps {
  onBack: () => void;
}

// Lista de funcionários (mesma da página de funcionários)
const funcionarios = [
  { id: 1, nome: "Ana Silva", cargo: "Analista de Sistemas", status: "ativo" },
  { id: 2, nome: "João Santos", cargo: "Desenvolvedor", status: "ferias" },
  { id: 3, nome: "Maria Costa", cargo: "Gerente de Vendas", status: "ativo" },
  { id: 4, nome: "Carlos Oliveira", cargo: "Analista Financeiro", status: "experiencia" },
  { id: 5, nome: "Patricia Fernandes", cargo: "Assistente Administrativo", status: "aviso" }
];

// Lista de locais para associar documentos
const locais = [
  { id: 1, nome: "Sede Principal" },
  { id: 2, nome: "Filial Norte" },
  { id: 3, nome: "Filial Sul" },
  { id: 4, nome: "Escritório Regional" },
  { id: 5, nome: "Almoxarifado Central" }
];

// Documentos mockados com sistema de validade
const documentosMockCompletos: DocumentoCompleto[] = [
  {
    id: 1,
    nome: "Contrato_Ana_Silva.pdf",
    tipo: "Contrato",
    funcionario: "Ana Silva",
    local: null,
    dataUpload: "2024-06-15",
    tamanho: "2.5 MB",
    thumbnail: "📄",
    temValidade: false,
    visualizado: false
  },
  {
    id: 2,
    nome: "Manual_Funcionario_2024.pdf",
    tipo: "Manual",
    funcionario: null,
    local: "Sede Principal",
    dataUpload: "2024-06-10",
    tamanho: "8.2 MB",
    thumbnail: "📚",
    temValidade: true,
    dataValidade: "2024-12-31",
    visualizado: false
  },
  {
    id: 3,
    nome: "Exame_Medico_Joao.pdf",
    tipo: "Exame Médico",
    funcionario: "João Santos",
    local: null,
    dataUpload: "2024-06-08",
    tamanho: "1.8 MB",
    thumbnail: "🏥",
    temValidade: true,
    dataValidade: "2025-01-15", // Vence em 2 dias para teste
    visualizado: false
  },
  {
    id: 4,
    nome: "Politica_Empresa.pdf",
    tipo: "Política",
    funcionario: null,
    local: "Sede Principal",
    dataUpload: "2024-06-05",
    tamanho: "3.1 MB",
    thumbnail: "📋",
    temValidade: false,
    visualizado: false
  }
];

export function DocumentosSubsection({ onBack }: DocumentosSubsectionProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { marcarComoVisualizado } = useDocumentNotifications();
  const [showNovoDocumentoModal, setShowNovoDocumentoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [documentos, setDocumentos] = useState<DocumentoCompleto[]>(documentosMockCompletos);

  const handleAdicionarDocumento = (documento: any) => {
    const novoDocumento = {
      ...documento,
      id: documentos.length + 1,
      dataUpload: new Date().toLocaleDateString('pt-BR'),
      thumbnail: "📄",
      visualizado: false
    };
    setDocumentos(prev => [novoDocumento, ...prev]);
  };
  
  const [uploadData, setUploadData] = useState({
    arquivo: null as File | null,
    tipo: "",
    destinatario: "", // pode ser funcionário ou local
    tipoDestinatario: "", // "funcionario" ou "local"
    descricao: "",
    temValidade: false,
    dataValidade: ""
  });

  const filteredDocumentos = documentos.filter(doc =>
    doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.funcionario && doc.funcionario.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  const handleViewDocument = (id: number) => {
    const doc = documentos.find(d => d.id === id);
    setDocumentos(marcarComoVisualizado(id, documentos));
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

  const totalDocumentos = documentos.length;
  const docsVencendo = documentos.filter(d => d.temValidade && d.dataValidade).length;
  const documentosFuncionarios = documentos.filter(d => d.funcionario).length;
  const documentosGerais = documentos.filter(d => !d.funcionario && !d.local).length;

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Folder size={20} className="text-primary" />
                Total de Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-primary mb-2">{totalDocumentos}</div>
              <p className="text-primary/80">documentos arquivados</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-red-500/10 to-red-500/20 border-red-500/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <AlertTriangle size={20} className="text-red-600" />
                Vencendo
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-red-600 mb-2">{docsVencendo}</div>
              <p className="text-red-600/80">próximos ao vencimento</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-green-500/10 to-green-500/20 border-green-500/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Users size={20} className="text-green-600" />
                Funcionários
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-green-600 mb-2">{documentosFuncionarios}</div>
              <p className="text-green-600/80">docs de funcionários</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-purple-500/10 to-purple-500/20 border-purple-500/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Building size={20} className="text-purple-600" />
                Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-purple-600 mb-2">{documentosGerais}</div>
              <p className="text-purple-600/80">documentos gerais</p>
            </CardContent>
          </Card>
        </div>

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

        {/* Documentos List */}
        <div className="space-y-4 animate-slide-up">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar documentos por nome, tipo ou funcionário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Grid de Documentos como Miniaturas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocumentos.map((documento) => (
              <DocumentCard
                key={documento.id}
                documento={documento}
                onView={handleViewDocument}
                onDownload={handleDownloadDocument}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>

          {filteredDocumentos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhum documento encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros de busca ou adicione um novo documento</p>
            </div>
          )}
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
        onSubmit={handleAdicionarDocumento}
      />
    </div>
  );
}
