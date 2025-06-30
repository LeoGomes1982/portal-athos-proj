
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NovaVagaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dados: {
    titulo: string;
    departamento: string;
    descricao: string;
    requisitos: string;
    salario: string;
    status: "ativa" | "pausada" | "encerrada";
  }) => void;
}

export function NovaVagaModal({ isOpen, onClose, onSubmit }: NovaVagaModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    titulo: "",
    departamento: "",
    descricao: "",
    requisitos: "",
    salario: "",
    status: "ativa" as "ativa" | "pausada" | "encerrada"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.departamento || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
    setFormData({
      titulo: "",
      departamento: "",
      descricao: "",
      requisitos: "",
      salario: "",
      status: "ativa"
    });
    
    toast({
      title: "Vaga criada!",
      description: "A vaga foi publicada com sucesso e está disponível no portal.",
    });
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Briefcase size={24} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="modal-title">Nova Vaga</h2>
                <p className="text-description">Publique uma nova oportunidade</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="secondary-btn p-2 h-auto"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="titulo">Título da Vaga *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                placeholder="Ex: Desenvolvedor Frontend"
                required
              />
            </div>

            <div>
              <Label htmlFor="departamento">Departamento *</Label>
              <Input
                id="departamento"
                value={formData.departamento}
                onChange={(e) => handleChange("departamento", e.target.value)}
                placeholder="Ex: Tecnologia"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição da Vaga *</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              placeholder="Descreva as principais responsabilidades e atividades..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="requisitos">Requisitos</Label>
            <Textarea
              id="requisitos"
              value={formData.requisitos}
              onChange={(e) => handleChange("requisitos", e.target.value)}
              placeholder="Liste os requisitos técnicos e experiências necessárias..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="salario">Faixa Salarial</Label>
              <Input
                id="salario"
                value={formData.salario}
                onChange={(e) => handleChange("salario", e.target.value)}
                placeholder="Ex: R$ 3.000 - R$ 5.000"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                  <SelectItem value="encerrada">Encerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="primary-btn">
              Publicar Vaga
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
