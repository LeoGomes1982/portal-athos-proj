
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Upload, Search, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentosSubsectionProps {
  onBack: () => void;
}

// Documentos mockados
const documentos = [
  {
    id: 1,
    nome: "Contrato_Ana_Silva.pdf",
    tipo: "Contrato",
    funcionario: "Ana Silva",
    dataUpload: "2024-06-15",
    tamanho: "2.5 MB",
    thumbnail: "📄"
  },
  {
    id: 2,
    nome: "Manual_Funcionario_2024.pdf",
    tipo: "Manual",
    funcionario: null,
    dataUpload: "2024-06-10",
    tamanho: "8.2 MB",
    thumbnail: "📚"
  },
  {
    id: 3,
    nome: "Exame_Medico_Joao.pdf",
    tipo: "Exame Médico",
    funcionario: "João Santos",
    dataUpload: "2024-06-08",
    tamanho: "1.8 MB",
    thumbnail: "🏥"
  },
  {
    id: 4,
    nome: "Politica_Empresa.pdf",
    tipo: "Política",
    funcionario: null,
    dataUpload: "2024-06-05",
    tamanho: "3.1 MB",
    thumbnail: "📋"
  }
];

const funcionarios = [
  { id: 1, nome: "Ana Silva" },
  { id: 2, nome: "João Santos" },
  { id: 3, nome: "Maria Costa" },
  { id: 4, nome: "Carlos Oliveira" }
];

export function DocumentosSubsection({ onBack }: DocumentosSubsectionProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadData, setUploadData] = useState({
    arquivo: null as File | null,
    tipo: "",
    funcionarioId: "",
    descricao: ""
  });

  const filteredDocumentos = documentos.filter(doc =>
    doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.funcionario && doc.funcionario.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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

    const funcionario = uploadData.funcionarioId 
      ? funcionarios.find(f => f.id.toString() === uploadData.funcionarioId)?.nome 
      : "Documento geral";

    toast({
      title: "Upload Realizado! 📄",
      description: `${uploadData.arquivo.name} foi adicionado ${funcionario !== "Documento geral" ? `para ${funcionario}` : 'como documento geral'}`,
    });

    // Reset form
    setUploadData({
      arquivo: null,
      tipo: "",
      funcionarioId: "",
      descricao: ""
    });
  };

  const getDocumentIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'contrato': return '📝';
      case 'manual': return '📚';
      case 'exame médico': return '🏥';
      case 'política': return '📋';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
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
            <div className="text-2xl font-bold text-green-600">
              {documentos.filter(d => d.funcionario).length}
            </div>
            <div className="text-sm text-gray-600">Por Funcionário</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">🏢</div>
            <div className="text-2xl font-bold text-purple-600">
              {documentos.filter(d => !d.funcionario).length}
            </div>
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
              📤 Upload de Documento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="arquivo">Arquivo</Label>
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
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Documento</Label>
              <Select onValueChange={(value) => setUploadData(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contrato">📝 Contrato</SelectItem>
                  <SelectItem value="exame">🏥 Exame Médico</SelectItem>
                  <SelectItem value="manual">📚 Manual</SelectItem>
                  <SelectItem value="politica">📋 Política</SelectItem>
                  <SelectItem value="outros">📄 Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="funcionario">Funcionário (Opcional)</Label>
              <Select onValueChange={(value) => setUploadData(prev => ({ ...prev, funcionarioId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="👤 Documento geral ou selecione funcionário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">🏢 Documento Geral</SelectItem>
                  {funcionarios.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                      👤 {funcionario.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição (Opcional)</Label>
              <Input
                id="descricao"
                value={uploadData.descricao}
                onChange={(e) => setUploadData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descrição do documento..."
              />
            </div>

            <Button 
              onClick={handleSubmitUpload}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Fazer Upload
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Documentos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Grid de Documentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocumentos.map((documento) => (
              <Card key={documento.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{getDocumentIcon(documento.tipo)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{documento.nome}</h3>
                      <p className="text-sm text-gray-600">{documento.tipo}</p>
                      {documento.funcionario && (
                        <p className="text-xs text-blue-600">👤 {documento.funcionario}</p>
                      )}
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>{documento.dataUpload}</span>
                        <span>{documento.tamanho}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocumentos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhum documento encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
