
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
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Nossa Empresa</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveCard(null)}
              >
                Voltar
              </Button>
            </div>

            {/* Historia da Empresa */}
            <div className="max-w-4xl mx-auto mb-16">
              <Card className="modern-card p-8">
                <CardContent className="p-0">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl mb-4 shadow-lg">
                      <Building2 size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Bem-vindo(a) ao Grupo Athos!</h3>
                  </div>
                  
                  <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-6">
                    <p>
                      Somos uma empresa sólida e em constante crescimento, fundada em 2014 na vibrante cidade de Pelotas, Rio Grande do Sul. 
                      Desde a nossa origem, nos dedicamos a oferecer serviços de excelência, com um propósito claro e inspirador: 
                      <strong className="text-primary"> proporcionar Tranquilidade, Segurança e Bem-estar às Pessoas</strong>.
                    </p>
                    
                    <p>
                      Com uma equipe de mais de <strong>250 colaboradores dedicados</strong>, o Grupo Athos expandiu sua atuação para além das fronteiras gaúchas, 
                      marcando presença em quatro estados estratégicos do Brasil: <strong>Amapá, Minas Gerais, São Paulo e Rio Grande do Sul</strong>. 
                      Essa capilaridade reflete nossa capacidade de adaptação e o compromisso em levar soluções de alta qualidade para diversas regiões do país.
                    </p>
                    
                    <p>
                      Nossa especialidade reside na prestação de serviços essenciais, abrangendo áreas como <strong>segurança patrimonial, 
                      limpeza e conservação, zeladoria e mão de obra especializada</strong>. Acreditamos que, ao cuidar desses pilares, 
                      contribuímos diretamente para ambientes mais seguros, produtivos e harmoniosos, tanto para empresas quanto para condomínios e residências.
                    </p>
                    
                    <p>
                      No Grupo Athos, valorizamos cada membro da nossa equipe. Entendemos que o sucesso da empresa é construído pelo talento e dedicação de cada um. 
                      Por isso, investimos no desenvolvimento profissional, oferecendo um ambiente de trabalho colaborativo, desafiador e com oportunidades reais de crescimento.
                    </p>
                    
                    <p className="text-primary font-semibold text-xl text-center mt-8">
                      Se você busca uma empresa que preza pela ética, inovação e pelo impacto positivo na vida das pessoas, o Grupo Athos é o seu lugar. 
                      Convidamos você a fazer parte da nossa história e a construir um futuro de sucesso conosco.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Galeria de Fotos */}
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">Nossos Clientes e Equipe</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Casa Una UDI */}
                <Card className="modern-card overflow-hidden group hover:scale-105 transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src="/lovable-uploads/122b4a64-af3b-4aaa-b637-668e7543a443.png" 
                      alt="Casa Una UDI Uberlândia MG" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg">Casa Una UDI</h4>
                      <p className="text-sm opacity-90">Uberlândia MG</p>
                    </div>
                  </div>
                </Card>

                {/* Fernanda Recepcionista */}
                <Card className="modern-card overflow-hidden group hover:scale-105 transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src="/lovable-uploads/481f6873-4c88-4fcc-a019-f16a9c2036ab.png" 
                      alt="Fernanda - Recepcionista Pelotas RS" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg">Fernanda</h4>
                      <p className="text-sm opacity-90">Recepcionista - Pelotas RS</p>
                    </div>
                  </div>
                </Card>

                {/* Palácio das Águas */}
                <Card className="modern-card overflow-hidden group hover:scale-105 transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src="/lovable-uploads/67c146f4-7915-45c6-9d1c-d73d5cea85ab.png" 
                      alt="Palácio das Águas Macapá AP" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg">Palácio das Águas</h4>
                      <p className="text-sm opacity-90">Macapá AP</p>
                    </div>
                  </div>
                </Card>

                {/* Simone e Leandro */}
                <Card className="modern-card overflow-hidden group hover:scale-105 transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src="/lovable-uploads/5b1521c4-ce98-4ab1-8059-da5dd897c0f3.png" 
                      alt="Simone Macedo e Leandro Gomes - Pelotas RS" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg">Simone & Leandro</h4>
                      <p className="text-sm opacity-90">Equipe Pelotas RS</p>
                    </div>
                  </div>
                </Card>

                {/* Vinícius e Leandro */}
                <Card className="modern-card overflow-hidden group hover:scale-105 transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src="/lovable-uploads/a397941b-df94-4c8d-849c-0605727d2895.png" 
                      alt="Vinícius Costa e Leandro Gomes - Uberlândia MG" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg">Vinícius & Leandro</h4>
                      <p className="text-sm opacity-90">Equipe Uberlândia MG</p>
                    </div>
                  </div>
                </Card>

                {/* David Macedo */}
                <Card className="modern-card overflow-hidden group hover:scale-105 transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src="/lovable-uploads/01aa7ab3-9379-43d8-b1a4-4ea9992364a1.png" 
                      alt="David Macedo - 9 anos de empresa" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg">David Macedo</h4>
                      <p className="text-sm opacity-90">9 anos de empresa</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Chimarrão Gaúcho - Destaque Cultural */}
              <div className="mt-12 text-center">
                <Card className="modern-card max-w-md mx-auto overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src="/lovable-uploads/bcebfaca-0b79-4e27-9a88-f696412adb1a.png" 
                      alt="Chimarrão gaúcho - Pelotas RS" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg">Tradição Gaúcha</h4>
                      <p className="text-sm opacity-90">Chimarrão - Pelotas RS</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-600">
                      Valorizamos nossas raízes e tradições, mantendo viva a cultura gaúcha em todos os nossos escritórios.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
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
