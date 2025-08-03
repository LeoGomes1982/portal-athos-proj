import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, AlertTriangle, Plus, User, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SancoesDisciplinaresSubsectionProps {
  onBack: () => void;
}

interface Sancao {
  id: string;
  funcionarioId: number;
  funcionarioNome: string;
  tipo: "advertencia" | "suspensao" | "demissao";
  motivo: string;
  descricao: string;
  dataOcorrencia: string;
  dataRegistro: string;
  responsavel: string;
  status: "ativa" | "cumprida" | "cancelada";
}

const tipoSancaoConfig = {
  advertencia: { label: "Advertência", color: "bg-yellow-500", bgColor: "bg-yellow-50" },
  suspensao: { label: "Suspensão", color: "bg-orange-500", bgColor: "bg-orange-50" },
  demissao: { label: "Demissão", color: "bg-red-500", bgColor: "bg-red-50" }
};

const statusConfig = {
  ativa: { label: "Ativa", color: "bg-red-500" },
  cumprida: { label: "Cumprida", color: "bg-gray-500" },
  cancelada: { label: "Cancelada", color: "bg-blue-500" }
};

export function SancoesDisciplinaresSubsection({ onBack }: SancoesDisciplinaresSubsectionProps) {
  const [sancoes] = useState<Sancao[]>([
    {
      id: "1",
      funcionarioId: 1,
      funcionarioNome: "João Silva",
      tipo: "advertencia",
      motivo: "Atraso recorrente",
      descricao: "Funcionário apresentou atrasos frequentes no último mês",
      dataOcorrencia: "2024-01-15",
      dataRegistro: "2024-01-15",
      responsavel: "Recursos Humanos",
      status: "ativa"
    }
  ]);

  const [showNovoSancaoForm, setShowNovoSancaoForm] = useState(false);

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
          
          <Button 
            onClick={() => setShowNovoSancaoForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Nova Sanção
          </Button>
        </div>

        {/* Page Header */}
        <div className="page-header-centered mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <AlertTriangle className="text-white text-3xl" size={40} />
          </div>
          <div>
            <h1 className="page-title mb-0">Sanções Disciplinares</h1>
            <p className="text-description">Gestão de advertências, suspensões e sanções</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-700 text-sm font-medium">Advertências</p>
                  <p className="text-2xl font-bold text-yellow-800">1</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700 text-sm font-medium">Suspensões</p>
                  <p className="text-2xl font-bold text-orange-800">0</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-700 text-sm font-medium">Demissões</p>
                  <p className="text-2xl font-bold text-red-800">0</p>
                </div>
                <User className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-sm font-medium">Total Ativo</p>
                  <p className="text-2xl font-bold text-gray-800">1</p>
                </div>
                <FileText className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sanções List */}
        <div className="space-y-4">
          {sancoes.map((sancao) => (
            <Card key={sancao.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`${tipoSancaoConfig[sancao.tipo].color} text-white`}>
                        {tipoSancaoConfig[sancao.tipo].label}
                      </Badge>
                      <Badge className={`${statusConfig[sancao.status].color} text-white`}>
                        {statusConfig[sancao.status].label}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{sancao.funcionarioNome}</h3>
                    <p className="text-gray-600 mb-2"><strong>Motivo:</strong> {sancao.motivo}</p>
                    <p className="text-gray-600 mb-3">{sancao.descricao}</p>
                    
                    <div className="flex gap-6 text-sm text-gray-500">
                      <span><strong>Data:</strong> {new Date(sancao.dataOcorrencia).toLocaleDateString('pt-BR')}</span>
                      <span><strong>Responsável:</strong> {sancao.responsavel}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sancoes.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma sanção disciplinar registrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}