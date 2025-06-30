
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, Users, Plus } from "lucide-react";
import { NovaVagaModal } from "@/components/modals/NovaVagaModal";

interface VagasTalentosSubsectionProps {
  onBack: () => void;
}

interface Vaga {
  id: string;
  titulo: string;
  departamento: string;
  descricao: string;
  requisitos: string;
  salario: string;
  status: "ativa" | "pausada" | "encerrada";
  dataPublicacao: string;
  candidatos: number;
}

export function VagasTalentosSubsection({ onBack }: VagasTalentosSubsectionProps) {
  const [showNovaVagaModal, setShowNovaVagaModal] = useState(false);
  const [vagas, setVagas] = useState<Vaga[]>([
    {
      id: "1",
      titulo: "Desenvolvedor Frontend",
      departamento: "Tecnologia",
      descricao: "Desenvolvimento de interfaces web",
      requisitos: "React, TypeScript, CSS",
      salario: "R$ 5.000 - R$ 7.000",
      status: "ativa",
      dataPublicacao: "2024-01-15",
      candidatos: 8
    },
    {
      id: "2", 
      titulo: "Analista de Marketing",
      departamento: "Marketing",
      descricao: "Gestão de campanhas digitais",
      requisitos: "Marketing Digital, Google Ads",
      salario: "R$ 3.500 - R$ 5.000",
      status: "ativa",
      dataPublicacao: "2024-01-10",
      candidatos: 12
    }
  ]);

  const vagasAtivas = vagas.filter(v => v.status === "ativa").length;
  const totalCandidatos = vagas.reduce((sum, vaga) => sum + vaga.candidatos, 0);

  const handleNovaVaga = (dadosVaga: Omit<Vaga, "id" | "candidatos" | "dataPublicacao">) => {
    const novaVaga: Vaga = {
      ...dadosVaga,
      id: Date.now().toString(),
      candidatos: 0,
      dataPublicacao: new Date().toISOString().split('T')[0]
    };
    setVagas([...vagas, novaVaga]);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={onBack}>
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
            <Briefcase size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">Vagas e Talentos</h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Gestão completa de vagas e processos seletivos
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Briefcase size={20} className="text-emerald-600" />
                Vagas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-emerald-700 mb-2">{vagasAtivas}</div>
              <p className="text-emerald-600">vagas disponíveis</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Users size={20} className="text-blue-600" />
                Candidatos Inscritos
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-blue-700 mb-2">{totalCandidatos}</div>
              <p className="text-blue-600">candidatos totais</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <Button 
            className="primary-btn flex items-center gap-2"
            onClick={() => setShowNovaVagaModal(true)}
          >
            <Plus size={20} />
            Criar Nova Vaga
          </Button>
        </div>

        {/* Vagas List */}
        <div className="grid grid-cols-1 gap-6 animate-slide-up">
          {vagas.map((vaga) => (
            <Card key={vaga.id} className="modern-card">
              <CardHeader className="card-header">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="section-title mb-2">{vaga.titulo}</CardTitle>
                    <p className="text-description">{vaga.departamento}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vaga.status === 'ativa' ? 'bg-green-100 text-green-700' :
                      vaga.status === 'pausada' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {vaga.status.charAt(0).toUpperCase() + vaga.status.slice(1)}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Users size={16} />
                      {vaga.candidatos} candidatos
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Descrição</h4>
                    <p className="text-description">{vaga.descricao}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Requisitos</h4>
                    <p className="text-description">{vaga.requisitos}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Salário</h4>
                    <p className="text-description">{vaga.salario}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Publicada em</h4>
                    <p className="text-description">{new Date(vaga.dataPublicacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      <NovaVagaModal
        isOpen={showNovaVagaModal}
        onClose={() => setShowNovaVagaModal(false)}
        onSubmit={handleNovaVaga}
      />
    </div>
  );
}
