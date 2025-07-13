import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shirt, Package, Settings, TrendingUp, Users, User } from "lucide-react";
import { GerenciarUniformesModal } from "@/components/modals/GerenciarUniformesModal";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { DetalhesEquipamentosFuncionarioModal } from "@/components/modals/DetalhesEquipamentosFuncionarioModal";
import { FuncionarioDetalhesModal } from "@/components/modals/FuncionarioDetalhesModal";
import { funcionariosIniciais } from "@/data/funcionarios";
import { Funcionario } from "@/types/funcionario";

interface UniformesSubsectionProps {
  onBack: () => void;
}

interface EstoqueItem {
  id: string;
  nome: string;
  categoria: "uniforme" | "epi";
  quantidade: number;
  tamanhos: { [tamanho: string]: number };
  valorCompra?: number;
}

interface EntregaRegistro {
  id: string;
  funcionarioId: number;
  funcionarioNome: string;
  item: string;
  categoria: "uniforme" | "epi";
  tamanho: string;
  quantidade: number;
  dataEntrega: string;
}

export function UniformesSubsection({ onBack }: UniformesSubsectionProps) {
  const [showGerenciarModal, setShowGerenciarModal] = useState(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [showFuncionarioModal, setShowFuncionarioModal] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<{ id: number; nome: string } | null>(null);
  const [funcionarioDetalhes, setFuncionarioDetalhes] = useState<Funcionario | null>(null);
  
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);

  const [entregas, setEntregas] = useState<EntregaRegistro[]>([]);

  const totalUniformes = estoque.filter(item => item.categoria === "uniforme").reduce((sum, item) => sum + item.quantidade, 0);
  const totalEPIs = estoque.filter(item => item.categoria === "epi").reduce((sum, item) => sum + item.quantidade, 0);
  const totalEntregas = entregas.length;
  const valorTotalEstoque = estoque.reduce((sum, item) => sum + (item.valorCompra || 0), 0);

  // Função para contar total de registros por funcionário
  const getContadoresPorFuncionario = () => {
    const contadores: { [funcionarioId: number]: { total: number; nome: string; ultimaEntrega: EntregaRegistro } } = {};
    
    entregas.forEach((entrega) => {
      if (!contadores[entrega.funcionarioId]) {
        contadores[entrega.funcionarioId] = { total: 0, nome: entrega.funcionarioNome, ultimaEntrega: entrega };
      }
      contadores[entrega.funcionarioId].total += 1; // Conta o registro, não a quantidade
      
      // Atualizar última entrega se for mais recente
      if (new Date(entrega.dataEntrega) > new Date(contadores[entrega.funcionarioId].ultimaEntrega.dataEntrega)) {
        contadores[entrega.funcionarioId].ultimaEntrega = entrega;
      }
    });
    
    return contadores;
  };

  const contadoresFuncionarios = getContadoresPorFuncionario();

  const [compras, setCompras] = useState<Array<{ id: string; item: string; valor: number; data: string; quantidade: number }>>([]);

  const totalValorCompras = compras.reduce((sum, compra) => sum + compra.valor, 0);

  const handleEntradaEstoque = (dados: { item: string; categoria: "uniforme" | "epi"; tamanhos: { [tamanho: string]: number }; valor?: number }) => {
    setEstoque(prev => {
      const itemExistente = prev.find(item => item.nome === dados.item);
      
      if (itemExistente) {
        return prev.map(item => {
          if (item.nome === dados.item) {
            const novosTamanhos = { ...item.tamanhos };
            Object.keys(dados.tamanhos).forEach(tamanho => {
              novosTamanhos[tamanho] = (novosTamanhos[tamanho] || 0) + dados.tamanhos[tamanho];
            });
            const novaQuantidade = Object.values(novosTamanhos).reduce((sum, qty) => sum + qty, 0);
            return { ...item, tamanhos: novosTamanhos, quantidade: novaQuantidade };
          }
          return item;
        });
      } else {
        const novaQuantidade = Object.values(dados.tamanhos).reduce((sum, qty) => sum + qty, 0);
        return [...prev, {
          id: Date.now().toString(),
          nome: dados.item,
          categoria: dados.categoria,
          quantidade: novaQuantidade,
          tamanhos: dados.tamanhos,
          valorCompra: dados.valor
        }];
      }
    });

    // Registrar compra se valor foi informado
    if (dados.valor && dados.valor > 0) {
      const totalQuantidade = Object.values(dados.tamanhos).reduce((sum, qty) => sum + qty, 0);
      const novaCompra = {
        id: Date.now().toString(),
        item: dados.item,
        valor: dados.valor,
        data: new Date().toISOString().split('T')[0],
        quantidade: totalQuantidade
      };
      setCompras(prev => [novaCompra, ...prev]);
    }
  };

  const handleEntregaUniforme = (dados: { funcionarioId: number; funcionarioNome: string; item: string; categoria: "uniforme" | "epi"; tamanho: string; quantidade: number }) => {
    // Registrar entrega
    const novaEntrega: EntregaRegistro = {
      id: Date.now().toString(),
      ...dados,
      dataEntrega: new Date().toISOString().split('T')[0]
    };
    setEntregas(prev => [...prev, novaEntrega]);

    // Atualizar estoque
    setEstoque(prev => prev.map(item => {
      if (item.nome === dados.item) {
        const novosTamanhos = { ...item.tamanhos };
        novosTamanhos[dados.tamanho] = Math.max(0, (novosTamanhos[dados.tamanho] || 0) - dados.quantidade);
        const novaQuantidade = Object.values(novosTamanhos).reduce((sum, qty) => sum + qty, 0);
        return { ...item, tamanhos: novosTamanhos, quantidade: novaQuantidade };
      }
      return item;
    }));
  };

  const getItemIcon = (item: string) => {
    const icons: { [key: string]: string } = {
      "Camisa": "👔",
      "Camiseta": "👕", 
      "Calça": "👖",
      "Jaqueta": "🧥",
      "Sapato": "👞",
      "Fone de ouvido": "🎧",
      "Luvas": "🧤",
      "Botina": "🥾"
    };
    return icons[item] || "📦";
  };

  const handleFuncionarioClick = (funcionarioId: number) => {
    // Carregar dados do funcionário
    const savedFuncionarios = localStorage.getItem('funcionarios_list');
    const funcionariosList = savedFuncionarios ? JSON.parse(savedFuncionarios) : funcionariosIniciais;
    const funcionario = funcionariosList.find((f: Funcionario) => f.id === funcionarioId);
    
    if (funcionario) {
      setFuncionarioDetalhes(funcionario);
      setShowFuncionarioModal(true);
    }
  };

  const handleStatusChange = (funcionarioId: number, novoStatus: Funcionario['status'], dataFim?: string) => {
    // Implementar mudança de status se necessário
    console.log('Status change:', funcionarioId, novoStatus, dataFim);
  };

  const handleFuncionarioUpdate = (funcionario: Funcionario) => {
    // Implementar atualização do funcionário se necessário
    console.log('Funcionario update:', funcionario);
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
            <Shirt size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">Uniformes e EPIs</h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Controle de estoque e entrega de uniformes e equipamentos de proteção individual
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">👔</div>
              <div className="text-2xl font-bold text-blue-600">
                {totalUniformes}
              </div>
              <div className="text-sm text-blue-600/80 mb-1">Total Uniformes</div>
              <div className="text-xs text-blue-500 font-medium">
                Valor: R$ {estoque.filter(item => item.categoria === "uniforme").reduce((sum, item) => sum + (item.valorCompra || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">🛡️</div>
              <div className="text-2xl font-bold text-orange-600">
                {totalEPIs}
              </div>
              <div className="text-sm text-orange-600/80 mb-1">Total EPIs</div>
              <div className="text-xs text-orange-500 font-medium">
                Valor: R$ {estoque.filter(item => item.categoria === "epi").reduce((sum, item) => sum + (item.valorCompra || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-2xl font-bold text-green-600">
                {totalEntregas}
              </div>
              <div className="text-sm text-green-600/80">Entregas Realizadas</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-purple-600">
                R$ {totalValorCompras.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-purple-600/80">Valor das Compras</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <Button 
            className="primary-btn flex items-center gap-2"
            onClick={() => setShowGerenciarModal(true)}
          >
            <Settings size={20} />
            Gerenciar Uniformes e EPIs
          </Button>
        </div>

        {/* Estoque Atual */}
        <div className="mb-8 animate-slide-up">
          <h2 className="section-title mb-4 text-center">📦 Estoque Atual</h2>
          <div className="relative px-12">
            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {estoque.map((item) => (
                  <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="modern-card">
                      <CardContent className="card-content p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{getItemIcon(item.nome)}</span>
                          <div>
                            <h3 className="font-semibold text-slate-800">{item.nome}</h3>
                            <p className="text-sm text-slate-600 capitalize">{item.categoria}</p>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-primary mb-2">
                          Total: {item.quantidade} peças
                        </div>
                        <div className="text-xs text-slate-600">
                          <strong>Tamanhos:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(item.tamanhos).map(([tamanho, qty]) => (
                              <span key={tamanho} className="bg-slate-100 px-2 py-1 rounded">
                                {tamanho}: {qty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>



        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modals */}
      <GerenciarUniformesModal
        isOpen={showGerenciarModal}
        onClose={() => setShowGerenciarModal(false)}
        onEntradaEstoque={handleEntradaEstoque}
        onEntregaUniforme={handleEntregaUniforme}
        estoque={estoque}
      />

      <DetalhesEquipamentosFuncionarioModal
        isOpen={showDetalhesModal}
        onClose={() => setShowDetalhesModal(false)}
        funcionarioId={funcionarioSelecionado?.id || null}
        funcionarioNome={funcionarioSelecionado?.nome || ""}
        entregas={entregas}
      />

      {funcionarioDetalhes && (
        <FuncionarioDetalhesModal
          funcionario={funcionarioDetalhes}
          isOpen={showFuncionarioModal}
          onClose={() => setShowFuncionarioModal(false)}
          onStatusChange={handleStatusChange}
          onFuncionarioUpdate={handleFuncionarioUpdate}
        />
      )}
    </div>
  );
}