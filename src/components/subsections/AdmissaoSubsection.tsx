
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
      <div className="content-wrapper animate-fade-in">
        {/* Back Button */}
        <button onClick={onBack} className="back-button">
          <ChevronLeft size={16} />
          Voltar
        </button>

        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-icon bg-emerald-600">
            <UserPlus size={24} />
          </div>
          <div>
            <h1 className="page-title mb-0">Admissão de Colaboradores</h1>
            <p className="text-description">Gerencie o processo de contratação</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="stats-grid animate-slide-up">
          <div className="stat-card">
            <Calendar size={24} className="text-blue-600 mb-3 mx-auto" />
            <div className="stat-value text-blue-600">12</div>
            <div className="stat-label">Este mês</div>
          </div>
          <div className="stat-card">
            <CheckCircle size={24} className="text-emerald-600 mb-3 mx-auto" />
            <div className="stat-value text-emerald-600">3</div>
            <div className="stat-label">Esta semana</div>
          </div>
          <div className="stat-card">
            <UserPlus size={24} className="text-purple-600 mb-3 mx-auto" />
            <div className="stat-value text-purple-600">45</div>
            <div className="stat-label">Total ano</div>
          </div>
          <div className="stat-card">
            <Clock size={24} className="text-orange-600 mb-3 mx-auto" />
            <div className="stat-value text-orange-600">2</div>
            <div className="stat-label">Pendentes</div>
          </div>
        </div>

        {/* Ação Principal */}
        <div className="text-center mb-8 animate-fade-in">
          <button 
            onClick={() => setShowModal(true)}
            className="success-btn text-base px-8 py-4 h-auto"
          >
            <Plus size={20} className="mr-2" />
            Nova Admissão
          </button>
        </div>

        {/* Lista de Admissões */}
        <Card className="modern-card animate-slide-up">
          <CardHeader className="card-header">
            <CardTitle className="section-title flex items-center gap-2 mb-0">
              <CheckCircle size={20} className="text-emerald-600" />
              Admissões Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="card-content">
            <div className="space-y-3">
              {admissoes.map((admissao, index) => (
                <div key={index} className="list-item">
                  <div className="list-item-content">
                    <div className="list-item-avatar bg-emerald-100 text-emerald-700">
                      {admissao.avatar}
                    </div>
                    <div className="list-item-info">
                      <h4>{admissao.nome}</h4>
                      <p>{admissao.cargo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600 mb-2">
                      {new Date(admissao.data).toLocaleDateString('pt-BR')}
                    </div>
                    <div className={`status-badge ${
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
