import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ClipboardList, Plus, Filter, Calendar, FileText, ChevronDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NovaAtaModal } from "@/components/modals/NovaAtaModal";
import { ReplicaModal } from "@/components/modals/ReplicaModal";
import { AgendarTarefaAtaModal } from "@/components/modals/AgendarTarefaAtaModal";
import jsPDF from 'jspdf';

interface Replica {
  id: string;
  autor: string;
  data: string;
  conteudo: string;
  tipo: 'replica' | 'treplica';
}

interface Ata {
  id: string;
  data: string;
  responsavel: string;
  local: string;
  terminal: string;
  status: 'ativa' | 'encerrada';
  descricao: string;
  replicas: Replica[];
  tarefaAgendaId?: string;
}

export default function AtasSupervisao() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtrosAberto, setFiltrosAberto] = useState(false);
  const [novaAtaModalOpen, setNovaAtaModalOpen] = useState(false);
  const [replicaModalOpen, setReplicaModalOpen] = useState(false);
  const [agendarTarefaModalOpen, setAgendarTarefaModalOpen] = useState(false);
  const [selectedAta, setSelectedAta] = useState<Ata | null>(null);
  const [tipoReplica, setTipoReplica] = useState<'replica' | 'treplica'>('replica');
  const [atas, setAtas] = useState<Ata[]>([
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
          conteudo: "Concordo com a observação. Sugiro manter o monitoramento semanal.",
          tipo: "replica"
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
  ]);

  const handleSaveAta = (novaAta: Ata) => {
    setAtas(prev => [...prev, novaAta]);
  };

  const handleAddReplica = (replicaData: { autor: string; conteudo: string; tipo: 'replica' | 'treplica' }) => {
    if (!selectedAta) return;
    
    const novaReplica: Replica = {
      id: Date.now().toString(),
      autor: replicaData.autor,
      data: new Date().toLocaleDateString('pt-BR'),
      conteudo: replicaData.conteudo,
      tipo: replicaData.tipo
    };

    setAtas(prev => prev.map(ata => 
      ata.id === selectedAta.id 
        ? { ...ata, replicas: [...ata.replicas, novaReplica] }
        : ata
    ));
  };

  const handleTarefaCriada = (tarefaId: string) => {
    if (!selectedAta) return;
    
    setAtas(prev => prev.map(ata => 
      ata.id === selectedAta.id 
        ? { ...ata, tarefaAgendaId: tarefaId }
        : ata
    ));
  };

  const handleEncerrarAta = (ataId: string) => {
    setAtas(prev => prev.map(ata => 
      ata.id === ataId 
        ? { ...ata, status: 'encerrada' as const }
        : ata
    ));
  };

  const handleGerarPDF = (ata: Ata) => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('ATA DE SUPERVISÃO', 20, 30);
    
    // Informações básicas
    doc.setFontSize(12);
    doc.text(`Data: ${ata.data}`, 20, 50);
    doc.text(`Responsável: ${ata.responsavel}`, 20, 60);
    doc.text(`Local: ${ata.local}`, 20, 70);
    doc.text(`Terminal: ${ata.terminal}`, 20, 80);
    doc.text(`Status: ${ata.status}`, 20, 90);
    
    // Descrição
    doc.text('Descrição:', 20, 110);
    const splitText = doc.splitTextToSize(ata.descricao, 170);
    doc.text(splitText, 20, 120);
    
    let yPosition = 120 + (splitText.length * 5) + 20;
    
    // Réplicas e Tréplicas
    if (ata.replicas && ata.replicas.length > 0) {
      doc.text('Réplicas e Tréplicas:', 20, yPosition);
      yPosition += 10;
      
      ata.replicas.forEach((replica, index) => {
        doc.text(`${replica.tipo === 'replica' ? 'Réplica' : 'Tréplica'} ${index + 1}:`, 20, yPosition);
        yPosition += 7;
        doc.text(`Autor: ${replica.autor} - Data: ${replica.data}`, 20, yPosition);
        yPosition += 7;
        const replicaText = doc.splitTextToSize(replica.conteudo, 170);
        doc.text(replicaText, 20, yPosition);
        yPosition += (replicaText.length * 5) + 10;
      });
    }
    
    doc.save(`ata-supervisao-${ata.data.replace(/\//g, '-')}.pdf`);
  };

  const openReplicaModal = (ata: Ata, tipo: 'replica' | 'treplica') => {
    setSelectedAta(ata);
    setTipoReplica(tipo);
    setReplicaModalOpen(true);
  };

  const openAgendarTarefaModal = (ata: Ata) => {
    setSelectedAta(ata);
    setAgendarTarefaModalOpen(true);
  };

  const atasAtivas = atas.filter(ata => ata.status === 'ativa');
  const atasEncerradas = atas.filter(ata => ata.status === 'encerrada');
  const totalReplicas = atas.reduce((acc, ata) => acc + ata.replicas.length, 0);

  const filteredAtas = atas
    .filter(ata =>
      ata.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ata.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ata.terminal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ata.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Atas ativas primeiro, encerradas por último
      if (a.status === 'ativa' && b.status === 'encerrada') return -1;
      if (a.status === 'encerrada' && b.status === 'ativa') return 1;
      return 0;
    });

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
          <Button 
            onClick={() => setNovaAtaModalOpen(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
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

                          {ata.replicas.length > 0 ? (
                            <div className="border-t pt-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                  {ata.replicas[0].tipo === 'replica' ? 'Réplica' : 'Tréplica'}
                                </Badge>
                                <span className="text-sm font-medium">{ata.replicas[0].autor}</span>
                                <span className="text-xs text-gray-500">{ata.replicas[0].data}</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {ata.replicas[0].conteudo}
                              </p>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-blue-500 hover:text-blue-700"
                                  onClick={() => openReplicaModal(ata, 'replica')}
                                >
                                  Responder
                                </Button>
                                {ata.replicas.some(r => r.tipo === 'replica') && !ata.replicas.some(r => r.tipo === 'treplica') && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-purple-500 hover:text-purple-700"
                                    onClick={() => openReplicaModal(ata, 'treplica')}
                                  >
                                    Tréplica
                                  </Button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="border-t pt-4">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => openReplicaModal(ata, 'replica')}
                              >
                                Responder
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4 lg:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openAgendarTarefaModal(ata)}
                            className={ata.tarefaAgendaId ? "bg-purple-50 text-purple-700 border-purple-200" : ""}
                          >
                            <Calendar size={14} className="mr-1" />
                            {ata.tarefaAgendaId ? "Agendado" : "Agenda"}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleGerarPDF(ata)}
                          >
                            <FileText size={14} className="mr-1" />
                            PDF
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEncerrarAta(ata.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
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
                            Ver Detalhes
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleGerarPDF(ata)}
                          >
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
                  <Button variant="outline" onClick={() => setNovaAtaModalOpen(true)}>
                    <Plus className="mr-2" size={16} />
                    Criar Primeira Ata
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <NovaAtaModal 
          open={novaAtaModalOpen}
          onOpenChange={setNovaAtaModalOpen}
          onSave={handleSaveAta}
        />
        
        <ReplicaModal 
          open={replicaModalOpen}
          onOpenChange={setReplicaModalOpen}
          onSave={handleAddReplica}
          tipo={tipoReplica}
        />
        
        {selectedAta && (
          <AgendarTarefaAtaModal 
            open={agendarTarefaModalOpen}
            onOpenChange={setAgendarTarefaModalOpen}
            ataId={selectedAta.id}
            ataDescricao={selectedAta.descricao}
            onTarefaCriada={handleTarefaCriada}
          />
        )}
      </div>
    </div>
  );
}