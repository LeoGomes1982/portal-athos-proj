import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { funcionariosIniciais } from "@/data/funcionarios";

interface UniformeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (dados: { funcionarioId: number; funcionarioNome: string; item: string; categoria: "uniforme" | "epi"; tamanho: string; quantidade: number }) => void;
  estoque?: Array<{ id: string; nome: string; categoria: "uniforme" | "epi"; quantidade: number; tamanhos: { [tamanho: string]: number } }>;
}

// Filtrar funcionários ativos, em férias e em experiência
const funcionariosDisponiveis = funcionariosIniciais.filter(funcionario => 
  funcionario.status === "ativo" || funcionario.status === "ferias" || funcionario.status === "experiencia"
);

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

export function UniformeModal({ isOpen, onClose, onSubmit, estoque = [] }: UniformeModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    funcionarioId: "",
    item: "",
    categoria: "" as "uniforme" | "epi" | "",
    tamanho: "",
    quantidade: "1",
    dataEntrega: new Date().toISOString().split('T')[0],
    observacoes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (itemNome: string) => {
    const item = todosItens.find(i => i.value === itemNome);
    setFormData(prev => ({
      ...prev,
      item: itemNome,
      categoria: item?.categoria || "",
      tamanho: "" // Reset tamanho quando item muda
    }));
  };

  const getItemEstoque = () => {
    return estoque.find(item => item.nome === formData.item);
  };

  const getTamanhosDisponiveis = () => {
    const itemEstoque = getItemEstoque();
    if (!itemEstoque) return [];
    
    return Object.entries(itemEstoque.tamanhos)
      .filter(([_, quantidade]) => quantidade > 0)
      .map(([tamanho, quantidade]) => ({ tamanho, quantidade }));
  };

  const handleSubmit = () => {
    if (!formData.funcionarioId || !formData.item || !formData.tamanho) {
      toast({
        title: "Erro ❌",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const funcionario = funcionariosDisponiveis.find(f => f.id.toString() === formData.funcionarioId);
    const item = todosItens.find(i => i.value === formData.item);
    const itemEstoque = getItemEstoque();
    const quantidadeDisponivel = itemEstoque?.tamanhos[formData.tamanho] || 0;
    const quantidadeSolicitada = parseInt(formData.quantidade);

    if (quantidadeSolicitada > quantidadeDisponivel) {
      toast({
        title: "Erro ❌",
        description: `Quantidade insuficiente em estoque. Disponível: ${quantidadeDisponivel}`,
        variant: "destructive"
      });
      return;
    }

    if (onSubmit && funcionario && item && (formData.categoria === "uniforme" || formData.categoria === "epi")) {
      onSubmit({
        funcionarioId: funcionario.id,
        funcionarioNome: funcionario.nome,
        item: formData.item,
        categoria: formData.categoria,
        tamanho: formData.tamanho,
        quantidade: quantidadeSolicitada
      });
    }

    toast({
      title: "Entrega Registrada! 🎉",
      description: `${item?.label} (${formData.tamanho}) entregue para ${funcionario?.nome}`,
    });
    
    // Reset form
    setFormData({
      funcionarioId: "",
      item: "",
      categoria: "",
      tamanho: "",
      quantidade: "1",
      dataEntrega: new Date().toISOString().split('T')[0],
      observacoes: ""
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            👕 Nova Entrega de Uniforme
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="funcionario">Funcionário Disponível *</Label>
            <Select value={formData.funcionarioId} onValueChange={(value) => handleInputChange("funcionarioId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="👤 Selecione o funcionário" />
              </SelectTrigger>
              <SelectContent>
                {funcionariosDisponiveis.map((funcionario) => (
                  <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                    👤 {funcionario.nome} - {funcionario.cargo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="item">Item *</Label>
            <Select value={formData.item} onValueChange={handleItemChange}>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tamanho">Tamanho *</Label>
              <Select value={formData.tamanho} onValueChange={(value) => handleInputChange("tamanho", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="📏 Tamanho" />
                </SelectTrigger>
                <SelectContent>
                  {getTamanhosDisponiveis().map(({ tamanho, quantidade }) => (
                    <SelectItem key={tamanho} value={tamanho}>
                      📏 {tamanho} (disponível: {quantidade})
                    </SelectItem>
                  ))}
                  {getTamanhosDisponiveis().length === 0 && formData.item && (
                    <div className="px-2 py-1 text-sm text-red-600">Nenhum tamanho disponível</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={formData.quantidade}
                onChange={(e) => handleInputChange("quantidade", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="dataEntrega">Data de Entrega</Label>
            <Input
              id="dataEntrega"
              type="date"
              value={formData.dataEntrega}
              onChange={(e) => handleInputChange("dataEntrega", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Input
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange("observacoes", e.target.value)}
              placeholder="Observações opcionais..."
            />
          </div>
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
