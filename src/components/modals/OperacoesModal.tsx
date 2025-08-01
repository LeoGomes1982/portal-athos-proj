import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Clock, Shield, MapPin, User, X, TrendingUp, Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import { GestaoServicosExtras } from "@/pages/GestaoServicosExtras";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface OperacoesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type SelectedPage = 'gestao-servicos-extras' | 'fiscalizacoes' | 'escolha-fiscalizacao' | 'resumos' | null;

export function OperacoesModal({ isOpen, onOpenChange }: OperacoesModalProps) {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState<SelectedPage>('resumos');
  const [statsData, setStatsData] = useState({
    totalServicosExtras: 0,
    totalFiscalizacoes: 0,
    servicosEstesMes: 0,
    fiscalizacoesEstesMes: 0
  });

  // Carregar estatísticas quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    try {
      // Carregar serviços extras
      const { data: servicosData, error: servicosError } = await supabase
        .from('servicos_extras')
        .select('*');

      // Carregar fiscalizações
      const { data: fiscalizacoesData, error: fiscalizacoesError } = await supabase
        .from('fiscalizacoes')
        .select('*');

      if (!servicosError && servicosData) {
        const hoje = new Date();
        const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        
        const servicosEstesMes = servicosData.filter(servico => {
          const dataServico = new Date(servico.data_servico);
          return dataServico >= primeiroDiaDoMes;
        }).length;

        setStatsData(prev => ({
          ...prev,
          totalServicosExtras: servicosData.length,
          servicosEstesMes
        }));
      }

      if (!fiscalizacoesError && fiscalizacoesData) {
        const hoje = new Date();
        const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        
        const fiscalizacoesEstesMes = fiscalizacoesData.filter(fiscalizacao => {
          const dataFiscalizacao = new Date(fiscalizacao.data_fiscalizacao);
          return dataFiscalizacao >= primeiroDiaDoMes;
        }).length;

        setStatsData(prev => ({
          ...prev,
          totalFiscalizacoes: fiscalizacoesData.length,
          fiscalizacoesEstesMes
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const operacoes = [
    {
      id: "gestao-servicos-extras" as const,
      title: "Gestão de Serviços Extras",
      description: "Controle de serviços extras, valores e relatórios",
      icon: Clock,
    },
    {
      id: "escolha-fiscalizacao" as const, 
      title: "Fiscalizações",
      description: "Fiscalização de postos e colaboradores",
      icon: Shield,
    }
  ];

  const handlePageSelect = (pageId: SelectedPage) => {
    setSelectedPage(pageId);
  };

  const handleClose = () => {
    setSelectedPage('resumos');
    onOpenChange(false);
  };

  const handleBackToMenu = () => {
    setSelectedPage('resumos');
  };

  // Modal de escolha de tipo de fiscalização
  if (selectedPage === 'escolha-fiscalizacao') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl w-[90vw] p-0">
          <div className="bg-white rounded-lg p-8 relative">
            {/* Botão fechar */}
            <button
              onClick={handleBackToMenu}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            {/* Título */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Nova Fiscalização</h2>
              <p className="text-gray-600">Como você gostaria de realizar esta fiscalização?</p>
            </div>

            {/* Opções */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fiscalização de Posto de Serviço */}
              <div
                className="bg-gray-50 rounded-lg p-8 cursor-pointer hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-blue-200"
                onClick={() => {
                  handleClose();
                  navigate('/operacoes/fiscalizacoes', { state: { tipo: 'posto_servico' } });
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Fiscalização de Posto de Serviço
                  </h3>
                  <p className="text-sm text-gray-600">
                    Preencher a fiscalização diretamente nesta tela
                  </p>
                </div>
              </div>

              {/* Fiscalização de Colaborador */}
              <div
                className="bg-gray-50 rounded-lg p-8 cursor-pointer hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-blue-200"
                onClick={() => {
                  handleClose();
                  navigate('/operacoes/fiscalizacoes', { state: { tipo: 'colaborador' } });
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Fiscalização de Colaborador
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gerar link para compartilhar via WhatsApp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Se Gestão de Serviços Extras foi selecionada
  if (selectedPage === 'gestao-servicos-extras') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0">
          <div className="h-full overflow-auto">
            <GestaoServicosExtras />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Página de resumos (página inicial)
  if (selectedPage === 'resumos') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl w-[95vw] p-0">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[600px] p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Portal de Operações</h1>
                <p className="text-gray-600">Resumo das atividades operacionais</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Serviços Extras</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.totalServicosExtras}</div>
                  <p className="text-xs text-muted-foreground">
                    Todos os serviços registrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Fiscalizações</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.totalFiscalizacoes}</div>
                  <p className="text-xs text-muted-foreground">
                    Todas as fiscalizações realizadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Serviços Este Mês</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.servicosEstesMes}</div>
                  <p className="text-xs text-muted-foreground">
                    Registrados neste mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fiscalizações Este Mês</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.fiscalizacoesEstesMes}</div>
                  <p className="text-xs text-muted-foreground">
                    Realizadas neste mês
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Cards das operações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
              {operacoes.map((operacao) => {
                const IconComponent = operacao.icon;
                return (
                  <div
                    key={operacao.id}
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                    onClick={() => handlePageSelect(operacao.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {operacao.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {operacao.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                © 2024 Grupo Athos. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}