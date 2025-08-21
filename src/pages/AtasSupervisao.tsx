import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ClipboardList, Plus, Filter, Calendar, FileText, MoreVertical, ChevronDown } from "lucide-react";
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

  const estatisticas = [
    {
      titulo: "Total de Atas",
      valor: atas.length.toString(),
      subtitulo: "Registros criados",
      icone: "📋",
      cor: "text-gray-600"
    },
    {
      titulo: "Ativas", 
      valor: atasAtivas.length.toString(),
      subtitulo: "",
      icone: "✅",
      cor: "text-green-600"
    },
    {
      titulo: "Encerradas",
      valor: atasEncerradas.length.toString(), 
      subtitulo: "",
      icone: "🔒",
      cor: "text-orange-600"
    },
    {
      titulo: "Total Réplicas",
      valor: totalReplicas.toString(),
      subtitulo: "",
      icone: "💬",
      cor: "text-purple-600"
    }
  ];

  return (
    <div className="app-container">
      <div className="content-wrapper animate-fade-in">
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
        <div className="page-header-centered mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <ClipboardList className="text-white text-3xl" size={40} />
          </div>
          <div className="text-center">
            <h1 className="page-title mb-2">Atas da Supervisão</h1>
            <p className="text-description">Registro de atas semanais e ocorrências de supervisão</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {estatisticas.map((stat, index) => (
            <Card key={index} className="modern-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl">{stat.icone}</span>
                    <div className="mt-2">
                      <div className={`text-2xl font-bold ${stat.cor}`}>
                        {stat.valor}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {stat.titulo}
                      </div>
                      {stat.subtitulo && (
                        <div className="text-xs text-gray-500 mt-1">
                          {stat.subtitulo}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
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
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <h2 className="text-lg font-semibold">Atas Ativas ({atasAtivas.length})</h2>
          </div>

          {atasAtivas.map((ata) => (
            <Card key={ata.id} className="modern-card mb-4">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Atas Encerradas */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
            <h2 className="text-lg font-semibold">Atas Encerradas ({atasEncerradas.length})</h2>
          </div>

          {atasEncerradas.map((ata) => (
            <Card key={ata.id} className="modern-card mb-4 bg-gray-50">
              <CardContent className="p-6">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}