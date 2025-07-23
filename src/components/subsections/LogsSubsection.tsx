import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Search, 
  Calendar, 
  User, 
  FileText, 
  Trash2,
  Download,
  Filter,
  Eye
} from "lucide-react";

interface LogsSubsectionProps {
  onBack: () => void;
}

interface DeleteRecord {
  id: string;
  funcionarioId: number;
  funcionarioNome: string;
  tipo: string;
  motivo: string;
  usuario: string;
  data: string;
}

export function LogsSubsection({ onBack }: LogsSubsectionProps) {
  const [deleteRecords, setDeleteRecords] = useState<DeleteRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<DeleteRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("todos");

  useEffect(() => {
    loadDeleteRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [deleteRecords, searchTerm, filterType]);

  const loadDeleteRecords = () => {
    const records = JSON.parse(localStorage.getItem('delete_records') || '[]');
    // Ordenar por data mais recente primeiro
    const sortedRecords = records.sort((a: DeleteRecord, b: DeleteRecord) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
    setDeleteRecords(sortedRecords);
  };

  const filterRecords = () => {
    let filtered = [...deleteRecords];

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.funcionarioNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.usuario.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (filterType !== "todos") {
      filtered = filtered.filter(record => record.tipo === filterType);
    }

    setFilteredRecords(filtered);
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case "dependente": return "bg-blue-100 text-blue-700 border-blue-200";
      case "documento": return "bg-green-100 text-green-700 border-green-200";
      case "uniforme": return "bg-purple-100 text-purple-700 border-purple-200";
      case "historico": return "bg-orange-100 text-orange-700 border-orange-200";
      case "dados-pessoais": return "bg-red-100 text-red-700 border-red-200";
      case "dados-profissionais": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "dependente": return "👶";
      case "documento": return "📄";
      case "uniforme": return "👕";
      case "historico": return "📋";
      case "dados-pessoais": return "👤";
      case "dados-profissionais": return "💼";
      default: return "📝";
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ["Data", "Funcionário", "Tipo", "Motivo", "Usuário"],
      ...filteredRecords.map(record => [
        new Date(record.data).toLocaleString('pt-BR'),
        record.funcionarioNome,
        record.tipo,
        record.motivo,
        record.usuario
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_exclusoes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueTypes = [...new Set(deleteRecords.map(record => record.tipo))];

  return (
    <div className="app-container">
      <div className="content-wrapper animate-fade-in">
        {/* Navigation */}
        <div className="navigation-button">
          <button onClick={onBack} className="back-button">
            <ChevronLeft size={16} />
            Voltar à Gerência
          </button>
        </div>

        {/* Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <FileText size={32} className="text-white" />
          </div>
          <div>
            <h1 className="page-title mb-0">Logs do Sistema</h1>
            <p className="text-description">Registros de exclusões e auditoria</p>
          </div>
        </div>

        {/* Controls */}
        <Card className="modern-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Buscar por funcionário, tipo, motivo ou usuário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-500" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todos os tipos</option>
                    {uniqueTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Export */}
              <Button 
                onClick={exportLogs}
                disabled={filteredRecords.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download size={16} className="mr-2" />
                Exportar CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="modern-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Registros</p>
                  <p className="text-2xl font-bold text-gray-900">{deleteRecords.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Filtrados</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredRecords.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye size={24} className="text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tipos Diferentes</p>
                  <p className="text-2xl font-bold text-gray-900">{uniqueTypes.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Trash2 size={24} className="text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs List */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 size={20} />
              Registros de Exclusões ({filteredRecords.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {deleteRecords.length === 0 ? "Nenhum registro encontrado" : "Nenhum resultado para os filtros aplicados"}
                </h3>
                <p className="text-gray-500">
                  {deleteRecords.length === 0 
                    ? "Ainda não há registros de exclusão no sistema."
                    : "Tente ajustar os filtros de busca para encontrar o que procura."
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getTypeIcon(record.tipo)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{record.funcionarioNome}</h4>
                            <p className="text-sm text-gray-500">ID: {record.funcionarioId}</p>
                          </div>
                          <Badge className={`${getTypeColor(record.tipo)} border`}>
                            {record.tipo.replace('-', ' ')}
                          </Badge>
                        </div>

                        {/* Content */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Motivo:</strong> {record.motivo}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{record.usuario}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(record.data).toLocaleString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}