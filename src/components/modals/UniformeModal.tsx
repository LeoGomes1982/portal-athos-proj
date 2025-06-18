
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface UniformeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  setor: string;
  status: "ativo" | "ferias" | "experiencia" | "aviso" | "inativo";
}

// Dados dos funcionários (mesma estrutura da página de funcionários)
const funcionarios: Funcionario[] = [
  {
    id: 1,
    nome: "Ana Silva",
    cargo: "Analista de Sistemas",
    setor: "TI",
    status: "ativo"
  },
  {
    id: 2,
    nome: "João Santos",
    cargo: "Desenvolvedor",
    setor: "TI",
    status: "ferias"
  },
  {
    id: 3,
    nome: "Maria Costa",
    cargo: "Gerente de Vendas",
    setor: "Comercial",
    status: "ativo"
  },
  {
    id: 4,
    nome: "Carlos Oliveira",
    cargo: "Analista Financeiro",
    setor: "Financeiro",
    status: "experiencia"
  },
  {
    id: 5,
    nome: "Patricia Fernandes",
    cargo: "Assistente Administrativo",
    setor: "Administrativo",
    status: "aviso"
  }
];

// Filtrar apenas funcionários ativos
const funcionariosAtivos = funcionarios.filter(funcionario => funcionario.status === "ativo");

const pecasUniforme = [
  { value: "camisa", label: "👔 Camisa", icon: "👔" },
  { value: "camiseta", label: "👕 Camiseta", icon: "👕" },
  { value: "calca", label: "👖 Calça", icon: "👖" },
  { value: "jaqueta", label: "🧥 Jaqueta", icon: "🧥" },
  { value: "sapato", label: "👞 Sapato", icon: "👞" }
];

const tamanhos = ["PP", "P", "M", "G", "GG", "XG", "XXG"];

export function UniformeModal({ isOpen, onClose }: UniformeModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    funcionarioId: "",
    peca: "",
    tamanho: "",
    quantidade: "1",
    dataEntrega: new Date().toISOString().split('T')[0],
    observacoes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.funcionarioId || !formData.peca || !formData.tamanho) {
      toast({
        title: "Erro ❌",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const funcionario = funcionariosAtivos.find(f => f.id.toString() === formData.funcionarioId);
    const peca = pecasUniforme.find(p => p.value === formData.peca);

    toast({
      title: "Entrega Registrada! 🎉",
      description: `${peca?.icon} ${peca?.label.replace(/👔|👕|👖|🧥|👞/, '').trim()} (${formData.tamanho}) entregue para ${funcionario?.nome}`,
    });
    
    // Reset form
    setFormData({
      funcionarioId: "",
      peca: "",
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
            <Label htmlFor="funcionario">Funcionário Ativo *</Label>
            <Select onValueChange={(value) => handleInputChange("funcionarioId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="👤 Selecione o funcionário ativo" />
              </SelectTrigger>
              <SelectContent>
                {funcionariosAtivos.map((funcionario) => (
                  <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                    👤 {funcionario.nome} - {funcionario.cargo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="peca">Peça de Uniforme *</Label>
            <Select onValueChange={(value) => handleInputChange("peca", value)}>
              <SelectTrigger>
                <SelectValue placeholder="👕 Selecione a peça" />
              </SelectTrigger>
              <SelectContent>
                {pecasUniforme.map((peca) => (
                  <SelectItem key={peca.value} value={peca.value}>
                    {peca.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tamanho">Tamanho *</Label>
              <Select onValueChange={(value) => handleInputChange("tamanho", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="📏 Tamanho" />
                </SelectTrigger>
                <SelectContent>
                  {tamanhos.map((tamanho) => (
                    <SelectItem key={tamanho} value={tamanho}>
                      📏 {tamanho}
                    </SelectItem>
                  ))}
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
