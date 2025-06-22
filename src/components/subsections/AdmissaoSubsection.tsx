
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdmissaoModal } from "../modals/AdmissaoModal";
import { ChevronLeft, UserPlus, Calendar, CheckCircle, Clock } from "lucide-react";

interface AdmissaoSubsectionProps {
  onBack: () => void;
}

export function AdmissaoSubsection({ onBack }: AdmissaoSubsectionProps) {
  const [showModal, setShowModal] = useState(false);

  const admissoes = [
    { nome: "Ana Silva", cargo: "Analista", data: "2024-06-15", status: "Concluída", avatar: "👩‍💼" },
    { nome: "João Santos", cargo: "Desenvolvedor", data: "2024-06-14", status: "Pendente", avatar: "👨‍💻" },
    { nome: "Maria Costa", cargo: "Gerente", data: "2024-06-13", status: "Concluída", avatar: "👩‍💼" },
    { nome: "Pedro Lima", cargo: "Designer", data: "2024-06-12", status: "Pendente", avatar: "👨‍🎨" }
  ];

  return (
    <div className="system-page">
      <div className="system-container">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="glass-button"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <UserPlus size={20} className="text-white" />
            </div>
            <h1 className="system-title">Admissão de Colaboradores</h1>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <div className="stat-card stat-card-blue">
            <Calendar size={20} className="text-blue-600 mb-2" />
            <div className="text-2xl font-bold mb-1">12</div>
            <div className="text-sm">Este mês</div>
          </div>
          <div className="stat-card stat-card-emerald">
            <CheckCircle size={20} className="text-emerald-600 mb-2" />
            <div className="text-2xl font-bold mb-1">3</div>
            <div className="text-sm">Esta semana</div>
          </div>
          <div className="stat-card stat-card-purple">
            <UserPlus size={20} className="text-purple-600 mb-2" />
            <div className="text-2xl font-bold mb-1">45</div>
            <div className="text-sm">Total ano</div>
          </div>
          <div className="stat-card stat-card-orange">
            <Clock size={20} className="text-orange-600 mb-2" />
            <div className="text-2xl font-bold mb-1">2</div>
            <div className="text-sm">Pendentes</div>
          </div>
        </div>

        {/* Botão de ação principal */}
        <div className="text-center mb-8 animate-slide-up">
          <Button 
            onClick={() => setShowModal(true)}
            className="action-button action-button-blue text-lg px-8 py-6"
          >
            <UserPlus size={24} className="mr-3" />
            Nova Admissão
          </Button>
        </div>

        {/* Lista de admissões */}
        <Card className="glass-card animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-600" />
              Admissões Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admissoes.map((admissao, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-200/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-2xl">
                      {admissao.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{admissao.nome}</div>
                      <div className="text-sm text-slate-500">{admissao.cargo}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600 mb-1">{admissao.data}</div>
                    <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                      admissao.status === 'Concluída' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
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
