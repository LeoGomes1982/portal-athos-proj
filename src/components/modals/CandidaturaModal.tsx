
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CandidaturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaga: {
    id: string;
    titulo: string;
    departamento: string;
    cidade: string;
  };
  onSubmit: (dados: {
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
    curriculo: File | null;
    sobreMim: string;
    experiencias: string;
    vagaId: string;
  }) => void;
}

export function CandidaturaModal({ isOpen, onClose, vaga, onSubmit }: CandidaturaModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    curriculo: null as File | null,
    sobreMim: "",
    experiencias: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.endereco || !formData.telefone) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      ...formData,
      vagaId: vaga.id
    });
    
    setFormData({
      nome: "",
      endereco: "",
      telefone: "",
      email: "",
      curriculo: null,
      sobreMim: "",
      experiencias: ""
    });
    
    toast({
      title: "Candidatura enviada!",
      description: "Sua candidatura foi enviada com sucesso.",
    });
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, curriculo: file }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <User size={24} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="modal-title">Candidatar-se</h2>
                <p className="text-description">{vaga.titulo} - {vaga.departamento}</p>
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
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="endereco">Endereço *</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleChange("endereco", e.target.value)}
              placeholder="Rua, número, bairro, cidade"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <Label htmlFor="curriculo">Currículo (PDF, Word ou Imagem)</Label>
            <Input
              id="curriculo"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <Label htmlFor="sobreMim">Sobre Mim</Label>
            <Textarea
              id="sobreMim"
              value={formData.sobreMim}
              onChange={(e) => handleChange("sobreMim", e.target.value)}
              placeholder="Conte um pouco sobre você..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="experiencias">Experiências</Label>
            <Textarea
              id="experiencias"
              value={formData.experiencias}
              onChange={(e) => handleChange("experiencias", e.target.value)}
              placeholder="Descreva suas experiências profissionais..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="primary-btn">
              Enviar Candidatura
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
