import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Upload, Search, Plus, Home, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DocumentCard } from "@/components/DocumentCard";
import { useNavigate } from "react-router-dom";
import { useDocumentNotifications, DocumentoCompleto } from "@/hooks/useDocumentNotifications";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [documentos, setDocumentos] = useState<DocumentoCompleto[]>(() => {
    const saved = localStorage.getItem('documentos');
    return saved ? JSON.parse(saved) : documentosMockCompletos;
  });
  
  const { documentosVencendo, hasNotifications, checkDocumentosVencendo, marcarComoVisualizado } = useDocumentNotifications();
  
  const [uploadData, setUploadData] = useState({
    arquivo: null as File | null,
    tipo: "",
    destinatario: "", // pode ser funcionário ou local
    tipoDestinatario: "", // "funcionario" ou "local"
    descricao: "",
    temValidade: false,
    dataValidade: ""
  });

  // Verificar documentos vencendo ao carregar
  useEffect(() => {
    checkDocumentosVencendo(documentos);
  }, [documentos, checkDocumentosVencendo]);

  // Salvar no localStorage sempre que documentos mudarem
  useEffect(() => {
    localStorage.setItem('documentos', JSON.stringify(documentos));
  }, [documentos]);

  const filteredDocumentos = documentos.filter(doc =>
    doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.funcionario && doc.funcionario.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande ❌",
          description: "O arquivo deve ter no máximo 10MB",
          variant: "destructive"
        });
        return;
      }
      setUploadData(prev => ({ ...prev, arquivo: file }));
    }
  };

  const handleSubmitUpload = () => {
    if (!uploadData.arquivo || !uploadData.tipo) {
      toast({
        title: "Erro ❌",
        description: "Selecione um arquivo e defina o tipo",
        variant: "destructive"
      });
      return;
    }

    if (uploadData.temValidade && !uploadData.dataValidade) {
      toast({
        title: "Erro ❌",
        description: "Defina a data de validade",
        variant: "destructive"
      });
      return;
    }

    let funcionario = null;
    let local = null;

    if (uploadData.tipoDestinatario === "funcionario" && uploadData.destinatario) {
      funcionario = funcionarios.find(f => f.id.toString() === uploadData.destinatario)?.nome || null;
    } else if (uploadData.tipoDestinatario === "local" && uploadData.destinatario) {
      local = locais.find(l => l.id.toString() === uploadData.destinatario)?.nome || null;
    }

    const novoDocumento: DocumentoCompleto = {
      id: documentos.length + 1,
      nome: uploadData.arquivo.name,
      tipo: uploadData.tipo.charAt(0).toUpperCase() + uploadData.tipo.slice(1),
      funcionario: funcionario,
      local: local,
      dataUpload: new Date().toLocaleDateString('pt-BR'),
      tamanho: (uploadData.arquivo.size / (1024 * 1024)).toFixed(1) + " MB",
      thumbnail: "📄",
      temValidade: uploadData.temValidade,
      dataValidade: uploadData.temValidade ? uploadData.dataValidade : undefined,
      visualizado: false
    };

    setDocumentos(prev => [novoDocumento, ...prev]);

    const destinatarioTexto = funcionario ? `para ${funcionario}` : 
                            local ? `para ${local}` : 
                            'como documento geral';

    toast({
      title: "Upload Realizado! 📄",
      description: `${uploadData.arquivo.name} foi adicionado ${destinatarioTexto}`,
    });

    setUploadData({
      arquivo: null,
      tipo: "",
      destinatario: "",
      tipoDestinatario: "",
      descricao: "",
      temValidade: false,
      dataValidade: ""
    });

    const fileInput = document.getElementById('arquivo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleViewDocument = (id: number) => {
    const doc = documentos.find(d => d.id === id);
    
    // Marcar como visualizado se estava vencendo
    const documentosAtualizados = marcarComoVisualizado(id, documentos);
    setDocumentos(documentosAtualizados);
    
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
    setDocumentos(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Documento Excluído 🗑️",
      description: `${doc?.nome} foi removido`,
    });
  };

  const documentosPorFuncionario = documentos.filter(d => d.funcionario).length;
  const documentosGerais = documentos.filter(d => !d.funcionario).length;

  return (
    <div className="space-y-6">
      <div className="navigation-buttons">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="back-button"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => navigate("/")}
          className="home-button"
        >
          <Home className="w-4 h-4" />
          Home
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-blue-600">📄 Gestão de Documentos</h1>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-2xl font-bold text-blue-600">{documentos.length}</div>
            <div className="text-sm text-gray-600">Total Documentos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-green-600">{documentosPorFuncionario}</div>
            <div className="text-sm text-gray-600">Por Funcionário</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">🏢</div>
            <div className="text-2xl font-bold text-purple-600">{documentosGerais}</div>
            <div className="text-sm text-gray-600">Documentos Gerais</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-lg font-bold text-orange-600">Hoje</div>
            <div className="text-sm text-gray-600">Último Upload</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload de Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Anexar Documento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="arquivo">Selecionar Arquivo *</Label>
              <Input
                id="arquivo"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
              </p>
              {uploadData.arquivo && (
                <p className="text-sm text-green-600 mt-1">
                  ✅ {uploadData.arquivo.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Documento *</Label>
              <Select value={uploadData.tipo} onValueChange={(value) => setUploadData(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contrato">📝 Contrato</SelectItem>
                  <SelectItem value="exame">🏥 Exame Médico</SelectItem>
                  <SelectItem value="manual">📚 Manual</SelectItem>
                  <SelectItem value="politica">📋 Política</SelectItem>
                  <SelectItem value="certificado">🏆 Certificado</SelectItem>
                  <SelectItem value="outros">📄 Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipo de Destinatário</Label>
              <Select 
                value={uploadData.tipoDestinatario} 
                onValueChange={(value) => setUploadData(prev => ({ ...prev, tipoDestinatario: value, destinatario: "" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de destinatário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">🏢 Documento Geral</SelectItem>
                  <SelectItem value="funcionario">👤 Funcionário</SelectItem>
                  <SelectItem value="local">📍 Local/Setor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {uploadData.tipoDestinatario === "funcionario" && (
              <div>
                <Label>Funcionário</Label>
                <Select 
                  value={uploadData.destinatario} 
                  onValueChange={(value) => setUploadData(prev => ({ ...prev, destinatario: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {funcionarios.map((funcionario) => (
                      <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                        👤 {funcionario.nome} - {funcionario.cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {uploadData.tipoDestinatario === "local" && (
              <div>
                <Label>Local/Setor</Label>
                <Select 
                  value={uploadData.destinatario} 
                  onValueChange={(value) => setUploadData(prev => ({ ...prev, destinatario: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    {locais.map((local) => (
                      <SelectItem key={local.id} value={local.id.toString()}>
                        📍 {local.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="descricao">Descrição (Opcional)</Label>
              <Input
                id="descricao"
                value={uploadData.descricao}
                onChange={(e) => setUploadData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descrição do documento..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="temValidade"
                checked={uploadData.temValidade}
                onCheckedChange={(checked) => setUploadData(prev => ({ ...prev, temValidade: checked as boolean }))}
              />
              <Label htmlFor="temValidade">Documento tem validade</Label>
            </div>

            {uploadData.temValidade && (
              <div>
                <Label htmlFor="dataValidade">Data de Validade *</Label>
                <Input
                  id="dataValidade"
                  type="date"
                  value={uploadData.dataValidade}
                  onChange={(e) => setUploadData(prev => ({ ...prev, dataValidade: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}

            <Button 
              onClick={handleSubmitUpload}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!uploadData.arquivo || !uploadData.tipo}
            >
              <Upload className="w-4 h-4 mr-2" />
              Anexar Documento
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Documentos */}
        <div className="lg:col-span-2 space-y-4">
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
              <p className="text-gray-500">Tente ajustar os filtros de busca ou anexe um novo documento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
