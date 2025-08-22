import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ReplicaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (replica: { autor: string; conteudo: string; tipo: 'replica' | 'treplica' }) => void;
  tipo: 'replica' | 'treplica';
}

export function ReplicaModal({ open, onOpenChange, onSave, tipo }: ReplicaModalProps) {
  const [formData, setFormData] = useState({
    autor: "",
    conteudo: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.autor || !formData.conteudo) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    onSave({
      autor: formData.autor,
      conteudo: formData.conteudo,
      tipo
    });
    
    setFormData({
      autor: "",
      conteudo: ""
    });
    
    onOpenChange(false);
    
    toast({
      title: "Sucesso",
      description: `${tipo === 'replica' ? 'Réplica' : 'Tréplica'} adicionada com sucesso!`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {tipo === 'replica' ? 'Nova Réplica' : 'Nova Tréplica'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="autor">Autor *</Label>
            <Input
              id="autor"
              value={formData.autor}
              onChange={(e) => setFormData(prev => ({ ...prev, autor: e.target.value }))}
              placeholder="Nome do autor"
              required
            />
          </div>

          <div>
            <Label htmlFor="conteudo">Conteúdo *</Label>
            <Textarea
              id="conteudo"
              value={formData.conteudo}
              onChange={(e) => setFormData(prev => ({ ...prev, conteudo: e.target.value }))}
              placeholder={`Digite o conteúdo da ${tipo}...`}
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              Adicionar {tipo === 'replica' ? 'Réplica' : 'Tréplica'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}