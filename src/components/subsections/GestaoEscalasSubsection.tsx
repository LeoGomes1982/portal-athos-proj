import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Calendar, Users, Clock, MapPin, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GestaoEscalasSubsectionProps {
  onBack: () => void;
}

interface Escala {
  id: string;
  funcionarioId: number;
  funcionarioNome: string;
  posto: string;
  turno: "manhã" | "tarde" | "noite" | "madrugada";
  dataInicio: string;
  dataFim: string;
  horaInicio: string;
  horaFim: string;
  status: "ativa" | "concluida" | "cancelada";
  observacoes?: string;
}

const turnoConfig = {
  manhã: { label: "Manhã", color: "bg-yellow-500", icon: "🌅" },
  tarde: { label: "Tarde", color: "bg-orange-500", icon: "☀️" },
  noite: { label: "Noite", color: "bg-blue-500", icon: "🌙" },
  madrugada: { label: "Madrugada", color: "bg-purple-500", icon: "🌌" }
};

const statusConfig = {
  ativa: { label: "Ativa", color: "bg-green-500" },
  concluida: { label: "Concluída", color: "bg-gray-500" },
  cancelada: { label: "Cancelada", color: "bg-red-500" }
};

export function GestaoEscalasSubsection({ onBack }: GestaoEscalasSubsectionProps) {
  const [escalas] = useState<Escala[]>([
    {
      id: "1",
      funcionarioId: 1,
      funcionarioNome: "João Silva",
      posto: "Portaria Principal",
      turno: "manhã",
      dataInicio: "2024-01-15",
      dataFim: "2024-01-15",
      horaInicio: "06:00",
      horaFim: "14:00",
      status: "ativa",
      observacoes: "Escala normal de segunda-feira"
    },
    {
      id: "2",
      funcionarioId: 2,
      funcionarioNome: "Maria Santos",
      posto: "Recepção",
      turno: "tarde",
      dataInicio: "2024-01-15",
      dataFim: "2024-01-15",
      horaInicio: "14:00",
      horaFim: "22:00",
      status: "ativa"
    }
  ]);

  const [viewMode, setViewMode] = useState<"lista" | "calendario">("lista");
  const [showNovaEscalaForm, setShowNovaEscalaForm] = useState(false);

  const getEscalasPorTurno = () => {
    const grupos = escalas.reduce((acc, escala) => {
      if (!acc[escala.turno]) acc[escala.turno] = [];
      acc[escala.turno].push(escala);
      return acc;
    }, {} as Record<string, Escala[]>);
    return grupos;
  };

  const escalasPorTurno = getEscalasPorTurno();

  return (
    <div className="app-container">
      <div className="content-wrapper animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Voltar para Operações
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "lista" ? "default" : "outline"}
              onClick={() => setViewMode("lista")}
              size="sm"
            >
              Lista
            </Button>
            <Button 
              variant={viewMode === "calendario" ? "default" : "outline"}
              onClick={() => setViewMode("calendario")}
              size="sm"
            >
              Calendário
            </Button>
            <Button 
              onClick={() => setShowNovaEscalaForm(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Nova Escala
            </Button>
          </div>
        </div>

        {/* Page Header */}
        <div className="page-header-centered mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Calendar className="text-white text-3xl" size={40} />
          </div>
          <div>
            <h1 className="page-title mb-0">Gestão de Escalas</h1>
            <p className="text-description">Controle de escalas e turnos de trabalho</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-medium">Escalas Ativas</p>
                  <p className="text-2xl font-bold text-green-800">2</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-medium">Funcionários Escalados</p>
                  <p className="text-2xl font-bold text-blue-800">2</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 text-sm font-medium">Horas Totais</p>
                  <p className="text-2xl font-bold text-purple-800">16h</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700 text-sm font-medium">Postos Cobertos</p>
                  <p className="text-2xl font-bold text-orange-800">2</p>
                </div>
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {viewMode === "lista" ? (
          <div className="space-y-6">
            {Object.entries(escalasPorTurno).map(([turno, escalasDoTurno]) => (
              <Card key={turno}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{turnoConfig[turno as keyof typeof turnoConfig].icon}</span>
                    {turnoConfig[turno as keyof typeof turnoConfig].label}
                    <Badge className={`${turnoConfig[turno as keyof typeof turnoConfig].color} text-white`}>
                      {escalasDoTurno.length} escalas
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {escalasDoTurno.map((escala) => (
                      <div key={escala.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{escala.funcionarioNome}</h3>
                              <Badge className={`${statusConfig[escala.status].color} text-white`}>
                                {statusConfig[escala.status].label}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{escala.posto}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(escala.dataInicio).toLocaleDateString('pt-BR')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{escala.horaInicio} - {escala.horaFim}</span>
                              </div>
                            </div>
                            
                            {escala.observacoes && (
                              <p className="text-sm text-gray-500 mt-2">{escala.observacoes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Visualização de calendário em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        )}

        {escalas.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma escala cadastrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}