import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, GraduationCap, FileText, Users, Calendar, Plus, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CuidadosTreinamentosSubsectionProps {
  onBack: () => void;
}

export function CuidadosTreinamentosSubsection({ onBack }: CuidadosTreinamentosSubsectionProps) {
  const [treinamentos] = useState([
    {
      id: 1,
      titulo: "Segurança no Trabalho",
      tipo: "Obrigatório",
      status: "Ativo",
      participantes: 25,
      dataInicio: "2024-01-15",
      dataFim: "2024-01-30",
      instrutor: "João Silva"
    },
    {
      id: 2,
      titulo: "Primeiros Socorros",
      tipo: "Complementar",
      status: "Agendado",
      participantes: 15,
      dataInicio: "2024-02-01",
      dataFim: "2024-02-03",
      instrutor: "Maria Santos"
    },
    {
      id: 3,
      titulo: "Uso de EPIs",
      tipo: "Obrigatório",
      status: "Concluído",
      participantes: 30,
      dataInicio: "2023-12-01",
      dataFim: "2023-12-15",
      instrutor: "Carlos Oliveira"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800";
      case "Agendado": return "bg-blue-100 text-blue-800";
      case "Concluído": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Obrigatório": return "bg-red-100 text-red-800";
      case "Complementar": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="content-wrapper animate-fade-in bg-green-100/80 rounded-lg shadow-lg p-8">
        {/* Navigation Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Page Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <GraduationCap className="text-white text-3xl" size={40} />
          </div>
          <div>
            <h1 className="page-title mb-0">Cuidados e Treinamentos</h1>
            <p className="text-description">Gestão de treinamentos e cuidados operacionais</p>
          </div>
        </div>


        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">🎓</div>
              <div className="text-2xl font-bold text-gray-700">{treinamentos.length}</div>
              <div className="text-sm text-gray-600 mb-1">Total de Treinamentos</div>
              <div className="text-xs text-gray-500 font-medium">
                Todos os treinamentos
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-700">
                {treinamentos.filter(t => t.status === "Ativo").length}
              </div>
              <div className="text-sm text-gray-600">Ativos</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold text-gray-700">
                {treinamentos.filter(t => t.status === "Agendado").length}
              </div>
              <div className="text-sm text-gray-600">Agendados</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-gray-700">
                {treinamentos.reduce((acc, t) => acc + t.participantes, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Participantes</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Novo Treinamento
          </Button>
          <Button variant="outline">
            <FileText size={16} className="mr-2" />
            Relatórios
          </Button>
          <Button variant="outline">
            <Users size={16} className="mr-2" />
            Participantes
          </Button>
        </div>

        {/* Treinamentos List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Treinamentos</h2>
          
          <div className="grid gap-4">
            {treinamentos.map((treinamento) => (
              <Card key={treinamento.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{treinamento.titulo}</h3>
                        <Badge className={getTipoColor(treinamento.tipo)}>
                          {treinamento.tipo}
                        </Badge>
                        <Badge className={getStatusColor(treinamento.status)}>
                          {treinamento.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Instrutor:</span>
                          <br />
                          {treinamento.instrutor}
                        </div>
                        <div>
                          <span className="font-medium">Participantes:</span>
                          <br />
                          {treinamento.participantes} pessoas
                        </div>
                        <div>
                          <span className="font-medium">Início:</span>
                          <br />
                          {new Date(treinamento.dataInicio).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="font-medium">Fim:</span>
                          <br />
                          {new Date(treinamento.dataFim).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye size={16} className="mr-1" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}