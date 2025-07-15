
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Building2, MapPin, Clock, Calendar, Users } from "lucide-react";
import { CandidaturaModal } from "@/components/modals/CandidaturaModal";
import { useVagas } from "@/hooks/useVagas";
import { useCandidaturas } from "@/hooks/useCandidaturas";

interface Vaga {
  id: string;
  titulo: string;
  departamento: string;
  cidade: string;
  cargaHoraria: string;
  jornada: string;
  descricao: string;
  requisitos: string;
  salario: string;
  status: "ativa" | "pausada" | "encerrada";
  dataPublicacao: string;
  candidatos: number;
}

interface Candidato {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  curriculo: File | null;
  sobreMim: string;
  experiencias: string;
  vagaId: string;
  dataInscricao: string;
}

const PortalVagas = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [showCandidaturaModal, setShowCandidaturaModal] = useState(false);
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null);
  
  const { vagas: vagasSupabase } = useVagas();
  const { criarCandidatura } = useCandidaturas();

  // Mapear vagas do Supabase para o formato local
  const vagas = vagasSupabase.map(v => ({
    id: v.id,
    titulo: v.titulo,
    departamento: v.departamento,
    cidade: v.cidade,
    cargaHoraria: "40h semanais",
    jornada: v.tipo || "integral",
    descricao: v.descricao || "",
    requisitos: v.requisitos || "",
    salario: v.salario || "",
    status: v.status as "ativa" | "pausada" | "encerrada",
    dataPublicacao: v.created_at ? new Date(v.created_at).toISOString().split('T')[0] : "",
    candidatos: 0
  }));

  const handleSubmitCandidatura = async (dados: any) => {
    if (vagaSelecionada) {
      await criarCandidatura({
        vaga_id: vagaSelecionada.id,
        nome: dados.nome,
        telefone: dados.telefone,
        endereco: dados.endereco,
        email: dados.email,
        curriculo: dados.curriculo,
        sobre_mim: dados.sobreMim,
        experiencias: dados.experiencias,
        status: 'pendente'
      });
    }
  };

  const vagasAtivas = vagas.filter(v => v.status === "ativa");
  const vagasPausadas = vagas.filter(v => v.status === "pausada");

  const cards = [
    {
      id: "vagas",
      title: "Vagas",
      description: "Confira nossas oportunidades disponíveis",
      icon: Target,
      color: "emerald"
    },
    {
      id: "nossa-empresa", 
      title: "Nossa Empresa",
      description: "Conheça mais sobre o Grupo Athos",
      icon: Building2,
      color: "emerald"
    }
  ];

  const getJornadaLabel = (jornada: string) => {
    switch (jornada) {
      case 'integral': return 'Integral';
      case 'meio-periodo': return 'Meio Período';
      case 'flexivel': return 'Flexível';
      case 'home-office': return 'Home Office';
      case 'hibrido': return 'Híbrido';
      default: return jornada;
    }
  };

  const handleCandidatarSe = (vaga: Vaga) => {
    setVagaSelecionada(vaga);
    setShowCandidaturaModal(true);
  };


  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
            <Target size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4 leading-tight">
            Portal de Vagas
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore nossas oportunidades de carreira e faça parte da nossa equipe.
          </p>
        </div>

        {/* Cards */}
        {!activeCard && (
          <div className="content-grid animate-slide-up max-w-4xl mx-auto">
            {cards.map((card) => (
              <Card 
                key={card.id}
                className="modern-card group relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-secondary border-primary/20 hover:border-primary/30"
                onClick={() => setActiveCard(card.id)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <card.icon size={32} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="subsection-title mb-2">{card.title}</h3>
                      <p className="text-description leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Vagas Section */}
        {activeCard === "vagas" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Vagas Disponíveis</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveCard(null)}
              >
                Voltar
              </Button>
            </div>

            {/* Vagas Ativas */}
            <div className="grid grid-cols-1 gap-6 mb-12">
              {vagasAtivas.map((vaga) => (
                <Card key={vaga.id} className="modern-card">
                  <CardHeader className="card-header">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="section-title mb-2">{vaga.titulo}</CardTitle>
                        <p className="text-description">{vaga.departamento}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {vaga.cidade}
                          </div>
                          {vaga.cargaHoraria && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              {vaga.cargaHoraria}
                            </div>
                          )}
                          {vaga.jornada && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {getJornadaLabel(vaga.jornada)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button 
                          className="primary-btn"
                          onClick={() => handleCandidatarSe(vaga)}
                        >
                          Candidatar-se
                        </Button>
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
                      {vaga.salario && (
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-2">Salário</h4>
                          <p className="text-description">{vaga.salario}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Publicada em</h4>
                        <p className="text-description">{new Date(vaga.dataPublicacao).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Vagas Pausadas */}
            {vagasPausadas.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-6">Outras Vagas</h3>
                <div className="grid grid-cols-1 gap-4">
                  {vagasPausadas.map((vaga) => (
                    <Card key={vaga.id} className="modern-card grayscale opacity-60 relative">
                      <div className="absolute inset-0 bg-slate-100/80 flex items-center justify-center z-10 rounded-lg">
                        <div className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium">
                          Vaga Temporariamente Fechada
                        </div>
                      </div>
                      <CardContent className="card-content p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-1">{vaga.titulo}</h4>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                {vaga.cidade}
                              </div>
                              <span>{vaga.departamento}</span>
                            </div>
                          </div>
                          <div className="text-sm text-slate-500">
                            {vaga.salario}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {vagasAtivas.length === 0 && vagasPausadas.length === 0 && (
              <div className="text-center py-16">
                <Target size={64} className="text-slate-400 mx-auto mb-4" />
                <p className="text-lg text-slate-600">Nenhuma vaga disponível no momento.</p>
                <p className="text-slate-500">Volte em breve para conferir novas oportunidades!</p>
              </div>
            )}
          </div>
        )}

        {/* Nossa Empresa Section */}
        {activeCard === "nossa-empresa" && (
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Nossa Empresa</h2>
            <p className="text-slate-600 text-lg mb-8">
              Informações sobre nossa empresa serão adicionadas em breve.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setActiveCard(null)}
            >
              Voltar
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modal de Candidatura */}
      {vagaSelecionada && (
        <CandidaturaModal
          isOpen={showCandidaturaModal}
          onClose={() => {
            setShowCandidaturaModal(false);
            setVagaSelecionada(null);
          }}
          vaga={vagaSelecionada}
          onSubmit={handleSubmitCandidatura}
        />
      )}
    </div>
  );
};

export default PortalVagas;
