
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface Cargo {
  id: string;
  nome: string;
  nivel: "I" | "II" | "III";
  salarioBase: string;
  beneficios: string[];
  habilidadesEspecificas: string[];
  habilidadesEsperadas: string[];
  responsabilidades: string[];
  carencia: number;
  status: "ativo" | "inativo";
  criadoEm: string;
}

interface EditarCargoModalProps {
  isOpen: boolean;
  onClose: () => void;
  cargo: Cargo;
  onSave: (cargo: Cargo) => Promise<boolean>;
}

export function EditarCargoModal({ isOpen, onClose, cargo, onSave }: EditarCargoModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    nivel: "" as "I" | "II" | "III",
    salarioBase: "",
    carencia: 0,
    status: "ativo" as "ativo" | "inativo"
  });

  const [beneficios, setBeneficios] = useState<string[]>([]);
  const [novoBeneficio, setNovoBeneficio] = useState("");
  const [habilidadesEspecificas, setHabilidadesEspecificas] = useState<string[]>([]);
  const [novaHabilidadeEspecifica, setNovaHabilidadeEspecifica] = useState("");
  const [habilidadesEsperadas, setHabilidadesEsperadas] = useState<string[]>([]);
  const [novaHabilidadeEsperada, setNovaHabilidadeEsperada] = useState("");
  const [responsabilidades, setResponsabilidades] = useState<string[]>([]);
  const [novaResponsabilidade, setNovaResponsabilidade] = useState("");

  useEffect(() => {
    if (cargo) {
      setFormData({
        nome: cargo.nome,
        nivel: cargo.nivel,
        salarioBase: cargo.salarioBase,
        carencia: cargo.carencia,
        status: cargo.status
      });
      setBeneficios([...cargo.beneficios]);
      setHabilidadesEspecificas([...cargo.habilidadesEspecificas]);
      setHabilidadesEsperadas([...cargo.habilidadesEsperadas]);
      setResponsabilidades([...cargo.responsabilidades]);
    }
  }, [cargo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.nivel || !formData.salarioBase) return;

    const sucesso = await onSave({
      ...cargo,
      nome: formData.nome,
      nivel: formData.nivel,
      salarioBase: formData.salarioBase,
      beneficios,
      habilidadesEspecificas,
      habilidadesEsperadas,
      responsabilidades,
      carencia: formData.carencia,
      status: formData.status
    });

    if (sucesso) {
      onClose();
    }
  };

  const adicionarItem = (
    item: string,
    setItem: React.Dispatch<React.SetStateAction<string>>,
    lista: string[],
    setLista: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (item.trim() && !lista.includes(item.trim())) {
      setLista([...lista, item.trim()]);
      setItem("");
    }
  };

  const removerItem = (
    index: number,
    lista: string[],
    setLista: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setLista(lista.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-800">
            Editar Cargo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Cargo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Analista de Sistemas"
                  required
                />
              </div>

              <div>
                <Label htmlFor="nivel">Nível</Label>
                <Select value={formData.nivel} onValueChange={(value: "I" | "II" | "III") => setFormData({...formData, nivel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="I">Nível I</SelectItem>
                    <SelectItem value="II">Nível II</SelectItem>
                    <SelectItem value="III">Nível III</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="salario">Salário Base</Label>
                <Input
                  id="salario"
                  value={formData.salarioBase}
                  onChange={(e) => setFormData({...formData, salarioBase: e.target.value})}
                  placeholder="Ex: R$ 5.000,00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="carencia">Carência (meses)</Label>
                <Input
                  id="carencia"
                  type="number"
                  value={formData.carencia}
                  onChange={(e) => setFormData({...formData, carencia: parseInt(e.target.value) || 0})}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: "ativo" | "inativo") => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Detalhes */}
            <div className="space-y-4">
              {/* Benefícios */}
              <div>
                <Label>Benefícios</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={novoBeneficio}
                    onChange={(e) => setNovoBeneficio(e.target.value)}
                    placeholder="Adicionar benefício"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarItem(novoBeneficio, setNovoBeneficio, beneficios, setBeneficios))}
                  />
                  <Button
                    type="button"
                    onClick={() => adicionarItem(novoBeneficio, setNovoBeneficio, beneficios, setBeneficios)}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {beneficios.map((beneficio, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {beneficio}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removerItem(index, beneficios, setBeneficios)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Habilidades Específicas */}
              <div>
                <Label>Habilidades Específicas</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={novaHabilidadeEspecifica}
                    onChange={(e) => setNovaHabilidadeEspecifica(e.target.value)}
                    placeholder="Adicionar habilidade específica"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarItem(novaHabilidadeEspecifica, setNovaHabilidadeEspecifica, habilidadesEspecificas, setHabilidadesEspecificas))}
                  />
                  <Button
                    type="button"
                    onClick={() => adicionarItem(novaHabilidadeEspecifica, setNovaHabilidadeEspecifica, habilidadesEspecificas, setHabilidadesEspecificas)}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {habilidadesEspecificas.map((habilidade, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {habilidade}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removerItem(index, habilidadesEspecificas, setHabilidadesEspecificas)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Habilidades Esperadas */}
              <div>
                <Label>Habilidades Esperadas</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={novaHabilidadeEsperada}
                    onChange={(e) => setNovaHabilidadeEsperada(e.target.value)}
                    placeholder="Adicionar habilidade esperada"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarItem(novaHabilidadeEsperada, setNovaHabilidadeEsperada, habilidadesEsperadas, setHabilidadesEsperadas))}
                  />
                  <Button
                    type="button"
                    onClick={() => adicionarItem(novaHabilidadeEsperada, setNovaHabilidadeEsperada, habilidadesEsperadas, setHabilidadesEsperadas)}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {habilidadesEsperadas.map((habilidade, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {habilidade}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removerItem(index, habilidadesEsperadas, setHabilidadesEsperadas)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Responsabilidades */}
          <div>
            <Label>Responsabilidades</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={novaResponsabilidade}
                onChange={(e) => setNovaResponsabilidade(e.target.value)}
                placeholder="Adicionar responsabilidade"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarItem(novaResponsabilidade, setNovaResponsabilidade, responsabilidades, setResponsabilidades))}
              />
              <Button
                type="button"
                onClick={() => adicionarItem(novaResponsabilidade, setNovaResponsabilidade, responsabilidades, setResponsabilidades)}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {responsabilidades.map((responsabilidade, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {responsabilidade}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removerItem(index, responsabilidades, setResponsabilidades)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
