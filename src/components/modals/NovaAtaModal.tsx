import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface NovaAtaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ata: any) => void;
}

export function NovaAtaModal({ open, onOpenChange, onSave }: NovaAtaModalProps) {
  const [formData, setFormData] = useState({
    data: new Date().toLocaleDateString('pt-BR'),
    responsavel: "",
    local: "",
    terminal: "",
    descricao: "",
    status: "ativa" as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.responsavel || !formData.local || !formData.terminal || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const novaAta = {
      id: Date.now().toString(),
      ...formData,
      replicas: []
    };

    onSave(novaAta);
    
    // Reset form
    setFormData({
      data: new Date().toLocaleDateString('pt-BR'),
      responsavel: "",
      local: "",
      terminal: "",
      descricao: "",
      status: "ativa"
    });
    
    onOpenChange(false);
    
    toast({
      title: "Sucesso",
      description: "Ata criada com sucesso!",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Ata de Supervisão</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                value={formData.data}
                onChange={(e) => handleInputChange("data", e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="responsavel">Responsável *</Label>
              <Input
                id="responsavel"
                value={formData.responsavel}
                onChange={(e) => handleInputChange("responsavel", e.target.value)}
                placeholder="Nome do responsável"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="local">Local *</Label>
              <Input
                id="local"
                value={formData.local}
                onChange={(e) => handleInputChange("local", e.target.value)}
                placeholder="Ex: São Paulo"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="terminal">Terminal *</Label>
              <Input
                id="terminal"
                value={formData.terminal}
                onChange={(e) => handleInputChange("terminal", e.target.value)}
                placeholder="Ex: Terminal Rodoviário"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="encerrada">Encerrada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              placeholder="Descreva as observações da supervisão..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
              Criar Ata
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}