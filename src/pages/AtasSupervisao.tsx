import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ClipboardList, Plus, Filter, Calendar, FileText, ChevronDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Ata {
  id: string;
  data: string;
  responsavel: string;
  local: string;
  terminal: string;
  status: 'ativa' | 'encerrada';
  descricao: string;
  replicas: Array<{
    id: string;
    autor: string;
    data: string;
    conteudo: string;
  }>;
}

export default function AtasSupervisao() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtrosAberto, setFiltrosAberto] = useState(false);

  // Mock data
  const atas: Ata[] = [
    {
      id: "1",
      data: "14/01/2024",
      responsavel: "João Silva",
      local: "São Paulo",
      terminal: "Terminal Rodoviário",
      status: "ativa",
      descricao: "Durante a supervisão desta semana, observei que o sistema de controle de acesso está funcionando adequadamente. Todos os funcionários estão seguindo os protocolos de segurança estabelecidos.",
      replicas: [
        {
          id: "1",
          autor: "Maria Santos",
          data: "16/01/2024",
          conteudo: "Concordo com a observação. Sugiro manter o monitoramento semanal."
        }
      ]
    },
    {
      id: "2", 
      data: "21/01/2024",
      responsavel: "Carlos Oliveira",
      local: "Rio de Janeiro",
      terminal: "Aeroporto Santos Dumont",
      status: "encerrada",
      descricao: "Ata de supervisão do aeroporto com 2 respostas registradas.",
      replicas: []
    }
  ];

  const atasAtivas = atas.filter(ata => ata.status === 'ativa');
  const atasEncerradas = atas.filter(ata => ata.status === 'encerrada');
  const totalReplicas = atas.reduce((acc, ata) => acc + ata.replicas.length, 0);

  const filteredAtas = atas.filter(ata =>
    ata.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ata.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ata.terminal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ata.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="content-wrapper animate-fade-in bg-green-100/80 rounded-lg shadow-lg p-8">
        {/* Navigation */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/operacoes")}
        >
          <ChevronLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <ClipboardList className="text-white text-3xl" size={40} />
          </div>
          <div>
            <h1 className="page-title mb-0">Atas da Supervisão</h1>
            <p className="text-description">Registro de atas semanais e ocorrências de supervisão</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">📋</div>
              <div className="text-2xl font-bold text-gray-700">
                {atas.length}
              </div>
              <div className="text-sm text-gray-600 mb-1">Total de Atas</div>
              <div className="text-xs text-gray-500 font-medium">
                Registros criados
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-700">
                {atasAtivas.length}
              </div>
              <div className="text-sm text-gray-600">Ativas</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-2xl font-bold text-gray-700">
                {atasEncerradas.length}
              </div>
              <div className="text-sm text-gray-600">Encerradas</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">💬</div>
              <div className="text-2xl font-bold text-gray-700">
                {totalReplicas}
              </div>
              <div className="text-sm text-gray-600">Total Réplicas</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-description" size={20} />
            <Input
              placeholder="Buscar por responsável, local, terminal ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus size={16} className="mr-2" />
            Nova Ata
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setFiltrosAberto(!filtrosAberto)}
            className="border-gray-300"
          >
            <Filter size={16} className="mr-2" />
            Filtros
          </Button>
        </div>

        {/* Atas Ativas */}
        <div className="space-y-6 animate-slide-up">
          {filteredAtas.filter(ata => ata.status === 'ativa').length > 0 && (
            <Card className="modern-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <CardTitle className="text-lg">Atas Ativas ({atasAtivas.length})</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAtas.filter(ata => ata.status === 'ativa').map((ata) => (
                    <div key={ata.id} className="p-4 bg-background rounded-lg border">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <Badge className="bg-green-50 text-green-700 border-green-200">
                              Ativa
                            </Badge>
                            <span className="font-medium">Ata de {ata.data}</span>
                            <span className="text-sm text-gray-500">{ata.responsavel}</span>
                            <span className="text-sm text-gray-500">{ata.local}</span>
                            <span className="text-sm text-gray-500">{ata.terminal}</span>
                          </div>
                          
                          <p className="text-gray-700 text-sm leading-relaxed mb-4">
                            {ata.descricao}
                          </p>

                          {ata.replicas.length > 0 && (
                            <div className="border-t pt-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                  Réplica
                                </Badge>
                                <span className="text-sm font-medium">{ata.replicas[0].autor}</span>
                                <span className="text-xs text-gray-500">{ata.replicas[0].data}</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {ata.replicas[0].conteudo}
                              </p>
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                                Responder
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4 lg:mt-0">
                          <Button variant="outline" size="sm">
                            <Calendar size={14} className="mr-1" />
                            Agenda
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText size={14} className="mr-1" />
                            PDF
                          </Button>
                          <Button variant="outline" size="sm">
                            Encerrar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Atas Encerradas */}
          {filteredAtas.filter(ata => ata.status === 'encerrada').length > 0 && (
            <Card className="modern-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <CardTitle className="text-lg">Atas Encerradas ({atasEncerradas.length})</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAtas.filter(ata => ata.status === 'encerrada').map((ata) => (
                    <div key={ata.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <ChevronDown size={16} className="text-gray-400" />
                          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                            Encerrada
                          </Badge>
                          <span className="font-medium text-gray-700">Ata de {ata.data}</span>
                          <span className="text-sm text-gray-500">{ata.responsavel}</span>
                          <span className="text-sm text-gray-500">{ata.local}</span>
                          <span className="text-sm text-gray-500">{ata.terminal}</span>
                          {ata.replicas.length > 0 && (
                            <span className="text-sm text-gray-500">{ata.replicas.length} respostas</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            Tweak
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText size={14} className="mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredAtas.length === 0 && (
            <Card className="modern-card">
              <CardContent className="p-8 text-center">
                <ClipboardList className="mx-auto mb-4 text-description" size={48} />
                <h3 className="subsection-title mb-2">Nenhuma ata encontrada</h3>
                <p className="text-description mb-4">
                  {searchTerm ? "Tente ajustar os filtros de busca." : "Comece criando sua primeira ata de supervisão."}
                </p>
                {!searchTerm && (
                  <Button variant="outline">
                    <Plus className="mr-2" size={16} />
                    Criar Primeira Ata
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}