import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus } from "lucide-react";

interface EntradaUniformeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dados: { item: string; categoria: "uniforme" | "epi"; tamanhos: { [tamanho: string]: number } }) => void;
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

const tamanhos = ["PP", "P", "M", "G", "GG", "XG", "XXG", "36", "38", "40", "42", "44", "46", "Único"];

export function EntradaUniformeModal({ isOpen, onClose, onSubmit }: EntradaUniformeModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    item: "",
    categoria: "" as "uniforme" | "epi" | "",
    tamanhos: {} as { [tamanho: string]: number }
  });

  const handleItemChange = (itemNome: string) => {
    const item = todosItens.find(i => i.value === itemNome);
    setFormData(prev => ({
      ...prev,
      item: itemNome,
      categoria: item?.categoria || "",
      tamanhos: {}
    }));
  };

  const handleTamanhoChange = (tamanho: string, quantidade: number) => {
    setFormData(prev => ({
      ...prev,
      tamanhos: {
        ...prev.tamanhos,
        [tamanho]: Math.max(0, quantidade)
      }
    }));
  };

  const adicionarTamanho = (tamanho: string) => {
    if (!formData.tamanhos[tamanho]) {
      handleTamanhoChange(tamanho, 1);
    }
  };

  const removerTamanho = (tamanho: string) => {
    const novosTamanhos = { ...formData.tamanhos };
    delete novosTamanhos[tamanho];
    setFormData(prev => ({ ...prev, tamanhos: novosTamanhos }));
  };

  const handleSubmit = () => {
    if (!formData.item || !formData.categoria) {
      toast({
        title: "Erro ❌",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const totalQuantidade = Object.values(formData.tamanhos).reduce((sum, qty) => sum + qty, 0);
    if (totalQuantidade === 0) {
      toast({
        title: "Erro ❌",
        description: "Adicione pelo menos um tamanho com quantidade",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      item: formData.item,
      categoria: formData.categoria,
      tamanhos: formData.tamanhos
    });

    toast({
      title: "Entrada Registrada! 🎉",
      description: `${totalQuantidade} peças de ${formData.item} adicionadas ao estoque`,
    });
    
    // Reset form
    setFormData({
      item: "",
      categoria: "",
      tamanhos: {}
    });
    
    onClose();
  };

  const totalPecas = Object.values(formData.tamanhos).reduce((sum, qty) => sum + qty, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            📦 Entrada de Uniformes e EPIs
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="item">Item *</Label>
            <Select onValueChange={handleItemChange}>
              <SelectTrigger>
                <SelectValue placeholder="📦 Selecione o item" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-sm font-medium text-slate-600">Uniformes</div>
                {itensUniformes.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-sm font-medium text-slate-600 mt-2">EPIs</div>
                {itensEPIs.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.item && (
            <div>
              <Label>Tamanhos e Quantidades *</Label>
              <div className="space-y-3 mt-2">
                {/* Tamanhos já adicionados */}
                {Object.entries(formData.tamanhos).map(([tamanho, quantidade]) => (
                  <div key={tamanho} className="flex items-center gap-2 p-2 border rounded">
                    <span className="min-w-[60px] font-medium">{tamanho}:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTamanhoChange(tamanho, quantidade - 1)}
                      disabled={quantidade <= 1}
                    >
                      <Minus size={14} />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantidade}
                      onChange={(e) => handleTamanhoChange(tamanho, parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTamanhoChange(tamanho, quantidade + 1)}
                    >
                      <Plus size={14} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removerTamanho(tamanho)}
                    >
                      ❌
                    </Button>
                  </div>
                ))}

                {/* Adicionar novo tamanho */}
                <div>
                  <Label className="text-sm">Adicionar tamanho:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tamanhos.filter(t => !formData.tamanhos[t]).map((tamanho) => (
                      <Button
                        key={tamanho}
                        variant="outline"
                        size="sm"
                        onClick={() => adicionarTamanho(tamanho)}
                        className="text-xs"
                      >
                        + {tamanho}
                      </Button>
                    ))}
                  </div>
                </div>

                {totalPecas > 0 && (
                  <div className="bg-primary/10 p-3 rounded border border-primary/20">
                    <p className="text-primary font-medium">
                      Total: {totalPecas} peças de {formData.item}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            ❌ Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            ✅ Registrar Entrada
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}