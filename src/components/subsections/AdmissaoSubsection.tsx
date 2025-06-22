
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdmissaoModal } from "../modals/AdmissaoModal";
import { ChevronLeft, UserPlus, Calendar, CheckCircle, Clock, Plus } from "lucide-react";

interface AdmissaoSubsectionProps {
  onBack: () => void;
}

export function AdmissaoSubsection({ onBack }: AdmissaoSubsectionProps) {
  const [showModal, setShowModal] = useState(false);

  const admissoes = [
    { nome: "Ana Silva", cargo: "Analista", data: "2024-06-15", status: "Concluída", avatar: "AS" },
    { nome: "João Santos", cargo: "Desenvolvedor", data: "2024-06-14", status: "Pendente", avatar: "JS" },
    { nome: "Maria Costa", cargo: "Gerente", data: "2024-06-13", status: "Concluída", avatar: "MC" },
    { nome: "Pedro Lima", cargo: "Designer", data: "2024-06-12", status: "Pendente", avatar: "PL" }
  ];

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="secondary-btn"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
              <UserPlus size={24} className="text-white" />
            </div>
            <div>
              <h1 className="page-title mb-0">Admissão de Colaboradores</h1>
              <p className="text-gray-600">Gerencie o processo de contratação</p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="stats-grid animate-slide-up">
          <div className="stat-card">
            <Calendar size={24} className="text-blue-600 mb-2 mx-auto" />
            <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
            <div className="text-sm text-gray-600">Este mês</div>
          </div>
          <div className="stat-card">
            <CheckCircle size={24} className="text-emerald-600 mb-2 mx-auto" />
            <div className="text-2xl font-bold text-emerald-600 mb-1">3</div>
            <div className="text-sm text-gray-600">Esta semana</div>
          </div>
          <div className="stat-card">
            <UserPlus size={24} className="text-purple-600 mb-2 mx-auto" />
            <div className="text-2xl font-bold text-purple-600 mb-1">45</div>
            <div className="text-sm text-gray-600">Total ano</div>
          </div>
          <div className="stat-card">
            <Clock size={24}  className="text-orange-600 mb-2 mx-auto" />
            <div className="text-2xl font-bold text-orange-600 mb-1">2</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
        </div>

        {/* Ação Principal */}
        <div className="text-center mb-8 animate-fade-in">
          <Button 
            onClick={() => setShowModal(true)}
            className="primary-btn text-lg px-8 py-6"
          >
            <Plus size={24} className="mr-3" />
            Nova Admissão
          </Button>
        </div>

        {/* Lista de Admissões */}
        <Card className="modern-card animate-slide-up">
          <CardHeader>
            <CardTitle className="section-title flex items-center gap-2">
              <CheckCircle size={20} className="text-emerald-600" />
              Admissões Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admissoes.map((admissao, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-semibold">
                      {admissao.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{admissao.nome}</div>
                      <div className="text-sm text-gray-600">{admissao.cargo}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">
                      {new Date(admissao.data).toLocaleDateString('pt-BR')}
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                      admissao.status === 'Concluída' 
                        ? 'status-active' 
                        : 'status-warning'
                    }`}>
                      {admissao.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <AdmissaoModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      </div>
    </div>
  );
}
