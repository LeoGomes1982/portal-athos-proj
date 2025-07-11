import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shirt, Package, Settings, TrendingUp, Users } from "lucide-react";
import { GerenciarUniformesModal } from "@/components/modals/GerenciarUniformesModal";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { DetalhesEquipamentosFuncionarioModal } from "@/components/modals/DetalhesEquipamentosFuncionarioModal";

interface UniformesSubsectionProps {
  onBack: () => void;
}

interface EstoqueItem {
  id: string;
  nome: string;
  categoria: "uniforme" | "epi";
  quantidade: number;
  tamanhos: { [tamanho: string]: number };
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
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<{ id: number; nome: string } | null>(null);
  
  const [estoque, setEstoque] = useState<EstoqueItem[]>([
    {
      id: "1",
      nome: "Camisa",
      categoria: "uniforme",
      quantidade: 50,
      tamanhos: { "P": 10, "M": 15, "G": 15, "GG": 10 }
    },
    {
      id: "2", 
      nome: "Camiseta",
      categoria: "uniforme",
      quantidade: 30,
      tamanhos: { "P": 8, "M": 10, "G": 8, "GG": 4 }
    },
    {
      id: "3",
      nome: "Calça",
      categoria: "uniforme", 
      quantidade: 25,
      tamanhos: { "P": 5, "M": 8, "G": 8, "GG": 4 }
    },
    {
      id: "4",
      nome: "Jaqueta",
      categoria: "uniforme",
      quantidade: 20,
      tamanhos: { "P": 4, "M": 6, "G": 6, "GG": 4 }
    },
    {
      id: "5",
      nome: "Sapato",
      categoria: "uniforme",
      quantidade: 15,
      tamanhos: { "38": 3, "40": 4, "42": 4, "44": 4 }
    },
    {
      id: "6",
      nome: "Fone de ouvido",
      categoria: "epi",
      quantidade: 12,
      tamanhos: { "Único": 12 }
    },
    {
      id: "7",
      nome: "Luvas",
      categoria: "epi",
      quantidade: 25,
      tamanhos: { "P": 8, "M": 10, "G": 7 }
    },
    {
      id: "8",
      nome: "Botina",
      categoria: "epi",
      quantidade: 18,
      tamanhos: { "38": 4, "40": 5, "42": 5, "44": 4 }
    }
  ]);

  const [entregas, setEntregas] = useState<EntregaRegistro[]>([
    {
      id: "1",
      funcionarioId: 1,
      funcionarioNome: "Ana Silva",
      item: "Camisa",
      categoria: "uniforme",
      tamanho: "M",
      quantidade: 2,
      dataEntrega: "2024-01-15"
    },
    {
      id: "2",
      funcionarioId: 2,
      funcionarioNome: "João Santos",
      item: "Fone de ouvido",
      categoria: "epi",
      tamanho: "Único",
      quantidade: 1,
      dataEntrega: "2024-01-10"
    }
  ]);

  const totalUniformes = estoque.filter(item => item.categoria === "uniforme").reduce((sum, item) => sum + item.quantidade, 0);
  const totalEPIs = estoque.filter(item => item.categoria === "epi").reduce((sum, item) => sum + item.quantidade, 0);
  const totalEntregas = entregas.length;

  // Função para contar entregas por funcionário e categoria
  const getContadoresPorFuncionario = () => {
    const contadores: { [funcionarioId: number]: { uniforme: number; epi: number; nome: string } } = {};
    
    entregas.forEach((entrega) => {
      if (!contadores[entrega.funcionarioId]) {
        contadores[entrega.funcionarioId] = { uniforme: 0, epi: 0, nome: entrega.funcionarioNome };
      }
      contadores[entrega.funcionarioId][entrega.categoria] += entrega.quantidade;
    });
    
    return contadores;
  };

  const contadoresFuncionarios = getContadoresPorFuncionario();

  const handleEntradaEstoque = (dados: { item: string; categoria: "uniforme" | "epi"; tamanhos: { [tamanho: string]: number } }) => {
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
          tamanhos: dados.tamanhos
        }];
      }
    });
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

  const handleFuncionarioClick = (funcionarioId: number, funcionarioNome: string) => {
    setFuncionarioSelecionado({ id: funcionarioId, nome: funcionarioNome });
    setShowDetalhesModal(true);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Shirt size={20} className="text-primary" />
                Total Uniformes
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-primary mb-2">{totalUniformes}</div>
              <p className="text-primary/80">peças em estoque</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Package size={20} className="text-primary" />
                Total EPIs
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-primary mb-2">{totalEPIs}</div>
              <p className="text-primary/80">equipamentos disponíveis</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <TrendingUp size={20} className="text-primary" />
                Entregas Realizadas
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-primary mb-2">{totalEntregas}</div>
              <p className="text-primary/80">entregas registradas</p>
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
          <h2 className="section-title mb-4">Estoque Atual</h2>
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


        {/* Entregas Recentes */}
        <div className="animate-slide-up">
          <h2 className="section-title mb-4">Entregas Recentes</h2>
          <div className="grid grid-cols-1 gap-4">
            {entregas.slice(-5).reverse().map((entrega) => (
              <Card key={entrega.id} className="modern-card">
                <CardContent className="card-content p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getItemIcon(entrega.item)}</span>
                       <div className="flex-1">
                         <div className="flex items-center gap-2">
                           <h3 
                             className="font-semibold text-slate-800 cursor-pointer hover:text-primary transition-colors"
                             onClick={() => handleFuncionarioClick(entrega.funcionarioId, entrega.funcionarioNome)}
                           >
                             {entrega.funcionarioNome}
                           </h3>
                          {contadoresFuncionarios[entrega.funcionarioId] && (
                            <div className="flex items-center gap-1">
                              {contadoresFuncionarios[entrega.funcionarioId].uniforme > 0 && (
                                <Badge 
                                  variant="secondary" 
                                  className="bg-blue-500 text-white hover:bg-blue-600 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                                >
                                  {contadoresFuncionarios[entrega.funcionarioId].uniforme}
                                </Badge>
                              )}
                              {contadoresFuncionarios[entrega.funcionarioId].epi > 0 && (
                                <Badge 
                                  variant="secondary" 
                                  className="bg-green-500 text-white hover:bg-green-600 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                                >
                                  {contadoresFuncionarios[entrega.funcionarioId].epi}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">
                          {entrega.item} - Tamanho {entrega.tamanho} - Qtd: {entrega.quantidade}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600">{entrega.dataEntrega}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entrega.categoria === 'uniforme' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {entrega.categoria === 'uniforme' ? 'Uniforme' : 'EPI'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
    </div>
  );
}