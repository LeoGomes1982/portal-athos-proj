import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shirt, Package, Settings, TrendingUp, Users, User } from "lucide-react";
import { GerenciarUniformesModal } from "@/components/modals/GerenciarUniformesModal";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { adicionarRegistroHistorico } from "@/utils/historicoUtils";

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
  clienteId: string;
  clienteNome: string;
  itens: Array<{
    item: string;
    categoria: "uniforme" | "epi";
    tamanho: string;
    quantidade: number;
    valorUnitario: number;
  }>;
  valorTotal: number;
  dataEntrega: string;
}

export function UniformesSubsection({ onBack }: UniformesSubsectionProps) {
  const [showGerenciarModal, setShowGerenciarModal] = useState(false);
  
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);

  const [entregas, setEntregas] = useState<EntregaRegistro[]>([]);

  const totalUniformes = estoque.filter(item => item.categoria === "uniforme").reduce((sum, item) => sum + item.quantidade, 0);
  const totalEPIs = estoque.filter(item => item.categoria === "epi").reduce((sum, item) => sum + item.quantidade, 0);
  const totalEntregas = entregas.length;
  const valorTotalEstoque = estoque.reduce((sum, item) => sum + (item.valorCompra || 0), 0);

  // Função para contar total de registros por cliente
  const getContadoresPorCliente = () => {
    const contadores: { [clienteId: string]: { total: number; nome: string; ultimaEntrega: EntregaRegistro; valorTotal: number } } = {};
    
    entregas.forEach((entrega) => {
      if (!contadores[entrega.clienteId]) {
        contadores[entrega.clienteId] = { total: 0, nome: entrega.clienteNome, ultimaEntrega: entrega, valorTotal: 0 };
      }
      contadores[entrega.clienteId].total += 1;
      contadores[entrega.clienteId].valorTotal += entrega.valorTotal;
      
      // Atualizar última entrega se for mais recente
      if (new Date(entrega.dataEntrega) > new Date(contadores[entrega.clienteId].ultimaEntrega.dataEntrega)) {
        contadores[entrega.clienteId].ultimaEntrega = entrega;
      }
    });
    
    return contadores;
  };

  const contadoresClientes = getContadoresPorCliente();

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

  const handleEntregaUniforme = (dados: { 
    clienteId: string; 
    clienteNome: string; 
    itens: Array<{
      item: string; 
      categoria: "uniforme" | "epi"; 
      tamanho: string; 
      quantidade: number;
      valorUnitario: number;
    }>;
    valorTotal: number;
    dataEntrega: string;
  }) => {
    // Registrar entrega
    const novaEntrega: EntregaRegistro = {
      id: Date.now().toString(),
      clienteId: dados.clienteId,
      clienteNome: dados.clienteNome,
      itens: dados.itens,
      valorTotal: dados.valorTotal,
      dataEntrega: dados.dataEntrega
    };
    setEntregas(prev => [novaEntrega, ...prev]);

    // Atualizar estoque para cada item
    dados.itens.forEach(itemEntrega => {
      setEstoque(prev => prev.map(item => {
        if (item.nome === itemEntrega.item) {
          const novosTamanhos = { ...item.tamanhos };
          novosTamanhos[itemEntrega.tamanho] = Math.max(0, (novosTamanhos[itemEntrega.tamanho] || 0) - itemEntrega.quantidade);
          const novaQuantidade = Object.values(novosTamanhos).reduce((sum, qty) => sum + qty, 0);
          return { ...item, tamanhos: novosTamanhos, quantidade: novaQuantidade };
        }
        return item;
      }));
    });

    // Adicionar registro no histórico do cliente
    const totalItens = dados.itens.reduce((sum, item) => sum + item.quantidade, 0);
    const listaItens = dados.itens.map(item => `${item.quantidade}x ${item.item} (${item.tamanho})`).join(', ');
    
    adicionarRegistroHistorico(
      dados.clienteId,
      'Entrega de Uniformes e EPIs',
      `Entrega realizada: ${listaItens}. Valor total: R$ ${dados.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Data da entrega: ${new Date(dados.dataEntrega).toLocaleDateString('pt-BR')}.`,
      'positivo',
      'Sistema - Uniformes'
    );
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

  const handleClienteClick = (clienteId: string) => {
    // Implementar se necessário - abrir detalhes do cliente
    console.log('Cliente clicado:', clienteId);
  };

  const handleStatusChange = (clienteId: string, novoStatus: string, dataFim?: string) => {
    // Implementar mudança de status se necessário
    console.log('Status change:', clienteId, novoStatus, dataFim);
  };

  const handleClienteUpdate = (cliente: any) => {
    // Implementar atualização do cliente se necessário
    console.log('Cliente update:', cliente);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="content-wrapper animate-fade-in bg-purple-100/80 rounded-lg shadow-lg p-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={onBack}>
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Shirt size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">Uniformes e EPIs</h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Controle de estoque e entrega de uniformes e equipamentos de proteção individual
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">👔</div>
              <div className="text-2xl font-bold text-gray-700">
                {totalUniformes}
              </div>
              <div className="text-sm text-gray-600 mb-1">Total Uniformes</div>
              <div className="text-xs text-gray-500 font-medium">
                Valor: R$ {estoque.filter(item => item.categoria === "uniforme").reduce((sum, item) => sum + (item.valorCompra || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">🛡️</div>
              <div className="text-2xl font-bold text-gray-700">
                {totalEPIs}
              </div>
              <div className="text-sm text-gray-600 mb-1">Total EPIs</div>
              <div className="text-xs text-gray-500 font-medium">
                Valor: R$ {estoque.filter(item => item.categoria === "epi").reduce((sum, item) => sum + (item.valorCompra || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-2xl font-bold text-gray-700">
                {totalEntregas}
              </div>
              <div className="text-sm text-gray-600">Entregas Realizadas</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-gray-700">
                R$ {totalValorCompras.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-gray-600">Valor das Compras</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl shadow-lg text-lg font-medium transition-all duration-300 flex items-center gap-2"
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
                        <div className="text-lg font-bold text-purple-600 mb-2">
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

    </div>
  );
}