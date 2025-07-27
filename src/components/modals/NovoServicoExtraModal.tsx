import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NovoServicoExtraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServicoAdicionado: () => void;
}

export function NovoServicoExtraModal({ open, onOpenChange, onServicoAdicionado }: NovoServicoExtraModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_pessoa: '',
    local_servico: '',
    data_servico: '',
    quantidade_horas: '',
    motivo_servico: '',
    chave_pix: '',
    fiscal_responsavel: '',
    valor: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_pessoa || !formData.local_servico || !formData.data_servico || 
        !formData.quantidade_horas || !formData.motivo_servico || !formData.chave_pix || 
        !formData.fiscal_responsavel) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('servicos_extras')
        .insert({
          nome_pessoa: formData.nome_pessoa,
          local_servico: formData.local_servico,
          data_servico: formData.data_servico,
          quantidade_horas: parseInt(formData.quantidade_horas),
          motivo_servico: formData.motivo_servico,
          chave_pix: formData.chave_pix,
          fiscal_responsavel: formData.fiscal_responsavel,
          valor: formData.valor ? parseFloat(formData.valor) : null
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Serviço extra registrado com sucesso!"
      });

      // Reset form
      setFormData({
        nome_pessoa: '',
        local_servico: '',
        data_servico: '',
        quantidade_horas: '',
        motivo_servico: '',
        chave_pix: '',
        fiscal_responsavel: '',
        valor: ''
      });

      onServicoAdicionado();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao registrar serviço extra:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar serviço extra",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Serviço Extra</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_pessoa">Nome da Pessoa *</Label>
              <Input
                id="nome_pessoa"
                value={formData.nome_pessoa}
                onChange={(e) => setFormData(prev => ({ ...prev, nome_pessoa: e.target.value }))}
                placeholder="Nome completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="local_servico">Local de Serviço *</Label>
              <Input
                id="local_servico"
                value={formData.local_servico}
                onChange={(e) => setFormData(prev => ({ ...prev, local_servico: e.target.value }))}
                placeholder="Local onde foi realizado o serviço"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_servico">Data do Serviço *</Label>
              <Input
                id="data_servico"
                type="date"
                value={formData.data_servico}
                onChange={(e) => setFormData(prev => ({ ...prev, data_servico: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade_horas">Quantidade de Horas *</Label>
              <Input
                id="quantidade_horas"
                type="number"
                min="1"
                value={formData.quantidade_horas}
                onChange={(e) => setFormData(prev => ({ ...prev, quantidade_horas: e.target.value }))}
                placeholder="Ex: 8"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo_servico">Motivo do Serviço *</Label>
            <Textarea
              id="motivo_servico"
              value={formData.motivo_servico}
              onChange={(e) => setFormData(prev => ({ ...prev, motivo_servico: e.target.value }))}
              placeholder="Descreva o motivo ou necessidade do serviço extra"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chave_pix">Chave PIX *</Label>
              <Input
                id="chave_pix"
                value={formData.chave_pix}
                onChange={(e) => setFormData(prev => ({ ...prev, chave_pix: e.target.value }))}
                placeholder="CPF, telefone, email ou chave aleatória"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscal_responsavel">Fiscal Responsável *</Label>
              <Input
                id="fiscal_responsavel"
                value={formData.fiscal_responsavel}
                onChange={(e) => setFormData(prev => ({ ...prev, fiscal_responsavel: e.target.value }))}
                placeholder="Nome do fiscal responsável"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              value={formData.valor}
              onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
              placeholder="Ex: 150.00"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Serviço Extra"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}