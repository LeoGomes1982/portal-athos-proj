import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NovaEntregaUniformeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dados: { 
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
  }) => void;
  estoque: Array<{ id: string; nome: string; categoria: "uniforme" | "epi"; quantidade: number; tamanhos: { [tamanho: string]: number }; valorCompra?: number }>;
}

interface ClienteFornecedor {
  id: string;
  nome: string;
  tipo: "cliente" | "fornecedor";
  email: string;
  telefone: string;
  telefoneSecundario?: string;
  endereco: string;
  cnpj: string;
  representante: string;
  observacoes: string;
}

interface ItemEntrega {
  item: string;
  categoria: "uniforme" | "epi";
  tamanho: string;
  quantidade: number;
  valorUnitario: number;
}

const itensUniformes = [
  { value: "Camisa", label: "👔 Camisa", categoria: "uniforme" as const },
  { value: "Camiseta", label: "👕 Camiseta", categoria: "uniforme" as const },
  { value: "Calça", label: "👖 Calça", categoria: "uniforme" as const },
  { value: "Jaqueta", label: "🧥 Jaqueta", categoria: "uniforme" as const },
  { value: "Sapato", label: "👞 Sapato", categoria: "uniforme" as const }
];

const itensEPIs = [
  { value: "Fone de ouvido", label: "🎧 Fone de ouvido", categoria: "epi" as const },
  { value: "Luvas", label: "🧤 Luvas", categoria: "epi" as const },
  { value: "Botina", label: "🥾 Botina", categoria: "epi" as const }
];

const todosItens = [...itensUniformes, ...itensEPIs];

export function NovaEntregaUniformeModal({ isOpen, onClose, onSubmit, estoque }: NovaEntregaUniformeModalProps) {
  const { toast } = useToast();
  const [clientesAtivos, setClientesAtivos] = useState<ClienteFornecedor[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [itensEntrega, setItensEntrega] = useState<ItemEntrega[]>([]);
  const [dataEntrega, setDataEntrega] = useState(new Date().toISOString().split('T')[0]);

  // Carregar clientes ativos
  useEffect(() => {
    const savedClients = localStorage.getItem('clientesFornecedores');
    if (savedClients) {
      const allClients: ClienteFornecedor[] = JSON.parse(savedClients);
      const clientesAtivos = allClients.filter(client => client.tipo === 'cliente');
      setClientesAtivos(clientesAtivos);
    }
  }, [isOpen]);

  const adicionarItem = () => {
    setItensEntrega(prev => [...prev, {
      item: "",
      categoria: "uniforme",
      tamanho: "",
      quantidade: 1,
      valorUnitario: 0
    }]);
  };

  const removerItem = (index: number) => {
    setItensEntrega(prev => prev.filter((_, i) => i !== index));
  };

  const atualizarItem = (index: number, campo: keyof ItemEntrega, valor: any) => {
    setItensEntrega(prev => prev.map((item, i) => {
      if (i === index) {
        const itemAtualizado = { ...item, [campo]: valor };
        
        // Se mudou o item, resetar tamanho e atualizar categoria
        if (campo === 'item') {
          const itemInfo = todosItens.find(ti => ti.value === valor);
          itemAtualizado.categoria = itemInfo?.categoria || "uniforme";
          itemAtualizado.tamanho = "";
          
          // Definir valor unitário baseado no estoque
          const itemEstoque = estoque.find(e => e.nome === valor);
          if (itemEstoque && itemEstoque.valorCompra) {
            itemAtualizado.valorUnitario = itemEstoque.valorCompra / itemEstoque.quantidade;
          }
        }
        
        return itemAtualizado;
      }
      return item;
    }));
  };

  const getTamanhosDisponiveis = (nomeItem: string) => {
    const itemEstoque = estoque.find(item => item.nome === nomeItem);
    if (!itemEstoque) return [];
    
    return Object.entries(itemEstoque.tamanhos)
      .filter(([_, quantidade]) => quantidade > 0)
      .map(([tamanho, quantidade]) => ({ tamanho, quantidade }));
  };

  const calcularValorTotal = () => {
    return itensEntrega.reduce((total, item) => total + (item.quantidade * item.valorUnitario), 0);
  };

  const validarFormulario = () => {
    if (!clienteSelecionado) {
      toast({
        title: "Erro ❌",
        description: "Selecione um cliente",
        variant: "destructive"
      });
      return false;
    }

    if (itensEntrega.length === 0) {
      toast({
        title: "Erro ❌",
        description: "Adicione pelo menos um item",
        variant: "destructive"
      });
      return false;
    }

    for (let i = 0; i < itensEntrega.length; i++) {
      const item = itensEntrega[i];
      if (!item.item || !item.tamanho || item.quantidade <= 0) {
        toast({
          title: "Erro ❌",
          description: `Preencha todos os campos do item ${i + 1}`,
          variant: "destructive"
        });
        return false;
      }

      // Verificar estoque
      const itemEstoque = estoque.find(e => e.nome === item.item);
      const quantidadeDisponivel = itemEstoque?.tamanhos[item.tamanho] || 0;
      
      if (item.quantidade > quantidadeDisponivel) {
        toast({
          title: "Erro ❌",
          description: `Quantidade insuficiente para ${item.item} (${item.tamanho}). Disponível: ${quantidadeDisponivel}`,
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validarFormulario()) return;

    const cliente = clientesAtivos.find(c => c.id === clienteSelecionado);
    if (!cliente) return;

    onSubmit({
      clienteId: cliente.id,
      clienteNome: cliente.nome,
      itens: itensEntrega,
      valorTotal: calcularValorTotal(),
      dataEntrega
    });

    toast({
      title: "Entrega Registrada! 🎉",
      description: `Entrega para ${cliente.nome} registrada com sucesso`,
    });

    // Reset form
    setClienteSelecionado("");
    setItensEntrega([]);
    setDataEntrega(new Date().toISOString().split('T')[0]);
    onClose();
  };

  const valorTotal = calcularValorTotal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            👕 Nova Entrega de Uniformes e EPIs
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cliente */}
          <div>
            <Label htmlFor="cliente">Cliente *</Label>
            <Select value={clienteSelecionado} onValueChange={setClienteSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="👤 Selecione um cliente" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {clientesAtivos.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    👤 {cliente.nome} - {cliente.representante}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data de Entrega */}
          <div>
            <Label htmlFor="dataEntrega">Data de Entrega</Label>
            <Input
              id="dataEntrega"
              type="date"
              value={dataEntrega}
              onChange={(e) => setDataEntrega(e.target.value)}
            />
          </div>

          {/* Itens */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-lg font-medium">Itens para Entrega</Label>
              <Button onClick={adicionarItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus size={16} className="mr-1" />
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-4">
              {itensEntrega.map((item, index) => (
                <Card key={index} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-slate-700">Item {index + 1}</h4>
                      <Button
                        onClick={() => removerItem(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Item */}
                      <div>
                        <Label>Item *</Label>
                        <Select value={item.item} onValueChange={(value) => atualizarItem(index, 'item', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            <div className="px-2 py-1 text-sm font-medium text-slate-600">Uniformes</div>
                            {itensUniformes.map((uniforme) => (
                              <SelectItem key={uniforme.value} value={uniforme.value}>
                                {uniforme.label}
                              </SelectItem>
                            ))}
                            <div className="px-2 py-1 text-sm font-medium text-slate-600 mt-2">EPIs</div>
                            {itensEPIs.map((epi) => (
                              <SelectItem key={epi.value} value={epi.value}>
                                {epi.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Tamanho */}
                      <div>
                        <Label>Tamanho *</Label>
                        <Select 
                          value={item.tamanho} 
                          onValueChange={(value) => atualizarItem(index, 'tamanho', value)}
                          disabled={!item.item}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tamanho" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            {getTamanhosDisponiveis(item.item).map(({ tamanho, quantidade }) => (
                              <SelectItem key={tamanho} value={tamanho}>
                                📏 {tamanho} (disponível: {quantidade})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quantidade */}
                      <div>
                        <Label>Quantidade *</Label>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => atualizarItem(index, 'quantidade', Math.max(1, item.quantidade - 1))}
                          >
                            <Minus size={14} />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantidade}
                            onChange={(e) => atualizarItem(index, 'quantidade', parseInt(e.target.value) || 1)}
                            className="text-center w-20"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => atualizarItem(index, 'quantidade', item.quantidade + 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>

                      {/* Valor Unitário */}
                      <div>
                        <Label>Valor Unitário (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.valorUnitario}
                          onChange={(e) => atualizarItem(index, 'valorUnitario', parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="mt-3 text-right">
                      <span className="text-sm text-slate-600">
                        Subtotal: <strong>R$ {(item.quantidade * item.valorUnitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {itensEntrega.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
                  <p className="text-slate-500">Nenhum item adicionado. Clique em "Adicionar Item" para começar.</p>
                </div>
              )}
            </div>
          </div>

          {/* Valor Total */}
          {valorTotal > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-slate-700">Valor Total da Entrega:</span>
                <span className="text-2xl font-bold text-blue-600">
                  R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Total de {itensEntrega.reduce((sum, item) => sum + item.quantidade, 0)} peças
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            ❌ Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            ✅ Registrar Entrega
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}